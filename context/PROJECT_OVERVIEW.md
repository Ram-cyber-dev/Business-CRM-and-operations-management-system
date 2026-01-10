# Project Overview

## Product Identity
**Name:** Business CRM & Operations System
**Type:** Multi-Tenant SaaS
**Status:** Feature Complete (Phases 1-5)

## Target Audience
- **Primary:** Small teams, startup founders, and service-based businesses.
- **Secondary:** Internal teams requiring typical CRUD operations (Customers, Deals, Tasks) with strict data isolation.

## Core Philosophy
1.  **Workspace-Based Multi-Tenancy:**
    - Every piece of data belongs to a `workspace`.
    - Data isolation is **absolute** and enforced at the database level.

2.  **Secure by Default:**
    - We do not rely on frontend logic for security.
    - We rely on **Row Level Security (RLS)** within PostgreSQL.

3.  **Production-Ready:**
    - No "demo-ware" or shortcuts.
    - Error handling, validation, and empty states are mandatory.

## Problems Solved
- **Customer Tracking:** Centralized directory of leads and active clients.
- **Deal Pipeline:** Visual tracking of revenue opportunities through stages.
- **Task Assignment:** Operational clarity on who needs to do what and when.
- **Operational Visibility:** Dashboard metrics to spot bottlenecks (e.g., overdue tasks).
