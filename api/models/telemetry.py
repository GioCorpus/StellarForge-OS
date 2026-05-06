"""
Telemetry Data Models
=====================

Modelos Pydantic para datos de telemetría del Dyson Swarm.
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class PowerNode(BaseModel):
    """Model for power node telemetry data"""
    node_id: int = Field(..., description="Unique node identifier")
    position: tuple[float, float, float] = Field(..., description="3D coordinates in AU")
    power_output_mw: float = Field(..., ge=0, description="Power output in megawatts")
    max_capacity_mw: float = Field(..., gt=0, description="Maximum capacity in megawatts")
    efficiency: float = Field(..., ge=0, le=1, description="Efficiency ratio")
    temperature_kelvin: float = Field(..., gt=0, description="Operating temperature")
    status: str = Field(..., regex="^(active|standby|maintenance|critical)$")
    last_update: datetime = Field(default_factory=datetime.utcnow)
    connected_nodes: List[int] = Field(default_factory=list)
    quantum_entanglement_active: bool = Field(default=True)


class QuantumMetrics(BaseModel):
    """Model for quantum system performance metrics"""
    qpu_utilization: float = Field(..., ge=0, le=1, description="QPU utilization ratio")
    quantum_advantage: float = Field(..., ge=1, description="Quantum advantage factor")
    error_rate: float = Field(..., ge=0, le=1, description="Quantum error rate")
    gate_fidelity: float = Field(..., ge=0, le=1, description="Average gate fidelity")
    coherence_time_ms: float = Field(..., ge=0, description="Coherence time in milliseconds")
    error_correction_active: bool = Field(default=True)
    active_algorithms: List[str] = Field(default_factory=list)
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class TelemetryEvent(BaseModel):
    """Model for telemetry events"""
    event_id: str = Field(..., description="Unique event identifier")
    event_type: str = Field(..., description="Type of event")
    severity: str = Field(..., regex="^(low|medium|high|critical)$")
    node_id: Optional[int] = Field(None, description="Associated node ID")
    message: str = Field(..., description="Event description")
    metadata: dict = Field(default_factory=dict)
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class TelemetryData(BaseModel):
    """Container for all telemetry data"""
    power_nodes: List[PowerNode]
    quantum_metrics: QuantumMetrics
    recent_events: List[TelemetryEvent]
    system_timestamp: datetime = Field(default_factory=datetime.utcnow)
