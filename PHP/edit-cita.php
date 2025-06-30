<?php
header('Content-Type: application/json');
session_start();
require_once 'Conexion.php';
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
    exit();
}
$user_id = $_SESSION['user_id'];
$data = json_decode(file_get_contents('php://input'), true);
$cita_id = $data['id'] ?? 0;

// Si solo se está actualizando el estado
if (isset($data['estado'])) {
    $estado = $data['estado'];
    $stmt = $conexion->prepare('UPDATE citas SET estado=? WHERE id=? AND id_paciente=?');
    $stmt->bind_param('sii', $estado, $cita_id, $user_id);
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
        $stmt->close();
        $conexion->close();
        exit();
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar estado: ' . $conexion->error]);
        $stmt->close();
        $conexion->close();
        exit();
    }
}

// Si se están actualizando otros campos
$medico = $data['medico'] ?? '';
$especialidad = $data['especialidad'] ?? '';
$motivo = $data['motivo'] ?? '';
$sede = $data['sede'] ?? '';
$fecha_hora = $data['fecha_hora'] ?? '';

if (!$medico || !$fecha_hora) {
    echo json_encode(['success' => false, 'message' => 'Médico y fecha/hora son obligatorios']);
    exit();
}

// Verificar que la cita existe y pertenece al usuario
$stmt = $conexion->prepare('SELECT fecha_hora FROM citas WHERE id = ? AND id_paciente = ?');
$stmt->bind_param('ii', $cita_id, $user_id);
$stmt->execute();
if ($stmt->get_result()->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Cita no encontrada']);
    $stmt->close();
    $conexion->close();
    exit();
}

$stmt2 = $conexion->prepare('UPDATE citas SET medico=?, especialidad=?, motivo=?, sede=?, fecha_hora=? WHERE id=? AND id_paciente=?');
$stmt2->bind_param('sssssii', $medico, $especialidad, $motivo, $sede, $fecha_hora, $cita_id, $user_id);
if ($stmt2->execute()) {
    echo json_encode(['success' => true]);
    $stmt2->close();
    $conexion->close();
    exit();
} else {
    echo json_encode(['success' => false, 'message' => 'Error al actualizar: ' . $conexion->error]);
    $stmt2->close();
    $conexion->close();
    exit();
}
?> 