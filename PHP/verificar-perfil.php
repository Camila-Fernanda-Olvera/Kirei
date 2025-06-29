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
    // El paciente ya tiene datos completos
    echo json_encode([
        'success' => true,
        'perfil_completo' => true,
        'datos' => $datos_paciente
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