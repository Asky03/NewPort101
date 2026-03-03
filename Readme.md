# Ashutosh Shekhar - Portfolio

A premium dark glassmorphism portfolio built with Next.js, featuring smooth animations, micro-interactions, and strong SEO optimization.

## ✨ Features

- **Modern Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Smooth Animations**: Page transitions, scroll reveals, hover effects, and micro-interactions
- **Premium Preloader**: "Routing traffic" style progress animation (shows once per session)
- **Interactive Projects**: Filterable project grid with search, category filters, and detailed modals
- **Contact Form**: Client-side validation with mailto fallback and toast notifications
- **SEO Optimized**: 
  - Per-page metadata with OpenGraph and Twitter cards
  - JSON-LD structured data (Person, WebSite, CreativeWork schemas)
  - Sitemap and robots.txt
  - Semantic HTML with proper heading hierarchy
- **Accessibility**: 
  - Keyboard navigation support
  - Focus trap in modals
  - ARIA labels and roles
  - Reduced motion support
- **Performance**: 
  - Next.js font optimization
  - Lazy loading
  - Optimized animations
  - Lighthouse scores 90+

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd portfolio-nextjs
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

\`\`\`
portfolio-nextjs/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page with JSON-LD schemas
│   ├── globals.css         # Global styles with animated background
│   ├── sitemap.ts          # Dynamic sitemap generation
│   └── robots.ts           # Robots.txt configuration
├── components/
│   ├── Navbar.tsx          # Sticky navbar with scroll detection
│   ├── Footer.tsx          # Footer component
│   ├── Preloader.tsx       # Session-based preloader
│   ├── PageTransition.tsx  # Page transition wrapper
│   ├── sections/
│   │   ├── Hero.tsx        # Hero section
│   │   ├── Projects.tsx    # Projects grid with filters
│   │   └── Connect.tsx     # Contact section with form
│   └── ui/
│       ├── ProjectCard.tsx # Individual project card
│       ├── ProjectModal.tsx # Project detail modal
│       └── Toast.tsx       # Toast notification
├── data/
│   └── projects.ts         # Project data array
├── public/                 # Static assets (favicons, images)
├── next.config.mjs         # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
\`\`\`

## 🎨 Customization

### Update Projects

Edit \`data/projects.ts\` to add/modify projects:

\`\`\`typescript
export const projects: Project[] = [
  {
    id: 'unique-id',
    title: 'Project Name',
    description: 'Short description',
    category: 'Generative AI' | 'Cloud' | 'Blockchain' | 'Web',
    tags: ['tag1', 'tag2'],
    tech: ['Tech1', 'Tech2'],
    codeUrl: 'https://github.com/...',
    liveUrl: 'https://...',
    whatIBuilt: 'Detailed description',
    challenges: 'Technical challenges',
    learnings: 'Key learnings',
  },
];
\`\`\`

### Update Personal Info

- **Name/Links**: Update in \`app/layout.tsx\`, \`components/Navbar.tsx\`, \`components/sections/Connect.tsx\`
- **Email**: Update in \`components/sections/Connect.tsx\`
- **Site URL**: Update in \`next-sitemap.config.js\` and \`app/layout.tsx\`

### Styling

- **Colors**: Modify CSS variables in \`app/globals.css\` and \`tailwind.config.ts\`
- **Fonts**: Change font in \`app/layout.tsx\` (currently using Manrope from Google Fonts)

## 🔧 Scripts

\`\`\`bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
\`\`\`

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Configure environment variables (if needed)
4. Deploy!

The sitemap will be automatically generated during build.

### Other Platforms

Build the project and deploy the \`.next\` folder:

\`\`\`bash
npm run build
npm run start
\`\`\`

## 📊 Performance

Target Lighthouse scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

## 🔗 External Dependencies

- Font Awesome 6.5.0 (loaded via CDN in layout)
- Google Fonts (Manrope)

## 📝 License

All Rights Reserved © 2026 Ashutosh Shekhar

## 🤝 Contact

- Email: Ashushekhar2442@gmail.com
- GitHub: [@Asky03](https://github.com/Asky03)
- LinkedIn: [ashutoshs27](https://www.linkedin.com/in/ashutoshs27/)

---

Built with ❤️ using Next.js and Framer Motion
