<?php
session_start();
require_once 'Conexion.php';

header('Content-Type: application/json');

// Verificar si el usuario está logueado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
    exit();
}

$user_id = $_SESSION['user_id'];
$action = $_POST['action'] ?? $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'get_notificaciones':
            getNotificaciones($user_id);
            break;
        case 'marcar_leida':
            marcarNotificacionLeida($user_id);
            break;
        case 'marcar_completada':
            marcarNotificacionCompletada($user_id);
            break;
        case 'enviar_mensaje':
            enviarMensajeFamiliar($user_id);
            break;
        case 'get_mensajes':
            getMensajesFamiliares($user_id);
            break;
        case 'configuracion':
            getConfiguracionNotificaciones($user_id);
            break;
        case 'actualizar_configuracion':
            actualizarConfiguracionNotificaciones($user_id);
            break;
        case 'crear_recordatorio_medicamento':
            crearRecordatorioMedicamento($user_id);
            break;
        case 'procesar_recordatorios':
            procesarRecordatoriosMedicamentos();
            break;
        case 'crear':
            crearNotificacion($user_id);
            break;
        default:
            echo json_encode(['success' => false, 'message' => 'Acción no válida']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

function getNotificaciones($user_id) {
    global $conexion;
    
    $sql = "SELECT n.*, 
            CASE 
                WHEN n.tipo = 'medicamento' THEN CONCAT('Es hora de tomar ', JSON_UNQUOTE(JSON_EXTRACT(n.datos_adicionales, '$.medicamento')), ' - ', JSON_UNQUOTE(JSON_EXTRACT(n.datos_adicionales, '$.dosis')))
                WHEN n.tipo = 'cita' THEN CONCAT('Tienes cita en 30 min con ', JSON_UNQUOTE(JSON_EXTRACT(n.datos_adicionales, '$.medico')))
                WHEN n.tipo = 'mensaje_familiar' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(n.datos_adicionales, '$.remitente')), ' te envió un mensaje')
                WHEN n.tipo = 'recordatorio' THEN n.mensaje
                ELSE n.mensaje
            END as mensaje_formateado
            FROM notificaciones n 
            WHERE n.usuario_id = ? 
            ORDER BY n.fecha_creacion DESC 
            LIMIT 50";
    
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $notificaciones = [];
    while ($row = $result->fetch_assoc()) {
        $notificaciones[] = [
            'id' => $row['id'],
            'tipo' => $row['tipo'],
            'titulo' => $row['titulo'],
            'mensaje' => $row['mensaje_formateado'],
            'fecha_creacion' => $row['fecha_creacion'],
            'estado' => $row['estado'],
            'prioridad' => $row['prioridad'],
            'datos_adicionales' => json_decode($row['datos_adicionales'], true)
        ];
    }
    
    echo json_encode(['success' => true, 'notificaciones' => $notificaciones]);
}

function marcarNotificacionLeida($user_id) {
    global $conexion;
    
    $notificacion_id = $_POST['notificacion_id'] ?? 0;
    
    if (!$notificacion_id) {
        echo json_encode(['success' => false, 'message' => 'ID de notificación requerido']);
        return;
    }
    
    $sql = "UPDATE notificaciones SET estado = 'leida' WHERE id = ? AND usuario_id = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('ii', $notificacion_id, $user_id);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Notificación marcada como leída']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar notificación']);
    }
}

function marcarNotificacionCompletada($user_id) {
    global $conexion;
    
    $notificacion_id = $_POST['notificacion_id'] ?? 0;
    $respuesta = $_POST['respuesta'] ?? 'completada';
    
    if (!$notificacion_id) {
        echo json_encode(['success' => false, 'message' => 'ID de notificación requerido']);
        return;
    }
    
    // Actualizar estado de la notificación
    $sql = "UPDATE notificaciones SET estado = 'completada' WHERE id = ? AND usuario_id = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('ii', $notificacion_id, $user_id);
    $stmt->execute();
    
    // Registrar en historial
    $sql_historial = "INSERT INTO historial_notificaciones (notificacion_id, usuario_id, respuesta_usuario) VALUES (?, ?, ?)";
    $stmt_historial = $conexion->prepare($sql_historial);
    $stmt_historial->bind_param('iis', $notificacion_id, $user_id, $respuesta);
    $stmt_historial->execute();
    
    echo json_encode(['success' => true, 'message' => 'Notificación completada']);
}

