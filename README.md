# Ehsanul Haque - Portfolio Website

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://ehsanulhaquesiam.netlify.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, responsive portfolio website showcasing my skills, projects, and experience as a Full-Stack Developer.

🔗 **Live Demo:** [ehsanulhaquesiam.netlify.app](https://ehsanulhaquesiam.netlify.app/)

---

## ✨ Features

- **🌓 Dark/Light Theme** - Smooth theme switching with system preference detection
- **📱 Fully Responsive** - Optimized for all devices (mobile, tablet, desktop)
- **⚡ Performance Optimized** - Fast load times with lazy loading and caching
- **🎨 Modern UI/UX** - Glassmorphism, micro-interactions, and smooth animations
- **📊 SEO Optimized** - Open Graph, Twitter Cards, structured data, sitemap
- **♿ Accessible** - Semantic HTML, focus states, ARIA labels

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|-------------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Styling** | Custom CSS, CSS Variables, Flexbox, Grid |
| **Animations** | CSS Animations, Intersection Observer, particles.js |
| **Libraries** | ScrollReveal, Vanilla Tilt, Typed.js |
| **Hosting** | Netlify |

---

## 📁 Project Structure

```
Portfolio_EhsanulHaqueSiam/
├── index.html              # Main landing page
├── 404.html                # Custom 404 error page
├── sitemap.xml             # SEO sitemap
├── robots.txt              # Search engine directives
├── netlify.toml            # Netlify configuration
│
├── assets/
│   ├── css/
│   │   ├── main.css        # Main CSS entry point (imports all modules)
│   │   ├── base/           # Reset, variables, animations
│   │   ├── components/     # Reusable UI components
│   │   ├── sections/       # Page section styles
│   │   └── utilities/      # Dark theme, scrollbar, transitions
│   │
│   ├── js/
│   │   ├── app.js          # Particles initialization
│   │   ├── main.js         # Main entry point
│   │   └── modules/        # Modular JS components
│   │       ├── animations.js
│   │       ├── cursor.js
│   │       ├── navigation.js
│   │       ├── theme-toggle.js
│   │       ├── toast.js
│   │       └── renderers/  # Dynamic content renderers
│   │
│   ├── data/               # JSON data files
│   │   ├── skills.json
│   │   ├── projects.json
│   │   ├── achievements.json
│   │   ├── publications.json
│   │   └── experience.json
│   │
│   └── images/             # Image assets
│
├── experience/             # Experience sub-page
├── publications/           # Publications sub-page
├── projects/               # Projects sub-page
└── achievements/           # Achievements sub-page
```

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser
- (Optional) Live Server extension for VS Code

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/EhsanulHaqueSiam/Portfolio_EhsanulHaqueSiam.git
   cd Portfolio_EhsanulHaqueSiam
   ```

2. **Open with Live Server**
   - Using VS Code: Right-click `index.html` → "Open with Live Server"
   - Or use any local server: `npx serve .`

3. **View in browser**
   ```
   http://localhost:5500
   ```

---

## 📝 Customization

### Update Personal Info
1. Edit `index.html` for main content
2. Update JSON files in `assets/data/` for dynamic sections
3. Replace images in `assets/images/`

### Modify Styles
- Theme colors: `assets/css/base/variables.css`
- Section styles: `assets/css/sections/`
- Components: `assets/css/components/`

### Add New Sections
1. Create HTML structure in `index.html`
2. Add styles in `assets/css/sections/`
3. (Optional) Add JSON data in `assets/data/`

---

## 📦 Deployment

### Netlify (Recommended)

This project uses Netlify with **automatic image optimization**. When you push to GitHub:

1. **Git Push Workflow**
   ```bash
   git add -A
   git commit -m "your commit message"
   git push
   ```

2. **Netlify Auto-Build Process**
   
   On every push, Netlify automatically:
   - Runs `npm run build` which includes:
     - **`build:images`** - Converts all PNG/JPG images to optimized WebP format using Sharp
     - **`build:css`** - Bundles and minifies CSS
     - **`build:js`** - Bundles and minifies JavaScript
   - Applies Brotli/Gzip compression for all text assets
   - Serves images via Image CDN with caching

3. **Image Optimization Details**
   - All images in `assets/images/` are auto-converted to WebP
   - Large images (>500KB) get extra compression
   - Max width: 1200px (resized if larger)
   - WebP quality: 80% (normal) / 70% (large files)
   - Original files are kept as fallbacks

### Adding New Images

Simply add your images (PNG, JPG, JPEG) to `assets/images/` and push:
```bash
# Add new images to the appropriate folder
cp my-image.png assets/images/achievements/

# Push to trigger auto-conversion
git add -A && git commit -m "feat: add new image" && git push
```

The WebP version will be automatically generated during the Netlify build.

### Manual Build (Local)

To generate WebP images locally before pushing:
```bash
npm run build:images
```

### Manual Deployment
Simply upload all files to any static hosting service.

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `netlify.toml` | Netlify build settings, headers, redirects |
| `robots.txt` | Search engine crawler instructions |
| `sitemap.xml` | Page listing for SEO |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

### ⭐ Attribution

If you use this template for your portfolio:
1. **Keep the credit link** in the footer (appreciated but not required)
2. **Star this repository** ⭐ to show your support
3. **Add a backlink** to [ehsanulhaquesiam.netlify.app](https://ehsanulhaquesiam.netlify.app/) (helps others find the template!)

Your support helps me create more open-source projects! 🚀

---

## 📬 Contact

- **Email:** ehsanul.siamdev@gmail.com
- **LinkedIn:** [EhsanulHaqueSiam](https://linkedin.com/in/EhsanulHaqueSiam)
- **GitHub:** [EhsanulHaqueSiam](https://github.com/EhsanulHaqueSiam)
- **Twitter:** [@mdehaquesiam](https://twitter.com/mdehaquesiam)

---

<p align="center">
  Made with ❤️ by Ehsanul Haque
</p>
