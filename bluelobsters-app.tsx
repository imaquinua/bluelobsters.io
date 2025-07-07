import React, { useState, useEffect, createContext, useContext } from 'react';
import { ChevronRight, Menu, X, Send, Sparkles, Brain, Waves, Target, Zap, MessageCircle, LogOut, Plus, GripVertical, Search, Bell, Settings, Users, BarChart3, TrendingUp, Calendar, Clock, Award, Star, Heart, Briefcase, Coffee, Rocket, Diamond, Crown, Trophy, Gem } from 'lucide-react';

// Context de Autenticación
const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = [
      { email: 'admin@bluelobsters.io', password: 'admin123', name: 'Admin Blue' },
      { email: 'user@test.com', password: 'user123', name: 'Test User' }
    ];
    
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const userData = { email: foundUser.email, name: foundUser.name };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = (email, password) => {
    const userData = { email, name: email.split('@')[0] };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Componente de Cursor Halo
const CursorHalo = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updatePosition);
    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  return (
    <div 
      className="fixed w-32 h-32 pointer-events-none z-50 transition-all duration-300 ease-out"
      style={{
        left: position.x - 64,
        top: position.y - 64,
        background: 'radial-gradient(circle, rgba(0, 207, 255, 0.1) 0%, transparent 70%)',
        filter: 'blur(10px)'
      }}
    />
  );
};

