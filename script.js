const page = document.body.dataset.page || "home";
const header = document.querySelector(".site-header");
const revealItems = document.querySelectorAll(".reveal");
const API_BASE = ["localhost", "127.0.0.1"].includes(window.location.hostname)
  ? "http://localhost:3001/api"
  : "https://api.contractbeat.fun/api";

const chainConfig = {
  bsc: {
    short: "BSC",
    name: "BNB Chain",
    chain: "BNB Smart Chain",
    placeholderZh: "请输入代币合约地址",
    placeholderEn: "Enter token contract address"
  },
  solana: {
    short: "SOL",
    name: "Solana",
    chain: "Solana",
    placeholderZh: "输入代币 Mint Address",
    placeholderEn: "Enter token mint address"
  },
  robinhood: {
    short: "RHC",
    name: "Robinhood Chain",
    chain: "Robinhood Chain",
    placeholderZh: "请输入代币合约地址",
    placeholderEn: "Enter token contract address"
  }
};

const sampleProjects = {
  bsc: {
    chainKey: "bsc",
    name: "待解析项目",
    symbol: "TOKEN",
    address: "0xc748673057861a797275cd8a068abb95a902e8de",
    tagline: "点击解析后展示真实项目资料。",
    type: "待解析",
    imagery: "待解析",
    music: "待生成",
    price: "--",
    marketCap: "--",
    liquidity: "--",
    volume: "--"
  },
  solana: {
    chainKey: "solana",
    name: "待解析项目",
    symbol: "TOKEN",
    address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    tagline: "点击解析后展示真实项目资料。",
    type: "待解析",
    imagery: "待解析",
    music: "待生成",
    price: "--",
    marketCap: "--",
    liquidity: "--",
    volume: "--"
  },
  robinhood: {
    chainKey: "robinhood",
    name: "待解析项目",
    symbol: "TOKEN",
    address: "0x020bfc650a365f8bb26819deaabf3e21291018b4",
    tagline: "点击解析后展示真实项目资料。",
    type: "待解析",
    imagery: "待解析",
    music: "待生成",
    price: "--",
    marketCap: "--",
    liquidity: "--",
    volume: "--"
  }
};

const homeI18n = {
  zh: { toggle: "EN", nav: ["首页", "旋律广场", "使用说明", "我的作品"], heroEyebrow: "WEB3 AI 音乐与视觉创作平台", heroTitle: "输入合约，输出音乐", heroDesc: "粘贴合约，3 分钟生成完整项目主题曲。", parse: "解析项目", exampleTitle: "不知道输入什么？试试这些示例项目", exampleCards: ["BSC 示例", "Solana 示例", "Robinhood 示例"], support: "支持 BNB Smart Chain、Solana、Robinhood Chain", asideEyebrow: "项目解析预览", asidePill: "DEX Screener × 叙事理解", asideMetrics: ["价格", "市值", "流动性", "24H 成交量"], asideStoryTitle: "AI 项目理解", asideStoryLabels: ["项目定位", "核心意象", "推荐音乐"], asideSignals: ["自由", "飞行", "社区", "霓虹", "旋律", "Robin"], wfEyebrow: "从输入地址到完整作品", wfTitle: "从地址开始，把项目做成作品", wfDesc: "从项目解析、叙事理解到旋律与视觉生成，整条创作链路在这里完成。", wfCards: [["解析项目", "通过链选择器、地址搜索、核心数据卡与项目资料，迅速建立项目档案。"], ["理解叙事", "将品牌故事、社区情绪、核心意象和可信来源整合为 AI 项目理解。"], ["配置创作", "选择语言、曲风、歌词重点与海报风格，让结果更像项目自己的作品。"], ["生成与扩展", "从歌词、音乐方案到封面与海报，结果页继续修改，作品还能进入旋律广场。"]], analysisEyebrow: "页面布局方向", analysisTitle: "左侧项目档案，右侧 AI 灵魂档案", analysisBtn: "查看项目解析页", archiveTitle: "项目基础资料", archivePill: "DEX Screener 参考", archiveMetrics: ["价格", "市值", "流动性", "24H 交易量"], archiveLinks: ["官网", "X", "Telegram", "Explorer"], soulTitle: "AI 项目理解", soulPill: "可信度 82%", soulLabels: ["项目类型", "一句话定位", "核心意象", "推荐音乐"], soulSignals: ["自由", "热血", "团结", "反叛"], soulActions: ["使用这个故事开始创作", "修改项目资料"], studioEyebrow: "创作工作台", studioTitle: "一套可配置的旋律工作台", studioBtn: "打开创作设置页", coverDesc: "Logo、叙事摘要、关键词与当前海报风格会始终作为创作上下文存在。", previewTitles: ["语言", "音乐风格", "海报风格"], previewGen: "✦ 生成我的项目旋律", resultEyebrow: "生成结果与作品广场", resultTitle: "生成之后，作品继续流动", resultBtn: "进入旋律广场", resultCards: [["《Fly Beyond the Chain》", "专辑信息、歌词目录、音乐方案与海报切换并列排布，方便浏览和复制。", "查看结果页"], ["作品流", "生成后的作品会继续被浏览、进入详情与分享。", "查看旋律广场"]], ctaTitle: "从一个合约，开始一首作品", ctaDesc: "从项目解析到结果发布，整条创作路径已经打通。", ctaBtns: ["从项目解析开始", "先看作品广场"], pendingName: "待解析项目", pendingTagline: "点击解析后展示真实项目资料。", pendingType: "待解析", pendingMusic: "待生成" },
  en: { toggle: "中", nav: ["Home", "Melody Plaza", "Guide", "My Works"], heroEyebrow: "WEB3 AI Music & Visual Studio", heroTitle: "Contract In. Music Out.", heroDesc: "Paste a contract. Get a complete project anthem in 3 minutes.", parse: "Analyze Project", exampleTitle: "Not sure what to enter? Try these sample projects", exampleCards: ["BSC Sample", "Solana Sample", "Robinhood Sample"], support: "Supports BNB Smart Chain, Solana, and Robinhood Chain", asideEyebrow: "Project View", asidePill: "DEX × Narrative",  asideMetrics: ["Price", "Market Cap", "Liquidity", "24H Volume"], asideStoryTitle: "AI Project Read", asideStoryLabels: ["Positioning", "Core Imagery", "Suggested Sound"], asideSignals: ["Freedom", "Flight", "Community", "Neon", "Melody", "Robin"], wfEyebrow: "From Contract to Full Output", wfTitle: "Start with a contract. End with a work.", wfDesc: "From analysis and narrative reading to music and visual generation, the full creation flow is connected here.", wfCards: [["Analyze", "Use chain switcher, address input and core data cards to build the project profile fast."], ["Read Narrative", "Turn brand story, community mood, core imagery and trusted sources into an AI reading."], ["Set Creation", "Choose language, music style, lyric focus and poster style for a more project-native output."], ["Generate & Expand", "From lyrics and music plan to cover and poster, then keep editing and flow into the plaza."]], analysisEyebrow: "Layout Direction", analysisTitle: "Project Archive on the left, AI Soul Profile on the right", analysisBtn: "Open Analysis Page", archiveTitle: "Project Basics", archivePill: "DEX Screener Ref", archiveMetrics: ["Price", "Market Cap", "Liquidity", "24H Volume"], archiveLinks: ["Website", "X", "Telegram", "Explorer"], soulTitle: "AI Project Read", soulPill: "Confidence 82%", soulLabels: ["Project Type", "One-liner", "Core Imagery", "Suggested Sound"], soulSignals: ["Freedom", "Intensity", "Unity", "Rebel"], soulActions: ["Create from This Story", "Edit Project Data"], studioEyebrow: "Studio", studioTitle: "A configurable melody workstation", studioBtn: "Open Studio", coverDesc: "Logo, narrative summary, keywords and current poster style stay as creation context throughout.", previewTitles: ["Language", "Music Style", "Poster Style"], previewGen: "✦ Generate My Anthem", resultEyebrow: "Results & Plaza", resultTitle: "After generation, the work keeps moving", resultBtn: "Enter Plaza", resultCards: [["Fly Beyond the Chain", "Album info, lyrics sections, music plan and poster switching are arranged together for easy browsing and copying.", "Open Result Page"], ["Work Feed", "Generated works keep getting browsed, opened in detail and shared.", "View Melody Plaza"]], ctaTitle: "One contract. One anthem.", ctaDesc: "From project analysis to final release, the whole creation path is already connected.", ctaBtns: ["Start from Analysis", "Browse the Plaza"], pendingName: "Project Pending", pendingTagline: "Analyze to load real project data.", pendingType: "Pending", pendingMusic: "Pending" }
};

const commonI18n = {
  zh: { connectWallet: "连接钱包", installWallet: "请先安装钱包", connectCancelled: "连接已取消", copied: "已复制", copyFailed: "复制失败", justNow: "刚刚生成", pending: "待补充", unknown: "待识别", unparsed: "待解析", pairAge: "待确认", sourceCount: "0 项", marketWatching: "观察中", securityPending: "资料待补全", storyEmpty: "当前还没有完整故事描述。", browserWalletMissing: "当前浏览器没有检测到钱包插件，请先安装 MetaMask 或兼容钱包。", walletCancelledLong: "钱包连接已取消，请完成连接后再开始生成。", footer: "免责声明：本站内容仅用于创作展示与项目叙事辅助，不构成投资建议、收益承诺或金融意见。" },
  en: { connectWallet: "Connect", installWallet: "Install Wallet", connectCancelled: "Cancelled", copied: "Copied", copyFailed: "Copy Failed", justNow: "Just now", pending: "Pending", unknown: "Unknown", unparsed: "Unparsed", pairAge: "Pending", sourceCount: "0", marketWatching: "Watching", securityPending: "Pending", storyEmpty: "No complete story available yet.", browserWalletMissing: "No wallet extension detected. Install MetaMask or a compatible wallet first.", walletCancelledLong: "Wallet connection was cancelled. Complete the connection to continue.", footer: "Disclaimer: this site is for creative showcase and narrative assistance only, not financial advice or return promises." }
};

