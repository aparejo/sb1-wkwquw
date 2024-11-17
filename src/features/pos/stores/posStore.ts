import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { POSSession, CashMovement } from '../types';

interface POSState {
  currentSession: POSSession | null;
  sessions: POSSession[];
  movements: CashMovement[];
  
  openSession: (data: {
    terminalId: string;
    userId: string;
    warehouseId: string;
    initialCash: number;
  }) => void;
  
  closeSession: (data: {
    finalCash: number;
  }) => void;
  
  addMovement: (data: Omit<CashMovement, 'id' | 'createdAt'>) => void;
  
  // Nuevo método para verificar permisos
  hasTerminalAccess: (userId: string, terminalId: string) => boolean;
}

export const usePOSStore = create<POSState>()(
  persist(
    (set, get) => ({
      currentSession: null,
      sessions: [],
      movements: [],

      openSession: (data) => {
        // Verificar si ya existe una sesión abierta para este terminal
        const existingSession = get().sessions.find(s => 
          s.terminalId === data.terminalId && 
          s.status === 'open'
        );

        if (existingSession) {
          throw new Error('Ya existe una sesión abierta para este terminal');
        }

        const session: POSSession = {
          id: crypto.randomUUID(),
          ...data,
          openedAt: new Date().toISOString(),
          closedAt: undefined,
          status: 'open',
          sales: [],
          payments: [],
          transactions: []
        };

        set((state) => ({
          sessions: [...state.sessions, session],
          currentSession: session
        }));
      },

      closeSession: (data) => {
        set((state) => ({
          sessions: state.sessions.map(s => 
            s.id === state.currentSession?.id
              ? {
                  ...s,
                  ...data,
                  closedAt: new Date().toISOString(),
                  status: 'closed'
                }
              : s
          ),
          currentSession: null
        }));
      },

      addMovement: (data) => {
        const movement: CashMovement = {
          id: crypto.randomUUID(),
          ...data,
          createdAt: new Date().toISOString()
        };

        set((state) => ({
          movements: [...state.movements, movement]
        }));
      },

      hasTerminalAccess: (userId: string, terminalId: string) => {
        // Aquí iría la lógica para verificar si el usuario tiene acceso al terminal
        // Por ahora retornamos true para pruebas
        return true;
      }
    }),
    {
      name: 'pos-storage'
    }
  )
);