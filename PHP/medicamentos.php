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
    $sql = "SELECT * FROM medicamentos WHERE id_paciente=? ORDER BY id DESC";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $res = $stmt->get_result();
    $medicamentos = [];
    while ($row = $res->fetch_assoc()) $medicamentos[] = $row;
    respuesta(true, ['medicamentos'=>$medicamentos]);
}

if ($action === 'add') {
    $data = json_decode(file_get_contents('php://input'), true);
    $sql = "INSERT INTO medicamentos (id_paciente, nombre, tipo, dosis, frecuencia, horarios, inicio, fin, indicaciones) VALUES (?,?,?,?,?,?,?,?,?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('issssssss', $user_id, $data['nombre'], $data['tipo'], $data['dosis'], $data['frecuencia'], $data['horarios'], $data['inicio'], $data['fin'], $data['indicaciones']);
    if ($stmt->execute()) respuesta(true);
    respuesta(false, ['message'=>'Error al guardar']);
}

if ($action === 'edit') {
    $data = json_decode(file_get_contents('php://input'), true);
    $sql = "UPDATE medicamentos SET nombre=?, tipo=?, dosis=?, frecuencia=?, horarios=?, inicio=?, fin=?, indicaciones=? WHERE id=? AND id_paciente=?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('sssssssiii', $data['nombre'], $data['tipo'], $data['dosis'], $data['frecuencia'], $data['horarios'], $data['inicio'], $data['fin'], $data['indicaciones'], $data['id'], $user_id);
    if ($stmt->execute()) respuesta(true);
    respuesta(false, ['message'=>'Error al editar']);
}

if ($action === 'delete') {
    $data = json_decode(file_get_contents('php://input'), true);
    $sql = "DELETE FROM medicamentos WHERE id=? AND id_paciente=?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('ii', $data['id'], $user_id);
    if ($stmt->execute()) respuesta(true);
    respuesta(false, ['message'=>'Error al eliminar']);
}

respuesta(false, ['message'=>'Acción no válida']); 