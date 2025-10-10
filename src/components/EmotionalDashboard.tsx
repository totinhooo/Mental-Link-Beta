import { Card } from './ui/card';
import { Progress } from './ui/progress';

const weeklyMoods = [
  { day: 'Lun', mood: '😊', level: 80 },
  { day: 'Mar', mood: '😌', level: 70 },
  { day: 'Mié', mood: '😰', level: 40 },
  { day: 'Jue', mood: '😢', level: 30 },
  { day: 'Vie', mood: '😊', level: 85 },
  { day: 'Sáb', mood: '😌', level: 75 },
  { day: 'Hoy', mood: '😊', level: 80 },
];

const motivationalMessages = [
  "Cada día es una nueva oportunidad para sentirte mejor.",
  "Recordá que está bien no estar bien a veces.",
  "Sos más fuerte de lo que pensás.",
  "Tus sentimientos son válidos y normales.",
];

export function EmotionalDashboard() {
  const todayMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  const averageMood = Math.round(weeklyMoods.reduce((acc, day) => acc + day.level, 0) / weeklyMoods.length);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl text-purple-700 dark:text-purple-300 mb-2">Tu Estado Emocional</h2>
        <p className="text-gray-600 dark:text-gray-400">Así ha sido tu semana</p>
      </div>

      {/* Mensaje motivacional del día */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-blue-200 dark:border-blue-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
            <span className="text-xl">💙</span>
          </div>
          <div className="flex-1">
            <p className="text-purple-800 dark:text-purple-200">{todayMessage}</p>
          </div>
        </div>
      </Card>

      {/* Resumen de la semana */}
      <Card className="p-4 dark:bg-gray-800/50 dark:border-gray-700">
        <h3 className="mb-4 text-center text-gray-700 dark:text-gray-300">Tu semana emocional</h3>
        <div className="space-y-3">
          {weeklyMoods.map((dayData, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="w-12 text-center">
                <div className="text-xs text-gray-500">{dayData.day}</div>
                <div className="text-2xl">{dayData.mood}</div>
              </div>
              <div className="flex-1">
                <Progress 
                  value={dayData.level} 
                  className="h-3"
                />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 w-8">
                {dayData.level}%
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Estadística general */}
      <Card className="p-4 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700">
        <div className="text-center space-y-2">
          <div className="text-3xl">📊</div>
          <h3 className="text-green-800 dark:text-green-200">Promedio semanal</h3>
          <div className="text-2xl text-green-700 dark:text-green-300">{averageMood}%</div>
          <p className="text-sm text-green-700 dark:text-green-300">
            {averageMood >= 70 ? "¡Excelente semana!" : 
             averageMood >= 50 ? "Semana equilibrada" : 
             "Recordá que los días difíciles también pasan"}
          </p>
        </div>
      </Card>
    </div>
  );
}