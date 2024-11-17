export const MODULES = {
  // Módulos Base (Gratuitos)
  inventory: {
    id: 'inventory',
    name: 'Inventario y POS',
    description: 'Gestión de inventario y punto de venta',
    category: 'core',
    price: 0
  },
  
  // Módulos Premium
  accounting: {
    id: 'accounting',
    name: 'Contabilidad',
    description: 'Sistema contable completo con libro de IVA',
    category: 'finance',
    price: 35
  },
  marketing: {
    id: 'marketing',
    name: 'Marketing',
    description: 'Gestión de promociones y campañas',
    category: 'sales',
    price: 65
  },
  hr: {
    id: 'hr',
    name: 'Recursos Humanos',
    description: 'Gestión de personal y nómina',
    category: 'management',
    price: 45,
    features: [
      'Gestión de empleados',
      'Nómina y pagos',
      'Control de asistencia',
      'Vacaciones y permisos',
      'Evaluaciones de desempeño'
    ]
  },
  logistics: {
    id: 'logistics',
    name: 'Logística',
    description: 'Control de rutas y entregas',
    category: 'operations',
    price: 40,
    features: [
      'Planificación de rutas',
      'Seguimiento de entregas',
      'Gestión de flota',
      'Optimización de rutas',
      'Reportes de eficiencia'
    ]
  },
  tasks: {
    id: 'tasks',
    name: 'Gestión de Tareas',
    description: 'Control de proyectos y tareas',
    category: 'management',
    price: 25,
    features: [
      'Gestión de proyectos',
      'Asignación de tareas',
      'Seguimiento de tiempo',
      'Calendario compartido',
      'Reportes de productividad'
    ]
  },
  suppliers: {
    id: 'suppliers',
    name: 'Proveedores',
    description: 'Gestión de proveedores y compras',
    category: 'operations',
    price: 30,
    features: [
      'Catálogo de proveedores',
      'Órdenes de compra',
      'Evaluación de proveedores',
      'Historial de precios',
      'Gestión de contratos'
    ]
  },
  production: {
    id: 'production',
    name: 'Producción',
    description: 'Control de producción y materia prima',
    category: 'operations',
    price: 55,
    features: [
      'Planificación de producción',
      'Control de materia prima',
      'Fórmulas y recetas',
      'Control de calidad',
      'Costos de producción'
    ]
  },
  maintenance: {
    id: 'maintenance',
    name: 'Mantenimiento',
    description: 'Gestión de mantenimiento de equipos',
    category: 'operations',
    price: 35,
    features: [
      'Programación de mantenimiento',
      'Historial de reparaciones',
      'Inventario de repuestos',
      'Órdenes de trabajo',
      'Alertas y notificaciones'
    ]
  },
  displays: {
    id: 'displays',
    name: 'Pantallas Publicitarias',
    description: 'Gestión de contenido en pantallas',
    category: 'marketing',
    price: 40,
    features: [
      'Gestión de contenido',
      'Programación de anuncios',
      'Múltiples pantallas',
      'Estadísticas de visualización',
      'Contenido dinámico'
    ]
  },
  pricecheck: {
    id: 'pricecheck',
    name: 'Verificador de Precios',
    description: 'Terminales de consulta de precios',
    category: 'sales',
    price: 20,
    features: [
      'Consulta de precios',
      'Información de productos',
      'Ofertas activas',
      'Múltiples terminales',
      'Estadísticas de uso'
    ]
  },
  jobs: {
    id: 'jobs',
    name: 'Bolsa de Trabajo',
    description: 'Portal de empleo y reclutamiento',
    category: 'hr',
    price: 30,
    features: [
      'Portal de empleos',
      'Gestión de candidatos',
      'Proceso de selección',
      'Evaluaciones',
      'Reportes de contratación'
    ]
  },
  billing: {
    id: 'billing',
    name: 'Facturación Electrónica',
    description: 'Sistema de facturación fiscal',
    category: 'finance',
    price: 45,
    features: [
      'Facturación electrónica',
      'Notas de crédito/débito',
      'Reportes fiscales',
      'Integración SENIAT',
      'Archivo fiscal'
    ]
  }
};