// BlueLobsters Authentication API Client
class AuthAPI {
    constructor() {
        // Detect environment and set appropriate base URL
        if (window.location.protocol === 'file:') {
            // Local development - files opened directly
            this.baseURL = 'http://localhost:3000';
            console.warn('⚠️  Detectado protocolo file://. Asegúrate de que el servidor esté ejecutándose en http://localhost:3000');
        } else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            // Local development - server running
            this.baseURL = window.location.origin;
        } else {
            // Production - use current domain
            this.baseURL = window.location.origin;
        }
        
        this.token = localStorage.getItem('bluelobster_token');
        console.log('🔧 AuthAPI initialized with baseURL:', this.baseURL);
        console.log('🌍 Environment:', this.getEnvironment());
    }

    getEnvironment() {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'development';
        } else if (window.location.hostname.includes('bluelobsters.io')) {
            return 'production';
        } else {
            return 'unknown';
        }
    }

    // Helper method to make API requests
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}/api${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Add authorization header if token exists
        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        console.log('🌐 Making request to:', url);
        console.log('📋 Request config:', config);

        try {
            const response = await fetch(url, config);
            console.log('📨 Response status:', response.status);
            console.log('📨 Response headers:', response.headers);
            
            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.error('❌ Non-JSON response received:', contentType);
                const text = await response.text();
                console.error('❌ Response body:', text.substring(0, 200) + '...');
                
                // If we get HTML, it means the server is not running
                if (text.includes('<!DOCTYPE') || text.includes('<html>')) {
                    throw new Error('🚫 El servidor de autenticación no está disponible. Por favor, contacta al administrador.');
                }
                
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Response data:', data);

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            return data;
        } catch (error) {
            // If it's a fetch error (network issue)
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                console.error('❌ Network error - is the server running?');
                
                // Show instructions if running from file://
                if (window.location.protocol === 'file:') {
                    alert('⚠️ Debes usar el servidor local!\n\n1. Abre una terminal\n2. Ejecuta: npm start\n3. Ve a: http://localhost:3000');
                    window.location.href = 'instructions.html';
                    return;
                }
                
                throw new Error('Error de conexión: ¿Está el servidor ejecutándose en http://localhost:3000?');
            }
            
            // If it's a JSON parse error, provide more context
            if (error.name === 'SyntaxError') {
                console.error('❌ Invalid JSON response from server');
                throw new Error('Error de servidor: Respuesta inválida');
            }
            
            console.error('❌ API Request Error:', error);
            throw error;
        }
    }

    // Register new user
    async register(name, email, password) {
        try {
            const data = await this.makeRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password })
            });

            // Store token and user info
            this.token = data.token;
            localStorage.setItem('bluelobster_token', data.token);
            localStorage.setItem('bluelobster_user', JSON.stringify(data.user));

            return data;
        } catch (error) {
            throw error;
        }
    }

    // Login user
    async login(email, password) {
        try {
            const data = await this.makeRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            // Store token and user info
            this.token = data.token;
            localStorage.setItem('bluelobster_token', data.token);
            localStorage.setItem('bluelobster_user', JSON.stringify(data.user));

            return data;
        } catch (error) {
            throw error;
        }
    }

    // Verify if current token is valid
    async verifyToken() {
        try {
            if (!this.token) {
                return false;
            }

            const data = await this.makeRequest('/auth/verify');
            return data.valid;
        } catch (error) {
            // Token is invalid, remove it
            this.logout();
            return false;
        }
    }

    // Get user profile
    async getProfile() {
        try {
            const data = await this.makeRequest('/auth/profile');
            return data.user;
        } catch (error) {
            throw error;
        }
    }

    // Logout user
    logout() {
        this.token = null;
        localStorage.removeItem('bluelobster_token');
        localStorage.removeItem('bluelobster_user');
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token;
    }

    // Get stored user info
    getCurrentUser() {
        const userStr = localStorage.getItem('bluelobster_user');
        return userStr ? JSON.parse(userStr) : null;
    }
}

// Auth Manager for UI
class AuthManager {
    constructor() {
        this.api = new AuthAPI();
        this.init();
    }

    init() {
        // Check authentication status on page load
        this.checkAuthStatus();
    }

    async checkAuthStatus() {
        if (this.api.isAuthenticated()) {
            const isValid = await this.api.verifyToken();
            if (!isValid) {
                console.log('Token expired, redirecting to login');
                // Token is invalid, will be handled by verifyToken method
            }
        }
    }

    // Show authentication popup
    showAuthPopup() {
        const authPopup = document.getElementById('auth-popup');
        if (authPopup) {
            authPopup.classList.remove('hidden');
            this.showLoginForm();
        }
    }

    // Hide authentication popup
    hideAuthPopup() {
        const authPopup = document.getElementById('auth-popup');
        if (authPopup) {
            authPopup.classList.add('hidden');
            this.clearAuthForms();
        }
    }

    // Show login form
    showLoginForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        if (loginForm && registerForm) {
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
            this.clearAuthForms();
        }
    }

    // Show register form
    showRegisterForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        if (loginForm && registerForm) {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
            this.clearAuthForms();
        }
    }

    // Clear form errors and reset forms
    clearAuthForms() {
        const loginError = document.getElementById('login-error');
        const registerError = document.getElementById('register-error');
        const loginForm = document.getElementById('login-form-element');
        const registerForm = document.getElementById('register-form-element');

        if (loginError) loginError.classList.add('hidden');
        if (registerError) registerError.classList.add('hidden');
        if (loginForm) loginForm.reset();
        if (registerForm) registerForm.reset();
    }

    // Show error message
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }

    // Handle login
    async handleLogin(email, password) {
        try {
            const result = await this.api.login(email, password);
            this.hideAuthPopup();
            window.location.href = '/dojo';
            return result;
        } catch (error) {
            this.showError('login-error', error.message);
            throw error;
        }
    }

    // Handle registration
    async handleRegister(name, email, password, confirmPassword) {
        // Client-side validation
        if (password !== confirmPassword) {
            this.showError('register-error', 'Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            this.showError('register-error', 'La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            const result = await this.api.register(name, email, password);
            this.hideAuthPopup();
            window.location.href = '/dojo';
            return result;
        } catch (error) {
            this.showError('register-error', error.message);
            throw error;
        }
    }

    // Check if user can access protected page
    async canAccessDojo() {
        if (!this.api.isAuthenticated()) {
            return false;
        }
        return await this.api.verifyToken();
    }

    // Access dojo (with authentication check)
    async accessDojo() {
        const canAccess = await this.canAccessDojo();
        if (canAccess) {
            window.location.href = '/dojo';
        } else {
            this.showAuthPopup();
        }
    }

    // Display user info in UI
    displayUserInfo() {
        const user = this.api.getCurrentUser();
        if (user) {
            const userWelcome = document.getElementById('user-welcome');
            const userWelcomeMobile = document.getElementById('user-welcome-mobile');
            
            const displayName = user.name || user.email;
            const welcomeText = `¡Hola, ${displayName}!`;
            
            if (userWelcome) userWelcome.textContent = welcomeText;
            if (userWelcomeMobile) userWelcomeMobile.textContent = welcomeText;
        }
    }

    // Logout user
    logout() {
        this.api.logout();
        window.location.href = '/';
    }
}

// Initialize global auth manager
window.authManager = new AuthManager();