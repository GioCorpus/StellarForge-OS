"""
Quantum Data Models
===================

Modelos Pydantic para datos y operaciones cuánticas.
"""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


class QuantumAlgorithm(str, Enum):
    """Supported quantum algorithms"""
    QAOA = "qaoa"
    VQE = "vqe"
    GROVER = "grover"
    SHOR = "shor"
    GKP = "gkp"
    CUSTOM = "custom"


class TaskPriority(str, Enum):
    """Task priority levels"""
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class QuantumState(BaseModel):
    """Model for quantum state representation"""
    state_id: str = Field(..., description="Unique state identifier")
    num_qubits: int = Field(..., gt=0, description="Number of qubits")
    amplitudes: List[complex] = Field(..., description="Quantum amplitudes")
    fidelity: float = Field(..., ge=0, le=1, description="State fidelity")
    coherence_time_ms: float = Field(..., ge=0, description="Coherence time")
    error_rate: float = Field(..., ge=0, le=1, description="Error rate")
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class OptimizationRequest(BaseModel):
    """Model for quantum optimization requests"""
    request_id: str = Field(..., description="Unique request identifier")
    algorithm: QuantumAlgorithm = Field(..., description="Algorithm to use")
    priority: TaskPriority = Field(default=TaskPriority.MEDIUM, description="Task priority")
    parameters: Dict[str, Any] = Field(..., description="Algorithm parameters")
    max_execution_time_ms: float = Field(default=1000.0, description="Maximum execution time")
    qubits_required: int = Field(..., gt=0, description="Number of qubits required")
    error_threshold: float = Field(default=0.01, description="Acceptable error threshold")
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class OptimizationResult(BaseModel):
    """Model for quantum optimization results"""
    result_id: str = Field(..., description="Unique result identifier")
    request_id: str = Field(..., description="Original request ID")
    algorithm: QuantumAlgorithm = Field(..., description="Algorithm used")
    status: str = Field(..., regex="^(completed|failed|timeout)$")
    execution_time_ms: float = Field(..., ge=0, description="Actual execution time")
    quantum_advantage: Optional[float] = Field(None, ge=1, description="Quantum advantage factor")
    objective_value: Optional[float] = Field(None, description="Optimization objective value")
    solution: Optional[Dict[str, Any]] = Field(None, description="Optimal solution")
    error_message: Optional[str] = Field(None, description="Error message if failed")
    fidelity: float = Field(..., ge=0, le=1, description="Result fidelity")
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class MolecularSimulation(BaseModel):
    """Model for molecular simulation parameters"""
    molecule_name: str = Field(..., description="Molecule name")
    atoms: List[Dict[str, Any]] = Field(..., description="Atomic composition")
    spin: int = Field(..., description="Total spin")
    charge: int = Field(..., description="Total charge")
    basis_set: str = Field(default="sto-3g", description="Basis set")
    method: str = Field(default="vqe", description="Simulation method")


class MolecularResult(BaseModel):
    """Model for molecular simulation results"""
    result_id: str = Field(..., description="Unique result identifier")
    molecule_name: str = Field(..., description="Molecule name")
    ground_state_energy: float = Field(..., description="Ground state energy (Hartree)")
    dipole_moment: tuple[float, float, float] = Field(..., description="Dipole moment")
    molecular_orbitals: List[float] = Field(..., description="Molecular orbital energies")
    convergence_achieved: bool = Field(..., description="Convergence status")
    execution_time_ms: float = Field(..., ge=0, description="Execution time")
    fidelity: float = Field(..., ge=0, le=1, description="Result fidelity")
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class ErrorCorrectionResult(BaseModel):
    """Model for quantum error correction results"""
    correction_id: str = Field(..., description="Unique correction identifier")
    state_id: str = Field(..., description="Original state ID")
    correction_method: str = Field(..., description="Error correction method")
    errors_detected: bool = Field(..., description="Whether errors were detected")
    corrections_applied: int = Field(..., ge=0, description="Number of corrections applied")
    fidelity_before: float = Field(..., ge=0, le=1, description="Fidelity before correction")
    fidelity_after: float = Field(..., ge=0, le=1, description="Fidelity after correction")
    processing_time_ms: float = Field(..., ge=0, description="Processing time")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
