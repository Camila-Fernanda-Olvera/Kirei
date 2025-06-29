// Dashboard del Paciente - Kirei
document.addEventListener('DOMContentLoaded', async function() {
    actualizarIdiomaSelector();
    try {
        const response = await fetch('PHP/verificar-perfil.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const data = await response.json();
        if (data.success && data.perfil_completo && data.datos) {
            actualizarInterfaz(data.datos);
            // Medicamentos
            if (Array.isArray(data.medicamentos)) {
                renderizarMedicamentos(data.medicamentos);
            } else {
                renderizarMedicamentos([]);
            }
            // Notificaciones (simulado, reemplazar por datos reales si existen)
            renderizarNotificaciones(data.notificaciones || []);
            // Familia (simulado, reemplazar por datos reales si existen)
            renderizarFamilia(data.familia || []);
        } else {
            // Si no hay datos, mostrar "Sin información" en cada sección
            renderizarMedicamentos([]);
            renderizarNotificaciones([]);
            renderizarFamilia([]);
        }
    } catch (error) {
        renderizarMedicamentos([]);
        renderizarNotificaciones([]);
        renderizarFamilia([]);
    }
});

// Función para actualizar el selector de idioma
function actualizarIdiomaSelector() {
    const currentLanguageSpan = document.getElementById('currentLanguage');
    if (currentLanguageSpan) {
        currentLanguageSpan.textContent = window.i18n.getCurrentLanguage().toUpperCase();
    }
}

// Función para cambiar idioma
function toggleLanguage() {
    const newLanguage = window.i18n.toggleLanguage();
    actualizarIdiomaSelector();
    
    // Mostrar notificación de cambio de idioma
    Swal.fire({
        title: newLanguage === 'es' ? 'Idioma Cambiado' : 'Language Changed',
        text: newLanguage === 'es' ? 'El idioma ha sido cambiado a Español' : 'Language has been changed to English',
        icon: 'success',
        confirmButtonText: newLanguage === 'es' ? 'Entendido' : 'Understood',
        confirmButtonColor: '#d72660',
        timer: 2000,
        timerProgressBar: true
    });
}

// Función para actualizar la interfaz con los datos del paciente
function actualizarInterfaz(datos) {
    // Calcular edad
    const fechaNac = new Date(datos.fecha_nac);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    const edadFinal = mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate()) ? edad - 1 : edad;
    
    // Utilidad para setear texto si existe el elemento
    function setText(id, value) {
        const el = document.getElementById(id);
        if (el) el.textContent = value && value.trim() !== '' ? value : (window.i18n.isSpanish() ? 'No especificado' : 'Not specified');
    }

    setText('patientName', datos.nombre || '');
    setText('patientAge', `${edadFinal} ${window.i18n.isSpanish() ? 'años' : 'years'}`);
    setText('patientGender', datos.genero || '');
    setText('patientCountry', datos.pais || '');
    setText('patientLanguage', datos.idioma === 'en' ? 'Inglés' : 'Español');
    setText('bloodType', datos.tipo_sangre || '');
    setText('condition', datos.padecimiento || '');
    setText('diagnosisDate', datos.fecha_diagnostico || '');
    setText('doctorName', datos.medico || '');
    setText('doctorSpecialty', datos.especialidad_medico || '');
    setText('doctorPhone', datos.telefono_medico || '');
    // Traducir dieta
    setText('patientDiet', traducirDieta(datos.dieta));
    setText('allergies', datos.alergias || (window.i18n.isSpanish() ? 'Ninguna' : 'None'));
    setText('emergencyContact', `${datos.contacto_nombre || ''} (${datos.contacto_relacion || ''})`);
    setText('emergencyPhone', datos.contacto_telefono || '');
}

