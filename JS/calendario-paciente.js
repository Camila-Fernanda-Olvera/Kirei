// Calendario de Citas - Kirei

document.addEventListener('DOMContentLoaded', function() {
    let calendarEl = document.getElementById('calendar');
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: fetchCitas,
        eventClick: handleEventClick,
        editable: false,
        height: 'auto',
    });
    calendar.render();

    // Botón para agregar cita
    document.getElementById('btnAgregarCita').addEventListener('click', function() {
        abrirModalCita(null, function(nuevaCita) {
            fetch('PHP/add-cita.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaCita)
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    calendar.refetchEvents();
                    Swal.fire('¡Cita agregada!', 'La cita se ha guardado correctamente.', 'success');
                } else {
                    Swal.fire('Error', data.message || 'No se pudo guardar la cita', 'error');
                }
            });
        });
    });

    // Cargar citas desde el backend
    function fetchCitas(fetchInfo, successCallback, failureCallback) {
        fetch('PHP/get-citas.php')
            .then(r => r.json())
            .then(data => {
                if (data.success && Array.isArray(data.citas)) {
                    const eventos = data.citas.map(cita => ({
                        id: cita.id,
                        title: cita.motivo || cita.medico,
                        start: cita.fecha_hora,
                        extendedProps: cita
                    }));
                    successCallback(eventos);
                } else {
                    successCallback([]);
                }
            })
            .catch(() => successCallback([]));
    }

    // Aplicar modo oscuro si está en localStorage
    if (localStorage.getItem('modoOscuro') === 'true') {
        document.body.classList.add('modo-oscuro');
    }

    // Especialidades para el select
    const especialidades = [
        'Medicina General', 'Cardiología', 'Endocrinología', 'Neurología', 'Oncología', 'Neumología', 'Gastroenterología', 'Otra'
    ];

    // Click en cita: mostrar detalles y opciones
    function handleEventClick(info) {
        const cita = info.event.extendedProps;
        const fechaCita = new Date(cita.fecha_hora.split(' ')[0]); // Solo la fecha
        const hoy = new Date();
        hoy.setHours(0,0,0,0); // Solo la fecha
        const esFechaFutura = fechaCita > hoy;
        
        // Determinar si mostrar el botón de cancelar/reactivar
        let botonCancelarHTML = '';
        if (cita.estado === 'Cancelada') {
            if (esFechaFutura) {
                botonCancelarHTML = '<button id="btnReactivarCita" class="btn btn-outline-success">Reactivar cita</button>';
            }
            // Si es fecha pasada o igual a hoy, no mostrar botón
        } else {
            // Si no está cancelada, mostrar botón de cancelar
            botonCancelarHTML = '<button id="btnCancelarCita" class="btn btn-outline-danger">Cancelar cita</button>';
        }
        
        Swal.fire({
            title: 'Detalles de la cita',
            html: `
                <b>Médico:</b> ${cita.medico}<br>
                <b>Especialidad:</b> ${cita.especialidad || '-'}<br>
                <b>Motivo:</b> ${cita.motivo || '-'}<br>
                <b>Sede:</b> ${cita.sede || '-'}<br>
                <b>Fecha:</b> ${cita.fecha_hora.split(' ')[0]}<br>
                <b>Hora:</b> ${cita.fecha_hora.split(' ')[1].substring(0,5)}<br>
                <b>Estado:</b> ${cita.estado}
            `,
            showDenyButton: true,
            showCancelButton: true,
            showConfirmButton: true,
            confirmButtonText: 'Editar',
            denyButtonText: 'Mover',
            cancelButtonText: 'Eliminar',
            confirmButtonColor: '#197074',
            denyButtonColor: '#ffc107',
            cancelButtonColor: '#dc3545',
            showCloseButton: true,
            footer: botonCancelarHTML
        }).then(result => {
            if (result.isConfirmed) {
                // Editar cita (hora y detalles)
                abrirModalCita(cita, function(datosEditados) {
                    fetch('PHP/edit-cita.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...datosEditados, id: cita.id })
                    })
                    .then(r => r.json())
                    .then(data => {
                        if (data.success) {
                            calendar.refetchEvents();
                            Swal.fire('¡Cita actualizada!', 'Los datos se han guardado.', 'success');
                        } else {
                            Swal.fire('Error', data.message || 'No se pudo actualizar la cita', 'error');
                        }
                    });
                }, true);
            } else if (result.isDenied) {
                // Mover cita (fecha y hora)
                Swal.fire({
                    title: 'Mover cita',
                    html: `<input type="date" id="nuevaFecha" class="swal2-input" value="${cita.fecha_hora.split(' ')[0]}">
                           <input type="time" id="nuevaHora" class="swal2-input" value="${cita.fecha_hora.split(' ')[1].substring(0,5)}">`,
                    confirmButtonText: 'Mover',
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',
                    preConfirm: () => {
                        const nuevaFecha = document.getElementById('nuevaFecha').value;
                        const nuevaHora = document.getElementById('nuevaHora').value;
                        if (!nuevaFecha || !nuevaHora) return Swal.showValidationMessage('Selecciona fecha y hora');
                        return {nueva_fecha: nuevaFecha, nueva_hora: nuevaHora};
                    }
                }).then(res => {
                    if (res.isConfirmed) {
                        fetch('PHP/move-cita.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: cita.id, nueva_fecha: res.value.nueva_fecha, nueva_hora: res.value.nueva_hora })
                        })
                        .then(r => r.json())
                        .then(data => {
                            if (data.success) {
                                calendar.refetchEvents();
                                Swal.fire('¡Cita movida!', 'La cita ha sido reprogramada.', 'success');
                            } else {
                                Swal.fire('Error', data.message || 'No se pudo mover la cita', 'error');
                            }
                        });
                    }
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Eliminar cita
                Swal.fire({
                    title: '¿Eliminar cita?',
                    text: 'Esta acción no se puede deshacer',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: '#dc3545',
                }).then(res => {
                    if (res.isConfirmed) {
                        fetch('PHP/delete-cita.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ id: cita.id })
                        })
                        .then(r => r.json())
                        .then(data => {
                            if (data.success) {
                                calendar.refetchEvents();
                                Swal.fire('Cita eliminada', '', 'success');
                            } else {
                                Swal.fire('Error', data.message || 'No se pudo eliminar la cita', 'error');
                            }
                        });
                    }
                });
            }
        });
        
        // Configurar botones del footer
        setTimeout(() => {
            const btnCancelar = document.getElementById('btnCancelarCita');
            const btnReactivar = document.getElementById('btnReactivarCita');
            
            if (btnCancelar) {
                btnCancelar.onclick = function(e) {
                    e.preventDefault();
                    fetch('PHP/edit-cita.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: cita.id, estado: 'Cancelada', medico: cita.medico, especialidad: cita.especialidad, motivo: cita.motivo, sede: cita.sede, fecha_hora: cita.fecha_hora })
                    })
                    .then(r => r.json())
                    .then(data => {
                        if (data.success) {
                            calendar.refetchEvents();
                            Swal.fire('Cita cancelada', '', 'success');
                        } else {
                            Swal.fire('Error', data.message || 'No se pudo cancelar la cita', 'error');
                        }
                    });
                }
            }
            
            if (btnReactivar) {
                btnReactivar.onclick = function(e) {
                    e.preventDefault();
                    fetch('PHP/edit-cita.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: cita.id, estado: 'Pendiente', medico: cita.medico, especialidad: cita.especialidad, motivo: cita.motivo, sede: cita.sede, fecha_hora: cita.fecha_hora })
                    })
                    .then(r => r.json())
                    .then(data => {
                        if (data.success) {
                            calendar.refetchEvents();
                            Swal.fire('Cita reactivada', 'La cita ha sido reactivada correctamente.', 'success');
                        } else {
                            Swal.fire('Error', data.message || 'No se pudo reactivar la cita', 'error');
                        }
                    });
                }
            }
        }, 200);
    }

    // Modal para agregar/editar cita
    function abrirModalCita(cita, callback, soloEditar=false) {
        Swal.fire({
            title: cita ? 'Editar cita' : 'Agregar cita',
            html: `
                <input id="swalMedico" class="swal2-input" placeholder="Médico" value="${cita ? cita.medico : ''}" required>
                <select id="swalEspecialidad" class="swal2-input">${especialidades.map(opt => `<option value="${opt}" ${cita && cita.especialidad === opt ? 'selected' : ''}>${opt}</option>`)}</select>
                <input id="swalMotivo" class="swal2-input" placeholder="Motivo" value="${cita ? cita.motivo : ''}">
                <input id="swalSede" class="swal2-input" placeholder="Sede" value="${cita ? cita.sede : ''}">
                <input id="swalFecha" type="date" class="swal2-input" value="${cita ? cita.fecha_hora.split(' ')[0] : ''}" ${soloEditar ? 'readonly' : ''} required>
                <input id="swalHora" type="time" class="swal2-input" value="${cita ? cita.fecha_hora.split(' ')[1].substring(0,5) : ''}" required>
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: cita ? 'Guardar cambios' : 'Agregar',
            cancelButtonText: 'Cancelar',
            preConfirm: () => {
                const medico = document.getElementById('swalMedico').value.trim();
                const especialidad = document.getElementById('swalEspecialidad').value;
                const motivo = document.getElementById('swalMotivo').value.trim();
                const sede = document.getElementById('swalSede').value.trim();
                const fecha = document.getElementById('swalFecha').value;
                const hora = document.getElementById('swalHora').value;
                if (!medico || !fecha || !hora) {
                    Swal.showValidationMessage('Completa los campos obligatorios');
                    return false;
                }
                return {
                    medico, especialidad, motivo, sede,
                    fecha_hora: fecha + ' ' + hora + ':00',
                };
            }
        }).then(res => {
            if (res.isConfirmed && res.value) {
                callback(res.value);
            }
        });
    }

    // Mejorar visibilidad de la fecha de hoy en el calendario
    setTimeout(() => {
        const hoy = document.querySelector('.fc-day-today');
        if (hoy) {
            hoy.style.background = '#ffe082';
            hoy.style.border = '2px solid #197074';
            hoy.style.borderRadius = '12px';
        }
    }, 500);
}) 