import { env } from "../utils/env.js";

function buildMockResult({
  projectName = "Robin",
  musicStyle = "暗黑电子",
  lyricFocus = "项目故事"
}) {
  return {
    songTitle: "Fly Beyond the Chain",
    subtitle: `${projectName} 项目主题曲`,
    musicTags: [musicStyle, "社区合唱", "128 BPM"],
    lyrics: `VERSE 1
We rise from the chain, from the pulse of the crowd

CHORUS
Fly beyond the chain, let the green light lead the way`,
    promptText: `${musicStyle}，重点围绕${lyricFocus}，男声主唱 + 社区合唱，128 BPM`,
    coverImage: "/assets/covers/result-cover-fly-beyond-the-chain.webp",
    posterImage: "/assets/posters/result-poster-wide.webp"
  };
}

function normalizeAiResult(parsed, fallback) {
  return {
    songTitle: parsed.songTitle || fallback.songTitle,
    subtitle: parsed.subtitle || fallback.subtitle,
    musicTags: Array.isArray(parsed.musicTags) && parsed.musicTags.length ? parsed.musicTags : fallback.musicTags,
    lyrics: typeof parsed.lyrics === "string" && parsed.lyrics.trim() ? parsed.lyrics : fallback.lyrics,
    promptText: parsed.promptText || fallback.promptText,
    coverImage: parsed.coverImage || fallback.coverImage,
    posterImage: parsed.posterImage || fallback.posterImage
  };
}

function normalizeNarrativeResult(parsed, fallback) {
  return {
    projectType: parsed.projectType || fallback.projectType,
    oneLiner: parsed.oneLiner || fallback.oneLiner,
    coreStory: parsed.coreStory || fallback.coreStory,
    coreImagery: Array.isArray(parsed.coreImagery) && parsed.coreImagery.length ? parsed.coreImagery : fallback.coreImagery,
    communityEmotion: Array.isArray(parsed.communityEmotion) && parsed.communityEmotion.length ? parsed.communityEmotion : fallback.communityEmotion,
    recommendedMusic: parsed.recommendedMusic || fallback.recommendedMusic,
    confidence: Number(parsed.confidence) || fallback.confidence
  };
}

function getChatEndpoint() {
  const base = env.apiBaseUrl.replace(/\/+$/, "");
  const path = env.chatPath.startsWith("/") ? env.chatPath : `/${env.chatPath}`;
  return `${base}${path}`;
}

function extractJson(text) {
  const cleaned = text.trim();
  const fenced = cleaned.match(/```json\s*([\s\S]*?)```/i) || cleaned.match(/```\s*([\s\S]*?)```/i);
  const source = fenced ? fenced[1].trim() : cleaned;
  const start = source.indexOf("{");
  const end = source.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error("No JSON object found in AI content");
  }
  return JSON.parse(source.slice(start, end + 1));
}

export async function generateProjectNarrative(input, fallback) {
  if (!env.useRealAi) return fallback;

  const prompt = `
你是 ContractBeat 的项目叙事策划 AI。
请基于真实项目资料，输出严格 JSON，不要 Markdown，不要解释，不要重复行情播报口吻。

项目资料：
- 项目名：${input.name}
- Symbol：${input.symbol}
- 链：${input.chain}
- 地址：${input.address}
- 当前价格：${input.price}
- 市值/FDV：${input.marketCap}
- 流动性：${input.liquidity}
- 24H交易量：${input.volume24h}
- 官网：${input.website}
- X：${input.twitter}
- Telegram：${input.telegram}
- 交易对年龄：${input.pairAge}
- 市场状态：${input.marketStatus}
- 基础安全信号：${input.securityStatus}

要求：
1. 一句话定位要像品牌定位，不要写“已完成基础行情解析”。
2. 核心故事要把项目气质、市场状态、社区传播感串起来，不要只念数字。
3. 核心意象返回 4-6 个中文短词。
4. 社区情绪返回 3-5 个中文短词。
5. 推荐音乐要像可执行方向。

JSON：
{
  "projectType": "字符串",
  "oneLiner": "字符串",
  "coreStory": "字符串",
  "coreImagery": ["词1", "词2"],
  "communityEmotion": ["词1", "词2"],
  "recommendedMusic": "字符串",
  "confidence": 80
}`.trim();

  try {
    const response = await fetch(getChatEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.apiKey}`
      },
      body: JSON.stringify({
        model: env.model,
        temperature: 0.7,
        messages: [
          { role: "system", content: "你擅长把 Web3 项目资料提炼成高质量品牌叙事。" },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) throw new Error(`AI narrative failed: ${response.status}`);
    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) throw new Error("Empty AI narrative content");
    return normalizeNarrativeResult(extractJson(content), fallback);
  } catch (error) {
    console.error("generateProjectNarrative fallback:", error.message);
    return fallback;
  }
}

export async function generateMelodyDraft(input) {
  const fallback = buildMockResult(input);

  if (!env.useRealAi) {
    return { ...fallback, source: "mock" };
  }

  const prompt = `
你是 ContractBeat 的音乐策划 AI。
请根据下面项目信息返回严格 JSON，不要输出 Markdown，不要输出解释。

项目信息：
- 项目名：${input.projectName}
- 链：${input.chain}
- 地址：${input.address}
- 语言：${input.language}
- 音乐风格：${input.musicStyle}
- 歌词重点：${input.lyricFocus}
- 海报风格：${input.posterStyle}
- 用户补充叙事：${input.userNarrative || "未提供"}

要求：如果用户补充叙事不为空，请优先围绕这段内容来生成标题、歌词与音乐方案；自动解析内容只作为辅助参考。

JSON 字段要求：
{
  "songTitle": "字符串",
  "subtitle": "字符串",
  "musicTags": ["字符串", "字符串", "字符串"],
  "lyrics": "多行字符串，至少包含 VERSE 1 和 CHORUS",
  "promptText": "可直接用于音乐生成的提示词字符串"
}
`.trim();

  try {
    const response = await fetch(getChatEndpoint(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.apiKey}`
      },
      body: JSON.stringify({
        model: env.model,
        temperature: 0.8,
        messages: [
          {
            role: "system",
            content: "你是一个擅长为 Web3 项目生成歌词与音乐方案的创作助手。"
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`AI request failed: ${response.status} ${text}`);
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Empty AI response content");
    }

    const parsed = extractJson(content);
    return {
      ...normalizeAiResult(parsed, fallback),
      source: "ai"
    };
  } catch (error) {
    console.error("generateMelodyDraft fallback:", error.message);
    return {
      ...fallback,
      source: "fallback"
    };
  }
}