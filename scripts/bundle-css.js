/**
 * CSS Bundling Script
 * 
 * Bundles and minifies all CSS files into a single main.css
 * Preserves import order from main.css
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'assets', 'css');
const DIST_DIR = path.join(__dirname, '..', 'dist');
const MAIN_CSS = path.join(SRC_DIR, 'main.css');
const OUTPUT_CSS = path.join(DIST_DIR, 'main.css');

// Simple CSS minifier
const minifyCSS = (css) => {
    return css
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        // Remove newlines and extra spaces
        .replace(/\s+/g, ' ')
        // Remove space around special characters
        .replace(/\s*([{}:;,>+~])\s*/g, '$1')
        // Remove trailing semicolons before closing braces
        .replace(/;}/g, '}')
        // Remove leading/trailing whitespace
        .trim();
};

// Read and inline @import statements
const processImports = (cssContent, basePath) => {
    const importRegex = /@import\s+(?:url\()?['"]?([^'"\)]+)['"]?\)?;?/g;
    let result = cssContent;
    let match;

    const imports = [];
    while ((match = importRegex.exec(cssContent)) !== null) {
        let importPath = match[1];

        // Skip external URLs (fonts, CDNs, etc.)
        if (importPath.startsWith('http://') || importPath.startsWith('https://')) {
            console.log(`   ↳ Keeping external: ${importPath.substring(0, 50)}...`);
            continue;
        }

        // Strip query strings like ?v=4.0
        importPath = importPath.split('?')[0];

        const fullPath = path.resolve(basePath, importPath);

        if (fs.existsSync(fullPath)) {
            imports.push({
                statement: match[0],
                content: fs.readFileSync(fullPath, 'utf8'),
                path: fullPath
            });
        } else {
            console.warn(`  ⚠️  Import not found: ${importPath}`);
        }
    }

    // Replace imports with actual content
    for (const imp of imports) {
        // Recursively process nested imports
        const processedContent = processImports(imp.content, path.dirname(imp.path));
        result = result.replace(imp.statement, `/* ${path.basename(imp.path)} */\n${processedContent}\n`);
    }

    return result;
};

const bundleCSS = () => {
    console.log('📦 Bundling CSS...\n');

    // Create dist directory
    if (!fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR, { recursive: true });
    }

    // Read main.css
    if (!fs.existsSync(MAIN_CSS)) {
        console.error('❌ main.css not found');
        return;
    }

    const mainCSSContent = fs.readFileSync(MAIN_CSS, 'utf8');

    // Process imports
    console.log('   Processing imports...');
    const bundled = processImports(mainCSSContent, SRC_DIR);

    // Get original size
    const originalSize = Buffer.byteLength(bundled, 'utf8');

    // Minify
    console.log('   Minifying...');
    const minified = minifyCSS(bundled);
    const minifiedSize = Buffer.byteLength(minified, 'utf8');

    // Write output
    fs.writeFileSync(OUTPUT_CSS, minified);

    const savedKB = Math.round((originalSize - minifiedSize) / 1024);
    const savedPercent = Math.round((1 - minifiedSize / originalSize) * 100);

    console.log(`\n✅ CSS bundled successfully!`);
    console.log(`   Output: ${OUTPUT_CSS}`);
    console.log(`   Original: ${Math.round(originalSize / 1024)}KB`);
    console.log(`   Minified: ${Math.round(minifiedSize / 1024)}KB`);
    console.log(`   Saved: ${savedKB}KB (${savedPercent}%)`);
};

bundleCSS();
