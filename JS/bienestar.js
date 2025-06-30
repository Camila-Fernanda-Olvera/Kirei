// JS/bienestar.js - CRUD Bienestar para Kirei

document.addEventListener('DOMContentLoaded', function() {
    cargarBienestar();
    document.getElementById('bienestar-crud').innerHTML = `
        <div class="tarjeta card-pastel-2 p-4 mb-4 shadow">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="d-flex align-items-center mb-0" style="font-weight:800;"><i class="bi bi-activity me-2 text-primary"></i>Registros de Bienestar</h3>
                <button class="btn btn-outline-primary btn-lg px-4 py-2 rounded-pill shadow" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFormBienestar" aria-expanded="false" aria-controls="collapseFormBienestar">
                    <i class="bi bi-plus-circle me-2"></i>Agregar registro
                </button>
            </div>
            <div class="collapse glass-form-bg" id="collapseFormBienestar" style="background:rgba(200,230,255,0.85);border-radius:18px;box-shadow:0 4px 20px rgba(77,191,201,0.10);padding:1.5rem 1rem 1rem 1rem;">
                <form id="formBienestar" class="row g-3 mb-2">
                    <div class="col-md-4 position-relative">
                        <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;background:transparent;"><i class="bi bi-droplet-half"></i></span>
                        <input type="number" step="0.1" min="0" class="form-control ps-5 glass-input" id="glucosa" placeholder="Glucosa (mg/dL)" required title="Nivel de glucosa en sangre" style="background:rgba(143,179,226,0.18);">
                    </div>
                    <div class="col-md-4 position-relative">
                        <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;background:transparent;"><i class="bi bi-heart-pulse"></i></span>
                        <input type="text" class="form-control ps-5 glass-input" id="presion" placeholder="Presión arterial (mmHg)" title="Ejemplo: 120/80" style="background:rgba(143,179,226,0.18);">
                    </div>
                    <div class="col-md-4 position-relative">
                        <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;background:transparent;"><i class="bi bi-activity"></i></span>
                        <input type="number" min="0" class="form-control ps-5 glass-input" id="fc" placeholder="Frec. Cardíaca (bpm)" title="Frecuencia cardíaca" style="background:rgba(143,179,226,0.18);">
                    </div>
                    <div class="col-md-4 position-relative">
                        <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;background:transparent;"><i class="bi bi-shoe-prints"></i></span>
                        <input type="number" min="0" class="form-control ps-5 glass-input" id="pasos" placeholder="Pasos" title="Cantidad de pasos diarios" style="background:rgba(143,179,226,0.18);">
                    </div>
                    <div class="col-md-4 position-relative">
                        <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;background:transparent;"><i class="bi bi-person-fill"></i></span>
                        <input type="number" step="0.1" min="0" class="form-control ps-5 glass-input" id="peso" placeholder="Peso (kg)" title="Peso corporal" style="background:rgba(143,179,226,0.18);">
                    </div>
                    <div class="col-md-4 position-relative">
                        <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;background:transparent;"><i class="bi bi-bar-chart"></i></span>
                        <input type="number" step="0.1" min="0" class="form-control ps-5 glass-input" id="imc" placeholder="IMC" title="Índice de Masa Corporal" style="background:rgba(143,179,226,0.18);">
                    </div>
                    <div class="col-md-4 position-relative">
                        <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;background:transparent;"><i class="bi bi-droplet"></i></span>
                        <input type="number" step="0.1" min="0" class="form-control ps-5 glass-input" id="saturacion" placeholder="Sat. O2 (%)" title="Saturación de oxígeno" style="background:rgba(143,179,226,0.18);">
                    </div>
                    <div class="col-md-4 position-relative">
                        <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;background:transparent;"><i class="bi bi-thermometer-half"></i></span>
                        <input type="number" step="0.1" min="0" class="form-control ps-5 glass-input" id="temp" placeholder="Temp. (°C)" title="Temperatura corporal" style="background:rgba(143,179,226,0.18);">
                    </div>
                    <div class="col-md-4 position-relative">
                        <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;background:transparent;"><i class="bi bi-calendar-event"></i></span>
                        <input type="date" class="form-control ps-5 glass-input" id="fecha" required title="Fecha del registro" style="background:rgba(143,179,226,0.18);">
                    </div>
                    <div class="col-md-12 d-flex justify-content-end">
                        <button type="submit" class="btn btn-outline-primary btn px-4 py-2 rounded-pill shadow"><i class="bi bi-plus-circle me-2"></i>Agregar</button>
                    </div>
                </form>
            </div>
            <div class="mb-3 d-flex gap-2">
                <button class="btn btn-outline-primary" id="btnVistaTarjetasBienestar"><i class="bi bi-grid-3x3-gap"></i> Tarjetas</button>
                <button class="btn btn-outline-secondary" id="btnVistaTablaBienestar"><i class="bi bi-table"></i> Tabla</button>
            </div>
            <div id="contenedorBienestarVista"></div>
        </div>
    `;
    document.getElementById('formBienestar').onsubmit = function(e) {
        guardarBienestar(e);
        setTimeout(function() {
            var collapse = bootstrap.Collapse.getOrCreateInstance(document.getElementById('collapseFormBienestar'));
            collapse.hide();
        }, 400);
    };
    // Alternancia de vista
    document.getElementById('btnVistaTarjetasBienestar').onclick = function() {
        localStorage.setItem('bienestarVista', 'tarjetas');
        renderBienestarVista();
    };
    document.getElementById('btnVistaTablaBienestar').onclick = function() {
        localStorage.setItem('bienestarVista', 'tabla');
        renderBienestarVista();
    };
    renderBienestarVista();
});

