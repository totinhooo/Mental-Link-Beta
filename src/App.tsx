import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Alert, AlertDescription } from './components/ui/alert';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet';
import { MoodSelector } from './components/MoodSelector';
import { EmotionalDashboard } from './components/EmotionalDashboard';
import { SupportChatbot } from './components/SupportChatbot';
import { WellnessExercises } from './components/WellnessExercises';
import { TrustedAdultConnection } from './components/TrustedAdultConnection';
import { Settings } from './components/Settings';
import { QuickMoodInput } from './components/QuickMoodInput';
import { DailyDiagnosis } from './components/DailyDiagnosis';
import { EmotionalCalendar } from './components/EmotionalCalendar';
import { TeamContact } from './components/TeamContact';
import { OnboardingModal } from './components/OnboardingModal';
import { Toaster } from './components/ui/sonner';
import { Home, BarChart3, MessageCircle, Heart, Users, Settings as SettingsIcon, ArrowRight, UserCheck, Eye, AlertCircle, CheckCircle, Phone, Info, Headphones, BookOpen, Menu, Calendar, ClipboardList, Mail } from 'lucide-react';
import { t } from './i18n';
import mentalLinkLogo from 'figma:asset/eafbf3cbd73202cb4317c654f8816344093bb9f7.png';
import mentalLinkDarkLogo from 'figma:asset/d9f3413577834151f481b2330404507b220e52d6.png';
import instagramIcon from 'figma:asset/2dbc6e4b8804b5a91432dbdc31008769164c72a3.png';
import instagramIconDark from 'figma:asset/2f24f54a2d5cf83a8750b8e1e9d21cc57b297441.png';

interface MoodOption {
  emoji: string;
  label: string;
  color: string;
  message: string;
  supportMessage: string;
  showChatInvite: boolean;
}

