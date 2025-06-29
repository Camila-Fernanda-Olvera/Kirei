// Sistema de Internacionalización (i18n) - Kirei
class I18n {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'es';
        this.translations = {
            es: {
                // Wizard - Paso 1: Datos Personales
                'wizard.title': 'Configuración de Perfil',
                'wizard.subtitle': 'Completa tu información para personalizar tu experiencia',
                'wizard.step1.title': 'Datos Personales',
                'wizard.step2.title': 'Información Médica',
                'wizard.step3.title': 'Medicación y Contactos',
                'wizard.step4.title': 'Vinculación y Permisos',
                'wizard.birthdate': 'Fecha de nacimiento',
                'wizard.birthdate.help': 'Selecciona tu fecha de nacimiento',
                'wizard.gender': 'Género',
                'wizard.gender.male': 'Masculino',
                'wizard.gender.female': 'Femenino',
                'wizard.gender.other': 'Otro',
                'wizard.gender.select': 'Selecciona tu género',
                'wizard.country': 'País',
                'wizard.country.placeholder': 'Ej: México',
                'wizard.language': 'Idioma preferido',
                'wizard.language.es': 'Español',
                'wizard.language.en': 'Inglés',
                'wizard.next': 'Siguiente',
                'wizard.previous': 'Anterior',
                'wizard.complete': 'Completar Registro',
                'wizard.specialty.select': 'Selecciona la especialidad',
                'wizard.phone.placeholder': 'Número de teléfono del médico',
                'wizard.blood.type.select': 'Selecciona tu tipo de sangre',
                'wizard.diet.select': 'Selecciona tu dieta',
                'wizard.emergency.relation.select': 'Selecciona la relación',

                // Wizard - Paso 2: Información Médica
                'wizard.diagnosis.date': 'Fecha de diagnóstico',
                'wizard.diagnosis.help': '¿Cuándo te diagnosticaron tu condición?',
                'wizard.doctor': 'Médico tratante',
                'wizard.doctor.placeholder': 'Nombre de tu médico',
                'wizard.specialty': 'Especialidad del médico',
                'wizard.specialty.general': 'Medicina General',
                'wizard.specialty.cardiology': 'Cardiología',
                'wizard.specialty.endocrinology': 'Endocrinología',
                'wizard.specialty.neurology': 'Neurología',
                'wizard.specialty.oncology': 'Oncología',
                'wizard.specialty.pulmonology': 'Neumología',
                'wizard.specialty.gastroenterology': 'Gastroenterología',
                'wizard.specialty.other': 'Otra',
                'wizard.phone': 'Teléfono del médico',
                'wizard.phone.help': 'Opcional - Para contactos de emergencia',
                'wizard.blood.type': 'Tipo de sangre',
                'wizard.diet': 'Tipo de dieta',
                'wizard.diet.normal': 'Dieta normal',
                'wizard.diet.low.sodium': 'Baja en sodio',
                'wizard.diet.low.sugar': 'Baja en azúcar',
                'wizard.diet.gluten.free': 'Sin gluten',
                'wizard.diet.vegetarian': 'Vegetariana',
                'wizard.diet.vegan': 'Vegana',
                'wizard.diet.other': 'Otra',
                'wizard.allergies': 'Alergias',
                'wizard.allergies.placeholder': 'Ej: penicilina, polen, mariscos...',
                'wizard.allergies.help': 'Deja en blanco si no tienes alergias',

                // Wizard - Paso 3: Medicación y Contactos
                'wizard.medication': 'Medicamentos actuales',
                'wizard.medication.example': 'Ejemplo de formato:',
                'wizard.medication.example1': '• Metformina 500mg - 1 tableta cada 8 horas',
                'wizard.medication.example2': '• Aspirina 100mg - 1 tableta diaria',
                'wizard.medication.example3': '• Vitamina D - 1 cápsula al día',
                'wizard.medication.placeholder': 'Lista tus medicamentos con dosis y frecuencia...',
                'wizard.medication.help': 'Deja en blanco si no tomas medicamentos',
                'wizard.emergency.name': 'Contacto de emergencia - Nombre',
                'wizard.emergency.name.placeholder': 'Nombre completo',
                'wizard.emergency.phone': 'Contacto de emergencia - Teléfono',
                'wizard.emergency.phone.placeholder': 'Número de teléfono',
                'wizard.emergency.relation': 'Relación con el contacto',
                'wizard.emergency.relation.spouse': 'Esposo/a',
                'wizard.emergency.relation.child': 'Hijo/a',
                'wizard.emergency.relation.father': 'Padre',
                'wizard.emergency.relation.mother': 'Madre',
                'wizard.emergency.relation.sibling': 'Hermano/a',
                'wizard.emergency.relation.friend': 'Amigo/a',
                'wizard.emergency.relation.other': 'Otro',

                // Wizard - Paso 4: Vinculación y Permisos
                'wizard.linking.question': '¿Quieres vincular tu cuenta con algún familiar?',
                'wizard.linking.yes': 'Sí, quiero vincular',
                'wizard.linking.no': 'No, por ahora no',
                'wizard.code.title': 'Código de Vinculación',
                'wizard.code.description': 'Comparte este código con tu familiar para que pueda conectarse a tu cuenta:',
                'wizard.code.expiration': 'Fecha de expiración:',
                'wizard.code.expiration.help': 'Tu familiar deberá ingresar este código al registrarse antes de que expire',
                'wizard.permissions.title': 'Permisos para familiares',
                'wizard.permissions.symptoms': 'Ver síntomas y progreso',
                'wizard.permissions.medication': 'Ver medicación',
                'wizard.permissions.appointments': 'Ver citas médicas',
                'wizard.permissions.location': 'Compartir ubicación en emergencias',
                'wizard.notifications.title': 'Notificaciones',
                'wizard.notifications.medication': 'Recordatorios de medicación',
                'wizard.notifications.appointments': 'Recordatorios de citas',
                'wizard.notifications.ai': 'Sugerencias de IA',

                // Dashboard del Paciente
                'dashboard.my.info': 'Mi Información',
                'dashboard.edit': 'Editar',
                'dashboard.name': 'Nombre:',
                'dashboard.age': 'Edad:',
                'dashboard.blood.type': 'Tipo de sangre:',
                'dashboard.doctor': 'Médico tratante:',
                'dashboard.condition': 'Condición:',
                'dashboard.allergies': 'Alergias:',
                'dashboard.emergency.contact': 'Contacto emergencia:',
                'dashboard.phone': 'Teléfono:',
                'dashboard.appointments': 'Próximas Citas',
                'dashboard.new.appointment': 'Nueva Cita',
                'dashboard.medications': 'Mis Medicamentos',
                'dashboard.add.medication': 'Agregar',
                'dashboard.notifications': 'Notificaciones',
                'dashboard.mark.all': 'Marcar todas',
                'dashboard.my.family': 'Mi Familia',
                'dashboard.invite': 'Invitar',
                'dashboard.emergency': 'EMERGENCIA',
                'dashboard.emergency.help': 'Presiona en caso de emergencia médica',

                // Estados y acciones
                'status.taken': 'Tomado',
                'status.pending': 'Pendiente',
                'status.online': 'En línea',
                'status.last.seen': 'Última vez: hace',

                // Mensajes del sistema
                'messages.required.fields': 'Campos Requeridos',
                'messages.required.fields.text': 'Por favor completa todos los campos obligatorios',
                'messages.saving': 'Guardando información...',
                'messages.please.wait': 'Por favor espera',
                'messages.registration.complete': '¡Registro Completado!',
                'messages.registration.complete.text': 'Tu información ha sido guardada correctamente. Bienvenido a Kirei.',
                'messages.start': 'Comenzar',
                'messages.error': 'Error',
                'messages.error.text': 'No se pudieron guardar los datos. Por favor intenta nuevamente.',
                'messages.understood': 'Entendido',

                // Funciones del dashboard
                'functions.edit.profile': 'Editar Perfil',
                'functions.edit.profile.text': 'Esta funcionalidad estará disponible próximamente',
                'functions.settings': 'Configuración',
                'functions.settings.text': 'Esta funcionalidad estará disponible próximamente',
                'functions.add.appointment': 'Agregar Cita',
                'functions.add.appointment.text': 'Esta funcionalidad estará disponible próximamente',
                'functions.add.medication': 'Agregar Medicamento',
                'functions.add.medication.text': 'Esta funcionalidad estará disponible próximamente',
                'functions.emergency': '¡EMERGENCIA!',
                'functions.emergency.text': 'Se ha enviado alerta a tus contactos de emergencia y servicio médico',
                'functions.logout': '¿Cerrar Sesión?',
                'functions.logout.text': '¿Estás seguro de que quieres salir?',
                'functions.yes.logout': 'Sí, Salir',
                'functions.cancel': 'Cancelar',

                // Notificaciones de ejemplo
                'notifications.medication.reminder': 'Recordatorio de medicación',
                'notifications.medication.reminder.text': 'Es hora de tomar tu Aspirina',
                'notifications.appointment.confirmed': 'Cita confirmada',
                'notifications.appointment.confirmed.text': 'Tu cita con Dr. García está confirmada',
                'notifications.new.analysis': 'Nuevo análisis disponible',
                'notifications.new.analysis.text': 'Revisa tus resultados de glucosa',
                'notifications.ago.minutes': 'Hace 5 minutos',
                'notifications.ago.hour': 'Hace 1 hora',
                'notifications.ago.hours': 'Hace 2 horas'
            },
            en: {
                // Wizard - Step 1: Personal Data
                'wizard.title': 'Profile Setup',
                'wizard.subtitle': 'Complete your information to personalize your experience',
                'wizard.step1.title': 'Personal Data',
                'wizard.step2.title': 'Medical Information',
                'wizard.step3.title': 'Medication and Contacts',
                'wizard.step4.title': 'Linking and Permissions',
                'wizard.birthdate': 'Date of birth',
                'wizard.birthdate.help': 'Select your date of birth',
                'wizard.gender': 'Gender',
                'wizard.gender.male': 'Male',
                'wizard.gender.female': 'Female',
                'wizard.gender.other': 'Other',
                'wizard.gender.select': 'Select your gender',
                'wizard.country': 'Country',
                'wizard.country.placeholder': 'Ex: United States',
                'wizard.language': 'Preferred language',
                'wizard.language.es': 'Spanish',
                'wizard.language.en': 'English',
                'wizard.next': 'Next',
                'wizard.previous': 'Previous',
                'wizard.complete': 'Complete Registration',
                'wizard.specialty.select': 'Select specialty',
                'wizard.phone.placeholder': "Doctor's phone number",
                'wizard.blood.type.select': 'Select your blood type',
                'wizard.diet.select': 'Select your diet',
                'wizard.emergency.relation.select': 'Select relationship',

                // Wizard - Step 2: Medical Information
                'wizard.diagnosis.date': 'Diagnosis date',
                'wizard.diagnosis.help': 'When were you diagnosed with your condition?',
                'wizard.doctor': 'Treating physician',
                'wizard.doctor.placeholder': 'Your doctor\'s name',
                'wizard.specialty': 'Doctor\'s specialty',
                'wizard.specialty.general': 'General Medicine',
                'wizard.specialty.cardiology': 'Cardiology',
                'wizard.specialty.endocrinology': 'Endocrinology',
                'wizard.specialty.neurology': 'Neurology',
                'wizard.specialty.oncology': 'Oncology',
                'wizard.specialty.pulmonology': 'Pulmonology',
                'wizard.specialty.gastroenterology': 'Gastroenterology',
                'wizard.specialty.other': 'Other',
                'wizard.phone': 'Doctor\'s phone',
                'wizard.phone.help': 'Optional - For emergency contacts',
                'wizard.blood.type': 'Blood type',
                'wizard.diet': 'Diet type',
                'wizard.diet.normal': 'Normal diet',
                'wizard.diet.low.sodium': 'Low sodium',
                'wizard.diet.low.sugar': 'Low sugar',
                'wizard.diet.gluten.free': 'Gluten free',
                'wizard.diet.vegetarian': 'Vegetarian',
                'wizard.diet.vegan': 'Vegan',
                'wizard.diet.other': 'Other',
                'wizard.allergies': 'Allergies',
                'wizard.allergies.placeholder': 'Ex: penicillin, pollen, shellfish...',
                'wizard.allergies.help': 'Leave blank if you have no allergies',

                // Wizard - Step 3: Medication and Contacts
                'wizard.medication': 'Current medications',
                'wizard.medication.example': 'Format example:',
                'wizard.medication.example1': '• Metformin 500mg - 1 tablet every 8 hours',
                'wizard.medication.example2': '• Aspirin 100mg - 1 tablet daily',
                'wizard.medication.example3': '• Vitamin D - 1 capsule daily',
                'wizard.medication.placeholder': 'List your medications with dosage and frequency...',
                'wizard.medication.help': 'Leave blank if you don\'t take medications',
                'wizard.emergency.name': 'Emergency contact - Name',
                'wizard.emergency.name.placeholder': 'Full name',
                'wizard.emergency.phone': 'Emergency contact - Phone',
                'wizard.emergency.phone.placeholder': 'Phone number',
                'wizard.emergency.relation': 'Relationship with contact',
                'wizard.emergency.relation.spouse': 'Spouse',
                'wizard.emergency.relation.child': 'Child',
                'wizard.emergency.relation.father': 'Father',
                'wizard.emergency.relation.mother': 'Mother',
                'wizard.emergency.relation.sibling': 'Sibling',
                'wizard.emergency.relation.friend': 'Friend',
                'wizard.emergency.relation.other': 'Other',

                // Wizard - Step 4: Linking and Permissions
                'wizard.linking.question': 'Do you want to link your account with a family member?',
                'wizard.linking.yes': 'Yes, I want to link',
                'wizard.linking.no': 'No, not now',
                'wizard.code.title': 'Linking Code',
                'wizard.code.description': 'Share this code with your family member so they can connect to your account:',
                'wizard.code.expiration': 'Expiration date:',
                'wizard.code.expiration.help': 'Your family member must enter this code when registering before it expires',
                'wizard.permissions.title': 'Permissions for family members',
                'wizard.permissions.symptoms': 'View symptoms and progress',
                'wizard.permissions.medication': 'View medication',
                'wizard.permissions.appointments': 'View medical appointments',
                'wizard.permissions.location': 'Share location in emergencies',
                'wizard.notifications.title': 'Notifications',
                'wizard.notifications.medication': 'Medication reminders',
                'wizard.notifications.appointments': 'Appointment reminders',
                'wizard.notifications.ai': 'AI suggestions',

                // Patient Dashboard
                'dashboard.my.info': 'My Information',
                'dashboard.edit': 'Edit',
                'dashboard.name': 'Name:',
                'dashboard.age': 'Age:',
                'dashboard.blood.type': 'Blood type:',
                'dashboard.doctor': 'Treating physician:',
                'dashboard.condition': 'Condition:',
                'dashboard.allergies': 'Allergies:',
                'dashboard.emergency.contact': 'Emergency contact:',
                'dashboard.phone': 'Phone:',
                'dashboard.appointments': 'Upcoming Appointments',
                'dashboard.new.appointment': 'New Appointment',
                'dashboard.medications': 'My Medications',
                'dashboard.add.medication': 'Add',
                'dashboard.notifications': 'Notifications',
                'dashboard.mark.all': 'Mark all',
                'dashboard.my.family': 'My Family',
                'dashboard.invite': 'Invite',
                'dashboard.emergency': 'EMERGENCY',
                'dashboard.emergency.help': 'Press in case of medical emergency',

                // Status and actions
                'status.taken': 'Taken',
                'status.pending': 'Pending',
                'status.online': 'Online',
                'status.last.seen': 'Last seen: ago',

                // System messages
                'messages.required.fields': 'Required Fields',
                'messages.required.fields.text': 'Please complete all required fields',
                'messages.saving': 'Saving information...',
                'messages.please.wait': 'Please wait',
                'messages.registration.complete': 'Registration Complete!',
                'messages.registration.complete.text': 'Your information has been saved successfully. Welcome to Kirei.',
                'messages.start': 'Start',
                'messages.error': 'Error',
                'messages.error.text': 'Could not save the data. Please try again.',
                'messages.understood': 'Understood',

                // Dashboard functions
                'functions.edit.profile': 'Edit Profile',
                'functions.edit.profile.text': 'This functionality will be available soon',
                'functions.settings': 'Settings',
                'functions.settings.text': 'This functionality will be available soon',
                'functions.add.appointment': 'Add Appointment',
                'functions.add.appointment.text': 'This functionality will be available soon',
                'functions.add.medication': 'Add Medication',
                'functions.add.medication.text': 'This functionality will be available soon',
                'functions.emergency': 'EMERGENCY!',
                'functions.emergency.text': 'Alert has been sent to your emergency contacts and medical service',
                'functions.logout': 'Logout?',
                'functions.logout.text': 'Are you sure you want to exit?',
                'functions.yes.logout': 'Yes, Exit',
                'functions.cancel': 'Cancel',

                // Example notifications
                'notifications.medication.reminder': 'Medication reminder',
                'notifications.medication.reminder.text': 'It\'s time to take your Aspirin',
                'notifications.appointment.confirmed': 'Appointment confirmed',
                'notifications.appointment.confirmed.text': 'Your appointment with Dr. Garcia is confirmed',
                'notifications.new.analysis': 'New analysis available',
                'notifications.new.analysis.text': 'Check your glucose results',
                'notifications.ago.minutes': '5 minutes ago',
                'notifications.ago.hour': '1 hour ago',
                'notifications.ago.hours': '2 hours ago'
            }
        };
    }

    // Obtener idioma almacenado
    getStoredLanguage() {
        return localStorage.getItem('kirei_language') || 'es';
    }

    // Establecer idioma
    setLanguage(language) {
        this.currentLanguage = language;
        localStorage.setItem('kirei_language', language);
        this.updatePageLanguage();
    }

    // Obtener traducción
    t(key) {
        return this.translations[this.currentLanguage][key] || key;
    }

    // Actualizar idioma de la página
    updatePageLanguage() {
        // Actualizar elementos con atributo data-i18n
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // Actualizar placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // Actualizar títulos
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });

        // Actualizar atributos alt
        document.querySelectorAll('[data-i18n-alt]').forEach(element => {
            const key = element.getAttribute('data-i18n-alt');
            element.alt = this.t(key);
        });

        // Actualizar contenido de botones
        document.querySelectorAll('[data-i18n-content]').forEach(element => {
            const key = element.getAttribute('data-i18n-content');
            element.innerHTML = this.t(key);
        });

        // Disparar evento personalizado para que otros scripts sepan que el idioma cambió
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLanguage }
        }));
    }

    // Cambiar idioma
    toggleLanguage() {
        const newLanguage = this.currentLanguage === 'es' ? 'en' : 'es';
        this.setLanguage(newLanguage);
        return newLanguage;
    }

    // Obtener idioma actual
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Verificar si es español
    isSpanish() {
        return this.currentLanguage === 'es';
    }

    // Verificar si es inglés
    isEnglish() {
        return this.currentLanguage === 'en';
    }
}

// Crear instancia global
window.i18n = new I18n();

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    window.i18n.updatePageLanguage();
}); 