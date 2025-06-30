// JS/bienestar.js - CRUD Bienestar para Kirei

document.addEventListener('DOMContentLoaded', function() {
    cargarBienestar();
    document.getElementById('bienestar-crud').innerHTML = `
        <div class="tarjeta card-pastel-2 p-4 mb-4 shadow">
            <h3 class="mb-4 d-flex align-items-center" style="font-weight:800;"><i class="bi bi-activity me-2 text-primary"></i>Registros de Bienestar</h3>
            <form id="formBienestar" class="row g-3 mb-4">
                <div class="col-md-4 position-relative">
                    <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;"><i class="bi bi-droplet-half"></i></span>
                    <input type="number" step="0.1" min="0" class="form-control ps-5" id="glucosa" placeholder="Glucosa (mg/dL)" required title="Nivel de glucosa en sangre">
                </div>
                <div class="col-md-4 position-relative">
                    <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;"><i class="bi bi-heart-pulse"></i></span>
                    <input type="text" class="form-control ps-5" id="presion" placeholder="Presión arterial (mmHg)" title="Ejemplo: 120/80">
                </div>
                <div class="col-md-4 position-relative">
                    <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;"><i class="bi bi-activity"></i></span>
                    <input type="number" min="0" class="form-control ps-5" id="fc" placeholder="Frec. Cardíaca (bpm)" title="Frecuencia cardíaca">
                </div>
                <div class="col-md-4 position-relative">
                    <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;"><i class="bi bi-shoe-prints"></i></span>
                    <input type="number" min="0" class="form-control ps-5" id="pasos" placeholder="Pasos" title="Cantidad de pasos diarios">
                </div>
                <div class="col-md-4 position-relative">
                    <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;"><i class="bi bi-person-fill"></i></span>
                    <input type="number" step="0.1" min="0" class="form-control ps-5" id="peso" placeholder="Peso (kg)" title="Peso corporal">
                </div>
                <div class="col-md-4 position-relative">
                    <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;"><i class="bi bi-bar-chart"></i></span>
                    <input type="number" step="0.1" min="0" class="form-control ps-5" id="imc" placeholder="IMC" title="Índice de Masa Corporal">
                </div>
                <div class="col-md-4 position-relative">
                    <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;"><i class="bi bi-droplet"></i></span>
                    <input type="number" step="0.1" min="0" class="form-control ps-5" id="saturacion" placeholder="Sat. O2 (%)" title="Saturación de oxígeno">
                </div>
                <div class="col-md-4 position-relative">
                    <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;"><i class="bi bi-thermometer-half"></i></span>
                    <input type="number" step="0.1" min="0" class="form-control ps-5" id="temp" placeholder="Temp. (°C)" title="Temperatura corporal">
                </div>
                <div class="col-md-4 position-relative">
                    <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;"><i class="bi bi-calendar-event"></i></span>
                    <input type="date" class="form-control ps-5" id="fecha" required title="Fecha del registro">
                </div>
                <div class="col-md-12 d-flex justify-content-end">
                    <button type="submit" class="btn btn-outline-primary btn-lg px-5 py-2 rounded-pill shadow"><i class="bi bi-plus-circle me-2"></i>Agregar</button>
                </div>
            </form>
            <div class="table-responsive">
                <table class="table table-hover align-middle tarjeta card-pastel-3" id="tablaBienestar">
                    <thead class="table-light">
                        <tr>
                            <th>Fecha</th><th>Glucosa</th><th>Presión</th><th>FC</th><th>Pasos</th><th>Peso</th><th>IMC</th><th>Sat. O2</th><th>Temp.</th><th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    `;
    document.getElementById('formBienestar').onsubmit = guardarBienestar;
});