const plazaI18n = {
  zh: { eyebrow: "旋律广场", title: "作品流", subtitle: "在这里浏览最新作品，进入详情，继续分享与发现。", public: "最新发布", mine: "我的作品", mineTitle: "我的历史作品", mineSubtitle: "这里显示你已归档的历史作品，可以继续打开任意一条结果。", mineNeedWallet: "请先连接钱包，再查看你的历史作品。" },
  en: { eyebrow: "Melody Plaza", title: "Feed", subtitle: "Browse the latest works, open details, and keep sharing and discovering.", public: "Latest", mine: "My Works", mineTitle: "My Archive", mineSubtitle: "Browse the works already archived under your wallet.", mineNeedWallet: "Connect your wallet first to view your archive." }
};

const pageI18n = {
  project: {
    zh: { pill: "项目解析中", next: "下一步", eyebrow: "项目解析页", title: "读懂项目，提炼气质", subtitle: "左侧看真实资料，右侧看 AI 提炼出的项目气质与创作方向。", archive: "项目档案", metrics: ["当前价格", "市值 / FDV", "流动性", "24 小时交易量", "交易对年龄", "来源数量", "市场状态", "基础安全信号"], links: ["官网", "X", "Telegram", "Explorer"], soulEyebrow: "AI 项目理解", soulTitle: "项目灵魂档案", soulLabels: ["项目类型", "一句话定位", "核心故事", "核心意象", "社区情绪", "推荐音乐"], sources: ["链上确认 5 项", "官方来源 3 项", "AI 创作理解 4 项"], noteTitle: "补充项目叙事", noteDesc: "可选填写，200 字以内。若填写，后续创作会优先参考这段内容。", notePlaceholder: "例如：项目强调社区共识、财富增长、赛博城市感，希望歌词更热血、更适合传播。", create: "使用这个故事开始创作", edit: "修改项目资料" },
    en: { pill: "Analyzing", next: "Next", eyebrow: "Project Analysis", title: "Read the Project, Capture the Vibe", subtitle: "See real project data on the left and AI narrative direction on the right.", archive: "Project Archive", metrics: ["Price", "Market Cap / FDV", "Liquidity", "24H Volume", "Pair Age", "Sources", "Market Status", "Security Signal"], links: ["Website", "X", "Telegram", "Explorer"], soulEyebrow: "AI Reading", soulTitle: "Project Soul Profile", soulLabels: ["Project Type", "One-liner", "Core Story", "Core Imagery", "Community Mood", "Suggested Sound"], sources: ["5 On-chain Signals", "3 Official Sources", "4 AI Insights"], noteTitle: "Add Narrative", noteDesc: "Optional, within 200 characters. If filled in, later creation will prioritize this note.", notePlaceholder: "Example: community-first, wealth momentum, cyber-city tone, and more energetic lyrics for sharing.", create: "Create from This Story", edit: "Edit Project Data" }
  },
  studio: {
    zh: { pill: "创作工作台", start: "开始生成", eyebrow: "创作设置页", title: "定好风格，开始创作", subtitle: "选语言、定基调、挑海报风格，然后直接生成。", groups: ["语言", "音乐风格", "歌词重点", "海报风格"], groupDesc: ["决定生成歌词与宣传文案的输出语言。", "不用原生下拉，而是直接用语义清晰的风格卡。", "控制歌词更偏故事、机制还是社区氛围。", "用缩略图视觉选择，而不是抽象的文本描述。"], gatePill: "生成权限", gateOff: "请先连接钱包", gateOn: "钱包已连接，可开始生成", hintOff: "你现在可以继续查看解析结果和创作配置，但生成音乐、封面和海报前需要先连接钱包。", connect: "连接钱包", generateOff: "✦ 连接钱包后开始生成", generateOn: "✦ 生成我的项目旋律" },
    en: { pill: "Studio", start: "Start", eyebrow: "Create", title: "Set the Style, Start Creating", subtitle: "Pick the language, tone and poster style, then generate.", groups: ["Language", "Music Style", "Lyric Focus", "Poster Style"], groupDesc: ["Choose the output language for lyrics and promo copy.", "Use direct semantic style cards instead of a native select.", "Control whether lyrics lean toward story, token design or community energy.", "Choose visually with thumbnails instead of abstract labels."], gatePill: "Access", gateOff: "Connect Wallet First", gateOn: "Wallet Connected", hintOff: "You can keep exploring settings, but generating music and visuals requires a wallet connection.", connect: "Connect Wallet", generateOff: "✦ Connect Wallet to Generate", generateOn: "✦ Generate My Anthem" }
  },
  creating: {
    zh: { pill: "生成中", eyebrow: "生成过程页", title: "正在为 {{name}} 创作专属旋律", subtitle: "这里不只是一个转圈。我们会把“项目被理解”的过程显示出来，让用户感知 AI 正在把链上叙事转化为歌词、视觉和氛围。", steps: ["已识别项目资料", "已整理官方信息", "已提炼项目故事", "正在创作主题歌词", "正在设计音乐主视觉", "正在制作宣传海报"], pending: ["AI 正在把项目叙事编织成可被听见的旋律结构。", "旋律骨架已建立，正在继续雕刻音色与情绪层次。", "正在让故事、氛围与社区能量汇聚成完整作品。"], hints: ["正在为作品凝聚音色、节奏与情绪氛围", "正在打磨更适合项目气质的旋律走向", "正在把歌词与声音人格融合成完整主歌与副歌"], noTask: "当前没有音乐任务，先回到创作页重新生成。", complete: "歌曲、封面与海报已全部生成完成。", completeHint: "完整作品已准备就绪，马上可以进入结果页查看", stateDone: "已完成", toResult: "生成完成后查看结果", viewResult: "查看生成结果" },
    en: { pill: "Generating", eyebrow: "Creation Flow", title: "Creating an anthem for {{name}}", subtitle: "This is more than a spinner. It shows how AI is turning on-chain narrative into lyrics, visuals and atmosphere.", steps: ["Project data identified", "Official info organized", "Story distilled", "Writing anthem lyrics", "Designing key visual", "Producing promo poster"], pending: ["AI is weaving the project narrative into an audible melody.", "The melodic skeleton is set. Now refining tone and emotion.", "Story, atmosphere and community energy are merging into one work."], hints: ["Gathering tone, rhythm and emotional atmosphere", "Polishing a melodic direction that fits the project", "Blending lyrics and sonic identity into a full track"], noTask: "No music task found. Go back and generate again.", complete: "Song, cover and poster are all ready.", completeHint: "Everything is ready. Open the result page now.", stateDone: "Completed", toResult: "Open result when ready", viewResult: "View Result" }
  },
  result: {
    zh: { detail: "作品详情", result: "结果页", works: "我的作品", edit: "继续修改", meta: ["作品编号", "所属链", "钱包归属", "合约地址"], actions: ["复制歌词", "复制音乐提示词", "分享作品"], audioTitle: "歌曲音频", noAudio: "当前还没有可播放音频", nav: "目录", modules: ["音乐方案", "专业但好懂", "可复制音乐生成提示词", "海报与封面", "音乐封面", "X 横版海报", "保存图片", "切换模板", "重新生成主视觉", "复制宣传文案"], plan: ["风格", "速度", "人声", "乐器", "情绪"] },
    en: { detail: "Details", result: "Result", works: "My Works", edit: "Edit More", meta: ["Work ID", "Chain", "Wallet", "Contract"], actions: ["Copy Lyrics", "Copy Prompt", "Share"], audioTitle: "Audio", noAudio: "No playable audio yet", nav: "Sections", modules: ["Music Plan", "Clear & Practical", "Copyable music prompt", "Poster & Cover", "Cover Art", "X Banner", "Save Image", "Switch Template", "Regenerate Visual", "Copy Promo Copy"], plan: ["Style", "Tempo", "Vocal", "Instruments", "Mood"] }
  }
};

let currentLang = localStorage.getItem("robin-melody-lang") || "en";
let selectedChain = localStorage.getItem("robin-melody-chain") || "bsc";

function saveWalletAddress(address) {
  localStorage.setItem("robin-melody-wallet", String(address || "").trim());
}

function getWalletAddress() {
  return localStorage.getItem("robin-melody-wallet") || "";
}

function formatWalletAddress(address) {
  const value = String(address || "").trim();
  return value ? `${value.slice(0, 6)}...${value.slice(-4)}` : "";
}

function formatCreatedAt(value) {
  if (!value) return commonI18n[currentLang]?.justNow || "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function formatLongText(value, fallback = commonI18n[currentLang]?.pending || "Pending") {
  const text = String(value || "").trim();
  return text || fallback;
}

function translateProjectStatusText(value, lang = currentLang) {
  const text = String(value || "").trim();
  if (!text) return text;
  const map = {
    "待解析项目": { zh: "待解析项目", en: "Project Pending" },
    "Project Pending": { zh: "待解析项目", en: "Project Pending" },
    "点击解析后展示真实项目资料。": { zh: "点击解析后展示真实项目资料。", en: "Analyze to load real project data." },
    "Analyze to load real project data.": { zh: "点击解析后展示真实项目资料。", en: "Analyze to load real project data." },
    "待解析": { zh: "待解析", en: "Pending" },
    "Pending": { zh: "待解析", en: "Pending" },
    "待生成": { zh: "待生成", en: "Pending" },
    "待确认": { zh: "待确认", en: "Pending" },
    "未获取": { zh: "未获取", en: "Unavailable" },
    "Unavailable": { zh: "未获取", en: "Unavailable" },
    "观察中": { zh: "观察中", en: "Watching" },
    "Watching": { zh: "观察中", en: "Watching" },
    "市场活跃": { zh: "市场活跃", en: "Active" },
    "Active": { zh: "市场活跃", en: "Active" },
    "待补全": { zh: "待补全", en: "Pending" },
    "资料待补全": { zh: "资料待补全", en: "Pending" }
  };
  if (map[text]) return map[text][lang];
  const sourceMatch = text.match(/^(\d+)\s*(项|Sources?)$/i);
  if (sourceMatch) return lang === "zh" ? `${sourceMatch[1]} 项` : `${sourceMatch[1]} Sources`;
  const confidenceMatch = text.match(/(?:信息可信度|Confidence)\s*(\d+)%/i);
  if (confidenceMatch) return lang === "zh" ? `信息可信度 ${confidenceMatch[1]}%` : `Confidence ${confidenceMatch[1]}%`;
  return text;
}

