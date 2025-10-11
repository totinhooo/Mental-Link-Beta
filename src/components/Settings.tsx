import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import instagramIcon from 'figma:asset/2dbc6e4b8804b5a91432dbdc31008769164c72a3.png';
import instagramIconDark from 'figma:asset/2f24f54a2d5cf83a8750b8e1e9d21cc57b297441.png';
import mentalLinkPng from 'figma:asset/7f894c8252ee503e03eae1186a98ae9ff28e8d17.png';
import mentalLinkDarkPng from 'figma:asset/d9f3413577834151f481b2330404507b220e52d6.png';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { toast } from 'sonner';
import { 
  Moon, 
  Sun, 
  Globe, 
  LogOut, 
  User, 
  Shield, 
  Bell, 
  HelpCircle,
  ChevronRight,
  Trash2,
  Download,
  Upload,
  Palette,
  Smartphone,
  Info,
  Heart,
  Users,
  BookOpen
} from 'lucide-react';

interface SettingsProps {
  isDarkMode: boolean;
  onThemeToggle: (isDark: boolean) => void;
  onLogout?: () => void;
}

export function Settings({ isDarkMode, onThemeToggle, onLogout }: SettingsProps) {
  const [language, setLanguage] = useState('es');
  const [notifications, setNotifications] = useState(true);
  const [autoTheme, setAutoTheme] = useState(false);
  const [dataBackup, setDataBackup] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Obtener información del usuario
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('mental-link-user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  };

  const handleLogout = () => {
    // Limpiar datos del usuario
    localStorage.removeItem('mental-link-user');
    localStorage.removeItem('mental-link-daily-diagnosis');
    localStorage.removeItem('mental-link-theme');
    
    setShowLogoutConfirm(true);
    
    setTimeout(() => {
      setShowLogoutConfirm(false);
      if (onLogout) {
        onLogout();
      } else {
        // Recargar página para volver al estado inicial
        window.location.reload();
      }
    }, 2000);
  };

  const handleDataExport = async () => {
    toast.loading('Generando PDF...', { id: 'export' });
    try {
      const { jsPDF } = await import('jspdf');
      
      const userData = localStorage.getItem('mental-link-user');
      const diagnosisData = localStorage.getItem('mental-link-daily-diagnosis');
      
      const user = userData ? JSON.parse(userData) : null;
      const diagnosis = diagnosisData ? JSON.parse(diagnosisData) : [];
      
      // Crear nuevo PDF
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      let yPosition = 20;
      
      // Función para agregar nueva página si es necesario
      const checkPageBreak = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
          return true;
        }
        return false;
      };
      
      // Header del documento
      doc.setFontSize(20);
      doc.setTextColor(138, 43, 226); // Purple
      doc.text('Mental Link', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 8;
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text('Calendario Emocional y Notas', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;
      
      // Información del usuario
      if (user) {
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(`Usuario: ${user.firstName} ${user.lastName}`, 20, yPosition);
        yPosition += 5;
      }
      
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text(`Fecha de exportación: ${new Date().toLocaleDateString('es-AR', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      })}`, 20, yPosition);
      yPosition += 12;
      
      // Línea separadora
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPosition, pageWidth - 20, yPosition);
      yPosition += 10;
      
      if (diagnosis.length === 0) {
        doc.setFontSize(11);
        doc.setTextColor(100, 100, 100);
        doc.text('No hay registros emocionales para exportar.', 20, yPosition);
      } else {
        // Ordenar diagnósticos por fecha
        const sortedDiagnosis = [...diagnosis].sort((a, b) => {
          const dateA = a.date || a.timestamp?.split('T')[0] || '';
          const dateB = b.date || b.timestamp?.split('T')[0] || '';
          return dateB.localeCompare(dateA); // Más recientes primero
        });
        
        // Función para obtener emoji del mood
        const getMoodEmoji = (mood: number) => {
          if (mood <= 2) return 'Muy triste';
          if (mood <= 4) return 'Triste';
          if (mood <= 6) return 'Neutral';
          if (mood <= 8) return 'Feliz';
          return 'Muy feliz';
        };
        
        // Resumen general
        doc.setFontSize(14);
        doc.setTextColor(138, 43, 226);
        doc.text('Resumen General', 20, yPosition);
        yPosition += 8;
        
        const totals = sortedDiagnosis.reduce((acc, entry) => {
          const mood = entry.mood || 5;
          const energy = entry.energy || 5;
          const stress = entry.stress || 5;
          return {
            mood: acc.mood + mood,
            energy: acc.energy + energy,
            stress: acc.stress + stress
          };
        }, { mood: 0, energy: 0, stress: 0 });
        
        const avgMood = Math.round(totals.mood / sortedDiagnosis.length);
        const avgEnergy = Math.round(totals.energy / sortedDiagnosis.length);
        const avgStress = Math.round(totals.stress / sortedDiagnosis.length);
        
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.text(`Total de registros: ${sortedDiagnosis.length}`, 20, yPosition);
        yPosition += 6;
        doc.text(`Estado de ánimo promedio: ${avgMood}/10 (${getMoodEmoji(avgMood)})`, 20, yPosition);
        yPosition += 6;
        doc.text(`Energía promedio: ${avgEnergy}/10`, 20, yPosition);
        yPosition += 6;
        doc.text(`Estrés promedio: ${avgStress}/10`, 20, yPosition);
        yPosition += 12;
        
        // Línea separadora
        doc.setDrawColor(200, 200, 200);
        doc.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 10;
        
        // Registros diarios
        doc.setFontSize(14);
        doc.setTextColor(138, 43, 226);
        doc.text('Registros Diarios', 20, yPosition);
        yPosition += 10;
        
        sortedDiagnosis.forEach((entry, index) => {
          const date = entry.date || entry.timestamp?.split('T')[0] || 'Fecha desconocida';
          const mood = entry.mood || 5;
          const energy = entry.energy || 5;
          const stress = entry.stress || 5;
          const notes = entry.notes || '';
          
          // Calcular espacio necesario
          const notesLines = notes ? Math.ceil(notes.length / 80) : 0;
          const requiredSpace = 35 + (notesLines * 5);
          
          checkPageBreak(requiredSpace);
          
          // Fecha
          doc.setFontSize(11);
          doc.setTextColor(60, 60, 180);
          const formattedDate = new Date(date + 'T12:00:00').toLocaleDateString('es-AR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          });
          doc.text(formattedDate, 20, yPosition);
          yPosition += 7;
          
          // Métricas
          doc.setFontSize(9);
          doc.setTextColor(80, 80, 80);
          doc.text(`Estado de ánimo: ${mood}/10 (${getMoodEmoji(mood)})`, 25, yPosition);
          yPosition += 5;
          doc.text(`Energía: ${energy}/10`, 25, yPosition);
          yPosition += 5;
          doc.text(`Estrés: ${stress}/10`, 25, yPosition);
          yPosition += 7;
          
          // Notas
          if (notes) {
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            doc.text('Notas:', 25, yPosition);
            yPosition += 5;
            
            doc.setFontSize(8);
            doc.setTextColor(80, 80, 80);
            const splitNotes = doc.splitTextToSize(notes, pageWidth - 50);
            doc.text(splitNotes, 25, yPosition);
            yPosition += splitNotes.length * 4;
          }
          
          yPosition += 8;
          
          // Línea separadora entre registros
          if (index < sortedDiagnosis.length - 1) {
            doc.setDrawColor(220, 220, 220);
            doc.line(25, yPosition, pageWidth - 25, yPosition);
            yPosition += 8;
          }
        });
      }
      
      // Footer en todas las páginas
      const totalPages = doc.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Mental Link - Página ${i} de ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
      
      // Guardar PDF
      const fileName = `Mental-Link-Calendario-${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
      toast.success('¡Datos exportados exitosamente!', { id: 'export', duration: 3000 });
      
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Error al exportar datos. Inténtalo de nuevo.', { id: 'export', duration: 3000 });
      alert('Error al exportar los datos. Por favor, intentá nuevamente.');
    }
  };

  const userData = getUserData();

  if (showLogoutConfirm) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl text-purple-700 dark:text-purple-300 mb-2">Cerrando sesión</h2>
        </div>
        
        <Card className="p-6 bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700">
          <div className="text-center space-y-4">
            <div className="text-4xl">👋</div>
            <h3 className="text-purple-800 dark:text-purple-200">¡Hasta pronto!</h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Esperamos verte de nuevo pronto. Cuidate mucho.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl text-purple-700 dark:text-purple-300 mb-2">Configuración</h2>
  <p className="text-gray-600 dark:text-gray-400">Personaliza tu experiencia</p>
      </div>

      {/* Perfil del usuario */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800/30 dark:to-slate-700/30 border-purple-200 dark:border-slate-600">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-purple-600 dark:text-slate-300" />
            </div>
            <div className="flex-1">
              <h3 className="text-purple-800 dark:text-slate-200">
                {userData ? `${userData.firstName} ${userData.lastName}` : 'Usuario Invitado'}
              </h3>
              <p className="text-sm text-purple-600 dark:text-slate-400">
                {userData ? `${userData.age} años` : 'Modo invitado activo'}
              </p>
            </div>
          </div>
          
          {userData && (
            <div className="pt-2 border-t border-purple-200 dark:border-slate-600">
              <p className="text-xs text-purple-600 dark:text-slate-400">
                📧 {userData.email}
              </p>
              <p className="text-xs text-purple-600 dark:text-slate-400">
                🆘 Contacto de emergencia configurado
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Apariencia */}
      <Card className="p-4 dark:bg-slate-800/30 dark:border-slate-600">
        <h3 className="mb-4 flex items-center space-x-2 dark:text-white">
          <Palette className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Apariencia</span>
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="dark:text-white">Tema automático</span>
            </div>
            <Switch 
              checked={autoTheme}
              onCheckedChange={(checked) => {
                setAutoTheme(checked);
                toast.success(checked ? 'Tema automático activado' : 'Tema manual seleccionado', { duration: 2000 });
              }}
            />
          </div>
          
          {!autoTheme && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isDarkMode ? (
                  <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
                <span className="dark:text-white">Modo oscuro</span>
              </div>
              <Switch 
                checked={isDarkMode}
                onCheckedChange={(checked) => {
                  onThemeToggle(checked);
                  toast.success(checked ? 'Modo oscuro activado' : 'Modo claro activado', { duration: 2000 });
                }}
              />
            </div>
          )}
          
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-slate-700/20 border border-blue-200 dark:border-slate-600">
            <p className="text-sm text-blue-700 dark:text-slate-300">
              {autoTheme 
                ? "🌓 El tema cambia automáticamente según la hora del día"
                : isDarkMode 
                  ? "🌙 Tema oscuro activado - ideal para usar de noche y reducir fatiga visual" 
                  : "☀️ Tema claro activado - perfecto para el día y mayor contraste"
              }
            </p>
          </div>
        </div>
      </Card>

      {/* Idioma y región */}
      <Card className="p-4 dark:bg-slate-800/30 dark:border-slate-600">
        <h3 className="mb-4 flex items-center space-x-2 dark:text-white">
          <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
          <span>Idioma y región</span>
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">
              Idioma de la aplicación
            </label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">🇦🇷 Español (Argentina)</SelectItem>
                <SelectItem value="es-mx">🇲🇽 Español (México)</SelectItem>
                <SelectItem value="es-co">🇨🇴 Español (Colombia)</SelectItem>
                <SelectItem value="en">🇺🇸 English (US)</SelectItem>
                <SelectItem value="en-uk">🇬🇧 English (UK)</SelectItem>
                <SelectItem value="pt">🇧🇷 Português (Brasil)</SelectItem>
                <SelectItem value="fr">🇫🇷 Français</SelectItem>
                <SelectItem value="it">🇮🇹 Italiano</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="p-3 rounded-lg bg-green-50 dark:bg-slate-700/20 border border-green-200 dark:border-slate-600">
            <p className="text-sm text-green-700 dark:text-slate-300">
              🌍 Mental Link se adapta a tu idioma y cultura. Luna también habla en tu idioma preferido.
            </p>
          </div>
        </div>
      </Card>

      {/* Notificaciones */}
      <Card className="p-4 dark:bg-slate-800/30 dark:border-slate-600">
        <h3 className="mb-4 flex items-center space-x-2 dark:text-white">
          <Bell className="w-5 h-5" />
          <span>Notificaciones</span>
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="dark:text-white">Recordatorios diarios</span>
            <Switch 
              checked={notifications}
              onCheckedChange={(checked) => {
                setNotifications(checked);
                toast.success(checked ? 'Recordatorios activados' : 'Recordatorios desactivados', { duration: 2000 });
              }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Recibí recordatorios suaves para registrar tu estado de ánimo
          </p>
        </div>
      </Card>

      {/* Datos y privacidad */}
      <Card className="p-4 dark:bg-slate-800/30 dark:border-slate-600">
        <h3 className="mb-4 flex items-center space-x-2 dark:text-white">
          <Shield className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <span>Datos y privacidad</span>
        </h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="dark:text-white">Copia de seguridad automática</span>
            </div>
            <Switch 
              checked={dataBackup}
              onCheckedChange={(checked) => {
                setDataBackup(checked);
                toast.success(checked ? 'Copia de seguridad activada' : 'Copia de seguridad desactivada', { duration: 2000 });
              }}
            />
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleDataExport}
            className="w-full justify-start space-x-3 dark:border-gray-600"
          >
            <Download className="w-5 h-5" />
            <span>Exportar mis datos</span>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Button>
          
          <Button variant="ghost" className="w-full justify-start space-x-3">
            <HelpCircle className="w-5 h-5" />
            <span>Ayuda y soporte</span>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Button>
          
          <div className="p-3 rounded-lg bg-orange-50 dark:bg-slate-700/20 border border-orange-200 dark:border-slate-600">
            <p className="text-sm text-orange-700 dark:text-slate-300">
              🔒 Tus datos se guardan localmente en tu dispositivo. Podés exportarlos cuando quieras.
            </p>
          </div>
        </div>
      </Card>

      {/* Sobre Nosotros */}
      <Card className="p-4 dark:bg-slate-800/30 dark:border-slate-600">
        <h3 className="mb-4 flex items-center space-x-2 dark:text-white">
          <Info className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <span>Sobre Nosotros</span>
        </h3>
        
        <div className="space-y-4">
          {/* Contando el proyecto */}
          <div className="p-4 rounded-lg bg-purple-50 dark:bg-slate-700/20 border border-purple-200 dark:border-slate-600">
            <div className="space-y-3">
              <div className="flex items-center justify-center mb-3">
                <span className="text-2xl">🌱</span>
              </div>
              <div className="text-sm leading-relaxed space-y-3 text-purple-800 dark:text-slate-200">
                <p>
                  Mental Link es una propuesta tecnológica que busca acompañar a las personas en el cuidado de su salud mental.
                </p>
                <p>
                  Nuestro objetivo es crear una herramienta digital accesible y cercana, que permita identificar emociones, registrar estados de ánimo y generar un puente de comunicación con quienes pueden brindar apoyo.
                </p>
                <p>
                  A través de una aplicación móvil, queremos ofrecer un espacio seguro donde cada persona pueda expresarse, encontrar recursos de ayuda y sentirse acompañada. Creemos que la innovación tecnológica puede ser un motor de cambio positivo para la sociedad.
                </p>
              </div>
            </div>
          </div>

          {/* Quiénes somos */}
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-slate-700/20 border border-blue-200 dark:border-slate-600">
            <div className="space-y-3">
              <div className="flex items-center justify-center mb-3">
                <span className="text-2xl">🚀</span>
              </div>
              <div className="text-sm leading-relaxed space-y-3 text-blue-800 dark:text-slate-200">
                <p>
                  Somos un equipo de jóvenes de Trelew, Chubut, estudiantes de la E.S.E.T.P N.º 724 "Presidente Dr. Humberto Illia".
                </p>
                <p>
                  Nos mueve la motivación de aportar soluciones a problemáticas reales que afectan a personas de todas las edades.
                </p>
                <p>
                  Con Mental Link unimos nuestras habilidades en informática, creatividad y compromiso social para desarrollar un proyecto que tenga impacto más allá de nuestra escuela, llegando a comunidades diversas que necesitan nuevas herramientas de apoyo emocional.
                </p>
              </div>
            </div>
          </div>

          {/* La problemática */}
          <div className="p-4 rounded-lg bg-green-50 dark:bg-slate-700/20 border border-green-200 dark:border-slate-600">
            <div className="space-y-3">
              <div className="flex items-center justify-center mb-3">
                <span className="text-2xl">💭</span>
              </div>
              <div className="text-sm leading-relaxed space-y-3 text-green-800 dark:text-slate-200">
                <p>
                  Hoy en día, miles de personas conviven con estrés, ansiedad, falta de motivación y dificultades para expresar lo que sienten o pedir ayuda.
                </p>
                <p>
                  Al mismo tiempo, los recursos en salud mental suelen ser insuficientes o de difícil acceso, generando una brecha entre la necesidad de apoyo y las soluciones disponibles.
                </p>
                <p>
                  Mental Link nace como respuesta a esa necesidad: una plataforma pensada para acompañar, conectar y dar voz a quienes buscan apoyo emocional en su día a día.
                </p>
              </div>
            </div>
          </div>

          {/* Valores */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-700/20 dark:to-slate-700/20 border border-purple-200 dark:border-slate-600">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <img 
                  src={isDarkMode ? mentalLinkDarkPng : mentalLinkPng} 
                  alt="Mental Link Logo" 
                  className="h-20 w-auto"
                />
              </div>
              <div className="space-y-2">
                <h4 className="text-purple-700 dark:text-slate-200">
                  Una herramienta digital de acompañamiento para jóvenes y adultos
                </h4>
                <p className="text-sm text-purple-600 dark:text-slate-300 italic">
                  "Conecta con tus emociones, crece con confianza."
                </p>
              </div>
            </div>
          </div>

          {/* Instagram link */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => window.open('https://www.instagram.com/mentallink._?igsh=MTV5eGY2ZGNiaTJxeg%3D%3D&utm_source=qr', '_blank')}
              className="p-3 dark:border-slate-600"
            >
              <img 
                src={isDarkMode ? instagramIconDark : instagramIcon} 
                alt="Instagram" 
                className="w-6 h-6 object-contain"
              />
            </Button>
          </div>
        </div>
      </Card>

      {/* Información de la app */}
      <Card className="p-4 bg-blue-50 dark:bg-slate-700/30 border-blue-200 dark:border-slate-600">
        <div className="text-center space-y-2">
          <div className="text-2xl">🧠</div>
          <h3 className="text-blue-800 dark:text-slate-200">Mental Link</h3>
          <p className="text-sm text-blue-700 dark:text-slate-300">Versión 1.0.0</p>
          <p className="text-xs text-blue-600 dark:text-slate-400">
            Tu bienestar emocional es nuestra prioridad
          </p>
        </div>
      </Card>

      <Separator className="dark:bg-slate-600" />

      {/* Acciones de cuenta */}
      <Card className="p-4 dark:bg-slate-800/30 dark:border-slate-600">
        <h3 className="mb-4 flex items-center space-x-2 dark:text-white">
          <User className="w-5 h-5 text-red-600 dark:text-red-400" />
          <span>Gestión de cuenta</span>
        </h3>
        
        <div className="space-y-3">
          {/* Mostrar opciones solo si no es invitado */}
          {userData && (
            <div className="space-y-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full space-x-2 text-orange-600 border-orange-200 hover:bg-orange-50 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar mi historial de chat</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="dark:bg-gray-900 dark:border-gray-700">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="dark:text-white">¿Eliminar historial de chat?</AlertDialogTitle>
                    <AlertDialogDescription className="dark:text-gray-300">
                      Esta acción eliminará permanentemente todas las conversaciones con Luna. 
                      No se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="dark:border-gray-600 dark:text-gray-300">Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={() => {
                        localStorage.removeItem('mental-link-chat-history');
                        alert('Historial de chat eliminado');
                      }}
                      className="bg-orange-600 hover:bg-orange-700"
                    >
                      Sí, eliminar historial
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full space-x-2 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar cuenta</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="dark:bg-gray-900 dark:border-gray-700">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="dark:text-white">¿Eliminar cuenta completamente?</AlertDialogTitle>
                    <AlertDialogDescription className="dark:text-gray-300">
                      Esta acción eliminará permanentemente tu cuenta, resúmenes diarios y toda la información guardada. 
                      No se puede deshacer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="dark:border-gray-600 dark:text-gray-300">Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Sí, eliminar cuenta
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full space-x-2 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4" />
                <span>{userData ? 'Cerrar sesión' : 'Volver al inicio'}</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="dark:bg-gray-900 dark:border-gray-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="dark:text-white">
                  {userData ? '¿Cerrar sesión?' : '¿Volver al inicio?'}
                </AlertDialogTitle>
                <AlertDialogDescription className="dark:text-gray-300">
                  {userData 
                    ? 'Tu cuenta y datos se mantendrán seguros. Podrás volver a ingresar cuando quieras.'
                    : 'Volverás a la pantalla de inicio. Tus datos temporales se perderán.'
                  }
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="dark:border-gray-600 dark:text-gray-300">Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {userData ? 'Cerrar sesión' : 'Volver al inicio'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>

      {/* Advertencia sobre privacidad */}
      <Alert className="border-green-200 bg-green-50 dark:bg-slate-700/30 dark:border-slate-600">
        <Shield className="h-4 w-4" />
        <AlertDescription className="text-green-800 dark:text-green-200">
          <strong>Tu privacidad está protegida.</strong> Toda la información que compartís 
          es confidencial y se maneja con los más altos estándares de seguridad.
        </AlertDescription>
      </Alert>
    </div>
  );
}