function enviarMensajeFamiliar($user_id) {
    global $conexion;
    
    $destinatario_id = $_POST['destinatario_id'] ?? 0;
    $mensaje = $_POST['mensaje'] ?? '';
    $tipo = $_POST['tipo'] ?? 'texto';
    
    if (!$destinatario_id || !$mensaje) {
        echo json_encode(['success' => false, 'message' => 'Destinatario y mensaje requeridos']);
        return;
    }
    
    // Verificar que el destinatario existe y es familiar
    $sql_verificar = "SELECT id, nombre FROM usuarios WHERE id = ? AND tipo_usuario = 'familiar'";
    $stmt_verificar = $conexion->prepare($sql_verificar);
    $stmt_verificar->bind_param('i', $destinatario_id);
    $stmt_verificar->execute();
    $result = $stmt_verificar->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Destinatario no válido']);
        return;
    }
    
    $destinatario = $result->fetch_assoc();
    
    // Insertar mensaje
    $sql = "INSERT INTO mensajes_familiares (remitente_id, destinatario_id, mensaje, tipo) VALUES (?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('iiss', $user_id, $destinatario_id, $mensaje, $tipo);
    
    if ($stmt->execute()) {
        $mensaje_id = $conexion->insert_id;
        
        // Crear notificación para el destinatario
        $datos_adicionales = json_encode([
            'remitente' => $_SESSION['nombre'] ?? 'Usuario',
            'mensaje_id' => $mensaje_id,
            'tipo_mensaje' => $tipo
        ]);
        
        $sql_notif = "INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, datos_adicionales, prioridad) 
                      VALUES (?, 'mensaje_familiar', 'Nuevo mensaje familiar', ?, ?, 'media')";
        $stmt_notif = $conexion->prepare($sql_notif);
        $stmt_notif->bind_param('iss', $destinatario_id, $mensaje, $datos_adicionales);
        $stmt_notif->execute();
        
        echo json_encode(['success' => true, 'message' => 'Mensaje enviado correctamente']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al enviar mensaje']);
    }
}

function getMensajesFamiliares($user_id) {
    global $conexion;
    
    $familiar_id = $_GET['familiar_id'] ?? 0;
    
    if (!$familiar_id) {
        echo json_encode(['success' => false, 'message' => 'ID de familiar requerido']);
        return;
    }
    
    $sql = "SELECT mf.*, 
            u_rem.nombre as remitente_nombre,
            u_dest.nombre as destinatario_nombre
            FROM mensajes_familiares mf
            JOIN usuarios u_rem ON mf.remitente_id = u_rem.id
            JOIN usuarios u_dest ON mf.destinatario_id = u_dest.id
            WHERE (mf.remitente_id = ? AND mf.destinatario_id = ?) 
               OR (mf.remitente_id = ? AND mf.destinatario_id = ?)
            ORDER BY mf.fecha_envio ASC";
    
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('iiii', $user_id, $familiar_id, $familiar_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $mensajes = [];
    while ($row = $result->fetch_assoc()) {
        $mensajes[] = [
            'id' => $row['id'],
            'remitente_id' => $row['remitente_id'],
            'remitente_nombre' => $row['remitente_nombre'],
            'destinatario_id' => $row['destinatario_id'],
            'destinatario_nombre' => $row['destinatario_nombre'],
            'mensaje' => $row['mensaje'],
            'tipo' => $row['tipo'],
            'leido' => $row['leido'],
            'fecha_envio' => $row['fecha_envio'],
            'es_mio' => $row['remitente_id'] == $user_id
        ];
    }
    
    // Marcar mensajes como leídos
    $sql_leer = "UPDATE mensajes_familiares SET leido = 1, fecha_lectura = NOW() 
                 WHERE destinatario_id = ? AND remitente_id = ? AND leido = 0";
    $stmt_leer = $conexion->prepare($sql_leer);
    $stmt_leer->bind_param('ii', $user_id, $familiar_id);
    $stmt_leer->execute();
    
    echo json_encode(['success' => true, 'mensajes' => $mensajes]);
}

function getConfiguracionNotificaciones($user_id) {
    global $conexion;
    
    $sql = "SELECT * FROM configuracion_notificaciones WHERE usuario_id = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $configuracion = [];
    while ($row = $result->fetch_assoc()) {
        $configuracion[$row['tipo_notificacion']] = [
            'activo' => $row['activo'],
            'sonido' => $row['sonido'],
            'vibracion' => $row['vibracion'],
            'hora_silencio_inicio' => $row['hora_silencio_inicio'],
            'hora_silencio_fin' => $row['hora_silencio_fin'],
            'frecuencia_recordatorio' => $row['frecuencia_recordatorio']
        ];
    }
    
    echo json_encode(['success' => true, 'configuracion' => $configuracion]);
}

function actualizarConfiguracionNotificaciones($user_id) {
    global $conexion;
    
    $tipo = $_POST['tipo'] ?? '';
    $activo = $_POST['activo'] ?? 1;
    $sonido = $_POST['sonido'] ?? 'default';
    $vibracion = $_POST['vibracion'] ?? 1;
    $hora_silencio_inicio = $_POST['hora_silencio_inicio'] ?? '22:00:00';
    $hora_silencio_fin = $_POST['hora_silencio_fin'] ?? '07:00:00';
    $frecuencia_recordatorio = $_POST['frecuencia_recordatorio'] ?? 5;
    
    if (!$tipo) {
        echo json_encode(['success' => false, 'message' => 'Tipo de notificación requerido']);
        return;
    }
    
    $sql = "INSERT INTO configuracion_notificaciones 
            (usuario_id, tipo_notificacion, activo, sonido, vibracion, hora_silencio_inicio, hora_silencio_fin, frecuencia_recordatorio) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
            ON DUPLICATE KEY UPDATE 
            activo = VALUES(activo), 
            sonido = VALUES(sonido), 
            vibracion = VALUES(vibracion), 
            hora_silencio_inicio = VALUES(hora_silencio_inicio), 
            hora_silencio_fin = VALUES(hora_silencio_fin), 
            frecuencia_recordatorio = VALUES(frecuencia_recordatorio)";
    
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('isissssi', $user_id, $tipo, $activo, $sonido, $vibracion, $hora_silencio_inicio, $hora_silencio_fin, $frecuencia_recordatorio);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Configuración actualizada']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar configuración']);
    }
}

