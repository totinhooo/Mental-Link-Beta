const extraEmotionFlows: Record<string, any> = {
  motivation: {
    keywords: ['motiv', 'motiva', 'motivacion', 'no tengo ganas'],
    initial: {
      text: '�Quer�s pasos peque�os o fijar una meta?',
      options: [
        { id: 'motivation_small', label: 'Pasos peque�os', action: 'motivation_small' },
        { id: 'motivation_goal', label: 'Fijar una meta', action: 'motivation_goal' }
      ]
    },
    responses: {
      motivation_small: { text: 'Eleg� una tarea de 5 minutos y empez�.' },
      motivation_goal: { text: 'Perfecto. �Cu�l ser�a una meta alcanzable en 1 semana?', followUp: true }
    }
  },
  study: {
    keywords: ['estud', 'estudiar', 'examen', 'preparar examen', 'estoy estudiando'],
    initial: {
      text: '�Armar plan o t�cnicas de foco?',
      options: [
        { id: 'study_plan', label: 'Armar plan', action: 'study_plan' },
        { id: 'study_focus', label: 'T�cnicas de foco', action: 'study_focus' }
      ]
    },
    responses: {
      study_plan: { text: 'Ok  pon� un bloque de 25 minutos y concentrate en un tema.' },
      study_focus: { text: 'Prob� la t�cnica Pomodoro: 25m estudio / 5m descanso. �Quer�s que arme un plan r�pido?', followUp: true }
    }
  },
  vent: {
    keywords: ['desahog', 'desahogarme', 'contar', 'necesito hablar', 'me siento mal'],
    initial: {
      text: 'Si quer�s desahogarte, estoy ac� para escucharte sin juzgar. �Quer�s empezar cont�ndome brevemente lo que pas� o prefer�s t�cnicas para calmarte primero?',
      options: [
        { id: 'vent_tell', label: 'Contarte lo que pas�', action: 'vent_tell' },
        { id: 'vent_calm', label: 'T�cnicas para calmarme', action: 'vent_calm' }
      ]
    },
    responses: {
      vent_tell: { text: 'Estoy escuchando. Contame en tus palabras lo que pas�.', followUp: true },
      vent_calm: { text: 'T�cnica breve: 5 respiraciones profundas (inhal� 4s, reten� 2s, exhal� 6s). �Quer�s que te gu�e?' }
    }
  },
  stress: {
    keywords: ['estresado', 'estresada', 'estres', 'ansiedad', 'agobiado', 'agobiada'],
    initial: {
      text: 'El estr�s puede sentirse abrumador. �Quer�s pr�cticas r�pidas para bajar el estr�s o hablar de lo que lo causa?',
      options: [
        { id: 'stress_quick', label: 'Pr�cticas r�pidas', action: 'stress_quick' },
        { id: 'stress_talk', label: 'Hablar de la causa', action: 'stress_talk' }
      ]
    },
    responses: {
      stress_quick: { text: 'Pr�ctica r�pida: 3-3-6 respiraciones profundas por 2 minutos, y 30s de estiramiento de cuello.' },
      stress_talk: { text: 'Contame qu� te est� generando estr�s; podemos explorar pasos peque�os para reducir la carga.', followUp: true }
    }
  },
  sexuality: {
    keywords: ['sexualidad', 'sexo', 'orientaci�n', 'identidad sexual', 'preguntas sobre sexo', 'siento atracci�n'],
    initial: {
      text: 'Puedo hablar sobre sexualidad, orientaci�n e identidad de forma respetuosa y segura. �Qu� te gustar�a preguntar o compartir?',
      options: [
        { id: 'sex_info', label: 'Informaci�n general', action: 'sex_info' },
        { id: 'sex_support', label: 'Apoyo emocional', action: 'sex_support' }
      ]
    },
    responses: {
      sex_info: { text: 'Si ten�s preguntas espec�ficas, pregunt�melas; puedo ofrecer recursos confiables y lenguaje respetuoso.' },
      sex_support: { text: 'Si esto te genera angustia, contame m�s para poder apoyarte o sugerirte recursos locales.', followUp: true }
    }
  },
  depression: {
    keywords: ['depresion', 'deprimido', 'deprimida', 'no quiero levantarme', 'sin ganas de vivir', 'triste todo el tiempo'],
    initial: {
      text: 'Siento que est�s pasando un momento dif�cil. Si est�s en riesgo o pens�s hacerte da�o, busc� ayuda inmediata. �Quer�s hablar de c�mo te sent�s ahora o prefieres recursos y pasos pr�cticos?',
      options: [
        { id: 'depress_talk', label: 'Hablar de c�mo me siento', action: 'depress_talk' },
        { id: 'depress_help', label: 'Recursos y pasos pr�cticos', action: 'depress_help' }
      ]
    },
    responses: {
      depress_talk: { text: 'Gracias por confiarme esto. Contame, �desde cu�ndo sent�s as�? (si prefer�s, escrib� brevemente)', followUp: true },
      depress_help: { text: 'Pasos pr�cticos: hablar con alguien de confianza, consultar a un profesional de salud mental, peque�as rutinas diarias (luz, movimiento, horarios). �Quer�s que te sugiera recursos locales o l�neas de ayuda?' }
    }
  }
};

export default extraEmotionFlows;
