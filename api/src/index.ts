import 'dotenv/config';
import { Layer } from 'effect';
import { createServer } from 'http';
import { HttpApiBuilder, HttpMiddleware, HttpServer } from '@effect/platform';
import {
  NodeHttpServer,
  NodeRuntime,
  NodeFileSystem,
  NodePath,
} from '@effect/platform-node';

import {
  NotesApiLive,
  NotesHandlersLive,
  RootHandlersLive,
} from './http/api.js';
import { NoteServiceLive } from './services/index.js';

const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? '127.0.0.1';

// Configure CORS: accept origins from env (comma-separated) + WEB_ORIGIN + localhost for dev
const corsOriginsEnv = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const webOrigin = process.env.WEB_ORIGIN?.trim();
const allowedOrigins = Array.from(
  new Set([
    ...corsOriginsEnv,
    ...(webOrigin ? [webOrigin] : []),
    'http://localhost:5173',
    'https://localhost:5173',
  ])
);

// Merge API contract + handlers once
const NotesLive = Layer.provide(NotesApiLive, [
  NotesHandlersLive,
  RootHandlersLive,
]);

const ServerLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(HttpApiBuilder.middlewareCors({ allowedOrigins })),
  Layer.provide(NotesLive),
  Layer.provide(NodeFileSystem.layer),
  Layer.provide(NodePath.layer),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port, host })),
  Layer.provide(NoteServiceLive)
);

NodeRuntime.runMain()(Layer.launch(ServerLive));
