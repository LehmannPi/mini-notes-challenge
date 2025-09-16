import { Schema } from '@effect/schema';

export const NoteSchema = Schema.Struct({
  id: Schema.Number,
  title: Schema.String,
  content: Schema.String,
  createdAt: Schema.Date,
  updatedAt: Schema.Date,
});

export const CreateNoteSchema = Schema.Struct({
  title: Schema.String.pipe(Schema.minLength(1), Schema.maxLength(200)),
  content: Schema.String.pipe(Schema.minLength(1), Schema.maxLength(5000)),
});

export const UpdateNoteSchema = Schema.Struct({
  title: Schema.optional(
    Schema.String.pipe(Schema.minLength(1), Schema.maxLength(200))
  ),
  content: Schema.optional(
    Schema.String.pipe(Schema.minLength(1), Schema.maxLength(5000))
  ),
});

export type Note = Schema.Schema.Type<typeof NoteSchema>;
export type CreateNote = Schema.Schema.Type<typeof CreateNoteSchema>;
export type UpdateNote = Schema.Schema.Type<typeof UpdateNoteSchema>;
