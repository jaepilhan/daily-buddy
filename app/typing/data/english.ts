export type AgeTier = "little" | "explorer" | "pro";

export interface WordPool {
  id: string;
  label: string;
  sublabel: string;
  little: string[];
  explorer: string[];
  pro: string[];
}

// ── Level 1: Key row drills ────────────────────────────────────────────────
// "words" are artificial combos of the target keys

export const ENGLISH_LEVELS: WordPool[] = [
  {
    id: "en-1-1", label: "1-1 Home Row", sublabel: "asdf jkl;",
    little:   ["aaa", "sss", "ddd", "fff", "jjj", "kkk", "lll", "asd", "fgh", "jkl", "adf", "jlk", "sad", "dad", "lad", "ask", "fad", "ala", "jak", "ska", "dal", "flask", "glad", "fall", "hall"],
    explorer: ["flask", "slash", "glass", "falls", "shall", "flags", "flash", "clash", "salad", "flask", "alfalfa", "gladly", "hallway", "daffodil", "rainfall", "gaslamp", "flatlands", "halfway", "sandal", "gallon"],
    pro:      ["flashlight", "grandfather", "skateboard", "blacksmith", "flaskful", "gladiator", "galvanize", "slapdash", "halfhearted", "sandcastle", "alkaline", "flagstone", "landlady", "dashboard"],
  },
  {
    id: "en-1-2", label: "1-2 Top Row", sublabel: "qwerty uiop",
    little:   ["qwe", "rty", "uio", "top", "pry", "yet", "row", "tip", "woe", "rip", "pot", "wet", "toy", "put", "pit", "wit", "rot", "rue", "owe", "tie", "rue", "ore"],
    explorer: ["quiet", "quite", "tower", "power", "outer", "quote", "route", "utter", "write", "equip", "erupt", "petty", "query", "typo", "privy", "quirky", "poetry", "utterly", "require", "twitter"],
    pro:      ["quitter", "territory", "proportion", "attribute", "prototype", "rupture", "quarterly", "equipment", "proprietor", "petitioner", "typewrit", "opaque", "turquoise", "perpetuity"],
  },
  {
    id: "en-1-3", label: "1-3 Bottom Row", sublabel: "zxcv bnm",
    little:   ["zzz", "xxx", "ccc", "vvv", "bbb", "nnn", "mmm", "van", "cab", "bin", "men", "ban", "can", "vim", "zap", "nab", "buzz", "cave", "move", "vibe"],
    explorer: ["cabin", "bench", "venom", "clamp", "maven", "cubic", "venue", "numb", "bloom", "blank", "blaze", "crumb", "bevel", "convex", "zipper", "balance", "combine", "vitamin", "maximum"],
    pro:      ["combination", "mechanism", "vibration", "abbreviation", "vocabulary", "environment", "examination", "conventional", "combustion", "civilization", "benchmark", "culminate"],
  },
  {
    id: "en-1-4", label: "1-4 All Keys", sublabel: "Full keyboard",
    little:   ["the", "cat", "sat", "mat", "dog", "run", "fun", "big", "red", "hat", "sun", "cup", "mud", "box", "job", "fix", "zip", "map", "leg", "arm"],
    explorer: ["brown", "quick", "jumps", "loves", "brain", "plays", "child", "world", "light", "dream", "front", "brave", "large", "black", "green", "young", "bring", "drive", "thick", "plant"],
    pro:      ["knowledge", "adventure", "beautiful", "discovery", "excellent", "framework", "influence", "important", "nightmare", "objective", "paragraph", "quantity", "recognize", "structure"],
  },
  {
    id: "en-2", label: "2 Common Words", sublabel: "Everyday words",
    little:   ["ant", "bee", "bug", "cat", "dog", "egg", "fig", "fog", "gem", "ham", "ink", "jam", "keg", "lip", "mud", "net", "oak", "pea", "rag", "sap", "tan", "urn", "van", "wax", "yam", "yak", "bat", "cap", "dew", "elf", "fan", "gap", "hay", "ivy", "jot", "kit", "log", "map", "nap", "orb", "pin", "rut", "ski", "tag", "wig"],
    explorer: ["brave", "cliff", "depth", "ember", "flock", "grasp", "hatch", "inlet", "joust", "knack", "ledge", "marsh", "notch", "orbit", "pinch", "quilt", "ridge", "scout", "torch", "ulcer", "vault", "whisk", "xerox", "yield", "zilch", "bloom", "creak", "dwarf", "expel", "frost", "groan", "humid", "icy", "jingle", "kneel", "latch", "mural", "nudge"],
    pro:      ["abstract", "abundant", "acoustic", "adjacent", "artifact", "balanced", "catalyst", "coherent", "dedicate", "dispatch", "evaluate", "feasible", "generate", "grateful", "harmless", "ignorant", "junction", "kinetics", "leverage", "manifest", "navigate", "obsolete", "paradigm", "relevant", "simulate", "tangible", "ultimate", "validate", "withdraw"],
  },
  {
    id: "en-3", label: "3 Action Words", sublabel: "Verbs in action",
    little:   ["run", "hop", "skip", "jump", "roll", "spin", "swim", "ride", "kick", "pull", "push", "clap", "wave", "sing", "read", "draw", "cook", "bake", "play", "rest", "nap", "hug", "wink", "grin", "yell", "walk", "talk", "look", "find", "give", "take", "make", "hold", "open", "shut", "fill", "pour", "drop", "lift", "fold"],
    explorer: ["explore", "create", "discover", "imagine", "achieve", "connect", "capture", "deliver", "develop", "educate", "forgive", "generate", "improve", "inspire", "involve", "measure", "observe", "perform", "produce", "publish", "receive", "replace", "require", "resolve", "respond", "scatter", "support", "survive", "transfer", "upgrade"],
    pro:      ["accomplish", "administer", "anticipate", "collaborate", "communicate", "demonstrate", "differentiate", "eliminate", "facilitate", "hypothesize", "incorporate", "investigate", "manipulate", "orchestrate", "participate", "prioritize", "recognize", "reconstruct", "summarize", "transform"],
  },
  {
    id: "en-4", label: "4 Science Words", sublabel: "STEM vocabulary",
    little:   ["sun", "moon", "star", "rock", "soil", "leaf", "root", "stem", "seed", "fish", "bird", "frog", "worm", "moth", "wave", "heat", "rain", "snow", "wind", "fog", "germ", "cell", "bone", "skin", "lung"],
    explorer: ["planet", "comet", "galaxy", "energy", "magnet", "photon", "enzyme", "fossil", "genome", "habitat", "ignite", "jungle", "larvae", "molten", "nebula", "oxygen", "protein", "quartz", "rocket", "species", "tissue", "ultraviolet", "volcano", "wetland", "xylem"],
    pro:      ["atmosphere", "biosphere", "chromosome", "decompose", "electrode", "evolution", "frequency", "gravitation", "hypothesis", "isotope", "kinetics", "luminosity", "microscope", "nanometer", "osmosis", "photosynthesis", "quarantine", "radiation", "satellite", "thermometer", "ultraviolet", "wavelength"],
  },
  {
    id: "en-5", label: "5 World Words", sublabel: "Global vocabulary",
    little:   ["map", "sea", "land", "city", "town", "farm", "road", "park", "lake", "hill", "cave", "reef", "gulf", "cape", "mesa", "isle", "ford", "glen", "vale", "moor"],
    explorer: ["canyon", "desert", "forest", "glacier", "harbor", "island", "jungle", "kingdom", "lagoon", "meadow", "nation", "ocean", "plateau", "region", "savanna", "tundra", "valley", "wetland"],
    pro:      ["archipelago", "biodiversity", "civilization", "deforestation", "earthquake", "expedition", "geographical", "hemisphere", "indigenous", "jurisdiction", "latitude", "longitude", "migration", "nationalism", "observatory", "precipitation", "sovereignty", "topography", "urbanization"],
  },
];

export function generateText(pool: WordPool, tier: AgeTier, count = 25): string {
  const words = pool[tier].length > 0 ? pool[tier] : pool.explorer;
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length)).join(" ");
}

export function getLevelById(id: string): WordPool | undefined {
  return ENGLISH_LEVELS.find((l) => l.id === id);
}

// All words across levels for the word rain game
export function getGameWords(tier: AgeTier): string[] {
  const all: string[] = [];
  for (const level of ENGLISH_LEVELS) {
    const words = level[tier].length > 0 ? level[tier] : level.explorer;
    all.push(...words);
  }
  return Array.from(new Set(all));
}
