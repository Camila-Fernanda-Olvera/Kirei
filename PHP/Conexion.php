<?php
// Configuración de la base de datos para InfinityFree
$host = 'sql113.infinityfree.com';
$user = 'if0_39358312';
$pass = '9CoAFO1dPjrvdWL';
$db = 'if0_39358312_XXX'; // Cambia XXX por el nombre real de tu base de datos

// Crear conexión
$conexion = new mysqli($host, $user, $pass, $db);

// Verificar conexión
if ($conexion->connect_error) {
    die('Error de conexión: ' . $conexion->connect_error);
}

// Configurar charset
$conexion->set_charset("utf8");
?>
