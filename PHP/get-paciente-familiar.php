<?php
header('Content-Type: application/json');
session_start();
require_once 'Conexion.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
    exit();
}

$user_id = $_SESSION['user_id'];

// Verificar que el usuario es familiar
$stmt = $conexion->prepare('SELECT email, tipo_usuario FROM usuarios WHERE id = ?');
$stmt->bind_param('i', $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user || $user['tipo_usuario'] !== 'familiar') {
    echo json_encode(['success' => false, 'message' => 'Solo familiares pueden acceder a esta información']);
    exit();
}

$email_familiar = $user['email'];

// Buscar paciente vinculado por familiar_email en datos_paciente
$stmt = $conexion->prepare('SELECT u.nombre, u.imagen, u.padecimiento, dp.genero, dp.fecha_nac, dp.pais, dp.tipo_sangre, dp.fecha_diagnostico, dp.medico, dp.especialidad_medico, dp.telefono_medico, dp.dieta, dp.alergias, dp.contacto_nombre, dp.contacto_telefono, dp.contacto_relacion FROM datos_paciente dp INNER JOIN usuarios u ON dp.user_id = u.id WHERE dp.familiar_email = ? LIMIT 1');
$stmt->bind_param('s', $email_familiar);
$stmt->execute();
$result = $stmt->get_result();
$paciente = $result->fetch_assoc();
$stmt->close();

if (!$paciente) {
    echo json_encode(['success' => false, 'message' => 'No se encontró paciente vinculado a este familiar.']);
    exit();
}

// Formatear datos para JS
$paciente['nombre'] = $paciente['nombre'] ?? '';
$paciente['imagen'] = $paciente['imagen'] ?? '';
$paciente['padecimiento'] = $paciente['padecimiento'] ?? '';
$paciente['fecha_nac'] = $paciente['fecha_nac'] ?? '';
$paciente['pais'] = $paciente['pais'] ?? '';
$paciente['tipo_sangre'] = $paciente['tipo_sangre'] ?? '';
$paciente['fecha_diagnostico'] = $paciente['fecha_diagnostico'] ?? '';
$paciente['medico'] = $paciente['medico'] ?? '';
$paciente['especialidad_medico'] = $paciente['especialidad_medico'] ?? '';
$paciente['telefono_medico'] = $paciente['telefono_medico'] ?? '';
$paciente['dieta'] = $paciente['dieta'] ?? '';
$paciente['alergias'] = $paciente['alergias'] ?? '';
$paciente['contacto_nombre'] = $paciente['contacto_nombre'] ?? '';
$paciente['contacto_telefono'] = $paciente['contacto_telefono'] ?? '';
$paciente['contacto_relacion'] = $paciente['contacto_relacion'] ?? '';

// Devolver datos
echo json_encode(['success' => true, 'paciente' => $paciente]);
$conexion->close(); 