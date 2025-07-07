// Offline Fallback for BlueLobsters.io Authentication
// This script provides basic functionality when the Node.js server is not available

class OfflineAuthFallback {
    constructor() {
        this.isOfflineMode = true;
        this.initializeFallback();
    }

    initializeFallback() {
        console.log('🔧 Modo offline activado - servidor Node.js no disponible');
        this.showOfflineNotification();
    }

    showOfflineNotification() {
        // Create offline notification
        const notification = document.createElement('div');
        notification.id = 'offline-notification';
        notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-exclamation-triangle"></i>
                <span class="text-sm font-medium">Modo de demostración - Servidor de autenticación no disponible</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        document.body.appendChild(notification);

        // Auto remove after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 10000);
    }

    // Handle authentication attempts in offline mode
    handleOfflineAuth(action) {
        const message = action === 'login' 
            ? '📧 Para acceder al Dojo, necesitas que el servidor esté activo.\n\n👨‍💻 Contacta al administrador o espera a que se complete el deployment.'
            : '📧 Para crear una cuenta, necesitas que el servidor esté activo.\n\n👨‍💻 Contacta al administrador o espera a que se complete el deployment.';

        // Show modal instead of alert
        this.showOfflineModal(message, action);
    }

    showOfflineModal(message, action) {
        // Remove existing modal if any
        const existingModal = document.getElementById('offline-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'offline-modal';
        modal.className = 'fixed inset-0 bg-black/70 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4 relative">
                <button onclick="this.closest('#offline-modal').remove()" class="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800">&times;</button>
                
                <div class="text-center mb-6">
                    <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i class="fas fa-server text-yellow-600 text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-2">Servidor No Disponible</h3>
                    <p class="text-gray-600 text-sm leading-relaxed">${message}</p>
                </div>

                <div class="space-y-3">
                    <a href="https://walink.co/3b8320" target="_blank" class="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center">
                        <i class="fab fa-whatsapp mr-2"></i>
                        Contactar por WhatsApp
                    </a>
                    
                    <button onclick="this.closest('#offline-modal').remove()" class="w-full bg-gray-100 text-gray-800 font-medium py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                        Cerrar
                    </button>
                </div>

                <div class="mt-6 text-center">
                    <p class="text-xs text-gray-500">
                        💡 <strong>Nota:</strong> Los archivos del sitio están completos. Solo falta activar el servidor Node.js.
                    </p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // Provide fallback for auth manager methods
    createFallbackAuthManager() {
        return {
            accessDojo: () => {
                this.handleOfflineAuth('login');
            },
            showAuthPopup: () => {
                // Still show the popup, but modify the submission behavior
                document.getElementById('auth-popup').classList.remove('hidden');
            },
            hideAuthPopup: () => {
                document.getElementById('auth-popup').classList.add('hidden');
            },
            showLoginForm: () => {
                const loginForm = document.getElementById('login-form');
                const registerForm = document.getElementById('register-form');
                if (loginForm && registerForm) {
                    loginForm.classList.remove('hidden');
                    registerForm.classList.add('hidden');
                }
            },
            showRegisterForm: () => {
                const loginForm = document.getElementById('login-form');
                const registerForm = document.getElementById('register-form');
                if (loginForm && registerForm) {
                    loginForm.classList.add('hidden');
                    registerForm.classList.remove('hidden');
                }
            },
            handleLogin: (email, password) => {
                this.handleOfflineAuth('login');
                return Promise.reject(new Error('Servidor no disponible'));
            },
            handleRegister: (name, email, password, confirmPassword) => {
                this.handleOfflineAuth('register');
                return Promise.reject(new Error('Servidor no disponible'));
            }
        };
    }
}

// Initialize offline fallback when auth.js fails to load properly
window.addEventListener('DOMContentLoaded', () => {
    // Check if authManager is available, if not, create fallback
    setTimeout(() => {
        if (typeof window.authManager === 'undefined' || !window.authManager) {
            console.log('🔄 Activando modo offline...');
            const fallback = new OfflineAuthFallback();
            window.authManager = fallback.createFallbackAuthManager();
            
            // Override form submissions to show offline message
            const loginForm = document.getElementById('login-form-element');
            const registerForm = document.getElementById('register-form-element');
            
            if (loginForm) {
                loginForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    fallback.handleOfflineAuth('login');
                });
            }
            
            if (registerForm) {
                registerForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    fallback.handleOfflineAuth('register');
                });
            }
        }
    }, 1000);
});
