<?php
session_start();

// Incluir archivo de conexión
require_once 'Conexion.php';

// Recibir datos del formulario
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

// Validar datos básicos
if ($email && $password) {
    // Buscar usuario en la base de datos
    $stmt = $conn->prepare('SELECT id, nombre, email, password, tipo_usuario FROM usuarios WHERE email = ?');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        
        // Verificar contraseña
        if (password_verify($password, $user['password'])) {
            // Login exitoso
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['nombre'];
            $_SESSION['user_email'] = $user['email'];
            $_SESSION['user_type'] = $user['tipo_usuario'];
            
            // Redirigir según el tipo de usuario
            if ($user['tipo_usuario'] === 'paciente') {
                echo '<script>alert("¡Bienvenido, ' . $user['nombre'] . '!"); window.location.href="../dashboard-paciente.html";</script>';
            } else {
                echo '<script>alert("¡Bienvenido, ' . $user['nombre'] . '!"); window.location.href="../dashboard-familiar.html";</script>';
            }
        } else {
            echo '<script>alert("Contraseña incorrecta."); window.history.back();</script>';
        }
    } else {
        echo '<script>alert("Usuario no encontrado."); window.history.back();</script>';
    }
    
    $stmt->close();
} else {
    echo '<script>alert("Todos los campos son obligatorios."); window.history.back();</script>';
}

$conn->close();
?> 