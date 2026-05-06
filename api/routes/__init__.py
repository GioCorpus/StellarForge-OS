"""
API Routes Module
==================

Rutas de la API Flask para telemetría del Dyson Swarm.
"""

from .telemetry import telemetry_bp
from .quantum import quantum_bp
from .swarm import swarm_bp

__all__ = ["telemetry_bp", "quantum_bp", "swarm_bp"]
