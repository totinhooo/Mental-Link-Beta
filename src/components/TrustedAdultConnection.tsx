import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { User, Users, GraduationCap, Heart, Send, AlertTriangle, Phone } from 'lucide-react';

interface TrustedAdult {
  id: number;
  name: string;
  role: string;
  availability: string;
  icon: React.ReactNode;
  color: string;
}

const trustedAdults: TrustedAdult[] = [
  {
    id: 1,
    name: "Prof. María González",
    role: "Tutora",
    availability: "Disponible",
    icon: <GraduationCap className="w-5 h-5" />,
    color: "border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30"
  },
  {
    id: 2,
    name: "Familia",
    role: "Contacto familiar",
    availability: "Siempre disponible",
    icon: <Heart className="w-5 h-5" />,
    color: "border-pink-200 dark:border-pink-700 bg-pink-50 dark:bg-pink-900/30"
  },
  {
    id: 3,
    name: "Orientador Escolar",
    role: "Psicopedagogo",
    availability: "Lun-Vie 9-17hs",
    icon: <Users className="w-5 h-5" />,
    color: "border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/30"
  }
];

const urgencyLevels = [
  { label: "No es urgente", value: "low", color: "bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200" },
  { label: "Necesito hablar pronto", value: "medium", color: "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200" },
  { label: "Es urgente", value: "high", color: "bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200" }
];

export function TrustedAdultConnection({ isDarkMode }: { isDarkMode?: boolean } = {}) {
  const [selectedAdult, setSelectedAdult] = useState<TrustedAdult | null>(null);
  const [message, setMessage] = useState('');
  const [urgency, setUrgency] = useState('low');
  const [messageSent, setMessageSent] = useState(false);

  const sendMessage = () => {
    if (selectedAdult && message.trim()) {
      setMessageSent(true);
      // En una app real, aquí se enviaría el mensaje
      setTimeout(() => {
        setMessageSent(false);
        setMessage('');
        setSelectedAdult(null);
        setUrgency('low');
      }, 3000);
    }
  };

  if (messageSent) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl text-purple-700 dark:text-purple-300 mb-2">Mensaje Enviado</h2>
        </div>
        
        <Card className="p-6 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700">
          <div className="text-center space-y-4">
            <div className="text-4xl">✅</div>
            <h3 className="text-green-800 dark:text-green-200">Tu mensaje fue enviado correctamente</h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              {selectedAdult?.name} recibirá tu mensaje y se pondrá en contacto contigo pronto.
            </p>
            <div className="pt-2">
              <Badge className="bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-200">
                Prioridad: {urgencyLevels.find(u => u.value === urgency)?.label}
              </Badge>
            </div>
          </div>
        </Card>

        <Alert className="border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30">
          <Heart className="h-4 w-4" />
          <AlertDescription className="text-blue-800 dark:text-blue-200">
            Recordá que siempre hay alguien dispuesto a escucharte y ayudarte. 
            No estás solo en esto.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl text-purple-700 dark:text-purple-300 mb-2">Pedir Ayuda</h2>
        <p className="text-gray-600 dark:text-gray-400">Conectate con un adulto de confianza</p>
      </div>

      {/* Botón de emergencia */}
      <Alert className="border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/30">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription className="text-red-800 dark:text-red-200">
          <div className="flex items-center justify-between">
            <span>Si es una emergencia, llamá inmediatamente:</span>
            <Button size="sm" className="bg-red-600 hover:bg-red-700 ml-2 flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>135</span>
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* Selección de adulto de confianza */}
      <div className="space-y-3">
        <h3 className="text-center dark:text-white">¿Con quién querés hablar?</h3>
        {trustedAdults.map((adult) => (
          <Card 
            key={adult.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedAdult?.id === adult.id ? 'ring-2 ring-purple-400' : ''
            } ${adult.color}`}
            onClick={() => setSelectedAdult(adult)}
          >
            <div className="flex items-center space-x-3">
              <div className="text-gray-700 dark:text-gray-300">{adult.icon}</div>
              <div className="flex-1">
                <h4 className="dark:text-white">{adult.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{adult.role}</p>
              </div>
              <Badge variant="outline" className="text-xs dark:border-gray-500 dark:text-gray-300">
                {adult.availability}
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {selectedAdult && (
        <div className="space-y-4">
          {/* Nivel de urgencia */}
          <div>
            <h4 className="mb-2 dark:text-white">¿Qué tan urgente es?</h4>
            <div className="space-y-2">
              {urgencyLevels.map((level) => (
                <Button
                  key={level.value}
                  variant={urgency === level.value ? "default" : "outline"}
                  size="sm"
                  className={`w-full justify-start ${
                    urgency === level.value ? level.color : ''
                  }`}
                  onClick={() => setUrgency(level.value)}
                >
                  {level.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Mensaje */}
          <div>
            <h4 className="mb-2 dark:text-white">Escribí tu mensaje</h4>
            <Textarea
              placeholder="Contale a tu adulto de confianza cómo te sentís o qué necesitás..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          {/* Botón enviar */}
          <Button 
            onClick={sendMessage}
            disabled={!message.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Enviar mensaje a {selectedAdult.name}</span>
          </Button>
        </div>
      )}

      <Card className="p-4 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
        <div className="text-center space-y-2">
          <div className="text-2xl">🤝</div>
          <h3 className="text-blue-800 dark:text-blue-200">Tu privacidad es importante</h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Todos los mensajes son privados y confidenciales. Solo la persona que elijas 
            recibirá tu mensaje.
          </p>
        </div>
      </Card>
    </div>
  );
}