async function requestWalletConnection() {
  const ethereum = window.ethereum;
  if (!ethereum?.request) {
    throw new Error("WALLET_NOT_FOUND");
  }
  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  const walletAddress = String(accounts?.[0] || "").trim();
  saveWalletAddress(walletAddress);
  return walletAddress;
}

function syncWalletEntryButtons() {
  const walletAddress = getWalletAddress().trim();
  const text = commonI18n[currentLang]?.connectWallet || "Connect";
  document.querySelectorAll("[data-connect-wallet]").forEach((button) => {
    button.textContent = walletAddress ? formatWalletAddress(walletAddress) : text;
  });
}

function initWalletEntryButtons() {
  document.querySelectorAll("[data-connect-wallet]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      try {
        const walletAddress = await requestWalletConnection();
        syncWalletEntryButtons();
        const target = button.dataset.connectedHref || "";
        if (walletAddress && target) window.location.href = target;
      } catch (error) {
        const text = error.message === "WALLET_NOT_FOUND"
          ? commonI18n[currentLang]?.installWallet
          : commonI18n[currentLang]?.connectCancelled;
        button.textContent = text || "Cancelled";
        window.setTimeout(syncWalletEntryButtons, 1200);
      }
    });
  });
  syncWalletEntryButtons();
}

function getStoredProject() {
  const stored = localStorage.getItem("robin-melody-project");
  if (!stored) {
    return sampleProjects[selectedChain];
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    return sampleProjects[selectedChain];
  }
}

function saveProject(project) {
  localStorage.setItem("robin-melody-project", JSON.stringify(project));
  localStorage.setItem("robin-melody-chain", project.chainKey);
}

function saveNarrativeNote(note) {
  localStorage.setItem("robin-melody-narrative-note", note || "");
}

function getNarrativeNote() {
  return localStorage.getItem("robin-melody-narrative-note") || "";
}

function normalizeApiProject(chainKey, payload) {
  const project = payload.project || {};
  const narrative = payload.narrative || {};
  return {
    chainKey,
    name: project.name || sampleProjects[chainKey].name,
    symbol: project.symbol || sampleProjects[chainKey].symbol,
    logo: project.logo || "",
    address: project.address || sampleProjects[chainKey].address,
    tagline: narrative.oneLiner || sampleProjects[chainKey].tagline,
    type: narrative.projectType || sampleProjects[chainKey].type,
    imagery: Array.isArray(narrative.coreImagery) ? narrative.coreImagery.join(" / ") : sampleProjects[chainKey].imagery,
    music: narrative.recommendedMusic || sampleProjects[chainKey].music,
    story: narrative.coreStory || (commonI18n[currentLang]?.storyEmpty || "No complete story available yet."),
    emotion: Array.isArray(narrative.communityEmotion) ? narrative.communityEmotion.join(" / ") : (commonI18n[currentLang]?.unparsed || "Unparsed"),
    confidence: narrative.confidence || 0,
    price: project.price || sampleProjects[chainKey].price,
    marketCap: project.market_cap || sampleProjects[chainKey].marketCap,
    liquidity: project.liquidity || sampleProjects[chainKey].liquidity,
    volume: project.volume_24h || sampleProjects[chainKey].volume,
    website: project.website || "#",
    twitter: project.twitter || "#",
    telegram: project.telegram || "#",
    pairAge: project.pair_age || project.pairAge || (commonI18n[currentLang]?.pairAge || "Pending"),
    sourceCount: project.sourceCount || (commonI18n[currentLang]?.sourceCount || "0"),
    marketStatus: project.marketStatus || (commonI18n[currentLang]?.marketWatching || "Watching"),
    securityStatus: project.securityStatus || (commonI18n[currentLang]?.securityPending || "Pending")
  };
}

function applyProjectToPage(project) {
  document.querySelectorAll("[data-project-name]").forEach((node) => {
    node.textContent = translateProjectStatusText(project.name, currentLang);
  });

  document.querySelectorAll("[data-project-avatar]").forEach((node) => {
    const fallback = String(project.symbol || project.name || "R").trim().charAt(0).toUpperCase() || "R";
    if (project.logo) {
      node.innerHTML = `<img src="${project.logo}" alt="${project.name} logo" loading="lazy" />`;
      node.classList.add("has-logo");
    } else {
      node.textContent = fallback;
      node.classList.remove("has-logo");
    }
  });

  document.querySelectorAll("[data-project-symbol]").forEach((node) => {
    node.textContent = `${project.symbol} · ${chainConfig[project.chainKey].chain}`;
  });

  document.querySelectorAll("[data-project-address]").forEach((node) => {
    node.textContent = project.address;
  });

  document.querySelectorAll("[data-copy-address]").forEach((node) => {
    node.dataset.copy = project.address;
  });

  document.querySelectorAll("[data-project-tagline]").forEach((node) => {
    node.textContent = translateProjectStatusText(project.tagline, currentLang);
  });

  document.querySelectorAll("[data-project-type]").forEach((node) => {
    node.textContent = translateProjectStatusText(project.type, currentLang);
  });

  document.querySelectorAll("[data-project-imagery]").forEach((node) => {
    node.textContent = translateProjectStatusText(project.imagery, currentLang);
  });

  document.querySelectorAll("[data-project-music]").forEach((node) => {
    node.textContent = translateProjectStatusText(project.music, currentLang);
  });

  document.querySelectorAll("[data-project-price]").forEach((node) => {
    node.textContent = project.price;
  });

  document.querySelectorAll("[data-project-marketcap]").forEach((node) => {
    node.textContent = project.marketCap;
  });

  document.querySelectorAll("[data-project-liquidity]").forEach((node) => {
    node.textContent = project.liquidity;
  });

  document.querySelectorAll("[data-project-volume]").forEach((node) => {
    node.textContent = project.volume;
  });

  document.querySelectorAll("[data-project-story]").forEach((node) => {
    node.textContent = project.story || (commonI18n[currentLang]?.storyEmpty || "No complete story available yet.");
  });

  document.querySelectorAll("[data-project-emotion]").forEach((node) => {
    node.textContent = project.emotion || "自由 / 热血 / 团结 / 反叛";
  });

  document.querySelectorAll("[data-project-confidence]").forEach((node) => {
    node.textContent = translateProjectStatusText(`信息可信度 ${project.confidence || 0}%`, currentLang);
  });

  document.querySelectorAll("[data-project-website]").forEach((node) => {
    node.href = project.website || "#";
  });

  document.querySelectorAll("[data-project-twitter]").forEach((node) => {
    node.href = project.twitter || "#";
  });

  document.querySelectorAll("[data-project-telegram]").forEach((node) => {
    node.href = project.telegram || "#";
  });

  document.querySelectorAll("[data-project-pair-age]").forEach((node) => {
    node.textContent = translateProjectStatusText(project.pairAge || (commonI18n[currentLang]?.pairAge || "Pending"), currentLang);
  });
  document.querySelectorAll("[data-project-source-count]").forEach((node) => {
    node.textContent = translateProjectStatusText(project.sourceCount || (commonI18n[currentLang]?.sourceCount || "0"), currentLang);
  });
  document.querySelectorAll("[data-project-market-status]").forEach((node) => {
    node.textContent = translateProjectStatusText(project.marketStatus || (commonI18n[currentLang]?.marketWatching || "Watching"), currentLang);
  });
  document.querySelectorAll("[data-project-security-status]").forEach((node) => {
    node.textContent = translateProjectStatusText(project.securityStatus || (commonI18n[currentLang]?.securityPending || "Pending"), currentLang);
  });
  document.querySelectorAll("[data-project-avatar]").forEach((node) => {
    node.textContent = project.name.charAt(0).toUpperCase();
  });

  const narrativeNote = getNarrativeNote().trim();
  const noteCard = document.getElementById("narrativeNoteCard");
  const notePreview = document.getElementById("narrativeNotePreview");
  if (noteCard && notePreview) {
    if (narrativeNote) {
      noteCard.style.display = "grid";
      notePreview.textContent = narrativeNote;
    } else {
      noteCard.style.display = "none";
      notePreview.textContent = "-";
    }
  }
}

function applySharedLanguage(lang) {
  const config = homeI18n[lang];
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll(".main-nav a").forEach((link, index) => {
    if (config?.nav[index]) link.textContent = config.nav[index];
  });
  const toggle = document.getElementById("langToggle");
  if (toggle) toggle.textContent = config?.toggle || "EN";
  const footerCopy = document.querySelector(".site-footer .footer-copy span");
  if (footerCopy) footerCopy.textContent = commonI18n[lang]?.footer || commonI18n.zh.footer;
  syncWalletEntryButtons();
  renderGlobalPlayer();
}

