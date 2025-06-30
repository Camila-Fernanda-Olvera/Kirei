<?php
session_start();
require_once 'Conexion.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
    exit();
}
$user_id = $_SESSION['user_id'];
$action = $_POST['action'] ?? $_GET['action'] ?? '';

// Verificar que es familiar y obtener el paciente vinculado
$stmt = $conexion->prepare('SELECT email FROM usuarios WHERE id = ? AND tipo_usuario = "familiar"');
$stmt->bind_param('i', $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user) {
    echo json_encode(['success' => false, 'message' => 'Solo familiares pueden ver notificaciones del paciente.']);
    exit();
}
$email_familiar = $user['email'];

// Buscar paciente vinculado a este familiar
$stmt = $conexion->prepare('SELECT user_id FROM datos_paciente WHERE familiar_email = ?');
$stmt->bind_param('s', $email_familiar);
$stmt->execute();
$result = $stmt->get_result();
$paciente = $result->fetch_assoc();
$stmt->close();

if (!$paciente) {
    echo json_encode(['success' => false, 'message' => 'No se encontró paciente vinculado a este familiar.']);
    exit();
}
$paciente_id = $paciente['user_id'];

switch ($action) {
    case 'get_notificaciones_paciente':
        getNotificacionesPaciente($paciente_id);
        break;
    case 'marcar_leida':
        marcarNotificacionLeida($paciente_id);
        break;
    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida.']);
}

function getNotificacionesPaciente($paciente_id) {
    global $conexion;
    $sql = "SELECT n.*, 
            CASE 
                WHEN n.tipo = 'medicamento' THEN CONCAT('Debe tomar ', JSON_UNQUOTE(JSON_EXTRACT(n.datos_adicionales, '$.medicamento')), ' - ', JSON_UNQUOTE(JSON_EXTRACT(n.datos_adicionales, '$.dosis')))
                WHEN n.tipo = 'cita' THEN CONCAT('Tiene cita en 30 min con ', JSON_UNQUOTE(JSON_EXTRACT(n.datos_adicionales, '$.medico')))
                WHEN n.tipo = 'mensaje_familiar' THEN CONCAT(JSON_UNQUOTE(JSON_EXTRACT(n.datos_adicionales, '$.remitente')), ' envió un mensaje')
                WHEN n.tipo = 'recordatorio' THEN n.mensaje
                ELSE n.mensaje
            END as mensaje_formateado
            FROM notificaciones n 
            WHERE n.usuario_id = ? 
            ORDER BY n.fecha_creacion DESC 
            LIMIT 50";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('i', $paciente_id);
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

function marcarNotificacionLeida($paciente_id) {
    global $conexion;
    $notificacion_id = $_POST['id'] ?? 0;
    if (!$notificacion_id) {
        echo json_encode(['success' => false, 'message' => 'ID de notificación requerido']);
        return;
    }
    $sql = "UPDATE notificaciones SET estado = 'leida' WHERE id = ? AND usuario_id = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('ii', $notificacion_id, $paciente_id);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Notificación marcada como leída']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar notificación']);
    }
} 