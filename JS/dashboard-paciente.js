// Flujo progresivo completo para pacientes
let datosCompletos = {};

// Inicializar el flujo cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    iniciarFlujoPaciente();
});

// Función principal que inicia todo el flujo
async function iniciarFlujoPaciente() {
    try {
        // Paso 1: Datos personales
        const datosPersonales = await mostrarDatosPersonales();
        if (!datosPersonales) return;
        
        // Paso 2: Cuestionario médico progresivo
        const datosMedicos = await mostrarCuestionarioMedico();
        if (!datosMedicos) return;
        
        // Paso 3: Permisos y configuración
        const permisos = await mostrarPermisos();
        if (!permisos) return;
        
        // Combinar todos los datos
        datosCompletos = {
            ...datosPersonales,
            ...datosMedicos,
            ...permisos
        };
        
        // Guardar en base de datos
        await guardarDatosPaciente();
        
    } catch (error) {
        console.error('Error en el flujo:', error);
        Swal.fire({
            title: 'Error',
            text: 'Hubo un problema durante el proceso. Por favor intenta nuevamente.',
            icon: 'error',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#d72660'
        });
    }
}

// Paso 1: Datos personales
async function mostrarDatosPersonales() {
    const { value: formValues } = await Swal.fire({
        title: 'Datos Personales',
        html: `
            <div style="text-align: left; margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Fecha de nacimiento</label>
                <input id="swal-fecha-nac" type="date" class="swal2-input" required>
            </div>
            <div style="text-align: left; margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Género</label>
                <select id="swal-genero" class="swal2-input" required>
                    <option value="">Selecciona tu género</option>
                    <option value="femenino">Femenino</option>
                    <option value="masculino">Masculino</option>
                    <option value="otro">Otro</option>
                </select>
            </div>
            <div style="text-align: left; margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">País</label>
                <input id="swal-pais" class="swal2-input" placeholder="Tu país" required>
            </div>
            <div style="text-align: left;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Idioma preferido</label>
                <select id="swal-idioma" class="swal2-input" required>
                    <option value="es">Español</option>
                    <option value="en">Inglés</option>
                </select>
            </div>
        `,
        focusConfirm: false,
        confirmButtonText: 'Siguiente',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
        preConfirm: () => {
            const fecha_nac = document.getElementById('swal-fecha-nac').value;
            const genero = document.getElementById('swal-genero').value;
            const pais = document.getElementById('swal-pais').value.trim();
            const idioma = document.getElementById('swal-idioma').value;
            
            if (!fecha_nac || !genero || !pais || !idioma) {
                Swal.showValidationMessage('Completa todos los campos');
                return false;
            }
            
            return { fecha_nac, genero, pais, idioma };
        }
    });
    
    return formValues;
}

