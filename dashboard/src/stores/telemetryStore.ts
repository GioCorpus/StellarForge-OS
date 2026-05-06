import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { PowerNode, QuantumMetrics, SwarmStatus, TelemetryEvent, SocketConnection } from '../types';

interface TelemetryStore extends SocketConnection {
  powerNodes: PowerNode[];
  quantumMetrics: QuantumMetrics | null;
  swarmStatus: SwarmStatus | null;
  recentEvents: TelemetryEvent[];
  systemMetrics: {
    cpu_usage: number;
    memory_usage: number;
    network_latency_ms: number;
    quantum_coherence: number;
    photonic_link_quality: number;
  };
  lastUpdate: string;
  
  // Actions
  connectSocket: (socket: Socket) => void;
  disconnectSocket: () => void;
  updatePowerNode: (node: PowerNode) => void;
  updateQuantumMetrics: (metrics: QuantumMetrics) => void;
  updateSwarmStatus: (status: SwarmStatus) => void;
  addTelemetryEvent: (event: TelemetryEvent) => void;
  updateSystemMetrics: (metrics: Partial<TelemetryStore['systemMetrics']>) => void;
}

export const useTelemetryStore = create<TelemetryStore>((set, get) => ({
  // Initial state
  connected: false,
  powerNodes: [],
  quantumMetrics: null,
  swarmStatus: null,
  recentEvents: [],
  systemMetrics: {
    cpu_usage: 0.42,
    memory_usage: 0.68,
    network_latency_ms: 0.8,
    quantum_coherence: 0.95,
    photonic_link_quality: 0.98,
  },
  lastUpdate: new Date().toISOString(),

  // Actions
  connectSocket: (socket: Socket) => {
    socket.on('node_update', (node: PowerNode) => {
      get().updatePowerNode(node);
    });

    socket.on('telemetry_update', (data: any) => {
      if (data.quantum_metrics) {
        get().updateQuantumMetrics(data.quantum_metrics);
      }
      if (data.swarm_status) {
        get().updateSwarmStatus(data.swarm_status);
      }
    });

    socket.on('telemetry_event', (event: TelemetryEvent) => {
      get().addTelemetryEvent(event);
    });

    socket.on('system_metrics', (metrics: any) => {
      get().updateSystemMetrics(metrics);
    });

    set({ connected: true, socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
    }
    set({ connected: false, socket: undefined });
  },

  updatePowerNode: (node: PowerNode) => {
    set((state) => {
      const existingIndex = state.powerNodes.findIndex(n => n.node_id === node.node_id);
      let updatedNodes: PowerNode[];
      
      if (existingIndex >= 0) {
        updatedNodes = [...state.powerNodes];
        updatedNodes[existingIndex] = node;
      } else {
        updatedNodes = [...state.powerNodes, node];
      }

      return {
        powerNodes: updatedNodes,
        lastUpdate: new Date().toISOString()
      };
    });
  },

  updateQuantumMetrics: (metrics: QuantumMetrics) => {
    set({
      quantumMetrics: metrics,
      lastUpdate: new Date().toISOString()
    });
  },

  updateSwarmStatus: (status: SwarmStatus) => {
    set({
      swarmStatus: status,
      lastUpdate: new Date().toISOString()
    });
  },

  addTelemetryEvent: (event: TelemetryEvent) => {
    set((state) => ({
      recentEvents: [event, ...state.recentEvents.slice(0, 49)], // Keep last 50 events
      lastUpdate: new Date().toISOString()
    }));
  },

  updateSystemMetrics: (metrics: Partial<TelemetryStore['systemMetrics']>) => {
    set((state) => ({
      systemMetrics: { ...state.systemMetrics, ...metrics },
      lastUpdate: new Date().toISOString()
    }));
  },
}));
