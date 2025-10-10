import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp } from 'lucide-react';

interface DayData {
  date: string;
  mood: number;
  energy: number;
  stress: number;
  notes?: string;
}

export function EmotionalCalendar({ isDarkMode }: { isDarkMode?: boolean } = {}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dailyData, setDailyData] = useState<DayData[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);

  useEffect(() => {
    // Cargar datos del localStorage
    const savedData = localStorage.getItem('mental-link-daily-diagnosis');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      const transformedData = parsedData.map((entry: any) => ({
        date: entry.date || entry.timestamp?.split('T')[0] || new Date().toISOString().split('T')[0],
        mood: entry.mood || 5,
        energy: entry.energy || 5,
        stress: entry.stress || 5,
        notes: entry.notes || ''
      }));
      setDailyData(transformedData);
    }
  }, []);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getDataForDate = (year: number, month: number, day: number) => {
    const dateKey = formatDateKey(year, month, day);
    return dailyData.find(data => data.date === dateKey);
  };

  const getMoodColor = (mood: number) => {
    if (mood <= 3) return 'bg-red-500';
    if (mood <= 6) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getMoodEmoji = (mood: number) => {
    if (mood <= 2) return '😢';
    if (mood <= 4) return '😔';
    if (mood <= 6) return '😐';
    if (mood <= 8) return '🙂';
    return '😊';
  };

  const getAverageScores = () => {
    if (dailyData.length === 0) return { mood: 0, energy: 0, stress: 0 };
    
    const totals = dailyData.reduce((acc, day) => ({
      mood: acc.mood + day.mood,
      energy: acc.energy + day.energy,
      stress: acc.stress + day.stress
    }), { mood: 0, energy: 0, stress: 0 });

    return {
      mood: Math.round(totals.mood / dailyData.length),
      energy: Math.round(totals.energy / dailyData.length),
      stress: Math.round(totals.stress / dailyData.length)
    };
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
    setSelectedDay(null);
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Días vacíos al inicio del mes
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dayData = getDataForDate(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
      
      days.push(
        <div
          key={day}
          onClick={() => dayData && setSelectedDay(dayData)}
          className={`h-12 flex flex-col items-center justify-center cursor-pointer rounded-lg transition-colors duration-200 ${
            isToday ? 'bg-purple-100 dark:bg-purple-900/50 border border-purple-300 dark:border-purple-600' : ''
          } ${
            dayData ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : ''
          }`}
        >
          <span className={`text-xs ${isToday ? 'text-purple-700 dark:text-purple-300 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
            {day}
          </span>
          {dayData && (
            <div className="flex items-center space-x-1 mt-1">
              <div className={`w-2 h-2 rounded-full ${getMoodColor(dayData.mood)}`}></div>
              <span className="text-xs">{getMoodEmoji(dayData.mood)}</span>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const averages = getAverageScores();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
        <div className="text-center space-y-3">
          <Calendar className="w-8 h-8 mx-auto text-purple-600 dark:text-purple-400" />
          <h1 className="text-lg text-purple-700 dark:text-purple-300">
            Calendario emocional
          </h1>
          <p className="text-sm text-purple-600 dark:text-purple-200">
            Visualiza tu progreso emocional día a día y descubre patrones en tu bienestar.
          </p>
        </div>
      </Card>

      {/* Resumen mensual */}
      {dailyData.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm text-gray-800 dark:text-gray-200 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Promedio del mes</span>
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Estado de ánimo</div>
              <div className="text-lg font-medium text-purple-600 dark:text-purple-400">{averages.mood}/10</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Energía</div>
              <div className="text-lg font-medium text-blue-600 dark:text-blue-400">{averages.energy}/10</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Estrés</div>
              <div className="text-lg font-medium text-red-600 dark:text-red-400">{averages.stress}/10</div>
            </div>
          </div>
        </Card>
      )}

      {/* Navegación del calendario */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('prev')}
            className="text-purple-600 dark:text-purple-400"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <h2 className="text-lg text-gray-800 dark:text-gray-200">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth('next')}
            className="text-purple-600 dark:text-purple-400"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs text-gray-500 dark:text-gray-400 p-2">
              {day}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>

        {/* Leyenda */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <span className="text-gray-500 dark:text-gray-400">Día difícil</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <span className="text-gray-500 dark:text-gray-400">Día normal</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-500 dark:text-gray-400">Buen día</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Detalle del día seleccionado */}
      {selectedDay && (
        <Card className="p-5 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm text-blue-700 dark:text-blue-300">
                Detalles del día
              </h3>
              <Badge variant="outline">
                {new Date(selectedDay.date).toLocaleDateString('es-AR', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Badge>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Estado de ánimo</div>
                <div className="text-lg flex items-center justify-center space-x-1">
                  <span>{getMoodEmoji(selectedDay.mood)}</span>
                  <span className="text-purple-600 dark:text-purple-400">{selectedDay.mood}/10</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Energía</div>
                <div className="text-lg text-blue-600 dark:text-blue-400">{selectedDay.energy}/10</div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Estrés</div>
                <div className="text-lg text-red-600 dark:text-red-400">{selectedDay.stress}/10</div>
              </div>
            </div>

            {selectedDay.notes && (
              <div className="pt-3 border-t border-blue-200 dark:border-blue-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Notas del día:</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{selectedDay.notes}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Mensaje si no hay datos */}
      {dailyData.length === 0 && (
        <Card className="p-6 text-center">
          <span className="text-4xl mb-4 block">📅</span>
          <h3 className="text-lg mb-2 text-gray-700 dark:text-gray-300">
            Aún no tienes registros
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Completa tu primer resumen diario para comenzar a ver tu progreso emocional en el calendario.
          </p>
        </Card>
      )}
    </div>
  );
}