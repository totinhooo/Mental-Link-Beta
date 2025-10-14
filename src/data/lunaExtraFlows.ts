import t from '../i18n';

const extraEmotionFlows: Record<string, any> = {
  motivation: {
    keywords: [t('chatbot.flows.motivation.keyword1'), t('chatbot.flows.motivation.keyword2'), t('chatbot.flows.motivation.keyword3'), t('chatbot.flows.motivation.keyword4')],
    initial: {
      text: t('chatbot.flows.motivation.initial.text'),
      options: [
        { id: 'motivation_small', label: t('chatbot.flows.motivation.initial.option1'), action: 'motivation_small' },
        { id: 'motivation_goal', label: t('chatbot.flows.motivation.initial.option2'), action: 'motivation_goal' }
      ]
    },
    responses: {
      motivation_small: { text: t('chatbot.flows.motivation.responses.small') },
      motivation_goal: { text: t('chatbot.flows.motivation.responses.goal'), followUp: true }
    }
  },
  study: {
    keywords: [t('chatbot.flows.study.keyword1'), t('chatbot.flows.study.keyword2'), t('chatbot.flows.study.keyword3'), t('chatbot.flows.study.keyword4'), t('chatbot.flows.study.keyword5')],
    initial: {
      text: t('chatbot.flows.study.initial.text'),
      options: [
        { id: 'study_plan', label: t('chatbot.flows.study.initial.option1'), action: 'study_plan' },
        { id: 'study_focus', label: t('chatbot.flows.study.initial.option2'), action: 'study_focus' }
      ]
    },
    responses: {
      study_plan: { text: t('chatbot.flows.study.responses.plan') },
      study_focus: { text: t('chatbot.flows.study.responses.focus'), followUp: true }
    }
  },
  vent: {
    keywords: [t('chatbot.flows.vent.keyword1'), t('chatbot.flows.vent.keyword2'), t('chatbot.flows.vent.keyword3'), t('chatbot.flows.vent.keyword4'), t('chatbot.flows.vent.keyword5')],
    initial: {
      text: t('chatbot.flows.vent.initial.text'),
      options: [
        { id: 'vent_tell', label: t('chatbot.flows.vent.initial.option1'), action: 'vent_tell' },
        { id: 'vent_calm', label: t('chatbot.flows.vent.initial.option2'), action: 'vent_calm' }
      ]
    },
    responses: {
      vent_tell: { text: t('chatbot.flows.vent.responses.tell'), followUp: true },
      vent_calm: { text: t('chatbot.flows.vent.responses.calm') }
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
