import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Timer, Heart, Brain, Smile } from 'lucide-react';

interface Exercise {
  id: number;
  title: string;
  description: string;
  duration: string;
  category: string;
  icon: React.ReactNode;
  steps: string[];
  color: string;
}

const exercises: Exercise[] = [
  {
    id: 1,
    title: "Respiración 4-4-6",
    description: "Técnica de respiración para reducir la ansiedad",
    duration: "3 min",
    category: "Relajación",
    icon: <Heart className="w-5 h-5" />,
    color: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700",
    steps: [
      "Inhalá por la nariz contando hasta 4",
      "Mantené el aire contando hasta 4", 
      "Exhalá por la boca contando hasta 6",
      "Repetí 8 veces"
    ]
  },
  {
    id: 2,
    title: "Mindfulness 5-4-3-2-1",
    description: "Ejercicio de conexión con el presente",
    duration: "5 min",
    category: "Concentración",
    icon: <Brain className="w-5 h-5" />,
    color: "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700",
    steps: [
      "Identificá 5 cosas que podés ver",
      "Identificá 4 cosas que podés tocar",
      "Identificá 3 cosas que podés escuchar",
      "Identificá 2 cosas que podés oler",
      "Identificá 1 cosa que podés saborear"
    ]
  },
  {
    id: 3,
    title: "Pensamientos Positivos",
    description: "Reestructuración de pensamientos negativos",
    duration: "4 min",
    category: "Motivación",
    icon: <Smile className="w-5 h-5" />,
    color: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700",
    steps: [
      "Identificá un pensamiento negativo",
      "Preguntate: ¿Es este pensamiento real?",
      "Buscá evidencia que lo contradiga",
      "Reformulá el pensamiento de manera positiva",
      "Repetí la versión positiva 3 veces"
    ]
  },
  {
    id: 4,
    title: "Relajación Muscular",
    description: "Liberar tensión física acumulada",
    duration: "6 min",
    category: "Relajación",
    icon: <Timer className="w-5 h-5" />,
    color: "bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700",
    steps: [
      "Sentate cómodamente o acostáte",
      "Tensá los músculos de los pies por 5 segundos",
      "Relajá completamente y sentí la diferencia",
      "Repetí con cada grupo muscular hacia arriba",
      "Terminá con todo el cuerpo relajado"
    ]
  }
];

export function WellnessExercises() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const startExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setCurrentStep(0);
    setIsStarted(true);
  };

  const nextStep = () => {
    if (selectedExercise && currentStep < selectedExercise.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeExercise();
    }
  };

  const completeExercise = () => {
    setIsStarted(false);
    setSelectedExercise(null);
    setCurrentStep(0);
  };

  if (isStarted && selectedExercise) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl text-purple-700 dark:text-purple-300">{selectedExercise.title}</h2>
          <p className="text-gray-600 dark:text-gray-400">Paso {currentStep + 1} de {selectedExercise.steps.length}</p>
        </div>

        <Card className={`p-6 ${selectedExercise.color}`}>
          <div className="text-center space-y-4">
            <div className="text-4xl mb-4">{selectedExercise.icon}</div>
            <h3 className="text-lg dark:text-white">{selectedExercise.steps[currentStep]}</h3>
          </div>
        </Card>

        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={completeExercise}
            className="flex-1"
          >
            Detener
          </Button>
          <Button 
            onClick={nextStep}
            className="flex-1 bg-purple-600 hover:bg-purple-700"
          >
            {currentStep < selectedExercise.steps.length - 1 ? 'Siguiente' : 'Completar'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl text-purple-700 dark:text-purple-300 mb-2">Ejercicios de Bienestar</h2>
        <p className="text-gray-600 dark:text-gray-400">Elegí un ejercicio para sentirte mejor</p>
      </div>

      <div className="grid gap-4">
        {exercises.map((exercise) => (
          <Card 
            key={exercise.id} 
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${exercise.color}`}
            onClick={() => startExercise(exercise)}
          >
            <div className="flex items-start space-x-3">
              <div className="mt-1 text-gray-700 dark:text-gray-300">
                {exercise.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium dark:text-white">{exercise.title}</h3>
                  <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-200">
                    {exercise.duration}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{exercise.description}</p>
                <Badge variant="outline" className="text-xs dark:border-gray-500 dark:text-gray-300">
                  {exercise.category}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 border-green-200 dark:border-green-700">
        <div className="text-center space-y-2">
          <div className="text-2xl">💡</div>
          <h3 className="text-green-800 dark:text-green-200">Consejo del día</h3>
          <p className="text-sm text-green-700 dark:text-green-300">
            La práctica regular de estos ejercicios puede ayudarte a manejar mejor el estrés y la ansiedad. 
            Probá hacer al menos uno cada día.
          </p>
        </div>
      </Card>
    </div>
  );
}