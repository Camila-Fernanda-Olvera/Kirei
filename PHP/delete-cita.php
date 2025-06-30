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
if (!$cita_id) {
    echo json_encode(['success' => false, 'message' => 'ID de cita requerido']);
    exit();
}
$stmt = $conexion->prepare('DELETE FROM citas WHERE id = ? AND id_paciente = ?');
$stmt->bind_param('ii', $cita_id, $user_id);
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
    $stmt->close();
    $conexion->close();
    exit();
} else {
    echo json_encode(['success' => false, 'message' => 'Error al eliminar: ' . $conexion->error]);
    $stmt->close();
    $conexion->close();
    exit();
} 