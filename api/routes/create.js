import { Router } from "express";
import { db } from "../services/db.js";
import { generateMelodyDraft } from "../services/ai.js";
import { createMusicTask } from "../services/music.js";
import { createImageTasks } from "../services/image.js";

const router = Router();

router.post("/", async (req, res) => {
  const {
    walletAddress = "",
    projectName = "Robin",
    chain = "bsc",
    address = "",
    language = "中文",
    musicStyle = "暗黑电子",
    lyricFocus = "项目故事",
    posterStyle = "霓虹赛博",
    userNarrative = ""
  } = req.body || {};

  const result = await generateMelodyDraft({
    projectName,
    chain,
    address,
    language,
    musicStyle,
    lyricFocus,
    posterStyle,
    userNarrative
  });

  const music = await createMusicTask({
    projectName,
    chain,
    address,
    lyrics: result.lyrics,
    promptText: result.promptText,
    songTitle: result.songTitle,
    musicTags: result.musicTags
  });

  const images = await Promise.race([
    createImageTasks({
      projectName,
      songTitle: result.songTitle,
      subtitle: result.subtitle,
      musicTags: result.musicTags,
      posterStyle,
      userNarrative,
      promptText: result.promptText
    }),
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          coverTaskId: "",
          coverStatus: "timeout",
          coverImageUrl: "",
          posterTaskId: "",
          posterStatus: "timeout",
          posterImageUrl: ""
        });
      }, 9000);
    })
  ]);

  const insert = db.prepare(`
    INSERT INTO generations (
      wallet_address, project_name, chain, address, song_title, subtitle, lyrics, prompt_text, music_tags, cover_image, poster_image,
      music_task_id, music_status, music_audio_url, music_provider,
      cover_task_id, cover_status, cover_image_url,
      poster_task_id, poster_status, poster_image_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const info = insert.run(
    walletAddress,
    projectName,
    chain,
    address,
    result.songTitle,
    result.subtitle,
    result.lyrics,
    result.promptText,
    JSON.stringify(result.musicTags || []),
    result.coverImage,
    result.posterImage,
    music.musicTaskId,
    music.musicStatus,
    music.musicAudioUrl,
    music.musicProvider,
    images.coverTaskId,
    images.coverStatus,
    images.coverImageUrl,
    images.posterTaskId,
    images.posterStatus,
    images.posterImageUrl
  );

  return res.json({ id: info.lastInsertRowid, walletAddress, ...result, ...music, ...images });
});

export default router;