// Paso 2: Cuestionario médico progresivo
async function mostrarCuestionarioMedico() {
    const datosMedicos = {};
    
    // Subpaso 2.1: Información básica médica
    const infoBasica = await Swal.fire({
        title: 'Información Médica Básica',
        html: `
            <div style="text-align: left; margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Fecha de diagnóstico</label>
                <input id="swal-fecha-diagnostico" type="date" class="swal2-input" required>
            </div>
            <div style="text-align: left; margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Médico tratante</label>
                <input id="swal-medico" class="swal2-input" placeholder="Nombre del médico" required>
            </div>
            <div style="text-align: left;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Tipo de sangre</label>
                <select id="swal-tipo-sangre" class="swal2-input" required>
                    <option value="">Selecciona tu tipo de sangre</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                </select>
            </div>
        `,
        focusConfirm: false,
        confirmButtonText: 'Siguiente',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
        preConfirm: () => {
            const fecha_diagnostico = document.getElementById('swal-fecha-diagnostico').value;
            const medico = document.getElementById('swal-medico').value.trim();
            const tipo_sangre = document.getElementById('swal-tipo-sangre').value;
            
            if (!fecha_diagnostico || !medico || !tipo_sangre) {
                Swal.showValidationMessage('Completa todos los campos');
                return false;
            }
            
            return { fecha_diagnostico, medico, tipo_sangre };
        }
    });
    
    if (!infoBasica.value) return null;
    Object.assign(datosMedicos, infoBasica.value);
    
    // Subpaso 2.2: Dieta y alergias
    const dietaAlergias = await Swal.fire({
        title: 'Dieta y Alergias',
        html: `
            <div style="text-align: left; margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Tipo de dieta</label>
                <select id="swal-dieta" class="swal2-input" required>
                    <option value="">Selecciona tu dieta</option>
                    <option value="normal">Dieta normal</option>
                    <option value="baja_sodio">Baja en sodio</option>
                    <option value="baja_azucar">Baja en azúcar</option>
                    <option value="sin_gluten">Sin gluten</option>
                    <option value="vegetariana">Vegetariana</option>
                    <option value="vegana">Vegana</option>
                    <option value="otra">Otra</option>
                </select>
            </div>
            <div style="text-align: left;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Alergias (separadas por comas)</label>
                <textarea id="swal-alergias" class="swal2-input" placeholder="Ej: penicilina, polen, mariscos..." style="height: 80px; resize: none;"></textarea>
            </div>
        `,
        focusConfirm: false,
        confirmButtonText: 'Siguiente',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
        preConfirm: () => {
            const dieta = document.getElementById('swal-dieta').value;
            const alergias = document.getElementById('swal-alergias').value.trim();
            
            if (!dieta) {
                Swal.showValidationMessage('Selecciona tu tipo de dieta');
                return false;
            }
            
            return { dieta, alergias: alergias || 'Ninguna' };
        }
    });
    
    if (!dietaAlergias.value) return null;
    Object.assign(datosMedicos, dietaAlergias.value);
    
    // Subpaso 2.3: Medicación actual
    const medicacion = await Swal.fire({
        title: 'Medicación Actual',
        html: `
            <div style="text-align: left;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Medicamentos que tomas actualmente</label>
                <textarea id="swal-medicacion" class="swal2-input" placeholder="Lista tus medicamentos con dosis y frecuencia..." style="height: 100px; resize: none;"></textarea>
            </div>
        `,
        focusConfirm: false,
        confirmButtonText: 'Siguiente',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
        preConfirm: () => {
            const medicacion_texto = document.getElementById('swal-medicacion').value.trim();
            return { medicacion: medicacion_texto || 'Ninguna' };
        }
    });
    
    if (!medicacion.value) return null;
    Object.assign(datosMedicos, medicacion.value);
    
    // Subpaso 2.4: Contactos de emergencia
    const contactos = await Swal.fire({
        title: 'Contactos de Emergencia',
        html: `
            <div style="text-align: left; margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Nombre del contacto principal</label>
                <input id="swal-contacto-nombre" class="swal2-input" placeholder="Nombre completo" required>
            </div>
            <div style="text-align: left; margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Teléfono</label>
                <input id="swal-contacto-telefono" class="swal2-input" placeholder="Número de teléfono" required>
            </div>
            <div style="text-align: left;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Relación</label>
                <select id="swal-contacto-relacion" class="swal2-input" required>
                    <option value="">Selecciona la relación</option>
                    <option value="esposo">Esposo/a</option>
                    <option value="hijo">Hijo/a</option>
                    <option value="padre">Padre</option>
                    <option value="madre">Madre</option>
                    <option value="hermano">Hermano/a</option>
                    <option value="amigo">Amigo/a</option>
                    <option value="otro">Otro</option>
                </select>
            </div>
        `,
        focusConfirm: false,
        confirmButtonText: 'Siguiente',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
        preConfirm: () => {
            const contacto_nombre = document.getElementById('swal-contacto-nombre').value.trim();
            const contacto_telefono = document.getElementById('swal-contacto-telefono').value.trim();
            const contacto_relacion = document.getElementById('swal-contacto-relacion').value;
            
            if (!contacto_nombre || !contacto_telefono || !contacto_relacion) {
                Swal.showValidationMessage('Completa todos los campos');
                return false;
            }
            
            return { 
                contacto_nombre, 
                contacto_telefono, 
                contacto_relacion 
            };
        }
    });
    
    if (!contactos.value) return null;
    Object.assign(datosMedicos, contactos.value);
    
    // Subpaso 2.5: Subida de documentos
    const documentos = await Swal.fire({
        title: 'Documentos Médicos',
        html: `
            <div style="text-align: left; margin-bottom: 15px;">
                <p style="font-size: 14px; color: #666;">Puedes subir documentos médicos importantes como:</p>
                <ul style="text-align: left; font-size: 14px; color: #666;">
                    <li>Recetas médicas</li>
                    <li>Resultados de laboratorio</li>
                    <li>Historial médico</li>
                    <li>Otros documentos relevantes</li>
                </ul>
            </div>
            <div style="text-align: left;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Subir documentos (opcional)</label>
                <input id="swal-documentos" type="file" class="swal2-input" multiple accept=".pdf,.jpg,.jpeg,.png">
            </div>
        `,
        focusConfirm: false,
        confirmButtonText: 'Siguiente',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
        preConfirm: () => {
            const documentos_files = document.getElementById('swal-documentos').files;
            return { documentos: documentos_files.length > 0 ? 'Subidos' : 'Ninguno' };
        }
    });
    
    if (!documentos.value) return null;
    Object.assign(datosMedicos, documentos.value);
    
    // Subpaso 2.6: Vinculación con familiar
    const vinculacion = await Swal.fire({
        title: 'Vinculación con Familiar',
        html: `
            <div style="text-align: left; margin-bottom: 15px;">
                <p style="font-size: 14px; color: #666;">¿Deseas vincular tu cuenta con un familiar para que pueda monitorear tu salud?</p>
            </div>
            <div style="text-align: left; margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Email del familiar</label>
                <input id="swal-familiar-email" class="swal2-input" placeholder="email@ejemplo.com" type="email">
            </div>
            <div style="text-align: left;">
                <label style="display: block; margin-bottom: 5px; font-weight: 600;">Código de vinculación</label>
                <input id="swal-codigo-vinculacion" class="swal2-input" placeholder="Código de 6 dígitos" maxlength="6">
            </div>
        `,
        focusConfirm: false,
        confirmButtonText: 'Siguiente',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
        preConfirm: () => {
            const familiar_email = document.getElementById('swal-familiar-email').value.trim();
            const codigo_vinculacion = document.getElementById('swal-codigo-vinculacion').value.trim();
            
            return { 
                familiar_email: familiar_email || 'No vinculado',
                codigo_vinculacion: codigo_vinculacion || 'No generado'
            };
        }
    });
    
    if (!vinculacion.value) return null;
    Object.assign(datosMedicos, vinculacion.value);
    
    return datosMedicos;
}

