import { Router } from "express";
import { db } from "../services/db.js";
import { fetchImageTask } from "../services/image.js";

const router = Router();

router.get("/:taskId", async (req, res) => {
  try {
    const { taskId } = req.params;
    const { generationId, type = "cover" } = req.query;

    const result = await fetchImageTask(taskId);

    if (generationId) {
      if (type === "poster") {
        db.prepare(`
          UPDATE generations
          SET poster_status = ?, poster_image_url = ?
          WHERE id = ?
        `).run(result.status, result.imageUrl, generationId);
      } else {
        db.prepare(`
          UPDATE generations
          SET cover_status = ?, cover_image_url = ?
          WHERE id = ?
        `).run(result.status, result.imageUrl, generationId);
      }
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      error: "image task fetch failed",
      message: error.message
    });
  }
});

export default router;