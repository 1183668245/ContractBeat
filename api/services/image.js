import { env } from "../utils/env.js";

function buildUrl(path, suffix = "") {
  const base = env.apiBaseUrl.replace(/\/+$/, "");
  const route = path.startsWith("/") ? path : `/${path}`;
  return `${base}${route}${suffix}`;
}

function normalizeStyle(style) {
  const map = {
    "黑金 Web3": "dark luxury, black gold, premium web3 poster",
    "霓虹赛博": "neon cyberpunk, green glow, futuristic city",
    "Meme 卡通": "playful meme aesthetic, polished illustration, web3 mascot",
    "电影史诗": "cinematic epic, dramatic lighting, heroic composition",
    "国潮": "oriental futuristic style, bold contrast, premium poster",
    "未来科技": "sleek future tech, clean sci-fi, holographic details"
  };
  return map[style] || style || "premium web3 visual";
}

function compactVisualBrief(text, max = 88) {
  return String(text || "")
    .replace(/[|/]+/g, " ")
    .replace(/[\n\r]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function buildCoverPrompt({
  projectName,
  songTitle,
  subtitle,
  musicTags = [],
  posterStyle,
  userNarrative,
  promptText
}) {
  const tags = Array.isArray(musicTags) ? musicTags.join(" / ") : String(musicTags || "");
  const visualBrief = compactVisualBrief(userNarrative || promptText);
  return [
    `为 ContractBeat 生成一张高端音乐专辑封面图。`,
    `项目名：${projectName}`,
    `歌曲名：${songTitle}`,
    `副标题：${subtitle}`,
    `音乐风格：${tags}`,
    `视觉风格：${normalizeStyle(posterStyle)}`,
    visualBrief ? `视觉线索：${visualBrief}` : "",
    "要求：必须是一张单独的专辑封面，不是海报拼贴，不是四宫格，不是多格漫画，不是上下左右拼接，不是 contact sheet，不是 diptych / triptych，不要任何内部边框、分割线、白边、相框、贴纸式排版。画面必须是单张连续完整构图，1:1 正方形，full-bleed 全幅铺满，单主体或单组主体但同处一个连续场景，优先近景或半身主体，主体明确且占画面主要面积。暗黑背景、荧光绿色主色、少量蓝紫渐变、Web3 高级感、封面感极强、不要文字、不要 logo、不要水印、不要交易图表。 --ar 1:1"
  ].filter(Boolean).join(" ");
}

function buildPosterPrompt({
  projectName,
  songTitle,
  subtitle,
  musicTags = [],
  posterStyle,
  userNarrative,
  promptText
}) {
  const tags = Array.isArray(musicTags) ? musicTags.join(" / ") : String(musicTags || "");
  const visualBrief = compactVisualBrief(userNarrative || promptText, 140);
  return [
    `为 ContractBeat 生成一张高端宣传海报图。`,
    `项目名：${projectName}`,
    `主题曲：${songTitle}`,
    `副标题：${subtitle}`,
    `音乐风格：${tags}`,
    `海报风格：${normalizeStyle(posterStyle)}`,
    visualBrief ? `视觉线索：${visualBrief}` : "",
    "要求：必须是单张横版主视觉海报，16:9，单场景、单主体或单组主体，共享同一连续空间。禁止四宫格、拼贴、分屏、切片、多面板、海报墙、镜头拼接、内部边框和分割线。更像电影级宣传海报而不是信息拼版，强冲击力、暗黑音乐工作台气质、Web3 高级感、绿色能量流、不要文字、不要 logo、不要水印、不要交易所界面。 --ar 16:9"
  ].filter(Boolean).join(" ");
}

async function submitImagine(prompt, state) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  const response = await fetch(buildUrl("/mj/submit/imagine"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.apiKey}`
    },
    body: JSON.stringify({
      prompt,
      state
    }),
    signal: controller.signal
  }).finally(() => clearTimeout(timer));

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Image submit failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  return {
    taskId: data?.result || "",
    status: data?.code === 1 ? "submitted" : "failed"
  };
}

export async function createImageTasks(input) {
  const [cover, poster] = await Promise.allSettled([
    submitImagine(
      buildCoverPrompt(input),
      JSON.stringify({ type: "cover", songTitle: input.songTitle })
    ),
    submitImagine(
      buildPosterPrompt(input),
      JSON.stringify({ type: "poster", songTitle: input.songTitle })
    )
  ]);

  if (cover.status === "rejected") {
    console.error("cover imagine failed:", cover.reason?.message || cover.reason);
  }
  if (poster.status === "rejected") {
    console.error("poster imagine failed:", poster.reason?.message || poster.reason);
  }

  return {
    coverTaskId: cover.status === "fulfilled" ? cover.value.taskId : "",
    coverStatus: cover.status === "fulfilled" ? cover.value.status : "failed",
    coverImageUrl: "",
    posterTaskId: poster.status === "fulfilled" ? poster.value.taskId : "",
    posterStatus: poster.status === "fulfilled" ? poster.value.status : "failed",
    posterImageUrl: ""
  };
}

export async function fetchImageTask(taskId) {
  const response = await fetch(buildUrl(`/mj/task/${taskId}/fetch`), {
    headers: {
      Authorization: `Bearer ${env.apiKey}`
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Image fetch failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  return {
    taskId: data?.id || taskId,
    status: String(data?.status || "SUBMITTED").toLowerCase(),
    progress: data?.progress || "0%",
    imageUrl: data?.imageUrl || "",
    failReason: data?.failReason || "",
    state: data?.state || ""
  };
}