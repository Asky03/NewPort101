# Architecture Overview

## Component Hierarchy

```
app/layout.tsx (Root Layout)
├── <head>
│   └── Font Awesome CDN
├── Preloader (shows once per session)
├── Navbar (sticky, scroll detection)
├── PageTransition (wraps all pages)
│   └── app/page.tsx (Home Page)
│       ├── Hero Section
│       │   ├── Name tag
│       │   ├── Heading
│       │   ├── Description
│       │   ├── CTA buttons
│       │   └── Feature card
│       ├── Projects Section
│       │   ├── Search input
│       │   ├── Filter chips
│       │   ├── Project grid
│       │   │   └── ProjectCard (multiple)
│       │   │       ├── Category badge
│       │   │       ├── Title
│       │   │       ├── Description
│       │   │       ├── Tech chips
│       │   │       └── Action buttons
│       │   └── ProjectModal (conditional)
│       │       ├── Close button
│       │       ├── Project details
│       │       ├── Tags
│       │       ├── Tech stack
│       │       ├── Optional sections
│       │       └── Action buttons
│       └── Connect Section
│           ├── Description
│           ├── Availability indicator
│           ├── Quick contact buttons
│           ├── Contact form
│           │   ├── Name input
│           │   ├── Email input
│           │   ├── Message textarea
│           │   └── Submit button
│           └── Toast (conditional)
└── Footer
```

## Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    data/projects.ts                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │ export const projects: Project[] = [...]           │ │
│  │ export const categories = [...]                    │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────┐
│            components/sections/Projects.tsx              │
│  ┌────────────────────────────────────────────────────┐ │
│  │ const [selectedCategory, setSelectedCategory]      │ │
│  │ const [searchQuery, setSearchQuery]                │ │
│  │ const [selectedProject, setSelectedProject]        │ │
│  │                                                     │ │
│  │ const filteredProjects = useMemo(() => {           │ │
│  │   return projects.filter(...)                      │ │
│  │ }, [selectedCategory, searchQuery])                │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          ↓
         ┌────────────────┴────────────────┐
         ↓                                  ↓
┌──────────────────────┐         ┌──────────────────────┐
│   ProjectCard        │         │   ProjectModal       │
│  ┌────────────────┐  │         │  ┌────────────────┐  │
│  │ project prop   │  │         │  │ project prop   │  │
│  │ onClick prop   │  │         │  │ onClose prop   │  │
│  └────────────────┘  │         │  └────────────────┘  │
└──────────────────────┘         └──────────────────────┘
```

## State Management

### Local Component State

```typescript
// Navbar.tsx
const [isScrolled, setIsScrolled] = useState(false)
const [activeSection, setActiveSection] = useState('#home')
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

// Preloader.tsx
const [isVisible, setIsVisible] = useState(true)
const [progress, setProgress] = useState(0)

// Projects.tsx
const [selectedCategory, setSelectedCategory] = useState('All')
const [searchQuery, setSearchQuery] = useState('')
const [selectedProject, setSelectedProject] = useState<Project | null>(null)

// Connect.tsx
const [formData, setFormData] = useState({ name: '', email: '', message: '' })
const [errors, setErrors] = useState<Record<string, string>>({})
const [toast, setToast] = useState({ message: '', type: 'success', isVisible: false })
```

### Session Storage

```typescript
// Preloader.tsx
sessionStorage.getItem('seenPreloader')
sessionStorage.setItem('seenPreloader', '1')
```

## Animation Flow

```
Page Load
    ↓
Preloader (if first visit)
    ↓ (2-3 seconds)
Preloader fades out
    ↓
PageTransition (fade + slide in)
    ↓
Sections animate in (staggered)
    ↓
User scrolls
    ↓
Navbar detects scroll
    ↓
Active section updates
    ↓
Scroll reveal animations trigger
    ↓
User hovers card
    ↓
Card lifts + glows
    ↓
User clicks card
    ↓
Modal animates in
    ↓
Focus trapped in modal
    ↓
User presses ESC or clicks close
    ↓
Modal animates out
```

## Event Handlers

### Scroll Events

```typescript
// Navbar.tsx
window.addEventListener('scroll', () => {
  // Update isScrolled
  // Update activeSection (Intersection Observer)
})

// sections/*.tsx
IntersectionObserver → trigger animations when in viewport
```

### Click Events

```typescript
// ProjectCard.tsx
onClick={() => setSelectedProject(project)}

// ProjectModal.tsx
onClick={onClose} // backdrop
onClick={onClose} // close button

// Connect.tsx
onSubmit={handleSubmit} // form
```

### Keyboard Events

```typescript
// ProjectModal.tsx
onKeyDown={(e) => {
  if (e.key === 'Escape') onClose()
  if (e.key === 'Tab') handleFocusTrap()
}}

// ProjectCard.tsx
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') onClick()
}}
```

## Routing

```
/ (Home)
├── #home (Hero section)
├── #projects (Projects section)
└── #connect (Connect section)

