# Agent Handoff Protocol 🤖

**Welcome, Agent.**
You have been activated to work on the **Business CRM & Operations System**.
This codebase is **NOT** a sandbox. It is a strictly structured, multi-tenant application with complex security rules.

## Your First Instructions
1.  **Stop.** Do not write code yet.
2.  **Read** `TABLE_OF_CONTENTS.md` in this directory.
3.  **Read** `PROJECT_OVERVIEW.md` and `PHASES.md` to know where we stand.
4.  **Read** `DATABASE_SCHEMA.md` to understand the data constraints.

## Safety Checks
Before proposing any change, ask yourself:
1.  *Does this break RLS?* (e.g., Are you fetching data without a workspace filter? relying on frontend logic?)
2.  *Does this lock-in a schema change?* (Have you verified it against `DATABASE_SCHEMA.md`?)
3.  *Is this feature in a LOCKED phase?* (If so, refuse to change it unless explicitly ordered to fix a bug).

## How to Verify Your Work
- **Auth:** Can a new user sign up and get a workspace?
- **Isolation:** Can User A see User B's data? (Answer MUST be NO).
- **Integrity:** Can a Task exist without a Deal or Customer? (Answer MUST be NO).

**Good luck.** 🚀
