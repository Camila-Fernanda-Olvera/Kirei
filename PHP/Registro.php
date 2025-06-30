<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Incluir archivo de conexión
require_once 'Conexion.php';

// Recibir datos JSON
$data = json_decode(file_get_contents('php://input'), true);

$nombre = $data['nombre'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$tipo_usuario = $data['tipo_usuario'] ?? '';
$padecimiento = $data['padecimiento'] ?? '';

// Validar datos básicos
if ($nombre && $email && $password && $tipo_usuario && ($tipo_usuario !== 'paciente' || $padecimiento)) {
    // Verificar si el email ya existe
    $stmt = $conexion->prepare('SELECT id FROM usuarios WHERE email = ?');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'El email ya está registrado'
        ]);
        $stmt->close();
        $conexion->close();
        exit();
    }
    $stmt->close();
    
    // Hashear contraseña
    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    
    // Insertar en la base de datos
    $stmt = $conexion->prepare('INSERT INTO usuarios (nombre, email, password, tipo_usuario, padecimiento) VALUES (?, ?, ?, ?, ?)');
    $stmt->bind_param('sssss', $nombre, $email, $password_hash, $tipo_usuario, $padecimiento);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Usuario registrado correctamente'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error al registrar el usuario: ' . $conexion->error
        ]);
    }
    $stmt->close();
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Todos los campos son obligatorios'
    ]);
}

$conexion->close();
?>
