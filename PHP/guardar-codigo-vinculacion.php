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

// Verificar que el usuario es familiar
$stmt = $conn->prepare('SELECT email, tipo_usuario FROM usuarios WHERE id = ?');
$stmt->bind_param('i', $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user || $user['tipo_usuario'] !== 'familiar') {
    echo json_encode([
        'success' => false,
        'message' => 'Solo familiares pueden vincularse'
    ]);
    exit();
}
$email_familiar = $user['email'];

// Buscar paciente con ese código de vinculación válido
$stmt = $conn->prepare('SELECT user_id FROM datos_paciente WHERE codigo_vinculacion = ?');
$stmt->bind_param('s', $codigo);
$stmt->execute();
$result = $stmt->get_result();
$paciente = $result->fetch_assoc();
$stmt->close();

if (!$paciente) {
    echo json_encode([
        'success' => false,
        'message' => 'Código de vinculación incorrecto o expirado.'
    ]);
    exit();
}

// Actualizar familiar_email y eliminar el código de vinculación para que no se reutilice
$stmt = $conn->prepare('UPDATE datos_paciente SET familiar_email = ?, codigo_vinculacion = NULL WHERE user_id = ?');
$stmt->bind_param('si', $email_familiar, $paciente['user_id']);
if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Vinculación exitosa.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'No se pudo vincular el familiar.'
    ]);
}
$stmt->close();
$conn->close();
?> 