import { Router } from "express";
import { db } from "../services/db.js";
import { generateProjectNarrative } from "../services/ai.js";
import { buildArchiveMeta, buildNarrativeFromProject, parseProjectFromAddress } from "../services/project-parser.js";

const router = Router();

router.get("/", async (req, res) => {
  const { chain, address } = req.query;

  if (!chain || !address) {
    return res.status(400).json({ error: "chain and address are required" });
  }

  const normalizedAddress = String(address).trim();
  const cachedProject = db.prepare(`
    SELECT *
    FROM projects
    WHERE chain = ? AND address = ?
    LIMIT 1
  `).get(chain, normalizedAddress);

  if (cachedProject && cachedProject.name !== "Robin") {
    const fallbackNarrative = buildNarrativeFromProject(cachedProject);
    const narrative = await generateProjectNarrative({
      name: cachedProject.name,
      symbol: cachedProject.symbol,
      chain,
      address: cachedProject.address,
      price: cachedProject.price,
      marketCap: cachedProject.market_cap,
      liquidity: cachedProject.liquidity,
      volume24h: cachedProject.volume_24h,
      website: cachedProject.website,
      twitter: cachedProject.twitter,
      telegram: cachedProject.telegram,
      pairAge: cachedProject.pair_age || "待确认",
      marketStatus: buildArchiveMeta(cachedProject).marketStatus,
      securityStatus: buildArchiveMeta(cachedProject).securityStatus
    }, fallbackNarrative);

    return res.json({
      found: true,
      project: { ...cachedProject, ...buildArchiveMeta(cachedProject) },
      narrative
    });
  }

  const parsed = await parseProjectFromAddress({ chain, address: normalizedAddress });

  if (!parsed) {
    return res.json({
      found: false,
      project: null,
      narrative: {
        projectType: "待扩展解析",
        oneLiner: "当前地址暂未获取到真实项目资料，先返回演示结果。",
        coreStory: "目前已完成 BSC，Solana 与 Robinhood Chain 也已接入真实解析尝试；其中 Robinhood 增加了 Blockscout 兜底。如果第三方数据源都没有返回有效资料，页面会展示未解析状态。",
        coreImagery: ["声波", "霓虹", "飞行"],
        communityEmotion: ["热血", "共识"],
        recommendedMusic: "暗黑电子 · 128 BPM",
        confidence: 48
      }
    });
  }

  db.prepare(`
    INSERT INTO projects (
      chain, address, name, symbol, logo, website, twitter, telegram,
      price, market_cap, liquidity, volume_24h
    ) VALUES (
      @chain, @address, @name, @symbol, @logo, @website, @twitter, @telegram,
      @price, @market_cap, @liquidity, @volume_24h
    )
    ON CONFLICT(chain, address) DO UPDATE SET
      name = excluded.name,
      symbol = excluded.symbol,
      logo = excluded.logo,
      website = excluded.website,
      twitter = excluded.twitter,
      telegram = excluded.telegram,
      price = excluded.price,
      market_cap = excluded.market_cap,
      liquidity = excluded.liquidity,
      volume_24h = excluded.volume_24h
  `).run(parsed.project);

  const fallbackNarrative = parsed.narrative || buildNarrativeFromProject(parsed.project);
  const archive = buildArchiveMeta(parsed.project);
  const narrative = await generateProjectNarrative({
    name: parsed.project.name,
    symbol: parsed.project.symbol,
    chain,
    address: parsed.project.address,
    price: parsed.project.price,
    marketCap: parsed.project.market_cap,
    liquidity: parsed.project.liquidity,
    volume24h: parsed.project.volume_24h,
    website: parsed.project.website,
    twitter: parsed.project.twitter,
    telegram: parsed.project.telegram,
    pairAge: parsed.project.pair_age || "待确认",
    marketStatus: archive.marketStatus,
    securityStatus: archive.securityStatus
  }, fallbackNarrative);

  return res.json({
    found: true,
    project: { ...parsed.project, ...archive },
    narrative
  });
});

export default router;