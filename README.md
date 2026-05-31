# Dozy

Official marketing site for Dozy — Next.js on Vercel.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy (Vercel)

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com/new) (framework preset: **Next.js**).
3. Deploy — no extra config required.

Or from the CLI:

```bash
npx vercel
```

## Brand colors

| Name     | HSL                    |
| -------- | ---------------------- |
| Core     | `hsl(210, 80%, 60%)`   |
| Deep     | `hsl(235, 60%, 40%)`   |
| Bedtime  | `hsl(230, 85%, 73%)`   |

Used in `src/components/gradient-background.tsx` via `@paper-design/shaders-react` `GrainGradient`.
