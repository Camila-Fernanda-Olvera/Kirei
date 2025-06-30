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
            window.datosPaciente = data.datos;
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
        currentLanguageSpan.textContent = 'ESPAÑOL';
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
        if (el) el.textContent = value && value.trim() !== '' ? value : 'No especificado';
    }

    setText('patientName', datos.nombre || '');
    setText('patientAge', `${edadFinal} años`);
    setText('patientGender', traducirGenero(datos.genero));
    setText('patientCountry', datos.pais || '');
    setText('patientLanguage', datos.idioma === 'en' ? 'Inglés' : 'Spanish');
    setText('bloodType', datos.tipo_sangre || '');
    setText('condition', datos.padecimiento || '');
    setText('diagnosisDate', datos.fecha_diagnostico || '');
    setText('doctorName', datos.medico || '');
    setText('doctorSpecialty', datos.especialidad_medico || '');
    setText('doctorPhone', datos.telefono_medico || '');
    // Traducir dieta
    setText('patientDiet', traducirDieta(datos.dieta));
    setText('allergies', datos.alergias || 'Ninguna');
    setText('emergencyContact', `${datos.contacto_nombre || ''} (${datos.contacto_relacion || ''})`);
    setText('emergencyPhone', datos.contacto_telefono || '');
    // Imagen de perfil en el dashboard
    const perfilImg = document.querySelector('.perfil-img img');
    if (perfilImg) {
        let src = datos.imagen && datos.imagen.trim() !== '' ? datos.imagen : 'https://ui-avatars.com/api/?name=Perfil&background=cccccc&color=222222&size=200';
        if (src.startsWith('data:image/')) {
            perfilImg.src = src;
        } else {
            perfilImg.src = src;
            perfilImg.onerror = function() {
                this.onerror = null;
                this.src = 'https://ui-avatars.com/api/?name=Perfil&background=cccccc&color=222222&size=200';
            };
        }
    }
}

// Traducción de valores de dieta
function traducirDieta(valor) {
    if (!valor || valor.trim() === '') return 'No especificado';
    const map = {
        'normal': 'Dieta normal',
        'baja_sodio': 'Baja en sodio',
        'baja_azucar': 'Baja en azúcar',
        'sin_gluten': 'Sin gluten',
        'vegetariana': 'Vegetariana',
        'vegana': 'Vegana',
        'otra': 'Otra'
    };
    return map[valor] || valor;
}

// Traducción de valores de género
function traducirGenero(valor) {
    if (!valor || valor.trim() === '') return 'No especificado';
    const map = {
        'masculino': 'masculino',
        'femenino': 'femenino',
        'otro': 'otro',
        'male': 'masculino',
        'female': 'femenino',
        'other': 'otro'
    };
    return map[valor.toLowerCase()] || valor;
}

// Función para editar perfil médico (modal propio)
function editarPerfil() {
    console.log('Función editarPerfil() ejecutada');
    const datos = window.datosPaciente || {};
    document.getElementById('modalEditarPerfilError').style.display = 'none';
    document.getElementById('modalEditarPerfilError').textContent = '';
    document.getElementById('modalFechaDiagnostico').value = datos.fecha_diagnostico || '';
    document.getElementById('modalPadecimiento').value = datos.padecimiento || '';
    document.getElementById('modalTipoSangre').value = datos.tipo_sangre || '';
    document.getElementById('modalTipoDieta').value = datos.dieta || '';
    document.getElementById('modalAlergias').value = datos.alergias || '';
    // Imagen de perfil en el modal
    let src = datos.imagen && datos.imagen.trim() !== '' ? datos.imagen : 'https://ui-avatars.com/api/?name=Perfil&background=cccccc&color=222222&size=200';
    if (src.startsWith('data:image/')) {
        document.getElementById('modalPerfilImg').src = src;
    } else {
        document.getElementById('modalPerfilImg').src = src;
        document.getElementById('modalPerfilImg').onerror = function() {
            this.onerror = null;
            this.src = 'https://ui-avatars.com/api/?name=Perfil&background=cccccc&color=222222&size=200';
        };
    }
    document.getElementById('modalInputImg').value = '';
    window.imagenBase64Temp = null;
    document.getElementById('modalEditarPerfil').style.display = 'flex';
}

// Cerrar modal propio
function cerrarModalEditarPerfil() {
    document.getElementById('modalEditarPerfil').style.display = 'none';
    window.imagenBase64Temp = null;
}

