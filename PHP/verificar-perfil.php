<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();

// Incluir archivo de conexión
require_once 'Conexion.php';

// Verificar si el usuario está logueado
if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Usuario no autenticado'
    ]);
    exit();
}

$user_id = $_SESSION['user_id'];

// Verificar que el usuario sea un paciente
$stmt = $conn->prepare('SELECT tipo_usuario FROM usuarios WHERE id = ?');
$stmt->bind_param('i', $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user || $user['tipo_usuario'] !== 'paciente') {
    echo json_encode([
        'success' => false,
        'message' => 'Solo los pacientes pueden acceder a esta página'
    ]);
    exit();
}

// Verificar si el paciente ya tiene datos completos
$stmt = $conn->prepare('SELECT * FROM datos_paciente WHERE user_id = ?');
$stmt->bind_param('i', $user_id);
$stmt->execute();
$result = $stmt->get_result();
$datos_paciente = $result->fetch_assoc();
$stmt->close();

if ($datos_paciente) {
    // Obtener medicamentos reales del paciente
    $stmt = $conn->prepare('SELECT * FROM medicamentos WHERE id_paciente = ?');
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $resultMeds = $stmt->get_result();
    $medicamentos = [];
    while ($row = $resultMeds->fetch_assoc()) {
        $medicamentos[] = $row;
    }
    $stmt->close();

    // Obtener el nombre y padecimiento del usuario
    $stmt = $conn->prepare('SELECT nombre, padecimiento FROM usuarios WHERE id = ?');
    $stmt->bind_param('i', $user_id);
    $stmt->execute();
    $resultP = $stmt->get_result();
    $nombre = '';
    $padecimiento = '';
    if ($row = $resultP->fetch_assoc()) {
        $nombre = $row['nombre'];
        $padecimiento = $row['padecimiento'];
    }
    $stmt->close();
    $datos_paciente['nombre'] = $nombre;
    $datos_paciente['padecimiento'] = $padecimiento;

    // El paciente ya tiene datos completos
    echo json_encode([
        'success' => true,
        'perfil_completo' => true,
        'datos' => $datos_paciente,
        'medicamentos' => $medicamentos
    ]);
} else {
    // El paciente no tiene datos completos
    echo json_encode([
        'success' => true,
        'perfil_completo' => false
    ]);
}

$conn->close();
?> 