// Paso 3: Permisos y configuración
async function mostrarPermisos() {
    const permisos = await Swal.fire({
        title: 'Permisos y Configuración',
        html: `
            <div style="text-align: left; margin-bottom: 20px;">
                <h6 style="margin-bottom: 10px;">¿Qué datos puede ver tu familiar?</h6>
                <div style="margin-bottom: 10px;">
                    <input type="checkbox" id="permiso-sintomas" checked>
                    <label for="permiso-sintomas" style="margin-left: 8px;">Síntomas y progreso</label>
                </div>
                <div style="margin-bottom: 10px;">
                    <input type="checkbox" id="permiso-medicacion" checked>
                    <label for="permiso-medicacion" style="margin-left: 8px;">Medicación</label>
                </div>
                <div style="margin-bottom: 10px;">
                    <input type="checkbox" id="permiso-citas" checked>
                    <label for="permiso-citas" style="margin-left: 8px;">Citas médicas</label>
                </div>
                <div style="margin-bottom: 10px;">
                    <input type="checkbox" id="permiso-ubicacion">
                    <label for="permiso-ubicacion" style="margin-left: 8px;">Ubicación (en emergencias)</label>
                </div>
            </div>
            <div style="text-align: left; margin-bottom: 20px;">
                <h6 style="margin-bottom: 10px;">Notificaciones</h6>
                <div style="margin-bottom: 10px;">
                    <input type="checkbox" id="notif-recordatorios" checked>
                    <label for="notif-recordatorios" style="margin-left: 8px;">Recordatorios de medicación</label>
                </div>
                <div style="margin-bottom: 10px;">
                    <input type="checkbox" id="notif-citas" checked>
                    <label for="notif-citas" style="margin-left: 8px;">Recordatorios de citas</label>
                </div>
                <div style="margin-bottom: 10px;">
                    <input type="checkbox" id="notif-sugerencias">
                    <label for="notif-sugerencias" style="margin-left: 8px;">Sugerencias de IA</label>
                </div>
            </div>
        `,
        focusConfirm: false,
        confirmButtonText: 'Completar Registro',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        allowOutsideClick: false,
        preConfirm: () => {
            const permisos_data = {
                sintomas: document.getElementById('permiso-sintomas').checked,
                medicacion_permiso: document.getElementById('permiso-medicacion').checked,
                citas: document.getElementById('permiso-citas').checked,
                ubicacion: document.getElementById('permiso-ubicacion').checked,
                notif_recordatorios: document.getElementById('notif-recordatorios').checked,
                notif_citas: document.getElementById('notif-citas').checked,
                notif_sugerencias: document.getElementById('notif-sugerencias').checked
            };
            
            return permisos_data;
        }
    });
    
    return permisos.value;
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

        if (data.success) {
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

// Función para mostrar el dashboard final
function mostrarDashboardFinal() {
    const dashboardContent = document.getElementById('dashboard-content');
    dashboardContent.innerHTML = `
        <div class="text-center">
            <i class="bi bi-heart-pulse" style="font-size: 3rem; color: #d72660; margin-bottom: 20px;"></i>
            <h3>¡Bienvenido a tu Dashboard!</h3>
            <p class="mb-4">Tu información ha sido registrada correctamente.</p>
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
            <button class="btn btn-primary" onclick="window.location.href='Index.html'">Cerrar Sesión</button>
        </div>
    `;
} 