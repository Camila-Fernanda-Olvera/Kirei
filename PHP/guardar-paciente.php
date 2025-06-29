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

// Verificar si el usuario está logueado
if (!isset($_SESSION['user_id'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Usuario no autenticado'
    ]);
    exit();
}

$user_id = $_SESSION['user_id'];

// Extraer todos los datos del flujo
$fecha_nac = $data['fecha_nac'] ?? '';
$genero = $data['genero'] ?? '';
$pais = $data['pais'] ?? '';
$idioma = $data['idioma'] ?? '';
$fecha_diagnostico = $data['fecha_diagnostico'] ?? '';
$medico = $data['medico'] ?? '';
$tipo_sangre = $data['tipo_sangre'] ?? '';
$dieta = $data['dieta'] ?? '';
$alergias = $data['alergias'] ?? '';
$medicacion = $data['medicacion'] ?? '';
$contacto_nombre = $data['contacto_nombre'] ?? '';
$contacto_telefono = $data['contacto_telefono'] ?? '';
$contacto_relacion = $data['contacto_relacion'] ?? '';
$documentos = $data['documentos'] ?? '';
$familiar_email = $data['familiar_email'] ?? '';
$codigo_vinculacion = $data['codigo_vinculacion'] ?? '';
$permisos = json_encode($data);

// Crear tabla de datos del paciente si no existe
$create_table = "CREATE TABLE IF NOT EXISTS `datos_paciente` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` int(11) NOT NULL,
    `fecha_nac` date DEFAULT NULL,
    `genero` varchar(20) DEFAULT NULL,
    `pais` varchar(100) DEFAULT NULL,
    `idioma` varchar(10) DEFAULT NULL,
    `fecha_diagnostico` date DEFAULT NULL,
    `medico` varchar(200) DEFAULT NULL,
    `tipo_sangre` varchar(10) DEFAULT NULL,
    `dieta` varchar(50) DEFAULT NULL,
    `alergias` text DEFAULT NULL,
    `medicacion` text DEFAULT NULL,
    `contacto_nombre` varchar(200) DEFAULT NULL,
    `contacto_telefono` varchar(20) DEFAULT NULL,
    `contacto_relacion` varchar(50) DEFAULT NULL,
    `documentos` varchar(255) DEFAULT NULL,
    `familiar_email` varchar(200) DEFAULT NULL,
    `codigo_vinculacion` varchar(10) DEFAULT NULL,
    `permisos` text DEFAULT NULL,
    `fecha_registro` timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE KEY `user_id` (`user_id`),
    FOREIGN KEY (`user_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

if (!$conn->query($create_table)) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al crear tabla: ' . $conn->error
    ]);
    exit();
}

// Insertar o actualizar datos del paciente
$stmt = $conn->prepare("INSERT INTO datos_paciente (
    user_id, fecha_nac, genero, pais, idioma, fecha_diagnostico, 
    medico, tipo_sangre, dieta, alergias, medicacion, 
    contacto_nombre, contacto_telefono, contacto_relacion, 
    documentos, familiar_email, codigo_vinculacion, permisos
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
ON DUPLICATE KEY UPDATE 
    fecha_nac = VALUES(fecha_nac),
    genero = VALUES(genero),
    pais = VALUES(pais),
    idioma = VALUES(idioma),
    fecha_diagnostico = VALUES(fecha_diagnostico),
    medico = VALUES(medico),
    tipo_sangre = VALUES(tipo_sangre),
    dieta = VALUES(dieta),
    alergias = VALUES(alergias),
    medicacion = VALUES(medicacion),
    contacto_nombre = VALUES(contacto_nombre),
    contacto_telefono = VALUES(contacto_telefono),
    contacto_relacion = VALUES(contacto_relacion),
    documentos = VALUES(documentos),
    familiar_email = VALUES(familiar_email),
    codigo_vinculacion = VALUES(codigo_vinculacion),
    permisos = VALUES(permisos)");

$stmt->bind_param('isssssssssssssssss', 
    $user_id, $fecha_nac, $genero, $pais, $idioma, $fecha_diagnostico,
    $medico, $tipo_sangre, $dieta, $alergias, $medicacion,
    $contacto_nombre, $contacto_telefono, $contacto_relacion,
    $documentos, $familiar_email, $codigo_vinculacion, $permisos
);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Datos del paciente guardados correctamente'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Error al guardar datos: ' . $conn->error
    ]);
}

$stmt->close();
$conn->close();
?> 