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
        echo '<script>
            Swal.fire({
                title: "¡Registro Exitoso!",
                text: "Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.",
                icon: "success",
                confirmButtonText: "Iniciar Sesión",
                confirmButtonColor: "#d72660",
                background: "rgba(255,255,255,0.95)",
                backdrop: "rgba(0,0,0,0.4)",
                timer: 3000,
                timerProgressBar: true
            }).then(() => {
                window.location.href="../Index.html";
            });
        </script>';
    } else {
        echo '<script>
            Swal.fire({
                title: "Error en el Registro",
                text: "Hubo un problema al crear tu cuenta. Por favor intenta nuevamente.",
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
            text: "Todos los campos son obligatorios. Por favor completa todos los datos.",
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
