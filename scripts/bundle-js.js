/**
 * JavaScript Bundling Script
 * 
 * Uses esbuild to bundle and minify JavaScript
 * Handles ES modules, absolute paths, and tree-shaking
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'assets', 'js');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const MAIN_JS = path.join(SRC_DIR, 'main.js');
const OUTPUT_JS = path.join(DIST_DIR, 'main.js');

// Plugin to resolve absolute paths like /assets/js/modules/...
const absolutePathPlugin = {
    name: 'absolute-path-resolver',
    setup(build) {
        // Resolve paths starting with /assets/
        build.onResolve({ filter: /^\/assets\// }, args => {
            // Remove query strings like ?v=2.0
            const cleanPath = args.path.split('?')[0];
            // Resolve to actual file path
            return { path: path.join(ROOT_DIR, cleanPath) };
        });
    }
};

const bundleJS = async () => {
    console.log('📦 Bundling JavaScript...\n');

    // Create dist directory
    if (!fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR, { recursive: true });
    }

    try {
        const esbuild = require('esbuild');

        // Get original size of all JS files
        const getAllJSFiles = (dir) => {
            let size = 0;
            const files = fs.readdirSync(dir);
            for (const file of files) {
                const fullPath = path.join(dir, file);
                const stat = fs.statSync(fullPath);
                if (stat.isDirectory()) {
                    size += getAllJSFiles(fullPath);
                } else if (file.endsWith('.js')) {
                    size += stat.size;
                }
            }
            return size;
        };

        const originalSize = getAllJSFiles(SRC_DIR);

        console.log('   Bundling with esbuild...');

        const result = await esbuild.build({
            entryPoints: [MAIN_JS],
            bundle: true,
            minify: true,
            sourcemap: false,
            target: ['es2020'],
            format: 'esm',
            outfile: OUTPUT_JS,
            plugins: [absolutePathPlugin],
            // Don't fail on warnings
            logLevel: 'warning',
            // Tree shake unused code
            treeShaking: true
        });

        const outputStat = fs.statSync(OUTPUT_JS);
        const minifiedSize = outputStat.size;

        const savedKB = Math.round((originalSize - minifiedSize) / 1024);
        const savedPercent = Math.round((1 - minifiedSize / originalSize) * 100);

        console.log(`\n✅ JavaScript bundled successfully!`);
        console.log(`   Output: ${OUTPUT_JS}`);
        console.log(`   Original: ${Math.round(originalSize / 1024)}KB`);
        console.log(`   Bundled: ${Math.round(minifiedSize / 1024)}KB`);
        console.log(`   Saved: ${savedKB}KB (${savedPercent}%)`);

        if (result.warnings.length > 0) {
            console.log(`\n⚠️  Warnings: ${result.warnings.length}`);
        }

    } catch (error) {
        console.error('❌ Error bundling JavaScript:', error.message);

        // Fallback: just copy main.js if esbuild fails
        console.log('\n   Falling back to simple copy...');
        if (fs.existsSync(MAIN_JS)) {
            fs.copyFileSync(MAIN_JS, OUTPUT_JS);
            console.log('   ✓ Copied main.js to dist/');
        }
    }
};

bundleJS();
