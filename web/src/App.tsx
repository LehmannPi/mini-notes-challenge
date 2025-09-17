import { useEffect, useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { api, type Note } from '@/lib/api';
import { FlowerLogo } from '@/components/FlowerLogo';

function PostIt({
  note,
  onEdit,
  onDelete,
}: {
  note: Note;
  onEdit: (n: Note) => void;
  onDelete: (n: Note) => void;
}) {
  return (
    <div className="relative rounded-md shadow hover:shadow-lg transition-shadow bg-muted text-yellow-950 p-4 rotate-[-1deg] min-w-[220px] max-w-[280px] break-words h-full">
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#C1D9C3] drop-shadow-accent-foreground rounded-full shadow" />
      <div className="space-y-2">
        <div className="font-semibold text-lg">{note.title}</div>
        <div className="text-sm whitespace-pre-wrap">{note.content}</div>
      </div>
      <div className="mt-3 flex gap-2 align-bottom">
        <Button size="sm" variant="ghost" onClick={() => onEdit(note)}>
          Edit
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onDelete(note)}>
          Delete
        </Button>
      </div>
    </div>
  );
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'create' | 'update' | 'delete'>(
    'create'
  );

  // Create form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Update/Delete selection
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selectedNote = useMemo(
    () => notes.find((n) => n.id === selectedId) || null,
    [notes, selectedId]
  );
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const [confirmDelete, setConfirmDelete] = useState<Note | null>(null);

  useEffect(() => {
    void refresh();
  }, []);

  async function refresh() {
    try {
      setLoading(true);
      setError(null);
      const data = await api.listNotes();
      setNotes(data);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError(null);
      const created = await api.createNote({ title, content });
      setNotes((prev) => [created, ...prev]);
      setTitle('');
      setContent('');
      setActiveTab('update');
      setSelectedId(created.id);
      setEditTitle(created.title);
      setEditContent(created.content);
    } catch (e) {
      setError((e as Error).message);
    }
  }

  function startEdit(note: Note) {
    setActiveTab('update');
    setSelectedId(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId) return;
    try {
      setError(null);
      const updated = await api.updateNote(selectedId, {
        title: editTitle,
        content: editContent,
      });
      setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    } catch (e) {
      setError((e as Error).message);
    }
  }

  async function confirmDeleteNow() {
    if (!confirmDelete) return;
    try {
      await api.deleteNote(confirmDelete.id);
      setNotes((prev) => prev.filter((n) => n.id !== confirmDelete.id));
      if (selectedId === confirmDelete.id) {
        setSelectedId(null);
        setEditTitle('');
        setEditContent('');
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setConfirmDelete(null);
    }
  }

  return (
    <div className="min-h-dvh p-6 container mx-auto">
      <div className="mb-6 flex items-center gap-6">
        <FlowerLogo size={48} />
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">Mini Notes</h1>
          <p className="text-sm text-muted-foreground">
            Simple CRUD with a post-it board
          </p>
        </div>
      </div>

      {error && (
        <Card className="mb-4 border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
        <div className="lg:col-span-2">
          <Card className="bg-noise">
            <CardHeader>
              <CardTitle>Board</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading…</div>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {notes.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                      No notes yet
                    </div>
                  ) : (
                    notes.map((n) => (
                      <PostIt
                        key={n.id}
                        note={n}
                        onEdit={startEdit}
                        onDelete={setConfirmDelete}
                      />
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as typeof activeTab)}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="create">Create</TabsTrigger>
                  <TabsTrigger value="update">Update</TabsTrigger>
                  <TabsTrigger value="delete">Delete</TabsTrigger>
                </TabsList>

                <TabsContent value="create" className="mt-4">
                  <form onSubmit={handleCreate} className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                        rows={6}
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Create</Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="update" className="mt-4">
                  <form onSubmit={handleUpdate} className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="select">Select note</Label>
                      <select
                        id="select"
                        className="w-full border rounded-md bg-background p-2"
                        value={selectedId ?? ''}
                        onChange={(e) =>
                          setSelectedId(
                            e.target.value ? Number(e.target.value) : null
                          )
                        }
                      >
                        <option value="">—</option>
                        {notes.map((n) => (
                          <option key={n.id} value={n.id}>
                            {n.title}
                          </option>
                        ))}
                      </select>
                    </div>
                    {selectedNote && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="edit-title">Title</Label>
                          <Input
                            id="edit-title"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-content">Content</Label>
                          <Textarea
                            id="edit-content"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={6}
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="submit">Save</Button>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() =>
                              selectedNote && startEdit(selectedNote)
                            }
                          >
                            Reset
                          </Button>
                        </div>
                      </>
                    )}
                  </form>
                </TabsContent>

                <TabsContent value="delete" className="mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="delete-select">Select note</Label>
                    <select
                      id="delete-select"
                      className="w-full border rounded-md bg-background p-2"
                      value={selectedId ?? ''}
                      onChange={(e) =>
                        setSelectedId(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                    >
                      <option value="">—</option>
                      {notes.map((n) => (
                        <option key={n.id} value={n.id}>
                          {n.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-3 flex justify-end">
                    <Button
                      variant="destructive"
                      disabled={!selectedId}
                      onClick={() =>
                        selectedNote && setConfirmDelete(selectedNote)
                      }
                    >
                      Delete
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete note?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The note will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteNow}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default App;
