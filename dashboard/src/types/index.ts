// STELLARFORGE: Type definitions for Dyson Swarm control interface

export interface PowerNode {
  node_id: number;
  position: [number, number, number];
  power_output_mw: number;
  max_capacity_mw: number;
  efficiency: number;
  temperature_kelvin: number;
  status: 'active' | 'standby' | 'maintenance' | 'critical';
  last_update: string;
  connected_nodes: number[];
  quantum_entanglement_active: boolean;
}

export interface QuantumMetrics {
  qpu_utilization: number;
  quantum_advantage: number;
  error_rate: number;
  gate_fidelity: number;
  coherence_time_ms: number;
  error_correction_active: boolean;
  active_algorithms: string[];
  timestamp: string;
}

export interface SwarmStatus {
  total_nodes: number;
  active_nodes: number;
  standby_nodes: number;
  maintenance_nodes: number;
  critical_nodes: number;
  offline_nodes: number;
  total_power_output_gw: number;
  max_capacity_gw: number;
  grid_stability: number;
  quantum_efficiency: number;
  photonic_link_quality: number;
  average_efficiency: number;
  average_temperature_kelvin: number;
  last_full_scan: string;
  alerts: string[];
}

export interface TelemetryEvent {
  event_id: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  node_id?: number;
  message: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}

export interface OptimizationRequest {
  request_id: string;
  algorithm: 'qaoa' | 'vqe' | 'grover' | 'shor' | 'gkp' | 'custom';
  priority: 'critical' | 'high' | 'medium' | 'low';
  parameters: Record<string, unknown>;
  max_execution_time_ms: number;
  qubits_required: number;
  error_threshold: number;
  timestamp: string;
}

export interface OptimizationResult {
  result_id: string;
  request_id: string;
  algorithm: string;
  status: 'completed' | 'failed' | 'timeout';
  execution_time_ms: number;
  quantum_advantage?: number;
  objective_value?: number;
  solution?: Record<string, unknown>;
  error_message?: string;
  fidelity: number;
  timestamp: string;
}

export interface SocketConnection {
  connected: boolean;
  socket?: any; // SocketIO.Socket
  last_error?: string;
}