function applyHomeLanguage(lang) {
  const c = homeI18n[lang];
  applySharedLanguage(lang);
  const set = (selector, value) => { const el = document.querySelector(selector); if (el) el.textContent = value; };
  set("#heroEyebrow", c.heroEyebrow); set("#heroDesc", c.heroDesc); set("#parseProjectBtn", c.parse); set(".example-title", c.exampleTitle); set("#supportLine", c.support);
  const heroTitle = document.getElementById("heroTitle");
  if (heroTitle) {
    heroTitle.innerHTML = lang === "en"
      ? `<span class="hero-title-lead">Contract In.</span><span class="hero-title-accent">Music Out.</span>`
      : c.heroTitle;
  }
  document.querySelectorAll(".example-card .example-meta strong").forEach((node, i) => { if (c.exampleCards?.[i]) node.textContent = c.exampleCards[i]; });
  set(".hero-aside .aside-head .eyebrow", c.asideEyebrow); set(".hero-aside .aside-head .meta-pill", c.asidePill); set(".hero-aside .story-block h3", c.asideStoryTitle);
  document.querySelectorAll(".hero-aside .metric-grid .metric-card span").forEach((n, i) => { if (c.asideMetrics[i]) n.textContent = c.asideMetrics[i]; });
  document.querySelectorAll(".hero-aside .story-list li span").forEach((n, i) => { if (c.asideStoryLabels[i]) n.textContent = c.asideStoryLabels[i]; });
  document.querySelectorAll(".hero-aside .signal-band span").forEach((n, i) => { if (c.asideSignals[i]) n.textContent = c.asideSignals[i]; });
  const sections = document.querySelectorAll("main > .section.shell.reveal");
  if (sections[0]) { const h = sections[0].querySelector(".section-heading"); if (h) { h.querySelector(".eyebrow").textContent = c.wfEyebrow; h.querySelector("h2").textContent = c.wfTitle; h.querySelector("p").textContent = c.wfDesc; } sections[0].querySelectorAll(".workflow-card").forEach((card, i) => { if (c.wfCards[i]) { card.querySelector("h3").textContent = c.wfCards[i][0]; card.querySelector("p").textContent = c.wfCards[i][1]; } }); }
  const analysis = document.querySelector(".preview-analysis")?.closest(".section");
  if (analysis) {
    const h = analysis.querySelector(".section-heading"); h.querySelector(".eyebrow").textContent = c.analysisEyebrow; h.querySelector("h2").textContent = c.analysisTitle; h.querySelector(".button").textContent = c.analysisBtn;
    const cols = analysis.querySelectorAll(".preview-column");
    cols[0].querySelector(".preview-heading h3").textContent = c.archiveTitle; cols[0].querySelector(".preview-heading .meta-pill").textContent = c.archivePill; cols[0].querySelectorAll(".metric-card span").forEach((n, i) => { if (c.archiveMetrics[i]) n.textContent = c.archiveMetrics[i]; }); cols[0].querySelectorAll(".chip-link").forEach((n, i) => { if (c.archiveLinks[i]) n.textContent = c.archiveLinks[i]; }); const copyBtn = cols[0].querySelector(".icon-button"); if (copyBtn) copyBtn.textContent = lang === "zh" ? "复制" : "Copy";
    cols[1].querySelector(".preview-heading h3").textContent = c.soulTitle; cols[1].querySelector(".preview-heading .meta-pill").textContent = c.soulPill; cols[1].querySelectorAll(".narrative-stack article span").forEach((n, i) => { if (c.soulLabels[i]) n.textContent = c.soulLabels[i]; }); cols[1].querySelectorAll(".signal-band span").forEach((n, i) => { if (c.soulSignals[i]) n.textContent = c.soulSignals[i]; }); cols[1].querySelectorAll(".action-row .button").forEach((n, i) => { if (c.soulActions[i]) n.textContent = c.soulActions[i]; });
  }
  const studio = document.querySelector(".studio-preview")?.closest(".section");
  if (studio) { const h = studio.querySelector(".section-heading"); h.querySelector(".eyebrow").textContent = c.studioEyebrow; h.querySelector("h2").textContent = c.studioTitle; h.querySelector(".button").textContent = c.studioBtn; set(".studio-card .cover-copy p", c.coverDesc); studio.querySelectorAll(".settings-preview .group-title").forEach((n, i) => { if (c.previewTitles[i]) n.textContent = c.previewTitles[i]; }); const gen = studio.querySelector(".settings-preview .button.primary"); if (gen) gen.textContent = c.previewGen; }
  const results = document.querySelector(".result-preview-grid")?.closest(".section");
  if (results) { const h = results.querySelector(".section-heading"); h.querySelector(".eyebrow").textContent = c.resultEyebrow; h.querySelector("h2").textContent = c.resultTitle; h.querySelector(".button").textContent = c.resultBtn; results.querySelectorAll(".result-preview").forEach((card, i) => { const d = c.resultCards[i]; if (!d) return; card.querySelector("h3").textContent = d[0]; card.querySelector("p").textContent = d[1]; card.querySelector(".text-link").textContent = d[2]; }); }
  const cta = document.querySelector(".cta-panel");
  if (cta) { cta.querySelector("h2").textContent = c.ctaTitle; cta.querySelector("p").textContent = c.ctaDesc; cta.querySelectorAll(".action-row .button").forEach((n, i) => { if (c.ctaBtns[i]) n.textContent = c.ctaBtns[i]; }); }
  const project = getStoredProject();
  const isPendingProject = [homeI18n.zh.pendingName, homeI18n.en.pendingName].includes(project?.name)
    || [homeI18n.zh.pendingTagline, homeI18n.en.pendingTagline].includes(project?.tagline)
    || [homeI18n.zh.pendingType, homeI18n.en.pendingType].includes(project?.type);
  if (isPendingProject) {
    document.querySelectorAll("[data-project-name]").forEach((n) => { n.textContent = c.pendingName; });
    document.querySelectorAll("[data-project-tagline]").forEach((n) => { n.textContent = c.pendingTagline; });
    document.querySelectorAll("[data-project-type]").forEach((n) => { n.textContent = c.pendingType; });
    document.querySelectorAll("[data-project-imagery]").forEach((n) => { n.textContent = c.pendingType; });
    document.querySelectorAll("[data-project-music]").forEach((n) => { n.textContent = c.pendingMusic; });
  }
  ["[data-project-name]", "[data-project-tagline]", "[data-project-type]", "[data-project-imagery]", "[data-project-music]"]
    .forEach((selector) => document.querySelectorAll(selector).forEach((n) => {
      n.textContent = translateProjectStatusText(n.textContent, lang);
    }));
  updateInputPlaceholder();
}

function applyPlazaLanguage(lang, isMine, walletAddress) {
  const config = plazaI18n[lang];
  applySharedLanguage(lang);
  const title = document.getElementById("plazaTitle");
  const subtitle = document.getElementById("plazaSubtitle");
  const eyebrow = document.getElementById("plazaEyebrow");
  if (eyebrow) eyebrow.textContent = isMine ? config.mine : config.eyebrow;
  if (title) title.textContent = isMine ? config.mineTitle : config.title;
  if (subtitle) subtitle.textContent = isMine ? (walletAddress ? config.mineSubtitle : config.mineNeedWallet) : config.subtitle;
  document.querySelectorAll("[data-plaza-mode]").forEach((button) => {
    button.textContent = button.dataset.plazaMode === "mine" ? config.mine : config.public;
  });
}

function applyProjectLanguage(lang) {
  const c = pageI18n.project[lang];
  applySharedLanguage(lang);
  const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
  const swapDemo = (selector, zh, en) => {
    document.querySelectorAll(selector).forEach((node) => {
      const text = node.textContent.trim();
      if ([zh, en].includes(text)) node.textContent = lang === "zh" ? zh : en;
    });
  };
  set("projectPagePill", c.pill); set("projectNextBtn", c.next); set("projectEyebrow", c.eyebrow); set("projectTitle", c.title); set("projectSubtitle", c.subtitle);
  const projectSheetPill = document.querySelector(".project-sheet .sheet-top .meta-pill");
  const copyBtn = document.querySelector(".project-sheet .copy-line .icon-button");
  const metricLabels = document.querySelectorAll(".project-sheet .metric-grid .metric-card span");
  const links = document.querySelectorAll(".project-sheet .link-row .chip-link");
  const soulEyebrow = document.querySelector(".narrative-sheet .mini-heading .eyebrow");
  const soulTitle = document.querySelector(".narrative-sheet .mini-heading h2");
  const soulLabels = document.querySelectorAll(".narrative-sheet .soul-card span");
  const sourceLabels = document.querySelectorAll(".narrative-sheet .source-strip span");
  const noteTitle = document.querySelector(".compact-head h3");
  const noteDesc = document.querySelector(".compact-head p");
  const noteInput = document.getElementById("projectNarrativeInput");
  const actionBtns = document.querySelectorAll(".narrative-sheet .action-row .button");
  if (projectSheetPill) projectSheetPill.textContent = c.archive;
  if (copyBtn) copyBtn.textContent = lang === "zh" ? "复制" : "Copy";
  metricLabels.forEach((node, i) => { if (c.metrics[i]) node.textContent = c.metrics[i]; });
  links.forEach((node, i) => { if (c.links[i]) node.textContent = c.links[i]; });
  if (soulEyebrow) soulEyebrow.textContent = c.soulEyebrow;
  if (soulTitle) soulTitle.textContent = c.soulTitle;
  soulLabels.forEach((node, i) => { if (c.soulLabels[i]) node.textContent = c.soulLabels[i]; });
  sourceLabels.forEach((node, i) => { if (c.sources[i]) node.textContent = c.sources[i]; });
  if (noteTitle) noteTitle.textContent = c.noteTitle;
  if (noteDesc) noteDesc.textContent = c.noteDesc;
  if (noteInput) noteInput.placeholder = c.notePlaceholder;
  if (actionBtns[0]) actionBtns[0].textContent = c.create;
  if (actionBtns[1]) actionBtns[1].textContent = c.edit;
  swapDemo("[data-project-type]", "Meme × 社区文化", "Meme × Community Culture");
  swapDemo("[data-project-tagline]", "一只代表自由、速度与社区共识的链上知更鸟。", "A chain-born robin shaped by freedom, speed and community consensus.");
  swapDemo("[data-project-story]", "这个项目把“飞行、突破与社区共识”转化为具有仪式感的链上文化表达，它不是单纯的 Meme，而是一个强调身份认同与群体传播的共同体。", "This project turns flight, breakout and community consensus into a ritualized on-chain cultural expression. It is more than a meme. It is a shared identity built for collective spread.");
  swapDemo("[data-project-imagery]", "知更鸟 / 霓虹城市 / 声波 / 飞行 / 绿色光芒", "Robin / Neon City / Soundwave / Flight / Green Glow");
  swapDemo("[data-project-emotion]", "自由 / 热血 / 团结 / 反叛", "Freedom / Intensity / Unity / Rebel");
  swapDemo("[data-project-music]", "电子摇滚 · 社区合唱 · 128 BPM", "Electronic Rock · Community Chorus · 128 BPM");
}

