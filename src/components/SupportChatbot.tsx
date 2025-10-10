import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar } from './ui/avatar';
import { Send } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  options?: MessageOption[];
}

interface MessageOption {
  id: string;
  label: string;
  action: string;
}

interface ConversationContext {
  emotion?: 'breakup' | 'frustration' | 'anxiety' | 'sadness' | 'tiredness' | null;
  stage?: string;
  anxietyIntensity?: 'initial' | 'not_working' | 'resistant' | 'crisis';
  needsProfessionalHelp?: boolean;
}

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  emergencyContactRelation: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
}

const quickResponses = [
  "🆘 Necesito ayuda ahora",
  "😰 Me siento ansioso/a",
  "😔 Estoy triste hoy",
  "💭 Quiero desahogarme",
  "💪 Necesito motivación",
  "😌 Quiero relajarme"
];

// Palabras clave que indican que las técnicas no están funcionando
const notWorkingKeywords = ['no funciona', 'no me funciona', 'no está funcionando', 'sigo igual', 'sigo ansioso', 'sigo ansiosa', 'no ayuda', 'no sirve', 'peor', 'nada funciona', 'todo es inútil', 'es inútil'];

// Palabras clave que indican necesidad de ayuda profesional
const professionalHelpKeywords = ['necesito más ayuda', 'necesito ayuda profesional', 'quiero hablar con alguien', 'nada me ayuda', 'todo falla', 'no puedo más'];

// Palabras clave PRIORITARIAS para rupturas amorosas
const breakupKeywords = ['me dejó', 'me dejo', 'terminamos', 'rompimos', 'ruptura', 'separación', 'mi novia', 'mi novio', 'mi pareja', 'mi ex', 'enamorado', 'enamorada', 'infidelidad', 'engañó', 'engaño', 'traición', 'ya no me quiere', 'me fue infiel', 'acabamos', 'corte', 'termino', 'terminó'];