interface UserData {
  firstName: string;
  lastName: string;
  birthDate: string;
  email: string;
  emergencyContactRelation: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

export default function App() {
  const [currentMood, setCurrentMood] = useState<MoodOption | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isInApp, setIsInApp] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    emergencyContactRelation: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  });
  const [registrationErrors, setRegistrationErrors] = useState<string[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Verificar si es la primera vez que entra después de registrarse
  useEffect(() => {
    if (isInApp) {
      const onboardingCompleted = localStorage.getItem('mental-link-onboarding-completed');
      if (!onboardingCompleted) {
        setShowOnboarding(true);
      }
    }
  }, [isInApp]);

  // Cargar tema guardado o detectar preferencia del sistema
  useEffect(() => {
    const savedTheme = localStorage.getItem('mental-link-theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Aplicar tema al documento
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('mental-link-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleMoodSelect = (mood: MoodOption) => {
    setCurrentMood(mood);
  };

  const handleChatNavigate = () => {
    setActiveTab('chat');
  };

  const handleThemeToggle = (isDark: boolean) => {
    setIsDarkMode(isDark);
  };

  const handleEnterApp = () => {
    setIsInApp(true);
  };

  const handleBackToLanding = () => {
    setIsInApp(false);
    setIsRegistering(false);
    setActiveTab('home');
  };

  const handleStartRegistration = () => {
    setIsRegistering(true);
  };

  const handleExploreAsGuest = () => {
    setIsInApp(true);
  };

  const validateRegistration = (): string[] => {
    const errors: string[] = [];
    
    if (!userData.firstName.trim()) errors.push('El nombre es obligatorio');
    if (!userData.lastName.trim()) errors.push('El apellido es obligatorio');
    
    if (!userData.birthDate) {
      errors.push('La fecha de nacimiento es obligatoria');
    } else {
      const birthDate = new Date(userData.birthDate);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        // aún no ha cumplido años este año
      }
      
      if (age < 12) {
        errors.push('Debes tener al menos 12 años para usar Mental Link');
      }
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email.trim()) {
      errors.push('El correo electrónico es obligatorio');
    } else if (!emailRegex.test(userData.email)) {
      errors.push('El correo electrónico no es válido');
    }
    
    if (!userData.emergencyContactRelation.trim()) {
      errors.push('La relación con el contacto de emergencia es obligatoria');
    }
    if (!userData.emergencyContactName.trim()) {
      errors.push('El nombre del contacto de emergencia es obligatorio');
    }
    if (!userData.emergencyContactPhone.trim()) {
      errors.push('El teléfono del contacto de emergencia es obligatorio');
    } else if (userData.emergencyContactPhone.length < 10) {
      errors.push('El teléfono debe tener al menos 10 dígitos');
    }
    
    return errors;
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateRegistration();
    
    if (errors.length > 0) {
      setRegistrationErrors(errors);
      return;
    }
    
    setRegistrationErrors([]);
    setIsRegistered(true);
    
    // Simular guardado de datos
    localStorage.setItem('mental-link-user', JSON.stringify(userData));
    
    // Después de 2 segundos, ir a la app
    setTimeout(() => {
      setIsInApp(true);
      setIsRegistering(false);
    }, 2000);
  };

  const handleInputChange = (field: keyof UserData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
    // Limpiar errores cuando el usuario empiece a escribir
    setRegistrationErrors([]);
  };



  // Si estamos en el proceso de registro, mostrar formulario
  if (isRegistering && !isInApp) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20' 
          : 'bg-gradient-to-br from-purple-50 via-blue-50 to-green-50'
      }`}>
        {/* Header Registration */}
        <div className={`backdrop-blur-sm border-b transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-900/80 border-gray-700' 
            : 'bg-white/80 border-purple-100'
        }`}>
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between mb-2">
              <Button
                onClick={() => setIsRegistering(false)}
                variant="ghost"
                size="sm"
                className={`text-xs transition-colors duration-300 ${
                  isDarkMode ? 'text-[#B0E0E6] hover:text-[#9dd5de]' : 'text-[#5fa3b0] hover:text-[#4d8a97]'
                }`}
              >
                {t('nav.backToHome')}
              </Button>
              <a 
                href="https://www.instagram.com/mentallink._?igsh=MTV5eGY2ZGNiaTJxeg%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity duration-300 hover:opacity-80"
              >
                <img 
                  src={isDarkMode ? instagramIconDark : instagramIcon} 
                  alt="Instagram" 
                  className="h-8 w-8 object-contain"
                />
              </a>
            </div>
            
            <div className="text-center">
              <img 
                src={mentalLinkDarkLogo} 
                alt="Mental Link Logo" 
                className="h-40 w-40 mx-auto mb-3"
              />
              <h1 className={`text-lg transition-colors duration-300 ${
                isDarkMode ? 'text-[#B0E0E6]' : 'text-[#40747a]'
              }`} style={!isDarkMode ? { color: '#40747a' } : {}}>
                {isRegistered ? '¡Bienvenido a Mental Link!' : 'Crear cuenta'}
              </h1>
            </div>
          </div>
        </div>

        {/* Registration Content */}
        <div className="max-w-md mx-auto px-4 py-6">
          {isRegistered ? (
            <Card className={`p-6 text-center transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-700' 
                : 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200'
            }`}>
              <CheckCircle className={`w-16 h-16 mx-auto mb-4 transition-colors duration-300 ${
                isDarkMode ? 'text-green-400' : 'text-green-600'
              }`} />
              <h2 className={`text-lg mb-2 transition-colors duration-300 ${
                isDarkMode ? 'text-green-300' : 'text-green-700'
              }`}>
                ¡Registro exitoso!
              </h2>
              <p className={`text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-green-200' : 'text-green-600'
              }`}>
                Hola {userData.firstName}, tu cuenta ha sido creada. Redirigiendo a la aplicación...
              </p>
            </Card>
          ) : (
            <form onSubmit={handleRegistrationSubmit} className="space-y-6">
              <Card className={`p-6 transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-900/50 border-gray-700' 
                  : 'bg-white/80 border-purple-200'
              }`}>
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <p className={`text-sm transition-colors duration-300 ${
                      isDarkMode ? 'text-[#B0E0E6]' : 'text-[#40747a]'
                    }`} style={!isDarkMode ? { color: '#40747a' } : {}}>
                      Para brindarte la mejor experiencia personalizada, necesitamos algunos datos básicos
                    </p>
                  </div>

                  {/* Errores de validación */}
                  {registrationErrors.length > 0 && (
                    <Alert className={`transition-colors duration-300 ${
                      isDarkMode ? 'border-red-700 bg-red-900/20' : 'border-red-200 bg-red-50'
                    }`}>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <ul className="list-disc list-inside text-sm space-y-1">
                          {registrationErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Nombre y Apellido */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className={`transition-colors duration-300 ${
                        isDarkMode ? 'text-[#B0E0E6]' : 'text-[#40747a]'
                      }`} style={!isDarkMode ? { color: '#40747a' } : {}}>
                        Nombre *
                      </Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={userData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Tu nombre"
                        className={`transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800/50 border-gray-600 text-purple-200 placeholder:text-gray-400' 
                            : 'bg-white border-purple-200 text-purple-800 placeholder:text-gray-500'
                        }`}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className={`transition-colors duration-300 ${
                        isDarkMode ? 'text-[#B0E0E6]' : 'text-[#40747a]'
                      }`} style={!isDarkMode ? { color: '#40747a' } : {}}>
                        Apellido *
                      </Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={userData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Tu apellido"
                        className={`transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800/50 border-gray-600 text-purple-200 placeholder:text-gray-400' 
                            : 'bg-white border-purple-200 text-purple-800 placeholder:text-gray-500'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Fecha de nacimiento */}
                  <div className="space-y-2">
                    <Label htmlFor="birthDate" className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-[#B0E0E6]' : 'text-[#40747a]'
                    }`} style={!isDarkMode ? { color: '#40747a' } : {}}>
                      Fecha de nacimiento *
                    </Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={userData.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      className={`transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-800/50 border-gray-600 text-purple-200 placeholder:text-gray-400' 
                          : 'bg-white border-purple-200 text-purple-800 placeholder:text-gray-500'
                      }`}
                    />
                    <p className={`text-xs transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Mental Link está abierto para jóvenes a partir de los 12 años
                    </p>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-[#B0E0E6]' : 'text-[#40747a]'
                    }`} style={!isDarkMode ? { color: '#40747a' } : {}}>
                      Correo electrónico *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="tu.email@ejemplo.com"
                      className={`transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-800/50 border-gray-600 text-purple-200 placeholder:text-gray-400' 
                          : 'bg-white border-purple-200 text-purple-800 placeholder:text-gray-500'
                      }`}
                    />
                  </div>

                  {/* Contacto de emergencia */}
                  <div className="space-y-4">
                    <Label className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-[#B0E0E6]' : 'text-[#40747a]'
                    }`} style={!isDarkMode ? { color: '#40747a' } : {}}>
                      Contacto de ayuda ante cualquier indicio *
                    </Label>
                    
                    {/* Relación */}
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactRelation" className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-[#B0E0E6]' : 'text-[#40747a]'
                      }`} style={!isDarkMode ? { color: '#40747a' } : {}}>
                        Relación *
                      </Label>
                      <Input
                        id="emergencyContactRelation"
                        type="text"
                        value={userData.emergencyContactRelation}
                        onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)}
                        placeholder="Ej: Madre, Padre, Hermano/a, Tío/a, Abuelo/a"
                        className={`transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800/50 border-gray-600 text-purple-200 placeholder:text-gray-400' 
                            : 'bg-white border-purple-200 text-purple-800 placeholder:text-gray-500'
                        }`}
                      />
                    </div>

                    {/* Nombre */}
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactName" className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-[#B0E0E6]' : 'text-[#40747a]'
                      }`} style={!isDarkMode ? { color: '#40747a' } : {}}>
                        Nombre completo *
                      </Label>
                      <Input
                        id="emergencyContactName"
                        type="text"
                        value={userData.emergencyContactName}
                        onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                        placeholder="Ej: María García"
                        className={`transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800/50 border-gray-600 text-purple-200 placeholder:text-gray-400' 
                            : 'bg-white border-purple-200 text-purple-800 placeholder:text-gray-500'
                        }`}
                      />
                    </div>

                    {/* Teléfono */}
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContactPhone" className={`text-sm transition-colors duration-300 ${
                        isDarkMode ? 'text-[#B0E0E6]' : 'text-[#40747a]'
                      }`} style={!isDarkMode ? { color: '#40747a' } : {}}>
                        Número de teléfono *
                      </Label>
                      <Input
                        id="emergencyContactPhone"
                        type="tel"
                        value={userData.emergencyContactPhone}
                        onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                        placeholder="Ej: 2974123456"
                        className={`transition-colors duration-300 ${
                          isDarkMode 
                            ? 'bg-gray-800/50 border-gray-600 text-purple-200 placeholder:text-gray-400' 
                            : 'bg-white border-purple-200 text-purple-800 placeholder:text-gray-500'
                        }`}
                      />
                    </div>
                    
                    <p className={`text-xs transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Esta persona será contactada solo en situaciones que requieran intervención de apoyo
                    </p>
                  </div>

                  {/* Información de privacidad */}
                  <div className={`p-3 rounded-lg text-xs transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-blue-900/20 border border-blue-700/50 text-blue-200' 
                      : 'bg-blue-50 border border-blue-200 text-blue-700'
                  }`}>
                    <p>
                      🔒 <strong>Tu privacidad es importante:</strong> Esta información se utiliza únicamente para personalizar tu experiencia y garantizar tu seguridad. El contacto de emergencia solo será utilizado en situaciones que requieran intervención de apoyo.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Botón de registro */}
              <Button 
                type="submit"
                className={`w-full h-12 text-white space-x-2 ${
                  isDarkMode 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'bg-[#5fa3b0] hover:bg-[#4d8a97]'
                }`}
              >
                <UserCheck className="w-5 h-5" />
                <span>Crear mi cuenta</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Si no estamos en la app, mostrar landing page
  if (!isInApp) {
    return (
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20' 
          : 'bg-gradient-to-br from-purple-50 via-blue-50 to-green-50'
      }`}>
        {/* Header Landing */}
        <div className={`backdrop-blur-sm border-b transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-900/80 border-gray-700' 
            : 'bg-white/80 border-purple-100'
        }`}>
          <div className="max-w-md mx-auto px-4 py-6">
            {/* Instagram link - Top right */}
            <div className="flex justify-end mb-4">
              <a 
                href="https://www.instagram.com/mentallink._?igsh=MTV5eGY2ZGNiaTJxeg%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity duration-300 hover:opacity-80"
              >
                <img 
                  src={isDarkMode ? instagramIconDark : instagramIcon} 
                  alt="Instagram" 
                  className="h-8 w-8 object-contain"
                />
              </a>
            </div>
            
            {/* Logo y título centrados */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <img 
                  src={mentalLinkDarkLogo} 
                  alt="Mental Link Logo" 
                  className="h-50 w-50"
                />
              </div>
              
              {/* Eslogan */}
              <div>
                <h1 className={`text-2xl leading-tight mb-2 transition-colors duration-300 ${
                  isDarkMode ? 'text-[#B0E0E6]' : 'text-[#40747a]'
                }`} style={!isDarkMode ? { color: '#40747a' } : {}}>
                  Conecta con tus emociones,<br />
                  <span className="font-medium">crece con confianza</span>
                </h1>
                
                {/* Breve explicación */}
                <p className={`text-base leading-relaxed transition-colors duration-300 ${
                  isDarkMode ? 'text-[#B0E0E6]' : 'text-[#40747a]'
                }`} style={!isDarkMode ? { color: '#40747a' } : {}}>
                  Mental Link te acompaña en tu bienestar emocional, ayudándote a reconocer cómo te sentís y encontrar equilibrio en tu día a día.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal de landing */}
        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          {/* Ilustración amigable */}
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/30' 
                : 'bg-gradient-to-br from-purple-100 to-blue-100 border border-purple-200'
            }`}>
              <span className="text-4xl">🤗</span>
            </div>
          </div>

          {/* Breve descripción */}
          <Card className={`p-6 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-700' 
              : 'bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200'
          }`}>
            <div className="text-center space-y-4">
              <h3 className={`text-lg transition-colors duration-300 ${
                isDarkMode ? 'text-[#B0E0E6]' : 'text-[#40747a]'
              }`} style={!isDarkMode ? { color: '#40747a' } : {}}>
                Tu bienestar emocional es nuestra prioridad
              </h3>
              <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                isDarkMode ? 'text-[#B0E0E6]' : 'text-[#40747a]'
              }`} style={!isDarkMode ? { color: '#40747a' } : {}}>
                Un espacio seguro donde podés expresarte libremente, descubrir recursos para cuidar tu salud mental y recibir orientación cuando más lo necesites.
              </p>
              <div className={`flex items-center justify-center space-x-6 text-sm transition-colors duration-300 ${
                isDarkMode ? 'text-[#B0E0E6]' : 'text-[#40747a]'
              }`} style={!isDarkMode ? { color: '#40747a' } : {}}>
                <div className="text-center">
                  <span className="block text-2xl mb-1">💙</span>
                  <span>Empatía</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl mb-1">🌱</span>
                  <span>Crecimiento</span>
                </div>
                <div className="text-center">
                  <span className="block text-2xl mb-1">🤝</span>
                  <span>Apoyo</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Botones principales */}
          <div className="space-y-4 pt-4">
            <Button 
              onClick={handleStartRegistration}
              className={`w-full h-12 text-white space-x-2 ${
                isDarkMode 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'bg-[#5fa3b0] hover:bg-[#4d8a97]'
              }`}
            >
              <UserCheck className="w-5 h-5" />
              <span>Ingresar / Registrarse</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            
            <Button 
              onClick={handleExploreAsGuest}
              variant="outline"
              className={`w-full h-12 space-x-2 ${
                isDarkMode 
                  ? 'border-purple-600 text-purple-300 hover:bg-purple-900/30' 
                  : 'border-[#5fa3b0] text-[#40747a] hover:bg-[#e6f7f9]'
              }`}
            >
              <Eye className="w-5 h-5" />
              <span>Explorar como invitado</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Si estamos en la app, mostrar la interfaz normal
  const getCurrentUserData = () => {
    try {
      const savedUserData = localStorage.getItem('mental-link-user');
      return savedUserData ? JSON.parse(savedUserData) : null;
    } catch {
      return null;
    }
  };

  const currentUser = getCurrentUserData();

  return (
    <>
      {/* Modal de Onboarding */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)}
        userName={currentUser?.firstName}
      />

      <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-purple-900/20 to-blue-900/20' : 'bg-gradient-to-br from-purple-50 via-blue-50 to-green-50'}`}>
      <div className={`backdrop-blur-sm border-b sticky top-0 z-10 transition-colors duration-300 ${isDarkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-purple-100'}`}>
        <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex justify-between items-center mb-2">
            <Button onClick={handleBackToLanding} variant="ghost" size="sm" className={`text-xs ${isDarkMode ? 'text-[#B0E0E6] hover:text-[#9dd5de]' : 'text-[#5fa3b0] hover:text-[#4d8a97]'}`}>{t('nav.backToHome')}</Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0"><img src={mentalLinkDarkLogo} alt="Mental Link Logo" className="h-28 w-28" /></div>
            <div className="flex-1 text-center px-4">
              <h1 className={`text-sm leading-tight ${isDarkMode ? 'text-[#B0E0E6]' : 'text-[#40747a]'}`}>Conecta con tus emociones,<br /><span className="font-medium">crece con confianza</span></h1>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-[#B0E0E6]/70' : 'text-[#5fa3b0]/70'}`}>v1.0.0 BETA</p>
            </div>
            <div className="flex-shrink-0">
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className={isDarkMode ? 'text-[#B0E0E6] hover:text-[#9dd5de]' : 'text-[#5fa3b0] hover:text-[#4d8a97]'}><Menu className="w-5 h-5" /></Button>
                </SheetTrigger>
                <SheetContent side="right" className={`w-80 ${isDarkMode ? 'bg-gray-900/95 border-gray-700' : 'bg-white/95 border-purple-100'}`}>
                  <SheetHeader>
                    <SheetTitle className={isDarkMode ? 'text-[#B0E0E6]' : 'text-[#40747a]'}>{t('menu.home')}</SheetTitle>
                    <SheetDescription className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{t('menu.dashboard')}</SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-2">
                    <Button variant="ghost" className={`w-full justify-start ${activeTab === 'home' ? (isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700') : (isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100')}`} onClick={() => { setActiveTab('home'); setIsMenuOpen(false); }}><Home className="w-5 h-5 mr-3" />{t('menu.home')}</Button>
                    <Button variant="ghost" className={`w-full justify-start ${activeTab === 'dashboard' ? (isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700') : (isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100')}`} onClick={() => { setActiveTab('dashboard'); setIsMenuOpen(false); }}><BarChart3 className="w-5 h-5 mr-3" />Dashboard</Button>
                    <Button variant="ghost" className={`w-full justify-start ${activeTab === 'chat' ? (isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700') : (isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100')}`} onClick={() => { setActiveTab('chat'); setIsMenuOpen(false); }}><MessageCircle className="w-5 h-5 mr-3" />{t('menu.chat')}</Button>
                    <Button variant="ghost" className={`w-full justify-start ${activeTab === 'wellness' ? (isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700') : (isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100')}`} onClick={() => { setActiveTab('wellness'); setIsMenuOpen(false); }}><Heart className="w-5 h-5 mr-3" />{t('menu.wellness')}</Button>
                    <Button variant="ghost" className={`w-full justify-start ${activeTab === 'adults' ? (isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700') : (isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100')}`} onClick={() => { setActiveTab('adults'); setIsMenuOpen(false); }}><Users className="w-5 h-5 mr-3" />{t('menu.adults')}</Button>
                    <Button variant="ghost" className={`w-full justify-start ${activeTab === 'calendar' ? (isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700') : (isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100')}`} onClick={() => { setActiveTab('calendar'); setIsMenuOpen(false); }}><Calendar className="w-5 h-5 mr-3" />{t('menu.calendar')}</Button>
                    <Button variant="ghost" className={`w-full justify-start ${activeTab === 'diagnosis' ? (isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700') : (isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100')}`} onClick={() => { setActiveTab('diagnosis'); setIsMenuOpen(false); }}><ClipboardList className="w-5 h-5 mr-3" />{t('menu.diagnosis')}</Button>
                    <Button variant="ghost" className={`w-full justify-start ${activeTab === 'team' ? (isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700') : (isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100')}`} onClick={() => { setActiveTab('team'); setIsMenuOpen(false); }}><Mail className="w-5 h-5 mr-3" />{t('menu.team')}</Button>
                    <Button variant="ghost" className={`w-full justify-start ${activeTab === 'settings' ? (isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-100 text-purple-700') : (isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-100')}`} onClick={() => { setActiveTab('settings'); setIsMenuOpen(false); }}><SettingsIcon className="w-5 h-5 mr-3" />{t('menu.settings')}</Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Disclaimer BETA */}
        <Alert className="mb-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-700">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="text-amber-800 dark:text-amber-200 text-sm">
            <strong>Versión BETA:</strong> Las notificaciones a adultos de confianza son simuladas. Esta app complementa, no reemplaza, la ayuda profesional.
          </AlertDescription>
        </Alert>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="home" className="mt-0">
            <QuickMoodInput onMoodSelect={handleMoodSelect} onChatNavigate={handleChatNavigate} isDarkMode={isDarkMode} />
            {currentMood && (
              <div className="mt-6">
                <Card className="p-5 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 border-purple-200 dark:border-purple-700">
                  <div className="text-center space-y-3">
                    <div className="flex items-center justify-center space-x-2">
                      <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <span className="text-purple-800 dark:text-purple-200">Mensaje para vos</span>
                      <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-purple-800 dark:text-purple-200 leading-relaxed">
                      {currentMood.message}
                    </p>
                  </div>
                </Card>

                <Card className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
                  <div className="space-y-3">
                    <p className="text-blue-800 dark:text-blue-200 text-center">
                      {currentMood.supportMessage}
                    </p>
                    
                    {currentMood.showChatInvite && (
                      <Button 
                        onClick={handleChatNavigate}
                        className="w-full bg-blue-600 hover:bg-blue-700 space-x-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Hablar con Luna ahora</span>
                      </Button>
                    )}
                    
                    {!currentMood.showChatInvite && (
                      <div className="text-center">
                        <Button 
                          onClick={handleChatNavigate}
                          variant="outline"
                          className="space-x-2 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/20"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Charlá con Luna</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>
          <TabsContent value="dashboard" className="mt-0"><EmotionalDashboard isDarkMode={isDarkMode} /></TabsContent>
          <TabsContent value="chat" className="mt-0"><SupportChatbot isDarkMode={isDarkMode} /></TabsContent>
          <TabsContent value="wellness" className="mt-0"><WellnessExercises isDarkMode={isDarkMode} /></TabsContent>
          <TabsContent value="adults" className="mt-0"><TrustedAdultConnection isDarkMode={isDarkMode} /></TabsContent>
          <TabsContent value="calendar" className="mt-0"><EmotionalCalendar isDarkMode={isDarkMode} /></TabsContent>
          <TabsContent value="diagnosis" className="mt-0"><DailyDiagnosis isDarkMode={isDarkMode} /></TabsContent>
          <TabsContent value="team" className="mt-0"><TeamContact isDarkMode={isDarkMode} /></TabsContent>
          <TabsContent value="settings" className="mt-0"><Settings onThemeToggle={handleThemeToggle} isDarkMode={isDarkMode} /></TabsContent>
        </Tabs>
      </div>
    </div>
    
    {/* Toaster para notificaciones */}
    <Toaster position="top-center" />
    </>
  );
}
