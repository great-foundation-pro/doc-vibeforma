---
title: The site as the other half
description: Why a local tool has to explain itself, and how vibeforma.pro appeared — documentation, a blog and a development journal.
date: 2026-11-28T16:00:00
authors: forma
excerpt: "A local app has no cloud dashboard that explains everything. It has the app and the site. That is why the site is not marketing — it is the other half of the product."
cover:
  image: ../../../assets/blog/03-the-site-as-the-other-half.jpg
  alt: A dark desk seen from above, a glowing screen with a grid of documentation cards and a thin cyan line to a paper notebook.
tags:
  - site
  - documentation
---

A cloud service has a dashboard. You can see the plan, the history, the settings, the status, the documentation and a support button. A local app has no dashboard. It has a settings window, a tray, a log — and a site. If the site is silent, the product feels closed: it is unclear what it does with data, where files live, what happens on update, and where to look when something goes wrong.

On 21 November 2026 VibeForma got its own site — vibeforma.pro. Not a one-screen landing page with a “buy” button, but documentation: five sections, English and Russian, a blog and a development journal.

## What is on it

Five entrances to the product:

- **Introduction** — what VibeForma is and what comes with it.
- **Installation** — requirements, the quick install command and installer parameters.
- **Usage** — the hotkey, insertion, settings, dictionary and history.
- **Privacy** — local recognition, the network, what stays on disk.
- **Troubleshooting** — what to check when something does not work.

Every page exists in two languages, and the switcher in the header keeps the current section. This is not a translation for a checkbox: the Russian and English versions are written as independent texts with the same facts and different phrasing.

## The visual language

The site looks like the product: dark void, ice, pulse cyan and rare magenta sparks. Space Grotesk for headings, Inter for body text, IBM Plex Mono for code. One motion curve, lots of empty space, minimal decoration.

This is not random aesthetics. VibeForma works with voice — loose, wave-like, imprecise — and turns it into a sharp form. The site shows the same transition: a dark background, a thin luminous line, a sharp geometric mark. The landing images — a wave, a nebula, a planet — are not decoration but a metaphor: structure emerges from a diffuse signal.

## Documentation is part of the product

A local tool has no support team that can look at your session. No telemetry that shows where you got stuck. So the documentation must be precise, complete and honest. If the app keeps history only when the option is on, that is written. If system audio writes a WAV, that is written. If a model can be updated only by a click, that is written.

We try to write facts with addresses, not marketing promises: where the file lives, which key enables the option, what happens when you turn it off. It takes longer than inventing slogans, but a local product has no other way to earn trust.

## Blog and journal are not the same

The blog carries stories about the product: why a decision was made, how a feature works, what did not work. The journal carries notes about building the site itself: structure, checks, publication. They are different genres, and we do not mix them into one feed.

You are reading the blog. The journal lives in its own section and answers “how the site is made”, not “how the product is made”.

## Where the border is

The site is a separate build, and it can lag behind releases. We saw it while preparing this series: the site changelog ended at 0.5.5 while the product was already at 0.5.8. The reason is simple: the release process updated the product CHANGELOG and README, but not the site. This series and the chronicle closed that gap; the process fix stays.

The fix is process, not heroics: the [Chronicle](/chronicle/) page becomes the spine, and version sync becomes a release-checklist step. Ideally, a check compares the product version with the latest heading in the site changelog and fails if the site is older.

The site does not replace the product and does not promise for it. It explains where you are, what you can do and what is not possible yet. That is a modest role, but it is what makes a local tool open.

Next is [“Files: a second entrance”](/blog/2026-11-28-04-files-a-second-entrance/): how the microphone stopped being the only source of speech.
