// Wizard Multipasos para Pacientes - Kirei
let currentStep = 1;
let totalSteps = 4;
let datosCompletos = {};

// Inicializar el wizard cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
    setupVinculacionListener();
});

// Función para actualizar la barra de progreso
function updateProgress() {
    const progressBar = document.getElementById('progressBar');
    const progress = (currentStep / totalSteps) * 100;
    progressBar.style.width = progress + '%';
    
    // Actualizar indicadores de pasos
    document.querySelectorAll('.step-dot').forEach((dot, index) => {
        dot.classList.remove('active', 'completed');
        if (index + 1 < currentStep) {
            dot.classList.add('completed');
        } else if (index + 1 === currentStep) {
            dot.classList.add('active');
        }
    });
}

// Función para ir al siguiente paso
function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            document.getElementById('step' + currentStep).classList.remove('active');
            currentStep++;
            document.getElementById('step' + currentStep).classList.add('active');
            updateProgress();
        }
    }
}

// Función para ir al paso anterior
function prevStep() {
    if (currentStep > 1) {
        document.getElementById('step' + currentStep).classList.remove('active');
        currentStep--;
        document.getElementById('step' + currentStep).classList.add('active');
        updateProgress();
    }
}

// Función para validar el paso actual
function validateCurrentStep() {
    const currentStepElement = document.getElementById('step' + currentStep);
    const requiredFields = currentStepElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#dc3545';
            isValid = false;
        } else {
            field.style.borderColor = '#e0e0e0';
        }
    });
    
    if (!isValid) {
        Swal.fire({
            title: 'Campos Requeridos',
            text: 'Por favor completa todos los campos obligatorios',
            icon: 'warning',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#d72660'
        });
    }
    
    return isValid;
}

// Configurar listener para la vinculación
function setupVinculacionListener() {
    const vinculacionSi = document.getElementById('vinculacion_si');
    const vinculacionNo = document.getElementById('vinculacion_no');
    const codigoSection = document.getElementById('codigo_section');
    const permisosSection = document.getElementById('permisos_section');
    
    vinculacionSi.addEventListener('change', function() {
        if (this.checked) {
            codigoSection.style.display = 'block';
            permisosSection.style.display = 'block';
            generarCodigoVinculacion();
        }
    });
    
    vinculacionNo.addEventListener('change', function() {
        if (this.checked) {
            codigoSection.style.display = 'none';
            permisosSection.style.display = 'none';
        }
    });
}

// Generar código de vinculación
function generarCodigoVinculacion() {
    const codigo = Math.random().toString(36).substring(2, 8).toUpperCase();
    document.getElementById('codigo_texto').textContent = codigo;
    return codigo;
}

// Función para completar el registro
async function completarRegistro() {
    if (!validateCurrentStep()) {
        return;
    }
    
    try {
        // Recopilar todos los datos del wizard
        datosCompletos = {
            // Paso 1: Datos personales
            fecha_nac: document.getElementById('fecha_nac').value,
            genero: document.getElementById('genero').value,
            pais: document.getElementById('pais').value,
            idioma: document.getElementById('idioma').value,
            
            // Paso 2: Información médica
            fecha_diagnostico: document.getElementById('fecha_diagnostico').value,
            medico: document.getElementById('medico').value,
            especialidad_medico: document.getElementById('especialidad_medico').value,
            telefono_medico: document.getElementById('telefono_medico').value || '',
            tipo_sangre: document.getElementById('tipo_sangre').value,
            dieta: document.getElementById('dieta').value,
            alergias: document.getElementById('alergias').value || 'Ninguna',
            
            // Paso 3: Medicación y contactos
            medicacion: document.getElementById('medicacion').value || 'Ninguna',
            contacto_nombre: document.getElementById('contacto_nombre').value,
            contacto_telefono: document.getElementById('contacto_telefono').value,
            contacto_relacion: document.getElementById('contacto_relacion').value,
            
            // Paso 4: Vinculación y permisos
            familiar_email: document.getElementById('vinculacion_si').checked ? 'Vinculado' : 'No vinculado',
            codigo_vinculacion: document.getElementById('vinculacion_si').checked ? 
                document.getElementById('codigo_texto').textContent : 'No generado',
            
            // Permisos (solo si quiere vincular)
            sintomas: document.getElementById('vinculacion_si').checked ? document.getElementById('permiso_sintomas').checked : false,
            medicacion_permiso: document.getElementById('vinculacion_si').checked ? document.getElementById('permiso_medicacion').checked : false,
            citas: document.getElementById('vinculacion_si').checked ? document.getElementById('permiso_citas').checked : false,
            ubicacion: document.getElementById('vinculacion_si').checked ? document.getElementById('permiso_ubicacion').checked : false,
            notif_recordatorios: document.getElementById('notif_recordatorios').checked,
            notif_citas: document.getElementById('notif_citas').checked,
            notif_sugerencias: document.getElementById('notif_sugerencias').checked
        };
        
        // Mostrar loading
        Swal.fire({
            title: 'Guardando información...',
            text: 'Por favor espera',
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        // Guardar en base de datos
        await guardarDatosPaciente();
        
    } catch (error) {
        console.error('Error en el registro:', error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema durante el proceso. Por favor intenta nuevamente.',
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#d72660'
        });
    }
}

// Función para guardar todos los datos en la base de datos
async function guardarDatosPaciente() {
    try {
        const response = await fetch('PHP/guardar-paciente.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosCompletos)
        });

        const data = await response.json();
        Swal.close();

        if (data.success) {
            // Si se generó un código de vinculación, guardarlo en la base de datos
            if (datosCompletos.codigo_vinculacion !== 'No generado') {
                await guardarCodigoVinculacion(datosCompletos.codigo_vinculacion);
            }
            
            Swal.fire({
                title: '¡Registro Completado!',
                text: 'Tu información ha sido guardada correctamente. Bienvenido a Kirei.',
                icon: 'success',
                confirmButtonText: 'Comenzar',
                confirmButtonColor: '#d72660',
                timer: 5000,
                timerProgressBar: true
            }).then(() => {
                mostrarDashboardFinal();
            });
        } else {
            throw new Error(data.message || 'Error al guardar los datos');
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire({
            title: 'Error',
            text: 'No se pudieron guardar los datos. Por favor intenta nuevamente.',
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#d72660'
        });
    }
}

// Función para guardar el código de vinculación en la base de datos
async function guardarCodigoVinculacion(codigo) {
    try {
        const response = await fetch('PHP/guardar-codigo-vinculacion.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ codigo: codigo })
        });

        const data = await response.json();
        if (!data.success) {
            console.error('Error al guardar código de vinculación:', data.message);
        }
    } catch (error) {
        console.error('Error al guardar código de vinculación:', error);
    }
}

// Función para mostrar el dashboard final
function mostrarDashboardFinal() {
    const wizardContainer = document.querySelector('.wizard-container');
    wizardContainer.innerHTML = `
        <div class="success-message">
            <div class="success-icon">
                <i class="bi bi-heart-pulse"></i>
            </div>
            <h2 class="success-title">¡Bienvenido a tu Dashboard!</h2>
            <p class="success-text">Tu información ha sido registrada correctamente.</p>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Próximas Citas</h5>
                            <p class="card-text">No tienes citas programadas</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Medicamentos</h5>
                            <p class="card-text">Revisa tu medicación actual</p>
                        </div>
                    </div>
                </div>
            </div>
            <button class="btn-wizard" onclick="window.location.href='Index.html'">Cerrar Sesión</button>
        </div>
    `;
} 