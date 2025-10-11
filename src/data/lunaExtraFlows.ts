const extraEmotionFlows: Record<string, any> = {
  motivation: {
    keywords: ['motiv', 'motiva', 'motivación', 'no tengo ganas'],
    initial: {
      text: '¿Querés pasos pequeños o fijar una meta?',
      options: [
        { id: 'motivation_small', label: 'Pasos pequeños', action: 'motivation_small' },
        { id: 'motivation_goal', label: 'Fijar una meta', action: 'motivation_goal' }
      ]
    },
    responses: {
      motivation_small: { text: 'Elegí una tarea de 5 minutos y empezá.' },
      motivation_goal: { text: 'Perfecto. ¿Cuál sería una meta alcanzable en 1 semana?', followUp: true }
    }
  },
  study: {
    keywords: ['estud', 'estudiar', 'examen', 'preparar examen', 'estoy estudiando'],
    initial: {
      text: '¿Armar plan o técnicas de foco?',
      options: [
        { id: 'study_plan', label: 'Armar plan', action: 'study_plan' },
        { id: 'study_focus', label: 'Técnicas de foco', action: 'study_focus' }
      ]
    },
    responses: {
      study_plan: { text: 'Ok — pone un bloque de 25 minutos y concentrate en un tema.' },
      study_focus: { text: 'Probá la técnica Pomodoro: 25m estudio / 5m descanso. ¿Querés que arme un plan rápido?', followUp: true }
    }
  },
  vent: {
    keywords: ['desahog', 'desahogarme', 'contar', 'necesito hablar', 'me siento mal'],
    initial: {
      text: 'Si querés desahogarte, estoy acá para escucharte sin juzgar. ¿Querés empezar contándome brevemente lo que pasó o preferís técnicas para calmarte primero?',
      options: [
        { id: 'vent_tell', label: 'Contarte lo que pasó', action: 'vent_tell' },
        { id: 'vent_calm', label: 'Técnicas para calmarme', action: 'vent_calm' }
      ]
    },
    responses: {
      vent_tell: { text: 'Estoy escuchando. Contame en tus palabras lo que pasó.', followUp: true },
      vent_calm: { text: 'Técnica breve: 5 respiraciones profundas (inhalá 4s, retené 2s, exhalá 6s). ¿Querés que te guíe?' }
    }
  },
  stress: {
    keywords: ['estresado', 'estresada', 'estrés', 'ansiedad', 'agobiado', 'agobiada'],
    initial: {
      text: 'El estrés puede sentirse abrumador. ¿Querés prácticas rápidas para bajar el estrés o hablar de lo que lo causa?',
      options: [
        { id: 'stress_quick', label: 'Prácticas rápidas', action: 'stress_quick' },
        { id: 'stress_talk', label: 'Hablar de la causa', action: 'stress_talk' }
      ]
    },
    responses: {
      stress_quick: { text: 'Práctica rápida: 3-3-6 respiraciones profundas por 2 minutos, y 30s de estiramiento de cuello.' },
      stress_talk: { text: 'Contame qué te está generando estrés; podemos explorar pasos pequeños para reducir la carga.', followUp: true }
    }
  },
  sexuality: {
    keywords: ['sexualidad', 'sexo', 'orientación', 'identidad sexual', 'preguntas sobre sexo', 'siento atracción'],
    initial: {
      text: 'Puedo hablar sobre sexualidad, orientación e identidad de forma respetuosa y segura. ¿Qué te gustaría preguntar o compartir?',
      options: [
        { id: 'sex_info', label: 'Información general', action: 'sex_info' },
        { id: 'sex_support', label: 'Apoyo emocional', action: 'sex_support' }
      ]
    },
    responses: {
      sex_info: { text: 'Si tenés preguntas específicas, preguntámelas; puedo ofrecer recursos confiables y lenguaje respetuoso.' },
      sex_support: { text: 'Si esto te genera angustia, contame más para poder apoyarte o sugerirte recursos locales.', followUp: true }
    }
  },
  depression: {
    keywords: ['depresion', 'deprimido', 'deprimida', 'no quiero levantarme', 'sin ganas de vivir', 'triste todo el tiempo'],
    initial: {
      text: 'Siento que estás pasando un momento difícil. Si estás en riesgo o pensás hacerte daño, buscá ayuda inmediata. ¿Querés hablar de cómo te sentís ahora o prefieres recursos y pasos prácticos?',
      options: [
        { id: 'depress_talk', label: 'Hablar de cómo me siento', action: 'depress_talk' },
        { id: 'depress_help', label: 'Recursos y pasos prácticos', action: 'depress_help' }
      ]
    },
    responses: {
      depress_talk: { text: 'Gracias por confiarme esto. Contame, ¿desde cuándo sentís así? (si preferís, escribilo brevemente)', followUp: true },
      depress_help: { text: 'Pasos prácticos: hablar con alguien de confianza, consultar a un profesional de salud mental, pequeñas rutinas diarias (luz, movimiento, horarios). ¿Querés que te sugiera recursos locales o líneas de ayuda?' }
    }
  }
};

export default extraEmotionFlows;
