---
title: Dictionary
description: Teach VibeForma names, terms and replacements — how dictionary pairs work, and how learning from corrections stays on your machine.
---

The dictionary solves two different problems:

1. **Recognition** — a term the model does not know should be heard correctly.
2. **Replacement** — a word the model heard should be written differently.

VibeForma handles them in two stages: terms travel as `hotwords` into every 30-second recognition window, and replacements are applied after recognition.

![The Dictionary tab with term-to-replacement pairs and the concepts map.](../../assets/docs/app/settings-dictionary-en.png)

*Settings → Dictionary: recognition terms, replacements and the concepts map.*
## Terms and replacements

A dictionary entry is a pair: **term → replacement**.

| Term | Replacement | What happens |
|---|---|---|
| `vibe forma` | `VibeForma` | The term biases recognition; after recognition the text is rewritten to `VibeForma`. |
| `форма майнд` | `FormaMind` | The spoken Russian name becomes the product name. |
| `питон` | `Python` | A spoken word is normalized in the output. |
| `апи` | `API` | An abbreviation is written in Latin letters. |

The term is what VibeForma listens for; the replacement is what appears in the text.

## How terms reach recognition

- A term is passed through the engine's `hotwords` parameter on every 30-second window, so a word said near the end of a long take is still biased. The same path serves dictation, live partials and file transcription.
- The **replacement** form is the one used as a hotword, not the term as typed. A pair `vibe forma → VibeForma` teaches the model the spelling you want.
- Up to 223 tokens are selected by the frequency of corrections in `corrections.json`: the terms you correct most often go first, and a term that does not fit is skipped whole rather than cut mid-word. Your own `hotwords` entries are taken before the dictionary terms.

## Application profiles

A profile binds a dictionary and snippets to one application:

```json
"app_profiles": [
  {
    "name": "Editor",
    "process": "code",
    "window": "project",
    "dictionary": [{"from": "vibe form", "to": "VibeForma"}],
    "snippets": [{"trigger": "signature", "text": "Best regards"}]
  }
]
```

- The target is a process name without a path or `.exe`, a fragment of the window title, or both — with both, both must match.
- The profile is chosen by the window that will receive the text, not by whatever happens to be in front at the end of the phrase.
- Profile entries sit on top of the global ones, one rule per term or trigger, without duplicates.
- Up to 50 profiles. Edit them in **Settings → Dictionary**, in the profiles section.

## Replacement rules

| Rule | Detail |
|---|---|
| Case | Matching is case-insensitive. |
| Longest wins | When terms overlap, the longest term is replaced first. |
| One pass | Replacements run once, so a replacement cannot trigger another replacement. |
| Limit | Up to 500 pairs. |
| Import and export | JSON files. |
| Preview | Shows what a sample phrase becomes before you apply the change. |

The one-pass rule prevents loops: a pair that maps `API` to `интерфейс` and another that maps `интерфейс` back to `API` cannot bounce forever.

## Add, change, remove

1. Open **Settings → Dictionary**.
2. Add a term and its replacement.
3. Use the preview to check a sample phrase.
4. Save with `Ctrl+S`.

Entries can be edited and removed individually. Import and export move the whole dictionary as JSON, which makes a dictionary portable between machines.

## Learning from corrections

VibeForma can learn from the corrections you already make:

- A correction pair — "how it was heard → how it should be" — is collected from the panel draft, from history and from the dictionary dialog.
- When the same correction repeats — from two repetitions — the settings offer it as a hint.
- A pair enters the dictionary **only after you explicitly confirm it**.
- `corrections.json` stays on your computer. It stores only the words that changed, never the whole text.

Learning is a suggestion engine, not an automatic rewrite. Nothing is added to the dictionary silently.

## Where the dictionary is stored

The dictionary is stored with the application configuration. Export it as JSON before moving to another machine or before a clean reinstall.

The learning file `corrections.json` sits in the same folder and can be deleted at any time; the dictionary itself is not affected.

## Dictionary or snippets?

| Need | Use |
|---|---|
| Correct one word or name | Dictionary |
| Insert a whole prepared block by saying a trigger | [Snippets](/snippets/) |

A dictionary pair replaces a term inside the text. A snippet replaces a trigger with a multi-line block. They are separate pages and separate settings sections so each can grow independently.

## Limitations

- Replacements are literal text, not regular expressions.
- Matching is case-insensitive, so two entries that differ only by case cannot coexist meaningfully.
- The term must be something the model can hear; a dictionary cannot fix an inaudible phrase.
- 500 pairs is the limit; for large vocabularies, split the work between `hotwords`, profiles and snippets.
- Hotwords share a 223-token budget per window: very large dictionaries are capped there, even when the pair list itself has room.

## Where to go next

- [Snippets](/snippets/) — prepared text by a spoken trigger.
- [Models and languages](/models/) — how `hotwords` reach the prompt.
- [History](/history/) — the source of correction suggestions.
- [Settings reference](/settings-reference/) — the dictionary keys.
