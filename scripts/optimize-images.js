/**
 * Image Optimization Script
 * 
 * Automatically converts PNG/JPG images to optimized WebP format
 * while keeping the original files as fallbacks.
 * 
 * Usage: npm run build:images
 * 
 * This script:
 * 1. Scans assets/images for PNG/JPG files
 * 2. Creates optimized WebP versions alongside originals
 * 3. Compresses large images (>500KB) more aggressively
 * 4. Skips already optimized files
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
    sharp = require('sharp');
} catch (e) {
    console.log('⚠️  Sharp not installed. Run: npm install sharp');
    console.log('   Skipping image optimization...');
    process.exit(0);
}

const IMAGES_DIR = path.join(__dirname, '..', 'assets', 'images');
const MAX_WIDTH = 1200; // Max width for any image
const QUALITY_NORMAL = 80; // Quality for normal images
const QUALITY_LARGE = 70; // Quality for large images (>500KB)
const SIZE_THRESHOLD = 500 * 1024; // 500KB

// Image extensions to process
const EXTENSIONS = ['.png', '.jpg', '.jpeg', '.PNG', '.JPG', '.JPEG'];

// Stats
let processed = 0;
let skipped = 0;
let savedBytes = 0;

async function optimizeImage(filePath) {
    const ext = path.extname(filePath);
    const baseName = path.basename(filePath, ext);
    const dirName = path.dirname(filePath);
    const webpPath = path.join(dirName, `${baseName}.webp`);

    // Skip if WebP already exists and is newer
    if (fs.existsSync(webpPath)) {
        const originalStat = fs.statSync(filePath);
        const webpStat = fs.statSync(webpPath);
        if (webpStat.mtime > originalStat.mtime) {
            skipped++;
            return;
        }
    }

    try {
        const originalSize = fs.statSync(filePath).size;
        const quality = originalSize > SIZE_THRESHOLD ? QUALITY_LARGE : QUALITY_NORMAL;

        // Convert to WebP
        const image = sharp(filePath);
        const metadata = await image.metadata();

        // Resize if too wide
        if (metadata.width > MAX_WIDTH) {
            image.resize(MAX_WIDTH, null, { withoutEnlargement: true });
        }

        await image
            .webp({ quality, effort: 6 })
            .toFile(webpPath);

        const newSize = fs.statSync(webpPath).size;
        const saved = originalSize - newSize;
        savedBytes += saved;

        const relativePath = path.relative(IMAGES_DIR, filePath);
        const savedKB = Math.round(saved / 1024);
        console.log(`✅ ${relativePath} → WebP (saved ${savedKB}KB)`);
        processed++;

    } catch (err) {
        console.error(`❌ Error processing ${filePath}:`, err.message);
    }
}

async function walkDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            await walkDirectory(filePath);
        } else if (EXTENSIONS.includes(path.extname(file))) {
            await optimizeImage(filePath);
        }
    }
}

async function main() {
    console.log('🖼️  Starting image optimization...\n');
    console.log(`   Source: ${IMAGES_DIR}`);
    console.log(`   Max width: ${MAX_WIDTH}px`);
    console.log(`   Quality: ${QUALITY_NORMAL}% (normal), ${QUALITY_LARGE}% (large files)\n`);

    if (!fs.existsSync(IMAGES_DIR)) {
        console.log('⚠️  Images directory not found. Skipping...');
        return;
    }

    await walkDirectory(IMAGES_DIR);

    console.log('\n📊 Summary:');
    console.log(`   Processed: ${processed} images`);
    console.log(`   Skipped: ${skipped} (already optimized)`);
    console.log(`   Total saved: ${Math.round(savedBytes / 1024)}KB`);
}

main().catch(console.error);
