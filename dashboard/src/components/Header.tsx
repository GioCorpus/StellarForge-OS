import React from 'react';
import { Activity, Zap, Shield, Cpu } from 'lucide-react';
import { useTelemetryStore } from '../stores/telemetryStore';

// STELLARFORGE: Header component for Dyson Swarm control interface
export const Header: React.FC = () => {
  const { connected, systemMetrics, quantumMetrics, swarmStatus } = useTelemetryStore();

  const getStatusColor = (status: boolean) => 
    status ? 'text-green-400' : 'text-red-400';

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 0.9) return 'text-green-400';
    if (efficiency >= 0.7) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Zap className="w-8 h-8 text-cyan-400 animate-glow" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">StellarForge OS</h1>
              <p className="text-xs text-gray-400">Dyson Swarm Control Interface</p>
            </div>
          </div>

          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <Activity className={`w-4 h-4 ${getStatusColor(connected)}`} />
            <span className={`text-sm ${getStatusColor(connected)}`}>
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* System Metrics */}
          <div className="flex items-center space-x-8">
            {/* CPU Usage */}
            <div className="text-center">
              <Cpu className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <div className="text-xs text-gray-400">CPU</div>
              <div className="text-sm font-mono text-cyan-400">
                {(systemMetrics.cpu_usage * 100).toFixed(1)}%
              </div>
            </div>

            {/* Quantum Coherence */}
            <div className="text-center">
              <Shield className="w-5 h-5 text-gray-400 mx-auto mb-1" />
              <div className="text-xs text-gray-400">Quantum</div>
              <div className={`text-sm font-mono ${getEfficiencyColor(systemMetrics.quantum_coherence)}`}>
                {(systemMetrics.quantum_coherence * 100).toFixed(1)}%
              </div>
            </div>

            {/* Grid Stability */}
            {swarmStatus && (
              <div className="text-center">
                <Zap className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <div className="text-xs text-gray-400">Grid</div>
                <div className={`text-sm font-mono ${getEfficiencyColor(swarmStatus.grid_stability)}`}>
                  {(swarmStatus.grid_stability * 100).toFixed(1)}%
                </div>
              </div>
            )}

            {/* QPU Utilization */}
            {quantumMetrics && (
              <div className="text-center">
                <Cpu className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <div className="text-xs text-gray-400">QPU</div>
                <div className="text-sm font-mono text-purple-400">
                  {(quantumMetrics.qpu_utilization * 100).toFixed(1)}%
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
