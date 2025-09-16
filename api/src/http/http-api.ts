import { Schema } from '@effect/schema';

// Request/Response Schemas (contract)
export const CreateNoteRequest = Schema.Struct({
  title: Schema.String,
  content: Schema.String,
});

export const UpdateNoteRequest = Schema.Struct({
  title: Schema.optional(Schema.String),
  content: Schema.optional(Schema.String),
});

export const NoteResponse = Schema.Struct({
  id: Schema.Number,
  title: Schema.String,
  content: Schema.String,
  createdAt: Schema.String,
  updatedAt: Schema.String,
});

export const NotesResponse = Schema.Array(NoteResponse);

// Route metadata (helps keep paths/methods in one place)
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface HttpRoute {
  method: HttpMethod;
  path: string;
  handler: 'createNote' | 'getNotes' | 'getNote' | 'updateNote' | 'deleteNote';
}

export const NotesHttpApi: readonly HttpRoute[] = [
  { method: 'POST', path: '/notes', handler: 'createNote' },
  { method: 'GET', path: '/notes', handler: 'getNotes' },
  { method: 'GET', path: '/notes/:id', handler: 'getNote' },
  { method: 'PUT', path: '/notes/:id', handler: 'updateNote' },
  { method: 'DELETE', path: '/notes/:id', handler: 'deleteNote' },
];
