const TARGET_IMAGE_URL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfUq3bVUIl42IFJVIYgDqa_4h_maCnPutzjMZt71HhsGIjrUx8O7g4VOk&s=10"; 

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