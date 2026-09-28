# Content Guide

## Naming

- Module folders: `NN-short-name` (e.g. `03-pricing`)
- Lesson files: `lesson-NN.md`
- Images: save to `assets/images/<module>-<description>.png` and reference them in lessons as `![alt](../assets/images/file.png)` (paths resolve from the `player/` page).

## Writing lessons

Every lesson follows the template in `templates/lesson-template.md`:

1. Title + estimated time
2. What you'll learn (2–4 outcomes)
3. Lesson body
4. Key takeaways
5. Action step

## Registering a lesson

Each lesson must be listed in `course/course.json` under its module, with `id`, `title`, and `file` (path relative to `course/`). Order in the JSON is the order learners see.

## Video

Paste a YouTube/Vimeo embed `<iframe>` directly into the lesson markdown.
