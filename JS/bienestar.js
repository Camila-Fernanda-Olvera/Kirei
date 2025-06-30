// JS/bienestar.js - CRUD Bienestar para Kirei

document.addEventListener('DOMContentLoaded', function() {
    cargarBienestar();
    document.getElementById('bienestar-crud').innerHTML = `
        <form id="formBienestar" class="row g-3 mb-4">
            <div class="col-md-3">
                <input type="number" step="0.1" min="0" class="form-control" id="glucosa" placeholder="Glucosa (mg/dL)" required>
            </div>
            <div class="col-md-3">
                <input type="text" class="form-control" id="presion" placeholder="Presión arterial (mmHg)">
            </div>
            <div class="col-md-2">
                <input type="number" min="0" class="form-control" id="fc" placeholder="Frec. Cardíaca (bpm)">
            </div>
            <div class="col-md-2">
                <input type="number" min="0" class="form-control" id="pasos" placeholder="Pasos">
            </div>
            <div class="col-md-2">
                <input type="number" step="0.1" min="0" class="form-control" id="peso" placeholder="Peso (kg)">
            </div>
            <div class="col-md-2">
                <input type="number" step="0.1" min="0" class="form-control" id="imc" placeholder="IMC">
            </div>
            <div class="col-md-2">
                <input type="number" step="0.1" min="0" class="form-control" id="saturacion" placeholder="Sat. O2 (%)">
            </div>
            <div class="col-md-2">
                <input type="number" step="0.1" min="0" class="form-control" id="temp" placeholder="Temp. (°C)">
            </div>
            <div class="col-md-3">
                <input type="date" class="form-control" id="fecha" required>
            </div>
            <div class="col-md-2">
                <button type="submit" class="btn btn-outline-primary w-100"><i class="bi bi-plus-circle"></i> Agregar</button>
            </div>
        </form>
        <div class="table-responsive">
            <table class="table table-hover align-middle" id="tablaBienestar">
                <thead class="table-light">
                    <tr>
                        <th>Fecha</th><th>Glucosa</th><th>Presión</th><th>FC</th><th>Pasos</th><th>Peso</th><th>IMC</th><th>Sat. O2</th><th>Temp.</th><th>Acciones</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
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

// Guardar nuevo registro
function guardarBienestar(e) {
    e.preventDefault();
    const datos = {
        glucosa: document.getElementById('glucosa').value,
        presion: document.getElementById('presion').value,
        fc: document.getElementById('fc').value,
        pasos: document.getElementById('pasos').value,
        peso: document.getElementById('peso').value,
        imc: document.getElementById('imc').value,
        saturacion: document.getElementById('saturacion').value,
        temp: document.getElementById('temp').value,
        fecha: document.getElementById('fecha').value
    };
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