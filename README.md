# Win Academy

A plug-in course: self-contained lessons plus a dependency-free web player that can be dropped into any website (folder upload or iframe).

## Structure

```
Win-Academy/
├── course/
│   ├── course.json          # Course title, modules, lesson order (single source of truth)
│   └── modules/
│       ├── 01-welcome/      # One folder per module
│       │   ├── lesson-01.md
│       │   └── lesson-02.md
│       └── 02-module-two/
│           └── lesson-01.md
├── player/
│   └── index.html           # Web player: reads course.json + renders lessons
├── templates/
│   └── lesson-template.md   # Copy this to start a new lesson
├── assets/images/           # Images referenced by lessons
└── docs/
    └── CONTENT-GUIDE.md     # How to write and add lessons
```

## Preview locally

The player loads files over HTTP, so run a local server from the repo root:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/player/

## Add a lesson

1. Copy `templates/lesson-template.md` into the right module folder.
2. Add its entry to `course/course.json`.
3. Refresh the player.

## Embed on a site

Upload the whole repo folder to the site (or host on GitHub Pages / Netlify), then embed:

```html
<iframe src="https://YOUR-HOST/Win-Academy/player/" width="100%" height="800" style="border:0"></iframe>
```

## Status

Starter scaffold. Lesson content is placeholder until the course topic and outline are finalized.
