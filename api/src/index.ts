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

// Merge API contract + handlers once
const NotesLive = Layer.provide(NotesApiLive, [
  NotesHandlersLive,
  RootHandlersLive,
]);

const ServerLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(NotesLive),
  Layer.provide(NodeFileSystem.layer),
  Layer.provide(NodePath.layer),
  HttpServer.withLogAddress,
  Layer.provide(NodeHttpServer.layer(createServer, { port, host })),
  Layer.provide(NoteServiceLive)
);

NodeRuntime.runMain()(Layer.launch(ServerLive));
