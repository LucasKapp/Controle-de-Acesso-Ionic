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
      username TEXT,
      funcionarioId TEXT UNIQUE,
      password TEXT
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS acessos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      funcionarioId TEXT,
      horario TEXT,
      quantidade INTEGER
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
  const { username, id: funcionarioId, password } = req.body;
  if (!username || !funcionarioId || !password) {
    res.status(400).json({ success: false, message: 'Campos obrigatórios faltando' });
    return;
  }
  const hash = await bcrypt.hash(password, 10);
  try {
    await db.run('INSERT INTO users (username, funcionarioId, password) VALUES (?, ?, ?)', [username, funcionarioId, hash]);
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.post('/login', async (req: Request, res: Response) => {
  const { id: funcionarioId, password } = req.body;
  if (!funcionarioId || !password) {
    res.status(400).json({ success: false, message: 'Campos obrigatórios faltando' });
    return;
  }
  const user = await db.get('SELECT * FROM users WHERE funcionarioId = ?', [funcionarioId]);
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Credenciais inválidas' });
  }
});

app.post('/acessos', auth, async (req: Request, res: Response) => {
  const { funcionarioId, horario, quantidade } = req.body;
  if (!funcionarioId || !horario || quantidade === undefined) {
    res.status(400).json({ success: false, message: 'Campos obrigatórios faltando' });
    return;
  }
  try {
    await db.run(
      'INSERT INTO acessos (funcionarioId, horario, quantidade) VALUES (?, ?, ?)',
      [funcionarioId, horario, quantidade]
    );
    res.json({ success: true });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.get('/acessos', auth, async (req: Request, res: Response) => {
  try {
    const acessos = await db.all('SELECT * FROM acessos');
    res.json(acessos);
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

app.listen(3000, () => console.log('rodando em http://localhost:3000'));
