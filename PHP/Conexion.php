<?php
// Configuración de la base de datos
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'kirei';

// Crear conexión
$conexion = new mysqli($host, $user, $pass, $db);

// Verificar conexión
if ($conexion->connect_error) {
    die('Error de conexión: ' . $conexion->connect_error);
}

// Configurar charset
$conexion->set_charset("utf8");
?>