// FLUJOS DE CONVERSACIÓN POR EMOCIÓN
const emotionFlows = {
  frustration: {
    keywords: ['frustrado', 'frustrada', 'frustración', 'desaprobé', 'desaprobe', 'reprobo', 'reprobé', 'suspendi', 'suspendí', 'mal resultado', 'mala nota', 'me fue mal', 'enojado', 'enojada', 'molesto', 'molesta'],
    initial: {
      text: "Entiendo que debe ser frustrante esforzarte y no obtener los resultados esperados. Es normal sentirse así. ¿Te gustaría:",
      options: [
        { id: 'frustration_advice', label: 'a) Recibir consejos para manejar esta frustración', action: 'frustration_advice' },
        { id: 'frustration_strategies', label: 'b) Estrategias para mejorar next time', action: 'frustration_strategies' },
        { id: 'frustration_vent', label: 'c) Solo desahogarme un poco más', action: 'frustration_vent' },
        { id: 'frustration_adult', label: 'd) Hablar con un adulto de confianza', action: 'frustration_adult' }
      ]
    },
    responses: {
      frustration_advice: {
        text: "Te sugiero:\n• Respira profundamente 3 veces antes de reaccionar\n• Recuerda que un resultado no define tu capacidad\n• Divide el problema en partes más pequeñas\n• Habla con tu profesor sobre qué puedes mejorar\n• Premia tu esfuerzo, no solo el resultado\n\n¿Qué sientes que fue la causa de esto?"
      },
      frustration_strategies: {
        text: "Para próximas evaluaciones:\n• Crea un calendario de estudio realista\n• Practica con ejercicios similares al examen\n• Enseña el tema a alguien más (afianza tu aprendizaje)\n• Estudia en intervalos de 25-30 min con descansos\n• Identifica exactamente qué temas se te dificultan\n\n¿Te gustaría ayuda para armar un plan de estudio?"
      },
      frustration_vent: {
        text: "Este es tu espacio seguro 💙\n\nPodés contarme todo lo que necesites. A veces simplemente expresar lo que sentimos ya nos alivia un poco.\n\nTe escucho sin juzgar."
      },
      frustration_adult: {
        text: "Es una excelente decisión buscar apoyo de un adulto de confianza. Hablar con alguien que te conoce puede darte una perspectiva diferente y el apoyo que necesitás.\n\nPodés revisar tu lista de contactos de confianza en la sección 'Conexiones' de la app. 🤝"
      }
    }
  },
  anxiety: {
    keywords: ['ansioso', 'ansiosa', 'ansiedad', 'estres', 'estrés', 'nervioso', 'nerviosa', 'preocupado', 'preocupada', 'miedo', 'panico', 'pánico', 'agobiado', 'agobiada', 'abrumado', 'abrumada'],
    initial: {
      text: "Siento que estés experimentando ansiedad. Tu cuerpo te está alertando. ¿Quieres probar:",
      options: [
        { id: 'anxiety_breathing', label: 'a) Un ejercicio de respiración', action: 'anxiety_breathing' },
        { id: 'anxiety_thoughts', label: 'b) Técnica para calmar pensamientos', action: 'anxiety_thoughts' },
        { id: 'anxiety_identify', label: 'c) Identificar qué específicamente me preocupa', action: 'anxiety_identify' }
      ]
    },
    responses: {
      anxiety_breathing: {
        text: "Vamos a respirar juntos:\n\n🌬️ Inhala por 4 segundos\n⏸️ Mantén 7 segundos\n💨 Exhala por 8 segundos\n\nRepite 3 veces\n\n¿Cómo te sientes después?",
        followUp: true
      },
      anxiety_thoughts: {
        text: "Usemos la técnica 5-4-3-2-1:\n\nNombra:\n👁️ 5 cosas que ves alrededor\n🤚 4 cosas que puedes tocar\n👂 3 sonidos que escuchas\n👃 2 aromas que percibes\n👅 1 sabor en tu boca\n\nEsta técnica te ayuda a conectarte con el presente.\n\n¿Notas alguna diferencia?"
      },
      anxiety_identify: {
        text: "Identificar qué nos preocupa es el primer paso para manejarlo.\n\nContame: ¿qué es lo que específicamente te está generando ansiedad? Podemos trabajar juntos para ver cómo abordarlo.\n\nRecordá: nombrar lo que sentimos nos da poder sobre ello. 💪"
      },
      // NUEVAS RESPUESTAS CUANDO LA RESPIRACIÓN NO FUNCIONA
      anxiety_not_working: {
        text: "Entiendo que a veces los ejercicios de respiración pueden no ser suficientes cuando la ansiedad es muy intensa. Eso es completamente normal. ¿Qué tal si probamos otras aproximaciones?",
        options: [
          { id: 'anxiety_physical_anchor', label: 'a) Técnica de anclaje físico más intensa', action: 'anxiety_physical_anchor' },
          { id: 'anxiety_cognitive_distraction', label: 'b) Distracción cognitiva guiada', action: 'anxiety_cognitive_distraction' },
          { id: 'anxiety_physical_expression', label: 'c) Expresión física de la ansiedad', action: 'anxiety_physical_expression' },
          { id: 'anxiety_escalation', label: 'd) Escalación a apoyo humano', action: 'anxiety_escalation' }
        ]
      },
      anxiety_physical_anchor: {
        text: "Vamos a enfocarnos en sensaciones físicas fuertes:\n\n❄️ Toma un cubo de hielo y sostenlo por 30 segundos\n💧 Salpícate agua fría en la cara y muñecas\n🍋 Come algo con sabor muy intenso (limón, jengibre)\n✊ Aprieta fuerte una pelota antiestrés o tus puños\n\n¿Alguna de estas te llama la atención para probar?"
      },
      anxiety_cognitive_distraction: {
        text: "Cuando la mente no se calma, a veces necesitamos 'engañarla' con tareas cognitivas. Elige una opción:",
        options: [
          { id: 'distraction_categories', label: '🗂️ Categorías mentales', action: 'distraction_categories' },
          { id: 'distraction_math', label: '🔢 Matemática simple', action: 'distraction_math' },
          { id: 'distraction_description', label: '🔍 Descripción detallada', action: 'distraction_description' }
        ]
      },
      distraction_categories: {
        text: "Nombra:\n\n🌎 5 países que empiecen con 'C'\n🐋 4 animales marinos\n⚽ 3 deportes olímpicos\n🍕 2 ingredientes de una pizza\n🎬 1 película que te haga reír\n\nTómate tu tiempo. No hay apuro."
      },
      distraction_math: {
        text: "Vamos a hacer cálculos fáciles (puedes hacerlos mentalmente o escribirlos):\n\n• 17 + 24 = ?\n• 50 - 28 = ?\n• 6 × 7 = ?\n• 81 ÷ 9 = ?\n\n¿Te ayudó a distraer un poco la mente?"
      },
      distraction_description: {
        text: "Describe un objeto cercano con todo detalle:\n\n🎨 Color, textura, forma, tamaño\n🔧 Para qué sirve\n📦 De qué material está hecho\n⚖️ Cuánto pesa aproximadamente\n\nTómate unos minutos para observarlo detenidamente."
      },
      anxiety_physical_expression: {
        text: "A veces la ansiedad necesita salir físicamente. Si estás en un espacio privado, prueba:",
        options: [
          { id: 'physical_release', label: '💪 Ejercicios de liberación', action: 'physical_release' },
          { id: 'creative_expression', label: '🎨 Expresión creativa', action: 'creative_expression' }
        ]
      },
      physical_release: {
        text: "Ejercicios de liberación física:\n\n🤲 Sacude tus manos y brazos vigorosamente por 1 minuto\n🦘 Salta en el lugar 20 veces\n😤 Grita en una almohada\n💃 Baila una canción moviendo todo el cuerpo\n🏃 Corre en el lugar por 2 minutos\n\nElegí el que te parezca más cómodo y probalo."
      },
      creative_expression: {
        text: "Expresión creativa para liberar ansiedad:\n\n✏️ Dibuja garabatos agresivos en un papel\n📝 Escribe todo lo que sientes y luego rompe el papel\n🧶 Moldea plastilina o arcilla apretando fuerte\n\nNo necesita ser bonito, solo necesita SALIR."
      },
      anxiety_escalation: {
        text: "Veo que la ansiedad está siendo muy intensa y que las técnicas no están siendo efectivas. En estos casos, es importante contar con apoyo humano real. ¿Te gustaría:",
        options: [
          { id: 'contact_adult', label: '👤 Contactar adulto de confianza inmediatamente', action: 'contact_adult' },
          { id: 'crisis_line', label: '📞 Línea de crisis profesional', action: 'crisis_line' },
          { id: 'companion_until_pass', label: '🤝 Acompañamiento hasta que pase', action: 'companion_until_pass' }
        ]
      },
      contact_adult: {
        text: "", // Se llenará dinámicamente con datos del usuario
        requiresUserData: true
      },
      crisis_line: {
        text: "Te comparto números de apoyo profesional gratuito:\n\n📞 Línea 144 (Atención a víctimas de violencia)\n📞 Línea de la Esperanza: 0800-345-1435\n📞 Centro de Asistencia al Suicida: (011) 5275-1135\n\nEstos servicios están disponibles las 24 horas y son completamente confidenciales.\n\nPor favor, llama ahora mismo si:\n• Tienes pensamientos de hacerte daño\n• Sientes que no puedes mantenerte seguro/a\n• La desesperación es abrumadora\n\nNo estás solo/a. Hay personas entrenadas para ayudarte."
      },
      companion_until_pass: {
        text: "Mientras decides, puedo quedarme aquí acompañándote.\n\nLa ansiedad SIEMPRE pasa, aunque ahora no lo parezca. Es como una ola: sube, alcanza su pico, y luego baja.\n\n¿Quieres que hablemos de algo específico para distraernos, o prefieres que simplemente esté aquí contigo?"
      },
      // MANEJO DE RESISTENCIA
      anxiety_resistant: {
        text: "Escucho tu frustración y es comprensible. Cuando estamos en un estado emocional intenso, nuestro cerebro no responde como normalmente.\n\nNo es que TÚ no funciones, es que la ANSIEDAD está ocupando demasiado espacio.\n\n¿Podemos intentar algo diferente? En lugar de 'combatir' la ansiedad, ¿qué tal si simplemente la observamos sin juzgar?",
        options: [
          { id: 'anxiety_observe', label: '🌊 Observar la ansiedad como una ola', action: 'anxiety_observe' },
          { id: 'anxiety_safety_plan', label: '🛡️ Crear un compromiso de seguridad', action: 'anxiety_safety_plan' },
          { id: 'professional_help_options', label: '🏥 Necesito ayuda profesional', action: 'professional_help_options' }
        ]
      },
      anxiety_observe: {
        text: "Técnica de Observación Curiosa:\n\nImagina que la ansiedad es una ola en el mar. No podemos detenerla, pero podemos aprender a surfearla.\n\nSolo observa sin juzgar:\n• ¿Dónde la sientes en tu cuerpo?\n• ¿Tiene color, forma, temperatura?\n• ¿Viene en picos o es constante?\n\nSin intentar cambiarla, solo observando como un científico curioso.\n\n¿Qué notas?"
      },
      anxiety_safety_plan: {
        text: "¿Puedes hacerme una promesa?\n\nProméteme que:\n✓ No harás nada que pueda lastimarte\n✓ Contactarás a alguien si la ansiedad empeora\n✓ Recordarás que esto PASARÁ, aunque ahora no lo creas\n\nEstaré aquí contigo. No necesitas hacer o decir nada. Solo recuerda que no estás solo/a en esto."
      },
      // OPCIONES DE AYUDA PROFESIONAL
      professional_help_options: {
        text: "Veo que has probado varias estrategias y sigues necesitando apoyo. Es importante que hables con un profesional de salud mental. Te ayudo a conectar con alguien:",
        options: [
          { id: 'notify_trusted_adult', label: '👤 Contactar adulto de confianza registrado', action: 'notify_trusted_adult' },
          { id: 'request_professional_appointment', label: '📅 Solicitar turno con profesional', action: 'request_professional_appointment' },
          { id: 'immediate_emergency_contact', label: '🚨 Contacto inmediato - Emergencia', action: 'immediate_emergency_contact' },
          { id: 'safety_plan_immediate', label: '🛡️ Plan de seguridad inmediato', action: 'safety_plan_immediate' }
        ]
      },
      notify_trusted_adult: {
        text: "", // Se llenará dinámicamente
        requiresUserData: true,
        requiresConsent: true
      },
      request_professional_appointment: {
        text: "", // Se llenará dinámicamente
        requiresUserData: true,
        requiresConsent: true
      },
      immediate_emergency_contact: {
        text: "Si sientes que esto es una EMERGENCIA, aquí tienes contacto directo:\n\n🚨 LÍNEAS DE EMERGENCIA:\n\n📞 Emergencias: 911\n📞 Línea Nacional de Prevención del Suicidio: 135 (Atención gratuita 24/7)\n📞 Centro de Asistencia al Suicida: (011) 5275-1135\n💬 Chat Online: www.lineadevida.org\n\nPor favor, llama AHORA MISMO si:\n• Tienes pensamientos de hacerte daño\n• Sientes que no puedes mantenerte seguro/a\n• La desesperación es abrumadora\n\n⚠️ No estás solo/a. Hay personas entrenadas para ayudarte en este momento."
      },
      safety_plan_immediate: {
        text: "Mientras esperas contacto profesional, preparemos tu plan de seguridad:\n\n📋 PLAN DE SEGURIDAD EN 3 PASOS:\n\n1️⃣ CONTACTOS DE EMERGENCIA\n¿Tienes estos números guardados en tu teléfono?\n• 911 - Emergencias\n• 135 - Línea de Prevención\n• Tu adulto de confianza\n\n2️⃣ ESPACIOS SEGUROS\n¿Dónde podrías ir si necesitas calmarte?\n• Casa de familiar\n• Patio de la escuela\n• Biblioteca\n• Otro lugar que te calme\n\n3️⃣ PERSONAS CERCANAS\n¿Quién está físicamente cerca ahora a quien podrías acudir?\n\nRecuerda: Pedir ayuda es un acto de valentía. 💪"
      }
    }
  },
  // NUEVO: Ruptura amorosa específica - DEBE IR ANTES de sadness para tener prioridad
  breakup: {
    keywords: breakupKeywords,
    initial: {
      text: "Lamento profundamente que estés pasando por esta ruptura. El dolor de una separación amorosa es muy real y duele mucho. Es completamente normal sentirse devastado en estos momentos.\n\n¿En qué aspecto necesitas más apoyo hoy?",
      options: [
        { id: 'breakup_vent', label: 'a) 💔 Desahogar el dolor', action: 'breakup_vent' },
        { id: 'breakup_healing', label: 'b) 🔄 Estrategias para sanar', action: 'breakup_healing' },
        { id: 'breakup_identity', label: 'c) 📝 Reconstruir mi identidad', action: 'breakup_identity' },
        { id: 'breakup_support', label: 'd) 👥 Apoyo humano', action: 'breakup_support' },
        { id: 'breakup_plan', label: 'e) 🎯 Plan de superación', action: 'breakup_plan' }
      ]
    },
    responses: {
      breakup_vent: {
        text: "Cuéntame todo lo que necesites expresar. Estoy aquí para escucharte sin juzgar.\n\n💙 Algunas cosas que podrías querer compartir:\n\n• ¿Qué es lo que más duele de esta situación?\n• ¿Cómo fue la conversación cuando terminaron?\n• ¿Hay algo que te gustaría haber dicho?\n• ¿Qué es lo que más extrañas?\n\nNo hay respuestas correctas o incorrectas. Solo sentimientos válidos. Te escucho. 💜"
      },
      breakup_healing: {
        text: "Te ayudo con técnicas para estos primeros días difíciles:\n\n💔 PARA EL DOLOR AGUDO:\n• Permite que las lágrimas fluyan - es parte de la sanación\n• No revises sus redes sociales (bloquéalo temporalmente si es necesario)\n• Guarda los objetos que te recuerden a esa persona\n\n🧠 PARA PENSAMIENTOS REPETITIVOS:\n• Establece un 'horario de duelo' - 15 min al día para pensar en la ruptura\n• Cuando venga el pensamiento fuera de ese horario, escríbelo y déjalo para después\n• Actividad física intensa ayuda a interrumpir el ciclo mental\n\n😴 RUTINA DE AUTOCUIDADO:\n• Mantén horarios de sueño regulares\n• Come aunque no tengas ganas\n• Evita alcohol o sustancias\n• Sal al aire libre 20 minutos diarios\n\n¿Por cuál de estas técnicas quieres empezar?"
      },
      breakup_identity: {
        text: "Después de una relación, es normal sentirse perdido/a. Vamos a redescubrirte:\n\n🌟 RECONEXIÓN CONTIGO:\n• ¿Qué actividades disfrutabas antes de la relación que dejaste?\n• ¿Qué planes tenías para vos que quedaron en pausa?\n• ¿Qué aspectos de tu personalidad no podías expresar en la relación?\n\n🎯 METAS PERSONALES:\nEscribí 3 cosas que SIEMPRE quisiste hacer:\n1. Algo pequeño (esta semana)\n2. Algo mediano (este mes)\n3. Algo grande (este año)\n\n💪 FORTALEZA PERSONAL:\nCompletá: 'Soy capaz de...'\nCompletá: 'Me siento orgulloso/a de...'\nCompletá: 'Quiero ser una persona que...'\n\nNo necesitás a esa persona para ser completo/a. Ya lo sos. 💚"
      },
      breakup_support: {
        text: "En momentos de ruptura, es cuando más necesitamos nuestra red de apoyo.",
        options: [
          { id: 'notify_trusted_adult', label: '👤 Contactar adulto de confianza', action: 'notify_trusted_adult' },
          { id: 'breakup_friends', label: '👥 Hablar con amigos', action: 'breakup_friends' },
          { id: 'breakup_professional', label: '🏥 Considerar ayuda profesional', action: 'breakup_professional' }
        ]
      },
      breakup_friends: {
        text: "Los amigos son fundamentales en una ruptura:\n\n👥 CONSEJOS PARA APOYARTE EN AMIGOS:\n• Contales cómo te sentís honestamente\n• Pediles que te distraigan cuando necesites\n• Dejá que te acompañen sin presionar\n• No tengas vergüenza de llorar con ellos\n\n⚠️ COSAS A EVITAR:\n• Hablar MAL de tu ex constantemente (está bien al principio, pero no eternamente)\n• Stalkear juntos sus redes sociales\n• Compararte con su nueva relación si la hay\n\n💡 IDEAS:\n• Planificá salidas nuevas (cine, caminatas, etc.)\n• Retomá hobbies en grupo\n• Conocé gente nueva en contextos sociales\n\nTus amigos quieren ayudarte. Déjalos. 🤝"
      },
      breakup_professional: {
        text: "A veces una ruptura puede dejar heridas más profundas que requieren apoyo profesional.\n\n🏥 CONSIDERA TERAPIA SI:\n• La tristeza persiste más de 2 meses intensamente\n• Afecta tu rendimiento académico o laboral\n• Tienes pensamientos de hacerte daño\n• No puedes dormir o comer regularmente\n• Sientes que no puedes funcionar normalmente\n\nUn psicólogo puede ayudarte a:\n✓ Procesar el duelo de manera saludable\n✓ Identificar patrones en tus relaciones\n✓ Trabajar tu autoestima\n✓ Desarrollar habilidades de afrontamiento\n\n¿Te gustaría información sobre cómo acceder a ayuda profesional?"
      },
      breakup_plan: {
        text: "Plan de superación paso a paso:\n\n📅 SEMANA 1-2: SUPERVIVENCIA\n• Permitite sentir el dolor\n• Mantén rutinas básicas (comer, dormir)\n• Contacto mínimo o nulo con tu ex\n• Apoyo de amigos/familia diario\n\n📅 SEMANA 3-4: PROCESAMIENTO\n• Escribe una carta que nunca enviarás\n• Haz lista de cosas que NO funcionaban en la relación\n• Retoma 1 actividad que disfrutabas\n• Ejercicio físico 3 veces/semana\n\n📅 MES 2-3: RECONSTRUCCIÓN\n• Establece 1 meta personal nueva\n• Conoce gente nueva (sin presión romántica)\n• Reflexiona sobre qué aprendiste\n• Celebra pequeños progresos\n\n📅 MES 4+: CRECIMIENTO\n• Evalúa qué quieres en futuras relaciones\n• Fortalece tu identidad individual\n• Perdónate y perdona (no significa olvidar)\n• Abre tu corazón gradualmente\n\nRecuerda: No hay un tiempo 'correcto'. Avanzá a tu ritmo. 💚\n\n¿En qué fase sientes que estás?"
      }
    }
  },
  sadness: {
    keywords: ['triste', 'tristeza', 'deprimido', 'deprimida', 'llorar', 'lloro', 'vacio', 'vacío', 'sin energia', 'sin energía', 'desmotivado', 'desmotivada', 'mal', 'terrible', 'desanimado', 'desanimada', 'bajoneado', 'bajoneada'],
    initial: {
      text: "Lamento que estés pasando por esto. Las emociones difíciles son parte de ser humano. ¿Te gustaría:",
      options: [
        { id: 'sadness_uplift', label: 'a) Algunas ideas para levantar el ánimo', action: 'sadness_uplift' },
        { id: 'sadness_talk', label: 'b) Hablar de lo que específicamente me entristece', action: 'sadness_talk' },
        { id: 'sadness_space', label: 'c) Un espacio seguro para desahogarme', action: 'sadness_space' },
        { id: 'sadness_relational', label: 'd) Es por una relación o amistad', action: 'sadness_relational' }
      ]
    },
    responses: {
      sadness_uplift: {
        text: "Pequeñas acciones que pueden ayudar:\n🎵 Escucha tu música favorita\n📝 Escribe 3 cosas por las que estás agradecido hoy\n🚶 Da un paseo breve aunque no tengas ganas\n💛 Haz algo amable por alguien más\n💪 Recuerda un momento donde superaste algo difícil\n\nNo tenés que hacer todo. Elegí solo una cosa que te parezca posible hoy."
      },
      sadness_talk: {
        text: "Estoy aquí para escucharte 💜\n\nHablar de lo que nos entristece puede ayudarnos a procesarlo mejor. No hay juicios aquí, solo apoyo.\n\nContame: ¿qué es lo que te tiene así?"
      },
      sadness_space: {
        text: "Este es tu espacio seguro 🌈\n\nPodés expresar todo lo que sentís. Llorar está bien. Sentirse triste está bien. Son emociones válidas.\n\nEstá bien no estar bien a veces.\n\nSi necesitás hablar, aquí estoy. Si solo necesitás que alguien esté presente, también estoy aquí. 💙"
      },
      // NUEVO: TRISTEZA RELACIONAL
      sadness_relational: {
        text: "Lamento mucho que estés pasando por esto. El dolor por las relaciones o amistades duele profundamente. Es completamente normal sentirse así cuando alguien importante en nuestra vida se va o la relación cambia.\n\nEn estos momentos difíciles, ¿qué tipo de apoyo necesitas más?",
        options: [
          { id: 'relational_validation', label: 'a) Validación y espacio para desahogarme', action: 'relational_validation' },
          { id: 'relational_strategies', label: 'b) Estrategias para manejar el dolor emocional', action: 'relational_strategies' },
          { id: 'relational_rebuild', label: 'c) Consejos para reconstruir mi bienestar', action: 'relational_rebuild' },
          { id: 'relational_support', label: 'd) Conexión con apoyo humano', action: 'relational_support' }
        ]
      },
      relational_validation: {
        text: "Cuéntame más. Estoy aquí para escucharte sin juzgar.\n\n💙 Frases importantes para recordar:\n\n• El duelo por una relación es real, aunque otros no lo vean\n• Es natural extrañar a alguien que fue importante en tu vida\n• No estás exagerando - estas pérdidas duelen profundamente\n• Tomó valor compartir esto conmigo\n\nSi querés, podés contarme:\n• ¿Qué es lo que más extrañas de esa persona/relación?\n• ¿Hay algo que te gustaría haber dicho y no pudiste?\n• ¿Cómo te está afectando esto en tu día a día?\n\nTus sentimientos son válidos y importantes. 💜"
      },
      relational_strategies: {
        text: "El dolor emocional duele físicamente también. Te sugiero:\n\n💔 PARA EL DOLOR AGUDO:\n• Permítete llorar si lo necesitas - las lágrimas liberan estrés\n• Escribe una carta que nunca enviarás - expresa todo lo que sientes\n• Crea un ritual de despedida simbólico (soltar un globo, quemar una carta)\n\n🧠 PARA LOS PENSAMIENTOS REPETITIVOS:\n• Establece 'tiempos de preocupación' - solo piensas en esto 15 min al día\n• Cuando venga el recuerdo, di 'gracias mente, pero ahora elijo enfocarme en...'\n• Interrumpe pensamientos con actividad física (10 saltos, estiramientos)\n\n👥 PARA LA SOLEDAD:\n• Haz lista de otras personas que sí están presentes en tu vida\n• Planifica una actividad pequeña con un amigo/familiar esta semana\n• Únete a un grupo donde puedas conocer gente nueva gradualmente\n\n¿Alguna de estas te resuena para probar?"
      },
      relational_rebuild: {
        text: "Poco a poco puedes reconstruir tu vida. Empecemos con cosas pequeñas:\n\n🌱 RECONEXIÓN CONTIGO MISMO:\n• ¿Qué actividades disfrutabas antes de esta relación que podrías retomar?\n• Haz una lista de tus cualidades positivas que siguen siendo tuyas\n• Establece una meta personal pequeña para esta semana\n\n💆 RUTINA DE AUTOCUIDADO:\n• Baño caliente con música tranquila\n• Preparar tu comida favorita\n• Salir a caminar 15 minutos diarios\n• Escribir 3 cosas buenas del día antes de dormir\n\n🔄 REENCUADRE COGNITIVO:\n• ¿Qué aprendiste de esta relación?\n• ¿Qué cualidades quieres en futuras relaciones?\n• ¿Cómo te hizo crecer esta experiencia, aunque duela ahora?\n\nRecuerda: el tiempo no cura todo, pero sí suaviza los bordes afilados del dolor. 💚"
      },
      relational_support: {
        text: "Estos momentos son cuando más necesitamos a nuestra red de apoyo.",
        options: [
          { id: 'notify_trusted_adult', label: '👤 Contactar adulto de confianza', action: 'notify_trusted_adult' },
          { id: 'peer_support', label: '👥 Buscar apoyo grupal', action: 'peer_support' }
        ]
      },
      peer_support: {
        text: "Muchas escuelas tienen grupos de apoyo entre pares para estos temas.\n\nHablar con otras personas que están pasando o pasaron por situaciones similares puede ayudarte a sentirte menos solo/a y darte nuevas perspectivas.\n\n¿Te gustaría que te ayude a buscar información sobre grupos de apoyo disponibles en tu escuela?\n\nMientras tanto, recordá:\n• No compares tu proceso de sanación con el de otros\n• Algunos días serán mejores que otros - eso es normal\n• Mereces amor y conexión, incluso cuando duele\n\nEstaré aquí para acompañarte en este proceso cuando me necesites. 💙"
      }
    }
  },
  tiredness: {
    keywords: ['cansado', 'cansada', 'agotado', 'agotada', 'exhausto', 'exhausta', 'sin energía', 'sin energia', 'fatigado', 'fatigada', 'rendido', 'rendida'],
    initial: {
      text: "El cansancio puede ser señal de que necesitas un descanso. ¿Qué tal si probamos:",
      options: [
        { id: 'tiredness_break', label: 'a) Un break consciente', action: 'tiredness_break' },
        { id: 'tiredness_sleep', label: 'b) Revisar tu rutina de sueño', action: 'tiredness_sleep' },
        { id: 'tiredness_academic', label: 'c) Estrategias para manejar carga académica', action: 'tiredness_academic' }
      ]
    },
    responses: {
      tiredness_break: {
        text: "Tómate 5 minutos para:\n🧘 Estirar suavemente brazos y piernas\n💧 Beber un vaso de agua\n🪟 Mirar por la ventana y observar sin juzgar\n🌬️ Respirar profundamente 3 veces\n💭 Decirte 'merezco descansar'\n\nEl descanso no es pereza, es autocuidado necesario."
      },
      tiredness_sleep: {
        text: "El sueño es fundamental para tu bienestar:\n\n🕐 Intenta dormir 8-9 horas por noche\n📱 Evita pantallas 1 hora antes de dormir\n⏰ Mantén horarios regulares (incluso fines de semana)\n🛏️ Tu habitación: fresca, oscura y silenciosa\n☕ Evita cafeína después de las 4 PM\n\n¿Cómo ha sido tu sueño últimamente?"
      },
      tiredness_academic: {
        text: "Manejar la carga académica sin agotarte:\n\n📅 Prioriza: ¿qué es urgente vs importante?\n⏱️ Técnica Pomodoro: 25 min trabajo + 5 min descanso\n🎯 Una tarea a la vez (no multitasking)\n🙅 Aprende a decir 'no' a lo que no es prioritario\n🤝 Pide ayuda cuando la necesites\n\n¿Hay alguna materia específica que te esté demandando más?"
      }
    }
  }
};

