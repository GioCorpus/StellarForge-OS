# StellarForge OS — Reglas Globales del Proyecto

## Identidad
- Proyecto: StellarForge OS
- Autor: Giovanny Anthony Corpus Bernal (@GioCorpus)
- Ubicación: Mexicali, Baja California, México
- Misión: Sistema operativo cuántico-fotónico para civilización Kardashev Tipo II

## Convenciones de Código

### Rust (Kernel)
- Edición: 2021
- No `unwrap()` en código de producción. Usa `?`, `expect("razón")`, o manejo explícito.
- `#![deny(unsafe_code)]` en módulos de alto nivel. `unsafe` solo en drivers con comentario obligatorio.
- Nombres: `snake_case` para funciones/variables, `CamelCase` para tipos, `SCREAMING_SNAKE_CASE` para constantes.
- Módulos del kernel: `forge_kernel::`, `forge_photonic::`, `forge_quantum::`, `forge_storage::`, `forge_telemetry::`.

### Python (Quantum + API)
- Python ≥ 3.11
- Type hints en todas las funciones públicas.
- Qiskit ≥ 1.0 (API unificada, no legacy `QuantumCircuit.execute()`).
- Constantes cuánticas: usa `scipy.constants` cuando aplique.

### TypeScript / React (Dashboard)
- Strict mode: `"strict": true` en tsconfig.
- No `any`. Si es necesario, `unknown` + type guard.
- Componentes: PascalCase. Hooks: camelCase con prefijo `use`.
- Colores del tema: `--color-void: #0a0a0f`, `--color-amber: #f59e0b`, `--color-cyan: #06b6d4`.

## Estructura de Directorios (Canónica)
```
StellarForge-OS/
├── kernel/              # Rust — núcleo del sistema
│   ├── src/
│   │   ├── main.rs
│   │   ├── photonic/    # Driver fotónico
│   │   ├── quantum/     # Interfaz con QPU
│   │   ├── storage/     # Cuarzo 4D
│   │   └── scheduler/   # Scheduler cuántico
│   └── Cargo.toml
├── quantum/             # Python — algoritmos cuánticos
│   ├── qaoa/            # Balanceo de red eléctrica
│   ├── vqe/             # Simulaciones moleculares
│   ├── gkp/             # Corrección de errores
│   └── requirements.txt
├── api/                 # Python Flask — telemetría
│   ├── app.py
│   ├── routes/
│   └── models/
├── dashboard/           # React + TypeScript
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── iso/                 # Scripts de generación ISO Arch Linux
├── docs/                # Documentación técnica + papers de referencia
├── .kilo/               # Configuración Kilo Code
│   └── agents/
└── README.md
```

## Git
- Branch principal: `main`
- Features: `feat/nombre-descriptivo`
- Fixes: `fix/nombre-descriptivo`
- Commits: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`)
- Ejemplo: `feat(kernel): add GKP error correction module for photonic layer`

## Comentarios de Alta Prioridad
- `// STELLARFORGE: <razón>` — decisión de diseño importante
- `// TODO: QPU` — requiere hardware cuántico real
- `// TECH-DEBT: <descripción>` — deuda técnica identificada
- `// PERF: <métrica>` — sección crítica de rendimiento

## Idioma
- Documentación de alto nivel y docstrings de módulos: **español técnico**
- Comentarios inline de código, nombres de variables/funciones: **inglés técnico**
- Commits de Git: **inglés técnico**
