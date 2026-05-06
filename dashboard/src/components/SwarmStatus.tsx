import React, { useState } from 'react';
import { AlertTriangle, Zap, Activity, Shield, AlertCircle } from 'lucide-react';
import { useSwarmStore } from '../stores/swarmStore';
import { useTelemetryStore } from '../stores/telemetryStore';

// STELLARFORGE: Swarm status component for Dyson Swarm monitoring
export const SwarmStatus: React.FC = () => {
  const { 
    swarmStatus, 
    selectedNodeId, 
    nodeDetails, 
    emergencyProtocols,
    selectNode,
    triggerEmergencyProtocol
  } = useSwarmStore();
  
  const { powerNodes } = useTelemetryStore();
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-900/20';
      case 'standby': return 'text-yellow-400 bg-yellow-900/20';
      case 'maintenance': return 'text-orange-400 bg-orange-900/20';
      case 'critical': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const handleEmergencyProtocol = (protocolType: string) => {
    triggerEmergencyProtocol(protocolType);
    setShowEmergencyDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dyson Swarm Status</h1>
        <p className="text-gray-400">Real-time monitoring and control of swarm infrastructure</p>
      </div>

      {/* Swarm Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stellar-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Total Nodes</h3>
            <Activity className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-cyan-400">
              {swarmStatus?.total_nodes || 1000}
            </div>
            <div className="text-sm text-gray-400">
              {swarmStatus?.active_nodes || 942} active
            </div>
          </div>
        </div>

        <div className="stellar-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Power Output</h3>
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-amber-400">
              {swarmStatus?.total_power_output_gw || 847.5} GW
            </div>
            <div className="text-sm text-gray-400">
              {((swarmStatus?.total_power_output_gw || 847.5) / (swarmStatus?.max_capacity_gw || 1000) * 100).toFixed(1)}% capacity
            </div>
          </div>
        </div>

        <div className="stellar-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Grid Stability</h3>
            <Shield className="w-5 h-5 text-green-400" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-green-400">
              {((swarmStatus?.grid_stability || 0.92) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-400">
              Optimal: ≥95%
            </div>
          </div>
        </div>

        <div className="stellar-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 text-sm font-medium">Alerts</h3>
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div className="space-y-2">
            <div className="text-2xl font-bold text-red-400">
              {swarmStatus?.alerts?.length || 0}
            </div>
            <div className="text-sm text-gray-400">
              Active alerts
            </div>
          </div>
        </div>
      </div>

      {/* Node Status Distribution */}
      <div className="stellar-card">
        <h3 className="text-lg font-semibold text-white mb-4">Node Status Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {swarmStatus?.active_nodes || 942}
            </div>
            <div className="text-sm text-gray-400">Active</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {swarmStatus?.standby_nodes || 35}
            </div>
            <div className="text-sm text-gray-400">Standby</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-400">
              {swarmStatus?.maintenance_nodes || 18}
            </div>
            <div className="text-sm text-gray-400">Maintenance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {swarmStatus?.critical_nodes || 3}
            </div>
            <div className="text-sm text-gray-400">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400">
              {swarmStatus?.offline_nodes || 2}
            </div>
            <div className="text-sm text-gray-400">Offline</div>
          </div>
        </div>
      </div>

      {/* Emergency Protocols */}
      <div className="stellar-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Emergency Protocols</h3>
          <button
            onClick={() => setShowEmergencyDialog(true)}
            className="stellar-button flex items-center space-x-2"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Trigger Protocol</span>
          </button>
        </div>
        
        {emergencyProtocols.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No active emergency protocols</p>
        ) : (
          <div className="space-y-3">
            {emergencyProtocols.map((protocol) => (
              <div key={protocol.protocol_id} className="border border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className={`w-4 h-4 ${getSeverityColor('high')}`} />
                    <span className="font-medium text-white">{protocol.protocol_type}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    protocol.status === 'completed' ? 'bg-green-900 text-green-300' :
                    protocol.status === 'failed' ? 'bg-red-900 text-red-300' :
                    'bg-yellow-900 text-yellow-300'
                  }`}>
                    {protocol.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Affected Nodes:</span>
                    <span className="ml-2 text-gray-300">{protocol.affected_nodes}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Est. Time:</span>
                    <span className="ml-2 text-gray-300">{protocol.estimated_completion_time_seconds}s</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Safety:</span>
                    <span className={`ml-2 ${protocol.safety_measures_active ? 'text-green-400' : 'text-red-400'}`}>
                      {protocol.safety_measures_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Node Grid */}
      <div className="stellar-card">
        <h3 className="text-lg font-semibold text-white mb-4">Node Grid</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {powerNodes.slice(0, 24).map((node) => (
            <button
              key={node.node_id}
              onClick={() => selectNode(node.node_id)}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                selectedNodeId === node.node_id 
                  ? 'border-cyan-400 bg-cyan-900/20' 
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className="text-center">
                <div className="text-lg font-bold text-white">#{node.node_id}</div>
                <div className={`text-xs px-2 py-1 rounded mt-1 ${getStatusColor(node.status)}`}>
                  {node.status}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {node.power_output_mw.toFixed(0)} MW
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Node Details */}
      {nodeDetails && (
        <div className="stellar-card">
          <h3 className="text-lg font-semibold text-white mb-4">
            Node #{nodeDetails.node_id} Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(nodeDetails.status)}`}>
                    {nodeDetails.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Efficiency:</span>
                  <span className="text-cyan-400">
                    {(nodeDetails.efficiency * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Temperature:</span>
                  <span className="text-cyan-400">
                    {nodeDetails.temperature_kelvin.toFixed(1)} K
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Power Output</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Current:</span>
                  <span className="text-amber-400">
                    {nodeDetails.power_output_mw.toFixed(1)} MW
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Maximum:</span>
                  <span className="text-gray-300">
                    {nodeDetails.max_capacity_mw.toFixed(1)} MW
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Utilization:</span>
                  <span className="text-cyan-400">
                    {((nodeDetails.power_output_mw / nodeDetails.max_capacity_mw) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3">Connections</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Connected Nodes:</span>
                  <span className="text-cyan-400">
                    {nodeDetails.connected_nodes.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Quantum Link:</span>
                  <span className={nodeDetails.quantum_entanglement_active ? 'text-green-400' : 'text-red-400'}>
                    {nodeDetails.quantum_entanglement_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Photonic Links:</span>
                  <span className="text-cyan-400">
                    {nodeDetails.photonic_links || 12}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Dialog */}
      {showEmergencyDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="stellar-card max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Trigger Emergency Protocol</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleEmergencyProtocol('safe_shutdown')}
                className="stellar-button w-full"
              >
                Safe Shutdown
              </button>
              <button
                onClick={() => handleEmergencyProtocol('emergency_power_reroute')}
                className="stellar-button w-full"
              >
                Emergency Power Reroute
              </button>
              <button
                onClick={() => handleEmergencyProtocol('quantum_isolation')}
                className="stellar-button w-full"
              >
                Quantum Isolation
              </button>
              <button
                onClick={() => setShowEmergencyDialog(false)}
                className="w-full py-2 px-4 border border-gray-700 rounded-lg text-gray-400 hover:text-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
