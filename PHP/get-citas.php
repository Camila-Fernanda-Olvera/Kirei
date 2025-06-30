<?php
header('Content-Type: application/json');
session_start();
require_once 'Conexion.php';
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
    exit();
}
$user_id = $_SESSION['user_id'];
$stmt = $conn->prepare('SELECT * FROM citas WHERE id_paciente = ?');
$stmt->bind_param('i', $user_id);
$stmt->execute();
$result = $stmt->get_result();
$citas = [];
while ($row = $result->fetch_assoc()) {
    $citas[] = $row;
}
$stmt->close();
$conn->close();
echo json_encode(['success' => true, 'citas' => $citas]);
exit(); 