import { env } from "../utils/env.js";

function buildUrl(path, suffix = "") {
  const base = env.apiBaseUrl.replace(/\/+$/, "");
  const route = path.startsWith("/") ? path : `/${path}`;
  return `${base}${route}${suffix}`;
}

export async function createMusicTask({ lyrics, promptText, songTitle, musicTags = [] }) {
  const lyricText = String(lyrics || "").trim();
  const styleTags = Array.isArray(musicTags) ? musicTags.join(", ") : String(musicTags || "");
  const response = await fetch(buildUrl(env.sunoSubmitPath), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.apiKey}`
    },
    body: JSON.stringify({
      custom: true,
      instrumental: false,
      prompt: lyricText || promptText,
      title: songTitle,
      tags: styleTags,
      mv: "chirp-v3-5"
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Music submit failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  return {
    musicProvider: "suno",
    musicTaskId: data?.data || null,
    musicStatus: data?.code === "success" ? "pending" : "failed",
    musicAudioUrl: "",
    musicMessage: data?.code === "success"
      ? (lyricText ? "已按页面歌词提交歌曲生成任务，正在生成音频..." : "歌曲生成任务已提交，正在生成音频...")
      : (data?.message || "歌曲任务提交失败")
  };
}

export async function fetchMusicTask(taskId) {
  const response = await fetch(buildUrl(env.sunoFetchPath, `/${taskId}`), {
    headers: { Authorization: `Bearer ${env.apiKey}` }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Music fetch failed: ${response.status} ${text}`);
  }

  const payload = await response.json();
  const task = payload?.data || {};
  const clip = Array.isArray(task.data) && task.data.length ? task.data[0] : null;
  return {
    taskId,
    status: String(task.status || "PENDING").toLowerCase(),
    progress: task.progress || "0%",
    audioUrl: clip?.audio_url || "",
    imageUrl: clip?.image_url || "",
    duration: clip?.metadata?.duration || 0,
    failReason: task.fail_reason || ""
  };
}