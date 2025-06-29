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

// Verificar que el usuario sea un paciente
$stmt = $conn->prepare('SELECT tipo_usuario FROM usuarios WHERE id = ?');
$stmt->bind_param('i', $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user || $user['tipo_usuario'] !== 'paciente') {
    echo json_encode([
        'success' => false,
        'message' => 'Solo los pacientes pueden guardar datos médicos'
    ]);
    exit();
}

// Extraer solo los datos necesarios (no incluir permisos en los datos principales)
$fecha_nac = $data['fecha_nac'] ?? '';
$genero = $data['genero'] ?? '';
$pais = $data['pais'] ?? '';
$idioma = $data['idioma'] ?? '';
$fecha_diagnostico = $data['fecha_diagnostico'] ?? '';
$medico = $data['medico'] ?? '';
$especialidad_medico = $data['especialidad_medico'] ?? '';
$telefono_medico = $data['telefono_medico'] ?? '';
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

// Extraer solo los permisos específicos
$permisos_data = [
    'sintomas' => $data['sintomas'] ?? false,
    'medicacion' => $data['medicacion_permiso'] ?? false,
    'citas' => $data['citas'] ?? false,
    'ubicacion' => $data['ubicacion'] ?? false,
    'notif_recordatorios' => $data['notif_recordatorios'] ?? false,
    'notif_citas' => $data['notif_citas'] ?? false,
    'notif_sugerencias' => $data['notif_sugerencias'] ?? false
];
$permisos = json_encode($permisos_data);

// Insertar o actualizar datos del paciente (sin medicacion)
$stmt = $conn->prepare("INSERT INTO datos_paciente (
    user_id, fecha_nac, genero, pais, idioma, fecha_diagnostico, 
    medico, especialidad_medico, telefono_medico, tipo_sangre, dieta, alergias, 
    contacto_nombre, contacto_telefono, contacto_relacion, 
    documentos, familiar_email, codigo_vinculacion, permisos
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
ON DUPLICATE KEY UPDATE 
    fecha_nac = VALUES(fecha_nac),
    genero = VALUES(genero),
    pais = VALUES(pais),
    idioma = VALUES(idioma),
    fecha_diagnostico = VALUES(fecha_diagnostico),
    medico = VALUES(medico),
    especialidad_medico = VALUES(especialidad_medico),
    telefono_medico = VALUES(telefono_medico),
    tipo_sangre = VALUES(tipo_sangre),
    dieta = VALUES(dieta),
    alergias = VALUES(alergias),
    contacto_nombre = VALUES(contacto_nombre),
    contacto_telefono = VALUES(contacto_telefono),
    contacto_relacion = VALUES(contacto_relacion),
    documentos = VALUES(documentos),
    familiar_email = VALUES(familiar_email),
    codigo_vinculacion = VALUES(codigo_vinculacion),
    permisos = VALUES(permisos)");

$stmt->bind_param('issssssssssssssssss', 
    $user_id, $fecha_nac, $genero, $pais, $idioma, $fecha_diagnostico,
    $medico, $especialidad_medico, $telefono_medico, $tipo_sangre, $dieta, $alergias,
    $contacto_nombre, $contacto_telefono, $contacto_relacion,
    $documentos, $familiar_email, $codigo_vinculacion, $permisos
);

if ($stmt->execute()) {
    // Procesar medicamentos: cada línea es un medicamento
    if (!empty($medicacion)) {
        // Eliminar medicamentos previos del paciente (para evitar duplicados)
        $conn->query("DELETE FROM medicamentos WHERE id_paciente = $user_id");
        $meds = preg_split('/\r?\n/', $medicacion);
        foreach ($meds as $med) {
            $med = trim($med);
            if ($med !== '') {
                // Por ahora, guardar todo en el campo nombre
                $stmtMed = $conn->prepare("INSERT INTO medicamentos (id_paciente, nombre) VALUES (?, ?)");
                $stmtMed->bind_param('is', $user_id, $med);
                $stmtMed->execute();
                $stmtMed->close();
            }
        }
    }
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