function renderBienestarVista() {
    const vista = localStorage.getItem('bienestarVista') || 'tarjetas';
    const btnTarjetas = document.getElementById('btnVistaTarjetasBienestar');
    const btnTabla = document.getElementById('btnVistaTablaBienestar');
    if (btnTarjetas) btnTarjetas.classList.toggle('btn-primary', vista==='tarjetas');
    if (btnTabla) btnTabla.classList.toggle('btn-primary', vista==='tabla');
    fetch('PHP/bienestar.php?action=list')
        .then(r => r.json())
        .then(data => {
            const cont = document.getElementById('contenedorBienestarVista');
            if (!data.success || !Array.isArray(data.registros) || data.registros.length === 0) {
                cont.innerHTML = '<div class="text-muted text-center">Sin registros</div>';
                return;
            }
            if (vista === 'tarjetas') {
                const ul = document.createElement('ul');
                ul.className = 'lista-bienestar list-unstyled';
                data.registros.forEach(reg => {
                    const li = document.createElement('li');
                    li.className = 'd-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 tarjeta card-pastel-3 p-3';
                    li.innerHTML = `
                        <div>
                            <span class="fw-bold"><i class="bi bi-calendar-event"></i> ${reg.fecha_registro.split(' ')[0]}</span>
                            <span class="ms-3"><i class="bi bi-droplet-half"></i> Glucosa: <b>${reg.glucosa ?? '-'}</b></span>
                            <span class="ms-3"><i class="bi bi-heart-pulse"></i> FC: <b>${reg.frecuencia_cardiaca ?? '-'}</b></span>
                            <span class="ms-3"><i class="bi bi-thermometer-half"></i> Temp: <b>${reg.temperatura_corporal ?? '-'}</b></span>
                            <span class="ms-3"><i class="bi bi-bar-chart"></i> IMC: <b>${reg.imc ?? '-'}</b></span>
                            <span class="ms-3"><i class="bi bi-person-fill"></i> Peso: <b>${reg.peso ?? '-'}</b></span>
                            <span class="ms-3"><i class="bi bi-shoe-prints"></i> Pasos: <b>${reg.pasos_diarios ?? '-'}</b></span>
                            <span class="ms-3"><i class="bi bi-droplet"></i> Sat. O2: <b>${reg.saturacion_oxigeno ?? '-'}</b></span>
                            <span class="ms-3"><i class="bi bi-activity"></i> Presión: <b>${reg.presion_arterial ?? '-'}</b></span>
                        </div>
                        <div class="mt-2 mt-md-0">
                            <button class='btn btn-outline-warning btn-sm me-1' onclick='editarBienestar(${JSON.stringify(reg)})'><i class='bi bi-pencil'></i></button>
                            <button class='btn btn-outline-danger btn-sm' onclick='eliminarBienestar(${reg.id})'><i class='bi bi-trash'></i></button>
                        </div>
                    `;
                    ul.appendChild(li);
                });
                cont.innerHTML = '';
                cont.appendChild(ul);
            } else {
                // Tabla
                let html = `<div class="table-responsive"><table class="table table-striped table-hover align-middle shadow tarjeta card-pastel-3"><thead><tr>
                    <th>Fecha</th><th>Glucosa</th><th>Presión</th><th>FC</th><th>Temp</th><th>IMC</th><th>Peso</th><th>Pasos</th><th>Sat. O2</th><th>Acciones</th></tr></thead><tbody>`;
                data.registros.forEach(reg => {
                    html += `<tr>
                        <td>${reg.fecha_registro.split(' ')[0]}</td>
                        <td>${reg.glucosa ?? '-'}</td>
                        <td>${reg.presion_arterial ?? '-'}</td>
                        <td>${reg.frecuencia_cardiaca ?? '-'}</td>
                        <td>${reg.temperatura_corporal ?? '-'}</td>
                        <td>${reg.imc ?? '-'}</td>
                        <td>${reg.peso ?? '-'}</td>
                        <td>${reg.pasos_diarios ?? '-'}</td>
                        <td>${reg.saturacion_oxigeno ?? '-'}</td>
                        <td>
                            <button class='btn btn-outline-warning btn-sm me-1' onclick='editarBienestar(${JSON.stringify(reg)})'><i class='bi bi-pencil'></i></button>
                            <button class='btn btn-outline-danger btn-sm' onclick='eliminarBienestar(${reg.id})'><i class='bi bi-trash'></i></button>
                        </td>
                    </tr>`;
                });
                html += '</tbody></table></div>';
                cont.innerHTML = html;
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
            // Fallback visual: usar SweetAlert2 en vez de alert
            Swal.fire({
                icon: 'warning',
                title: '¡Alerta de Bienestar!',
                html: alertas.join('<br>'),
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#dc3545',
                background: document.body.classList.contains('modo-oscuro') ? '#223A4E' : '#fff',
                color: document.body.classList.contains('modo-oscuro') ? '#F8FAFF' : '#23404A'
            });
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
        <div class="tarjeta card-pastel-2 p-4 mb-4 shadow">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="d-flex align-items-center mb-0" style="font-weight:800;"><i class="bi bi-capsule me-2 text-primary"></i>Mis Medicamentos</h3>
                <button class="btn btn-outline-primary btn-lg px-4 py-2 rounded-pill shadow" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFormMedicamento" aria-expanded="false" aria-controls="collapseFormMedicamento">
                    <i class="bi bi-plus-circle me-2"></i>Agregar medicamento
                </button>
            </div>
            <div class="collapse glass-form-bg" id="collapseFormMedicamento" style="background:rgba(200,230,255,0.85);border-radius:18px;box-shadow:0 4px 20px rgba(77,191,201,0.10);padding:1.5rem 1rem 1rem 1rem;">
                <form id="formMedicamento" class="row g-3 mb-2">
                    <div class="col-md-4 position-relative">
                        <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;background:transparent;"><i class="bi bi-capsule"></i></span>
                        <input type="text" class="form-control ps-5 glass-input" id="medNombre" placeholder="Nombre" required title="Nombre del medicamento" style="background:rgba(143,179,226,0.18);">
                    </div>
                    <div class="col-md-4 position-relative">
                        <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;background:transparent;"><i class="bi bi-clipboard-heart"></i></span>
                        <input type="text" class="form-control ps-5 glass-input" id="medTipo" placeholder="Tipo" title="Tipo de medicamento" style="background:rgba(143,179,226,0.18);">
                    </div>
                    <div class="col-md-4 position-relative">
                        <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;background:transparent;"><i class="bi bi-droplet-half"></i></span>
                        <input type="text" class="form-control ps-5 glass-input" id="medDosis" placeholder="Dosis" title="Dosis recomendada" style="background:rgba(143,179,226,0.18);">
                    </div>
                    <div class="col-md-4 position-relative">
                        <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;background:transparent;"><i class="bi bi-clock-history"></i></span>
                        <input type="text" class="form-control ps-5 glass-input" id="medFrecuencia" placeholder="Frecuencia" title="Frecuencia de toma" style="background:rgba(143,179,226,0.18);">
                    </div>
                    <div class="col-md-4 position-relative">
                        <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;background:transparent;"><i class="bi bi-alarm"></i></span>
                        <input type="text" class="form-control ps-5 glass-input" id="medHorarios" placeholder="Horarios" title="Ejemplo: 08:00, 14:00" style="background:rgba(143,179,226,0.18);">
                    </div>
                    <div class="col-md-4 position-relative">
                        <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;background:transparent;"><i class="bi bi-calendar-event"></i></span>
                        <input type="date" class="form-control ps-5 glass-input" id="medInicio" placeholder="Inicio" title="Fecha de inicio" style="background:rgba(143,179,226,0.18);">
                    </div>
                    <div class="col-md-4 position-relative">
                        <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;background:transparent;"><i class="bi bi-calendar-x"></i></span>
                        <input type="date" class="form-control ps-5 glass-input" id="medFin" placeholder="Fin" title="Fecha de fin" style="background:rgba(143,179,226,0.18);">
                    </div>
                    <div class="col-md-4 position-relative">
                        <span class="input-group-text position-absolute top-0 start-0" style="z-index:2;background:transparent;"><i class="bi bi-info-circle"></i></span>
                        <input type="text" class="form-control ps-5 glass-input" id="medIndicaciones" placeholder="Indicaciones" title="Indicaciones adicionales" style="background:rgba(143,179,226,0.18);">
                    </div>
                    <div class="col-md-12 d-flex justify-content-end">
                        <button type="submit" class="btn btn-outline-primary btn px-4 py-2 rounded-pill shadow"><i class="bi bi-plus-circle me-2"></i>Agregar</button>
                    </div>
                </form>
            </div>
            <div class="mb-3 d-flex gap-2">
                <button class="btn btn-outline-primary" id="btnVistaTarjetasMedicamentos"><i class="bi bi-grid-3x3-gap"></i> Tarjetas</button>
                <button class="btn btn-outline-secondary" id="btnVistaTablaMedicamentos"><i class="bi bi-table"></i> Tabla</button>
            </div>
            <div id="contenedorMedicamentosVista"></div>
        </div>
    `;
    document.getElementById('formMedicamento').onsubmit = function(e) {
        guardarMedicamento(e);
        setTimeout(function() {
            var collapse = bootstrap.Collapse.getOrCreateInstance(document.getElementById('collapseFormMedicamento'));
            collapse.hide();
        }, 400);
    };
    setTimeout(agregarTooltipsMedicamentos, 300);
    // Alternancia de vista
    document.getElementById('btnVistaTarjetasMedicamentos').onclick = function() {
        localStorage.setItem('medicamentosVista', 'tarjetas');
        renderMedicamentosVista();
    };
    document.getElementById('btnVistaTablaMedicamentos').onclick = function() {
        localStorage.setItem('medicamentosVista', 'tabla');
        renderMedicamentosVista();
    };
    renderMedicamentosVista();
}

function renderMedicamentosVista() {
    const vista = localStorage.getItem('medicamentosVista') || 'tarjetas';
    const btnTarjetas = document.getElementById('btnVistaTarjetasMedicamentos');
    const btnTabla = document.getElementById('btnVistaTablaMedicamentos');
    if (btnTarjetas) btnTarjetas.classList.toggle('btn-primary', vista==='tarjetas');
    if (btnTabla) btnTabla.classList.toggle('btn-primary', vista==='tabla');
    fetch('PHP/medicamentos.php?action=list')
        .then(r => r.json())
        .then(data => {
            const cont = document.getElementById('contenedorMedicamentosVista');
            if (!data.success || !Array.isArray(data.medicamentos) || data.medicamentos.length === 0) {
                cont.innerHTML = '<div class="text-muted text-center">Sin registros</div>';
                return;
            }
            if (vista === 'tarjetas') {
                const ul = document.createElement('ul');
                ul.className = 'lista-meds list-unstyled';
                data.medicamentos.forEach(med => {
                    const li = document.createElement('li');
                    li.className = 'd-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 tarjeta card-pastel-4 p-3';
                    li.innerHTML = `
                        <div>
                            <span class="fw-bold"><i class="bi bi-capsule"></i> ${med.nombre ?? '-'}</span>
                            <span class="ms-3"><i class="bi bi-clipboard-heart"></i> ${med.tipo ?? '-'}</span>
                            <span class="ms-3"><i class="bi bi-droplet-half"></i> ${med.dosis ?? '-'}</span>
                            <span class="ms-3"><i class="bi bi-clock-history"></i> ${med.frecuencia ?? '-'}</span>
                            <span class="ms-3"><i class="bi bi-alarm"></i> ${med.horarios ?? '-'}</span>
                            <span class="ms-3"><i class="bi bi-calendar-event"></i> ${med.inicio ?? '-'}</span>
                            <span class="ms-3"><i class="bi bi-calendar-x"></i> ${med.fin ?? '-'}</span>
                            <span class="ms-3"><i class="bi bi-info-circle"></i> ${med.indicaciones ?? '-'}</span>
                        </div>
                        <div class="mt-2 mt-md-0">
                            <button class='btn btn-outline-warning btn-sm me-1' onclick='editarMedicamento(${JSON.stringify(med)})'><i class='bi bi-pencil'></i></button>
                            <button class='btn btn-outline-danger btn-sm' onclick='eliminarMedicamento(${med.id})'><i class='bi bi-trash'></i></button>
                        </div>
                    `;
                    ul.appendChild(li);
                });
                cont.innerHTML = '';
                cont.appendChild(ul);
            } else {
                // Tabla
                let html = `<div class="table-responsive"><table class="table table-striped table-hover align-middle shadow tarjeta card-pastel-4"><thead><tr>
                    <th>Nombre</th><th>Tipo</th><th>Dosis</th><th>Frecuencia</th><th>Horarios</th><th>Inicio</th><th>Fin</th><th>Indicaciones</th><th>Acciones</th></tr></thead><tbody>`;
                data.medicamentos.forEach(med => {
                    html += `<tr>
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
                html += '</tbody></table></div>';
                cont.innerHTML = html;
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
    .then(async data => {
        if (data.success) {
            // Crear recordatorios automáticos para cada horario
            const horarios = datos.horarios.split(',').map(h => h.trim()).filter(h => h);
            let recordatoriosCreados = 0;
            for (const hora of horarios) {
                const res = await fetch('PHP/notificaciones.php?action=crear_recordatorio_medicamento', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        medicamento_id: data.id || '', // si el backend devuelve el id, úsalo, si no, buscar por nombre
                        hora: hora,
                        dias_semana: '1,2,3,4,5,6,7'
                    })
                });
                const resData = await res.json();
                if (resData.success) recordatoriosCreados++;
            }
            Swal.fire('¡Guardado!', 'Medicamento agregado y recordatorio(s) creado(s) correctamente.', 'success');
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
        { id: 'pasos', text: 'Cantidad de pasos diarios.' },
        { id: 'peso', text: 'Peso en kilogramos.' },
        { id: 'imc', text: 'Índice de Masa Corporal. Normal: 18.5-30.' },
        { id: 'saturacion', text: 'Saturación de oxígeno. Normal: >92%.' },
        { id: 'temp', text: 'Temperatura corporal. Normal: 36-37°C.' },
        { id: 'fecha', text: 'Fecha del registro de bienestar.' }
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
        document.querySelectorAll('#collapseFormBienestar [data-bs-toggle="tooltip"]').forEach(el => {
            new bootstrap.Tooltip(el);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(agregarTooltipsBienestar, 300);
});

// Añadir función para actualizar el fondo del formulario colapsable según el modo
function actualizarEstiloFormulariosBienestar() {
    const esOscuro = document.body.classList.contains('modo-oscuro');
    // Bienestar
    const formBienestar = document.getElementById('collapseFormBienestar');
    if (formBienestar) {
        if (esOscuro) {
            formBienestar.style.background = 'rgba(34,58,78,0.92)';
            formBienestar.style.border = '2px solid #86DDE4';
        } else {
            formBienestar.style.background = 'rgba(200,230,255,0.85)';
            formBienestar.style.border = 'none';
        }
    }
    // Inputs Bienestar
    document.querySelectorAll('#collapseFormBienestar .glass-input').forEach(input => {
        if (esOscuro) {
            input.style.background = '#223A4E';
            input.style.color = '#F8FAFF';
            input.style.border = '2px solid #86DDE4';
            input.style.boxShadow = '';
            input.onfocus = function() {
                this.style.border = '2.5px solid #4DBFC9';
                this.style.boxShadow = '0 0 0 2px #4DBFC955';
            };
            input.onblur = function() {
                this.style.border = '2px solid #86DDE4';
                this.style.boxShadow = '';
            };
        } else {
            input.style.background = 'rgba(255,255,255,0.92)';
            input.style.color = '#23404A';
            input.style.border = '2px solid #B3E5FC';
            input.style.boxShadow = '';
            input.onfocus = function() {
                this.style.border = '2.5px solid #4DBFC9';
                this.style.boxShadow = '0 0 0 2px #4DBFC955';
            };
            input.onblur = function() {
                this.style.border = '2px solid #B3E5FC';
                this.style.boxShadow = '';
            };
        }
        // Placeholder más tenue
        input.style.setProperty('::placeholder', esOscuro ? '#A9C6E2' : '#8FB3E2');
    });
    // Medicamentos
    const formMed = document.getElementById('collapseFormMedicamento');
    if (formMed) {
        if (esOscuro) {
            formMed.style.background = 'rgba(34,58,78,0.92)';
            formMed.style.border = '2px solid #86DDE4';
        } else {
            formMed.style.background = 'rgba(200,230,255,0.85)';
            formMed.style.border = 'none';
        }
    }
    // Inputs Medicamentos
    document.querySelectorAll('#collapseFormMedicamento .glass-input').forEach(input => {
        if (esOscuro) {
            input.style.background = '#223A4E';
            input.style.color = '#F8FAFF';
            input.style.border = '2px solid #86DDE4';
            input.style.boxShadow = '';
            input.onfocus = function() {
                this.style.border = '2.5px solid #4DBFC9';
                this.style.boxShadow = '0 0 0 2px #4DBFC955';
            };
            input.onblur = function() {
                this.style.border = '2px solid #86DDE4';
                this.style.boxShadow = '';
            };
        } else {
            input.style.background = 'rgba(255,255,255,0.92)';
            input.style.color = '#23404A';
            input.style.border = '2px solid #B3E5FC';
            input.style.boxShadow = '';
            input.onfocus = function() {
                this.style.border = '2.5px solid #4DBFC9';
                this.style.boxShadow = '0 0 0 2px #4DBFC955';
            };
            input.onblur = function() {
                this.style.border = '2px solid #B3E5FC';
                this.style.boxShadow = '';
            };
        }
        // Placeholder más tenue
        input.style.setProperty('::placeholder', esOscuro ? '#A9C6E2' : '#8FB3E2');
    });
}
// Llamar al cargar y al cambiar el modo
setTimeout(actualizarEstiloFormulariosBienestar, 500);
document.addEventListener('DOMContentLoaded', function() {
    const switchDark = document.getElementById('switchDarkMode');
    if (switchDark) {
        switchDark.addEventListener('change', function() {
            setTimeout(actualizarEstiloFormulariosBienestar, 200);
        });
    }
    // Por si el modo cambia por otro script
    const observer = new MutationObserver(actualizarEstiloFormulariosBienestar);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
});

// Inyectar CSS para mejorar contraste de inputs y placeholder en modo claro/oscuro
(function(){
    const style = document.createElement('style');
    style.innerHTML = `
    #collapseFormBienestar .glass-input, #collapseFormMedicamento .glass-input {
        transition: border 0.2s, box-shadow 0.2s, background 0.2s;
    }
    #collapseFormBienestar .glass-input::placeholder,
    #collapseFormMedicamento .glass-input::placeholder {
        color: #8FB3E2;
        opacity: 1;
        font-weight: 500;
    }
    body.modo-oscuro #collapseFormBienestar .glass-input,
    body.modo-oscuro #collapseFormMedicamento .glass-input {
        background: #223A4E !important;
        color: #F8FAFF !important;
        border: 2px solid #86DDE4 !important;
    }
    body.modo-oscuro #collapseFormBienestar .glass-input:focus,
    body.modo-oscuro #collapseFormMedicamento .glass-input:focus {
        border: 2.5px solid #4DBFC9 !important;
        box-shadow: 0 0 0 2px #4DBFC955 !important;
        background: #223A4E !important;
    }
    body.modo-oscuro #collapseFormBienestar .glass-input::placeholder,
    body.modo-oscuro #collapseFormMedicamento .glass-input::placeholder {
        color: #A9C6E2 !important;
        opacity: 1;
    }
    #collapseFormBienestar .glass-input:focus,
    #collapseFormMedicamento .glass-input:focus {
        border: 2.5px solid #4DBFC9 !important;
        box-shadow: 0 0 0 2px #4DBFC955 !important;
        background: #fff !important;
        color: #23404A !important;
    }
    #collapseFormBienestar .glass-input,
    #collapseFormMedicamento .glass-input {
        background: rgba(255,255,255,0.92) !important;
        color: #23404A !important;
        border: 2px solid #B3E5FC !important;
    }
    `;
    document.head.appendChild(style);
})();

function agregarTooltipsMedicamentos() {
    const tooltips = [
        { id: 'medNombre', text: 'Nombre comercial o genérico del medicamento.' },
        { id: 'medTipo', text: 'Tipo: tableta, cápsula, jarabe, etc.' },
        { id: 'medDosis', text: 'Dosis recomendada, ej: 500mg.' },
        { id: 'medFrecuencia', text: 'Frecuencia: cada 8h, diaria, etc.' },
        { id: 'medHorarios', text: 'Horarios de toma, ej: 08:00, 14:00.' },
        { id: 'medInicio', text: 'Fecha de inicio del tratamiento.' },
        { id: 'medFin', text: 'Fecha de fin del tratamiento (opcional).' },
        { id: 'medIndicaciones', text: 'Indicaciones adicionales del médico.' }
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
        document.querySelectorAll('#collapseFormMedicamento [data-bs-toggle="tooltip"]').forEach(el => {
            new bootstrap.Tooltip(el);
        });
    }
}

// Inyectar CSS para la etiqueta Emergencia de notificaciones
(function(){
    const style = document.createElement('style');
    style.innerHTML = `
    .tipo-emergencia {
        background: rgba(220,53,69,0.92) !important;
        color: #fff !important;
        font-weight: 700;
        border-radius: 1.2em;
        padding: 0.3em 1.1em;
        letter-spacing: 0.5px;
        box-shadow: 0 2px 8px rgba(220,53,69,0.13);
        border: none;
        display: inline-block;
    }
    body.modo-oscuro .tipo-emergencia {
        background: #C43556 !important;
        color: #fff !important;
        border: none;
    }
    `;
    document.head.appendChild(style);
})();

// Solución de error: definir funciones de recarga para compatibilidad
function cargarBienestar() {
    renderBienestarVista();
}
function cargarMedicamentos() {
    renderMedicamentosVista();
} 