/**
 * Конфигурация сервиса из переменных окружения.
 * Безопасные дефолты, чтобы сервер поднимался без .env.
 */
export const config = {
  port: Number(process.env.PORT) || 8080,
  host: process.env.HOST || "0.0.0.0",
  /** Персистентность в data/db.json. По умолчанию включена (выключается PERSIST=false). */
  persist: process.env.PERSIST !== "false",
  /** CORS origin: "*" для дев-режима, конкретный домен для прода. */
  corsOrigin: process.env.CORS_ORIGIN || "*",
  serviceName: process.env.SERVICE_NAME || "povod-backend",
  nodeEnv: process.env.NODE_ENV || "development",
} as const;
