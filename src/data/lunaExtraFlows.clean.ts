// Clean extra flows for Luna chatbot
const extraEmotionFlows: Record<string, any> = {
  sample_help: {
    keywords: ['ayuda', 'necesito ayuda', 'auxilio'],
    initial: {
      text: 'Veo que necesitás ayuda. ¿Querés opciones rápidas o prefieres hablar?',
      options: [
        { id: 'sample_quick', label: 'Opciones rápidas', action: 'sample_quick' },
        { id: 'sample_talk', label: 'Hablar', action: 'sample_talk' }
      ]
    },
    responses: {
      sample_quick: { text: 'Opciones: contactar a un adulto, línea de ayuda o técnicas breves de grounding.' },
      sample_talk: { text: 'Estoy acá para escucharte. Contame qué está pasando.' }
    }
  },
  motivation: {
    keywords: ['motiv', 'motiva', 'motivacion', 'no tengo ganas', 'me falta ganas'],
    initial: {
      text: 'La motivación puede fallar. ¿Querés pasos pequeños, fijar una meta o ejercicios para ánimo?',
      options: [
        { id: 'motivation_small', label: 'Pasos pequeños', action: 'motivation_small' },
        { id: 'motivation_goal', label: 'Fijar meta', action: 'motivation_goal' }
      ]
    },
    responses: {
      motivation_small: { text: 'Elegí una tarea de 5–10 minutos y poné un temporizador. ¿Cuál podrías intentar ahora?' },
      motivation_goal: { text: 'Escribí una meta concreta para esta semana: ejemplo "repasar 3 temas". ¿Querés que la afine juntos?' }
    }
  },
  exercise: {
    keywords: ['ejercicio', 'actividad física', 'entrenar', 'deporte'],
    initial: {
      text: 'Mover el cuerpo ayuda. ¿Preferís una rutina rápida o un plan semanal?',
      options: [
        { id: 'exercise_quick', label: 'Rutina rápida', action: 'exercise_quick' },
        { id: 'exercise_plan', label: 'Plan semanal', action: 'exercise_plan' }
      ]
    },
    responses: {
      exercise_quick: { text: 'Rutina 5–10 min: jumping jacks 30s, sentadillas 30s, plancha 30s. Repetí 2 veces.' },
      exercise_plan: { text: 'Plan simple: 3 días a la semana, 30 min. ¿Querés que arme uno contigo?' }
    }
  },
  study: {
    keywords: ['estudi', 'estudiar', 'examen', 'prueba', 'me distraigo'],
    initial: {
      text: '¿Te cuesta concentrarte o prefieres armar un plan de estudio?',
      options: [
        { id: 'study_plan', label: 'Armar plan', action: 'study_plan' },
        { id: 'study_focus', label: 'Técnicas de foco', action: 'study_focus' }
      ]
    },
    responses: {
      study_plan: { text: 'Podemos usar Pomodoro: 25min trabajo / 5min descanso. ¿Querés crear un bloque ahora?' },
      study_focus: { text: 'Quita distracciones, define 1 objetivo por sesión y usa un temporizador.' }
    }
  },
  vent: {
    keywords: ['desahogo', 'desahogarme', 'necesito hablar', 'quiero contar'],
    initial: { text: 'Si querés desahogarte, te escucho sin juzgar. ¿Querés empezar a contar?', options: [{ id: 'vent_tell', label: 'Contar', action: 'vent_tell' }] },
    responses: { vent_tell: { text: 'Estoy escuchando. Contame lo que necesites.' } }
  }
};

export default extraEmotionFlows;
