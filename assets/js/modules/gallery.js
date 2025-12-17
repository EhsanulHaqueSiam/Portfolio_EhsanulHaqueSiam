/**
 * Gallery Lightbox Module
 * Handles fullscreen image gallery with navigation, thumbnails, and keyboard controls
 */

let currentGalleryImages = [];
let currentGalleryIndex = 0;
let lightboxElement = null;

/**
 * Create the gallery lightbox DOM structure
 */
export const createGalleryLightbox = () => {
    if (lightboxElement) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'gallery-lightbox';
    lightbox.id = 'gallery-lightbox';
    lightbox.innerHTML = `
    <div class="gallery-lightbox-content">
      <button class="gallery-lightbox-close" aria-label="Close gallery">&times;</button>
      <button class="gallery-lightbox-nav prev" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
      <img class="gallery-lightbox-image" src="" alt="Gallery image">
      <button class="gallery-lightbox-nav next" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
      <div class="gallery-lightbox-counter"></div>
      <div class="gallery-lightbox-thumbnails"></div>
    </div>
  `;
    document.body.appendChild(lightbox);
    lightboxElement = lightbox;

    // Event listeners
    lightbox.querySelector('.gallery-lightbox-close').addEventListener('click', closeGallery);
    lightbox.querySelector('.gallery-lightbox-nav.prev').addEventListener('click', () => navigateGallery(-1));
    lightbox.querySelector('.gallery-lightbox-nav.next').addEventListener('click', () => navigateGallery(1));

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeGallery();
    });

    // Keyboard navigation
    document.addEventListener('keydown', handleGalleryKeyboard);
};

/**
 * Handle keyboard navigation in gallery
 */
const handleGalleryKeyboard = (e) => {
    if (!lightboxElement || !lightboxElement.classList.contains('active')) return;

    switch (e.key) {
        case 'Escape':
            closeGallery();
            break;
        case 'ArrowLeft':
            navigateGallery(-1);
            break;
        case 'ArrowRight':
            navigateGallery(1);
            break;
    }
};

/**
 * Open gallery with array of images
 * @param {string[]} images - Array of image URLs or filenames
 * @param {number} startIndex - Index of image to show first
 * @param {function} resolveImageFn - Function to resolve image paths
 */
export const openGallery = (images, startIndex = 0, resolveImageFn) => {
    createGalleryLightbox();
    currentGalleryImages = images.map(img => resolveImageFn(img));
    currentGalleryIndex = startIndex;
    updateGalleryDisplay();
    lightboxElement.classList.add('active');
    document.body.style.overflow = 'hidden';
};

/**
 * Close the gallery
 */
export const closeGallery = () => {
    if (lightboxElement) {
        lightboxElement.classList.remove('active');
        document.body.style.overflow = '';
    }
};

/**
 * Navigate to next/previous image
 * @param {number} direction - 1 for next, -1 for previous
 */
export const navigateGallery = (direction) => {
    currentGalleryIndex += direction;
    if (currentGalleryIndex < 0) currentGalleryIndex = currentGalleryImages.length - 1;
    if (currentGalleryIndex >= currentGalleryImages.length) currentGalleryIndex = 0;
    updateGalleryDisplay();
};

/**
 * Update the gallery display with current image and thumbnails
 */
const updateGalleryDisplay = () => {
    if (!lightboxElement || !currentGalleryImages.length) return;

    const mainImage = lightboxElement.querySelector('.gallery-lightbox-image');
    const counter = lightboxElement.querySelector('.gallery-lightbox-counter');
    const thumbnailContainer = lightboxElement.querySelector('.gallery-lightbox-thumbnails');
    const prevBtn = lightboxElement.querySelector('.gallery-lightbox-nav.prev');
    const nextBtn = lightboxElement.querySelector('.gallery-lightbox-nav.next');

    // Update main image with fade effect
    mainImage.style.opacity = '0';
    setTimeout(() => {
        mainImage.src = currentGalleryImages[currentGalleryIndex];
        mainImage.style.opacity = '1';
    }, 150);

    // Update counter
    counter.textContent = `${currentGalleryIndex + 1} / ${currentGalleryImages.length}`;

    // Hide nav buttons if only one image
    const singleImage = currentGalleryImages.length <= 1;
    prevBtn.style.display = singleImage ? 'none' : 'flex';
    nextBtn.style.display = singleImage ? 'none' : 'flex';

    // Update thumbnails
    if (currentGalleryImages.length > 1) {
        thumbnailContainer.innerHTML = currentGalleryImages.map((img, idx) =>
            `<img src="${img}" class="gallery-lightbox-thumb ${idx === currentGalleryIndex ? 'active' : ''}" data-index="${idx}" alt="Thumbnail ${idx + 1}">`
        ).join('');
        thumbnailContainer.style.display = 'flex';

        // Add click handlers to thumbnails
        thumbnailContainer.querySelectorAll('.gallery-lightbox-thumb').forEach(thumb => {
            thumb.addEventListener('click', () => {
                currentGalleryIndex = parseInt(thumb.dataset.index);
                updateGalleryDisplay();
            });
        });
    } else {
        thumbnailContainer.style.display = 'none';
    }
};
