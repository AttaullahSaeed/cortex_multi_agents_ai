import { getMessages } from "../utils/getMessages.js";
import redis from "../../../shared/redis/redis.js";

const TTL = 24 * 60 * 60; // 24 Hours in seconds

export const getMemory = async (conversationId) => {
  if (!conversationId) return [];

  const key = `messages-${conversationId}`;
  const cached = await redis.get(key);

  if (cached) {
    const parsed = JSON.parse(cached);
    // Extra safety: Agar cached value null/undefined ho to empty array do
    if (Array.isArray(parsed)) return parsed;
  }

  // DB Fallback
  const dbMessages = await getMessages(conversationId);
  const messages = Array.isArray(dbMessages) ? dbMessages : [];

  // Always store a valid array as string
  await redis.set(key, JSON.stringify(messages), "EX", TTL);

  return messages;
};

export const addMessage = async (conversationId, role, content) => {
  if (!conversationId) return;

  const key = `messages-${conversationId}`;

  // Safe fetch using getMemory
  const messages = await getMemory(conversationId);

  messages.push({ role, content });

  // Keep last 20 messages
  if (messages.length > 20) {
    messages.shift();
  }

  // Preserve TTL on update
  await redis.set(key, JSON.stringify(messages), "EX", TTL);
};
