-- =====================================================
-- KIREI - Sistema de Monitoreo de Pacientes
-- Base de Datos - Tabla de Usuarios
-- =====================================================

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS `kirei` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Usar la base de datos
USE `kirei`;

-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL UNIQUE,
  `password` varchar(255) NOT NULL,
  `tipo_usuario` enum('paciente','familiar') NOT NULL,
  `padecimiento` varchar(100) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `fecha_registro` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Crear tabla de datos del paciente
CREATE TABLE IF NOT EXISTS `datos_paciente` (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuarios de prueba
INSERT INTO `usuarios` (`nombre`, `email`, `password`, `tipo_usuario`, `padecimiento`) VALUES
('Juan Pérez', 'juan@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'paciente', 'Diabetes'),
('María García', 'maria@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'familiar', NULL)
ON DUPLICATE KEY UPDATE `nombre` = VALUES(`nombre`);

