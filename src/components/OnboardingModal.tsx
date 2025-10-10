import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Home, BarChart3, MessageCircle, Heart, Users, Calendar, ClipboardList, Mail, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
}

const onboardingSteps = [
  {
    title: "¡Bienvenido a Mental Link! 🌙",
    description: "Tu compañero personal para cuidar tu salud mental y bienestar emocional",
    icon: <Sparkles className="w-16 h-16 text-purple-500" />,
    content: "Mental Link te ayuda a registrar tus emociones, recibir apoyo y conectarte con personas de confianza cuando lo necesites."
  },
  {
    title: "Inicio y Estados de Ánimo 😊",
    description: "Expresa cómo te sentís cada día",
    icon: <Home className="w-16 h-16 text-blue-500" />,
    content: "Seleccioná emojis o escribí libremente sobre tus emociones. Recibirás mensajes personalizados de apoyo según tu estado."
  },
  {
    title: "Luna - Tu Chatbot de Apoyo 🌙",
    description: "Conversaciones empáticas 24/7",
    icon: <MessageCircle className="w-16 h-16 text-purple-500" />,
    content: "Luna está siempre disponible para escucharte, ofrecerte técnicas de relajación y guiarte cuando necesites apoyo emocional."
  },
  {
    title: "Dashboard y Calendario 📊",
    description: "Visualiza tu progreso emocional",
    icon: <BarChart3 className="w-16 h-16 text-green-500" />,
    content: "Observá patrones en tus emociones con gráficos interactivos y llevá un registro diario en tu calendario personal."
  },
  {
    title: "Ejercicios de Bienestar 💆",
    description: "Técnicas prácticas para tu día a día",
    icon: <Heart className="w-16 h-16 text-red-500" />,
    content: "Accedé a ejercicios de respiración, meditación y relajación para manejar ansiedad, estrés y mejorar tu bienestar."
  },
  {
    title: "Red de Apoyo 👥",
    description: "Conectá con adultos de confianza",
    icon: <Users className="w-16 h-16 text-orange-500" />,
    content: "Registrá contactos de personas de confianza para recibir apoyo cuando lo necesites. Tu seguridad es nuestra prioridad."
  }
];

export function OnboardingModal({ isOpen, onClose, userName }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Marcar onboarding como completado
      localStorage.setItem('mental-link-onboarding-completed', 'true');
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('mental-link-onboarding-completed', 'true');
    onClose();
  };

  const step = onboardingSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl text-purple-700 dark:text-purple-300">
            {step.title}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-6">
          {/* Icono central */}
          <div className="flex justify-center">
            {step.icon}
          </div>

          {/* Contenido */}
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
            <p className="text-center text-gray-700 dark:text-gray-300 leading-relaxed">
              {step.content}
            </p>
          </Card>

          {/* Indicador de progreso */}
          <div className="flex justify-center space-x-2">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'w-8 bg-purple-600 dark:bg-purple-400' 
                    : 'w-2 bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Botones de navegación */}
        <div className="flex justify-between items-center gap-3">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-gray-600 dark:text-gray-400"
          >
            Saltar tour
          </Button>

          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              className="bg-purple-600 hover:bg-purple-700 space-x-1"
            >
              <span>{currentStep === onboardingSteps.length - 1 ? '¡Empezar!' : 'Siguiente'}</span>
              {currentStep < onboardingSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
