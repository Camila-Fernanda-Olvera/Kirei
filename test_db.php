<?php
require_once 'PHP/Conexion.php';

echo "Testing database connection and tables...\n";

// Test connection
if ($conexion->ping()) {
    echo "✓ Database connection successful\n";
} else {
    echo "✗ Database connection failed\n";
    exit(1);
}

// Test if notification tables exist
$tables = [
    'notificaciones',
    'recordatorios_medicamentos', 
    'mensajes_familiares',
    'configuracion_notificaciones',
    'historial_notificaciones'
];

foreach ($tables as $table) {
    $result = $conexion->query("SHOW TABLES LIKE '$table'");
    if ($result->num_rows > 0) {
        echo "✓ Table '$table' exists\n";
    } else {
        echo "✗ Table '$table' does not exist\n";
    }
}

// Test if user is logged in (simulate session)
session_start();
if (isset($_SESSION['user_id'])) {
    echo "✓ User session found: " . $_SESSION['user_id'] . "\n";
} else {
    echo "✗ No user session found\n";
}

$conexion->close();
echo "Test completed.\n";
?> 