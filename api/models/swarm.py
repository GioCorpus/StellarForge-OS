"""
Swarm Data Models
=================

Modelos Pydantic para datos del Dyson Swarm.
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class NodeStatus(BaseModel):
    """Model for individual node status"""
    node_id: int = Field(..., description="Unique node identifier")
    status: str = Field(..., regex="^(active|standby|maintenance|critical|offline)$")
    position: tuple[float, float, float] = Field(..., description="3D coordinates in AU")
    power_output_mw: float = Field(..., ge=0, description="Current power output")
    max_capacity_mw: float = Field(..., gt=0, description="Maximum capacity")
    efficiency: float = Field(..., ge=0, le=1, description="Operating efficiency")
    temperature_kelvin: float = Field(..., gt=0, description="Operating temperature")
    last_maintenance: Optional[datetime] = Field(None, description="Last maintenance timestamp")
    connected_nodes: List[int] = Field(default_factory=list, description="Connected node IDs")
    quantum_entanglement_active: bool = Field(default=True, description="Quantum link status")
    photonic_links: int = Field(default=0, description="Number of active photonic links")
    uptime_hours: float = Field(default=0, description="Uptime in hours")
    error_count_24h: int = Field(default=0, description="Errors in last 24 hours")


class SwarmMetrics(BaseModel):
    """Model for swarm-wide metrics"""
    total_nodes: int = Field(..., description="Total number of nodes")
    active_nodes: int = Field(..., description="Number of active nodes")
    standby_nodes: int = Field(default=0, description="Number of standby nodes")
    maintenance_nodes: int = Field(default=0, description="Number of nodes under maintenance")
    critical_nodes: int = Field(default=0, description="Number of critical nodes")
    offline_nodes: int = Field(default=0, description="Number of offline nodes")
    total_power_output_gw: float = Field(..., ge=0, description="Total power output in gigawatts")
    max_capacity_gw: float = Field(..., gt=0, description="Maximum capacity in gigawatts")
    grid_stability: float = Field(..., ge=0, le=1, description="Grid stability ratio")
    quantum_efficiency: float = Field(..., ge=0, le=1, description="Quantum system efficiency")
    photonic_link_quality: float = Field(..., ge=0, le=1, description="Photonic network quality")
    average_efficiency: float = Field(..., ge=0, le=1, description="Average node efficiency")
    average_temperature_kelvin: float = Field(..., gt=0, description="Average temperature")


class EmergencyProtocol(BaseModel):
    """Model for emergency protocol actions"""
    protocol_id: str = Field(..., description="Unique protocol identifier")
    protocol_type: str = Field(..., description="Type of emergency protocol")
    status: str = Field(..., regex="^(initiated|in_progress|completed|failed)$")
    affected_nodes: int = Field(..., description="Number of affected nodes")
    estimated_completion_time_seconds: float = Field(..., description="Estimated completion time")
    safety_measures_active: bool = Field(default=True, description="Safety measures status")
    initiated_by: str = Field(..., description="Who initiated the protocol")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: dict = Field(default_factory=dict)


class SwarmStatus(BaseModel):
    """Complete swarm status model"""
    metrics: SwarmMetrics
    nodes: List[NodeStatus]
    emergency_protocols_active: bool = Field(default=False)
    last_full_scan: datetime = Field(default_factory=datetime.utcnow)
    system_timestamp: datetime = Field(default_factory=datetime.utcnow)
    alerts: List[str] = Field(default_factory=list, description="Active system alerts")