// Traducción de valores de dieta
function traducirDieta(valor) {
    if (!valor || valor.trim() === '') return window.i18n.isSpanish() ? 'No especificado' : 'Not specified';
    const map = {
        'normal': window.i18n.isSpanish() ? 'Dieta normal' : 'Normal diet',
        'baja_sodio': window.i18n.isSpanish() ? 'Baja en sodio' : 'Low sodium',
        'baja_azucar': window.i18n.isSpanish() ? 'Baja en azúcar' : 'Low sugar',
        'sin_gluten': window.i18n.isSpanish() ? 'Sin gluten' : 'Gluten free',
        'vegetariana': window.i18n.isSpanish() ? 'Vegetariana' : 'Vegetarian',
        'vegana': window.i18n.isSpanish() ? 'Vegana' : 'Vegan',
        'otra': window.i18n.isSpanish() ? 'Otra' : 'Other'
    };
    return map[valor] || valor;
}

// Función para editar perfil médico
function editarPerfil() {
    // Obtener datos actuales del paciente (puedes ajustar según tu estructura)
    const datos = window.datosPaciente || {};
    Swal.fire({
        title: 'Editar información médica',
        html: `
            <div style="display: flex; flex-direction: column; align-items: center; gap: 1.2rem;">
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <img id="preview-img" src="${datos.imagen || 'https://via.placeholder.com/110'}" alt="Foto de perfil" style="width: 110px; height: 110px; border-radius: 50%; border: 4px solid #ff9800; object-fit: cover; margin-bottom: 0.5rem;">
                    <input type="file" id="input-img" accept="image/*" style="display:none">
                    <button type="button" id="btn-img" class="btn btn-outline-primary" style="margin-top: 0.2rem; font-size: 1rem; padding: 0.4rem 1.2rem;">Cambiar foto</button>
                </div>
                <input type="date" id="fechaDiagnostico" class="swal2-input" value="${datos.fecha_diagnostico || ''}" placeholder="Fecha de diagnóstico">
                <input type="text" id="padecimiento" class="swal2-input" value="${datos.padecimiento || ''}" placeholder="Padecimiento">
                <select id="tipoSangre" class="swal2-input">
                    <option value="">Tipo de sangre</option>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="O+">O+</option><option value="O-">O-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                </select>
                <select id="tipoDieta" class="swal2-input">
                    <option value="">Tipo de dieta</option>
                    <option value="normal">Normal</option>
                    <option value="baja_azucar">Baja en azúcar</option>
                    <option value="baja_grasa">Baja en grasa</option>
                    <option value="baja_sal">Baja en sal</option>
                    <option value="vegetariana">Vegetariana</option>
                    <option value="otra">Otra</option>
                </select>
                <input type="text" id="alergias" class="swal2-input" value="${datos.alergias || ''}" placeholder="Alergias">
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        customClass: {
            popup: 'swal2-large-modal',
            confirmButton: 'btn btn-outline-primary',
            cancelButton: 'btn btn-secondary'
        },
        didOpen: () => {
            // Preseleccionar valores
            document.getElementById('tipoSangre').value = datos.tipo_sangre || '';
            document.getElementById('tipoDieta').value = datos.dieta || '';
            // Imagen de perfil
            document.getElementById('btn-img').onclick = () => document.getElementById('input-img').click();
            document.getElementById('input-img').onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        document.getElementById('preview-img').src = ev.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            };
        },
        preConfirm: async () => {
            const fechaDiagnostico = document.getElementById('fechaDiagnostico').value;
            const tipoSangre = document.getElementById('tipoSangre').value;
            const tipoDieta = document.getElementById('tipoDieta').value;
            const alergias = document.getElementById('alergias').value;
            const padecimiento = document.getElementById('padecimiento').value;
            const imgInput = document.getElementById('input-img');
            let imagen = null;
            if (imgInput.files && imgInput.files[0]) {
                imagen = imgInput.files[0];
            }
            if (!fechaDiagnostico || !tipoSangre || !tipoDieta || !padecimiento) {
                Swal.showValidationMessage('Por favor completa todos los campos obligatorios');
                return false;
            }
            // Enviar datos al backend
            const formData = new FormData();
            formData.append('fecha_diagnostico', fechaDiagnostico);
            formData.append('tipo_sangre', tipoSangre);
            formData.append('dieta', tipoDieta);
            formData.append('alergias', alergias);
            formData.append('padecimiento', padecimiento);
            if (imagen) formData.append('imagen', imagen);
            try {
                const res = await fetch('PHP/actualizar-perfil-medico.php', {
                    method: 'POST',
                    body: formData
                });
                const result = await res.json();
                if (!result.success) throw new Error(result.message || 'Error al guardar');
                return true;
            } catch (err) {
                Swal.showValidationMessage('Error al guardar: ' + err.message);
                return false;
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('¡Guardado!', 'Tu información médica ha sido actualizada.', 'success').then(() => {
                location.reload();
            });
        }
    });
}

function configuracion() {
    Swal.fire({
        title: window.i18n.t('functions.settings'),
        text: window.i18n.t('functions.settings.text'),
        icon: 'info',
        confirmButtonText: window.i18n.t('messages.understood'),
        confirmButtonColor: '#d72660'
    });
}

function agregarCita() {
    Swal.fire({
        title: window.i18n.t('functions.add.appointment'),
        text: window.i18n.t('functions.add.appointment.text'),
        icon: 'info',
        confirmButtonText: window.i18n.t('messages.understood'),
        confirmButtonColor: '#d72660'
    });
}

function agregarMedicamento() {
    Swal.fire({
        title: window.i18n.t('functions.add.medication'),
        text: window.i18n.t('functions.add.medication.text'),
        icon: 'info',
        confirmButtonText: window.i18n.t('messages.understood'),
        confirmButtonColor: '#d72660'
    });
}

function emergencia() {
    Swal.fire({
        title: window.i18n.t('functions.emergency'),
        text: window.i18n.t('functions.emergency.text'),
        icon: 'warning',
        confirmButtonText: window.i18n.t('messages.understood'),
        confirmButtonColor: '#dc3545',
        background: '#fff3cd',
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    });
}

function cerrarSesion() {
    Swal.fire({
        title: window.i18n.t('functions.logout'),
        text: window.i18n.t('functions.logout.text'),
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: window.i18n.isSpanish() ? 'Sí, Salir' : 'Yes, Exit',
        cancelButtonText: window.i18n.t('functions.cancel'),
        confirmButtonColor: '#d72660',
        cancelButtonColor: '#6c757d'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch('PHP/cerrar-sesion.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const data = await response.json();
                if (data.success) {
                    window.location.href = 'Index.html';
                } else {
                    // Si hay error, redirigir de todas formas
                    window.location.href = 'Index.html';
                }
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
                // Si hay error, redirigir de todas formas
                window.location.href = 'Index.html';
            }
        }
    });
}

// Event listeners para botones dinámicos
document.addEventListener('click', function(e) {
    // Botones de recordatorio de citas
    if (e.target.closest('.appointment-actions .btn-outline-primary')) {
        const appointmentItem = e.target.closest('.appointment-item');
        const appointmentTitle = appointmentItem.querySelector('h6').textContent;
        Swal.fire({
            title: window.i18n.isSpanish() ? 'Recordatorio Configurado' : 'Reminder Set',
            text: window.i18n.isSpanish() ? 
                `Se configuró un recordatorio para: ${appointmentTitle}` : 
                `Reminder set for: ${appointmentTitle}`,
            icon: 'success',
            confirmButtonText: window.i18n.t('messages.understood'),
            confirmButtonColor: '#d72660'
        });
    }
    
    // Botones de eliminar citas
    if (e.target.closest('.appointment-actions .btn-outline-danger')) {
        const appointmentItem = e.target.closest('.appointment-item');
        const appointmentTitle = appointmentItem.querySelector('h6').textContent;
        
        Swal.fire({
            title: window.i18n.isSpanish() ? '¿Eliminar Cita?' : 'Delete Appointment?',
            text: window.i18n.isSpanish() ? 
                `¿Estás seguro de eliminar: ${appointmentTitle}?` : 
                `Are you sure you want to delete: ${appointmentTitle}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: window.i18n.isSpanish() ? 'Sí, Eliminar' : 'Yes, Delete',
            cancelButtonText: window.i18n.t('functions.cancel'),
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d'
        }).then((result) => {
            if (result.isConfirmed) {
                appointmentItem.remove();
                Swal.fire({
                    title: window.i18n.isSpanish() ? 'Cita Eliminada' : 'Appointment Deleted',
                    text: window.i18n.isSpanish() ? 
                        'La cita ha sido eliminada correctamente' : 
                        'The appointment has been deleted successfully',
                    icon: 'success',
                    confirmButtonText: window.i18n.t('messages.understood'),
                    confirmButtonColor: '#d72660'
                });
            }
        });
    }
    
    // Botones de marcar medicamento como tomado
    if (e.target.closest('.medication-actions .btn-outline-success')) {
        const medicationItem = e.target.closest('.medication-item');
        const medicationName = medicationItem.querySelector('h6').textContent;
        const statusBadge = medicationItem.querySelector('.badge');
        
        statusBadge.textContent = window.i18n.t('status.taken');
        statusBadge.className = 'badge bg-success';
        
        Swal.fire({
            title: window.i18n.isSpanish() ? 'Medicamento Registrado' : 'Medication Recorded',
            text: window.i18n.isSpanish() ? 
                `${medicationName} marcado como tomado` : 
                `${medicationName} marked as taken`,
            icon: 'success',
            confirmButtonText: window.i18n.t('messages.understood'),
            confirmButtonColor: '#d72660'
        });
    }
    
    // Botones de editar medicamento
    if (e.target.closest('.medication-actions .btn-outline-warning')) {
        const medicationItem = e.target.closest('.medication-item');
        const medicationName = medicationItem.querySelector('h6').textContent;
        
        Swal.fire({
            title: window.i18n.isSpanish() ? 'Editar Medicamento' : 'Edit Medication',
            text: window.i18n.isSpanish() ? 
                `Editar configuración de: ${medicationName}` : 
                `Edit configuration for: ${medicationName}`,
            icon: 'info',
            confirmButtonText: window.i18n.t('messages.understood'),
            confirmButtonColor: '#d72660'
        });
    }
    
    // Botones de chat con familiares
    if (e.target.closest('.member-actions .btn-outline-primary')) {
        const memberItem = e.target.closest('.family-member');
        const memberName = memberItem.querySelector('h6').textContent;
        
        Swal.fire({
            title: window.i18n.isSpanish() ? 'Chat Familiar' : 'Family Chat',
            text: window.i18n.isSpanish() ? 
                `Iniciar chat con ${memberName}` : 
                `Start chat with ${memberName}`,
            icon: 'info',
            confirmButtonText: window.i18n.t('messages.understood'),
            confirmButtonColor: '#d72660'
        });
    }
    
    // Botón de marcar todas las notificaciones
    if (e.target.closest('#notificationsBtn') || e.target.closest('.btn-outline-secondary')) {
        const unreadNotifications = document.querySelectorAll('.notification-item.unread');
        unreadNotifications.forEach(notification => {
            notification.classList.remove('unread');
        });
        
        Swal.fire({
            title: window.i18n.isSpanish() ? 'Notificaciones Marcadas' : 'Notifications Marked',
            text: window.i18n.isSpanish() ? 
                'Todas las notificaciones han sido marcadas como leídas' : 
                'All notifications have been marked as read',
            icon: 'success',
            confirmButtonText: window.i18n.t('messages.understood'),
            confirmButtonColor: '#d72660'
        });
    }
});

