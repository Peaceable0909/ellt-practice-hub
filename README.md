# ELLTPulse — Oxford ELLT Practice Hub

A full-stack English practice platform for Oxford ELLT preparation. All 16 tests (Listening, Reading, Writing, Speaking) are displayed **inline** — no redirects to PDFs. Built with React + Vite, Supabase, and the Anthropic API.

---

## Features

- 🎧 **6 Listening tests** — embedded audio player + 8 questions each, marked instantly
- 📖 **5 Reading tests** — full passages displayed + 16 questions each (MCQ, T/F/NG, fill-in)
- ✍️ **5 Writing tasks** — prompts, model answers, and AI examiner feedback (band score + tips)
- 🎤 **7 Speaking topics** — Stage 2 presentation guides + AI scoring
- 📊 **Progress tracking** — band score history chart, radar chart, saved to Supabase
- ⏱ **Mock Tests** — timed sections with live countdown
- 🌙 **Dark / Light mode** — toggle in the nav bar
- 💾 **Supabase persistence** — results saved per session

---

## Tech Stack

| Layer     | Tool                          |
|-----------|-------------------------------|
| Frontend  | React 18 + Vite               |
| Styling   | CSS variables (no framework)  |
| Charts    | Recharts                      |
| Database  | Supabase (Postgres + RLS)     |
| AI        | Anthropic Claude (Sonnet 4)   |
| Deploy    | Vercel (recommended)          |

---

## Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/ellt-practice-hub.git
cd ellt-practice-hub
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.example .env
```

Fill in `.env` with your keys:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Used server-side only via /api/feedback
ANTHROPIC_API_KEY=sk-ant-your-key
```

### 4. Set up Supabase

Run this SQL in your Supabase project's SQL editor:

```sql
CREATE TABLE public.ellt_test_results (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id    text NOT NULL,
  skill         text NOT NULL CHECK (skill IN ('listening','reading','writing','speaking')),
  test_id       text NOT NULL,
  test_title    text NOT NULL,
  score         integer,
  total         integer,
  band_score    numeric(3,1),
  answers       jsonb,
  essay_text    text,
  completed_at  timestamptz DEFAULT now()
);

ALTER TABLE public.ellt_test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all anon access"
  ON public.ellt_test_results
  FOR ALL USING (true) WITH CHECK (true);
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

> **Note:** The AI feedback (`/api/feedback`) is a Vercel Edge Function. To test it locally, use the [Vercel CLI](https://vercel.com/docs/cli):
> ```bash
> npm i -g vercel
> vercel dev
> ```

---

## Deploy to Vercel

1. Push your repo to GitHub.
2. Go to [vercel.com](https://vercel.com) → **Import Project** → select your repo.
3. Add environment variables in the Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `ANTHROPIC_API_KEY` ← **server-side only, never exposed to browser**
4. Click **Deploy**.

---

## Project Structure

```
ellt-practice-hub/
├── api/
│   └── feedback.js          # Vercel Edge Function — Anthropic proxy
├── src/
│   ├── App.jsx              # Root component, routing
│   ├── main.jsx
│   ├── index.css            # Global styles + CSS variables (dark/light)
│   ├── lib/
│   │   ├── supabase.js      # Supabase client + helpers
│   │   └── ai.js            # AI feedback helpers
│   ├── data/
│   │   ├── listening.js     # 6 listening tests (questions + audio URLs)
│   │   ├── reading.js       # 5 reading tests (passages + questions)
│   │   ├── writing.js       # 5 writing tasks (prompts + model answers)
│   │   └── speaking.js      # 7 speaking topics (prompts + structure)
│   └── components/
│       ├── Nav.jsx
│       ├── Home.jsx
│       ├── MockTests.jsx
│       ├── Progress.jsx
│       ├── LiveSessions.jsx
│       ├── ui/
│       │   └── index.jsx    # Card, Btn, Chip, FeedbackBlock
│       └── Practice/
│           ├── index.jsx
│           ├── ListeningHub.jsx
│           ├── ReadingHub.jsx
│           ├── WritingHub.jsx
│           ├── SpeakingHub.jsx
│           └── TestTaker.jsx
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vercel.json
└── vite.config.js
```
