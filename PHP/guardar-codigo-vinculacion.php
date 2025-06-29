<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

session_start();

// Incluir archivo de conexión
require_once 'Conexion.php';

// Recibir datos JSON
$data = json_decode(file_get_contents('php://input'), true);

// Verificar si el usuario está logueado
if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Usuario no autenticado'
    ]);
    exit();
}

$user_id = $_SESSION['user_id'];
$codigo = $data['codigo'] ?? '';

if (empty($codigo)) {
    echo json_encode([
        'success' => false,
        'message' => 'Código de vinculación requerido'
    ]);
    exit();
}

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
        'message' => 'Solo los pacientes pueden generar códigos de vinculación'
    ]);
    exit();
}

// Verificar si el código ya existe
$stmt = $conn->prepare('SELECT id FROM codigos_vinculacion WHERE codigo = ?');
$stmt->bind_param('s', $codigo);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        'success' => false,
        'message' => 'El código ya existe, por favor genera uno nuevo'
    ]);
    $stmt->close();
    exit();
}
$stmt->close();

// Calcular fecha de expiración (7 días desde ahora)
$fecha_expiracion = date('Y-m-d H:i:s', strtotime('+7 days'));

// Insertar el código de vinculación
$stmt = $conn->prepare('INSERT INTO codigos_vinculacion (codigo, user_id, fecha_expiracion) VALUES (?, ?, ?)');
$stmt->bind_param('sis', $codigo, $user_id, $fecha_expiracion);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Código de vinculación guardado correctamente',
        'codigo' => $codigo,
        'fecha_expiracion' => $fecha_expiracion
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error al guardar el código de vinculación: ' . $conn->error
    ]);
}

$stmt->close();
$conn->close();
?> 