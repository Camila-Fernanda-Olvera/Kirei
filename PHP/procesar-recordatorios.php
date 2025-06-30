<?php
// Archivo para procesar recordatorios automáticamente
// Este archivo puede ser llamado por un cron job o por JavaScript

require_once 'Conexion.php';

header('Content-Type: application/json');

try {
    // Procesar recordatorios de medicamentos
    procesarRecordatoriosMedicamentos();
    
    // Procesar notificaciones de citas
    procesarNotificacionesCitas();
    
    echo json_encode(['success' => true, 'message' => 'Recordatorios procesados correctamente']);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
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
    }
}

function procesarNotificacionesCitas() {
    global $conexion;
    
    $ahora = date('Y-m-d H:i:s');
    $treinta_minutos = date('Y-m-d H:i:s', strtotime('+30 minutes'));
    
    // Obtener citas que están a 30 minutos
    $sql = "SELECT c.*, u.nombre as paciente_nombre
            FROM citas c
            JOIN usuarios u ON c.id_paciente = u.id
            WHERE c.estado = 'Pendiente'
            AND c.fecha_hora BETWEEN ? AND ?
            AND c.fecha_hora > ?
            AND NOT EXISTS (
                SELECT 1 FROM notificaciones n 
                WHERE n.usuario_id = c.id_paciente 
                AND n.tipo = 'cita' 
                AND JSON_EXTRACT(n.datos_adicionales, '$.cita_id') = c.id
            )";
    
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('sss', $ahora, $treinta_minutos, $ahora);
    $stmt->execute();
    $result = $stmt->get_result();
    
    while ($row = $result->fetch_assoc()) {
        // Crear notificación de cita
        $datos_adicionales = json_encode([
            'medico' => $row['medico'],
            'especialidad' => $row['especialidad'] ?? '',
            'sede' => $row['sede'] ?? '',
            'cita_id' => $row['id']
        ]);
        
        $sql_notif = "INSERT INTO notificaciones 
                      (usuario_id, tipo, titulo, mensaje, datos_adicionales, prioridad, fecha_programada) 
                      VALUES (?, 'cita', 'Recordatorio de cita', ?, ?, 'media', ?)";
        
        $stmt_notif = $conexion->prepare($sql_notif);
        $stmt_notif->bind_param('iss', $row['id_paciente'], $row['medico'], $datos_adicionales, $ahora);
        $stmt_notif->execute();
    }
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
?> 