/sitemap.xml (Dynamic sitemap)
/robots.txt (Dynamic robots.txt)
```

## SEO Structure

```
app/layout.tsx
├── Global metadata
│   ├── title template
│   ├── description
│   ├── keywords
│   ├── authors
│   ├── openGraph
│   └── twitter
└── Font Awesome

app/page.tsx
├── Page-specific metadata
├── JSON-LD Person schema
├── JSON-LD WebSite schema
└── Page content

app/sitemap.ts
└── Dynamic sitemap generation

app/robots.ts
└── Dynamic robots.txt
```

## Performance Optimization

```
Next.js Optimizations
├── Automatic code splitting
├── Route-based lazy loading
├── Font optimization (next/font)
├── Image optimization (next/image ready)
└── Static generation where possible

Framer Motion Optimizations
├── GPU-accelerated transforms
├── Will-change hints
├── Reduced motion support
└── Lazy animation loading

Custom Optimizations
├── useMemo for filtered projects
├── Intersection Observer for scroll reveals
├── Session storage for preloader
└── Debounced search (implicit via React)
```

## Build Process

```
npm run build
    ↓
TypeScript compilation
    ↓
Next.js optimization
    ↓
Tailwind CSS purging
    ↓
Code splitting
    ↓
Static generation
    ↓
.next/ output
    ↓
npm run start (production server)
```

## Deployment Flow

```
Local Development
    ↓
git push origin main
    ↓
GitHub Repository
    ↓
Vercel (auto-deploy)
    ↓
Build process
    ↓
Deploy to CDN
    ↓
Live at production URL
    ↓
Sitemap generated
    ↓
Submit to search engines
```

## Component Communication

```
Parent → Child (Props)
Projects.tsx → ProjectCard.tsx
    project={project}
    onClick={handleClick}

Projects.tsx → ProjectModal.tsx
    project={selectedProject}
    onClose={handleClose}

Child → Parent (Callbacks)
ProjectCard.tsx → Projects.tsx
    onClick() → setSelectedProject(project)

ProjectModal.tsx → Projects.tsx
    onClose() → setSelectedProject(null)

Connect.tsx → Toast.tsx
    isVisible={toast.isVisible}
    onClose={() => setToast({ ...toast, isVisible: false })}
```

## Styling Architecture

```
Global Styles (app/globals.css)
├── CSS variables
├── Base styles
├── Animated background
├── Scrollbar styles
└── Accessibility styles

Tailwind Utilities (inline)
├── Layout (flex, grid)
├── Spacing (p-, m-)
├── Colors (bg-, text-)
└── Responsive (md:, lg:)

Framer Motion (inline)
├── Animations
├── Transitions
└── Gestures
```

## Type System

```typescript
// data/projects.ts
interface Project {
  id: string
  title: string
  description: string
  category: 'Generative AI' | 'Cloud' | 'Blockchain' | 'Web'
  tags: string[]
  tech: string[]
  codeUrl: string
  liveUrl?: string
  whatIBuilt?: string
  challenges?: string
  learnings?: string
}

// Ensures type safety across all components
```

## Accessibility Flow

```
Keyboard Navigation
    ↓
Tab through interactive elements
    ↓
Focus visible on all elements
    ↓
Enter/Space activates buttons
    ↓
Modal opens
    ↓
Focus trapped in modal
    ↓
ESC closes modal
    ↓
Focus returns to trigger element
```

## Error Handling

```
Form Validation (Connect.tsx)
├── Client-side validation
├── Error state management
├── Error message display
└── Toast notification

Build Errors
├── TypeScript type checking
├── ESLint linting
└── Next.js build validation

Runtime Errors
├── React error boundaries (Next.js default)
└── Console error logging
```

## Browser Support

```
Modern Browsers (ES2020+)
├── Chrome 90+
├── Firefox 88+
├── Safari 14+
├── Edge 90+
└── Mobile browsers

Polyfills
└── None required (Next.js handles)

Fallbacks
├── Reduced motion (CSS)
├── No JS (noscript tags)
└── Old browsers (graceful degradation)
```

## Security Considerations

```
External Links
└── rel="noopener noreferrer"

Form Handling
├── Client-side validation
└── Mailto fallback (no server)

Dependencies
├── Regular updates
└── No known vulnerabilities

Content Security
├── No inline scripts (except JSON-LD)
└── HTTPS enforced (deployment)
```

## Monitoring & Analytics

```
Built-in (Vercel)
├── Web Analytics
├── Speed Insights
└── Error tracking

Optional (Add if needed)
├── Google Analytics
├── Google Search Console
└── Sentry (error tracking)
```

---

This architecture is designed for:
- ✅ Scalability
- ✅ Maintainability
- ✅ Performance
- ✅ Accessibility
- ✅ SEO
- ✅ Developer experience
