// Smart Case v01

import {
  Action,
  ActionPanel,
  Clipboard,
  List,
  getPreferenceValues,
  getSelectedText,
  showHUD,
  useNavigation,
} from "@raycast/api";
import { useEffect, useState } from "react";
import { getTransformations } from "./transformations";
import { EditWordListsForm, getPreserveWords, getExtraSmallWords } from "./word-lists";
import type { Preferences, TransformConfig, Transformation } from "./types";

export default function Command() {
  const prefs = getPreferenceValues<Preferences>();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [preserveWords, setPreserveWords] = useState("");
  const [extraSmallWords, setExtraSmallWords] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [preserve, small] = await Promise.all([getPreserveWords(), getExtraSmallWords()]);
        setPreserveWords(preserve);
        setExtraSmallWords(small);

        if (prefs.inputSource === "selected") {
          // Use whatever was selected before Raycast opened — do NOT fall back to clipboard
          try {
            setInputText((await getSelectedText()) ?? "");
          } catch {
            // Nothing selected; leave inputText empty so the empty state shows
          }
        } else {
          setInputText((await Clipboard.readText()) ?? "");
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const config: TransformConfig = { ...prefs, preserveWords, extraSmallWords };
  const transformations = getTransformations(config);

  const pinned = transformations.filter((t) => t.mode === "pinned");
  const sections = ["Smart", "Code"] as const;

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Filter transformations...">
      {!inputText && !isLoading ? (
        <List.EmptyView
          title="No Text Found"
          description={
            prefs.inputSource === "selected"
              ? "Select text in any app before opening Smart Case"
              : "Copy some text to your clipboard first"
          }
        />
      ) : (
        <>
          {pinned.length > 0 && (
            <List.Section title="Pinned">
              {pinned.map((t) => (
                <TransformItem
                  key={t.id}
                  t={t}
                  inputText={inputText}
                  prefs={prefs}
                  preserveWords={preserveWords}
                  extraSmallWords={extraSmallWords}
                  onWordListSave={(p, s) => {
                    setPreserveWords(p);
                    setExtraSmallWords(s);
                  }}
                />
              ))}
            </List.Section>
          )}
          {sections.map((section) => {
            const items = transformations.filter((t) => t.section === section && t.mode === "shown");
            if (items.length === 0) return null;
            return (
              <List.Section key={section} title={section}>
                {items.map((t) => (
                  <TransformItem
                    key={t.id}
                    t={t}
                    inputText={inputText}
                    prefs={prefs}
                    preserveWords={preserveWords}
                    extraSmallWords={extraSmallWords}
                    onWordListSave={(p, s) => {
                      setPreserveWords(p);
                      setExtraSmallWords(s);
                    }}
                  />
                ))}
              </List.Section>
            );
          })}
        </>
      )}
    </List>
  );
}

function TransformItem({
  t,
  inputText,
  prefs,
  preserveWords,
  extraSmallWords,
  onWordListSave,
}: {
  t: Transformation;
  inputText: string;
  prefs: Preferences;
  preserveWords: string;
  extraSmallWords: string;
  onWordListSave: (preserve: string, small: string) => void;
}) {
  const { push } = useNavigation();
  const result = t.transform(inputText);

  async function paste() {
    await Clipboard.paste(result);
    await showHUD("Pasted");
  }

  async function copy() {
    await Clipboard.copy(result);
    await showHUD("Copied");
  }

  const primaryAction =
    prefs.defaultAction === "paste" ? (
      <Action title="Paste" onAction={paste} />
    ) : (
      <Action title="Copy" onAction={copy} />
    );

  const secondaryAction =
    prefs.defaultAction === "paste" ? (
      <Action title="Copy" onAction={copy} />
    ) : (
      <Action title="Paste" onAction={paste} />
    );

  return (
    <List.Item
      title={t.name}
      subtitle={result}
      actions={
        <ActionPanel>
          {primaryAction}
          {secondaryAction}
          <ActionPanel.Section>
            <Action
              title="Edit Word Lists"
              shortcut={{ modifiers: ["cmd"], key: "e" }}
              onAction={() =>
                push(
                  <EditWordListsForm
                    initialPreserve={preserveWords}
                    initialSmall={extraSmallWords}
                    onSave={onWordListSave}
                  />
                )
              }
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
}
