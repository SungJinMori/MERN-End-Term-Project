# DraftBridge

**A calm workspace for writers and editors to shape better stories.**

DraftBridge is a responsive writing-workflow prototype for creating manuscripts, saving drafts, submitting stories for review, and recording editorial feedback.

## Features

- Create manuscripts with a title, genre, and opening text.
- Edit manuscript titles and content.
- Save work locally in the browser.
- Submit a manuscript into the review workflow.
- Add and save editorial notes.
- Mark a manuscript as approved from the editor view.
- Search manuscripts and filter by status.
- Switch between author and editor views.
- Responsive dashboard, manuscript library, and review desk.

## Technology

- React
- Vite
- JavaScript
- CSS
- Lucide React icons
- Browser `localStorage` for persistence

## Run locally

Requires Node.js (LTS recommended).

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

To verify a production build:

```bash
npm run build
npm run preview
```

## Deployment

This is a static Vite application and can be deployed to Vercel or Netlify.

### Vercel

1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Framework preset: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy and open the resulting public URL.

No environment variables are required for this prototype.

## Important scope note

This version stores manuscript data in the browser's `localStorage`. Data persists in the same browser on the same device, but it is **not a multi-user cloud database** and does not synchronise between different users or devices. The role switch is a demonstration workflow, not real authentication or access control. Do not store sensitive or confidential manuscripts in this prototype.

## Main workflow

1. Create a manuscript.
2. Edit the manuscript and save changes.
3. Submit it for review.
4. Switch to the editor view / review desk.
5. Open a manuscript, add feedback, and save the note.
6. Mark a reviewed manuscript as approved.

## Project purpose

Writers often need a simple, focused place to move a story from an early draft to useful editorial feedback. DraftBridge demonstrates that workflow in a compact interface designed around manuscript status, writing, and review.

## Limitations and future improvements

- Add real authentication and role-based authorisation.
- Add a backend API and database for shared multi-user collaboration.
- Add version history and inline comments.
- Add tests and automated deployment checks.
