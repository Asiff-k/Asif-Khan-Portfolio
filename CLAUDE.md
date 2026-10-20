@AGENTS.md

# Deploy rule (standing instruction from Asif, applies to every change)

After ANY change, without waiting to be asked:

1. Run `npm run build`. If it fails, fix it first. Never push a failing build.
2. Commit with a clear message.
3. Push to GitHub, to the branch that deploys https://asiffkhan.vercel.app. That is `main` (Vercel production). Work happens on `cinematic`; after committing there, fast-forward `main` to it and push both:
   `git push origin cinematic && git checkout main && git merge --ff-only cinematic && git push origin main && git checkout cinematic`
4. Wait for the Vercel deployment to finish (the "Vercel" commit status on GitHub turns to success), then load https://asiffkhan.vercel.app and confirm the change is live.
5. Tell Asif the commit hash and that the live site has updated.
