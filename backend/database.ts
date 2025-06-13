import Database from 'better-sqlite3';

export interface Story {
  id?: number;
  title: string;
  body: string;
  sentiment: number;
}

const db = new Database('stories.db');

db.prepare(`CREATE TABLE IF NOT EXISTS stories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  body TEXT,
  sentiment REAL
)`).run();

export const createStory = (story: Omit<Story, 'id'>): Story => {
  const stmt = db.prepare('INSERT INTO stories (title, body, sentiment) VALUES (?, ?, ?)');
  const info = stmt.run(story.title, story.body, story.sentiment);
  return { id: Number(info.lastInsertRowid), ...story };
};

export const getStory = (id: number): Story | undefined => {
  const stmt = db.prepare('SELECT * FROM stories WHERE id = ?');
  return stmt.get(id) as Story | undefined;
};

export const getStories = (): Story[] => {
  const stmt = db.prepare('SELECT * FROM stories ORDER BY id DESC');
  return stmt.all() as Story[];
};

export const updateStory = (id: number, story: Partial<Omit<Story, 'id'>>): void => {
  const existing = getStory(id);
  if (!existing) return;
  const newTitle = story.title ?? existing.title;
  const newBody = story.body ?? existing.body;
  const newSentiment = story.sentiment ?? existing.sentiment;
  db.prepare('UPDATE stories SET title = ?, body = ?, sentiment = ? WHERE id = ?')
    .run(newTitle, newBody, newSentiment, id);
};

export const deleteStory = (id: number): void => {
  db.prepare('DELETE FROM stories WHERE id = ?').run(id);
};
