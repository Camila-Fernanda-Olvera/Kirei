<?php
// Configuración de la base de datos para AwardSpace
$host = 'fdb1033.awardspace.net';
$user = '4654255_kirei';
$pass = '07081214Cf?';
$db = '4654255_kirei';

// Crear conexión
$conexion = new mysqli($host, $user, $pass, $db);

// Verificar conexión
if ($conexion->connect_error) {
    die('Error de conexión: ' . $conexion->connect_error);
}

// Configurar charset
$conexion->set_charset("utf8");
?>
