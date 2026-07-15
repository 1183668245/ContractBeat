import { Router } from "express";
import { fetchMusicTask } from "../services/music.js";
import { db } from "../services/db.js";

const router = Router();

router.get("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const result = await fetchMusicTask(taskId);
    const generationId = req.query.generationId;

    if (generationId) {
      db.prepare(`
        UPDATE generations
        SET music_status = ?, music_audio_url = ?
        WHERE id = ?
      `).run(result.status, result.audioUrl, generationId);
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "music task fetch failed",
      message: error.message
    });
  }
});

export default router;