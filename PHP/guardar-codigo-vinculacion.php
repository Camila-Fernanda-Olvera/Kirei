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
$stmt = $conexion->prepare('SELECT email, tipo_usuario FROM usuarios WHERE id = ?');
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

// Buscar código en codigos_vinculacion (no expirado, no usado)
$stmt = $conexion->prepare('SELECT user_id, fecha_expiracion, usado FROM codigos_vinculacion WHERE codigo = ?');
$stmt->bind_param('s', $codigo);
$stmt->execute();
$result = $stmt->get_result();
$codigo_row = $result->fetch_assoc();
$stmt->close();

if (!$codigo_row) {
    echo json_encode([
        'success' => false,
        'message' => 'Código de vinculación incorrecto.'
    ]);
    exit();
}
if ($codigo_row['usado']) {
    echo json_encode([
        'success' => false,
        'message' => 'Este código ya fue utilizado.'
    ]);
    exit();
}
if (strtotime($codigo_row['fecha_expiracion']) < time()) {
    echo json_encode([
        'success' => false,
        'message' => 'El código ha expirado.'
    ]);
    exit();
}
$paciente_id = $codigo_row['user_id'];

// Actualizar familiar_email en datos_paciente
$stmt = $conexion->prepare('UPDATE datos_paciente SET familiar_email = ? WHERE user_id = ?');
$stmt->bind_param('si', $email_familiar, $paciente_id);
if (!$stmt->execute()) {
    echo json_encode([
        'success' => false,
        'message' => 'No se pudo vincular el familiar.'
    ]);
    $stmt->close();
    $conexion->close();
    exit();
}
$stmt->close();

// Marcar el código como usado
$stmt = $conexion->prepare('UPDATE codigos_vinculacion SET usado = 1 WHERE codigo = ?');
$stmt->bind_param('s', $codigo);
$stmt->execute();
$stmt->close();

$conexion->close();
echo json_encode([
    'success' => true,
    'message' => 'Vinculación exitosa.'
]);
?> 