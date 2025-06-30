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
$id = $data['id'] ?? 0;
if (!$id) {
    echo json_encode(['success' => false, 'message' => 'ID de cita requerido']);
    exit();
}
$stmt = $conn->prepare('DELETE FROM citas WHERE id = ? AND id_paciente = ?');
$stmt->bind_param('ii', $id, $user_id);
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
    $stmt->close();
    $conn->close();
    exit();
} else {
    echo json_encode(['success' => false, 'message' => 'Error al eliminar: ' . $conn->error]);
    $stmt->close();
    $conn->close();
    exit();
} 