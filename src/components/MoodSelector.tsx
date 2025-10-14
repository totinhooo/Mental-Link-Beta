import { useState } from 'react';
import t from '../i18n';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { MessageCircle, Heart } from 'lucide-react';

interface MoodOption {
  emoji: string;
  label: string;
  color: string;
  message: string;
  supportMessage: string;
  showChatInvite: boolean;
}

// Mood options are built inside the component to ensure translations are loaded at render time

interface MoodSelectorProps {
  onMoodSelect: (mood: MoodOption) => void;
  onChatNavigate: () => void;
}

export function MoodSelector({ onMoodSelect, onChatNavigate }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);

  const moodOptions: MoodOption[] = [
    {
      emoji: '😊',
      label: t('moods.happy.label'),
      color: 'bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:hover:bg-yellow-800/40',
      message: t('moods.happy.message'),
      supportMessage: t('moods.happy.supportMessage'),
      showChatInvite: false,
    },
    {
      emoji: '😢',
      label: t('moods.sad.label'),
      color: 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-800/40',
      message: t('moods.sad.message'),
      supportMessage: t('moods.sad.supportMessage'),
      showChatInvite: true,
    },
    {
      emoji: '😰',
      label: t('moods.anxious.label'),
      color: 'bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-800/40',
      message: t('moods.anxious.message'),
      supportMessage: t('moods.anxious.supportMessage'),
      showChatInvite: true,
    },
    {
      emoji: '😡',
      label: t('moods.angry.label'),
      color: 'bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/40',
      message: t('moods.angry.message'),
      supportMessage: t('moods.angry.supportMessage'),
      showChatInvite: true,
    },
    {
      emoji: '😌',
      label: t('moods.calm.label'),
      color: 'bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:hover:bg-green-800/40',
      message: t('moods.calm.message'),
      supportMessage: t('moods.calm.supportMessage'),
      showChatInvite: false,
    },
  ];

  const handleMoodSelect = (mood: MoodOption) => {
    setSelectedMood(mood);
    onMoodSelect(mood);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl text-purple-700 dark:text-purple-300">¿Cómo te sentís hoy?</h2>
        <p className="text-gray-600 dark:text-gray-400">Tocá el emoji que mejor represente tu estado de ánimo</p>
      </div>
      
      <div className="space-y-4">
        {/* Primera fila: 3 elementos */}
        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          {moodOptions.slice(0, 3).map((mood) => (
            <Button
              key={mood.label}
              variant="ghost"
              className={`h-24 flex flex-col items-center justify-center space-y-2 rounded-2xl border-2 transition-all ${
                selectedMood?.label === mood.label 
                  ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-500' 
                  : 'border-gray-200 dark:border-gray-600'
              } ${mood.color} dark:hover:bg-gray-700/50`}
              onClick={() => handleMoodSelect(mood)}
            >
              <span className="text-3xl">{mood.emoji}</span>
              <span className="text-sm text-gray-700 dark:text-gray-200">{mood.label}</span>
            </Button>
          ))}
        </div>
        
        {/* Segunda fila: 2 elementos centrados */}
        <div className="flex justify-center gap-4 max-w-sm mx-auto">
          {moodOptions.slice(3, 5).map((mood) => (
            <Button
              key={mood.label}
              variant="ghost"
              className={`h-24 w-20 flex flex-col items-center justify-center space-y-2 rounded-2xl border-2 transition-all ${
                selectedMood?.label === mood.label 
                  ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/30 dark:border-purple-500' 
                  : 'border-gray-200 dark:border-gray-600'
              } ${mood.color} dark:hover:bg-gray-700/50`}
              onClick={() => handleMoodSelect(mood)}
            >
              <span className="text-3xl">{mood.emoji}</span>
              <span className="text-sm text-gray-700 dark:text-gray-200">{mood.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {selectedMood && (
        <div className="space-y-4">
          <Card className="p-5 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 border-purple-200 dark:border-purple-700">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-purple-800 dark:text-purple-200">Mensaje para vos</span>
                <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-purple-800 dark:text-purple-200 leading-relaxed">
                {selectedMood.message}
              </p>
            </div>
          </Card>

          <Card className="p-4 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
            <div className="space-y-3">
              <p className="text-blue-800 dark:text-blue-200 text-center">
                {selectedMood.supportMessage}
              </p>
              
              {selectedMood.showChatInvite && (
                <Button 
                  onClick={onChatNavigate}
                  className="w-full bg-blue-600 hover:bg-blue-700 space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Hablar con Luna ahora</span>
                </Button>
              )}
              
              {!selectedMood.showChatInvite && (
                <div className="text-center">
                  <Button 
                    onClick={onChatNavigate}
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
    </div>
  );
}