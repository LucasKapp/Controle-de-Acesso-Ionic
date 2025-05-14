// backend/server.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET = 'senha123';

let db: any;
(async () => {
  db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });

  await db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT,
      password TEXT
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      quantity INTEGER,
      userId INTEGER
    )
  `);
})();

export function auth(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ success: false, message: 'Token ausente' });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { id: number };
    req.userId = decoded.id;
    next();
  } catch {
    res.status(403).json({ success: false, message: 'Token inválido' });
    return;
  }
}

app.post('/register', async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    await db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hash]);
    res.json({ success: true });
  } catch (e: any) {
    res.json({ success: false, error: e.message });
  }
});

app.post('/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });
    res.json({ success: true, token });
  } else {
    res.json({ success: false });
  }
});

app.post('/materials', auth, async (req: Request, res: Response) => {
  const { name, description, quantity } = req.body;
  await db.run(
    'INSERT INTO materials (name, description, quantity, userId) VALUES (?, ?, ?, ?)',
    [name, description, quantity, req.userId]
  );
  res.json({ success: true });
});

app.get('/materials', auth, async (req: Request, res: Response) => {
  const materials = await db.all('SELECT * FROM materials WHERE userId = ?', [req.userId]);
  res.json(materials);
});

app.listen(3000, () => console.log('✅ API rodando em http://localhost:3000'));
