// Registro de entregables publicados en trineo.
// Aquí solo van códigos: los nombres y correos de cada destinatario se guardan
// en Firebase (trineo/directorio/<carpeta>/<código>) y solo los ve el panel.
export const COTIZACIONES = {
  "carnot-corep-2027": {
    titulo: "Co-Rep · Carnot (Portafolio SNC)",
    cliente: "Carnot Laboratorios",
    proyecto: "Co-Rep Polar Edition",
    monto: 450000,
    nota: "Paquete anual · pesos mexicanos (MXN) más IVA",
    limite: "2026-11-30",
    pdf: "assets/Cotizacion-Carnot-Co-Rep-2027.pdf?v=4",
    secciones: ["Planes", "Inversión y capacidad", "Cómo funciona", "Tecnología y limitaciones", "Interacciones y calendario", "Condiciones"],
    desde: 1795619541517, // el panel ignora la actividad anterior a este momento (pruebas)
    codigos: ["equipo-snc"]
  },
  "carnot-pulso-reporte-2026": {
    titulo: "PULSO · Reporte final del evento",
    cliente: "Carnot Laboratorios",
    proyecto: "PULSO by Lacteol",
    tipo: "Reporte final",
    nota: "Un código por destinatario de la cadena (lo asigna el servidor de PULSO). DSM no ve la asistencia por representante.",
    secciones: ["Cifras", "Cronología", "Programa académico", "Reto PULSO", "Por representante", "Fotografías", "Videomemoria"],
    desde: 1795753800000, // 26 nov 2026 22:30 (CDMX): lo anterior son pruebas
    codigos: []
  },
  "carnot-pulso-repres-2026": {
    titulo: "PULSO · Resultados por representante",
    cliente: "Carnot Laboratorios",
    proyecto: "PULSO by Lacteol",
    tipo: "Resultados por representante",
    nota: "Una liga por representante con solo sus médicos (clave de la pestaña Representantes).",
    secciones: ["Resumen", "Médico por médico"],
    desde: 1795753800000,
    codigos: []
  }
};
