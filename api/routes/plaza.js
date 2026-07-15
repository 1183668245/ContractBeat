import { Router } from "express";
import { db } from "../services/db.js";

const router = Router();

function parseMusicTags(value) {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

router.get("/", (req, res) => {
  const wallet = String(req.query.wallet || "").trim();
  const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
  const limit = 10;
  const offset = (page - 1) * limit;
  const total = wallet
    ? db.prepare(`SELECT COUNT(*) AS count FROM generations WHERE lower(wallet_address) = lower(?)`).get(wallet).count
    : db.prepare(`SELECT COUNT(*) AS count FROM generations`).get().count;
  const items = wallet
    ? db.prepare(`
        SELECT id, wallet_address AS walletAddress, project_name AS projectName, chain,
          song_title AS songTitle,
          cover_image_url AS coverImageUrl,
          poster_image_url AS posterImageUrl,
          created_at AS createdAt
        FROM generations
        WHERE lower(wallet_address) = lower(?)
        ORDER BY id DESC
        LIMIT ? OFFSET ?
      `).all(wallet, limit, offset)
    : db.prepare(`
        SELECT id, wallet_address AS walletAddress, project_name AS projectName, chain,
          song_title AS songTitle,
          cover_image_url AS coverImageUrl,
          poster_image_url AS posterImageUrl,
          created_at AS createdAt
        FROM generations
        ORDER BY id DESC
        LIMIT ? OFFSET ?
      `).all(limit, offset);

  return res.json({
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      hasPrev: page > 1,
      hasNext: page * limit < total
    }
  });
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const wallet = String(req.query.wallet || "").trim();
  const item = wallet
    ? db.prepare(`
        SELECT id, wallet_address AS walletAddress, project_name AS projectName, chain, address,
          song_title AS songTitle, subtitle, lyrics, prompt_text AS promptText, music_tags AS musicTags,
          music_status AS musicStatus, music_audio_url AS musicAudioUrl,
          cover_image_url AS coverImageUrl, poster_image_url AS posterImageUrl, created_at AS createdAt
        FROM generations WHERE id = ? AND lower(wallet_address) = lower(?)
      `).get(id, wallet)
    : db.prepare(`
        SELECT id, wallet_address AS walletAddress, project_name AS projectName, chain, address,
          song_title AS songTitle, subtitle, lyrics, prompt_text AS promptText, music_tags AS musicTags,
          music_status AS musicStatus, music_audio_url AS musicAudioUrl,
          cover_image_url AS coverImageUrl, poster_image_url AS posterImageUrl, created_at AS createdAt
        FROM generations WHERE id = ?
      `).get(id);

  if (!item) {
    return res.status(404).json({ error: "generation not found" });
  }

  return res.json({ item: { ...item, musicTags: parseMusicTags(item.musicTags) } });
});

export default router;