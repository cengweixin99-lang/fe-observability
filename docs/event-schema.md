# Event Schema

## Rules

- Every event has a unique eventId.
- schemaVersion identifies the event protocol version.
- Timestamps use Unix milliseconds.
- sessionId identifies a browsing session, not an authenticated user.
- Do not collect passwords, tokens, or full AI conversations by default.
- Server-side validation is mandatory.