import React, { useState } from 'react';
import { Play, Pause, Settings, Cpu, Zap, Shield } from 'lucide-react';
import { useQuantumStore } from '../stores/quantumStore';

// STELLARFORGE: Quantum control interface for Dyson Swarm quantum systems
export const QuantumControl: React.FC = () => {
  const { 
    quantumStatus, 
    activeOptimizations, 
    optimizationResults,
    triggerOptimization,
    triggerMolecularSimulation,
    triggerErrorCorrection
  } = useQuantumStore();

  const [selectedAlgorithm, setSelectedAlgorithm] = useState('qaoa');
  const [optimizationParams, setOptimizationParams] = useState({
    priority: 'medium',
    qubits: 10,
    maxTime: 1000
  });

  const handleOptimization = () => {
    triggerOptimization({
      algorithm: selectedAlgorithm as any,
      priority: optimizationParams.priority as any,
      parameters: { target: 'power_grid_optimization' },
      max_execution_time_ms: optimizationParams.maxTime,
      qubits_required: optimizationParams.qubits,
      error_threshold: 0.01
    });
  };

  const handleMolecularSimulation = () => {
    triggerMolecularSimulation('H2O', {
      spin: 0,
      charge: 0,
      basis_set: 'sto-3g'
    });
  };

  const handleErrorCorrection = () => {
    triggerErrorCorrection('quantum_state_001');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Quantum Control</h1>
        <p className="text-gray-400">Control and monitor quantum systems for Dyson Swarm operations</p>
      </div>

      {/* Quantum Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stellar-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">QPU Status</h3>
            <Cpu className="w-5 h-5 text-purple-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Online</span>
              <span className={`text-sm font-medium ${quantumStatus?.qpu_online ? 'text-green-400' : 'text-red-400'}`}>
                {quantumStatus?.qpu_online ? 'Active' : 'Offline'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Temperature</span>
              <span className="text-sm font-mono text-cyan-400">
                {quantumStatus?.qpu_temperature_kelvin || 0.015} mK
              </span>
            </div>
          </div>
        </div>

        <div className="stellar-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Coherence</h3>
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Coherence Time</span>
              <span className="text-sm font-mono text-cyan-400">
                {quantumStatus?.coherence_time_ms || 2.5} ms
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Gate Fidelity</span>
              <span className="text-sm font-mono text-cyan-400">
                {((quantumStatus?.gate_fidelity || 0.998) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="stellar-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Error Correction</h3>
            <Settings className="w-5 h-5 text-green-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">GKP Active</span>
              <span className={`text-sm font-medium ${quantumStatus?.error_correction_active ? 'text-green-400' : 'text-red-400'}`}>
                {quantumStatus?.error_correction_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Active Algorithms</span>
              <span className="text-sm font-mono text-purple-400">
                {quantumStatus?.active_algorithms?.length || 3}
              </span>
            </div>
          </div>
        </div>

        <div className="stellar-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Active Tasks</h3>
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Optimizations</span>
              <span className="text-sm font-mono text-amber-400">
                {activeOptimizations.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm">Completed</span>
              <span className="text-sm font-mono text-green-400">
                {optimizationResults.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Optimization Controls */}
        <div className="stellar-card">
          <h3 className="text-lg font-semibold text-white mb-4">Quantum Optimization</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Algorithm</label>
              <select 
                value={selectedAlgorithm}
                onChange={(e) => setSelectedAlgorithm(e.target.value)}
                className="void-input w-full"
              >
                <option value="qaoa">QAOA (Grid Optimization)</option>
                <option value="vqe">VQE (Molecular Simulation)</option>
                <option value="grover">Grover (Search)</option>
                <option value="gkp">GKP (Error Correction)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Priority</label>
                <select 
                  value={optimizationParams.priority}
                  onChange={(e) => setOptimizationParams(prev => ({ ...prev, priority: e.target.value }))}
                  className="void-input w-full"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Qubits</label>
                <input 
                  type="number"
                  value={optimizationParams.qubits}
                  onChange={(e) => setOptimizationParams(prev => ({ ...prev, qubits: parseInt(e.target.value) }))}
                  className="void-input w-full"
                  min="1"
                  max="20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Max Execution Time (ms)</label>
              <input 
                type="number"
                value={optimizationParams.maxTime}
                onChange={(e) => setOptimizationParams(prev => ({ ...prev, maxTime: parseInt(e.target.value) }))}
                className="void-input w-full"
                min="100"
                max="10000"
              />
            </div>

            <button
              onClick={handleOptimization}
              className="quantum-button w-full flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Start Optimization</span>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="stellar-card">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={handleMolecularSimulation}
              className="stellar-button w-full flex items-center justify-center space-x-2"
            >
              <Cpu className="w-4 h-4" />
              <span>Run H₂O Molecular Simulation</span>
            </button>

            <button
              onClick={handleErrorCorrection}
              className="stellar-button w-full flex items-center justify-center space-x-2"
            >
              <Shield className="w-4 h-4" />
              <span>Apply GKP Error Correction</span>
            </button>

            <div className="pt-4 border-t border-gray-700">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Active Algorithms</h4>
              <div className="space-y-1">
                {quantumStatus?.active_algorithms?.map((algo, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{algo}</span>
                    <span className="text-green-400 text-xs">● Running</span>
                  </div>
                )) || (
                  <div className="text-gray-500 text-sm">No active algorithms</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Results */}
      <div className="stellar-card">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Optimization Results</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 px-4 text-gray-400">Algorithm</th>
                <th className="text-left py-2 px-4 text-gray-400">Status</th>
                <th className="text-left py-2 px-4 text-gray-400">Execution Time</th>
                <th className="text-left py-2 px-4 text-gray-400">Quantum Advantage</th>
                <th className="text-left py-2 px-4 text-gray-400">Fidelity</th>
              </tr>
            </thead>
            <tbody>
              {optimizationResults.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No optimization results available
                  </td>
                </tr>
              ) : (
                optimizationResults.slice(0, 10).map((result) => (
                  <tr key={result.result_id} className="border-b border-gray-800">
                    <td className="py-2 px-4 text-gray-300">{result.algorithm.toUpperCase()}</td>
                    <td className="py-2 px-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        result.status === 'completed' ? 'bg-green-900 text-green-300' :
                        result.status === 'failed' ? 'bg-red-900 text-red-300' :
                        'bg-yellow-900 text-yellow-300'
                      }`}>
                        {result.status}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-gray-300 font-mono">
                      {result.execution_time_ms.toFixed(1)} ms
                    </td>
                    <td className="py-2 px-4 text-gray-300">
                      {result.quantum_advantage ? `${result.quantum_advantage.toFixed(2)}x` : 'N/A'}
                    </td>
                    <td className="py-2 px-4 text-gray-300">
                      {(result.fidelity * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
