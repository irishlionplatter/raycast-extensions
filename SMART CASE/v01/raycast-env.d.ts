/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Input Source - Where to read text from when the extension opens. */
  "inputSource": "clipboard" | "selected",
  /** Primary Action - What the Enter key does. */
  "defaultAction": "paste" | "copy",
  /** Acronym Handling - Keeps NASA, FBI, API etc. as-is when they appear all-uppercase in the input. */
  "autoPreserveAcronyms": boolean,
  /** Title Case - Pinned = shown at top. Shown = in Smart section. Hidden = not shown. */
  "titleCaseMode": "pinned" | "shown" | "hidden",
  /** UPPER CASE - Pinned = shown at top. Shown = in Smart section. Hidden = not shown. */
  "upperCaseMode": "pinned" | "shown" | "hidden",
  /** lower case - Pinned = shown at top. Shown = in Smart section. Hidden = not shown. */
  "lowerCaseMode": "pinned" | "shown" | "hidden",
  /** Sentence case - Pinned = shown at top. Shown = in Smart section. Hidden = not shown. */
  "sentenceCaseMode": "pinned" | "shown" | "hidden",
  /** camelCase - Pinned = shown at top. Shown = in Code section. Hidden = not shown. */
  "camelCaseMode": "pinned" | "shown" | "hidden",
  /** PascalCase - Pinned = shown at top. Shown = in Code section. Hidden = not shown. */
  "pascalCaseMode": "pinned" | "shown" | "hidden",
  /** snake_case - Pinned = shown at top. Shown = in Code section. Hidden = not shown. */
  "snakeCaseMode": "pinned" | "shown" | "hidden",
  /** kebab-case - Pinned = shown at top. Shown = in Code section. Hidden = not shown. */
  "kebabCaseMode": "pinned" | "shown" | "hidden",
  /** CONSTANT_CASE - Pinned = shown at top. Shown = in Code section. Hidden = not shown. */
  "constantCaseMode": "pinned" | "shown" | "hidden"
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `smart-case` command */
  export type SmartCase = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `smart-case` command */
  export type SmartCase = {}
}

