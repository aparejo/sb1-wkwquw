import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Package, ShoppingCart, DollarSign, BarChart, Users, Settings } from 'lucide-react';

const PLANS = {
  free: {
    name: 'Gratis',
    price: 0,
    features: {
      users: 1,
      stores: 1,
      products: 100,
      modules: ['inventory', 'pos']
    },
    limits: {
      storage: '1GB',
      dailyTransactions: 50
    }
  },
  commercial: {
    name: 'Comercial',
    price: 25,
    features: {
      users: 10,
      stores: 3,
      products: 5000,
      modules: ['inventory', 'pos', 'accounting', 'marketing']
    },
    limits: {
      storage: '10GB',
      dailyTransactions: 500
    }
  },
  professional: {
    name: 'Profesional',
    price: 49,
    features: {
      users: 25,
      stores: 10,
      products: 20000,
      modules: ['all']
    },
    limits: {
      storage: '50GB',
      dailyTransactions: 2000
    }
  },
  enterprise: {
    name: 'Empresarial',
    price: 99,
    features: {
      users: 'unlimited',
      stores: 'unlimited',
      products: 'unlimited',
      modules: ['all']
    },
    limits: {
      storage: '200GB',
      dailyTransactions: 'unlimited'
    }
  }
};

const FEATURES = [
  {
    icon: Package,
    title: 'Gestión de Inventario',
    description: 'Control completo de productos, categorías y almacenes'
  },
  {
    icon: ShoppingCart,
    title: 'Punto de Venta',
    description: 'Sistema POS intuitivo con soporte para impresoras fiscales'
  },
  {
    icon: DollarSign,
    title: 'Contabilidad',
    description: 'Gestión financiera, facturas y reportes contables'
  },
  {
    icon: BarChart,
    title: 'Marketing',
    description: 'Campañas, promociones y análisis de ventas'
  },
  {
    icon: Users,
    title: 'Multi-usuario',
    description: 'Roles y permisos personalizables'
  },
  {
    icon: Settings,
    title: 'Personalizable',
    description: 'Adaptable a las necesidades de tu negocio'
  }
];

export function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <img 
              src="https://provalnet.net/wp-content/uploads/2024/11/logo.png"
              alt="Axiloop Logo"
              className="h-16 mx-auto mb-8 dark:brightness-200"
            />
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Sistema ERP Moderno</span>
              <span className="block text-blue-600">para tu Negocio</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Gestiona tu inventario, ventas, contabilidad y marketing en una sola plataforma.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                >
                  Comenzar Gratis
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 md:py-4 md:text-lg md:px-10"
                >
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Todo lo que necesitas
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              Una solución completa para la gestión de tu negocio
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="pt-6">
                    <div className="flow-root bg-white dark:bg-gray-900 rounded-lg px-6 pb-8">
                      <div className="-mt-6">
                        <div>
                          <span className="inline-flex items-center justify-center p-3 bg-blue-500 rounded-md shadow-lg">
                            <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                          </span>
                        </div>
                        <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white tracking-tight">
                          {feature.title}
                        </h3>
                        <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <section className="py-16 bg-white dark:bg-gray-900" id="pricing">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Planes y Precios
            </h2>
            <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
              Elige el plan que mejor se adapte a tu negocio
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(PLANS).map(([id, plan]) => (
              <div 
                key={id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border-2 border-transparent hover:border-blue-500 transition-colors"
              >
                <div className="px-6 py-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                    {plan.name}
                  </h3>
                  <div className="mt-4 flex justify-center items-baseline">
                    <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                      ${plan.price}
                    </span>
                    <span className="ml-1 text-xl font-medium text-gray-500 dark:text-gray-400">
                      /mes
                    </span>
                  </div>
                  <ul className="mt-8 space-y-4">
                    {Object.entries(plan.features).map(([key, value]) => (
                      <li key={key} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {key === 'modules' 
                            ? Array.isArray(value) && value[0] === 'all'
                              ? 'Todos los módulos'
                              : `${value.length} módulos`
                            : `${value} ${key}`}
                        </span>
                      </li>
                    ))}
                    {Object.entries(plan.limits).map(([key, value]) => (
                      <li key={key} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {key === 'dailyTransactions'
                            ? value === 'unlimited'
                              ? 'Transacciones ilimitadas'
                              : `${value} trans./día`
                            : `${value} almacenamiento`}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="px-6 pb-8">
                  <Link
                    to="/register"
                    className="block w-full bg-blue-600 text-white text-center px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Comenzar Gratis
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-base text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Desarrollado por{' '}
              <a 
                href="https://antonioparejo.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-500"
              >
                Antonio Parejo
              </a>
              . Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/584128457542"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
        aria-label="Contactar por WhatsApp"
      >
        <svg 
          className="h-6 w-6" 
          fill="currentColor" 
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </a>
    </div>
  );
}