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
  `imagen` varchar(255) DEFAULT NULL,
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


