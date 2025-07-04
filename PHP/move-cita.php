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
$nueva_fecha = $data['nueva_fecha'] ?? '';
$nueva_hora = $data['nueva_hora'] ?? '';
if (!$cita_id || !$nueva_fecha || !$nueva_hora) {
    echo json_encode(['success' => false, 'message' => 'ID, fecha y hora son obligatorios']);
    exit();
}
// Obtener hora original (ya no necesario)
$nueva_fecha_hora = $nueva_fecha . ' ' . $nueva_hora . ':00';
$stmt = $conexion->prepare('UPDATE citas SET fecha_hora=? WHERE id=? AND id_paciente=?');
$stmt->bind_param('sii', $nueva_fecha_hora, $cita_id, $user_id);
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
    $stmt->close();
    $conexion->close();
    exit();
} else {
    echo json_encode(['success' => false, 'message' => 'Error al mover: ' . $conexion->error]);
    $stmt->close();
    $conexion->close();
    exit();
} 