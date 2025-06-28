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
                echo '<script>
                    Swal.fire({
                        title: "¡Bienvenido!",
                        text: "¡Bienvenido, ' . $user['nombre'] . '!",
                        icon: "success",
                        confirmButtonText: "Continuar",
                        confirmButtonColor: "#d72660",
                        background: "rgba(255,255,255,0.95)",
                        backdrop: "rgba(0,0,0,0.4)",
                        timer: 2000,
                        timerProgressBar: true
                    }).then(() => {
                        window.location.href="../dashboard-paciente.html";
                    });
                </script>';
            } else {
                echo '<script>
                    Swal.fire({
                        title: "¡Bienvenido!",
                        text: "¡Bienvenido, ' . $user['nombre'] . '!",
                        icon: "success",
                        confirmButtonText: "Continuar",
                        confirmButtonColor: "#d72660",
                        background: "rgba(255,255,255,0.95)",
                        backdrop: "rgba(0,0,0,0.4)",
                        timer: 2000,
                        timerProgressBar: true
                    }).then(() => {
                        window.location.href="../dashboard-familiar.html";
                    });
                </script>';
            }
        } else {
            echo '<script>
                Swal.fire({
                    title: "Error de Acceso",
                    text: "Contraseña incorrecta.",
                    icon: "error",
                    confirmButtonText: "Entendido",
                    confirmButtonColor: "#d72660",
                    background: "rgba(255,255,255,0.95)",
                    backdrop: "rgba(0,0,0,0.4)"
                }).then(() => {
                    window.history.back();
                });
            </script>';
        }
    } else {
        echo '<script>
            Swal.fire({
                title: "Usuario No Encontrado",
                text: "No existe una cuenta con este correo electrónico.",
                icon: "error",
                confirmButtonText: "Entendido",
                confirmButtonColor: "#d72660",
                background: "rgba(255,255,255,0.95)",
                backdrop: "rgba(0,0,0,0.4)"
            }).then(() => {
                window.history.back();
            });
        </script>';
    }
    
    $stmt->close();
} else {
    echo '<script>
        Swal.fire({
            title: "Campos Requeridos",
            text: "Todos los campos son obligatorios.",
            icon: "warning",
            confirmButtonText: "Entendido",
            confirmButtonColor: "#d72660",
            background: "rgba(255,255,255,0.95)",
            backdrop: "rgba(0,0,0,0.4)"
        }).then(() => {
            window.history.back();
        });
    </script>';
}

$conn->close();
?> 