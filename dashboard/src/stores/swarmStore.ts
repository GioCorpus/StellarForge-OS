import { create } from 'zustand';
import { Socket } from 'socket.io-client';
import { SwarmStatus, PowerNode, SocketConnection } from '../types';

interface SwarmStore extends SocketConnection {
  swarmStatus: SwarmStatus | null;
  selectedNodeId: number | null;
  nodeDetails: PowerNode | null;
  emergencyProtocols: {
    protocol_id: string;
    protocol_type: string;
    status: string;
    affected_nodes: number;
    estimated_completion_time_seconds: number;
    safety_measures_active: boolean;
  }[];
  
  // Actions
  connectSwarmSocket: (socket: Socket) => void;
  updateSwarmStatus: (status: SwarmStatus) => void;
  selectNode: (nodeId: number) => void;
  loadNodeDetails: (nodeId: number) => Promise<void>;
  triggerEmergencyProtocol: (protocolType: string) => Promise<void>;
  clearEmergencyProtocols: () => void;
}

export const useSwarmStore = create<SwarmStore>((set, get) => ({
  // Initial state
  connected: false,
  swarmStatus: null,
  selectedNodeId: null,
  nodeDetails: null,
  emergencyProtocols: [],

  // Actions
  connectSwarmSocket: (socket: Socket) => {
    socket.on('swarm_status_update', (status: SwarmStatus) => {
      get().updateSwarmStatus(status);
    });

    socket.on('node_details_update', (node: PowerNode) => {
      if (get().selectedNodeId === node.node_id) {
        set({ nodeDetails: node });
      }
    });

    socket.on('emergency_protocol_triggered', (protocol: any) => {
      set((state) => ({
        emergencyProtocols: [protocol, ...state.emergencyProtocols.slice(0, 9)] // Keep last 10
      }));
    });

    set({ connected: true, socket });
  },

  updateSwarmStatus: (status: SwarmStatus) => {
    set({ swarmStatus: status });
  },

  selectNode: (nodeId: number) => {
    set({ selectedNodeId: nodeId });
    get().loadNodeDetails(nodeId);
  },

  loadNodeDetails: async (nodeId: number) => {
    try {
      const response = await fetch(`/api/v1/swarm/nodes/${nodeId}`);
      if (response.ok) {
        const nodeDetails = await response.json();
        set({ nodeDetails });
      }
    } catch (error) {
      console.error('Failed to load node details:', error);
    }
  },

  triggerEmergencyProtocol: async (protocolType: string) => {
    const { socket } = get();
    if (!socket) return;

    try {
      const response = await fetch('/api/v1/swarm/emergency', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          protocol: protocolType
        })
      });

      if (response.ok) {
        const protocol = await response.json();
        socket.emit('emergency_protocol_triggered', protocol);
      }
    } catch (error) {
      console.error('Failed to trigger emergency protocol:', error);
    }
  },

  clearEmergencyProtocols: () => {
    set({ emergencyProtocols: [] });
  },
}));
