/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Recent items shown - How many recently used items to pin at the top. */
  "recentCount": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `menu-command-bar` command */
  export type MenuCommandBar = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `menu-command-bar` command */
  export type MenuCommandBar = {}
}