// Componente de Scroll Tracker
const ScrollTracker = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showSparks, setShowSparks] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      
      if (progress > 75 && !showSparks) {
        setShowSparks(true);
        setTimeout(() => setShowSparks(false), 2000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showSparks]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      {showSparks && (
        <div className="fixed inset-0 pointer-events-none z-40">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${2 + Math.random() * 2}s ease-out`
              }}
            >
              <Sparkles className="text-coral-500 w-4 h-4" />
            </div>
          ))}
        </div>
      )}
    </>
  );
};

// Componente de Chat
const ChatBot = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hola, soy Blue Lobster GPT. ¿En qué frecuencia estás vibrando hoy?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [messageCount, setMessageCount] = useState(0);

  const rickRubinQuotes = [
    "La simplicidad es la sofisticación suprema en la mutación.",
    "Tu frecuencia única ya existe, solo necesitas sintonizarla.",
    "Menos es más cuando vibras en tu esencia.",
    "La creatividad fluye cuando eliminas lo innecesario.",
    "Confía en tu proceso de mutación, es único."
  ];

  const sendMessage = () => {
    if (!input.trim()) return;
    
    if (!user && messageCount >= 3) {
      setMessages([...messages, 
        { id: Date.now(), text: input, sender: 'user' },
        { id: Date.now() + 1, text: "Has alcanzado el límite de mensajes. Inicia sesión para conversaciones ilimitadas.", sender: 'bot' }
      ]);
      return;
    }

    const newMessage = { id: Date.now(), text: input, sender: 'user' };
    setMessages([...messages, newMessage]);
    setInput('');
    setMessageCount(messageCount + 1);

    setTimeout(() => {
      const botResponse = rickRubinQuotes[Math.floor(Math.random() * rickRubinQuotes.length)];
      setMessages(prev => [...prev, { id: Date.now(), text: botResponse, sender: 'bot' }]);
    }, 1500);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-cyan-500 text-white p-4 rounded-full shadow-lg hover:bg-cyan-600 transition-all duration-300 transform hover:scale-110 z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-gray-900 rounded-lg shadow-2xl z-40 flex flex-col">
          <div className="bg-cyan-600 p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="text-white font-bold">Blue Lobster GPT</h3>
            <button onClick={() => setIsOpen(false)} className="text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${
                  msg.sender === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-200'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-800">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Escribe tu mensaje..."
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                onClick={sendMessage}
                className="bg-cyan-600 text-white p-2 rounded-lg hover:bg-cyan-700 transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            {!user && (
              <p className="text-xs text-gray-400 mt-2">
                {3 - messageCount} mensajes restantes. Inicia sesión para chat ilimitado.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Landing Page
const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { user } = useAuth();

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 3000);
      setEmail('');
    }
  };

  const phases = [
    { title: 'Desmutación', icon: Brain, description: 'Elimina lo innecesario, encuentra tu esencia' },
    { title: 'Resonancia', icon: Waves, description: 'Sintoniza con tu frecuencia única' },
    { title: 'Mutación', icon: Zap, description: 'Transforma activamente tu realidad' },
    { title: 'Evolución', icon: Target, description: 'Consolida tu nueva forma de ser' }
  ];

  return (
    <div className="min-h-screen bg-[#001F3F] text-white">
      <ScrollTracker />
      
      {/* Header */}
      <header className="fixed top-0 w-full bg-[#001F3F]/95 backdrop-blur-sm z-30 border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-cyan-500 rounded-full animate-pulse" />
            <span className="text-xl font-bold">BlueLobsters.io</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#phases" className="hover:text-cyan-400 transition-colors">Proceso</a>
            <a href="#community" className="hover:text-cyan-400 transition-colors">Comunidad</a>
            <a href="/chat" className="hover:text-cyan-400 transition-colors">Chat</a>
          </nav>
          <a href="/login" className="bg-cyan-500 px-6 py-2 rounded-lg hover:bg-cyan-600 transition-colors">
            {user ? 'Dashboard' : 'Acceder'}
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20">
        <div className="container mx-auto px-6 text-center">
          {/* Animación de langosta */}
          <div className="mb-12">
            <div className="inline-block relative">
              <div className="w-32 h-32 bg-cyan-500 rounded-full animate-morph mx-auto" />
              <style jsx>{`
                @keyframes morph {
                  0%, 100% { border-radius: 50%; transform: scale(1) rotate(0deg); }
                  25% { border-radius: 30%; transform: scale(1.1) rotate(90deg); }
                  50% { border-radius: 20%; transform: scale(0.9) rotate(180deg); }
                  75% { border-radius: 40%; transform: scale(1.05) rotate(270deg); }
                }
                .animate-morph {
                  animation: morph 8s ease-in-out infinite;
                }
              `}</style>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            BlueLobsters.io
          </h1>
          <p className="text-2xl md:text-3xl mb-12 text-gray-300">
            Mutamos el sistema a tu frecuencia
          </p>

          {/* Newsletter Form */}
          <form onSubmit={handleNewsletter} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="flex-1 bg-gray-800/50 border border-gray-700 px-6 py-3 rounded-lg focus:outline-none focus:border-cyan-500 transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-cyan-500 px-8 py-3 rounded-lg hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>Recibir ejercicios</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            {subscribed && (
              <p className="mt-4 text-cyan-400 animate-pulse">
                ¡Suscrito! Revisa tu email para tus 3 ejercicios de Desmutación
              </p>
            )}
          </form>

          <div className="mt-12 flex justify-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>+2K Resonadores</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4" />
              <span>4.9/5 Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Phases Section */}
      <section id="phases" className="py-20 overflow-x-hidden">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">El Proceso de Mutación</h2>
          
          <div className="flex overflow-x-auto space-x-6 pb-6 snap-x snap-mandatory">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              return (
                <div
                  key={index}
                  className="min-w-[300px] bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 snap-center transform transition-all duration-300 hover:rotate-3 hover:scale-105 cursor-pointer"
                >
                  <div className="bg-cyan-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <Icon className="w-8 h-8 text-cyan-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-center">{phase.title}</h3>
                  <p className="text-gray-400 text-center">{phase.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Únete a la Comunidad</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Más de 2,000 resonadores mutando juntos. Encuentra tu tribu, comparte tu proceso y evoluciona en comunidad.
          </p>
          <a
            href="https://discord.gg/bluelobsters"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-3 bg-[#5865F2] px-8 py-4 rounded-lg hover:bg-[#4752C4] transition-colors text-lg"
          >
            <Users className="w-6 h-6" />
            <span>Unirse a Discord</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="container mx-auto px-6 text-center text-gray-400">
          <p>&copy; 2024 BlueLobsters.io - Mutando sistemas desde las profundidades</p>
        </div>
      </footer>
    </div>
  );
};

// Login/Register Page
const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const [redirect, setRedirect] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (login(email, password)) {
        setRedirect(true);
      } else {
        setError('Credenciales inválidas');
      }
    } else {
      if (password !== confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
      if (password.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres');
        return;
      }
      register(email, password);
      setRedirect(true);
    }
  };

  if (redirect) {
    window.location.href = '/dashboard';
    return null;
  }

  return (
    <div className="min-h-screen bg-[#001F3F] flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-cyan-500 rounded-full mx-auto mb-4 animate-pulse" />
            <h2 className="text-3xl font-bold text-white">
              {isLogin ? 'Accede a tu laboratorio' : 'Crea tu laboratorio'}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmar contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  required
                />
              </div>
            )}

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-cyan-500 text-white py-3 rounded-lg hover:bg-cyan-600 transition-colors font-medium"
            >
              {isLogin ? 'Acceder' : 'Crear cuenta'}
            </button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900/50 text-gray-400">O continúa con</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="bg-gray-800 border border-gray-700 rounded-lg py-2 hover:bg-gray-700 transition-colors text-white">
                Google
              </button>
              <button className="bg-[#5865F2] rounded-lg py-2 hover:bg-[#4752C4] transition-colors text-white">
                Discord
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-gray-400">
            {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {isLogin ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </p>

          {isLogin && (
            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg text-sm text-gray-400">
              <p className="font-medium text-gray-300 mb-2">Usuarios demo:</p>
              <p>admin@bluelobsters.io / admin123</p>
              <p>user@test.com / user123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Dashboard
const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState({
    ideas: [
      { id: 1, title: 'Meditar 20 min diarios', description: 'Establecer rutina matutina', emoji: '🧘' },
      { id: 2, title: 'Leer a Rick Rubin', description: 'The Creative Act', emoji: '📚' }
    ],
    mutating: [
      { id: 3, title: 'Proyecto minimalista', description: 'Eliminar 3 apps del móvil', emoji: '📱' }
    ],
    evolved: [
      { id: 4, title: 'Journaling diario', description: 'Completado 30 días seguidos', emoji: '✍️' }
    ]
  });
  const [mood, setMood] = useState(50);
  const [newTask, setNewTask] = useState({ title: '', description: '', emoji: '🎯' });
  const [showNewTask, setShowNewTask] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [resonance, setResonance] = useState(65);

  const badges = [
    { icon: Trophy, name: 'Primera Mutación', unlocked: true },
    { icon: Star, name: 'Resonador Activo', unlocked: true },
    { icon: Diamond, name: 'Frecuencia Alta', unlocked: false },
    { icon: Crown, name: 'Maestro Mutante', unlocked: false }
  ];

  const stats = [
    { label: 'Días activo', value: 42, icon: Calendar, trend: '+5' },
    { label: 'Mutaciones', value: 17, icon: Zap, trend: '+3' },
    { label: 'Resonancia', value: `${resonance}%`, icon: Waves, trend: '+12%' },
    { label: 'Nivel', value: 7, icon: TrendingUp, trend: 'Subiendo' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setResonance(prev => {
        const change = Math.random() * 4 - 2;
        return Math.max(0, Math.min(100, prev + change));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDragStart = (e, task, column) => {
    setDraggedTask({ task, column });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetColumn) => {
    e.preventDefault();
    if (!draggedTask) return;

    const { task, column: sourceColumn } = draggedTask;
    if (sourceColumn === targetColumn) return;

    setTasks(prev => ({
      ...prev,
      [sourceColumn]: prev[sourceColumn].filter(t => t.id !== task.id),
      [targetColumn]: [...prev[targetColumn], task]
    }));
    setDraggedTask(null);
  };

  const addTask = () => {
    if (!newTask.title) return;
    
    const task = {
      id: Date.now(),
      ...newTask
    };
    
    setTasks(prev => ({
      ...prev,
      ideas: [...prev.ideas, task]
    }));
    
    setNewTask({ title: '', description: '', emoji: '🎯' });
    setShowNewTask(false);
  };

  const getMoodEmoji = () => {
    if (mood < 25) return '😔';
    if (mood < 50) return '😐';
    if (mood < 75) return '😊';
    return '🤩';
  };

  if (!user) {
    window.location.href = '/login';
    return null;
  }

  return (
    <div className="min-h-screen bg-[#001F3F] text-white">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-cyan-500 rounded-full animate-pulse" />
            <h1 className="text-xl font-bold">Laboratorio de Mutación</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold">{user.name[0].toUpperCase()}</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Progress Ring */}
        <div className="mb-8 text-center">
          <div className="inline-block relative">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-700"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - resonance / 100)}`}
                className="text-cyan-400 transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl font-bold">{resonance}%</p>
                <p className="text-sm text-gray-400">Resonancia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-5 h-5 text-cyan-400" />
                  <span className="text-xs text-green-400">{stat.trend}</span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-gray-400">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Mood Check-in */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">¿Cómo te sientes hoy?</h3>
          <div className="flex items-center space-x-4">
            <span className="text-3xl">{getMoodEmoji()}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <span className="text-sm text-gray-400">{mood}%</span>
          </div>
          <style jsx>{`
            .slider::-webkit-slider-thumb {
              appearance: none;
              width: 20px;
              height: 20px;
              background: #00CFFF;
              cursor: pointer;
              border-radius: 50%;
            }
            .slider::-moz-range-thumb {
              width: 20px;
              height: 20px;
              background: #00CFFF;
              cursor: pointer;
              border-radius: 50%;
              border: none;
            }
          `}</style>
        </div>

        {/* Kanban Board */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Tu Tablero de Mutación</h2>
            <button
              onClick={() => setShowNewTask(true)}
              className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Nueva Idea</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(tasks).map(([column, columnTasks]) => (
              <div
                key={column}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column)}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-lg p-4 min-h-[300px]"
              >
                <h3 className="font-bold mb-4 text-gray-300">
                  {column === 'ideas' ? 'Ideas' : column === 'mutating' ? 'En Mutación' : 'Evolucionado'}
                </h3>
                <div className="space-y-3">
                  {columnTasks.map(task => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task, column)}
                      className="bg-gray-900/50 border border-gray-600 rounded-lg p-3 cursor-move hover:border-cyan-500 transition-colors"
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{task.emoji}</span>
                        <div className="flex-1">
                          <h4 className="font-medium">{task.title}</h4>
                          <p className="text-sm text-gray-400">{task.description}</p>
                        </div>
                        <GripVertical className="w-4 h-4 text-gray-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4">Tus Logros</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <div
                  key={index}
                  className={`text-center p-4 rounded-lg border ${
                    badge.unlocked
                      ? 'bg-cyan-500/10 border-cyan-500/30'
                      : 'bg-gray-800/30 border-gray-700 opacity-50'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${
                    badge.unlocked ? 'text-cyan-400' : 'text-gray-600'
                  }`} />
                  <p className="text-sm">{badge.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Nueva Idea de Mutación</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  placeholder="¿Qué quieres mutar?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  rows="3"
                  placeholder="Describe tu idea..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Emoji
                </label>
                <div className="flex space-x-2">
                  {['🎯', '🧘', '📚', '💡', '🌱', '🚀', '✨', '🔥'].map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setNewTask({ ...newTask, emoji })}
                      className={`text-2xl p-2 rounded-lg border ${
                        newTask.emoji === emoji
                          ? 'border-cyan-500 bg-cyan-500/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={addTask}
                className="flex-1 bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Crear
              </button>
              <button
                onClick={() => setShowNewTask(false)}
                className="flex-1 bg-gray-800 text-gray-300 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main App Component
const App = () => {
  const [currentPage, setCurrentPage] = useState('landing');

  useEffect(() => {
    const handleRouting = () => {
      const path = window.location.pathname;
      if (path === '/login') setCurrentPage('auth');
      else if (path === '/dashboard') setCurrentPage('dashboard');
      else if (path === '/chat') setCurrentPage('chat');
      else setCurrentPage('landing');
    };

    handleRouting();
    window.addEventListener('popstate', handleRouting);
    return () => window.removeEventListener('popstate', handleRouting);
  }, []);

  const navigate = (page) => {
    setCurrentPage(page);
    const paths = {
      landing: '/',
      auth: '/login',
      dashboard: '/dashboard',
      chat: '/chat'
    };
    window.history.pushState({}, '', paths[page]);
  };

  return (
    <AuthProvider>
      <CursorHalo />
      <ChatBot />
      
      {currentPage === 'landing' && <LandingPage />}
      {currentPage === 'auth' && <AuthPage />}
      {currentPage === 'dashboard' && <Dashboard />}
      {currentPage === 'chat' && (
        <div className="min-h-screen bg-[#001F3F] flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Chat con Blue Lobster GPT</h1>
            <p className="text-gray-400 mb-8">Usa el botón de chat en la esquina inferior derecha</p>
            <button
              onClick={() => navigate('landing')}
              className="bg-cyan-500 px-6 py-3 rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      )}
    </AuthProvider>
  );
};

export default App;