// Función para actualizar contadores en tiempo real
function actualizarContadores() {
    // Contador de notificaciones no leídas
    const unreadNotifications = document.querySelectorAll('.notification-item.unread').length;
    const notificationBadge = document.querySelector('#notificationsBtn .badge');
    if (notificationBadge) {
        notificationBadge.textContent = unreadNotifications;
        if (unreadNotifications === 0) {
            notificationBadge.style.display = 'none';
        } else {
            notificationBadge.style.display = 'inline';
        }
    }
}

// Actualizar contadores cada 30 segundos
setInterval(actualizarContadores, 30000);

// Actualizar contadores al cargar la página
actualizarContadores();

// Escuchar cambios de idioma
document.addEventListener('languageChanged', function(e) {
    actualizarIdiomaSelector();
});

// Nueva función para renderizar medicamentos reales
function renderizarMedicamentos(medicamentos) {
    const lista = document.querySelector('.lista-meds');
    if (!lista) return;
    lista.innerHTML = '';
    if (medicamentos.length === 0) {
        lista.innerHTML = `<li class="text-muted">${window.i18n.isSpanish() ? 'Sin medicamentos registrados' : 'No medications registered'}</li>`;
        return;
    }
    medicamentos.forEach(med => {
        const li = document.createElement('li');
        li.className = 'd-flex justify-content-between align-items-center mb-2';
        li.innerHTML = `
            <span class="med-nombre">${med.nombre}</span>
            <span class="med-hora"><i class="bi bi-clock"></i> ${med.horarios ? med.horarios : ''}</span>
        `;
        lista.appendChild(li);
    });
}

