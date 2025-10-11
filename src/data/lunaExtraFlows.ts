// Plantilla para añadir flujos/preguntas/respuestas extra para el chatbot "Luna".
// Exporta un objeto con la misma estructura que `emotionFlows` en SupportChatbot.
// Ejemplo de uso:
// export default {
//   customEmotion: {
//     keywords: ['palabra1', 'palabra2'],
//     initial: { text: 'Texto inicial...', options: [{ id: 'opt1', label: 'Opción 1', action: 'opt1' }] },
//     responses: { opt1: { text: 'Respuesta al elegir opt1' } }
//   }
// }

const extraEmotionFlows: Record<string, any> = {
  // Ejemplo agregado: flujo simple de prueba
  sample_help: {
    keywords: ['ayuda', 'necesito ayuda ahora', 'auxilio'],
    initial: {
      text: 'Veo que necesitás ayuda. ¿Querés que te ofrezca opciones rápidas o hablar con calma?',
      options: [
        { id: 'sample_quick', label: 'Opciones rápidas', action: 'sample_quick' },
        { id: 'sample_talk', label: 'Hablar con calma', action: 'sample_talk' }
      ]
    },
    responses: {
      sample_quick: { text: 'Te paso opciones rápidas: llamar a un adulto, una línea de ayuda, o técnicas breves de grounding.' },
      sample_talk: { text: 'Hablemos con calma. Contame brevemente qué te está pasando.' }
    }
  }
  ,
  motivation: {
    keywords: ['motivado', 'motivada', 'motivación', 'no tengo ganas', 'me falta ganas', 'quiero motivación', 'necesito motivación', 'desanimado', 'desanimada'],
    initial: {
      text: 'La motivación a veces falla y es normal. ¿Qué te gustaría ahora?',
      options: [
        { id: 'motivation_small', label: 'Pequeños pasos para empezar', action: 'motivation_small' },
        { id: 'motivation_goal', label: 'Ayuda para fijar metas', action: 'motivation_goal' },
        { id: 'motivation_mood', label: 'Ejercicios para recuperar ánimo', action: 'motivation_mood' }
      ]
    },
    responses: {
      motivation_small: {
        text: "Empieza con pasos muy pequeños: 1) Elige una tarea de 5–10 minutos. 2) Establece un temporizador. 3) Cuando terminás, premiate con algo pequeño.\n\n¿Qué tarea breve podrías intentar ahora?"
      },
      motivation_goal: {
        text: "Vamos a definir una meta clara y alcanzable:\n1) ¿Qué querés lograr en una semana?\n2) ¿Qué harás hoy para acercarte a eso?\n3) ¿Cuánto tiempo dedicarás?\n\nSi querés, lo armamos juntos paso a paso."
      },
      motivation_mood: {
        text: "Pequeñas rutinas que ayudan a recuperar energía:\n• Movimiento suave: 10 minutos de caminata\n• Hidratarte y comer algo nutritivo\n• Hacer una lista de 3 logros pequeños de hoy\n• Limitar la exposición a pantallas 30 min antes de dormir\n\n¿Quieres que elija una sugerencia para ahora?"
      }
    }
  },
  exercise: {
    keywords: ['ejercicio', 'hacer ejercicio', 'actividad física', 'entrenar', 'ejercitarme', 'deporte', 'correr', 'gimnasio'],
    initial: {
      text: 'Mover el cuerpo puede mejorar mucho el estado de ánimo. ¿Qué preferís?',
      options: [
        { id: 'exercise_quick', label: 'Rutina rápida (5-10 min)', action: 'exercise_quick' },
        { id: 'exercise_plan', label: 'Plan semanal de ejercicio', action: 'exercise_plan' },
        { id: 'exercise_motiv', label: 'Cómo mantener la motivación', action: 'exercise_motiv' }
      ]
    },
    responses: {
      exercise_quick: {
        text: 'Rutina rápida para activar: 1) 30s jumping jacks, 2) 30s sentadillas, 3) 30s plancha, 4) 30s zancadas. Repetí 2 veces y respirá profundamente al terminar.'
      },
      exercise_plan: {
        text: 'Plan simple: 3 días de movimiento a la semana (30 min). Día 1: cardio ligero; Día 2: fuerza (peso corporal); Día 3: movilidad/estiramiento. ¿Querés que arme uno con tus preferencias?'
      },
      exercise_motiv: {
        text: 'Para mantenerlo: agenda entrenamientos como citas, busca un compañero/a, mide pequeños progresos y celebra cada logro. ¿Querés que te mande recordatorios (en forma de sugerencias)?'
      }
    }
  },
  study: {
    keywords: ['estudio', 'estudiar', 'examen', 'exámenes', 'prueba', 'prepararme', 'no puedo estudiar', 'me distraigo'],
    initial: {
      text: 'Estudiar puede ser abrumador. ¿Qué parte te cuesta más?',
      options: [
        { id: 'study_plan', label: 'Armar un plan de estudio', action: 'study_plan' },
        { id: 'study_focus', label: 'Técnicas para concentrarme', action: 'study_focus' },
        { id: 'study_anxiety', label: 'Manejo del nerviosismo por exámenes', action: 'study_anxiety' }
      ]
    },
    responses: {
      study_plan: {
        text: 'Armar un plan: 1) Lista de temas pendientes, 2) Prioriza por fecha y dificultad, 3) Divide en bloques de 25 min (Pomodoro), 4) Revisión final 1 día antes. ¿Querés que armemos tu primer bloque ahora?'
      },
      study_focus: {
        text: 'Técnicas para concentrarte:\n• Pomodoro (25/5)\n• Eliminar distracciones: teléfono en modo avión\n• Establecer objetivos claros por sesión\n• Usar la técnica de enseñanza (explicar en voz alta lo que aprendiste)\n\n¿Probás una sesión de 25 minutos ahora?'
      },
      study_anxiety: {
        text: 'Antes del examen: repasá con tests cortos, dormí bien la noche anterior, prepara lo que vas a llevar el día anterior, y hace 3 respiraciones profundas antes de empezar.\n\nSi querés, te doy un checklist para el día del examen.'
      }
    }
  },
  vent: {
    keywords: ['desahogo', 'desahogarme', 'necesito hablar', 'quiero contar', 'estoy mal', 'me desahogo'],
    initial: {
      text: 'Este es un espacio seguro para desahogarte. ¿Querés contarlo todo o prefieres que te haga preguntas guiadas?',
      options: [
        { id: 'vent_all', label: 'Contarlo todo', action: 'vent_all' },
        { id: 'vent_guided', label: 'Preguntas guiadas', action: 'vent_guided' }
      ]
    },
    responses: {
      vent_all: {
        text: 'Hablá libremente. Estoy aquí para escucharte sin juzgar. Podés empezar por lo que más te pesa en este momento.'
      },
      vent_guided: {
        text: 'Te voy a preguntar cosas que pueden ayudar a ordenar los pensamientos:\n1) ¿Qué pasó?\n2) ¿Cómo te hizo sentir?\n3) ¿Qué necesitás ahora mismo?\n\nResponde a tu ritmo, yo te acompaño.'
      }
    }
  },
  stress: {
    keywords: ['estres', 'estrés', 'estresado', 'estresada', 'agobiado', 'agobiada', 'sobrecarga', 'quemado', 'burnout'],
    initial: {
      text: 'El estrés puede pesar mucho. ¿Querés técnicas rápidas para bajar la activación o que trabajemos en una estrategia a largo plazo?',
      options: [
        { id: 'stress_quick', label: 'Técnicas rápidas', action: 'stress_quick' },
        { id: 'stress_plan', label: 'Estrategia a mediano plazo', action: 'stress_plan' }
      ]
    },
    responses: {
      stress_quick: {
        text: 'Técnica rápida: 1) Respirá 4-4-4 (inhala 4, mantén 4, exhala 4) por 1 minuto. 2) Pausa y apoya los pies en el suelo. 3) Estira cuello y hombros.\n\n¿Sentís algo de alivio?' 
      },
      stress_plan: {
        text: 'Estrategia: 1) Identificá las fuentes principales de estrés. 2) Delegá o reducí tareas cuando sea posible. 3) Agenda tiempos de descanso regulares. 4) Practica sueño consistente y ejercicio.\n\nSi querés, lo desgloso en pasos semanales.'
      }
    }
  },
  sexuality: {
    keywords: ['sexualidad', 'sexo', 'orientación', 'orientación sexual', 'pregunta sexual', 'sexual', 'sexo seguro', 'identidad de género', 'orientación LGBT', 'curiosidad sexual'],
    initial: {
      text: 'Puedo escuchar tus dudas sobre sexualidad con respeto y sin juzgar. ¿Qué te gustaría saber o compartir?',
      options: [
        { id: 'sex_info', label: 'Información y recursos', action: 'sex_info' },
        { id: 'sex_consult', label: 'Dudas personales/confidenciales', action: 'sex_consult' },
        { id: 'sex_safety', label: 'Sexo seguro y consentimiento', action: 'sex_safety' }
      ]
    },
    responses: {
      sex_info: {
        text: 'Sexualidad incluye orientación, identidad y prácticas. Si tenés una pregunta concreta (por ejemplo sobre orientación o cómo hablar con alguien), contámela y te doy información basada en evidencia y recursos confiables.'
      },
      sex_consult: {
        text: 'Si es algo íntimo, podés compartir lo que te sientas cómodo/a. Si hay riesgo (coerción, abuso, falta de consentimiento), por favor considerá contactar a un adulto o línea de ayuda local. ¿Querés que te comparta recursos según tu país?'
      },
      sex_safety: {
        text: 'Sexo seguro y consentimiento:\n• Consentimiento claro y entusiasta es fundamental.\n• Usar protección (preservativo) reduce riesgos de ITS.\n• Si hubo situación de coerción o abuso, busco recursos de ayuda y líneas de emergencia.\n\n¿Querés información práctica o recursos locales?'
      }
    }
  },
  depression: {
    keywords: ['depres', 'deprimid', 'no quiero', 'sin ganas', 'siento culpa', 'sin sentido', 'suicid', 'no puedo más', 'tristeza intensa', 'anhedonia'],
    initial: {
      text: 'Lamento que te sientas así. La depresión es real y tratable. ¿Qué te gustaría ahora?',
      options: [
        { id: 'depress_talk', label: 'Hablar de cómo te sentís', action: 'depress_talk' },
        { id: 'depress_small_steps', label: 'Pequeños pasos para hoy', action: 'depress_small_steps' },
        { id: 'depress_help', label: 'Conectar con ayuda profesional', action: 'depress_help' }
      ]
    },
    responses: {
      depress_talk: {
        text: 'Contame lo que estás sintiendo. No sos una carga por compartirlo. Puedo acompañarte y darte pequeñas estrategias para hoy.'
      },
      depress_small_steps: {
        text: 'Pequeños pasos que suelen ayudar:\n• Levantate y vestite (incluso si no salís)\n• Come algo pequeño y nutritivo\n• Sal afuera 5-10 minutos\n• Contactá a una persona que te haga sentir cuidado/a\n\n¿Cuál de estos podrías intentar ahora?'
      },
      depress_help: {
        text: 'Si estás pensando en hacerte daño o en que esto sea una emergencia, por favor contacta ahora a una línea de crisis o a un servicio de emergencia. Si querés, te doy números locales o pasos para pedir ayuda.',
        options: [
          { id: 'depress_crisis', label: 'Sí, dame líneas de crisis', action: 'depress_crisis' },
          { id: 'depress_trusted', label: 'Contactar a un adulto de confianza', action: 'depress_trusted' }
        ]
      },
      depress_crisis: {
        text: 'Líneas útiles:\n• Emergencias locales (ej. 911)\n• Línea de Prevención del Suicidio (según país)\n• Centros de Salud Mental locales.\n\nSi estás en riesgo inmediato, llama ahora. Si querés, puedo ayudarte a escribir un mensaje que le envíes a alguien de confianza.'
      },
      depress_trusted: {
        text: 'Si querés que contacte a un adulto o te ayude a preparar un mensaje, explícame qué datos del contacto querés usar o escribamos el mensaje juntos.',
        requiresUserData: true,
        requiresConsent: true
      }
    }
  }
};

export default extraEmotionFlows;