// Previsualizar imagen y validar formato/tamaño, y guardar base64 temporal
window.imagenBase64Temp = null;
document.addEventListener('DOMContentLoaded', function() {
    const inputImg = document.getElementById('modalInputImg');
    if (inputImg) {
        inputImg.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const errorDiv = document.getElementById('modalEditarPerfilError');
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';
            window.imagenBase64Temp = null;
            if (file) {
                const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
                if (!validTypes.includes(file.type)) {
                    errorDiv.textContent = 'Formato no permitido. Solo JPG, PNG o WEBP.';
                    errorDiv.style.display = 'block';
                    inputImg.value = '';
                    return;
                }
                if (file.size > 2 * 1024 * 1024) {
                    errorDiv.textContent = 'La imagen es demasiado grande (máx. 2MB).';
                    errorDiv.style.display = 'block';
                    inputImg.value = '';
                    return;
                }
                const reader = new FileReader();
                reader.onload = (ev) => {
                    document.getElementById('modalPerfilImg').src = ev.target.result;
                    window.imagenBase64Temp = ev.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Enviar datos al backend al guardar
    const formEditarPerfil = document.getElementById('formEditarPerfil');
    if (formEditarPerfil) {
        formEditarPerfil.addEventListener('submit', async function(e) {
            e.preventDefault();
            console.log('Formulario enviado');
            const errorDiv = document.getElementById('modalEditarPerfilError');
            errorDiv.style.display = 'none';
            errorDiv.textContent = '';
            // Validar campos
            const fechaDiagnostico = document.getElementById('modalFechaDiagnostico').value;
            const padecimiento = document.getElementById('modalPadecimiento').value.trim();
            const tipoSangre = document.getElementById('modalTipoSangre').value;
            const tipoDieta = document.getElementById('modalTipoDieta').value;
            const alergias = document.getElementById('modalAlergias').value.trim();
            if (!fechaDiagnostico || !padecimiento || !tipoSangre || !tipoDieta) {
                errorDiv.textContent = 'Por favor completa todos los campos obligatorios.';
                errorDiv.style.display = 'block';
                return false;
            }
            // Enviar datos al backend
            const formData = new FormData();
            formData.append('fecha_diagnostico', fechaDiagnostico);
            formData.append('padecimiento', padecimiento);
            formData.append('tipo_sangre', tipoSangre);
            formData.append('dieta', tipoDieta);
            formData.append('alergias', alergias);
            if (window.imagenBase64Temp) formData.append('imagen_base64', window.imagenBase64Temp);
            try {
                console.log('Enviando datos al backend...');
                const res = await fetch('PHP/actualizar-perfil-medico.php', {
                    method: 'POST',
                    body: formData
                });
                const result = await res.json();
                console.log('Respuesta del backend:', result);
                if (!result.success) throw new Error(result.message || 'Error al guardar');
                cerrarModalEditarPerfil();
                // Actualizar datos en pantalla sin recargar
                if (window.datosPaciente) {
                    window.datosPaciente.fecha_diagnostico = fechaDiagnostico;
                    window.datosPaciente.padecimiento = padecimiento;
                    window.datosPaciente.tipo_sangre = tipoSangre;
                    window.datosPaciente.dieta = tipoDieta;
                    window.datosPaciente.alergias = alergias;
                    if (result.imagen) window.datosPaciente.imagen = result.imagen;
                    actualizarInterfaz(window.datosPaciente);
                }
                Swal.fire('¡Guardado!', 'Tu información médica ha sido actualizada.', 'success');
            } catch (err) {
                console.error('Error al guardar:', err);
                errorDiv.textContent = 'Error al guardar: ' + err.message;
                errorDiv.style.display = 'block';
            }
            return false;
        });
    }
});

function configuracion() {
    Swal.fire({
        title: 'Configuración',
        text: 'Esta es la sección de configuración del dashboard.',
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#d72660'
    });
}

function agregarCita() {
    Swal.fire({
        title: 'Agregar Cita',
        text: 'Esta es la sección para agregar una nueva cita.',
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#d72660'
    });
}

function agregarMedicamento() {
    Swal.fire({
        title: 'Agregar Medicamento',
        text: 'Esta es la sección para agregar un nuevo medicamento.',
        icon: 'info',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#d72660'
    });
}

function emergencia() {
    Swal.fire({
        title: 'Emergencia',
        text: 'Esta es la sección para notificar una emergencia.',
        icon: 'warning',
        confirmButtonText: 'Entendido',
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
        title: 'Cerrar Sesión',
        text: '¿Estás seguro de que quieres cerrar sesión?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, Salir',
        cancelButtonText: 'Cancelar',
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
            title: 'Recordatorio Configurado',
            text: `Se configuró un recordatorio para: ${appointmentTitle}`,
            icon: 'success',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#d72660'
        });
    }
    
    // Botones de eliminar citas
    if (e.target.closest('.appointment-actions .btn-outline-danger')) {
        const appointmentItem = e.target.closest('.appointment-item');
        const appointmentTitle = appointmentItem.querySelector('h6').textContent;
        
        Swal.fire({
            title: '¿Eliminar Cita?',
            text: `¿Estás seguro de eliminar: ${appointmentTitle}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, Eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d'
        }).then((result) => {
            if (result.isConfirmed) {
                appointmentItem.remove();
                Swal.fire({
                    title: 'Cita Eliminada',
                    text: 'La cita ha sido eliminada correctamente',
                    icon: 'success',
                    confirmButtonText: 'Entendido',
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
        
        statusBadge.textContent = 'Tomado';
        statusBadge.className = 'badge bg-success';
        
        Swal.fire({
            title: 'Medicamento Registrado',
            text: `${medicationName} marcado como tomado`,
            icon: 'success',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#d72660'
        });
    }
    
    // Botones de editar medicamento
    if (e.target.closest('.medication-actions .btn-outline-warning')) {
        const medicationItem = e.target.closest('.medication-item');
        const medicationName = medicationItem.querySelector('h6').textContent;
        
        Swal.fire({
            title: 'Editar Medicamento',
            text: `Editar configuración de: ${medicationName}`,
            icon: 'info',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#d72660'
        });
    }
    
    // Botones de chat con familiares
    if (e.target.closest('.member-actions .btn-outline-primary')) {
        const memberItem = e.target.closest('.family-member');
        const memberName = memberItem.querySelector('h6').textContent;
        
        Swal.fire({
            title: 'Chat Familiar',
            text: `Iniciar chat con ${memberName}`,
            icon: 'info',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#d72660'
        });
    }
    
    // Botón de marcar todas las notificaciones (solo el botón de notificaciones, no todos los secundarios)
    if (e.target.closest('#notificationsBtn')) {
        const unreadNotifications = document.querySelectorAll('.notification-item.unread');
        unreadNotifications.forEach(notification => {
            notification.classList.remove('unread');
        });
        Swal.fire({
            title: 'Notificaciones Marcadas',
            text: 'Todas las notificaciones han sido marcadas como leídas',
            icon: 'success',
            confirmButtonText: 'Entendido',
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
        lista.innerHTML = `<li class="text-muted">Sin medicamentos registrados</li>`;
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
        lista.innerHTML = `<li class="text-muted">Sin información</li>`;
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
        lista.innerHTML = `<li class="text-muted">Sin información</li>`;
        return;
    }
    familia.forEach(fam => {
        const li = document.createElement('li');
        li.className = 'd-flex justify-content-between align-items-center mb-2';
        li.innerHTML = `
            <span class="fam-nombre">${fam.nombre || ''}${fam.parentesco ? ' (' + fam.parentesco + ')' : ''}</span>
            <span class="fam-estado ${fam.en_linea ? 'text-success' : 'text-muted'}">${fam.en_linea ? 'En línea' : (fam.ultimo_acceso || '')}</span>
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

// Cargar y mostrar citas próximas
async function cargarCitasProximas() {
    const lista = document.querySelector('.lista-citas-proximas');
    if (!lista) return;
    lista.innerHTML = `<li class="text-muted">Cargando citas...</li>`;
    try {
        const res = await fetch('PHP/get-citas.php');
        const data = await res.json();
        if (!data.success || !Array.isArray(data.citas)) {
            lista.innerHTML = `<li class="text-muted">Sin citas próximas</li>`;
            return;
        }
        const ahora = new Date();
        const citasFuturas = data.citas.filter(cita => {
            const fechaHora = new Date(cita.fecha_hora.replace(' ', 'T'));
            return fechaHora > ahora;
        });
        if (citasFuturas.length === 0) {
            lista.innerHTML = `<li class="text-muted">Sin citas próximas</li>`;
            return;
        }
        lista.innerHTML = '';
        citasFuturas.sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora));
        citasFuturas.forEach(cita => {
            let estadoClass = 'pendiente';
            if (cita.estado === 'Atendida') estadoClass = 'atendida';
            if (cita.estado === 'Cancelada') estadoClass = 'cancelada';
            const fecha = cita.fecha_hora.split(' ')[0];
            const hora = cita.fecha_hora.split(' ')[1].substring(0,5);
            lista.innerHTML += `
                <li>
                    <span><i class="bi bi-calendar2-week"></i> <b>${fecha}</b> <i class="bi bi-clock"></i> <b>${hora}</b></span>
                    <span><i class="bi bi-person"></i> ${cita.medico}</span>
                    <span><i class="bi bi-briefcase"></i> ${cita.especialidad || '-'}</span>
                    <span><span class="cita-estado-badge ${estadoClass}">${cita.estado === 'Pendiente' ? 'Pendiente' : (cita.estado === 'Atendida' ? 'Atendida' : 'Cancelada')}</span></span>
                </li>`;
        });
    } catch (e) {
        lista.innerHTML = `<li class="text-muted">Error al cargar citas</li>`;
    }
}

// Llamar al cargar
cargarCitasProximas();

// Sincronizar modo oscuro/claro en todas las páginas
(function sincronizarModoOscuro() {
    if (localStorage.getItem('modoOscuro') === 'true') {
        document.body.classList.add('modo-oscuro');
    } else {
        document.body.classList.remove('modo-oscuro');
    }
})();

document.addEventListener('DOMContentLoaded', () => {
    const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
    if (cerrarSesionBtn) {
        cerrarSesionBtn.onclick = () => {
            fetch('PHP/cerrar-sesion.php').then(() => window.location.href = 'Index.html');
        };
    }
}); 