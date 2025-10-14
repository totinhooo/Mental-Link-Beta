import { useState } from 'react';
import { t } from '../i18n';
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
    title: t('onboarding.steps.1.title'),
    description: t('onboarding.steps.1.description'),
    icon: <Sparkles className="w-16 h-16 text-purple-500" />,
    content: t('onboarding.steps.1.content')
  },
  {
    title: t('onboarding.steps.2.title'),
    description: t('onboarding.steps.2.description'),
    icon: <Home className="w-16 h-16 text-blue-500" />,
    content: t('onboarding.steps.2.content')
  },
  {
    title: t('onboarding.steps.3.title'),
    description: t('onboarding.steps.3.description'),
    icon: <MessageCircle className="w-16 h-16 text-purple-500" />,
    content: t('onboarding.steps.3.content')
  },
  {
    title: t('onboarding.steps.4.title'),
    description: t('onboarding.steps.4.description'),
    icon: <BarChart3 className="w-16 h-16 text-green-500" />,
    content: t('onboarding.steps.4.content')
  },
  {
    title: t('onboarding.steps.5.title'),
    description: t('onboarding.steps.5.description'),
    icon: <Heart className="w-16 h-16 text-red-500" />,
    content: t('onboarding.steps.5.content')
  },
  {
    title: t('onboarding.steps.6.title'),
    description: t('onboarding.steps.6.description'),
    icon: <Users className="w-16 h-16 text-orange-500" />,
    content: t('onboarding.steps.6.content')
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
            {t('onboarding.skip')}
          </Button>

          <div className="flex gap-2">
                {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                className="space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                    <span>{t('onboarding.previous')}</span>
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              className="bg-purple-600 hover:bg-purple-700 space-x-1"
            >
              <span>{currentStep === onboardingSteps.length - 1 ? t('onboarding.start') : t('onboarding.next')}</span>
              {currentStep < onboardingSteps.length - 1 && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