// Respuestas rápidas contextuales
const quickResponsesContextual = {
  "🆘 Necesito ayuda ahora": "Estoy aquí para vos 💙\n\nRecordá que no estás solo/a.\n\n¿Podés contarme qué está pasando?\n\nSi es una emergencia, contactá a tu adulto de confianza o la línea 144.",
  "😰 Me siento ansioso/a": "La ansiedad puede ser muy abrumadora 🌸\n\nProbemos juntos una t��cnica:\nInhalá por 4, mantené 7, exhalá por 8.\n\n¿Qué situación específica te está generando ansiedad?",
  "😔 Estoy triste hoy": "Lamento que estés pasando por un momento difícil 💜\n\nEs completamente normal sentirse triste.\n\nEstá bien permitirte sentir.\n\n¿Querés contarme qué te tiene así?",
  "💭 Quiero desahogarme": "Este es tu espacio seguro 💙\n\nPodés contarme lo que sea, sin juicios.\n\nTe escucho con toda mi atención.\n\n¿Qué es lo que te está pesando?",
  "💪 Necesito motivación": "¡Me encanta que busques motivación! 🌟\n\nEso ya muestra tu fortaleza.\n\nHas superado el 100% de tus días difíciles hasta ahora.\n\n¿En qué área específica necesitás ese empujón extra?",
  "😌 Quiero relajarme": "Excelente idea cuidar tu bienestar 🌸\n\nCerrá los ojos, respirá profundo.\n\nImaginá un lugar donde te sientas completamente en paz.\n\n¿Qué lugar elegirías?"
};

