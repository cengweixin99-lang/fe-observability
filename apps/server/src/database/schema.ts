import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  publicKey: text("public_key").notNull().unique(),
  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const events = pgTable(
  "events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    projectId: uuid("project_id")
      .notNull()
      .references(() => projects.id),
    eventId: text("event_id").notNull(),
    eventName: text("event_name").notNull(),
    eventType: text("event_type").notNull(),
    sessionId: text("session_id").notNull(),
    occurredAt: timestamp("occurred_at", {
      withTimezone: true,
    }).notNull(),
    receivedAt: timestamp("received_at", {
      withTimezone: true,
    })
      .defaultNow()
      .notNull(),
    properties: jsonb("properties")
      .$type<Record<string, unknown>>()
      .notNull()
      .default({}),
  },
  (table) => [
    uniqueIndex("events_project_event_unique").on(
      table.projectId,
      table.eventId,
    ),
    index("events_project_occurred_at_idx").on(
      table.projectId,
      table.occurredAt,
    ),
  ],
);