function applyStudioLanguage(lang) {
  const c = pageI18n.studio[lang];
  applySharedLanguage(lang);
  const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
  set("studioPagePill", c.pill); set("studioStartBtn", c.start); set("studioEyebrow", c.eyebrow); set("studioTitle", c.title); set("studioSubtitle", c.subtitle);
  document.querySelectorAll(".studio-panel .group-head h3").forEach((node, i) => { if (c.groups[i]) node.textContent = c.groups[i]; });
  document.querySelectorAll(".studio-panel .group-head p").forEach((node, i) => { if (c.groupDesc[i]) node.textContent = c.groupDesc[i]; });
  const gatePill = document.querySelector("#walletGate .meta-pill");
  const connectBtn = document.getElementById("connectWalletBtn");
  if (gatePill) gatePill.textContent = c.gatePill;
  if (connectBtn) connectBtn.textContent = c.connect;
  const langLabels = lang === "zh" ? ["中文", "English", "中英双语"] : ["Chinese", "English", "Bilingual"];
  document.querySelectorAll("[data-select-group='language'] .seg-chip").forEach((node, i) => { if (langLabels[i]) node.textContent = langLabels[i]; });
  const styleTitles = lang === "zh" ? ["🔥 热血社区战歌", "🌀 Meme 魔性神曲", "🌃 暗黑电子", "⚡ 赛博朋克", "🥁 国潮说唱", "🎻 史诗管弦"] : ["🔥 Community Anthem", "🌀 Meme Earworm", "🌃 Dark Electronic", "⚡ Cyberpunk", "🥁 Guochao Rap", "🎻 Epic Orchestral"];
  const styleDescs = lang === "zh" ? ["强节奏、群体合唱，适合社区会议和传播。", "易记、反复、带梗感，适合高传播项目。", "低频厚重，适合神秘、赛博、未来感项目。", "霓虹、机械、速度感，适合高能量叙事。", "适合强调文化属性与态度表达的项目。", "更像项目主旋律，适合愿景型品牌叙事。"] : ["Strong rhythm and group chorus for community momentum.", "Catchy, loopable and meme-ready for viral projects.", "Heavy low-end for mysterious cyber-future narratives.", "Neon, mechanical and fast for high-energy storytelling.", "Fits projects with cultural identity and attitude.", "Feels like a main theme for vision-driven brand stories."];
  document.querySelectorAll("[data-select-group='style'] .style-card").forEach((node, i) => { const strong = node.querySelector("strong"); const span = node.querySelector("span"); if (strong && styleTitles[i]) strong.textContent = styleTitles[i]; if (span && styleDescs[i]) span.textContent = styleDescs[i]; });
  const focusLabels = lang === "zh" ? ["项目故事", "社区共识", "代币机制", "Meme 文化", "综合"] : ["Project Story", "Community", "Token Design", "Meme Culture", "Mixed"];
  document.querySelectorAll("[data-select-group='focus'] .seg-chip").forEach((node, i) => { if (focusLabels[i]) node.textContent = focusLabels[i]; });
  const posterLabels = lang === "zh" ? ["黑金 Web3", "霓虹赛博", "Meme 卡通", "电影史诗", "国潮", "未来科技"] : ["Black Gold Web3", "Neon Cyber", "Meme Cartoon", "Cinematic Epic", "Guochao", "Future Tech"];
  document.querySelectorAll("[data-select-group='poster'] .poster-style span").forEach((node, i) => { if (posterLabels[i]) node.textContent = posterLabels[i]; });
}

function applyCreatingLanguage(lang) {
  const c = pageI18n.creating[lang];
  applySharedLanguage(lang);
  const name = getStoredProject()?.name || "Robin";
  const set = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
  set("creatingPagePill", c.pill); set("creatingEyebrow", c.eyebrow); set("creatingTitle", c.title.replace("{{name}}", name)); set("creatingSubtitle", c.subtitle);
  document.querySelectorAll("#progressList .progress-item span:last-child").forEach((node, i) => { if (c.steps[i]) node.textContent = c.steps[i]; });
  const dynamicSentence = document.getElementById("dynamicSentence");
  const statePill = document.getElementById("generationStatePill");
  const hint = document.getElementById("generationHint");
  const toResultBtn = document.getElementById("toResultBtn");
  if (dynamicSentence && !dynamicSentence.dataset.live) dynamicSentence.textContent = c.pending[0];
  if (statePill && !statePill.dataset.live) statePill.textContent = c.pill;
  if (hint && !hint.dataset.live) hint.textContent = c.hints[0];
  if (toResultBtn) toResultBtn.textContent = c.toResult;
}

function applyResultLanguage(lang, isDetail) {
  const c = pageI18n.result[lang];
  applySharedLanguage(lang);
  const pill = document.getElementById("resultPagePill");
  const works = document.getElementById("backToWorksBtn");
  const edit = document.getElementById("resultEditBtn");
  if (pill) pill.textContent = isDetail ? c.detail : c.result;
  if (works) works.textContent = c.works;
  if (edit) edit.textContent = c.edit;
  document.querySelectorAll("#resultMetaGrid span").forEach((node, i) => { if (c.meta[i]) node.textContent = c.meta[i]; });
  const actionBtns = document.querySelectorAll(".album-info > .action-row .button");
  actionBtns.forEach((node, i) => { if (c.actions[i]) node.textContent = c.actions[i]; });
  const audioTitle = document.querySelector(".audio-player-head p");
  const noAudio = document.getElementById("musicStatusText");
  const navPill = document.querySelector(".lyrics-nav .meta-pill");
  const moduleTitles = document.querySelectorAll(".result-grid .mini-heading h2");
  const modulePills = document.querySelectorAll(".result-grid .mini-heading .meta-pill");
  const promptTitle = document.querySelector(".music-plan .prompt-box p");
  const mediaTabs = document.querySelectorAll("[data-select-group='result-media'] .seg-chip");
  const posterBtns = document.querySelectorAll(".poster-panel .action-row .button");
  if (audioTitle) audioTitle.textContent = c.audioTitle;
  if (noAudio && !noAudio.dataset.live) noAudio.textContent = c.noAudio;
  if (navPill) navPill.textContent = c.nav;
  if (moduleTitles[0]) moduleTitles[0].textContent = c.modules[0];
  if (modulePills[0]) modulePills[0].textContent = c.modules[1];
  if (promptTitle) promptTitle.textContent = c.modules[2];
  if (moduleTitles[1]) moduleTitles[1].textContent = c.modules[3];
  if (mediaTabs[0]) mediaTabs[0].textContent = c.modules[4];
  if (mediaTabs[1]) mediaTabs[1].textContent = c.modules[5];
  posterBtns.forEach((node, i) => { if (c.modules[i + 6]) node.textContent = c.modules[i + 6]; });
  document.querySelectorAll(".music-plan .plan-table span").forEach((node, i) => { if (c.plan[i]) node.textContent = c.plan[i]; });
}

function updateInputPlaceholder() {
  const input = document.getElementById("contractField");
  const selectedChainLabel = document.getElementById("selectedChainLabel");
  const inputHint = document.getElementById("inputHint");
  const config = chainConfig[selectedChain];

  if (!config) return;

  if (input) {
    input.placeholder = currentLang === "zh" ? config.placeholderZh : config.placeholderEn;
  }

  if (selectedChainLabel) {
    selectedChainLabel.textContent = config.short;
  }

  if (inputHint) {
    inputHint.textContent = currentLang === "zh" ? config.placeholderZh : config.placeholderEn;
  }

  document.querySelectorAll(".chain-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.chain === selectedChain);
  });
}

function initHomePage() {
  const input = document.getElementById("contractField");
  const toggle = document.getElementById("langToggle");
  const form = document.getElementById("heroSearchForm");
  const sampleButtons = document.querySelectorAll("[data-sample]");
  const storedProject = getStoredProject();

  selectedChain = storedProject.chainKey || selectedChain;
  applyProjectToPage(storedProject);
  if (input) {
    input.value = storedProject.address;
  }

  updateInputPlaceholder();
  applyHomeLanguage(currentLang);

  document.querySelectorAll(".chain-tab").forEach((button) => {
    button.addEventListener("click", () => {
      selectedChain = button.dataset.chain;
      localStorage.setItem("robin-melody-chain", selectedChain);
      updateInputPlaceholder();
    });
  });

  sampleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const project = sampleProjects[button.dataset.sample];
      selectedChain = project.chainKey;
      if (input) input.value = project.address;
      saveProject(project);
      applyProjectToPage(project);
      updateInputPlaceholder();
    });
  });

  if (toggle) {
    toggle.addEventListener("click", () => {
      currentLang = currentLang === "zh" ? "en" : "zh";
      localStorage.setItem("robin-melody-lang", currentLang);
      applyHomeLanguage(currentLang);
    });
  }

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const button = document.getElementById("parseProjectBtn");
      const base = sampleProjects[selectedChain];
      const address = input && input.value.trim() ? input.value.trim() : base.address;

      if (button) {
        button.disabled = true;
        button.classList.add("is-loading");
        button.setAttribute("aria-busy", "true");
        button.textContent = currentLang === "zh" ? "解析中..." : "Analyzing...";
      }

      try {
        const response = await fetch(`${API_BASE}/project?chain=${selectedChain}&address=${encodeURIComponent(address)}`);
        const payload = await response.json();

        if (!payload.found) {
          saveProject({
            ...base,
            address,
            name: "待解析项目",
            symbol: "TOKEN",
            tagline: payload?.narrative?.oneLiner || "当前地址未获取到真实链上资料。",
            type: "未解析到真实项目",
            imagery: "未获取到真实资料",
            music: "待解析",
            story: payload?.narrative?.coreStory || "当前地址暂未匹配到 Dex 交易对或链上项目资料，请更换地址后重试。",
            emotion: "待确认",
            confidence: 0,
            price: "--",
            marketCap: "--",
            liquidity: "--",
            volume: "--",
            website: "#",
            twitter: "#",
            telegram: "#",
            pairAge: "待确认",
            sourceCount: "0 项",
            marketStatus: "未获取",
            securityStatus: "待补全"
          });
          window.location.href = "./project.html";
          return;
        }

        const project = normalizeApiProject(selectedChain, payload);
        saveProject(project);
        window.location.href = "./project.html";
      } catch (error) {
        if (button) button.textContent = currentLang === "zh" ? "解析失败，请重试" : "Try Again";
      } finally {
        if (button && !button.disabled) return;
        window.setTimeout(() => {
          if (button) {
            button.disabled = false;
            button.classList.remove("is-loading");
            button.removeAttribute("aria-busy");
            button.textContent = currentLang === "zh" ? "解析项目" : "Analyze Project";
          }
        }, 600);
      }
    });
  }
}

