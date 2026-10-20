# Deployment

The frontend is a Docusaurus static site for Vercel. The API is a Docker web service for Render.

## Vercel frontend

Import this GitHub repository into Vercel with the repository root as the project root. `vercel.json` sets the build command and Docusaurus output directory. Add this environment variable in Vercel's Project Settings:

- `BACKEND_URL`: the public Render backend URL, such as `https://ai-robotics-book-rag.onrender.com` (no trailing slash)
- `SITE_URL`: the production Vercel URL, such as `https://your-project.vercel.app`

Redeploy after setting it. The frontend uses this URL for chat, login, signup, and personalization API calls.

## Render backend

Create a Render Blueprint from this repository. `render.yaml` configures the Docker web service and prompts for these environment variables:

- `NEON_DATABASE_URL`
- `GROQ_API_KEY`
- `GROQ_MODEL`
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `JWT_SECRET_KEY`
- `FRONTEND_URL`: the production Vercel URL, such as `https://your-project.vercel.app`

Enter secret values in Render, not in GitHub. If the Vercel domain changes, update `FRONTEND_URL` in Render and redeploy the backend. If the Render URL changes, update `BACKEND_URL` in Vercel and redeploy the frontend.

Render's free web service can sleep while idle, so the first request after inactivity may take longer.
