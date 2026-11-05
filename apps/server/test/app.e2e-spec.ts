import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { eq } from 'drizzle-orm';
import { AppModule } from './../src/app.module.js';
import { db } from './../src/database/index.js';
import { events } from './../src/database/schema.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toHaveProperty('status', 'OK');
        expect(body).toHaveProperty('timestamp');
      });
  });

  it('/v1/ingest (POST)', async () => {
    const projectId = crypto.randomUUID();
    const eventId = `evt-${Date.now()}`;

    const res = await request(app.getHttpServer())
      .post('/v1/ingest')
      .send({
        projectId,
        eventId,
        eventName: 'page_view',
        eventType: 'page',
        sessionId: 'session-1',
        occurredAt: new Date().toISOString(),
        properties: { path: '/dashboard' },
      })
      .expect(202);

    expect(res.body).toHaveProperty('message');

    const rows = await db
      .select()
      .from(events)
      .where(eq(events.eventId, eventId));

    expect(rows).toHaveLength(1);
    expect(rows[0]?.projectId).toBe(projectId);
    expect(rows[0]?.eventName).toBe('page_view');
  });

  afterEach(async () => {
    await app.close();
  });
});
