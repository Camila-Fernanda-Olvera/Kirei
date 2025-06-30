<?php
session_start();
require_once 'Conexion.php';

header('Content-Type: application/json');

// Verificar si el usuario está logueado
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
    exit();
}

$user_id = $_SESSION['user_id'];

try {
    $medicamento_id = $_POST['medicamento_id'] ?? 0;
    $hora = $_POST['hora'] ?? '';
    $dias_semana = $_POST['dias_semana'] ?? '1,2,3,4,5,6,7';
    
    if (!$medicamento_id || !$hora) {
        echo json_encode(['success' => false, 'message' => 'Medicamento y hora requeridos']);
        exit();
    }
    
    // Verificar que el medicamento pertenece al usuario
    $sql_verificar = "SELECT id, nombre FROM medicamentos WHERE id = ? AND id_paciente = ?";
    $stmt_verificar = $conexion->prepare($sql_verificar);
    $stmt_verificar->bind_param('ii', $medicamento_id, $user_id);
    $stmt_verificar->execute();
    $result = $stmt_verificar->get_result();
    
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Medicamento no válido']);
        exit();
    }
    
    $medicamento = $result->fetch_assoc();
    
    // Calcular próximo recordatorio
    $proximo_recordatorio = calcularProximoRecordatorio($hora, $dias_semana);
    
    // Verificar si ya existe un recordatorio para este medicamento y hora
    $sql_existe = "SELECT id FROM recordatorios_medicamentos WHERE medicamento_id = ? AND usuario_id = ? AND hora_recordatorio = ?";
    $stmt_existe = $conexion->prepare($sql_existe);
    $stmt_existe->bind_param('iis', $medicamento_id, $user_id, $hora);
    $stmt_existe->execute();
    
    if ($stmt_existe->get_result()->num_rows > 0) {
        echo json_encode(['success' => false, 'message' => 'Ya existe un recordatorio para este medicamento a esta hora']);
        exit();
    }
    
    // Insertar recordatorio
    $sql = "INSERT INTO recordatorios_medicamentos 
            (medicamento_id, usuario_id, hora_recordatorio, dias_semana, proximo_recordatorio) 
            VALUES (?, ?, ?, ?, ?)";
    
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param('iisss', $medicamento_id, $user_id, $hora, $dias_semana, $proximo_recordatorio);
    
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Recordatorio creado correctamente']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al crear recordatorio']);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

function calcularProximoRecordatorio($hora, $dias_semana) {
    $dias = explode(',', $dias_semana);
    $hora_actual = date('H:i:s');
    $dia_actual = date('N'); // 1=Lunes, 7=Domingo
    
    // Si la hora ya pasó hoy, buscar el próximo día
    if ($hora_actual >= $hora) {
        $dia_actual++;
    }
    
    // Buscar el próximo día válido
    $dias_buscados = 0;
    while ($dias_buscados < 7) {
        if (in_array($dia_actual, $dias)) {
            $fecha = date('Y-m-d', strtotime("+{$dias_buscados} days"));
            return $fecha . ' ' . $hora;
        }
        $dia_actual = ($dia_actual % 7) + 1;
        $dias_buscados++;
    }
    
    // Si no se encuentra, usar mañana
    return date('Y-m-d', strtotime('+1 day')) . ' ' . $hora;
}
?> 