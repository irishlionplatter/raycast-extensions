// Smart Case v01 — word list storage (LocalStorage-backed, Form UI)

import { Action, ActionPanel, Form, useNavigation } from "@raycast/api";
import { LocalStorage } from "@raycast/api";
import { useEffect, useState } from "react";

// ---------------------------------------------------------------------------
// Keys & defaults
// ---------------------------------------------------------------------------

const PRESERVE_KEY = "smartCase.preserveWords";
const SMALL_WORDS_KEY = "smartCase.extraSmallWords";

// One entry per line for legibility in the TextArea
export const DEFAULT_PRESERVE_WORDS = `iPhone
iPad
iPadOS
macOS
tvOS
watchOS
iOS
iCloud
iMessage
iMovie
AirPods
AirPlay
AirDrop
FaceTime
HomePod
iTunes
AppleTV
YouTube
GitHub
GitLab
Gmail
JavaScript
TypeScript
WordPress
LinkedIn
ChatGPT
OpenAI
PayPal
eBay
TikTok
Pinterest
Spotify
Netflix
Reddit
WhatsApp
Instagram
Facebook
Snapchat
DoorDash
Airbnb
Wi-Fi
eBook
ePub
LaTeX`;

// Words to keep lowercase in Title Case beyond the built-in list.
// The built-in set covers: a, an, the, and, as, at, but, by, en, for, if,
// in, nor, of, on, or, per, so, some, than, that, to, up, upon, v, versus,
// via, vs, when, with, without, yet
export const DEFAULT_EXTRA_SMALL_WORDS = `about
above
across
after
against
along
among
around
before
behind
below
beneath
beside
between
beyond
down
during
except
feat
from
inside
into
like
near
off
out
outside
over
past
since
through
throughout
till
toward
under
until
within`;

// ---------------------------------------------------------------------------
// Accessors (called from index.tsx on load)
// ---------------------------------------------------------------------------

export async function getPreserveWords(): Promise<string> {
  return (await LocalStorage.getItem<string>(PRESERVE_KEY)) ?? DEFAULT_PRESERVE_WORDS;
}

export async function getExtraSmallWords(): Promise<string> {
  return (await LocalStorage.getItem<string>(SMALL_WORDS_KEY)) ?? DEFAULT_EXTRA_SMALL_WORDS;
}

// ---------------------------------------------------------------------------
// Edit Word Lists Form (pushed via useNavigation from index.tsx)
// ---------------------------------------------------------------------------

interface EditWordListsFormProps {
  initialPreserve: string;
  initialSmall: string;
  onSave: (preserveWords: string, extraSmallWords: string) => void;
}

export function EditWordListsForm({ initialPreserve, initialSmall, onSave }: EditWordListsFormProps) {
  const { pop } = useNavigation();
  // Use a key to force re-render once initial values are available
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  async function handleSubmit(values: { preserveWords: string; extraSmallWords: string }) {
    await LocalStorage.setItem(PRESERVE_KEY, values.preserveWords);
    await LocalStorage.setItem(SMALL_WORDS_KEY, values.extraSmallWords);
    onSave(values.preserveWords, values.extraSmallWords);
    pop();
  }

  return (
    <Form
      key={loaded ? "loaded" : "loading"}
      isLoading={!loaded}
      navigationTitle="Edit Word Lists"
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Save" onSubmit={handleSubmit} />
          <Action title="Reset to Defaults" onAction={async () => {
            await LocalStorage.setItem(PRESERVE_KEY, DEFAULT_PRESERVE_WORDS);
            await LocalStorage.setItem(SMALL_WORDS_KEY, DEFAULT_EXTRA_SMALL_WORDS);
            onSave(DEFAULT_PRESERVE_WORDS, DEFAULT_EXTRA_SMALL_WORDS);
            pop();
          }} />
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="preserveWords"
        title="Preserve Words"
        info="Words to keep exactly as written in Title Case and Sentence Case. One per line or comma-separated. Examples: iPhone, macOS, YouTube"
        defaultValue={initialPreserve}
      />
      <Form.TextArea
        id="extraSmallWords"
        title="Extra Small Words"
        info="Additional words to keep lowercase in Title Case (beyond the built-in list of a, the, and, or, at, by…). One per line or comma-separated."
        defaultValue={initialSmall}
      />
    </Form>
  );
}
