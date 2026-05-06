import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { useTelemetryStore } from './stores/telemetryStore';
import { useQuantumStore } from './stores/quantumStore';
import { useSwarmStore } from './stores/swarmStore';

// Components
import { Dashboard } from './components/Dashboard';
import { QuantumControl } from './components/QuantumControl';
import { SwarmStatus } from './components/SwarmStatus';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';

// STELLARFORGE: Main application component for Dyson Swarm control interface
const App: React.FC = () => {
  const { connectSocket, disconnectSocket } = useTelemetryStore();
  const { connectQuantumSocket } = useQuantumStore();
  const { connectSwarmSocket } = useSwarmStore();

  useEffect(() => {
    // Initialize WebSocket connections to telemetry API
    const socket: Socket = io('http://localhost:5000', {
      transports: ['websocket'],
      upgrade: false
    });

    socket.on('connect', () => {
      console.log('Connected to StellarForge OS telemetry API');
      connectSocket(socket);
      connectQuantumSocket(socket);
      connectSwarmSocket(socket);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from StellarForge OS telemetry API');
      disconnectSocket();
    });

    return () => {
      socket.disconnect();
    };
  }, [connectSocket, disconnectSocket, connectQuantumSocket, connectSwarmSocket]);

  return (
    <Router>
      <div className="min-h-screen bg-void text-gray-100">
        <Header />
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/quantum" element={<QuantumControl />} />
            <Route path="/swarm" element={<SwarmStatus />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
