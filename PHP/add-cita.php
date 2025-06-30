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
$medico = $data['medico'] ?? '';
$especialidad = $data['especialidad'] ?? '';
$motivo = $data['motivo'] ?? '';
$sede = $data['sede'] ?? '';
$fecha_hora = $data['fecha_hora'] ?? '';
if (!$medico || !$fecha_hora) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios']);
    exit();
}
$stmt = $conn->prepare('INSERT INTO citas (id_paciente, medico, especialidad, motivo, sede, fecha_hora) VALUES (?, ?, ?, ?, ?, ?)');
$stmt->bind_param('isssss', $user_id, $medico, $especialidad, $motivo, $sede, $fecha_hora);
if ($stmt->execute()) {
    echo json_encode(['success' => true]);
    $stmt->close();
    $conn->close();
    exit();
} else {
    echo json_encode(['success' => false, 'message' => 'Error al guardar: ' . $conn->error]);
    $stmt->close();
    $conn->close();
    exit();
} 