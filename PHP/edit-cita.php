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
$medico = $data['medico'] ?? '';
$especialidad = $data['especialidad'] ?? '';
$motivo = $data['motivo'] ?? '';
$sede = $data['sede'] ?? '';
$fecha_hora = $data['fecha_hora'] ?? '';
$estado = $data['estado'] ?? null;
if (!$id) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios']);
    exit();
}
// Si se solicita cambio de estado (cancelar o reactivar)
if ($estado === 'Cancelada' || $estado === 'Pendiente') {
    $stmt = $conn->prepare('UPDATE citas SET estado=? WHERE id=? AND id_paciente=?');
    $stmt->bind_param('sii', $estado, $id, $user_id);
    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar estado: ' . $conn->error]);
    }
    $stmt->close();
    $conn->close();
    exit();
}
// Si se solicita edición de datos de la cita
if (!$medico || !$fecha_hora) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios']);
    exit();
}
// Obtener la fecha original
$stmt = $conn->prepare('SELECT fecha_hora FROM citas WHERE id = ? AND id_paciente = ?');
$stmt->bind_param('ii', $id, $user_id);
$stmt->execute();
$result = $stmt->get_result();
if ($row = $result->fetch_assoc()) {
    $fecha_original = explode(' ', $row['fecha_hora'])[0];
    $fecha_nueva = explode(' ', $fecha_hora)[0];
    if ($fecha_original !== $fecha_nueva) {
        echo json_encode(['success' => false, 'message' => 'No puedes cambiar la fecha aquí. Usa la opción Mover.']);
        exit();
    }
    $stmt2 = $conn->prepare('UPDATE citas SET medico=?, especialidad=?, motivo=?, sede=?, fecha_hora=? WHERE id=? AND id_paciente=?');
    $stmt2->bind_param('ssssssi', $medico, $especialidad, $motivo, $sede, $fecha_hora, $id, $user_id);
    if ($stmt2->execute()) {
        echo json_encode(['success' => true]);
        $stmt2->close();
        $stmt->close();
        $conn->close();
        exit();
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al actualizar: ' . $conn->error]);
        $stmt2->close();
        $stmt->close();
        $conn->close();
        exit();
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Cita no encontrada']);
    $stmt->close();
    $conn->close();
    exit();
}
$conn->close(); 