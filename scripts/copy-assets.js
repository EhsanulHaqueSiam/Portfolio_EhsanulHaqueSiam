/**
 * Asset Copy Script
 * 
 * Copies necessary assets to dist folder for deployment
 * - HTML files (with updated script/style references)
 * - Images (already optimized)
 * - Data files
 * - Other assets
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

// Files/folders to copy
const COPY_ITEMS = [
    'assets/images',
    'assets/data',
    'assets/videos',
    'index.html',
    'projects',
    'publications',
    'achievements',
    'experience',
    '404.html',
    'manifest.json',
    'sw.js',
    'robots.txt',
    'sitemap.xml'
];

// Copy directory recursively
const copyDir = (src, dest) => {
    if (!fs.existsSync(src)) return;

    fs.mkdirSync(dest, { recursive: true });
    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
};

// Update HTML file to use bundled assets
const processHTML = (htmlPath, destPath) => {
    let content = fs.readFileSync(htmlPath, 'utf8');

    // Replace multiple CSS imports with single bundled file
    // Find the main.css link and replace it, remove others
    const cssPattern = /<link[^>]*href=["'][^"']*\.css[^"']*["'][^>]*>/gi;
    const cssLinks = content.match(cssPattern) || [];

    if (cssLinks.length > 0) {
        // Keep only essential CDN CSS (Font Awesome, etc.)
        const essentialCSS = cssLinks.filter(link =>
            link.includes('font-awesome') ||
            link.includes('googleapis') ||
            link.includes('cdnjs') ||
            link.includes('cdn.jsdelivr') ||
            link.includes('unpkg')
        );

        // Remove all local CSS links
        cssLinks.forEach(link => {
            if (!link.includes('cdnjs') && !link.includes('cdn.') && !link.includes('unpkg') && !link.includes('googleapis')) {
                content = content.replace(link, '');
            }
        });

        // Add bundled CSS before </head>
        content = content.replace('</head>', `  <link rel="stylesheet" href="/dist/main.css">\n</head>`);
    }

    // Update main.js reference to use bundled version
    content = content.replace(
        /src=["']\.?\/assets\/js\/main\.js[^"']*["']/g,
        'src="/dist/main.js"'
    );

    // Write processed HTML
    const destDir = path.dirname(destPath);
    fs.mkdirSync(destDir, { recursive: true });
    fs.writeFileSync(destPath, content);
};

const copyAssets = () => {
    console.log('📋 Copying assets to dist...\n');

    // Ensure dist exists
    fs.mkdirSync(DIST_DIR, { recursive: true });

    let copied = 0;

    for (const item of COPY_ITEMS) {
        const srcPath = path.join(ROOT_DIR, item);
        const destPath = path.join(DIST_DIR, item);

        if (!fs.existsSync(srcPath)) {
            console.log(`   ⚠️  Not found: ${item}`);
            continue;
        }

        const stat = fs.statSync(srcPath);

        if (stat.isDirectory()) {
            copyDir(srcPath, destPath);
            console.log(`   ✓ Copied folder: ${item}/`);
        } else if (item.endsWith('.html')) {
            processHTML(srcPath, destPath);
            console.log(`   ✓ Processed: ${item}`);
        } else {
            fs.mkdirSync(path.dirname(destPath), { recursive: true });
            fs.copyFileSync(srcPath, destPath);
            console.log(`   ✓ Copied: ${item}`);
        }

        copied++;
    }

    console.log(`\n✅ Copied ${copied} items to dist/`);
};

copyAssets();
