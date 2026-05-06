"""
StellarForge OS Quantum Module
================================

Módulo cuántico para algoritmos de optimización Dyson Swarm.

Este módulo proporciona algoritmos cuánticos para:
- Optimización de red eléctrica (QAOA)
- Simulaciones moleculares (VQE) 
- Corrección de errores (GKP)
- Computación cuántica a escala estelar
"""

__version__ = "0.1.0"
__author__ = "Giovanny Anthony Corpus Bernal <gio.corpus@example.com>"

from .qaoa import PowerGridOptimizer
from .vqe import MolecularSimulator
from .gkp import GKPCorrector

__all__ = [
    "PowerGridOptimizer",
    "MolecularSimulator", 
    "GKPCorrector",
]
