import { env } from "../utils/env.js";

function formatUsd(value) {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return "--";

  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(2)}K`;
  if (num >= 1) return `$${num.toFixed(4)}`;
  return `$${num.toFixed(8)}`;
}

function buildLinks(info = {}) {
  const websites = Array.isArray(info.websites) ? info.websites : [];
  const socials = Array.isArray(info.socials) ? info.socials : [];

  const website = websites.find((item) => item.url)?.url || "#";
  const twitter =
    socials.find((item) => item.type === "twitter" || item.type === "x")?.url || "#";
  const telegram = socials.find((item) => item.type === "telegram")?.url || "#";

  return { website, twitter, telegram };
}

function formatAge(timestamp) {
  if (!timestamp) return "待确认";
  const diff = Date.now() - Number(timestamp);
  const days = Math.max(1, Math.floor(diff / 86400000));
  if (days >= 365) return `${Math.floor(days / 365)} 年`;
  if (days >= 30) return `${Math.floor(days / 30)} 个月`;
  return `${days} 天`;
}

function getChainAliases(chain) {
  const map = {
    bsc: ["bsc", "bnb"],
    solana: ["solana"],
    robinhood: ["robinhood", "robinhoodchain"]
  };
  return map[chain] || [chain];
}

function getDexChainCandidates(chain) {
  const map = {
    bsc: ["bsc"],
    solana: ["solana"],
    robinhood: ["robinhoodchain", "robinhood"]
  };
  return map[chain] || [chain];
}

function isSameAddress(chain, left, right) {
  if (!left || !right) return false;
  return chain === "solana"
    ? String(left).trim() === String(right).trim()
    : String(left).trim().toLowerCase() === String(right).trim().toLowerCase();
}

function pairContainsAddress(pair, chain, address) {
  return (
    isSameAddress(chain, pair?.baseToken?.address, address) ||
    isSameAddress(chain, pair?.quoteToken?.address, address)
  );
}

function getMatchedToken(pair, chain, address) {
  if (isSameAddress(chain, pair?.quoteToken?.address, address)) {
    return pair?.quoteToken || {};
  }
  return pair?.baseToken || {};
}

function chooseBestPair(pairs = [], chain, address) {
  if (!pairs.length) return null;

  const aliases = getChainAliases(chain);
  const sameChain = pairs.filter((pair) => aliases.includes(String(pair.chainId).toLowerCase()));
  const matched = sameChain.filter((pair) => pairContainsAddress(pair, chain, address));
  const source = matched.length ? matched : sameChain.length ? sameChain : pairs;

  return source.sort((a, b) => {
    const liquidityA = Number(a?.liquidity?.usd || 0);
    const liquidityB = Number(b?.liquidity?.usd || 0);
    return liquidityB - liquidityA;
  })[0];
}

export function buildArchiveMeta(project) {
  const sourceCount = [project.website, project.twitter, project.telegram].filter((item) => item && item !== "#").length;
  const liquidity = Number(String(project.liquidity || "").replace(/[^\d.]/g, "")) || 0;
  const volume = Number(String(project.volume_24h || "").replace(/[^\d.]/g, "")) || 0;
  return {
    pairAge: project.pair_age || "待确认",
    sourceCount: `${sourceCount} 项`,
    marketStatus: volume >= 100 ? "市场活跃" : "观察中",
    securityStatus: sourceCount >= 2 && liquidity >= 10 ? "基础信号正常" : "资料待补全"
  };
}

function getChainDisplayName(chain) {
  const map = {
    bsc: "BNB Smart Chain",
    solana: "Solana",
    robinhood: "Robinhood Chain"
  };
  return map[chain] || chain;
}

export function buildNarrativeFromProject(project) {
  const chainName = getChainDisplayName(project.chain);
  const archive = buildArchiveMeta(project);
  const confidence = archive.securityStatus === "基础信号正常" ? 76 : 64;

  return {
    projectType: `${chainName} × Token Project`,
    oneLiner: `${project.name}（${project.symbol}）是 ${chainName} 上已完成基础行情解析的代币项目。`,
    coreStory: `${project.name} 当前价格 ${project.price}，流动性 ${project.liquidity}，24H 交易量 ${project.volume_24h}。现在已经拿到基础市场资料，下一步可以继续接官网、社媒和官方文案做更完整的项目叙事理解。`,
    coreImagery: [project.symbol, getChainDisplayName(project.chain), "价格信号", "流动性", "社区传播"],
    communityEmotion: ["关注", "交易热度", "观察中", "待深化"],
    recommendedMusic: "电子摇滚 · 数据脉冲 · 128 BPM",
    confidence
  };
}

async function fetchJson(url, label = "request") {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${label} failed: ${response.status}`);
  }
  return response.json();
}

