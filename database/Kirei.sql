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

