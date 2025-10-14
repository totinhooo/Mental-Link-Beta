import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Heart, Brain, Users, Home, Save, CheckCircle } from 'lucide-react';
import t, { getPersistedLang } from '../i18n';

interface DiagnosisData {
  mood: number;
  energy: number;
  stress: number;
  sleep: number;
  social: number;
  notes: string;
  date: string;
}

export function DailyDiagnosis({ isDarkMode }: { isDarkMode?: boolean } = {}) {
  const [currentDiagnosis, setCurrentDiagnosis] = useState<DiagnosisData>({
    mood: 5,
    energy: 5,
    stress: 5,
    sleep: 5,
    social: 5,
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions = [
    {
      key: 'mood' as keyof DiagnosisData,
      label: t('dailyDiagnosis.questions.mood.label'),
      icon: Heart,
      color: 'text-purple-600 dark:text-purple-400',
      lowLabel: t('dailyDiagnosis.questions.mood.lowLabel'),
      highLabel: t('dailyDiagnosis.questions.mood.highLabel')
    },
    {
      key: 'energy' as keyof DiagnosisData,
      label: t('dailyDiagnosis.questions.energy.label'),
      icon: Brain,
      color: 'text-blue-600 dark:text-blue-400',
      lowLabel: t('dailyDiagnosis.questions.energy.lowLabel'),
      highLabel: t('dailyDiagnosis.questions.energy.highLabel')
    },
    {
      key: 'stress' as keyof DiagnosisData,
      label: t('dailyDiagnosis.questions.stress.label'),
      icon: Brain,
      color: 'text-red-600 dark:text-red-400',
      lowLabel: t('dailyDiagnosis.questions.stress.lowLabel'),
      highLabel: t('dailyDiagnosis.questions.stress.highLabel')
    },
    {
      key: 'sleep' as keyof DiagnosisData,
      label: t('dailyDiagnosis.questions.sleep.label'),
      icon: Home,
      color: 'text-green-600 dark:text-green-400',
      lowLabel: t('dailyDiagnosis.questions.sleep.lowLabel'),
      highLabel: t('dailyDiagnosis.questions.sleep.highLabel')
    },
    {
      key: 'social' as keyof DiagnosisData,
      label: t('dailyDiagnosis.questions.social.label'),
      icon: Users,
      color: 'text-orange-600 dark:text-orange-400',
      lowLabel: t('dailyDiagnosis.questions.social.lowLabel'),
      highLabel: t('dailyDiagnosis.questions.social.highLabel')
    }
  ];

  const handleSliderChange = (key: keyof DiagnosisData, value: number) => {
    setCurrentDiagnosis(prev => ({ ...prev, [key]: value }));
  };

  const handleNotesChange = (notes: string) => {
    setCurrentDiagnosis(prev => ({ ...prev, notes }));
  };

  const handleSubmit = () => {
    // Guardar en localStorage
    const existingData = JSON.parse(localStorage.getItem('mental-link-daily-diagnosis') || '[]');
    const newData = [...existingData, { ...currentDiagnosis, timestamp: new Date().toISOString() }];
    localStorage.setItem('mental-link-daily-diagnosis', JSON.stringify(newData));
    
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const getScoreColor = (score: number) => {
    if (score <= 3) return 'text-red-600 dark:text-red-400';
    if (score <= 6) return 'text-orange-600 dark:text-orange-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getScoreLabel = (score: number) => {
    if (score <= 3) return t('dailyDiagnosis.score.needsAttention');
    if (score <= 6) return t('dailyDiagnosis.score.moderate');
    return t('dailyDiagnosis.score.good');
  };

  // Funciones específicas para la pregunta de estrés (colores invertidos)
  const getStressScoreColor = (score: number) => {
    if (score <= 3) return 'text-green-600 dark:text-green-400';
    if (score <= 6) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getStressScoreLabel = (score: number) => {
    if (score <= 3) return t('dailyDiagnosis.score.good');
    if (score <= 6) return t('dailyDiagnosis.score.moderate');
    return t('dailyDiagnosis.score.needsAttention');
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <Card className="p-6 text-center bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-700">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600 dark:text-green-400" />
          <h2 className="text-lg mb-2 text-green-700 dark:text-green-300">
            {t('dailyDiagnosis.header.savedTitle')}
          </h2>
          <p className="text-sm text-green-600 dark:text-green-200">
            {t('dailyDiagnosis.header.savedBody')}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
        <div className="text-center space-y-3">
          <span className="text-3xl">📋</span>
          <h1 className="text-lg text-purple-700 dark:text-purple-300">
            {t('dailyDiagnosis.header.title')}
          </h1>
          <p className="text-sm text-purple-600 dark:text-purple-200">
            {t('dailyDiagnosis.header.description')}
          </p>
          <Badge variant="outline" className="text-xs">
            {new Date().toLocaleDateString(getPersistedLang() === 'en' ? 'en-US' : 'es-AR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Badge>
        </div>
      </Card>

      {/* Preguntas */}
      <div className="space-y-4">
        {questions.map((question, index) => {
          const IconComponent = question.icon;
          const value = currentDiagnosis[question.key] as number;
          
          return (
            <Card key={question.key} className="p-5">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <IconComponent className={`w-5 h-5 ${question.color}`} />
                  <h3 className="text-sm text-gray-800 dark:text-gray-200">
                    {question.label}
                  </h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{question.lowLabel}</span>
                    <span className={question.key === 'stress' ? getStressScoreColor(value) : getScoreColor(value)}>
                      {value}/10 - {question.key === 'stress' ? getStressScoreLabel(value) : getScoreLabel(value)}
                    </span>
                    <span>{question.highLabel}</span>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={value}
                      onChange={(e) => handleSliderChange(question.key, parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {[1,2,3,4,5,6,7,8,9,10].map(num => (
                        <span key={num}>{num}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Notas adicionales */}
      <Card className="p-5">
        <div className="space-y-3">
          <h3 className="text-sm text-gray-800 dark:text-gray-200 flex items-center space-x-2">
            <span>📝</span>
            <span>{t('dailyDiagnosis.notesTitle')}</span>
          </h3>
          <Textarea
            placeholder={t('dailyDiagnosis.notesPlaceholder')}
            value={currentDiagnosis.notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            className="min-h-[100px] bg-white dark:bg-gray-800/50 border-gray-200 dark:border-gray-600"
          />
        </div>
      </Card>

      {/* Resumen y guardar */}
      <Card className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="space-y-4">
          <h3 className="text-sm text-blue-700 dark:text-blue-300">
            {t('dailyDiagnosis.summaryTitle')}
          </h3>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            {questions.map((question) => {
              const value = currentDiagnosis[question.key] as number;
              return (
                <div key={question.key} className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    {t(`dailyDiagnosis.questions.${question.key}.summaryLabel`)}:
                  </span>
                  <span className={question.key === 'stress' ? getStressScoreColor(value) : getScoreColor(value)}>
                    {value}/10
                  </span>
                </div>
              );
            })}
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>{t('dailyDiagnosis.saveButton')}</span>
          </Button>
        </div>
      </Card>

      {/* Mensaje motivacional */}
      <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-700">
        <div className="text-center">
          <span className="text-2xl mb-2 block">🌟</span>
          <p className="text-xs text-green-700 dark:text-green-300">
            {t('dailyDiagnosis.motivation')}
          </p>
        </div>
      </Card>
    </div>
  );
}