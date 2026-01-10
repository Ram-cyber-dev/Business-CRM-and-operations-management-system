# Architecture

## System Diagram
```mermaid
graph TD
    user[Browser / User] -->|HTTPS| next[Next.js App Router]
    
    subgraph "Server Layer (Vercel)"
        next -->|Server Components (Read)| sb_client[Supabase Client]
        next -->|Server Actions (Write)| sb_client
    end
    
    subgraph "Data Layer (Supabase)"
        sb_client -->|Auth Token| auth[Supabase Auth]
        sb_client -->|SQL Query| db[PostgreSQL]
        
        db -->|Enforce| rls[RLS Policies]
    end
```

## Key Principles

### 1. RLS as the Security Boundary
The application does not filter data manually in every query to ensure security. Instead, it relies on PostgreSQL **Row Level Security (RLS)**.
- **Policy:** `using (workspace_id = ...)`
- If a developer forgets to filter by `workspace_id` in a `select`, RLS ensures the user still sees *only* their own data.
- **Crucial:** We *do* filter explicitly in queries for performance (index usage), but RLS is the safety net.

### 2. Server Actions for Mutations
All CREATE, UPDATE, DELETE operations happen via Next.js Server Actions.
- **Validation:** Zod schemas validate input *before* it reaches the DB.
- **Authorization:** Actions implicitly use the authenticated user's session. RLS rejects unauthorized writes.

### 3. No Custom Backend
There is no separate Express/Node/Python backend. The "backend" acts as a thin proxy between the Client and Supabase, handling:
- Session management (Cookies)
- Input validation (Zod)
- Error transformation
