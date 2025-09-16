import { Effect } from 'effect';
import { Schema } from '@effect/schema';
import { NoteService } from '../services/index.js';
import {
  CreateNoteSchema,
  UpdateNoteSchema,
  ValidationError,
} from '../domain/index.js';
import { CreateNoteRequest, UpdateNoteRequest } from './http-api.js';

const handleCreateNote = (
  request: Schema.Schema.Type<typeof CreateNoteRequest>
) =>
  Effect.gen(function* () {
    const noteService = yield* NoteService;

    const createNote = yield* Effect.try({
      try: () => Schema.decodeUnknownSync(CreateNoteSchema)(request),
      catch: () => new ValidationError({ message: 'Invalid note data' }),
    });

    const note = yield* noteService.create(createNote);
    return note;
  });

const handleGetNote = (id: number) =>
  Effect.gen(function* () {
    const noteService = yield* NoteService;
    const note = yield* noteService.findById(id);
    return note;
  });

const handleGetNotes = () =>
  Effect.gen(function* () {
    const noteService = yield* NoteService;
    const notes = yield* noteService.findAll();
    return notes;
  });

const handleUpdateNote = (
  id: number,
  request: Schema.Schema.Type<typeof UpdateNoteRequest>
) =>
  Effect.gen(function* () {
    const noteService = yield* NoteService;

    const updateNote = yield* Effect.try({
      try: () => Schema.decodeUnknownSync(UpdateNoteSchema)(request),
      catch: () => new ValidationError({ message: 'Invalid update data' }),
    });

    const note = yield* noteService.update(id, updateNote);
    return note;
  });

const handleDeleteNote = (id: number) =>
  Effect.gen(function* () {
    const noteService = yield* NoteService;
    yield* noteService.delete(id);
  });

export const createHandlers = () => {
  const createNote = (request: unknown) =>
    handleCreateNote(request as Schema.Schema.Type<typeof CreateNoteRequest>);
  const getNote = (id: string) => handleGetNote(Number(id));
  const getNotes = () => handleGetNotes();
  const updateNote = (id: string, request: unknown) =>
    handleUpdateNote(
      Number(id),
      request as Schema.Schema.Type<typeof UpdateNoteRequest>
    );
  const deleteNote = (id: string) => handleDeleteNote(Number(id));

  return {
    createNote,
    getNote,
    getNotes,
    updateNote,
    deleteNote,
  };
};
