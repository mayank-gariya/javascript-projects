const TARGET_IMAGE_URL = "image-extension/rock.jpg"; 

function swapImages() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    // Only swap if it hasn't been swapped already
    if (img.src !== TARGET_IMAGE_URL) {
      img.src = TARGET_IMAGE_URL;
      img.srcset = ""; // Clear srcset so high-res versions don't override it
    }
  });
}

// 1. Run immediately when the page loads
swapImages();

// 2. Watch the page for scrolling / lazy-loading new images
const observer = new MutationObserver((mutations) => {
  swapImages();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});