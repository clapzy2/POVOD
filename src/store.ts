import fs from "node:fs";
import path from "node:path";
import type { Event, User, Comment } from "./types";
import { seedUsers, seedEvents, seedComments } from "./seed";
import { config } from "./config";

/**
 * Простое хранилище данных: всё в памяти + опциональный снапшот в data/db.json.
 * Слой намеренно изолирован — заменить на Postgres/Prisma можно, переписав
 * только этот файл, не трогая роуты.
 */
export interface DB {
  users: User[];
  events: Event[];
  comments: Comment[];
}

const DATA_DIR = path.resolve(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

function freshSeed(): DB {
  return {
    users: structuredClone(seedUsers),
    events: structuredClone(seedEvents),
    comments: structuredClone(seedComments),
  };
}

function loadInitial(): DB {
  if (config.persist && fs.existsSync(DB_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(DB_FILE, "utf-8")) as DB;
      console.log(`[store] загружены данные из ${DB_FILE}`);
      return parsed;
    } catch (err) {
      console.warn("[store] не удалось прочитать db.json, пересев данных:", err);
    }
  }
  return freshSeed();
}

export const db: DB = loadInitial();

let saveTimer: NodeJS.Timeout | null = null;

/** Дебаунс-запись снапшота на диск (no-op при PERSIST=false). */
export function save(): void {
  if (!config.persist) return;
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    } catch (err) {
      console.error("[store] ошибка записи на диск:", err);
    }
  }, 50);
}

/** Генерация id (нативный crypto в Node 20, с фолбэком). */
export const newId = (): string =>
  globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 12);
