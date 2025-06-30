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

$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// Validar datos básicos
if ($email && $password) {
    // Buscar usuario en la base de datos
    $stmt = $conexion->prepare('SELECT id, nombre, email, password, tipo_usuario FROM usuarios WHERE email = ?');
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
            
            // Si es paciente, verificar si ya tiene datos completos
            $perfil_completo = false;
            if ($user['tipo_usuario'] === 'paciente') {
                $stmt2 = $conexion->prepare('SELECT id FROM datos_paciente WHERE user_id = ?');
                $stmt2->bind_param('i', $user['id']);
                $stmt2->execute();
                $result2 = $stmt2->get_result();
                $perfil_completo = $result2->num_rows > 0;
                $stmt2->close();
            }
            
            echo json_encode([
                'success' => true,
                'message' => 'Login exitoso',
                'nombre' => $user['nombre'],
                'tipo_usuario' => $user['tipo_usuario'],
                'perfil_completo' => $perfil_completo
            ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Contraseña incorrecta'
            ]);
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Usuario no encontrado'
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