function getSelectedValue(groupName) {
  const active = document.querySelector(`[data-select-group="${groupName}"] .active`);
  return active?.dataset.value || active?.textContent?.trim() || "";
}

function saveGeneration(result) {
  localStorage.setItem("robin-melody-result", JSON.stringify(result));
  if (document.body) renderGlobalPlayer();
}

function getStoredGeneration() {
  const stored = localStorage.getItem("robin-melody-result");
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (error) {
    return null;
  }
}

function ensureGlobalPlayer() {
  let shell = document.getElementById("globalPlayerShell");
  if (shell) return shell;
  shell = document.createElement("div");
  shell.id = "globalPlayerShell";
  shell.className = "global-player-shell";
  shell.innerHTML = `<div class="shell"><div class="global-player panel"><div class="global-player-cover" id="globalPlayerCover"></div><div class="global-player-copy"><div class="global-player-topline"><span class="global-player-kicker" id="globalPlayerKicker"></span><span class="global-player-status" id="globalPlayerStatus"></span><span class="global-player-wave" aria-hidden="true"><i></i><i></i><i></i><i></i></span></div><strong id="globalPlayerTitle"></strong><p id="globalPlayerMeta"></p></div><a class="button ghost global-player-link" id="globalPlayerLink" href="./result.html"></a><div class="global-player-audio-slot"><div class="global-player-audio-placeholder" id="globalPlayerAudioPlaceholder"></div><audio id="globalPlayerAudio" controls preload="metadata"></audio></div></div></div>`;
  document.body.appendChild(shell);
  return shell;
}

function syncGlobalPlayerPlaybackState() {
  const shell = document.getElementById("globalPlayerShell");
  const audio = document.getElementById("globalPlayerAudio");
  const status = document.getElementById("globalPlayerStatus");
  const hasSrc = Boolean(audio?.getAttribute("src"));
  const ready = Boolean(hasSrc && Number.isFinite(audio?.duration) && audio.duration > 0 && audio.readyState >= 1);
  const playing = Boolean(ready && audio && !audio.paused && !audio.ended && audio.currentTime > 0);
  if (shell) {
    shell.classList.toggle("is-audio-ready", ready);
    shell.classList.toggle("is-audio-loading", hasSrc && !ready);
    shell.classList.toggle("is-playing", playing);
  }
  if (status) {
    status.textContent = !hasSrc
      ? (currentLang === "zh" ? "暂无音频" : "No Audio")
      : !ready
        ? (currentLang === "zh" ? "加载音频中" : "Loading Audio")
        : playing
          ? (currentLang === "zh" ? "播放中" : "Playing")
          : (currentLang === "zh" ? "待播放" : "Ready");
  }
}

function bindGlobalPlayerAudio() {
  const audio = document.getElementById("globalPlayerAudio");
  if (!audio || audio.dataset.bound) return;
  ["play", "pause", "ended", "emptied", "loadedmetadata", "loadeddata", "durationchange", "canplay", "error"].forEach((eventName) => {
    audio.addEventListener(eventName, syncGlobalPlayerPlaybackState);
  });
  audio.dataset.bound = "true";
  syncGlobalPlayerPlaybackState();
}

function renderGlobalPlayer() {
  const shell = ensureGlobalPlayer();
  const result = getStoredGeneration();
  const hasAudio = Boolean(result?.musicAudioUrl);
  shell.style.display = hasAudio ? "block" : "none";
  shell.classList.remove("is-playing");
  document.body.classList.toggle("has-global-player", hasAudio);
  if (!hasAudio) return;
  const title = document.getElementById("globalPlayerTitle");
  const meta = document.getElementById("globalPlayerMeta");
  const kicker = document.getElementById("globalPlayerKicker");
  const cover = document.getElementById("globalPlayerCover");
  const link = document.getElementById("globalPlayerLink");
  const audio = document.getElementById("globalPlayerAudio");
  if (kicker) kicker.textContent = currentLang === "zh" ? "最近生成" : "Latest Track";
  if (title) title.textContent = result.songTitle || result.projectName || (currentLang === "zh" ? "未命名作品" : "Untitled");
  if (meta) meta.textContent = result.subtitle || `${result.projectName || "ContractBeat"} · ${chainConfig[result.chain]?.name || (currentLang === "zh" ? "已生成歌曲" : "Generated Track")}`;
  if (link) {
    const linkText = currentLang === "zh" ? "打开结果页" : "Open Result";
    link.textContent = linkText;
    link.href = result.id ? `./result.html?id=${result.id}` : "./result.html";
    link.setAttribute("aria-label", linkText);
    link.setAttribute("title", linkText);
  }
  if (audio && audio.getAttribute("src") !== result.musicAudioUrl) {
    audio.src = result.musicAudioUrl;
    audio.load();
  }
  if (cover) cover.style.background = result.coverImageUrl ? `linear-gradient(180deg, rgba(5,10,7,0.06), rgba(5,10,7,0.18)), url("${result.coverImageUrl}") center/cover no-repeat` : "linear-gradient(135deg, rgba(201,255,24,0.24), rgba(255,53,181,0.24), rgba(100,215,255,0.2))";
  bindGlobalPlayerAudio();
  syncGlobalPlayerPlaybackState();
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name) || "";
}

function initSelectionGroups() {
  document.querySelectorAll("[data-select-group]").forEach((group) => {
    group.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        group.querySelectorAll("button").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");

        if (group.dataset.selectGroup === "result-media") {
          const target = button.dataset.target;
          document.querySelectorAll("[data-media-frame]").forEach((frame) => {
            frame.classList.toggle("active", frame.dataset.mediaFrame === target);
          });
          const stage = document.getElementById("resultMediaStage");
          if (stage) {
            stage.classList.toggle("is-cover", target === "cover");
            stage.classList.toggle("is-poster", target === "poster");
          }
        }
      });
    });
  });
}

function initProjectPage() {
  const textarea = document.getElementById("projectNarrativeInput");
  const count = document.getElementById("narrativeCount");
  const toggle = document.getElementById("langToggle");
  applyProjectLanguage(currentLang);
  if (toggle) toggle.addEventListener("click", () => {
    currentLang = currentLang === "zh" ? "en" : "zh";
    localStorage.setItem("robin-melody-lang", currentLang);
    applyProjectLanguage(currentLang);
  });
  if (!textarea) return;

  textarea.value = getNarrativeNote();
  if (count) count.textContent = `${textarea.value.length} / 200`;

  textarea.addEventListener("input", () => {
    const value = textarea.value.slice(0, 200);
    textarea.value = value;
    saveNarrativeNote(value);
    if (count) count.textContent = `${value.length} / 200`;
  });
}

