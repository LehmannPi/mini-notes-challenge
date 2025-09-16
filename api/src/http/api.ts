import { Effect } from 'effect';
import {
  HttpApi,
  HttpApiGroup,
  HttpApiEndpoint,
  HttpApiBuilder,
  HttpApiSchema,
  HttpServerResponse,
} from '@effect/platform';
import * as S from 'effect/Schema';

import { NoteService } from '../services/index.js';

// Define endpoints
const HomeResponse = S.Struct({ message: S.String });

const Home = HttpApiEndpoint.get('home', '/').addSuccess(HomeResponse);
const NoteResponse = S.Struct({
  id: S.Number,
  title: S.String,
  content: S.String,
  createdAt: S.Date,
  updatedAt: S.Date,
});

const NotesResponse = S.Array(NoteResponse);

const CreateNoteRequest = S.Struct({
  title: S.String,
  content: S.String,
});

const UpdateNoteRequest = S.Struct({
  title: S.optional(S.String),
  content: S.optional(S.String),
});

const GetNotes = HttpApiEndpoint.get('getNotes', '/notes').addSuccess(
  NotesResponse
);

const GetNote = HttpApiEndpoint.get('getNote')`/notes/${HttpApiSchema.param(
  'id',
  S.NumberFromString
)}`.addSuccess(NoteResponse);

const CreateNote = HttpApiEndpoint.post('createNote', '/notes')
  .setPayload(CreateNoteRequest)
  .addSuccess(NoteResponse, { status: 201 });

const UpdateNote = HttpApiEndpoint.put(
  'updateNote'
)`/notes/${HttpApiSchema.param('id', S.NumberFromString)}`
  .setPayload(UpdateNoteRequest)
  .addSuccess(NoteResponse);

const DeleteNote = HttpApiEndpoint.del(
  'deleteNote'
)`/notes/${HttpApiSchema.param('id', S.NumberFromString)}`.addSuccess(
  HttpApiSchema.NoContent,
  { status: 204 }
);

// Group and API
const RootGroup = HttpApiGroup.make('root').add(Home);

const NotesGroup = HttpApiGroup.make('notes')
  .add(GetNotes)
  .add(GetNote)
  .add(CreateNote)
  .add(UpdateNote)
  .add(DeleteNote);

const NotesApi = HttpApi.make('notes-api').add(RootGroup).add(NotesGroup);

export const NotesApiLive = HttpApiBuilder.api(NotesApi);

export const NotesHandlersLive = HttpApiBuilder.group(
  NotesApi,
  'notes',
  (handlers) =>
    handlers
      .handle('getNotes', () =>
        Effect.gen(function* () {
          const svc = yield* NoteService;
          const notes = yield* svc.findAll();
          return notes;
        }).pipe(
          Effect.catchAll(() =>
            Effect.succeed(
              HttpServerResponse.unsafeJson(
                { message: 'Failed to fetch notes' },
                { status: 500 }
              )
            )
          )
        )
      )
      .handle('getNote', (req) =>
        Effect.gen(function* () {
          const svc = yield* NoteService;
          const note = yield* svc.findById(req.path.id);
          return note;
        }).pipe(
          Effect.catchAll(() =>
            Effect.succeed(
              HttpServerResponse.unsafeJson(
                { message: 'Note not found' },
                { status: 404 }
              )
            )
          )
        )
      )
      .handle('createNote', (req) =>
        Effect.gen(function* () {
          const svc = yield* NoteService;
          const note = yield* svc.create(req.payload);
          return note;
        }).pipe(
          Effect.catchAll(() =>
            Effect.succeed(
              HttpServerResponse.unsafeJson(
                { message: 'Failed to create note' },
                { status: 500 }
              )
            )
          )
        )
      )
      .handle('updateNote', (req) =>
        Effect.gen(function* () {
          const svc = yield* NoteService;
          const note = yield* svc.update(req.path.id, req.payload);
          return note;
        }).pipe(
          Effect.catchTag('NoteNotFoundError', () =>
            Effect.succeed(
              HttpServerResponse.unsafeJson(
                { message: 'Note not found' },
                { status: 404 }
              )
            )
          ),
          Effect.catchAll(() =>
            Effect.succeed(
              HttpServerResponse.unsafeJson(
                { message: 'Failed to update note' },
                { status: 500 }
              )
            )
          )
        )
      )
      .handle('deleteNote', (req) =>
        Effect.gen(function* () {
          const svc = yield* NoteService;
          yield* svc.delete(req.path.id);
          return undefined as void;
        }).pipe(
          Effect.catchTag('NoteNotFoundError', () =>
            Effect.succeed(
              HttpServerResponse.unsafeJson(
                { message: 'Note not found' },
                { status: 404 }
              )
            )
          ),
          Effect.catchAll(() =>
            Effect.succeed(
              HttpServerResponse.unsafeJson(
                { message: 'Failed to delete note' },
                { status: 500 }
              )
            )
          )
        )
      )
);

export const RootHandlersLive = HttpApiBuilder.group(
  NotesApi,
  'root',
  (handlers) =>
    handlers.handle('home', () =>
      Effect.succeed({ message: 'Welcome to Mini-Notes API. Use /notes' })
    )
);