// Renderizar notificaciones
function renderizarNotificaciones(notificaciones) {
    const lista = document.querySelector('.lista-notis');
    if (!lista) return;
    lista.innerHTML = '';
    if (!Array.isArray(notificaciones) || notificaciones.length === 0) {
        lista.innerHTML = `<li class="text-muted">${window.i18n.isSpanish() ? 'Sin información' : 'No information'}</li>`;
        return;
    }
    notificaciones.forEach(notif => {
        const li = document.createElement('li');
        li.className = 'd-flex justify-content-between align-items-center mb-2';
        li.innerHTML = `
            <span class="noti-txt">${notif.texto || ''}</span>
            <span class="noti-hora">${notif.tiempo || ''}</span>
        `;
        lista.appendChild(li);
    });
}

// Renderizar familia
function renderizarFamilia(familia) {
    const lista = document.querySelector('.lista-familia');
    if (!lista) return;
    lista.innerHTML = '';
    if (!Array.isArray(familia) || familia.length === 0) {
        lista.innerHTML = `<li class="text-muted">${window.i18n.isSpanish() ? 'Sin información' : 'No information'}</li>`;
        return;
    }
    familia.forEach(fam => {
        const li = document.createElement('li');
        li.className = 'd-flex justify-content-between align-items-center mb-2';
        li.innerHTML = `
            <span class="fam-nombre">${fam.nombre || ''}${fam.parentesco ? ' (' + fam.parentesco + ')' : ''}</span>
            <span class="fam-estado ${fam.en_linea ? 'text-success' : 'text-muted'}">${fam.en_linea ? (window.i18n.isSpanish() ? 'En línea' : 'Online') : (fam.ultimo_acceso || '')}</span>
        `;
        lista.appendChild(li);
    });
}

