// Dashboard del Paciente - Kirei
document.addEventListener('DOMContentLoaded', function() {
    verificarPerfil();
    cargarDatosPaciente();
    actualizarIdiomaSelector();
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

// Función para verificar si el paciente ya tiene perfil completo
async function verificarPerfil() {
    try {
        const response = await fetch('PHP/verificar-perfil.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();

        if (data.success) {
            if (!data.perfil_completo) {
                // El paciente no tiene perfil completo, redirigir al wizard
                window.location.href = 'wizard-paciente.html';
            }
        } else {
            // Error en la verificación, redirigir al login
            Swal.fire({
                title: window.i18n.t('messages.error'),
                text: window.i18n.isSpanish() ? 'Por favor inicia sesión nuevamente' : 'Please log in again',
                icon: 'error',
                confirmButtonText: window.i18n.t('messages.understood'),
                confirmButtonColor: '#d72660'
            }).then(() => {
                window.location.href = 'Index.html';
            });
        }
    } catch (error) {
        console.error('Error al verificar perfil:', error);
        // En caso de error, redirigir al login
        window.location.href = 'Index.html';
    }
}

// Función para cargar los datos del paciente
async function cargarDatosPaciente() {
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
            // Mostrar medicamentos reales
            if (Array.isArray(data.medicamentos)) {
                renderizarMedicamentos(data.medicamentos);
            }
        } else {
            // Si no hay datos, cerrar sesión y mostrar mensaje
            Swal.fire({
                title: window.i18n.t('messages.error'),
                text: window.i18n.isSpanish() ? 'Tu perfil no está completo. Por favor inicia sesión y completa tu información.' : 'Your profile is incomplete. Please log in and complete your information.',
                icon: 'error',
                confirmButtonText: window.i18n.t('messages.understood'),
                confirmButtonColor: '#d72660'
            }).then(() => {
                // Cerrar sesión y redirigir
                fetch('PHP/cerrar-sesion.php', { method: 'POST' }).then(() => {
                    window.location.href = 'Index.html';
                });
            });
        }
    } catch (error) {
        console.error('Error al cargar datos del paciente:', error);
        Swal.fire({
            title: window.i18n.t('messages.error'),
            text: window.i18n.isSpanish() ? 'Error de conexión. Por favor inicia sesión nuevamente.' : 'Connection error. Please log in again.',
            icon: 'error',
            confirmButtonText: window.i18n.t('messages.understood'),
            confirmButtonColor: '#d72660'
        }).then(() => {
            window.location.href = 'Index.html';
        });
    }
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

// Funciones del dashboard
function editarPerfil() {
    Swal.fire({
        title: window.i18n.t('functions.edit.profile'),
        text: window.i18n.t('functions.edit.profile.text'),
        icon: 'info',
        confirmButtonText: window.i18n.t('messages.understood'),
        confirmButtonColor: '#d72660'
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