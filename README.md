# Kirei - Sistema de Monitoreo de Pacientes con IA

## Descripción
Kirei es una aplicación web innovadora diseñada para el monitoreo de pacientes desde la perspectiva tanto del paciente como de sus familiares, integrando inteligencia artificial para proporcionar asistencia personalizada.

## Características Principales

### Para Pacientes:
- Información detallada sobre su enfermedad
- Recomendaciones personalizadas basadas en IA
- Seguimiento de síntomas y progreso
- Recordatorios de medicamentos y citas

### Para Familiares:
- Guías sobre cómo ayudar al paciente
- Alertas y notificaciones importantes
- Información educativa sobre la enfermedad
- Herramientas de comunicación con el equipo médico

### Funcionalidades de IA:
- Análisis de síntomas y patrones
- Recomendaciones personalizadas
- Predicción de posibles complicaciones
- Asistente virtual para consultas

## Tecnologías Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: PHP
- **Base de Datos**: MySQL
- **IA**: Integración con APIs de inteligencia artificial
- **Framework**: Bootstrap para diseño responsivo

## Estructura del Proyecto
```
Kirei/
├── Index.html          # Página de login
├── Registro.html       # Página de registro
├── CSS/
│   └── Registro.css    # Estilos del sistema
├── JS/
│   ├── Index.js        # Validación de login
│   └── Registro.js     # Validación de registro
├── PHP/
│   ├── Conexion.php    # Archivo de conexión a BD
│   ├── Index.php       # Procesamiento de login
│   └── Registro.php    # Procesamiento de registro
├── database/
│   └── Kirei.sql       # Script completo de la base de datos
└── assets/             # Imágenes y recursos
```

## Instalación

### 1. Configurar el Servidor Web
- Instalar XAMPP, WAMP o similar
- Colocar el proyecto en la carpeta `htdocs` (XAMPP) o `www` (WAMP)

### 2. Configurar la Base de Datos
**Opción A: Usando phpMyAdmin**
1. Abrir phpMyAdmin
2. Crear una nueva base de datos llamada `kirei`
3. Importar el archivo `database/Kirei.sql`

**Opción B: Usando línea de comandos**
```bash
mysql -u root -p < database/Kirei.sql
```

### 3. Configurar la Conexión
Editar el archivo `PHP/Conexion.php` con los datos de tu servidor:
```php
$host = 'localhost';     // Tu servidor de BD
$user = 'root';          // Tu usuario de BD
$pass = '';              // Tu contraseña de BD
$db = 'kirei';           // Nombre de la BD
```

### 4. Acceder a la Aplicación
- Abrir el navegador
- Ir a `http://localhost/Kirei/Index.html`

## Usuarios de Prueba
El script SQL incluye usuarios de prueba:
- **Paciente**: juan@example.com / password
- **Familiar**: maria@example.com / password

## Funcionalidades Actuales
- ✅ Sistema de registro de usuarios (pacientes y familiares)
- ✅ Sistema de login con validación
- ✅ Diseño responsivo con Bootstrap
- ✅ Validación de formularios en JavaScript
- ✅ Conexión segura a base de datos
- ✅ Manejo de sesiones

## Próximas Funcionalidades
- [ ] Dashboard para pacientes
- [ ] Dashboard para familiares
- [ ] Sistema de notificaciones
- [ ] Integración con IA
- [ ] Gestión de medicamentos
- [ ] Seguimiento de síntomas

## Contribución
Este proyecto está en desarrollo activo. Las contribuciones son bienvenidas.

## Licencia
MIT License
