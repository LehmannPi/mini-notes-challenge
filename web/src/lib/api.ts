export type Note = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

const BASE = '/api';

async function request<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
    ...init,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

export const api = {
  listNotes: () => request<Note[]>(`${BASE}/notes`),
  getNote: (id: number) => request<Note>(`${BASE}/notes/${id}`),
  createNote: (data: { title: string; content: string }) =>
    request<Note>(`${BASE}/notes`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateNote: (id: number, data: { title?: string; content?: string }) =>
    request<Note>(`${BASE}/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteNote: (id: number) =>
    request<void>(`${BASE}/notes/${id}`, { method: 'DELETE' }),
};
