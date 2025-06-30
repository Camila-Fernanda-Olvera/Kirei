<?php
header('Content-Type: application/json');

// Log de depuración para saber si llega la petición
file_put_contents(__DIR__ . '/debug_actualizar_perfil.txt', date('Y-m-d H:i:s') . " - INICIO PROCESO\n", FILE_APPEND);
file_put_contents(__DIR__ . '/debug_actualizar_perfil.txt', "POST data: " . print_r($_POST, true) . "\n", FILE_APPEND);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    file_put_contents(__DIR__ . '/debug_actualizar_perfil.txt', "ERROR: Método no permitido\n", FILE_APPEND);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit();
}

session_start();
require_once 'Conexion.php';

if (!isset($_SESSION['user_id'])) {
    file_put_contents(__DIR__ . '/debug_actualizar_perfil.txt', "ERROR: Usuario no autenticado\n", FILE_APPEND);
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
    exit();
}

$user_id = $_SESSION['user_id'];
file_put_contents(__DIR__ . '/debug_actualizar_perfil.txt', "User ID: $user_id\n", FILE_APPEND);

// Verificar que el usuario sea paciente y obtener su nombre
$stmt = $conn->prepare('SELECT nombre, tipo_usuario FROM usuarios WHERE id = ?');
$stmt->bind_param('i', $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();
$stmt->close();

if (!$user || $user['tipo_usuario'] !== 'paciente') {
    file_put_contents(__DIR__ . '/debug_actualizar_perfil.txt', "ERROR: Solo pacientes pueden editar perfil\n", FILE_APPEND);
    echo json_encode(['success' => false, 'message' => 'Solo los pacientes pueden editar perfil médico']);
    exit();
}

$nombre_usuario = $user['nombre'];
file_put_contents(__DIR__ . '/debug_actualizar_perfil.txt', "Usuario: $nombre_usuario\n", FILE_APPEND);

// Obtener datos del formulario
$fecha_diagnostico = $_POST['fecha_diagnostico'] ?? null;
$padecimiento = $_POST['padecimiento'] ?? null;
$tipo_sangre = $_POST['tipo_sangre'] ?? null;
$dieta = $_POST['dieta'] ?? null;
$alergias = $_POST['alergias'] ?? null;
$imagen_base64 = $_POST['imagen_base64'] ?? null;

file_put_contents(__DIR__ . '/debug_actualizar_perfil.txt', "Datos recibidos: fecha=$fecha_diagnostico, padecimiento=$padecimiento, sangre=$tipo_sangre, dieta=$dieta, alergias=$alergias\n", FILE_APPEND);

if ($fecha_diagnostico === null || $padecimiento === null || $tipo_sangre === null || $dieta === null) {
    file_put_contents(__DIR__ . '/debug_actualizar_perfil.txt', "ERROR: Faltan datos obligatorios\n", FILE_APPEND);
    echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios.']);
    exit();
}

// Validar imagen si se envía
if ($imagen_base64) {
    file_put_contents(__DIR__ . '/debug_actualizar_perfil.txt', "Procesando imagen base64...\n", FILE_APPEND);
    if (!preg_match('/^data:image\/(jpeg|png|webp);base64,/', $imagen_base64)) {
        file_put_contents(__DIR__ . '/debug_actualizar_perfil.txt', "ERROR: Formato de imagen no permitido\n", FILE_APPEND);
        echo json_encode(['success' => false, 'message' => 'Formato de imagen no permitido. Solo JPG, PNG o WEBP.']);
        exit();
    }
    $tamano = (int) (strlen($imagen_base64) * 3 / 4);
    if ($tamano > 2 * 1024 * 1024) {
        file_put_contents(__DIR__ . '/debug_actualizar_perfil.txt', "ERROR: Imagen demasiado grande\n", FILE_APPEND);
        echo json_encode(['success' => false, 'message' => 'La imagen es demasiado grande (máx. 2MB).']);
        exit();
    }
}

// Iniciar transacción para asegurar consistencia
$conn->begin_transaction();

try {
    // Guardar imagen si se envía
    if ($imagen_base64) {
        $stmt = $conn->prepare('UPDATE usuarios SET imagen = ? WHERE id = ?');
        $stmt->bind_param('si', $imagen_base64, $user_id);
        if (!$stmt->execute()) {
            throw new Exception('Error al guardar imagen: ' . $conn->error);
        }
        $stmt->close();
        file_put_contents(__DIR__ . '/debug_actualizar_perfil.txt', "Imagen guardada correctamente\n", FILE_APPEND);
    }

    // Actualizar datos médicos
    $stmt = $conn->prepare('UPDATE datos_paciente SET fecha_diagnostico=?, tipo_sangre=?, dieta=?, alergias=? WHERE user_id=?');
    $stmt->bind_param('ssssi', $fecha_diagnostico, $tipo_sangre, $dieta, $alergias, $user_id);
    if (!$stmt->execute()) {
        throw new Exception('Error al guardar datos médicos: ' . $conn->error);
    }
    $stmt->close();
    file_put_contents(__DIR__ . '/debug_actualizar_perfil.txt', "Datos médicos guardados correctamente\n", FILE_APPEND);

    // Actualizar padecimiento en tabla usuarios
    $stmt = $conn->prepare('UPDATE usuarios SET padecimiento=? WHERE id=?');
    $stmt->bind_param('si', $padecimiento, $user_id);
    if (!$stmt->execute()) {
        throw new Exception('Error al guardar padecimiento: ' . $conn->error);
    }
    $stmt->close();
    file_put_contents(__DIR__ . '/debug_actualizar_perfil.txt', "Padecimiento guardado correctamente\n", FILE_APPEND);

    // Confirmar transacción
    $conn->commit();
    
    file_put_contents(__DIR__ . '/debug_actualizar_perfil.txt', "PROCESO COMPLETADO EXITOSAMENTE\n", FILE_APPEND);

    // Enviar respuesta exitosa
    $response = ['success' => true, 'message' => 'Perfil médico actualizado'];
    if ($imagen_base64) $response['imagen'] = $imagen_base64;
    echo json_encode($response);
    
} catch (Exception $e) {
    // Revertir transacción en caso de error
    $conn->rollback();
    file_put_contents(__DIR__ . '/debug_actualizar_perfil.txt', "ERROR: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
} finally {
    $conn->close();
}
?> 