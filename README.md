# Axiloop

Sistema ERP moderno y eficiente que integra:

- Gestión de inventario
- Punto de venta (POS)
- Impresión fiscal
- Gestión de clientes
- Reportes

## Requisitos

- Node.js 18 o superior
- SQLite
- Impresora fiscal compatible

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/aparejo/axiloop2.git
cd axiloop2
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

4. Iniciar en desarrollo:
```bash
npm run dev
```

5. Construir para producción:
```bash
npm run build
```

## Estructura del Proyecto

```
src/
  ├── components/       # Componentes reutilizables
  ├── features/        # Funcionalidades principales
  │   ├── inventory/   # Gestión de inventario
  │   ├── pos/         # Punto de venta
  │   └── config/      # Configuración del sistema
  ├── lib/            # Utilidades y servicios
  │   ├── db/         # Configuración de base de datos
  │   └── services/   # Servicios (impresora fiscal, etc)
  └── stores/         # Estado global (Zustand)
```

## Licencia

Privado - Todos los derechos reservados