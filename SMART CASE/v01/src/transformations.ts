// Smart Case v01 — transformation logic (no Raycast API imports, safe for unit testing)

import { camelCase, pascalCase, snakeCase, kebabCase, constantCase } from "change-case";
import type { TransformConfig, Transformation } from "./types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Parse a word list that may be comma-separated, newline-separated, or both
export function parseWordList(input: string): string[] {
  return input
    .split(/[,\n]/)
    .map((w) => w.trim())
    .filter(Boolean);
}

function buildPreserveMap(wordList: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const w of parseWordList(wordList)) {
    map.set(w.toLowerCase(), w);
  }
  return map;
}

// A word is an acronym if it has 2+ chars, contains at least one letter,
// and has NO lowercase letters. "NASA" ✓, "iOS" ✗, "a" ✗, "U.S." ✓
function isAcronym(word: string): boolean {
  return word.length >= 2 && /[A-Z]/.test(word) && !/[a-z]/.test(word);
}

// Apply a per-line function to each line of (potentially multi-line) text.
// Prevents code-case functions from treating newlines as word separators.
function perLine(fn: (s: string) => string): (text: string) => string {
  return (text: string) => text.split("\n").map(fn).join("\n");
}

// ---------------------------------------------------------------------------
// Standard small words for Title Case
// ---------------------------------------------------------------------------

const STANDARD_SMALL_WORDS = new Set([
  "a", "an", "and", "as", "at", "but", "by", "en", "for", "if", "in", "nor",
  "of", "on", "or", "per", "so", "some", "than", "that", "the", "to", "up",
  "upon", "v", "versus", "via", "vs", "when", "with", "without", "yet",
]);

// ---------------------------------------------------------------------------
// Title Case
// ---------------------------------------------------------------------------

function transformWord(
  word: string,
  isFirst: boolean,
  isLast: boolean,
  isAfterColon: boolean,
  preserveMap: Map<string, string>,
  smallWords: Set<string>,
  autoPreserveAcronyms: boolean
): string {
  // 1. User's preserve list — case-insensitive lookup, exact-case output
  const preserved = preserveMap.get(word.toLowerCase());
  if (preserved !== undefined) return preserved;

  // 2. Auto-preserve acronyms (only when input is already all-caps)
  if (autoPreserveAcronyms && isAcronym(word)) return word;

  // 3. Small word rule — lowercase unless at a positionally significant spot
  if (!isFirst && !isLast && !isAfterColon && smallWords.has(word.toLowerCase())) {
    return word.toLowerCase();
  }

  // 4. Standard capitalization
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function titleCaseLine(
  line: string,
  preserveMap: Map<string, string>,
  smallWords: Set<string>,
  autoPreserveAcronyms: boolean
): string {
  if (!line.trim()) return line;

  // Split into alternating word-tokens and whitespace-tokens, preserving both
  const parts = line.match(/\S+|\s+/g) ?? [];
  const wordIdxs = parts
    .map((p, i) => (/^\s+$/.test(p) ? null : i))
    .filter((i): i is number => i !== null);

  if (wordIdxs.length === 0) return line;

  const firstIdx = wordIdxs[0];
  const lastIdx = wordIdxs[wordIdxs.length - 1];
  let afterColon = false;

  return parts
    .map((part, i) => {
      if (/^\s+$/.test(part)) return part;

      const isFirst = i === firstIdx;
      const isLast = i === lastIdx;

      // Hyphenated compound words — process each segment independently
      if (part.includes("-")) {
        const segs = part.split(/(-)/);
        const result = segs
          .map((seg, si) => {
            if (seg === "-") return "-";
            const segIsFirst = isFirst && si === 0;
            const segIsLast = isLast && si === segs.length - 1;
            return transformWord(
              seg,
              segIsFirst || si > 0,
              segIsLast,
              afterColon && si === 0,
              preserveMap,
              smallWords,
              autoPreserveAcronyms
            );
          })
          .join("");
        afterColon = false;
        return result;
      }

      // Strip trailing punctuation, transform the word, reattach punctuation
      const m = part.match(/^([\w'']+)([^\w'']*)$/);
      if (m) {
        const [, wordPart, punct] = m;
        const transformed =
          transformWord(wordPart, isFirst, isLast, afterColon, preserveMap, smallWords, autoPreserveAcronyms) +
          punct;
        afterColon = /[:!?.]\s*$/.test(punct);
        return transformed;
      }

      afterColon = /[:!?.]$/.test(part);
      return part;
    })
    .join("");
}

export function smartTitleCase(text: string, config: TransformConfig): string {
  const preserveMap = buildPreserveMap(config.preserveWords);
  const smallWords = new Set(STANDARD_SMALL_WORDS);
  for (const w of parseWordList(config.extraSmallWords)) {
    smallWords.add(w.toLowerCase());
  }
  return text
    .split("\n")
    .map((line) => titleCaseLine(line, preserveMap, smallWords, config.autoPreserveAcronyms))
    .join("\n");
}

// ---------------------------------------------------------------------------
// Sentence Case
// ---------------------------------------------------------------------------

export function sentenceCase(text: string, config: TransformConfig): string {
  const preserveMap = buildPreserveMap(config.preserveWords);
  return text
    .split("\n")
    .map((line) => {
      if (!line.trim()) return line;
      let result = line
        .toLowerCase()
        .replace(/^([^a-z]*)([a-z])/, (_, pre, ch) => pre + ch.toUpperCase());
      for (const [lower, canonical] of preserveMap) {
        const escaped = lower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const re = new RegExp(`(?<![a-z])${escaped}(?![a-z])`, "gi");
        result = result.replace(re, canonical);
      }
      return result;
    })
    .join("\n");
}

// ---------------------------------------------------------------------------
// Simple transforms
// ---------------------------------------------------------------------------

export const upperCase = perLine((t) => t.toUpperCase());
export const lowerCase = perLine((t) => t.toLowerCase());

// Code transforms — delegated to change-case, applied per-line
export const toCamelCase = perLine(camelCase);
export const toPascalCase = perLine(pascalCase);
export const toSnakeCase = perLine(snakeCase);
export const toKebabCase = perLine(kebabCase);
export const toConstantCase = perLine(constantCase);

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export function getTransformations(config: TransformConfig): Transformation[] {
  return [
    {
      id: "title", name: "Title Case", section: "Smart", mode: config.titleCaseMode,
      transform: (t) => smartTitleCase(t, config),
    },
    {
      id: "upper", name: "UPPER CASE", section: "Smart", mode: config.upperCaseMode,
      transform: upperCase,
    },
    {
      id: "lower", name: "lower case", section: "Smart", mode: config.lowerCaseMode,
      transform: lowerCase,
    },
    {
      id: "sentence", name: "Sentence case", section: "Smart", mode: config.sentenceCaseMode,
      transform: (t) => sentenceCase(t, config),
    },
    {
      id: "camel", name: "camelCase", section: "Code", mode: config.camelCaseMode,
      transform: toCamelCase,
    },
    {
      id: "pascal", name: "PascalCase", section: "Code", mode: config.pascalCaseMode,
      transform: toPascalCase,
    },
    {
      id: "snake", name: "snake_case", section: "Code", mode: config.snakeCaseMode,
      transform: toSnakeCase,
    },
    {
      id: "kebab", name: "kebab-case", section: "Code", mode: config.kebabCaseMode,
      transform: toKebabCase,
    },
    {
      id: "constant", name: "CONSTANT_CASE", section: "Code", mode: config.constantCaseMode,
      transform: toConstantCase,
    },
  ];
}