function crearRecordatorioMedicamento($user_id) {
    global $conexion;
    
    $medicamento_id = $_POST['medicamento_id'] ?? 0;
    $hora = $_POST['hora'] ?? '';
    $dias_semana = $_POST['dias_semana'] ?? '1,2,3,4,5,6,7';
    
    if (!$medicamento_id || !$hora) {
        echo json_encode(['success' => false, 'message' => 'Medicamento y hora requeridos']);
        return;
    }
    
    // Verificar que el medicamento pertenece al usuario
    $sql_verificar = "SELECT id, nombre FROM medicamentos WHERE id = ? AND id_paciente = ?";
    $stmt_verificar = $conexion->prepare($sql_verificar);
    $stmt_verificar->bind_param('ii', $medicamento_id, $user_id);
    $stmt_verificar->execute();
    $result = $stmt_verificar->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Medicamento no válido']);
        return;
    }
    
    $medicamento = $result->fetch_assoc();
    
    // Calcular próximo recordatorio
    $proximo_recordatorio = calcularProximoRecordatorio($hora, $dias_semana);
    
    $sql = "INSERT INTO recordatorios_medicamentos 
            (medicamento_id, usuario_id, hora_recordatorio, dias_semana, proximo_recordatorio) 
            VALUES (?, ?, ?, ?, ?)";
    
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('iisss', $medicamento_id, $user_id, $hora, $dias_semana, $proximo_recordatorio);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Recordatorio creado correctamente']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al crear recordatorio']);
    }
}

