import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MessageCircle, Send, Sparkles } from 'lucide-react';

interface MoodOption {
  emoji: string;
  label: string;
  color: string;
  message: string;
  supportMessage: string;
  showChatInvite: boolean;
}

interface QuickMoodInputProps {
  onMoodSelect: (mood: MoodOption) => void;
  onChatNavigate: () => void;
  isDarkMode: boolean;
}

// Sistema expandido de detección contextual y respuestas inteligentes
const moodResponses: Record<string, { response: string; techniques: string[]; urgency: 'low' | 'medium' | 'high'; chatSuggested: boolean }> = {
  // Estrés académico
  "estresado": {
    response: "El estrés es normal, especialmente durante el secundario. Es tu mente diciéndote que algo te importa. 💙",
    techniques: [
      "🧘‍♀️ Respiración 4-7-8: Inhalá 4, mantené 7, exhalá 8",
      "📝 Dividí las tareas en partes pequeñas y manejables",
      "⏰ Técnica Pomodoro: 25 min trabajo + 5 min descanso",
      "🚶‍♀️ Caminá 10 minutos al aire libre"
    ],
    urgency: 'medium',
    chatSuggested: false
  },
  
  "tarea": {
    response: "Las tareas pueden sentirse abrumadoras, pero recordá que cada pequeño paso cuenta. Sos capaz de hacerlo! 💪",
    techniques: [
      "🎯 Empezá por la parte más fácil para ganar confianza", 
      "⏰ Poné un timer de 15 minutos y trabajá sin distracciones",
      "🎵 Probá música instrumental para concentrarte",
      "🤝 Pedí ayuda a un compañero o profesor si lo necesitás"
    ],
    urgency: 'low',
    chatSuggested: false
  },

  "examen": {
    response: "Los nervios pre-examen son súper normales. Significan que te importa tu futuro, y eso es genial. 📚",
    techniques: [
      "📖 Repasá los puntos clave en voz alta",
      "🛌 Dormí bien la noche anterior (es MUY importante)",
      "🍎 Comé algo liviano antes del examen",
      "🧘‍♀️ 5 min de respiración profunda antes de empezar"
    ],
    urgency: 'medium',
    chatSuggested: true
  },

  // Estados emocionales
  "triste": {
    response: "Es normal sentirse triste a veces. Tus emociones son válidas y está bien tomate tiempo para procesarlas. 🌧️",
    techniques: [
      "😭 Permitite llorar si lo necesitás - es sanador",
      "📱 Hablá con alguien que te importe",
      "🎨 Expresate creativamente: dibujá, escribí, cantá",
      "🌿 Conectá con la naturaleza, aunque sea por 5 minutos"
    ],
    urgency: 'medium',
    chatSuggested: true
  },

  "solo": {
    response: "Sentirse solo duele mucho, pero recordá que no estás realmente solo. Hay personas que se preocupan por vos. 🤗",
    techniques: [
      "📞 Enviá un mensaje a un amigo o familiar",
      "🏫 Participá en alguna actividad del colegio",
      "🎮 Uníte a una comunidad online de tus intereses",
      "🤝 Ofrecete como voluntario para algo que te importe"
    ],
    urgency: 'high',
    chatSuggested: true
  },

  "ansioso": {
    response: "La ansiedad puede ser intensa, pero es manejable. Vamos a calmarnos juntos, paso a paso. 🌊",
    techniques: [
      "🖐️ Técnica 5-4-3-2-1: 5 cosas que ves, 4 que tocás, 3 que escuchás, 2 que olés, 1 que saboreás",
      "❄️ Poné las manos en agua fría por 30 segundos",
      "🎵 Escuchá música relajante con auriculares",
      "📱 Usá una app de meditación por 5 minutos"
    ],
    urgency: 'high',
    chatSuggested: true
  },

  // Estados positivos
  "motivado": {
    response: "¡Qué buena energía! La motivación es como una ola - aprovechála mientras está aquí. 🌟",
    techniques: [
      "📝 Anotá 3 metas que querés lograr hoy",
      "💪 Hacé algo físico para canalizar esa energía",
      "📸 Tomate una foto mental de cómo te sentís ahora",
      "🎯 Empezá ese proyecto que venías postergando"
    ],
    urgency: 'low',
    chatSuggested: false
  },

  "feliz": {
    response: "¡Me alegra saber que estás feliz! Estos momentos son los que hacen que todo valga la pena. 😊",
    techniques: [
      "😊 Compartí tu alegría con alguien que te importe",
      "📔 Escribí qué te hizo sentir así para recordarlo después",
      "🤝 Hacé algo lindo por otra persona",
      "🎉 Celebrá este momento, te lo merecés"
    ],
    urgency: 'low',
    chatSuggested: false
  },

  // Problemas específicos
  "familia": {
    response: "Los problemas familiares pueden ser muy pesados. Recordá que no tenés que resolverlo todo vos solo/a. 🏠",
    techniques: [
      "🗣️ Hablá con calma sobre cómo te sentís",
      "👂 Tratá de entender el punto de vista del otro",
      "🚪 Tomate un tiempo si la situación se vuelve muy intensa",
      "🤝 Buscá la ayuda de un adulto de confianza"
    ],
    urgency: 'medium',
    chatSuggested: true
  },

  "amigos": {
    response: "Las amistades en el secundario pueden ser complicadas. Tus sentimientos sobre esto son totalmente válidos. 👥",
    techniques: [
      "💬 Hablá directamente sobre lo que te molesta",
      "👂 Escuchá su perspectiva también",
      "⏰ A veces el tiempo ayuda a resolver conflictos",
      "🌱 Recordá que crecer a veces significa cambiar"
    ],
    urgency: 'medium',
    chatSuggested: true
  },

  // Palabras adicionales
  "cansado": {
    response: "El cansancio puede ser físico, mental o emocional. Tu cuerpo y mente necesitan descanso. 😴",
    techniques: [
      "🛌 Dormí 8 horas si podés",
      "💧 Tomá más agua de lo usual",
      "🌅 Exponete a luz natural por 10 minutos",
      "🧘‍♀️ Hacé una siesta de 20 minutos máximo"
    ],
    urgency: 'low',
    chatSuggested: false
  },

  "nervioso": {
    response: "Los nervios son como una alarma interna. Tu cuerpo se está preparando para algo importante. 🎯",
    techniques: [
      "🫁 Respirá lento y profundo desde el abdomen",
      "🎵 Escuchá tu canción favorita",
      "💭 Visualizá un resultado positivo",
      "🤝 Hablá con alguien que te tranquilice"
    ],
    urgency: 'medium',
    chatSuggested: true
  },

  // Respuesta por defecto
  "default": {
    response: "Gracias por contarme cómo te sentís. Es muy valiente de tu parte expresar tus emociones. 💙",
    techniques: [
      "🧘‍♀️ Tomate 3 respiraciones profundas",
      "📝 Escribí en un papel lo que estás sintiendo",
      "🚶‍♀️ Caminá un poco si podés",
      "💭 Recordá que está bien sentir lo que sentís"
    ],
    urgency: 'low',
    chatSuggested: true
  }
};

