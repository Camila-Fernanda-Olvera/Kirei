// Sistema de Notificaciones - Kirei
class SistemaNotificaciones {
    constructor() {
        this.notificaciones = [];
        this.configuracion = {};
        this.intervalo = null;
        this.audioContext = null;
        this.ultimaNotificacion = null;
        this.init();
    }

    async init() {
        await this.cargarConfiguracion();
        this.inicializarAudio();
        this.iniciarPolling();
        this.crearToastContainer();
        this.configurarEventListeners();
    }

    async cargarConfiguracion() {
        try {
            const response = await fetch('PHP/notificaciones.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=configuracion'
            });
            const data = await response.json();
            if (data.success) {
                this.configuracion = data.configuracion;
            }
        } catch (error) {
            console.error('Error al cargar configuración:', error);
        }
    }

    inicializarAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (error) {
            console.warn('AudioContext no disponible:', error);
        }
    }

    crearToastContainer() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            container.style.zIndex = '10800';
            document.body.appendChild(container);
        }
    }

    configurarEventListeners() {
        // Escuchar cambios de visibilidad de la página
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pausarPolling();
            } else {
                this.reanudarPolling();
            }
        });

        // Escuchar cuando la página se vuelve activa
        window.addEventListener('focus', () => {
            this.reanudarPolling();
        });

        // Escuchar cuando la página pierde el foco
        window.addEventListener('blur', () => {
            this.pausarPolling();
        });
    }

    iniciarPolling() {
        // Verificar notificaciones cada 30 segundos
        this.intervalo = setInterval(() => {
            this.verificarNotificaciones();
        }, 30000);

        // Verificación inicial
        this.verificarNotificaciones();
    }

    pausarPolling() {
        if (this.intervalo) {
            clearInterval(this.intervalo);
            this.intervalo = null;
        }
    }

    reanudarPolling() {
        if (!this.intervalo) {
            this.iniciarPolling();
        }
    }

    async verificarNotificaciones() {
        try {
            // Primero procesar recordatorios automáticamente
            await this.procesarRecordatoriosAutomaticos();
            
            // Luego obtener notificaciones
            const response = await fetch('PHP/notificaciones.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'action=get_notificaciones'
            });
            const data = await response.json();
            
            if (data.success && Array.isArray(data.notificaciones)) {
                this.procesarNuevasNotificaciones(data.notificaciones);
            }
        } catch (error) {
            console.error('Error al verificar notificaciones:', error);
        }
    }

    async procesarRecordatoriosAutomaticos() {
        try {
            const response = await fetch('PHP/procesar-recordatorios.php');
            const data = await response.json();
            if (data.success) {
                console.log('Recordatorios procesados automáticamente');
            }
        } catch (error) {
            console.error('Error al procesar recordatorios:', error);
        }
    }

    procesarNuevasNotificaciones(notificaciones) {
        const ahora = new Date();
        
        notificaciones.forEach(notif => {
            const fechaNotif = new Date(notif.fecha_creacion);
            const esNueva = !this.ultimaNotificacion || fechaNotif > this.ultimaNotificacion;
            
            if (esNueva && notif.estado === 'pendiente') {
                this.mostrarNotificacion(notif);
                this.ultimaNotificacion = fechaNotif;
            }
        });
    }

    mostrarNotificacion(notificacion) {
        if (!this.estaNotificacionActiva(notificacion.tipo)) return;
        if (this.estaEnHorarioSilencio()) return;
        const toast = this.crearToastBootstrap(notificacion);
        this.agregarToastAlContainer(toast);
        this.reproducirSonido(notificacion.tipo);
        this.vibrar(notificacion.tipo);
        // Mostrar el toast con Bootstrap
        const bsToast = new bootstrap.Toast(toast, { delay: 6000 });
        bsToast.show();
    }

    estaNotificacionActiva(tipo) {
        const config = this.configuracion[tipo];
        return config ? config.activo : true; // Por defecto activo
    }

    estaEnHorarioSilencio() {
        const ahora = new Date();
        const horaActual = ahora.getHours() * 60 + ahora.getMinutes();
        
        // Verificar configuración de silencio para cualquier tipo
        for (const tipo in this.configuracion) {
            const config = this.configuracion[tipo];
            if (config && config.hora_silencio_inicio && config.hora_silencio_fin) {
                const inicio = this.convertirHoraAMinutos(config.hora_silencio_inicio);
                const fin = this.convertirHoraAMinutos(config.hora_silencio_fin);
                
                if (inicio <= fin) {
                    // Mismo día (ej: 22:00 a 07:00)
                    if (horaActual >= inicio || horaActual <= fin) {
                        return true;
                    }
                } else {
                    // Diferentes días (ej: 22:00 a 07:00 del día siguiente)
                    if (horaActual >= inicio || horaActual <= fin) {
                        return true;
                    }
                }
            }
        }
        
        return false;
    }

    convertirHoraAMinutos(hora) {
        const [horas, minutos] = hora.split(':').map(Number);
        return horas * 60 + minutos;
    }

    crearToastBootstrap(notificacion) {
        const icono = this.obtenerIconoNotificacion(notificacion.tipo);
        const color = this.obtenerColorNotificacion(notificacion.tipo);
        const toast = document.createElement('div');
        toast.className = 'toast align-items-center text-bg-light border-0 shadow';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        toast.innerHTML = `
            <div class="toast-header" style="background: ${color}; color: #fff;">
                <i class="bi ${icono} me-2"></i>
                <strong class="me-auto">${notificacion.titulo}</strong>
                <small class="text-light">Ahora</small>
                <button type="button" class="btn-close btn-close-white ms-2 mb-1" data-bs-dismiss="toast" aria-label="Cerrar"></button>
            </div>
            <div class="toast-body">
                <div>${notificacion.mensaje}</div>
                <div class="mt-2">
                    ${this.obtenerBotonesAccion(notificacion)}
                </div>
            </div>
        `;
        return toast;
    }

    obtenerIconoNotificacion(tipo) {
        const iconos = {
            'medicamento': 'bi-capsule',
            'cita': 'bi-calendar-event',
            'mensaje_familiar': 'bi-chat-dots',
            'recordatorio': 'bi-bell',
            'emergencia': 'bi-exclamation-triangle'
        };
        return iconos[tipo] || 'bi-bell';
    }

    obtenerColorNotificacion(tipo) {
        const colores = {
            'medicamento': '#4DBFC9',
            'cita': '#197074',
            'mensaje_familiar': '#FF8FB1',
            'recordatorio': '#FFC107',
            'emergencia': '#DC3545'
        };
        return colores[tipo] || '#6C757D';
    }

    obtenerBotonesAccion(notificacion) {
        if (notificacion.tipo === 'medicamento') {
            return `
                <button class="btn btn-sm btn-success" onclick="sistemaNotificaciones.tomarMedicamento(${notificacion.id})">
                    <i class="bi bi-check"></i> Tomar ahora
                </button>
                <button class="btn btn-sm btn-warning" onclick="sistemaNotificaciones.posponerNotificacion(${notificacion.id})">
                    <i class="bi bi-clock"></i> 5 min
                </button>
                <button class="btn btn-sm btn-secondary" onclick="sistemaNotificaciones.descartarNotificacion(${notificacion.id})">
                    <i class="bi bi-x"></i> Descartar
                </button>
            `;
        } else if (notificacion.tipo === 'mensaje_familiar') {
            return `
                <button class="btn btn-sm btn-primary" onclick="sistemaNotificaciones.verMensaje(${notificacion.id})">
                    <i class="bi bi-chat"></i> Ver mensaje
                </button>
                <button class="btn btn-sm btn-secondary" onclick="sistemaNotificaciones.descartarNotificacion(${notificacion.id})">
                    <i class="bi bi-x"></i> Descartar
                </button>
            `;
        } else {
            return `
                <button class="btn btn-sm btn-primary" onclick="sistemaNotificaciones.marcarLeida(${notificacion.id})">
                    <i class="bi bi-check"></i> Entendido
                </button>
                <button class="btn btn-sm btn-secondary" onclick="sistemaNotificaciones.descartarNotificacion(${notificacion.id})">
                    <i class="bi bi-x"></i> Descartar
                </button>
            `;
        }
    }

    agregarToastAlContainer(toast) {
        const container = document.getElementById('toast-container');
        container.appendChild(toast);
    }

    reproducirSonido(tipo) {
        if (!this.audioContext) return;
        
        const config = this.configuracion[tipo];
        const sonido = config ? config.sonido : 'default';
        
        if (sonido === 'none') return;
        
        // Crear un tono simple
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        // Configurar frecuencia según el tipo
        const frecuencias = {
            'medicamento': 800,
            'cita': 600,
            'mensaje_familiar': 1000,
            'emergencia': 400
        };
        
        oscillator.frequency.setValueAtTime(frecuencias[tipo] || 600, this.audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    vibrar(tipo) {
        if ('vibrate' in navigator) {
            const config = this.configuracion[tipo];
            const vibracion = config ? config.vibracion : true;
            
            if (vibracion) {
                const patrones = {
                    'medicamento': [200, 100, 200],
                    'cita': [300, 100, 300],
                    'mensaje_familiar': [100, 50, 100, 50, 100],
                    'emergencia': [500, 200, 500, 200, 500]
                };
                
                navigator.vibrate(patrones[tipo] || [200]);
            }
        }
    }

    // Acciones de notificaciones
    async tomarMedicamento(notificacionId) {
        try {
            const response = await fetch('PHP/notificaciones.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `action=marcar_completada&notificacion_id=${notificacionId}&respuesta=tomar_ahora`
            });
            
            const data = await response.json();
            if (data.success) {
                this.mostrarMensajeExito('Medicamento registrado como tomado');
            }
        } catch (error) {
            console.error('Error al tomar medicamento:', error);
        }
    }

    async posponerNotificacion(notificacionId) {
        try {
            const response = await fetch('PHP/notificaciones.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `action=marcar_completada&notificacion_id=${notificacionId}&respuesta=posponer`
            });
            
            const data = await response.json();
            if (data.success) {
                this.mostrarMensajeExito('Recordatorio pospuesto 5 minutos');
                
                // Reprogramar notificación en 5 minutos
                setTimeout(() => {
                    this.verificarNotificaciones();
                }, 300000); // 5 minutos
            }
        } catch (error) {
            console.error('Error al posponer notificación:', error);
        }
    }

    async descartarNotificacion(notificacionId) {
        try {
            const response = await fetch('PHP/notificaciones.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `action=marcar_completada&notificacion_id=${notificacionId}&respuesta=descartar`
            });
            
            const data = await response.json();
            if (data.success) {
                this.mostrarMensajeExito('Notificación descartada');
            }
        } catch (error) {
            console.error('Error al descartar notificación:', error);
        }
    }

    async marcarLeida(notificacionId) {
        try {
            const response = await fetch('PHP/notificaciones.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `action=marcar_leida&notificacion_id=${notificacionId}`
            });
            
            const data = await response.json();
            if (data.success) {
                this.mostrarMensajeExito('Notificación marcada como leída');
            }
        } catch (error) {
            console.error('Error al marcar como leída:', error);
        }
    }

    verMensaje(notificacionId) {
        // Aquí se abriría el chat con el familiar
        this.mostrarMensajeExito('Abriendo chat...');
        // Implementar lógica para abrir chat
    }

    mostrarMensajeExito(mensaje) {
        // Usar SweetAlert2 si está disponible
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: '¡Listo!',
                text: mensaje,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            console.log(mensaje);
        }
    }

    // Métodos públicos para integración
    async enviarMensajeFamiliar(destinatarioId, mensaje) {
        try {
            const response = await fetch('PHP/notificaciones.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `action=enviar_mensaje&destinatario_id=${destinatarioId}&mensaje=${encodeURIComponent(mensaje)}`
            });
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
            return { success: false, message: 'Error al enviar mensaje' };
        }
    }

    async obtenerMensajes(familiarId) {
        try {
            const response = await fetch(`PHP/notificaciones.php?action=get_mensajes&familiar_id=${familiarId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener mensajes:', error);
            return { success: false, message: 'Error al obtener mensajes' };
        }
    }

    // Configuración
    async actualizarConfiguracion(tipo, config) {
        try {
            const formData = new URLSearchParams();
            formData.append('action', 'actualizar_configuracion');
            formData.append('tipo', tipo);
            
            for (const [key, value] of Object.entries(config)) {
                formData.append(key, value);
            }
            
            const response = await fetch('PHP/notificaciones.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: formData.toString()
            });
            
            const data = await response.json();
            if (data.success) {
                await this.cargarConfiguracion();
            }
            return data;
        } catch (error) {
            console.error('Error al actualizar configuración:', error);
            return { success: false, message: 'Error al actualizar configuración' };
        }
    }
}

// Inicializar sistema de notificaciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.sistemaNotificaciones = new SistemaNotificaciones();
    const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
    if (cerrarSesionBtn) {
        cerrarSesionBtn.onclick = () => {
            fetch('PHP/cerrar-sesion.php').then(() => window.location.href = 'Index.html');
        };
    }
});

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SistemaNotificaciones;
}

// Después de renderizar notificaciones (en la función que pinta las tarjetas)
if (typeof aplicarClasesTarjetasOscuras === 'function') {
    aplicarClasesTarjetasOscuras();
} 