// Cargar registros de bienestar
function cargarBienestar() {
    fetch('PHP/bienestar.php?action=list')
        .then(r => r.json())
        .then(data => {
            const tbody = document.querySelector('#tablaBienestar tbody');
            tbody.innerHTML = '';
            if (data.success && Array.isArray(data.registros)) {
                data.registros.forEach(reg => {
                    tbody.innerHTML += `
                        <tr>
                            <td>${reg.fecha_registro.split(' ')[0]}</td>
                            <td>${reg.glucosa ?? '-'}</td>
                            <td>${reg.presion_arterial ?? '-'}</td>
                            <td>${reg.frecuencia_cardiaca ?? '-'}</td>
                            <td>${reg.pasos_diarios ?? '-'}</td>
                            <td>${reg.peso ?? '-'}</td>
                            <td>${reg.imc ?? '-'}</td>
                            <td>${reg.saturacion_oxigeno ?? '-'}</td>
                            <td>${reg.temperatura_corporal ?? '-'}</td>
                            <td>
                                <button class='btn btn-outline-warning btn-sm me-1' onclick='editarBienestar(${JSON.stringify(reg)})'><i class='bi bi-pencil'></i></button>
                                <button class='btn btn-outline-danger btn-sm' onclick='eliminarBienestar(${reg.id})'><i class='bi bi-trash'></i></button>
                            </td>
                        </tr>`;
                });
            } else {
                tbody.innerHTML = `<tr><td colspan='10' class='text-muted text-center'>Sin registros</td></tr>`;
            }
        });
}

// Utilidad: mostrar toast de alerta y registrar notificación si hay valores de riesgo
function mostrarAlertaBienestar(datos) {
    // Rangos estándar
    const alertas = [];
    if (datos.glucosa > 180) alertas.push('Glucosa alta (>180 mg/dL)');
    if (datos.glucosa < 70) alertas.push('Glucosa baja (<70 mg/dL)');
    if (datos.presion) {
        const presion = datos.presion.split('/');
        if (presion.length === 2) {
            const sist = parseInt(presion[0]);
            const diast = parseInt(presion[1]);
            if (sist > 140 || diast > 90) alertas.push('Presión arterial alta (>140/90 mmHg)');
            if (sist < 90 || diast < 60) alertas.push('Presión arterial baja (<90/60 mmHg)');
        }
    }
    if (datos.fc > 100) alertas.push('Frecuencia cardíaca alta (>100 bpm)');
    if (datos.fc && datos.fc < 50) alertas.push('Frecuencia cardíaca baja (<50 bpm)');
    if (datos.saturacion && datos.saturacion < 92) alertas.push('Saturación de oxígeno baja (<92%)');
    if (datos.temp && datos.temp > 37) alertas.push('Temperatura elevada (>37°C)');
    if (datos.imc && datos.imc < 18.5) alertas.push('IMC bajo (<18.5)');
    if (datos.imc && datos.imc > 30) alertas.push('IMC alto (>30)');
    // Peso: solo tooltip, no alerta
    if (alertas.length > 0) {
        // Mostrar toast usando sistema de notificaciones
        if (window.sistemaNotificaciones && typeof window.sistemaNotificaciones.mostrarNotificacion === 'function') {
            window.sistemaNotificaciones.mostrarNotificacion({
                tipo: 'recordatorio',
                titulo: '¡Alerta de Bienestar!',
                mensaje: alertas.join('<br>'),
                prioridad: 'alta',
                datos_adicionales: null
            });
        } else {
            // Fallback visual
            alert('¡Alerta de Bienestar!\n' + alertas.join('\n'));
        }
        // Registrar en la base de datos (notificaciones)
        fetch('PHP/notificaciones.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                action: 'crear',
                tipo: 'emergencia',
                titulo: 'Alerta de Bienestar',
                mensaje: alertas.join(', '),
                prioridad: 'alta'
            })
        });
    }
}

