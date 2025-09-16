import { Effect, Context, Layer } from 'effect';
import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { notes } from '../db/schema.js';
import {
  Note,
  CreateNote,
  UpdateNote,
  NoteError,
  NoteNotFoundError,
  DatabaseError,
} from '../domain/index.js';

export interface NoteService {
  create: (note: CreateNote) => Effect.Effect<Note, NoteError>;
  findById: (id: number) => Effect.Effect<Note, NoteError>;
  findAll: () => Effect.Effect<Note[], NoteError>;
  update: (id: number, update: UpdateNote) => Effect.Effect<Note, NoteError>;
  delete: (id: number) => Effect.Effect<void, NoteError>;
}

export const NoteService = Context.GenericTag<NoteService>('NoteService');

const makeNoteService: Effect.Effect<NoteService> = Effect.gen(function* () {
  return {
    create: (note: CreateNote) =>
      Effect.tryPromise({
        try: async () => {
          const [newNote] = await db
            .insert(notes)
            .values({
              title: note.title,
              content: note.content,
            })
            .returning();
          return newNote as unknown as Note;
        },
        catch: (error) =>
          new DatabaseError({ message: 'Failed to create note', cause: error }),
      }),

    findById: (id: number) =>
      Effect.tryPromise({
        try: async () => {
          const [note] = await db.select().from(notes).where(eq(notes.id, id));
          if (!note) {
            throw new NoteNotFoundError({ noteId: id });
          }
          return note as unknown as Note;
        },
        catch: (error) =>
          error instanceof NoteNotFoundError
            ? error
            : new DatabaseError({
                message: 'Failed to find note',
                cause: error,
              }),
      }),

    findAll: () => Effect.promise(() => db.select().from(notes)),
    // Effect.tryPromise({
    //   try: async () => {
    //     const allNotes = await db
    //       .select()
    //       .from(notes)
    //       .orderBy(desc(notes.createdAt));
    //     return allNotes;
    //   },
    //   catch: (error) =>
    //     new DatabaseError({ message: 'Failed to fetch notes', cause: error }),
    // }),

    update: (id: number, update: UpdateNote) =>
      Effect.tryPromise({
        try: async () => {
          const updateData: Partial<{
            title: string;
            content: string;
            updatedAt: Date;
          }> = {
            updatedAt: new Date(),
          };

          if (update.title !== undefined) updateData.title = update.title;
          if (update.content !== undefined) updateData.content = update.content;

          const [updatedNote] = await db
            .update(notes)
            .set(updateData as unknown as Partial<typeof notes>)
            .where(eq(notes.id, id))
            .returning();

          if (!updatedNote) {
            throw new NoteNotFoundError({ noteId: id });
          }

          return updatedNote as unknown as Note;
        },
        catch: (error) =>
          error instanceof NoteNotFoundError
            ? error
            : new DatabaseError({
                message: 'Failed to update note',
                cause: error,
              }),
      }),

    delete: (id: number) =>
      Effect.tryPromise({
        try: async () => {
          const deleted = await db
            .delete(notes)
            .where(eq(notes.id, id))
            .returning({ id: notes.id });
          if (deleted.length === 0) {
            throw new NoteNotFoundError({ noteId: id });
          }
        },
        catch: (error) =>
          error instanceof NoteNotFoundError
            ? error
            : new DatabaseError({
                message: 'Failed to delete note',
                cause: error,
              }),
      }),
  };
});

export const NoteServiceLive = Layer.effect(NoteService, makeNoteService);
