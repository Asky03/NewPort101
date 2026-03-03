# Deployment Guide

## Prerequisites

Before deploying, ensure you have:
- Node.js 18+ installed
- Git repository set up
- All assets moved to the `public/` folder

## Local Testing

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Test production build locally:**
   ```bash
   npm run start
   ```

## Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - Next.js portfolio"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/login with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** ./
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

### Step 3: Environment Variables (Optional)

If you add environment variables later:
1. Go to Project Settings → Environment Variables
2. Add variables (e.g., `SITE_URL`, `EMAILJS_*`)
3. Redeploy

### Step 4: Deploy

Click "Deploy" and wait ~2 minutes.

Your site will be live at: `https://your-project.vercel.app`

### Step 5: Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `SITE_URL` in:
   - `next-sitemap.config.js`
   - `app/layout.tsx` (metadataBase)
   - `app/sitemap.ts`

## Deploy to Netlify

### Step 1: Build Settings

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"
```

### Step 2: Deploy

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Select your repository
5. Build settings (auto-detected from netlify.toml)
6. Click "Deploy site"

## Deploy to Other Platforms

### Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select repository
4. Railway auto-detects Next.js
5. Deploy!

### DigitalOcean App Platform

1. Go to [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)
2. Click "Create App"
3. Connect GitHub repository
4. Configure:
   - **Build Command:** `npm run build`
   - **Run Command:** `npm run start`
5. Deploy

### Self-Hosted (VPS/Docker)

#### Using PM2

```bash
# Build
npm run build

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "portfolio" -- start

# Save PM2 config
pm2 save
pm2 startup
```

#### Using Docker

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

Build and run:

```bash
docker build -t portfolio .
docker run -p 3000:3000 portfolio
```

## Post-Deployment Checklist

- [ ] Site loads correctly
- [ ] All navigation links work
- [ ] Project modals open/close properly
- [ ] Contact form validation works
- [ ] External links (GitHub, LinkedIn) work
- [ ] Preloader shows once per session
- [ ] Mobile menu works
- [ ] Check Lighthouse scores (aim for 90+)
- [ ] Test on mobile devices
- [ ] Verify sitemap: `https://your-site.com/sitemap.xml`
- [ ] Verify robots.txt: `https://your-site.com/robots.txt`
- [ ] Test social sharing (OpenGraph preview)

## SEO Setup

### Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property (your domain)
3. Verify ownership
4. Submit sitemap: `https://your-site.com/sitemap.xml`

### Bing Webmaster Tools

1. Go to [bing.com/webmasters](https://www.bing.com/webmasters)
2. Add site
3. Verify ownership
4. Submit sitemap

## Monitoring

### Vercel Analytics (Free)

1. Go to Project → Analytics
2. Enable Web Analytics
3. View real-time traffic and performance

### Google Analytics (Optional)

Add to `app/layout.tsx`:

```tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
<Script id="google-analytics" strategy="afterInteractive">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  `}
</Script>
```

## Troubleshooting

### Build Fails

- Check Node.js version (18+)
- Clear cache: `rm -rf .next node_modules && npm install`
- Check for TypeScript errors: `npm run lint`

### Fonts Not Loading

- Ensure Google Fonts are accessible
- Check network tab for CORS errors

### Images Not Showing

- Verify images are in `public/` folder
- Check file paths (case-sensitive on Linux)
- Use Next.js Image component for optimization

### Preloader Stuck

- Clear sessionStorage: `sessionStorage.clear()`
- Check browser console for errors

## Performance Optimization

### After Deployment

1. **Test with Lighthouse:**
   - Open DevTools → Lighthouse
   - Run audit
   - Aim for 90+ in all categories

2. **Optimize Images:**
   - Use WebP format
   - Compress images (TinyPNG, Squoosh)
   - Use Next.js Image component

3. **Enable Compression:**
   - Vercel/Netlify enable this by default
   - For self-hosted, enable gzip/brotli

4. **CDN:**
   - Vercel/Netlify use global CDN by default
   - For self-hosted, consider Cloudflare

## Support

If you encounter issues:
1. Check [Next.js documentation](https://nextjs.org/docs)
2. Check [Vercel documentation](https://vercel.com/docs)
3. Review error logs in deployment platform
4. Check browser console for client-side errors

---

Happy deploying! 🚀