// Modificar guardarBienestar para usar la función de alerta y tooltips
function guardarBienestar(e) {
    e.preventDefault();
    const datos = {
        glucosa: parseFloat(document.getElementById('glucosa').value),
        presion: document.getElementById('presion').value,
        fc: parseInt(document.getElementById('fc').value),
        pasos: parseInt(document.getElementById('pasos').value),
        peso: parseFloat(document.getElementById('peso').value),
        imc: parseFloat(document.getElementById('imc').value),
        saturacion: parseFloat(document.getElementById('saturacion').value),
        temp: parseFloat(document.getElementById('temp').value),
        fecha: document.getElementById('fecha').value
    };
    // Mostrar alerta si hay valores de riesgo
    mostrarAlertaBienestar(datos);
    fetch('PHP/bienestar.php?action=add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            Swal.fire('¡Guardado!', 'Registro agregado correctamente.', 'success');
            cargarBienestar();
            document.getElementById('formBienestar').reset();
        } else {
            Swal.fire('Error', data.message || 'No se pudo guardar', 'error');
        }
    });
}

// Editar registro (abre modal SweetAlert2)
function editarBienestar(reg) {
    Swal.fire({
        title: 'Editar registro de bienestar',
        html: `
            <input id="swalFecha" type="date" class="swal2-input" value="${reg.fecha_registro.split(' ')[0]}">
            <input id="swalGlucosa" type="number" step="0.1" class="swal2-input" placeholder="Glucosa" value="${reg.glucosa ?? ''}">
            <input id="swalPresion" type="text" class="swal2-input" placeholder="Presión" value="${reg.presion_arterial ?? ''}">
            <input id="swalFC" type="number" class="swal2-input" placeholder="FC" value="${reg.frecuencia_cardiaca ?? ''}">
            <input id="swalPasos" type="number" class="swal2-input" placeholder="Pasos" value="${reg.pasos_diarios ?? ''}">
            <input id="swalPeso" type="number" step="0.1" class="swal2-input" placeholder="Peso" value="${reg.peso ?? ''}">
            <input id="swalIMC" type="number" step="0.1" class="swal2-input" placeholder="IMC" value="${reg.imc ?? ''}">
            <input id="swalSat" type="number" step="0.1" class="swal2-input" placeholder="Sat. O2" value="${reg.saturacion_oxigeno ?? ''}">
            <input id="swalTemp" type="number" step="0.1" class="swal2-input" placeholder="Temp." value="${reg.temperatura_corporal ?? ''}">
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            return {
                id: reg.id,
                fecha: document.getElementById('swalFecha').value,
                glucosa: document.getElementById('swalGlucosa').value,
                presion: document.getElementById('swalPresion').value,
                fc: document.getElementById('swalFC').value,
                pasos: document.getElementById('swalPasos').value,
                peso: document.getElementById('swalPeso').value,
                imc: document.getElementById('swalIMC').value,
                saturacion: document.getElementById('swalSat').value,
                temp: document.getElementById('swalTemp').value
            };
        }
    }).then(res => {
        if (res.isConfirmed && res.value) {
            fetch('PHP/bienestar.php?action=edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(res.value)
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    Swal.fire('¡Actualizado!', 'Registro editado correctamente.', 'success');
                    cargarBienestar();
                } else {
                    Swal.fire('Error', data.message || 'No se pudo editar', 'error');
                }
            });
        }
    });
}

// Eliminar registro
function eliminarBienestar(id) {
    Swal.fire({
        title: '¿Eliminar registro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545',
    }).then(res => {
        if (res.isConfirmed) {
            fetch('PHP/bienestar.php?action=delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    Swal.fire('Eliminado', '', 'success');
                    cargarBienestar();
                } else {
                    Swal.fire('Error', data.message || 'No se pudo eliminar', 'error');
                }
            });
        }
    });
}

// ========== CRUD MEDICAMENTOS =============
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('medicamentos-crud')) {
        renderMedicamentosUI();
        cargarMedicamentos();
    }
});

function renderMedicamentosUI() {
    document.getElementById('medicamentos-crud').innerHTML = `
        <form id="formMedicamento" class="row g-3 mb-4">
            <div class="col-md-3">
                <input type="text" class="form-control" id="medNombre" placeholder="Nombre" required>
            </div>
            <div class="col-md-2">
                <input type="text" class="form-control" id="medTipo" placeholder="Tipo">
            </div>
            <div class="col-md-2">
                <input type="text" class="form-control" id="medDosis" placeholder="Dosis">
            </div>
            <div class="col-md-2">
                <input type="text" class="form-control" id="medFrecuencia" placeholder="Frecuencia">
            </div>
            <div class="col-md-2">
                <input type="text" class="form-control" id="medHorarios" placeholder="Horarios">
            </div>
            <div class="col-md-2">
                <input type="date" class="form-control" id="medInicio" placeholder="Inicio">
            </div>
            <div class="col-md-2">
                <input type="date" class="form-control" id="medFin" placeholder="Fin">
            </div>
            <div class="col-md-3">
                <input type="text" class="form-control" id="medIndicaciones" placeholder="Indicaciones">
            </div>
            <div class="col-md-2">
                <button type="submit" class="btn btn-outline-primary w-100"><i class="bi bi-plus-circle"></i> Agregar</button>
            </div>
        </form>
        <div class="table-responsive">
            <table class="table table-hover align-middle" id="tablaMedicamentos">
                <thead class="table-light">
                    <tr>
                        <th>Nombre</th><th>Tipo</th><th>Dosis</th><th>Frecuencia</th><th>Horarios</th><th>Inicio</th><th>Fin</th><th>Indicaciones</th><th>Acciones</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
    `;
    document.getElementById('formMedicamento').onsubmit = guardarMedicamento;
}

function cargarMedicamentos() {
    fetch('PHP/medicamentos.php?action=list')
        .then(r => r.json())
        .then(data => {
            const tbody = document.querySelector('#tablaMedicamentos tbody');
            tbody.innerHTML = '';
            if (data.success && Array.isArray(data.medicamentos)) {
                data.medicamentos.forEach(med => {
                    tbody.innerHTML += `
                        <tr>
                            <td>${med.nombre ?? '-'}</td>
                            <td>${med.tipo ?? '-'}</td>
                            <td>${med.dosis ?? '-'}</td>
                            <td>${med.frecuencia ?? '-'}</td>
                            <td>${med.horarios ?? '-'}</td>
                            <td>${med.inicio ?? '-'}</td>
                            <td>${med.fin ?? '-'}</td>
                            <td>${med.indicaciones ?? '-'}</td>
                            <td>
                                <button class='btn btn-outline-warning btn-sm me-1' onclick='editarMedicamento(${JSON.stringify(med)})'><i class='bi bi-pencil'></i></button>
                                <button class='btn btn-outline-danger btn-sm' onclick='eliminarMedicamento(${med.id})'><i class='bi bi-trash'></i></button>
                            </td>
                        </tr>`;
                });
            } else {
                tbody.innerHTML = `<tr><td colspan='9' class='text-muted text-center'>Sin registros</td></tr>`;
            }
        });
}

function guardarMedicamento(e) {
    e.preventDefault();
    const datos = {
        nombre: document.getElementById('medNombre').value,
        tipo: document.getElementById('medTipo').value,
        dosis: document.getElementById('medDosis').value,
        frecuencia: document.getElementById('medFrecuencia').value,
        horarios: document.getElementById('medHorarios').value,
        inicio: document.getElementById('medInicio').value,
        fin: document.getElementById('medFin').value,
        indicaciones: document.getElementById('medIndicaciones').value
    };
    fetch('PHP/medicamentos.php?action=add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(r => r.json())
    .then(data => {
        if (data.success) {
            Swal.fire('¡Guardado!', 'Medicamento agregado correctamente.', 'success');
            cargarMedicamentos();
            document.getElementById('formMedicamento').reset();
        } else {
            Swal.fire('Error', data.message || 'No se pudo guardar', 'error');
        }
    });
}

function editarMedicamento(med) {
    Swal.fire({
        title: 'Editar medicamento',
        html: `
            <input id="swalMedNombre" type="text" class="swal2-input" placeholder="Nombre" value="${med.nombre ?? ''}">
            <input id="swalMedTipo" type="text" class="swal2-input" placeholder="Tipo" value="${med.tipo ?? ''}">
            <input id="swalMedDosis" type="text" class="swal2-input" placeholder="Dosis" value="${med.dosis ?? ''}">
            <input id="swalMedFrecuencia" type="text" class="swal2-input" placeholder="Frecuencia" value="${med.frecuencia ?? ''}">
            <input id="swalMedHorarios" type="text" class="swal2-input" placeholder="Horarios" value="${med.horarios ?? ''}">
            <input id="swalMedInicio" type="date" class="swal2-input" value="${med.inicio ?? ''}">
            <input id="swalMedFin" type="date" class="swal2-input" value="${med.fin ?? ''}">
            <input id="swalMedIndicaciones" type="text" class="swal2-input" placeholder="Indicaciones" value="${med.indicaciones ?? ''}">
        `,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        preConfirm: () => {
            return {
                id: med.id,
                nombre: document.getElementById('swalMedNombre').value,
                tipo: document.getElementById('swalMedTipo').value,
                dosis: document.getElementById('swalMedDosis').value,
                frecuencia: document.getElementById('swalMedFrecuencia').value,
                horarios: document.getElementById('swalMedHorarios').value,
                inicio: document.getElementById('swalMedInicio').value,
                fin: document.getElementById('swalMedFin').value,
                indicaciones: document.getElementById('swalMedIndicaciones').value
            };
        }
    }).then(res => {
        if (res.isConfirmed && res.value) {
            fetch('PHP/medicamentos.php?action=edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(res.value)
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    Swal.fire('¡Actualizado!', 'Medicamento editado correctamente.', 'success');
                    cargarMedicamentos();
                } else {
                    Swal.fire('Error', data.message || 'No se pudo editar', 'error');
                }
            });
        }
    });
}

function eliminarMedicamento(id) {
    Swal.fire({
        title: '¿Eliminar medicamento?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#dc3545',
    }).then(res => {
        if (res.isConfirmed) {
            fetch('PHP/medicamentos.php?action=delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            })
            .then(r => r.json())
            .then(data => {
                if (data.success) {
                    Swal.fire('Eliminado', '', 'success');
                    cargarMedicamentos();
                } else {
                    Swal.fire('Error', data.message || 'No se pudo eliminar', 'error');
                }
            });
        }
    });
}

// Tooltips en los campos del formulario de bienestar
function agregarTooltipsBienestar() {
    const tooltips = [
        { id: 'glucosa', text: 'Nivel de glucosa en sangre. Normal: 70-180 mg/dL.' },
        { id: 'presion', text: 'Presión arterial. Ejemplo: 120/80 mmHg.' },
        { id: 'fc', text: 'Frecuencia cardíaca. Normal: 50-100 bpm.' },
        { id: 'saturacion', text: 'Saturación de oxígeno. Normal: >92%.' },
        { id: 'temp', text: 'Temperatura corporal. Normal: 36-37°C.' },
        { id: 'imc', text: 'Índice de Masa Corporal. Normal: 18.5-30.' },
        { id: 'peso', text: 'Peso en kilogramos.' },
        { id: 'pasos', text: 'Cantidad de pasos diarios.' }
    ];
    tooltips.forEach(t => {
        const el = document.getElementById(t.id);
        if (el) {
            el.setAttribute('data-bs-toggle', 'tooltip');
            el.setAttribute('title', t.text);
        }
    });
    // Inicializar tooltips de Bootstrap
    if (window.bootstrap && window.bootstrap.Tooltip) {
        document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
            new bootstrap.Tooltip(el);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(agregarTooltipsBienestar, 500);
}); 