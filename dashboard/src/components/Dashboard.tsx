import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Zap, Activity, Shield, Cpu, TrendingUp, AlertTriangle } from 'lucide-react';
import { useTelemetryStore } from '../stores/telemetryStore';
import { useQuantumStore } from '../stores/quantumStore';

// STELLARFORGE: Main dashboard component for Dyson Swarm overview
export const Dashboard: React.FC = () => {
  const { 
    powerNodes, 
    quantumMetrics, 
    swarmStatus, 
    systemMetrics,
    recentEvents 
  } = useTelemetryStore();
  
  const { activeOptimizations, quantumStatus } = useQuantumStore();

  // Sample data for charts (would be real-time data)
  const powerData = [
    { time: '00:00', output: 820 },
    { time: '04:00', output: 785 },
    { time: '08:00', output: 912 },
    { time: '12:00', output: 895 },
    { time: '16:00', output: 868 },
    { time: '20:00', output: 847 },
  ];

  const quantumData = [
    { time: '00:00', coherence: 0.98, advantage: 1.15 },
    { time: '04:00', coherence: 0.97, advantage: 1.14 },
    { time: '08:00', coherence: 0.99, advantage: 1.16 },
    { time: '12:00', coherence: 0.96, advantage: 1.13 },
    { time: '16:00', coherence: 0.98, advantage: 1.15 },
    { time: '20:00', coherence: 0.95, advantage: 1.12 },
  ];

  const MetricCard = ({ 
    title, 
    value, 
    unit, 
    icon: Icon, 
    trend, 
    color = 'cyan' 
  }: {
    title: string;
    value: string | number;
    unit?: string;
    icon: any;
    trend?: number;
    color?: string;
  }) => (
    <div className="stellar-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-400 text-sm font-medium">{title}</h3>
        <Icon className={`w-5 h-5 text-${color}-400`} />
      </div>
      <div className="flex items-baseline space-x-2">
        <span className={`text-2xl font-bold text-${color}-400`}>{value}</span>
        {unit && <span className="text-gray-400 text-sm">{unit}</span>}
        {trend && (
          <div className={`flex items-center text-xs ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            <TrendingUp className="w-3 h-3 mr-1" />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dyson Swarm Overview</h1>
        <p className="text-gray-400">Real-time monitoring and control of stellar-scale infrastructure</p>
      </div>

      {/* Metrics Grid */}
      <div className="dashboard-grid">
        <MetricCard
          title="Total Power Output"
          value={swarmStatus?.total_power_output_gw || 847.5}
          unit="GW"
          icon={Zap}
          trend={2.3}
        />
        
        <MetricCard
          title="Active Nodes"
          value={swarmStatus?.active_nodes || 942}
          unit={`/ ${swarmStatus?.total_nodes || 1000}`}
          icon={Activity}
          trend={-0.5}
        />
        
        <MetricCard
          title="Grid Stability"
          value={((swarmStatus?.grid_stability || 0.92) * 100).toFixed(1)}
          unit="%"
          icon={Shield}
          trend={1.2}
        />
        
        <MetricCard
          title="QPU Utilization"
          value={((quantumMetrics?.qpu_utilization || 0.85) * 100).toFixed(1)}
          unit="%"
          icon={Cpu}
          trend={3.1}
          color="purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Power Output Chart */}
        <div className="stellar-card">
          <h3 className="text-lg font-semibold text-white mb-4">Power Output (24h)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={powerData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Area 
                type="monotone" 
                dataKey="output" 
                stroke="#06B6D4" 
                fill="#06B6D4" 
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quantum Performance Chart */}
        <div className="stellar-card">
          <h3 className="text-lg font-semibold text-white mb-4">Quantum Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={quantumData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Line 
                type="monotone" 
                dataKey="coherence" 
                stroke="#D946EF" 
                strokeWidth={2}
                dot={false}
                name="Coherence"
              />
              <Line 
                type="monotone" 
                dataKey="advantage" 
                stroke="#06B6D4" 
                strokeWidth={2}
                dot={false}
                name="Quantum Advantage"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* System Status and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Status */}
        <div className="stellar-card">
          <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">QPU Temperature</span>
              <span className="text-cyan-400 font-mono">
                {quantumStatus?.qpu_temperature_kelvin || 0.015} mK
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Coherence Time</span>
              <span className="text-cyan-400 font-mono">
                {quantumMetrics?.coherence_time_ms || 2.5} ms
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Gate Fidelity</span>
              <span className="text-cyan-400 font-mono">
                {((quantumMetrics?.gate_fidelity || 0.998) * 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Active Optimizations</span>
              <span className="text-purple-400 font-mono">{activeOptimizations.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Error Correction</span>
              <span className={`font-mono ${quantumStatus?.error_correction_active ? 'text-green-400' : 'text-red-400'}`}>
                {quantumStatus?.error_correction_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="stellar-card">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Events</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentEvents.length === 0 ? (
              <p className="text-gray-500 text-sm">No recent events</p>
            ) : (
              recentEvents.slice(0, 5).map((event) => (
                <div key={event.event_id} className="flex items-start space-x-3 p-2 rounded bg-gray-800/50">
                  <AlertTriangle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                    event.severity === 'critical' ? 'text-red-400' :
                    event.severity === 'high' ? 'text-orange-400' :
                    event.severity === 'medium' ? 'text-yellow-400' :
                    'text-gray-400'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 truncate">{event.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
