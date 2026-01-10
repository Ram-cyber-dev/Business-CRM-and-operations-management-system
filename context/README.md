# Project Context
> **CRITICAL:** Any AI agent or developer **MUST** read this folder before writing or modifying code.

## Purpose
This folder serves as the **Single Source of Truth** for the Business CRM & Operations System. It documents:
- The product vision and architecture.
- The locked database schema and security model (RLS).
- The completion status of development phases.
- Strict rules for extending the codebase.

## Why is this important?
This project uses a rigorous **Multi-Tenant RLS Architecture**.
- **Regressions** in RLS policies can expose private data across workspaces.
- **Schema Drift** can break the strictly typed frontend/backend contracts.
- **Ad-hoc Changes** to locked phases can undermine the stability of the core platform.

By internalizing the context in this folder, you ensure that your contributions are safe, consistent, and aligned with the project's long-term goals.

**Do not ignore these documents. They are the law of this codebase.**
