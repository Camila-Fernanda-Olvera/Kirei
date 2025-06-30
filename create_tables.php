<?php
require_once 'PHP/Conexion.php';

echo "Creating notification tables...\n";

// SQL to create notification tables
$sql_tables = [
    "CREATE TABLE IF NOT EXISTS `notificaciones` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `usuario_id` int(11) NOT NULL,
        `tipo` enum('medicamento','cita','recordatorio','mensaje_familiar','emergencia') NOT NULL,
        `titulo` varchar(200) NOT NULL,
        `mensaje` text NOT NULL,
        `fecha_creacion` timestamp DEFAULT CURRENT_TIMESTAMP,
        `fecha_programada` datetime DEFAULT NULL,
        `estado` enum('pendiente','leida','completada') DEFAULT 'pendiente',
        `prioridad` enum('baja','media','alta') DEFAULT 'media',
        `datos_adicionales` JSON DEFAULT NULL,
        `sonido` varchar(50) DEFAULT 'default',
        `vibracion` tinyint(1) DEFAULT 1,
        PRIMARY KEY (`id`),
        KEY `idx_usuario_fecha` (`usuario_id`, `fecha_creacion`),
        KEY `idx_tipo_estado` (`tipo`, `estado`),
        KEY `idx_fecha_programada` (`fecha_programada`),
        FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

    "CREATE TABLE IF NOT EXISTS `recordatorios_medicamentos` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `medicamento_id` int(11) NOT NULL,
        `usuario_id` int(11) NOT NULL,
        `hora_recordatorio` time NOT NULL,
        `dias_semana` varchar(20) DEFAULT '1,2,3,4,5,6,7',
        `activo` tinyint(1) DEFAULT 1,
        `ultimo_recordatorio` datetime DEFAULT NULL,
        `proximo_recordatorio` datetime DEFAULT NULL,
        `fecha_creacion` timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        KEY `idx_usuario_hora` (`usuario_id`, `hora_recordatorio`),
        KEY `idx_proximo_recordatorio` (`proximo_recordatorio`),
        FOREIGN KEY (`medicamento_id`) REFERENCES `medicamentos`(`id`) ON DELETE CASCADE,
        FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

    "CREATE TABLE IF NOT EXISTS `mensajes_familiares` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `remitente_id` int(11) NOT NULL,
        `destinatario_id` int(11) NOT NULL,
        `mensaje` text NOT NULL,
        `tipo` enum('texto','imagen','audio','ubicacion') DEFAULT 'texto',
        `leido` tinyint(1) DEFAULT 0,
        `fecha_envio` timestamp DEFAULT CURRENT_TIMESTAMP,
        `fecha_lectura` datetime DEFAULT NULL,
        PRIMARY KEY (`id`),
        KEY `idx_remitente` (`remitente_id`),
        KEY `idx_destinatario` (`destinatario_id`),
        KEY `idx_fecha_envio` (`fecha_envio`),
        FOREIGN KEY (`remitente_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE,
        FOREIGN KEY (`destinatario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

    "CREATE TABLE IF NOT EXISTS `configuracion_notificaciones` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `usuario_id` int(11) NOT NULL,
        `tipo_notificacion` enum('medicamento','cita','recordatorio','mensaje_familiar','emergencia') NOT NULL,
        `activo` tinyint(1) DEFAULT 1,
        `sonido` varchar(50) DEFAULT 'default',
        `vibracion` tinyint(1) DEFAULT 1,
        `hora_silencio_inicio` time DEFAULT '22:00:00',
        `hora_silencio_fin` time DEFAULT '07:00:00',
        `frecuencia_recordatorio` int DEFAULT 5,
        `fecha_actualizacion` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        UNIQUE KEY `usuario_tipo` (`usuario_id`, `tipo_notificacion`),
        FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

    "CREATE TABLE IF NOT EXISTS `historial_notificaciones` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `notificacion_id` int(11) NOT NULL,
        `usuario_id` int(11) NOT NULL,
        `fecha_envio` timestamp DEFAULT CURRENT_TIMESTAMP,
        `metodo_envio` enum('toast','push','email','sms') DEFAULT 'toast',
        `estado_envio` enum('enviado','fallido','pendiente') DEFAULT 'enviado',
        `respuesta_usuario` enum('tomar_ahora','posponer','descartar','ninguna') DEFAULT 'ninguna',
        `tiempo_respuesta` int DEFAULT NULL,
        PRIMARY KEY (`id`),
        KEY `idx_notificacion` (`notificacion_id`),
        KEY `idx_usuario_fecha` (`usuario_id`, `fecha_envio`),
        FOREIGN KEY (`notificacion_id`) REFERENCES `notificaciones`(`id`) ON DELETE CASCADE,
        FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
];

foreach ($sql_tables as $sql) {
    if ($conexion->query($sql)) {
        echo "✓ Table created successfully\n";
    } else {
        echo "✗ Error creating table: " . $conexion->error . "\n";
    }
}

$conexion->close();
echo "Tables creation completed.\n";
?> 