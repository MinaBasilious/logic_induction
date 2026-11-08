import { informalSetIndN, type InformalEntry, type InformalLevel } from "./set-indN";
import { informalRelations } from "./relations";
import { informalWF } from "./wf";
import { informalOrder } from "./order";

export type { InformalEntry, InformalLevel };

/**
 * Map from fully-qualified Lean name to informal (pen-and-paper) content.
 * Built from the four module files; a declaration without an entry falls
 * back to generated placeholder text in lib/atlas.ts.
 */
export const informal: Record<string, InformalEntry> = {
  ...informalSetIndN,
  ...informalRelations,
  ...informalWF,
  ...informalOrder,
};