async function fetchPairsByToken(chain, address) {
  const base = env.dexScreenerApiBase.replace(/\/+$/, "");
  for (const candidate of getDexChainCandidates(chain)) {
    try {
      const data = await fetchJson(`${base}/token-pairs/v1/${candidate}/${address}`, "DexScreener token-pairs");
      if (Array.isArray(data) && data.length) return data;
    } catch (error) {
      continue;
    }
  }
  return [];
}

async function fetchPairsBySearch(chain, address) {
  const base = env.dexScreenerApiBase.replace(/\/+$/, "");
  const data = await fetchJson(`${base}/latest/dex/search?q=${encodeURIComponent(address)}`, "DexScreener search");
  const aliases = getChainAliases(chain);
  return Array.isArray(data?.pairs)
    ? data.pairs.filter((pair) => aliases.includes(String(pair.chainId).toLowerCase()) && pairContainsAddress(pair, chain, address))
    : [];
}

async function fetchRobinhoodTokenInfo(address) {
  const base = env.robinhoodBlockscoutBase.replace(/\/+$/, "");
  try {
    return await fetchJson(`${base}/tokens/${address}`, "Robinhood Blockscout token info");
  } catch (error) {
    return null;
  }
}

function buildProjectFromPair(chain, address, pair) {
  const token = getMatchedToken(pair, chain, address);
  const links = buildLinks(pair.info);
  return {
    chain,
    address,
    name: token.name || "Unknown Token",
    symbol: token.symbol || "UNKNOWN",
    logo: pair.info?.imageUrl || "",
    website: links.website,
    twitter: links.twitter,
    telegram: links.telegram,
    price: formatUsd(pair.priceUsd),
    market_cap: formatUsd(pair.fdv || pair.marketCap),
    liquidity: formatUsd(pair.liquidity?.usd),
    volume_24h: formatUsd(pair.volume?.h24),
    pair_age: formatAge(pair.pairCreatedAt)
  };
}

function buildProjectFromRobinhoodTokenInfo(address, tokenInfo) {
  return {
    chain: "robinhood",
    address,
    name: tokenInfo?.name || "Unknown Token",
    symbol: tokenInfo?.symbol || "UNKNOWN",
    logo: tokenInfo?.icon_url || "",
    website: "#",
    twitter: "#",
    telegram: "#",
    price: formatUsd(tokenInfo?.exchange_rate),
    market_cap: formatUsd(tokenInfo?.circulating_market_cap),
    liquidity: "--",
    volume_24h: "--",
    pair_age: "待确认"
  };
}

export async function parseProjectFromAddress({ chain, address }) {
  if (!["bsc", "solana", "robinhood"].includes(chain)) {
    return null;
  }

  const tokenPairs = await fetchPairsByToken(chain, address);
  const searchPairs = tokenPairs.length ? [] : await fetchPairsBySearch(chain, address);
  const pair = chooseBestPair([...tokenPairs, ...searchPairs], chain, address);

  let project = null;

  if (pair) {
    project = buildProjectFromPair(chain, address, pair);
  } else if (chain === "robinhood") {
    const tokenInfo = await fetchRobinhoodTokenInfo(address);
    if (tokenInfo?.symbol || tokenInfo?.name) {
      project = buildProjectFromRobinhoodTokenInfo(address, tokenInfo);
    }
  }

  if (!project) {
    return null;
  }

  return {
    project,
    narrative: buildNarrativeFromProject(project)
  };
}