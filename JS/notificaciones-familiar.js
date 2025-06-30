class SistemaNotificacionesFamiliar {
    constructor() {
        this.notificaciones = [];
        this.intervalo = null;
        this.ultimaNotificacion = null;
        this.init();
    }

    async init() {
        this.iniciarPolling();
    }

    iniciarPolling() {
        this.intervalo = setInterval(() => {
            this.verificarNotificaciones();
        }, 30000);
        this.verificarNotificaciones();
    }

    async verificarNotificaciones() {
        try {
            const response = await fetch('PHP/notificaciones-familiar.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=get_notificaciones_paciente'
            });
            const data = await response.json();
            if (data.success && Array.isArray(data.notificaciones)) {
                this.mostrarNotificaciones(data.notificaciones);
            } else {
                this.mostrarError(data.message || 'No se pudieron cargar notificaciones');
            }
        } catch (error) {
            this.mostrarError('Error de red al cargar notificaciones');
        }
    }

    mostrarNotificaciones(notificaciones) {
        const lista = document.getElementById('listaNotificaciones');
        if (!lista) return;
        if (notificaciones.length === 0) {
            lista.innerHTML = '<div class="text-center py-4"><i class="bi bi-inbox" style="font-size: 2.5rem; color: #4DBFC9;"></i><p class="mt-2">No hay notificaciones para mostrar.</p></div>';
            return;
        }
        lista.innerHTML = '';
        notificaciones.forEach(notif => {
            const item = this.crearItemNotificacion(notif);
            lista.appendChild(item);
        });
    }

    crearItemNotificacion(notif) {
        const div = document.createElement('div');
        div.className = `notificacion-item ${notif.estado}`;
        div.innerHTML = `
            <div class="notificacion-header">
                <span class="notificacion-titulo">${notif.titulo}</span>
                <span class="notificacion-fecha">${this.formatearFecha(notif.fecha_creacion)}</span>
            </div>
            <div class="notificacion-mensaje">${notif.mensaje}</div>
            <span class="notificacion-tipo tipo-${notif.tipo}">${notif.tipo}</span>
        `;
        div.onclick = () => this.marcarLeida(notif.id, div);
        return div;
    }

    async marcarLeida(id, div) {
        try {
            await fetch('PHP/notificaciones-familiar.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `action=marcar_leida&id=${id}`
            });
            div.classList.remove('pendiente');
            div.classList.add('leida');
        } catch {}
    }

    formatearFecha(fecha) {
        const d = new Date(fecha);
        return d.toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
    }

    mostrarError(msg) {
        const lista = document.getElementById('listaNotificaciones');
        if (lista) lista.innerHTML = `<div class='alert alert-danger'>${msg}</div>`;
    }
}

document.addEventListener('DOMContentLoaded', () => new SistemaNotificacionesFamiliar()); 