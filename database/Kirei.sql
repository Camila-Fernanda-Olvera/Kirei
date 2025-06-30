-- =====================================================
-- KIREI - Sistema de Monitoreo de Pacientes
-- Base de Datos - Tablas Actualizadas (Medicamentos, Citas, Bienestar, Parentesco)
-- =====================================================

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS `kirei` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE `kirei`;

-- Crear tabla de usuarios (ahora con parentesco)
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `tipo_usuario` enum('paciente','familiar') NOT NULL,
  `padecimiento` varchar(100) DEFAULT NULL,
  `parentesco` varchar(50) DEFAULT NULL, -- Nuevo campo
  `imagen` LONGTEXT DEFAULT NULL,
  `fecha_registro` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de datos del paciente (sin medicacion)
CREATE TABLE IF NOT EXISTS `datos_paciente` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `fecha_nac` date DEFAULT NULL,
  `genero` varchar(20) DEFAULT NULL,
  `pais` varchar(100) DEFAULT NULL,
  `idioma` varchar(10) DEFAULT NULL,
  `fecha_diagnostico` date DEFAULT NULL,
  `medico` varchar(200) DEFAULT NULL,
  `especialidad_medico` varchar(100) DEFAULT NULL,
  `telefono_medico` varchar(20) DEFAULT NULL,
  `tipo_sangre` varchar(10) DEFAULT NULL,
  `dieta` varchar(50) DEFAULT NULL,
  `alergias` text DEFAULT NULL,
  -- `medicacion` text DEFAULT NULL, -- Eliminado, ahora en tabla medicamentos
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla medicamentos
CREATE TABLE IF NOT EXISTS `medicamentos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_paciente` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `dosis` varchar(100) DEFAULT NULL,
  `frecuencia` varchar(100) DEFAULT NULL,
  `horarios` varchar(100) DEFAULT NULL,
  `inicio` date DEFAULT NULL,
  `fin` date DEFAULT NULL,
  `indicaciones` text DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_paciente`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla citas
CREATE TABLE IF NOT EXISTS `citas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_paciente` int(11) NOT NULL,
  `medico` varchar(200) NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `estado` enum('Pendiente','Cancelada','Atendida') DEFAULT 'Pendiente',
  `motivo` varchar(255) DEFAULT NULL,
  `especialidad` varchar(100) DEFAULT NULL,
  `sede` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_paciente`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla bienestar
CREATE TABLE IF NOT EXISTS `bienestar` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_paciente` int(11) NOT NULL,
  `glucosa` float DEFAULT NULL,
  `presion_arterial` varchar(20) DEFAULT NULL,
  `frecuencia_cardiaca` int DEFAULT NULL,
  `pasos_diarios` int DEFAULT NULL,
  `saturacion_oxigeno` float DEFAULT NULL,
  `peso` float DEFAULT NULL,
  `imc` float DEFAULT NULL,
  `temperatura_corporal` float DEFAULT NULL,
  `fecha_registro` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`id_paciente`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla para códigos de vinculación
CREATE TABLE IF NOT EXISTS `codigos_vinculacion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(10) NOT NULL UNIQUE,
  `user_id` int(11) NOT NULL,
  `fecha_creacion` timestamp DEFAULT CURRENT_TIMESTAMP,
  `fecha_expiracion` timestamp NULL DEFAULT NULL,
  `usado` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- SISTEMA DE NOTIFICACIONES
-- =====================================================

-- Tabla principal de notificaciones
CREATE TABLE IF NOT EXISTS `notificaciones` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para recordatorios de medicamentos programados
CREATE TABLE IF NOT EXISTS `recordatorios_medicamentos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `medicamento_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `hora_recordatorio` time NOT NULL,
  `dias_semana` varchar(20) DEFAULT '1,2,3,4,5,6,7', -- 1=Lunes, 7=Domingo
  `activo` tinyint(1) DEFAULT 1,
  `ultimo_recordatorio` datetime DEFAULT NULL,
  `proximo_recordatorio` datetime DEFAULT NULL,
  `fecha_creacion` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_usuario_hora` (`usuario_id`, `hora_recordatorio`),
  KEY `idx_proximo_recordatorio` (`proximo_recordatorio`),
  FOREIGN KEY (`medicamento_id`) REFERENCES `medicamentos`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para mensajes entre familiares
CREATE TABLE IF NOT EXISTS `mensajes_familiares` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para configuración de notificaciones por usuario
CREATE TABLE IF NOT EXISTS `configuracion_notificaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `tipo_notificacion` enum('medicamento','cita','recordatorio','mensaje_familiar','emergencia') NOT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `sonido` varchar(50) DEFAULT 'default',
  `vibracion` tinyint(1) DEFAULT 1,
  `hora_silencio_inicio` time DEFAULT '22:00:00',
  `hora_silencio_fin` time DEFAULT '07:00:00',
  `frecuencia_recordatorio` int DEFAULT 5, -- minutos
  `fecha_actualizacion` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_tipo` (`usuario_id`, `tipo_notificacion`),
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para historial de notificaciones enviadas
CREATE TABLE IF NOT EXISTS `historial_notificaciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `notificacion_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `fecha_envio` timestamp DEFAULT CURRENT_TIMESTAMP,
  `metodo_envio` enum('toast','push','email','sms') DEFAULT 'toast',
  `estado_envio` enum('enviado','fallido','pendiente') DEFAULT 'enviado',
  `respuesta_usuario` enum('tomar_ahora','posponer','descartar','ninguna') DEFAULT 'ninguna',
  `tiempo_respuesta` int DEFAULT NULL, -- segundos
  PRIMARY KEY (`id`),
  KEY `idx_notificacion` (`notificacion_id`),
  KEY `idx_usuario_fecha` (`usuario_id`, `fecha_envio`),
  FOREIGN KEY (`notificacion_id`) REFERENCES `notificaciones`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