// Función mejorada para detectar emoción en el mensaje
const detectEmotion = (message: string): 'breakup' | 'frustration' | 'anxiety' | 'sadness' | 'tiredness' | null => {
  const lowerMessage = message.toLowerCase();
  
  // PRIORIDAD 1: Detectar ruptura amorosa PRIMERO (más específico)
  if (breakupKeywords.some(keyword => lowerMessage.includes(keyword))) {
    return 'breakup';
  }
  
  // PRIORIDAD 2: Otras emociones específicas
  const emotionPriority = ['frustration', 'anxiety', 'tiredness', 'sadness'];
  
  for (const emotion of emotionPriority) {
    const flow = emotionFlows[emotion as keyof typeof emotionFlows];
    if (flow && flow.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return emotion as 'frustration' | 'anxiety' | 'sadness' | 'tiredness';
    }
  }
  
  return null;
};

// Función para detectar si el usuario indica que algo no funciona
const detectNotWorking = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return notWorkingKeywords.some(keyword => lowerMessage.includes(keyword));
};

// Respuestas generales
const getGeneralResponse = (): string => {
  const responses = [
    "Te escucho y estoy aquí para apoyarte 💙\n\nTus sentimientos son válidos.\n\nEs valiente de tu parte compartirlos.\n\n¿Podés contarme un poco más sobre cómo te sentís?",
    "Gracias por confiar en mí ✨\n\nRecordá que no estás solo/a.\n\nCada problema tiene una solución.\n\n¿Hay algo específico que te está preocupando hoy?",
    "Me alegra que hayas venido a hablar 🌟\n\nExpresar lo que sentimos es el primer paso.\n\n¿Qué es lo que más te gustaría que mejore en tu día a día?",
    "Entiendo que puedas estar pasando por un momento difícil 🤗\n\nSos más resiliente de lo que creés.\n\n¿Hay alguna situación particular que te esté afectando?",
    "Me parece genial que busques apoyo 💪\n\nEso muestra que te importa tu bienestar.\n\n¿Cómo ha sido tu día hasta ahora?",
    "Estoy aquí para lo que necesites 🌙\n\nNo hay nada demasiado pequeño o grande para conversar.\n\n¿Qué tenés en mente?"
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

export function SupportChatbot() {
  // Obtener datos del usuario
  const getUserData = (): UserData | null => {
    try {
      const userData = localStorage.getItem('mental-link-user');
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error getting user data:', error);
    }
    return null;
  };

  // Obtener nombre del usuario si está registrado
  const getUserName = () => {
    const userData = getUserData();
    return userData?.firstName || '';
  };

  const userName = getUserName();
  const welcomeMessage = userName 
    ? `¡Hola ${userName}! 🌙 Soy Luna, tu compañera de apoyo emocional. Me alegra verte de nuevo. ¿Cómo te sentís hoy?`
    : "¡Hola! 🌙 Soy Luna, tu compañera de apoyo emocional. Estoy aquí para escucharte y ayudarte. ¿Cómo te sentís hoy?";

  // Cargar mensajes guardados o inicializar con mensaje de bienvenida
  const loadMessages = (): Message[] => {
    try {
      const savedMessages = localStorage.getItem('mental-link-chat-history');
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        // Convertir timestamps de string a Date
        return parsed.map((msg: Message) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
    
    return [{
      id: 1,
      text: welcomeMessage,
      isBot: true,
      timestamp: new Date()
    }];
  };

  const [messages, setMessages] = useState<Message[]>(loadMessages());
  const [inputText, setInputText] = useState('');
  const [conversationContext, setConversationContext] = useState<ConversationContext>({});

  // Guardar mensajes cuando cambien
  useEffect(() => {
    try {
      localStorage.setItem('mental-link-chat-history', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, [messages]);

  // Función para generar respuesta de contacto con adulto
  const generateTrustedAdultResponse = (userData: UserData): string => {
    return `Perfecto. Veo que tienes registrado a ${userData.emergencyContactName} (${userData.emergencyContactRelation}) como tu contacto de confianza.\n\n📱 Teléfono: ${userData.emergencyContactPhone}\n\n¿Quieres que te ayude a preparar qué decirle? O puedes llamarle directamente.\n\nRecuerda: Pedir ayuda es un acto de valentía. 💪`;
  };

  // Función para generar solicitud de turno profesional
  const generateProfessionalAppointmentRequest = (userData: UserData): string => {
    const today = new Date().toLocaleDateString('es-AR');
    return `Aunque estamos en fase beta, puedo ayudarte a iniciar el proceso para obtener atención profesional.\n\n📋 SOLICITUD DE TURNO - APOYO PSICOLÓGICO\n\nEstudiante: ${userData.firstName} ${userData.lastName}\nFecha de solicitud: ${today}\nMotivo principal: Necesidad de apoyo emocional\nContacto: ${userData.email}\n\nAl confirmar, esta solicitud llegará al departamento de bienestar estudiantil. Te contactarán en un plazo máximo de 48 horas para coordinar tu primera sesión.\n\nConsultar con un psicólogo es como ir al médico cuando tienes fiebre: es cuidado preventivo de tu salud mental. Todos necesitamos apoyo profesional en algún momento. 🌱\n\n¿Deseas confirmar el envío de esta solicitud?`;
  };

  // Función para confirmar notificación a adulto
  const handleNotifyTrustedAdult = (userData: UserData) => {
    toast.success(`Se ha preparado el contacto con ${userData.emergencyContactName}. Por favor comunícate con esta persona lo antes posible.`, {
      duration: 5000,
    });
    
    return `✅ Contacto preparado exitosamente.\n\nSi prefieres, puedes llamar directamente a ${userData.emergencyContactName} al ${userData.emergencyContactPhone}.\n\n¿Hay algo específico que te gustaría compartir con esta persona? Puedo ayudarte a organizar tus pensamientos.`;
  };

  // Función para confirmar solicitud de turno
  const handleConfirmAppointmentRequest = (userData: UserData) => {
    toast.success('Solicitud de turno enviada exitosamente. Recibirás respuesta en las próximas 48 horas.', {
      duration: 5000,
    });
    
    return `✅ Solicitud enviada correctamente.\n\nTu solicitud de atención psicológica ha sido registrada. El equipo de bienestar estudiantil se pondrá en contacto contigo a través de ${userData.email} en las próximas 48 horas.\n\nMientras esperas:\n• Mantén comunicación con personas de confianza\n• Practica técnicas de autocuidado\n• Si la situación empeora, contacta líneas de emergencia\n\nRecuerda: este es un paso importante en tu bienestar. 💚`;
  };

  const sendMessage = (text: string, isOptionResponse: boolean = false, actionId?: string) => {
    const timestamp = Date.now();
    const userMessage: Message = {
      id: timestamp,
      text,
      isBot: false,
      timestamp: new Date()
    };

    let botResponse: string = '';
    let botOptions: MessageOption[] | undefined;

    // Si es una respuesta a una opción
    if (isOptionResponse && actionId) {
      const userData = getUserData();
      
      // Manejar respuestas que requieren datos del usuario
      if (actionId === 'notify_trusted_adult') {
        if (userData && userData.emergencyContactName) {
          botResponse = generateTrustedAdultResponse(userData);
          botOptions = [
            { id: 'confirm_notify_adult', label: '✅ Sí, preparar contacto', action: 'confirm_notify_adult' },
            { id: 'cancel_notify', label: '❌ Cancelar', action: 'general_support' }
          ];
        } else {
          botResponse = "Para contactar a un adulto de confianza, primero necesitas registrar uno en la app.\n\nPuedes hacerlo desde la sección 'Configuración' → 'Gestión de Cuenta'.\n\nMientras tanto, ¿hay algo más en lo que pueda ayudarte?";
        }
      } else if (actionId === 'confirm_notify_adult') {
        if (userData) {
          botResponse = handleNotifyTrustedAdult(userData);
        }
      } else if (actionId === 'request_professional_appointment') {
        if (userData && userData.firstName) {
          botResponse = generateProfessionalAppointmentRequest(userData);
          botOptions = [
            { id: 'confirm_appointment', label: '✅ Sí, enviar solicitud', action: 'confirm_appointment' },
            { id: 'cancel_appointment', label: '❌ Cancelar', action: 'general_support' }
          ];
        } else {
          botResponse = "Para solicitar un turno profesional, necesitas estar registrado en la app.\n\nPuedes registrarte desde la pantalla de inicio.\n\n¿Hay algo más en lo que pueda ayudarte mientras tanto?";
        }
      } else if (actionId === 'confirm_appointment') {
        if (userData) {
          botResponse = handleConfirmAppointmentRequest(userData);
        }
      } else if (actionId === 'contact_adult') {
        if (userData && userData.emergencyContactName) {
          botResponse = `Contactar a un adulto de confianza es una decisión valiente y correcta.\n\nTienes registrado a:\n👤 ${userData.emergencyContactName} (${userData.emergencyContactRelation})\n📱 ${userData.emergencyContactPhone}\n\nPuedes llamarle directamente ahora, o si prefieres, puedo ayudarte a preparar qué decirle.\n\nRecuerda que pedir ayuda es un acto de fortaleza. 💪`;
        } else {
          botResponse = "Para contactar a un adulto de confianza, primero necesitas registrar uno.\n\nPuedes hacerlo en 'Configuración' → 'Gestión de Cuenta'.\n\nMientras tanto, estoy aquí para ti. ¿Quieres explorar otras opciones de apoyo?";
        }
      }
      // Para breakup (ruptura amorosa), buscar en respuestas específicas
      else if (conversationContext.emotion === 'breakup') {
        const flow = emotionFlows.breakup;
        const response = flow.responses[actionId as keyof typeof flow.responses];
        
        if (response) {
          botResponse = response.text;
          botOptions = response.options;
          
          // Si hay opciones, mantener el contexto
          if (!botOptions) {
            // Agregar cierre conversacional
            setTimeout(() => {
              const closingMessage: Message = {
                id: Date.now(),
                text: "Recuerda que la sanación toma tiempo. No hay un cronograma 'correcto'. Estoy aquí para ti cuando me necesites. ¿Hay algo más en lo que pueda apoyarte hoy?",
                isBot: true,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, closingMessage]);
            }, 1000);
            setConversationContext({});
          }
        }
      }
      // Para ansiedad, buscar en las respuestas expandidas
      else if (conversationContext.emotion === 'anxiety') {
        const flow = emotionFlows.anxiety;
        const response = flow.responses[actionId as keyof typeof flow.responses];
        
        if (response) {
          if (response.requiresUserData) {
            if (actionId === 'contact_adult' && userData && userData.emergencyContactName) {
              botResponse = `Contactar a un adulto de confianza es una decisión valiente y correcta.\n\nTienes registrado a:\n👤 ${userData.emergencyContactName} (${userData.emergencyContactRelation})\n📱 ${userData.emergencyContactPhone}\n\nPuedes llamarle directamente ahora.\n\nRecuerda que pedir ayuda es un acto de fortaleza. 💪`;
            }
          } else {
            botResponse = response.text;
            botOptions = response.options;
          }
          
          // Si hay opciones, mantener el contexto
          if (!botOptions && !response.requiresUserData) {
            // Agregar cierre conversacional
            setTimeout(() => {
              const closingMessage: Message = {
                id: Date.now(),
                text: "Recuerda que estoy aquí para ti cuando me necesites. Cuidar de tu bienestar emocional es un acto de amor propio. ¿Hay algo más en lo que pueda apoyarte hoy?",
                isBot: true,
                timestamp: new Date()
              };
              setMessages(prev => [...prev, closingMessage]);
            }, 1000);
            setConversationContext({});
          }
        }
      } else if (conversationContext.emotion) {
        const flow = emotionFlows[conversationContext.emotion];
        const response = flow.responses[actionId as keyof typeof flow.responses];
        
        if (response) {
          botResponse = response.text;
          
          // Agregar cierre conversacional
          setTimeout(() => {
            const closingMessage: Message = {
              id: Date.now(),
              text: "Recuerda que estoy aquí para ti cuando me necesites. Cuidar de tu bienestar emocional es un acto de amor propio. ¿Hay algo más en lo que pueda apoyarte hoy?",
              isBot: true,
              timestamp: new Date()
            };
            setMessages(prev => [...prev, closingMessage]);
          }, 1000);
        }
        
        // Limpiar contexto
        setConversationContext({});
      }
    }
    // Si es una respuesta rápida predefinida
    else if (quickResponsesContextual[text as keyof typeof quickResponsesContextual]) {
      botResponse = quickResponsesContextual[text as keyof typeof quickResponsesContextual];
    }
    // Detectar si el usuario dice que algo no funciona (especialmente para ansiedad)
    else if (detectNotWorking(text) && conversationContext.emotion === 'anxiety') {
      const anxietyFlow = emotionFlows.anxiety;
      const notWorkingResponse = anxietyFlow.responses.anxiety_not_working;
      botResponse = notWorkingResponse.text;
      botOptions = notWorkingResponse.options;
      
      setConversationContext({
        ...conversationContext,
        anxietyIntensity: 'not_working'
      });
    }
    // Detectar emoción en el mensaje
    else {
      const detectedEmotion = detectEmotion(text);
      
      if (detectedEmotion) {
        const flow = emotionFlows[detectedEmotion];
        botResponse = flow.initial.text;
        botOptions = flow.initial.options;
        
        // Guardar contexto
        setConversationContext({
          emotion: detectedEmotion,
          stage: 'initial',
          anxietyIntensity: detectedEmotion === 'anxiety' ? 'initial' : undefined
        });
      } else {
        // Respuesta general
        botResponse = getGeneralResponse();
      }
    }
    
    const botMessage: Message = {
      id: timestamp + 1,
      text: botResponse,
      isBot: true,
      timestamp: new Date(),
      options: botOptions
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInputText('');
  };

  const handleOptionClick = (option: MessageOption) => {
    sendMessage(option.label, true, option.action);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      sendMessage(inputText);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header mejorado de Luna */}
      <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-700">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl">🌙</span>
            <h2 className="text-lg text-purple-700 dark:text-purple-300">Luna</h2>
          </div>
          <p className="text-sm text-purple-600 dark:text-purple-200">
            Tu compañera de apoyo emocional • Siempre aquí para escucharte
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-purple-500 dark:text-purple-400">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>En línea</span>
            </div>
            <span>•</span>
            <span>{messages.length} mensajes</span>
            {messages.length > 1 && (
              <>
                <span>•</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                  onClick={() => {
                    if (window.confirm('¿Seguro que querés borrar todo el historial de conversación con Luna?')) {
                      setMessages([{
                        id: 1,
                        text: welcomeMessage,
                        isBot: true,
                        timestamp: new Date()
                      }]);
                      setConversationContext({});
                    }
                  }}
                >
                  Limpiar chat
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Messages Container */}
      <div className="flex-1 space-y-4 max-h-96 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id}>
            <div
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} space-x-2`}
            >
              {message.isBot && (
                <Avatar className="w-8 h-8 bg-purple-100 dark:bg-purple-900/50">
                  <span className="text-sm">🌙</span>
                </Avatar>
              )}
              <Card className={`max-w-xs p-3 ${
                message.isBot 
                  ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700' 
                  : 'bg-blue-500 text-white border-blue-500'
              }`}>
                <p className={`text-sm whitespace-pre-line ${
                  message.isBot 
                    ? 'text-purple-800 dark:text-purple-200' 
                    : 'text-white'
                }`}>
                  {message.text}
                </p>
              </Card>
            </div>
            
            {/* Mostrar opciones si las hay */}
            {message.isBot && message.options && (
              <div className="ml-10 mt-2 space-y-2">
                {message.options.map((option) => (
                  <Button
                    key={option.id}
                    variant="outline"
                    size="sm"
                    className="w-full text-xs text-left justify-start h-auto py-2 px-3 border-purple-300 dark:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                    onClick={() => handleOptionClick(option)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Response Buttons - Solo mostrar si es el primer mensaje */}
      {messages.length === 1 && (
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
          <div className="space-y-3">
            <div className="text-center">
              <p className="text-sm text-blue-700 dark:text-blue-300">¿Cómo te sentís hoy?</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">Tocá una opción para empezar a conversar</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {quickResponses.map((response, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs p-3 h-auto whitespace-normal border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-left"
                  onClick={() => sendMessage(response)}
                >
                  {response}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Input Area */}
      <div className="flex space-x-2">
        <Input
          placeholder="Contame lo que sentís... 💭"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 bg-white dark:bg-gray-700 border-purple-200 dark:border-gray-600 focus:border-purple-400 dark:focus:border-purple-500 text-gray-800 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
        />
        <Button onClick={handleSendMessage} size="sm" className="bg-purple-600 hover:bg-purple-700">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
