import { createRequire } from "node:module";
import { ParrotDataSchema, RoundsDataSchema, TowerDefaultsSchema } from "./schemas.js";

const require = createRequire(import.meta.url);
const parrotData = require("../data/parrot.json");
const roundsData = require("../data/rounds.json");
const towerDefaults = require("../data/tower.defaults.json");

export function validateAllContent() {
  const parrot = ParrotDataSchema.parse(parrotData);
  const rounds = RoundsDataSchema.parse(roundsData);
  const tower = TowerDefaultsSchema.parse(towerDefaults);

  return { parrot, rounds, tower };
}

// Auto-run if executed directly
try {
  const result = validateAllContent();
  console.log(
    `[content-check] ✅ Validated: Parrot (${Object.keys(result.parrot.nodes).length} nodes), Rounds (${result.rounds.length} rounds), Tower (layers: ${result.tower.layers})`
  );
} catch (err) {
  console.error("[content-check] ❌ Content validation failed:", err);
  process.exit(1);
}
