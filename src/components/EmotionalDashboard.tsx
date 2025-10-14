import { Card } from './ui/card';
import { Progress } from './ui/progress';
import t from '../i18n';

export function EmotionalDashboard({ isDarkMode }: { isDarkMode?: boolean } = {}) {
  const weeklyMoods = [
    { day: t('emotionalDashboard.days.mon'), mood: '😊', level: 80 },
    { day: t('emotionalDashboard.days.tue'), mood: '😌', level: 70 },
    { day: t('emotionalDashboard.days.wed'), mood: '😰', level: 40 },
    { day: t('emotionalDashboard.days.thu'), mood: '😢', level: 30 },
    { day: t('emotionalDashboard.days.fri'), mood: '😊', level: 85 },
    { day: t('emotionalDashboard.days.sat'), mood: '😌', level: 75 },
    { day: t('emotionalDashboard.days.today'), mood: '😊', level: 80 },
  ];

  const motivCount = 4;
  const randIndex = Math.floor(Math.random() * motivCount);
  const todayMessage = t(`emotionalDashboard.motivationalMessages.${randIndex}`);
  const averageMood = Math.round(weeklyMoods.reduce((acc, day) => acc + day.level, 0) / weeklyMoods.length);

  const summaryText = averageMood >= 70
    ? t('emotionalDashboard.stats.excellent')
    : averageMood >= 50
      ? t('emotionalDashboard.stats.balanced')
      : t('emotionalDashboard.stats.difficult');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl text-purple-700 dark:text-purple-300 mb-2">{t('emotionalDashboard.title')}</h2>
        <p className="text-gray-600 dark:text-gray-400">{t('emotionalDashboard.subtitle')}</p>
      </div>

      {/* Daily motivational message */}
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

      {/* Week summary */}
      <Card className="p-4 dark:bg-gray-800/50 dark:border-gray-700">
        <h3 className="mb-4 text-center text-gray-700 dark:text-gray-300">{t('emotionalDashboard.weekTitle')}</h3>
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

      {/* General stats */}
      <Card className="p-4 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700">
        <div className="text-center space-y-2">
          <div className="text-3xl">📊</div>
          <h3 className="text-green-800 dark:text-green-200">{t('emotionalDashboard.averageTitle')}</h3>
          <div className="text-2xl text-green-700 dark:text-green-300">{averageMood}%</div>
          <p className="text-sm text-green-700 dark:text-green-300">
            {summaryText}
          </p>
        </div>
      </Card>
    </div>
  );
}