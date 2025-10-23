# Deploying Ephemera to Vercel

## Quick Deploy (Recommended)

1. **Push to GitHub** (already done!)
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your `ephemera` repository
   - Select the `ephemera-app` folder as the root directory
   - Click "Deploy"

That's it! Vercel will automatically:
- Detect it's a Next.js project
- Install dependencies
- Build the application
- Deploy it globally

## Deploy via Vercel CLI

If you prefer using the command line:

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to the app directory
cd ephemera-app

# Deploy
vercel

# For production deployment
vercel --prod
```

## Configuration

The project includes a `vercel.json` file with optimal settings:
- Framework: Next.js
- Region: US East (iad1) - can be changed
- Auto-detects build commands

## Environment Variables

Currently, Ephemera doesn't require any environment variables. Everything runs client-side for maximum simplicity and privacy.

## Post-Deployment

After deployment, you'll get a URL like:
- `https://ephemera-app.vercel.app` (or your custom domain)

Test all features:
- ✅ Fading Messages
- ✅ Decaying Canvas
- ✅ Temporary Rooms
- ✅ Memory Fragments

## Custom Domain (Optional)

1. In your Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

## Performance Notes

- First Load JS: ~128 kB (excellent for a React/Next.js app)
- All pages are statically generated
- Animations run at 60 FPS on modern devices
- No backend required - pure client-side magic

## Troubleshooting

If the build fails:
- Ensure Node.js version is 18.x or higher
- Check that all dependencies installed correctly
- Verify the root directory is set to `ephemera-app`

## Local Development

To run locally before deploying:

```bash
cd ephemera-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

**Ready to share ephemeral experiences with the world!** 🌟
