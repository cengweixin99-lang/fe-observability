import { BadRequestException, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../database/index.js';
import { events, projects } from '../database/schema.js';

@Injectable()
export class IngestionService {
  async ingest(body: unknown) {
    if (!body || typeof body !== 'object') {
      throw new BadRequestException('Request body must be an object.');
    }

    const payload = body as Record<string, unknown>;
    const projectIdValue = payload.projectId ?? payload.projectKey;
    const requiredFields = ['eventId', 'eventName', 'eventType', 'sessionId', 'occurredAt'];

    if (projectIdValue === undefined || projectIdValue === null || `${projectIdValue}`.trim() === '') {
      throw new BadRequestException('Missing required field: projectId or projectKey');
    }

    for (const field of requiredFields) {
      if (payload[field] === undefined || payload[field] === null || `${payload[field]}`.trim() === '') {
        throw new BadRequestException(`Missing required field: ${field}`);
      }
    }

    const projectKey = `${payload.projectKey ?? `public-${projectIdValue}`}`.trim();
    const projectId = `${projectIdValue}`.trim();
    const eventId = `${payload.eventId}`.trim();
    const eventName = `${payload.eventName}`.trim();
    const eventType = `${payload.eventType}`.trim();
    const sessionId = `${payload.sessionId}`.trim();
    const occurredAtValue = `${payload.occurredAt}`;
    const properties = payload.properties && typeof payload.properties === 'object'
      ? (payload.properties as Record<string, unknown>)
      : {};

    const occurredAt = new Date(occurredAtValue);
    if (Number.isNaN(occurredAt.getTime())) {
      throw new BadRequestException('occurredAt must be a valid ISO timestamp.');
    }

    let resolvedProjectId = projectId;

    if (payload.projectKey) {
      const matchedProjects = await db
        .select()
        .from(projects)
        .where(eq(projects.publicKey, projectKey))
        .limit(1)
        .execute();

      if (matchedProjects.length > 0) {
        resolvedProjectId = matchedProjects[0].id;
      }
    }

    if (projectId !== resolvedProjectId && !payload.projectKey) {
      await db.insert(projects)
        .values({
          id: resolvedProjectId,
          name: `Project ${resolvedProjectId}`,
          publicKey: projectKey,
        })
        .onConflictDoNothing({ target: [projects.id] })
        .execute();
    }

    if (!payload.projectKey && projectId !== resolvedProjectId) {
      const existingProject = await db
        .select()
        .from(projects)
        .where(eq(projects.id, resolvedProjectId))
        .limit(1)
        .execute();

      if (existingProject.length === 0) {
        throw new BadRequestException(`Project ${resolvedProjectId} is not valid.`);
      }
    }

    await db.insert(projects)
      .values({
        id: resolvedProjectId,
        name: `Project ${resolvedProjectId}`,
        publicKey: projectKey,
      })
      .onConflictDoNothing({ target: [projects.id] })
      .execute();

    await db.insert(events)
      .values({
        projectId: resolvedProjectId,
        eventId,
        eventName,
        eventType,
        sessionId,
        occurredAt,
        properties,
      })
      .onConflictDoNothing({ target: [events.projectId, events.eventId] })
      .execute();

    return {
      message: 'Data ingested successfully',
      projectId: resolvedProjectId,
      eventId,
    };
  }
}