function procesarRecordatoriosMedicamentos() {
    global $conexion;
    
    $ahora = date('Y-m-d H:i:s');
    
    // Obtener recordatorios pendientes
    $sql = "SELECT rm.*, m.nombre as medicamento_nombre, m.dosis, u.nombre as paciente_nombre
            FROM recordatorios_medicamentos rm
            JOIN medicamentos m ON rm.medicamento_id = m.id
            JOIN usuarios u ON rm.usuario_id = u.id
            WHERE rm.activo = 1 
            AND rm.proximo_recordatorio <= ?
            AND rm.proximo_recordatorio > DATE_SUB(?, INTERVAL 1 MINUTE)";
    
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('ss', $ahora, $ahora);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $recordatorios_procesados = [];
    
    while ($row = $result->fetch_assoc()) {
        // Crear notificación
        $datos_adicionales = json_encode([
            'medicamento' => $row['medicamento_nombre'],
            'dosis' => $row['dosis'],
            'recordatorio_id' => $row['id']
        ]);
        
        $sql_notif = "INSERT INTO notificaciones 
                      (usuario_id, tipo, titulo, mensaje, datos_adicionales, prioridad, fecha_programada) 
                      VALUES (?, 'medicamento', 'Recordatorio de medicamento', ?, ?, 'alta', ?)";
        
        $stmt_notif = $conexion->prepare($sql_notif);
        $stmt_notif->bind_param('iss', $row['usuario_id'], $row['medicamento_nombre'], $datos_adicionales, $ahora);
        $stmt_notif->execute();
        
        // Actualizar próximo recordatorio
        $proximo_recordatorio = calcularProximoRecordatorio($row['hora_recordatorio'], $row['dias_semana']);
        
        $sql_update = "UPDATE recordatorios_medicamentos 
                       SET ultimo_recordatorio = ?, proximo_recordatorio = ? 
                       WHERE id = ?";
        $stmt_update = $conexion->prepare($sql_update);
        $stmt_update->bind_param('ssi', $ahora, $proximo_recordatorio, $row['id']);
        $stmt_update->execute();
        
        $recordatorios_procesados[] = [
            'usuario_id' => $row['usuario_id'],
            'medicamento' => $row['medicamento_nombre'],
            'dosis' => $row['dosis']
        ];
    }
    
    echo json_encode(['success' => true, 'recordatorios_procesados' => $recordatorios_procesados]);
}

function calcularProximoRecordatorio($hora, $dias_semana) {
    $dias = explode(',', $dias_semana);
    $hora_actual = date('H:i:s');
    $dia_actual = date('N'); // 1=Lunes, 7=Domingo
    
    // Si la hora ya pasó hoy, buscar el próximo día
    if ($hora_actual >= $hora) {
        $dia_actual++;
    }
    
    // Buscar el próximo día válido
    $dias_buscados = 0;
    while ($dias_buscados < 7) {
        if (in_array($dia_actual, $dias)) {
            $fecha = date('Y-m-d', strtotime("+{$dias_buscados} days"));
            return $fecha . ' ' . $hora;
        }
        $dia_actual = ($dia_actual % 7) + 1;
        $dias_buscados++;
    }
    
    // Si no se encuentra, usar mañana
    return date('Y-m-d', strtotime('+1 day')) . ' ' . $hora;
}

// Función para crear notificaciones de citas (llamada desde otros archivos)
function crearNotificacionCita($usuario_id, $cita_data) {
    global $conexion;
    
    $datos_adicionales = json_encode([
        'medico' => $cita_data['medico'],
        'especialidad' => $cita_data['especialidad'] ?? '',
        'sede' => $cita_data['sede'] ?? '',
        'cita_id' => $cita_data['id']
    ]);
    
    // Notificación 30 minutos antes
    $fecha_cita = new DateTime($cita_data['fecha_hora']);
    $fecha_notificacion = $fecha_cita->modify('-30 minutes')->format('Y-m-d H:i:s');
    
    $sql = "INSERT INTO notificaciones 
            (usuario_id, tipo, titulo, mensaje, datos_adicionales, prioridad, fecha_programada) 
            VALUES (?, 'cita', 'Recordatorio de cita', ?, ?, 'media', ?)";
    
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('iss', $usuario_id, $cita_data['medico'], $datos_adicionales, $fecha_notificacion);
    
    return $stmt->execute();
}

function crearNotificacion($user_id) {
    global $conexion;
    
    $tipo = $_POST['tipo'] ?? 'recordatorio';
    $titulo = $_POST['titulo'] ?? 'Alerta';
    $mensaje = $_POST['mensaje'] ?? '';
    $prioridad = $_POST['prioridad'] ?? 'media';
    
    $sql = "INSERT INTO notificaciones (usuario_id, tipo, titulo, mensaje, prioridad) VALUES (?,?,?,?,?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('issss', $user_id, $tipo, $titulo, $mensaje, $prioridad);
    if ($stmt->execute()) {
        echo json_encode(['success'=>true, 'id'=>$conexion->insert_id]);
        exit;
    }
    echo json_encode(['success'=>false, 'message'=>'Error al crear notificación']);
    exit;
}
?> 