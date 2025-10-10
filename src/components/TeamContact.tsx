import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Instagram, Mail, MapPin, School, Users, Heart } from 'lucide-react';

export function TeamContact() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-700">
        <div className="text-center space-y-3">
          <Users className="w-8 h-8 mx-auto text-green-600 dark:text-green-400" />
          <h1 className="text-lg text-green-700 dark:text-green-300">
            Contacta con nuestro equipo
          </h1>
          <p className="text-sm text-green-600 dark:text-green-200">
            Somos estudiantes comprometidos con el bienestar emocional. ¡Queremos escucharte!
          </p>
        </div>
      </Card>

      {/* Información del equipo */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 mb-4">
            <School className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg text-gray-800 dark:text-gray-200">
              Quiénes somos
            </h2>
          </div>
          
          <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <p>
              Somos un grupo de estudiantes de la <strong>E.S.E.T.P N.º 724 "Presidente Dr. Humberto Illia"</strong> 
              de Trelew, Chubut, Argentina.
            </p>
            <p>
              Nuestro proyecto nace de la pasión por la tecnología y el compromiso social. Creemos que 
              la innovación puede ser una herramienta poderosa para mejorar la salud mental de nuestra comunidad.
            </p>
            <p>
              Mental Link es más que una aplicación: es nuestro aporte para crear un mundo donde 
              todos puedan expresar sus emociones y encontrar apoyo cuando lo necesiten.
            </p>
          </div>

          <div className="flex items-center space-x-2 pt-3">
            <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Trelew, Chubut - Argentina 🇦🇷
            </span>
          </div>
        </div>
      </Card>

      {/* Formas de contacto */}
      <div className="space-y-4">
        <h3 className="text-lg text-gray-800 dark:text-gray-200 text-center">
          ¿Cómo puedes contactarnos?
        </h3>

        {/* Instagram */}
        <Card className="p-5">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-gray-800 dark:text-gray-200 mb-1">
                Instagram oficial
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Síguenos para ver actualizaciones, tips de bienestar y conocer más sobre nuestro proyecto
              </p>
              <Button
                onClick={() => window.open('https://www.instagram.com/mentallink._?igsh=MTV5eGY2ZGNiaTJxeg%3D%3D&utm_source=qr', '_blank')}
                variant="outline"
                size="sm"
                className="w-full border-pink-200 text-pink-600 hover:bg-pink-50 dark:border-pink-700 dark:text-pink-400 dark:hover:bg-pink-900/20"
              >
                @mentallink._
              </Button>
            </div>
          </div>
        </Card>

        {/* Email */}
        <Card className="p-5">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-gray-800 dark:text-gray-200 mb-1">
                Correo electrónico
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Para consultas, sugerencias o si quieres colaborar con nuestro proyecto
              </p>
              <Button
                onClick={() => window.open('mailto:mentallink.team@gmail.com?subject=Contacto desde Mental Link App', '_blank')}
                variant="outline"
                size="sm"
                className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-900/20"
              >
                mentallink.team@gmail.com
              </Button>
            </div>
          </div>
        </Card>

        {/* Colegio */}
        <Card className="p-5">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <School className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm text-gray-800 dark:text-gray-200 mb-1">
                Nuestra institución
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                E.S.E.T.P N.º 724 "Presidente Dr. Humberto Illia"
              </p>
              <div className="flex items-center space-x-2">
                <MapPin className="w-3 h-3 text-green-600 dark:text-green-400" />
                <span className="text-xs text-green-600 dark:text-green-400">
                  Trelew, Chubut, Argentina
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Mensaje especial */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-700">
        <div className="text-center space-y-3">
          <Heart className="w-8 h-8 mx-auto text-purple-600 dark:text-purple-400" />
          <h3 className="text-lg text-purple-700 dark:text-purple-300">
            Nuestro compromiso contigo
          </h3>
          <div className="space-y-2 text-sm text-purple-600 dark:text-purple-200">
            <p>
              Sabemos que hablar de salud mental requiere confianza y respeto. 
              Por eso, nos comprometemos a:
            </p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-center space-x-2">
                <span>🤝</span>
                <span>Escuchar sin juzgar</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>🔒</span>
                <span>Respetar tu privacidad</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>💙</span>
                <span>Ofrecer apoyo genuino</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>🌱</span>
                <span>Crecer juntos</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Información de colaboración */}
      <Card className="p-5 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
        <div className="space-y-3">
          <h3 className="text-sm text-blue-700 dark:text-blue-300 text-center">
            ¿Quieres colaborar con Mental Link?
          </h3>
          <div className="text-xs text-blue-600 dark:text-blue-200 space-y-2">
            <p>
              Si eres profesional de la salud mental, educador, o simplemente alguien que quiere 
              aportar al proyecto, ¡nos encantaría conocerte!
            </p>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="text-center">
                <span className="block text-lg mb-1">👩‍⚕️</span>
                <span className="text-xs">Profesionales de salud</span>
              </div>
              <div className="text-center">
                <span className="block text-lg mb-1">👩‍🏫</span>
                <span className="text-xs">Educadores</span>
              </div>
              <div className="text-center">
                <span className="block text-lg mb-1">💻</span>
                <span className="text-xs">Desarrolladores</span>
              </div>
              <div className="text-center">
                <span className="block text-lg mb-1">🎨</span>
                <span className="text-xs">Diseñadores</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Footer con valores */}
      <div className="text-center py-4">
        <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <span className="block text-2xl mb-1">🌟</span>
            <span className="text-xs">Innovación</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl mb-1">🤝</span>
            <span className="text-xs">Colaboración</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl mb-1">💜</span>
            <span className="text-xs">Empatía</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
          Hecho con 💙 por estudiantes de Trelew para el mundo
        </p>
      </div>
    </div>
  );
}