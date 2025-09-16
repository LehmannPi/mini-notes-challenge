import 'dotenv/config';
import { db } from './index.js';
import { notes } from './schema.js';

async function main() {
  const existing = await db.select().from(notes).limit(1);
  if (existing.length > 0) {
    console.log('Seed skipped: notes already present');
    return;
  }

  const now = new Date();
  await db.insert(notes).values([
    {
      title: 'Welcome to Mini-Notes',
      content:
        'This is a sample note. You can create, update, list and delete notes using the API.',
      createdAt: now,
      updatedAt: now,
    },
    {
      title: 'Second note',
      content: 'PUT /notes/:id to update this content, or DELETE it.',
      createdAt: now,
      updatedAt: now,
    },
  ]);

  console.log('Seed completed: inserted sample notes');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
