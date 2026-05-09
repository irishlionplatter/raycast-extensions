# Raycast Extensions

Monorepo for [Raycast](https://www.raycast.com) extensions by [@IrishLionPlatter](https://github.com/IrishLionPlatter).

Each subdirectory is a standalone extension with its own `package.json` and dependencies. To work on one:

```bash
cd <extension-folder>/v01
npm install
npm run dev
```

To submit an extension to the Raycast Store:

```bash
cd <extension-folder>/v01
npm run publish
```

## Extensions

### [Menu Command Bar](./MENU%20COMMAND%20BAR/)
Search and invoke menu items in the frontmost app, with per-app memory of recently used items. Reliable in apps like Adobe InDesign where AppleScript-based menu pickers fail, because invocation goes through the macOS Accessibility API directly.

### [Smart Case](./SMART%20CASE/)
Case transformations that respect acronyms and user-defined exceptions.