function initStudioPage() {
  const form = document.getElementById("studioForm");
  const button = document.getElementById("generateMelodyBtn");
  const connectWalletBtn = document.getElementById("connectWalletBtn");
  const toggle = document.getElementById("langToggle");
  applyStudioLanguage(currentLang);
  const walletGate = document.getElementById("walletGate");
  const walletGateTitle = document.getElementById("walletGateTitle");
  const walletGateHint = document.getElementById("walletGateHint");

  if (!form) return;

  const syncWalletGate = () => {
    const walletAddress = getWalletAddress().trim();
    const connected = Boolean(walletAddress);

    if (walletGate) {
      walletGate.classList.toggle("is-connected", connected);
    }
    const c = pageI18n.studio[currentLang];
    if (walletGateTitle) walletGateTitle.textContent = connected ? c.gateOn : c.gateOff;
    if (walletGateHint) walletGateHint.textContent = connected
      ? (currentLang === "zh" ? `当前连接地址：${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}，现在可以生成你的项目旋律。` : `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}. You can generate now.`)
      : c.hintOff;
    if (button) {
      button.disabled = !connected;
      button.classList.toggle("disabled", !connected);
      if (!connected) {
        button.setAttribute("aria-disabled", "true");
        button.textContent = c.generateOff;
      } else {
        button.removeAttribute("aria-disabled");
        button.textContent = c.generateOn;
      }
    }
  };

  if (connectWalletBtn) {
    connectWalletBtn.addEventListener("click", async () => {
      const ethereum = window.ethereum;
      if (!ethereum?.request) {
        if (walletGateHint) walletGateHint.textContent = commonI18n[currentLang]?.browserWalletMissing || "No wallet extension detected.";
        return;
      }

      try {
        await requestWalletConnection();
        syncWalletEntryButtons();
        syncWalletGate();
      } catch (error) {
        if (walletGateHint) {
          walletGateHint.textContent = error.message === "WALLET_NOT_FOUND"
            ? (commonI18n[currentLang]?.browserWalletMissing || "No wallet extension detected.")
            : (commonI18n[currentLang]?.walletCancelledLong || "Wallet connection was cancelled.");
        }
      }
    });
  }

  if (toggle) toggle.addEventListener("click", () => {
    currentLang = currentLang === "zh" ? "en" : "zh";
    localStorage.setItem("robin-melody-lang", currentLang);
    applyStudioLanguage(currentLang);
    syncWalletGate();
  });

  syncWalletGate();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const walletAddress = getWalletAddress().trim();

    if (!walletAddress) {
      syncWalletGate();
      return;
    }

    const project = getStoredProject();
    const payload = {
      projectName: project.name,
      chain: project.chainKey,
      address: project.address,
      language: getSelectedValue("language"),
      musicStyle: getSelectedValue("style"),
      lyricFocus: getSelectedValue("focus"),
      posterStyle: getSelectedValue("poster"),
      userNarrative: getNarrativeNote(),
      walletAddress
    };

    if (button) {
      button.disabled = true;
      button.classList.remove("disabled");
      button.textContent = currentLang === "zh" ? "生成中..." : "Generating...";
    }

    try {
      const response = await fetch(`${API_BASE}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      saveGeneration({ ...result, projectName: project.name, walletAddress });
      window.location.href = "./creating.html";
    } catch (error) {
      if (button) button.textContent = currentLang === "zh" ? "生成失败，请重试" : "Generation failed. Retry.";
    } finally {
      window.setTimeout(() => {
        syncWalletGate();
      }, 600);
    }
  });
}

function initCreatingPage() {
  const steps = Array.from(document.querySelectorAll("[data-progress-step]"));
  const dynamicSentence = document.getElementById("dynamicSentence");
  const toggle = document.getElementById("langToggle");
  applyCreatingLanguage(currentLang);
  if (toggle) toggle.addEventListener("click", () => {
    currentLang = currentLang === "zh" ? "en" : "zh";
    localStorage.setItem("robin-melody-lang", currentLang);
    applyCreatingLanguage(currentLang);
  });
  const generationHint = document.getElementById("generationHint");
  const generationStatePill = document.getElementById("generationStatePill");
  const generationRitual = document.getElementById("generationRitual");
  const button = document.getElementById("toResultBtn");
  const result = getStoredGeneration();

  if (!result?.musicTaskId) {
    if (dynamicSentence) dynamicSentence.textContent = pageI18n.creating[currentLang].noTask;
    return;
  }

  const markDone = (index) => {
    const current = steps[index];
    if (!current) return;
    current.classList.remove("active");
    current.classList.add("done");
    current.querySelector(".progress-mark").textContent = "✓";
  };

  const setActive = (index) => {
    steps.forEach((item, itemIndex) => {
      if (item.classList.contains("done")) return;
      item.classList.toggle("active", itemIndex === index);
      item.querySelector(".progress-mark").textContent = itemIndex === index ? "●" : "○";
    });
  };

  const pendingSentences = pageI18n.creating[currentLang].pending;
  const pendingHints = pageI18n.creating[currentLang].hints;

  const poll = async () => {
    try {
      const requests = [];
      if (result.musicTaskId) {
        requests.push(fetch(`${API_BASE}/music/${result.musicTaskId}?generationId=${result.id}`).then((r) => r.json()));
      } else {
        requests.push(Promise.resolve(null));
      }
      if (result.coverTaskId) {
        requests.push(fetch(`${API_BASE}/image/${result.coverTaskId}?generationId=${result.id}&type=cover`).then((r) => r.json()));
      } else {
        requests.push(Promise.resolve(null));
      }
      if (result.posterTaskId) {
        requests.push(fetch(`${API_BASE}/image/${result.posterTaskId}?generationId=${result.id}&type=poster`).then((r) => r.json()));
      } else {
        requests.push(Promise.resolve(null));
      }

      const [music, cover, poster] = await Promise.all(requests);
      const musicDone = music && (music.status === "success" || music.status === "completed");
      const coverDone = !cover || cover.status === "success";
      const posterDone = !poster || poster.status === "success";
      const sentence = pendingSentences[Math.floor(Math.random() * pendingSentences.length)];
      const hint = pendingHints[Math.floor(Math.random() * pendingHints.length)];

      saveGeneration({
        ...getStoredGeneration(),
        musicTaskId: result.musicTaskId,
        musicStatus: music?.status || result.musicStatus,
        musicAudioUrl: music?.audioUrl || result.musicAudioUrl,
        musicMessage: musicDone
          ? (currentLang === "zh" ? "歌曲已生成，可进入结果页播放" : "Song ready. Open the result page to play.")
          : (currentLang === "zh" ? "歌曲正在生成中，请稍候片刻" : "Song is still generating. Please wait a moment."),
        coverTaskId: result.coverTaskId,
        coverStatus: cover?.status || result.coverStatus,
        coverImageUrl: cover?.imageUrl || result.coverImageUrl,
        posterTaskId: result.posterTaskId,
        posterStatus: poster?.status || result.posterStatus,
        posterImageUrl: poster?.imageUrl || result.posterImageUrl
      });

      if (musicDone) {
        markDone(0);
      } else {
        setActive(0);
      }

      if (coverDone) {
        markDone(1);
      } else if (musicDone) {
        setActive(1);
      }

      if (posterDone) {
        markDone(2);
      } else if (musicDone && coverDone) {
        setActive(2);
      }

      if (dynamicSentence) {
        dynamicSentence.dataset.live = "true";
        dynamicSentence.textContent = musicDone && coverDone && posterDone
          ? pageI18n.creating[currentLang].complete
          : sentence;
      }

      if (generationHint) {
        generationHint.dataset.live = "true";
        generationHint.textContent = musicDone && coverDone && posterDone
          ? pageI18n.creating[currentLang].completeHint
          : hint;
      }

      if (musicDone && coverDone && posterDone) {
        if (generationStatePill) {
          generationStatePill.dataset.live = "true";
          generationStatePill.textContent = pageI18n.creating[currentLang].stateDone;
        }
        if (generationRitual) generationRitual.classList.add("is-complete");
        if (button) {
          button.classList.remove("disabled");
          button.removeAttribute("aria-disabled");
          button.textContent = pageI18n.creating[currentLang].viewResult;
        }
        return;
      }

      if (generationStatePill) {
        generationStatePill.dataset.live = "true";
        generationStatePill.textContent = pageI18n.creating[currentLang].pill;
      }
      if (generationRitual) generationRitual.classList.remove("is-complete");

      window.setTimeout(poll, 4000);
    } catch (error) {
      if (dynamicSentence) dynamicSentence.textContent = currentLang === "zh" ? "生成仍在继续，但任务状态暂时不可见，请稍后再试。" : "Generation is still running, but task status is temporarily unavailable.";
      if (generationHint) generationHint.textContent = currentLang === "zh" ? "系统正在重新连接生成通道" : "Reconnecting to the generation channel.";
    }
  };

  poll();
}

async function renderResultPage() {
  let result = getStoredGeneration();
  const resultId = getQueryParam("id");
  const walletAddress = getWalletAddress().trim();
  const toggle = document.getElementById("langToggle");

  if (resultId) {
    try {
      const detailUrl = walletAddress
        ? `${API_BASE}/plaza/${resultId}?wallet=${encodeURIComponent(walletAddress)}`
        : `${API_BASE}/plaza/${resultId}`;
      const response = await fetch(detailUrl);
      const payload = await response.json();
      if (payload?.item) {
        result = { ...result, ...payload.item, projectName: payload.item.projectName || result?.projectName };
        saveGeneration(result);
      }
    } catch (error) {
      console.error("result detail fetch failed:", error);
    }
  }

  if (!result) return;

  const title = document.querySelector("[data-result-title]");
  const subtitle = document.querySelector("[data-result-subtitle]");
  const tags = document.querySelector("[data-result-tags]");
  const lyrics = document.querySelector("[data-result-lyrics]");
  const plan = document.querySelector("[data-result-plan]");
  const prompt = document.querySelector("[data-result-prompt]");
  const copyLyricsBtn = document.getElementById("copyLyricsBtn");
  const copyPromptBtn = document.getElementById("copyPromptBtn");
  const copyPromoBtn = document.getElementById("copyPromoBtn");
  const shareBtn = document.getElementById("shareResultBtn");
  const resultPagePill = document.getElementById("resultPagePill");
  const backToWorksBtn = document.getElementById("backToWorksBtn");
  const resultMetaId = document.getElementById("resultMetaId");
  const resultMetaChain = document.getElementById("resultMetaChain");
  const resultMetaWallet = document.getElementById("resultMetaWallet");
  const resultMetaAddress = document.getElementById("resultMetaAddress");
  const resultMetaCreatedAt = document.getElementById("resultMetaCreatedAt");
  const audio = document.getElementById("resultAudio");
  const musicStatusText = document.getElementById("musicStatusText");
  const albumArt = document.getElementById("resultAlbumArt");
  const coverFrame = document.getElementById("resultCoverFrame");
  const posterFrame = document.getElementById("resultPosterFrame");

  applyResultLanguage(currentLang, Boolean(resultId));
  if (toggle) toggle.addEventListener("click", () => {
    currentLang = currentLang === "zh" ? "en" : "zh";
    localStorage.setItem("robin-melody-lang", currentLang);
    applyResultLanguage(currentLang, Boolean(resultId));
  });
  if (backToWorksBtn) {
    backToWorksBtn.style.display = walletAddress ? "inline-flex" : "none";
  }
  if (title) title.textContent = `《${result.songTitle}》`;
  if (subtitle) subtitle.textContent = result.subtitle || (currentLang === "zh" ? `${result.projectName} 项目主题曲` : `${result.projectName} Theme Anthem`);
  if (resultMetaId) resultMetaId.textContent = `# ${result.id || resultId || "--"}`;
  if (resultMetaChain) resultMetaChain.textContent = chainConfig[result.chain]?.name || formatLongText(result.chain, commonI18n[currentLang]?.unknown || "Unknown");
  if (resultMetaWallet) resultMetaWallet.textContent = formatWalletAddress(result.walletAddress || walletAddress) || (currentLang === "zh" ? "未连接" : "Not connected");
  if (resultMetaAddress) resultMetaAddress.textContent = formatLongText(result.address, commonI18n[currentLang]?.pending || "Pending");
  if (resultMetaCreatedAt) resultMetaCreatedAt.textContent = formatCreatedAt(result.createdAt);
  if (tags && Array.isArray(result.musicTags)) {
    tags.innerHTML = result.musicTags.map((item) => `<span class="meta-pill">${item}</span>`).join("");
  }
  if (lyrics && result.lyrics) {
    const parts = result.lyrics.split(/\n\n+/).filter(Boolean);
    lyrics.innerHTML = parts.map((block, index) => {
      const rows = block.split("\n");
      const heading = rows.shift() || `SECTION ${index + 1}`;
      return `<article class="lyric-block${index === 1 ? " chorus" : ""}"><span>${heading}</span><p>${rows.join("<br />")}</p></article>`;
    }).join("");
  }
  if (plan && Array.isArray(result.musicTags)) {
    plan.innerHTML = `
      <div><span>风格</span><strong>${result.musicTags[0] || "未定义"}</strong></div>
      <div><span>速度</span><strong>${result.musicTags[2] || "128 BPM"}</strong></div>
      <div><span>人声</span><strong>男声主唱 + 社区合唱</strong></div>
      <div><span>乐器</span><strong>合成器、重低音、电影鼓点</strong></div>
      <div><span>情绪</span><strong>热血、自由、未来感</strong></div>
    `;
  }
  if (prompt) prompt.textContent = result.promptText || "";
  if (copyLyricsBtn) copyLyricsBtn.dataset.copy = result.lyrics || "";
  if (copyPromptBtn) copyPromptBtn.dataset.copy = result.promptText || "";
  if (copyPromoBtn) copyPromoBtn.dataset.copy = currentLang === "zh"
    ? `${result.subtitle || result.projectName} 已生成，欢迎社区共鸣转发。`
    : `${result.subtitle || result.projectName} is ready. Share it with your community.`;
  if (shareBtn) {
    shareBtn.dataset.copy = `${window.location.origin}${window.location.pathname}${resultId ? `?id=${resultId}` : ""}`;
  }
  if (musicStatusText) {
    musicStatusText.dataset.live = "true";
    musicStatusText.textContent = result.musicStatus === "completed" || result.musicStatus === "success"
      ? (currentLang === "zh" ? "歌曲已生成，可直接播放" : "Song ready to play")
      : (result.musicMessage || pageI18n.result[currentLang].noAudio);
  }
  if (audio && result.musicAudioUrl) {
    audio.src = result.musicAudioUrl;
    audio.style.display = "block";
  }
  if (albumArt && result.coverImageUrl) {
    albumArt.style.background = `linear-gradient(180deg, rgba(5,10,7,0.06), rgba(5,10,7,0.18)), url("${result.coverImageUrl}") center/cover no-repeat`;
  }
  if (coverFrame && result.coverImageUrl) {
    coverFrame.style.background = `linear-gradient(180deg, rgba(5,10,7,0.04), rgba(5,10,7,0.12)), url("${result.coverImageUrl}") center/cover no-repeat`;
  }
  if (posterFrame && result.posterImageUrl) {
    posterFrame.style.background = `linear-gradient(180deg, rgba(5,10,7,0.04), rgba(5,10,7,0.12)), url("${result.posterImageUrl}") center/cover no-repeat`;
  }
}

function buildPlazaUrl(isMine, page) {
  const params = new URLSearchParams();
  if (isMine) params.set("mode", "mine");
  if (page > 1) params.set("page", String(page));
  const query = params.toString();
  return `./plaza.html${query ? `?${query}` : ""}`;
}

function renderPlazaPagination(pagination, options = {}) {
  const node = document.getElementById("plazaPagination");
  const isMine = Boolean(options.isMine);
  const text = currentLang === "zh" ? { prev: "上一页", next: "下一页" } : { prev: "Previous", next: "Next" };
  if (!node || !pagination || pagination.totalPages <= 1) {
    if (node) node.innerHTML = "";
    return;
  }
  const pages = Array.from({ length: pagination.totalPages }, (_, i) => i + 1).slice(Math.max(0, pagination.page - 3), pagination.page + 2);
  node.innerHTML = `
    <a class="button ghost ${pagination.hasPrev ? "" : "disabled"}" href="${pagination.hasPrev ? buildPlazaUrl(isMine, pagination.page - 1) : "#"}" aria-disabled="${pagination.hasPrev ? "false" : "true"}">${text.prev}</a>
    <div class="plaza-page-numbers">${pages.map((page) => `<a class="seg-chip ${page === pagination.page ? "active" : ""}" href="${buildPlazaUrl(isMine, page)}">${page}</a>`).join("")}</div>
    <a class="button ghost ${pagination.hasNext ? "" : "disabled"}" href="${pagination.hasNext ? buildPlazaUrl(isMine, pagination.page + 1) : "#"}" aria-disabled="${pagination.hasNext ? "false" : "true"}">${text.next}</a>
  `;
}

function renderPlazaItems(items, options = {}) {
  const grid = document.getElementById("plazaGrid");
  const isMine = Boolean(options.isMine);
  const text = currentLang === "zh"
    ? { noCover: "暂无封面", empty: "暂无作品", emptyMineTitle: "你还没有作品", emptyPublicTitle: "还没有生成记录进入广场", emptyMineDesc: "先连接钱包并生成第一首项目旋律，之后这里会显示你的个人历史作品。", emptyPublicDesc: "先去创作设置页生成第一首项目旋律，成功后这里会自动出现作品卡片。", cta: "去生成第一首", view: "查看完整作品", mineSuffix: " 的历史作品已归档到当前钱包，可继续进入详情页查看。", publicSuffix: " 的最新生成结果，已写入旋律广场，可继续进入结果页查看完整内容。" }
    : { noCover: "No Cover", empty: "No Works", emptyMineTitle: "No works yet", emptyPublicTitle: "No works in plaza yet", emptyMineDesc: "Connect your wallet and create your first anthem to build your archive.", emptyPublicDesc: "Create your first project anthem and the cards will appear here.", cta: "Create First", view: "View Work", mineSuffix: " is archived under your wallet and can be opened in detail.", publicSuffix: " is now in the plaza and ready to open in the result page." };
  if (!grid) return;

  const buildPlazaCover = (imageUrl, label = text.noCover) => imageUrl
    ? `<div class="plaza-cover" style="background-image: linear-gradient(180deg, rgba(5,10,7,0.08), rgba(5,10,7,0.18)), url('${imageUrl}')"></div>`
    : `<div class="plaza-cover no-cover"><span>${label}</span></div>`;

  if (!items.length) {
    grid.innerHTML = `<article class="plaza-item panel tall">${buildPlazaCover("")}<div class="plaza-info"><span class="meta-pill">${text.empty}</span><h2>${isMine ? text.emptyMineTitle : text.emptyPublicTitle}</h2><p>${isMine ? text.emptyMineDesc : text.emptyPublicDesc}</p><a class="text-link" href="./studio.html">${text.cta}</a></div></article>`;
    return;
  }

  grid.innerHTML = items.map((item) => {
    const imageUrl = item.coverImageUrl || item.posterImageUrl || "";
    return `<article class="plaza-item panel">${buildPlazaCover(imageUrl)}<div class="plaza-info"><span class="meta-pill">${chainConfig[item.chain]?.name || item.chain}</span><h2>${item.songTitle}</h2><p>${item.projectName}${isMine ? text.mineSuffix : text.publicSuffix}</p><a class="text-link" href="./result.html?id=${item.id}">${text.view}</a></div></article>`;
  }).join("");
}

async function initPlazaPage() {
  const mode = getQueryParam("mode");
  const currentPage = Math.max(1, Number.parseInt(getQueryParam("page"), 10) || 1);
  const walletAddress = getWalletAddress().trim();
  const isMine = mode === "mine";
  const toggle = document.getElementById("langToggle");

  applyPlazaLanguage(currentLang, isMine, walletAddress);
  document.querySelectorAll("[data-plaza-mode]").forEach((button) => {
    button.classList.toggle("active", button.dataset.plazaMode === (isMine ? "mine" : "public"));
    button.addEventListener("click", () => {
      window.location.href = button.dataset.plazaMode === "mine" ? "./plaza.html?mode=mine" : "./plaza.html";
    });
  });

  if (toggle) {
    toggle.addEventListener("click", () => {
      currentLang = currentLang === "zh" ? "en" : "zh";
      localStorage.setItem("robin-melody-lang", currentLang);
      applyPlazaLanguage(currentLang, isMine, walletAddress);
      initPlazaPage();
    }, { once: true });
  }

  if (isMine && !walletAddress) {
    renderPlazaItems([], { isMine: true });
    renderPlazaPagination(null, { isMine: true });
    return;
  }

  try {
    const endpoint = isMine ? `${API_BASE}/plaza?wallet=${encodeURIComponent(walletAddress)}&page=${currentPage}` : `${API_BASE}/plaza?page=${currentPage}`;
    const response = await fetch(endpoint);
    const payload = await response.json();
    renderPlazaItems(payload.items || [], { isMine });
    renderPlazaPagination(payload.pagination, { isMine });
  } catch (error) {
    renderPlazaItems([], { isMine });
    renderPlazaPagination(null, { isMine });
  }
}

function initCopyButtons() {
  document.querySelectorAll(".js-copy").forEach((button) => {
    button.addEventListener("click", async () => {
      const text = button.dataset.copy;
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        const original = button.textContent;
        button.textContent = commonI18n[currentLang]?.copied || "Copied";
        window.setTimeout(() => {
          button.textContent = original;
        }, 1200);
      } catch (error) {
        button.textContent = commonI18n[currentLang]?.copyFailed || "Copy Failed";
      }
    });
  });
}

function initScrollState() {
  window.addEventListener("scroll", () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 10);
  });
}

function initReveal() {
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("show"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function initSharedProjectState() {
  applyProjectToPage(getStoredProject());
}

window.addEventListener("DOMContentLoaded", () => {
  initScrollState();
  initReveal();
  initCopyButtons();
  initWalletEntryButtons();
  initSharedProjectState();
  initSelectionGroups();
  renderGlobalPlayer();

  if (page === "home") {
    initHomePage();
  }

  if (page === "project") {
    initProjectPage();
  }

  if (page === "studio") {
    initStudioPage();
  }

  if (page === "creating") {
    initCreatingPage();
  }

  if (page === "result") {
    renderResultPage();
  }

  if (page === "plaza") {
    initPlazaPage();
  }
});