// Modo oscuro: alternar clase en body y guardar preferencia
const switchDarkMode = document.getElementById('switchDarkMode');
if (switchDarkMode) {
    // Al cargar, aplicar preferencia guardada
    if (localStorage.getItem('modoOscuro') === 'true') {
        document.body.classList.add('modo-oscuro');
        switchDarkMode.checked = true;
        aplicarClasesTarjetasOscuras();
    }
    switchDarkMode.addEventListener('change', function() {
        if (this.checked) {
            document.body.classList.add('modo-oscuro');
            localStorage.setItem('modoOscuro', 'true');
            aplicarClasesTarjetasOscuras();
        } else {
            document.body.classList.remove('modo-oscuro');
            localStorage.setItem('modoOscuro', 'false');
            removerClasesTarjetasOscuras();
        }
    });
}

// Función para aplicar clases de tarjetas oscuras
function aplicarClasesTarjetasOscuras() {
    const tarjetas = document.querySelectorAll('.tarjeta');
    tarjetas.forEach((tarjeta, index) => {
        // Remover clases pastel existentes
        tarjeta.classList.remove('card-pastel-1', 'card-pastel-2', 'card-pastel-3', 'card-pastel-4', 'card-pastel-5');
        // Agregar clase oscura correspondiente
        const darkClass = `dark-card-${(index % 4) + 1}`;
        tarjeta.classList.add(darkClass);
    });
}

// Función para remover clases de tarjetas oscuras
function removerClasesTarjetasOscuras() {
    const tarjetas = document.querySelectorAll('.tarjeta');
    tarjetas.forEach((tarjeta, index) => {
        // Remover clases oscuras
        tarjeta.classList.remove('dark-card-1', 'dark-card-2', 'dark-card-3', 'dark-card-4', 'dark-card-5');
        // Restaurar clase pastel original
        const pastelClass = `card-pastel-${(index % 4) + 1}`;
        tarjeta.classList.add(pastelClass);
    });
} 