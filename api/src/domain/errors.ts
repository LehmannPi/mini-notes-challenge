import { Data } from 'effect';

export class NoteNotFoundError extends Data.TaggedError('NoteNotFoundError')<{
  readonly noteId: number;
}> {}

export class ValidationError extends Data.TaggedError('ValidationError')<{
  readonly message: string;
  readonly field?: string;
}> {}

export class DatabaseError extends Data.TaggedError('DatabaseError')<{
  readonly message: string;
  readonly cause?: unknown;
}> {}

export type NoteError = NoteNotFoundError | ValidationError | DatabaseError;