export function QuickMoodInput({ onMoodSelect, onChatNavigate, isDarkMode }: QuickMoodInputProps) {
  const [input, setInput] = useState('');
  const [currentResponse, setCurrentResponse] = useState<{ response: string; techniques: string[]; urgency: 'low' | 'medium' | 'high'; chatSuggested: boolean } | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const generateResponse = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    
    // Buscar palabras clave en el input del usuario
    for (const [keyword, responseData] of Object.entries(moodResponses)) {
      if (keyword !== 'default' && lowerInput.includes(keyword)) {
        return responseData;
      }
    }
    
    return moodResponses.default;
  };

  const handleSubmit = () => {
    if (input.trim()) {
      const aiResponse = generateResponse(input);
      setCurrentResponse(aiResponse);
      setIsVisible(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const resetInput = () => {
    setInput('');
    setCurrentResponse(null);
    setIsVisible(false);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-red-200 bg-red-50 dark:border-red-700 dark:bg-red-900/20';
      case 'medium': return 'border-orange-200 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20';
      default: return 'border-green-200 bg-green-50 dark:border-green-700 dark:bg-green-900/20';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      default: return '💚';
    }
  };

  return (
    <Card className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-indigo-200 dark:border-indigo-700">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-indigo-800 dark:text-indigo-200">¿Cómo te sentís hoy?</h3>
        </div>
        
        <p className="text-sm text-indigo-700 dark:text-indigo-300">
          Si ningún emoji representa tu estado, escribí libremente cómo te sentís
        </p>

        {!isVisible ? (
          <div className="space-y-3">
            <Input
              placeholder="Ej: Me siento estresado por la tarea de matemáticas..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleSubmit}
                disabled={!input.trim()}
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700 space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Enviar</span>
              </Button>
            </div>
          </div>
        ) : currentResponse && (
          <div className="space-y-4">
            {/* Respuesta principal */}
            <Card className={`p-4 transition-colors duration-300 ${getUrgencyColor(currentResponse.urgency)}`}>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-white/80 dark:bg-gray-800/80 rounded-full flex items-center justify-center">
                    <span className="text-sm">{getUrgencyIcon(currentResponse.urgency)}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mental Link te entiende:
                  </span>
                </div>
                
                <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                  {currentResponse.response}
                </p>
              </div>
            </Card>

            {/* Técnicas específicas */}
            <Card className="p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  💡 Técnicas que pueden ayudarte ahora:
                </h4>
                
                <div className="space-y-2">
                  {currentResponse.techniques.map((technique, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                        {technique}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Botones de acción */}
            <div className="space-y-2">
              {currentResponse.chatSuggested && (
                <Button 
                  onClick={onChatNavigate}
                  size="sm"
                  className="w-full bg-purple-600 hover:bg-purple-700 space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Hablar con Luna para apoyo personalizado</span>
                </Button>
              )}
              
              <div className="flex space-x-2">
                <Button 
                  onClick={resetInput}
                  variant="outline"
                  size="sm"
                  className="flex-1 dark:border-gray-600 dark:text-gray-300"
                >
                  Expresar algo más
                </Button>
                
                {!currentResponse.chatSuggested && (
                  <Button 
                    onClick={onChatNavigate}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-600 dark:text-purple-300 dark:hover:bg-purple-900/20"
                  >
                    Chat con Luna
                  </Button>
                )}
              </div>
            </div>

            {/* Mensaje de apoyo adicional */}
            {currentResponse.urgency === 'high' && (
              <Card className="p-3 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-700">
                <div className="text-center space-y-2">
                  <span className="text-lg">🤗</span>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    <strong>Recordá:</strong> Si necesitás ayuda inmediata, no dudes en contactar a tu adulto de confianza o la línea 144.
                  </p>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Sugerencias rápidas */}
        {!isVisible && (
          <div className="space-y-3">
            <p className="text-xs text-indigo-600 dark:text-indigo-400">💭 Ejemplos de expresiones:</p>
            <div className="grid grid-cols-1 gap-2">
              {[
                "Me siento estresado por la tarea de matemáticas", 
                "Estoy nervioso por el examen de mañana", 
                "Me siento solo en el recreo",
                "Estoy feliz porque aprobé el parcial",
                "Tengo problemas en casa con mi familia",
                "Me siento ansioso sin razón aparente"
              ].map((example) => (
                <Button
                  key={example}
                  variant="outline"
                  size="sm"
                  className="text-xs h-auto p-2 text-left border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-600 dark:text-indigo-300 dark:hover:bg-indigo-900/20"
                  onClick={() => {
                    setInput(example);
                    const aiResponse = generateResponse(example);
                    setCurrentResponse(aiResponse);
                    setIsVisible(true);
                  }}
                >
                  "{example}"
                </Button>
              ))}
            </div>
            
            <div className="p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700">
              <p className="text-xs text-indigo-700 dark:text-indigo-300 text-center">
                🌟 <strong>Tip:</strong> Sé específico sobre tu situación. Cuanto más detalles, mejor podré ayudarte.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}