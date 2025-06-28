<?php
// Incluir archivo de conexión
require_once 'Conexion.php';

// Recibir datos del formulario
$nombre = $_POST['nombre'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$tipo_usuario = $_POST['tipo_usuario'] ?? '';
$padecimiento = '';
if ($tipo_usuario === 'paciente') {
    $padecimiento = $_POST['padecimiento'] ?? '';
}
$imagen = '';

// Manejar subida de imagen
if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] == 0) {
    $img_name = uniqid() . '_' . basename($_FILES['imagen']['name']);
    $img_path = '../assets/' . $img_name;
    if (move_uploaded_file($_FILES['imagen']['tmp_name'], $img_path)) {
        $imagen = $img_name;
    }
}

// Validar datos básicos
if ($nombre && $email && $password && $tipo_usuario && ($tipo_usuario !== 'paciente' || $padecimiento)) {
    // Hashear contraseña
    $password_hash = password_hash($password, PASSWORD_DEFAULT);
    
    // Insertar en la base de datos
    $stmt = $conn->prepare('INSERT INTO usuarios (nombre, email, password, tipo_usuario, padecimiento, imagen) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->bind_param('ssssss', $nombre, $email, $password_hash, $tipo_usuario, $padecimiento, $imagen);
    
    if ($stmt->execute()) {
        echo '<script>alert("Registro exitoso. Ahora puedes iniciar sesión."); window.location.href="../Index.html";</script>';
    } else {
        echo '<script>alert("Error al registrar: ' . $stmt->error . '"); window.history.back();</script>';
    }
    $stmt->close();
} else {
    echo '<script>alert("Todos los campos son obligatorios."); window.history.back();</script>';
}

$conn->close();
