<?php
// Configuración de la base de datos
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'kirei';

// Crear conexión
$conn = new mysqli($host, $user, $pass, $db);

// Verificar conexión
if ($conn->connect_error) {
    die('Error de conexión: ' . $conn->connect_error);
}

// Configurar charset
$conn->set_charset("utf8");
?>
