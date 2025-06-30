<?php
require_once 'Conexion.php';
header('Content-Type: application/json');

$action = $_GET['action'] ?? '';
$user_id = 1; // Simulación, reemplazar por $_SESSION['user_id'] si hay login

function respuesta($ok, $extra=[]) {
    echo json_encode(array_merge(['success'=>$ok], $extra));
    exit;
}

if ($action === 'list') {
    $sql = "SELECT * FROM bienestar WHERE id_paciente=? ORDER BY fecha_registro DESC";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $res = $stmt->get_result();
    $registros = [];
    while ($row = $res->fetch_assoc()) $registros[] = $row;
    respuesta(true, ['registros'=>$registros]);
}

if ($action === 'add') {
    $data = json_decode(file_get_contents('php://input'), true);
    $sql = "INSERT INTO bienestar (id_paciente, glucosa, presion_arterial, frecuencia_cardiaca, pasos_diarios, saturacion_oxigeno, peso, imc, temperatura_corporal, fecha_registro) VALUES (?,?,?,?,?,?,?,?,?,?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('idssidddds', $user_id, $data['glucosa'], $data['presion'], $data['fc'], $data['pasos'], $data['saturacion'], $data['peso'], $data['imc'], $data['temp'], $data['fecha']);
    if ($stmt->execute()) respuesta(true);
    respuesta(false, ['message'=>'Error al guardar']);
}

if ($action === 'edit') {
    $data = json_decode(file_get_contents('php://input'), true);
    $sql = "UPDATE bienestar SET glucosa=?, presion_arterial=?, frecuencia_cardiaca=?, pasos_diarios=?, saturacion_oxigeno=?, peso=?, imc=?, temperatura_corporal=?, fecha_registro=? WHERE id=? AND id_paciente=?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('ssiddddsiii', $data['glucosa'], $data['presion'], $data['fc'], $data['pasos'], $data['saturacion'], $data['peso'], $data['imc'], $data['temp'], $data['fecha'], $data['id'], $user_id);
    if ($stmt->execute()) respuesta(true);
    respuesta(false, ['message'=>'Error al editar']);
}

if ($action === 'delete') {
    $data = json_decode(file_get_contents('php://input'), true);
    $sql = "DELETE FROM bienestar WHERE id=? AND id_paciente=?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('ii', $data['id'], $user_id);
    if ($stmt->execute()) respuesta(true);
    respuesta(false, ['message'=>'Error al eliminar']);
}

respuesta(false, ['message'=>'Acción no válida']); 