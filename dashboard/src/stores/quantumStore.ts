import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { OptimizationRequest, OptimizationResult, SocketConnection } from '../types';

interface QuantumStore extends SocketConnection {
  optimizationRequests: OptimizationRequest[];
  optimizationResults: OptimizationResult[];
  activeOptimizations: string[]; // request_ids
  quantumStatus: {
    qpu_online: boolean;
    qpu_temperature_kelvin: number;
    coherence_time_ms: number;
    gate_fidelity: number;
    error_correction_active: boolean;
    active_algorithms: string[];
  };
  
  // Actions
  connectQuantumSocket: (socket: Socket) => void;
  triggerOptimization: (request: Omit<OptimizationRequest, 'request_id' | 'timestamp'>) => Promise<void>;
  triggerMolecularSimulation: (moleculeName: string, parameters: any) => Promise<void>;
  triggerErrorCorrection: (stateId: string) => Promise<void>;
  updateQuantumStatus: (status: any) => void;
  addOptimizationResult: (result: OptimizationResult) => void;
  clearCompletedOptimizations: () => void;
}

export const useQuantumStore = create<QuantumStore>((set, get) => ({
  // Initial state
  connected: false,
  optimizationRequests: [],
  optimizationResults: [],
  activeOptimizations: [],
  quantumStatus: {
    qpu_online: true,
    qpu_temperature_kelvin: 0.015,
    coherence_time_ms: 2.5,
    gate_fidelity: 0.998,
    error_correction_active: true,
    active_algorithms: ['QAOA', 'VQE', 'GKP'],
  },

  // Actions
  connectQuantumSocket: (socket: Socket) => {
    socket.on('optimization_started', (request: OptimizationRequest) => {
      set((state) => ({
        optimizationRequests: [...state.optimizationRequests, request],
        activeOptimizations: [...state.activeOptimizations, request.request_id]
      }));
    });

    socket.on('optimization_completed', (result: OptimizationResult) => {
      get().addOptimizationResult(result);
    });

    socket.on('quantum_status_update', (status: any) => {
      get().updateQuantumStatus(status);
    });

    set({ connected: true, socket });
  },

  triggerOptimization: async (request) => {
    const { socket } = get();
    if (!socket) return;

    const optimizationRequest: OptimizationRequest = {
      ...request,
      request_id: `opt_${Date.now()}`,
      timestamp: new Date().toISOString(),
    };

    socket.emit('trigger_optimization', optimizationRequest);
    
    set((state) => ({
      optimizationRequests: [...state.optimizationRequests, optimizationRequest],
      activeOptimizations: [...state.activeOptimizations, optimizationRequest.request_id]
    }));
  },

  triggerMolecularSimulation: async (moleculeName: string, parameters: any) => {
    const { socket } = get();
    if (!socket) return;

    const request = {
      molecule_name: moleculeName,
      ...parameters
    };

    socket.emit('trigger_molecular_simulation', request);
  },

  triggerErrorCorrection: async (stateId: string) => {
    const { socket } = get();
    if (!socket) return;

    socket.emit('trigger_error_correction', { state_id: stateId });
  },

  updateQuantumStatus: (status: any) => {
    set((state) => ({
      quantumStatus: { ...state.quantumStatus, ...status }
    }));
  },

  addOptimizationResult: (result: OptimizationResult) => {
    set((state) => {
      const newActiveOptimizations = state.activeOptimizations.filter(
        id => id !== result.request_id
      );

      return {
        optimizationResults: [result, ...state.optimizationResults.slice(0, 99)], // Keep last 100 results
        activeOptimizations: newActiveOptimizations
      };
    });
  },

  clearCompletedOptimizations: () => {
    set({
      optimizationResults: [],
      optimizationRequests: []
    });
  },
}));
