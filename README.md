# LockOn Revision

AI-powered active-recall learning app built with React, Tailwind CSS, Firebase, and Gemini.

## Features

- Local-first mode when Firebase is not configured
- Gemini note generation and tutor responses when `VITE_GEMINI_API_KEY` is set
- Firebase Auth with email/password and Google sign-in
- User-scoped Firestore data for profile, subjects, units, lessons, questions, answers, and files
- Firebase Storage uploads for notes up to 20MB
- Gemini-powered note processing, tutor chat, hints, and wrong-answer explanations through Cloud Functions
- Revision queue for weak topics under 70% mastery
- Smart next-lesson selection from real lesson/question data
- Pro page placeholder with payments disabled for now

## Local Setup

1. Install frontend dependencies:

   ```bash
   npm install
   ```

2. Optional: fill `.env` with your Firebase web app config. If you leave it blank, the app runs locally in browser storage.

3. Optional: add `VITE_GEMINI_API_KEY` to enable Gemini in local mode. You can change `VITE_GEMINI_MODEL` if needed.

3. Install Cloud Functions dependencies:

   ```bash
   cd functions
   npm install
   ```

4. Set production secrets before deploying functions:

   ```bash
   firebase functions:secrets:set GEMINI_API_KEY
   ```

5. Run the app:

   ```bash
   npm run dev
   ```

## Deploy

```bash
npm run build
firebase deploy
```

## Firestore Shape

All learning data is scoped below `users/{uid}`:

- `subjects`
- `units`
- `lessons`
- `questions`
- `answers`
- `files`
The top-level user document stores energy, streak, daily usage, plan, focus, and goal state.
