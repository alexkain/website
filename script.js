// Modern ES6+ JavaScript - No jQuery needed

document.addEventListener('DOMContentLoaded', () => {
  // Load navigation menu
  loadNavigation();

  // Attach event listener to "Have Some Fun" button
  const haveSomeFunBtn = document.getElementById('haveSomeFun');
  if (haveSomeFunBtn) {
    haveSomeFunBtn.addEventListener('click', goToSomeFun);
  }

  // Load gallery if on a gallery page
  loadGallery();
});

function loadNavigation() {
  const navContainer = document.getElementById('navigation');
  if (!navContainer) return;

  const menuHTML = `
    <div id="verticalmenu">
      <div class="menu-title">
        <button id="menuToggle" class="menu-toggle" aria-label="Toggle menu">☰</button>
        <a href="index.html">ALEXKA.IN</a>
      </div>
      <ul id="menuItems" class="menu-items">
        <li><a href="arctic.html"><i>ARCTIC</i></a></li>
        <li><a href="people.html"><i>PEOPLE</i></a></li>
        <li><a href="places.html"><i>PLACES</i></a></li>
        <li><a href="things.html"><i>THINGS</i></a></li>
        <li><a href="holla.html">HOLLA@ME</a></li>
        <li><a id="haveSomeFun" href="">HAVE SOME FUN</a></li>
      </ul>
    </div>
  `;

  navContainer.innerHTML = menuHTML;

  // Set up mobile menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const menuItems = document.getElementById('menuItems');

  if (menuToggle && menuItems) {
    menuToggle.addEventListener('click', (e) => {
      e.preventDefault();
      menuItems.classList.toggle('open');
      menuToggle.classList.toggle('active');
    });
  }
}

function goToSomeFun(e) {
  e.preventDefault();
  window.open(getRandomVideo());
}

function getRandomVideo() {
  const videos = [
    "https://www.youtube.com/watch?v=HpVXIH24KzQ",
    "https://www.youtube.com/watch?v=-bYBJAQ-_24",
    "https://www.youtube.com/watch?v=YbEOr5Weqb8",
    "https://www.youtube.com/watch?v=6Ktc-8zagd0",
    "https://www.youtube.com/watch?v=OfZiANNhJrE",
    "https://www.youtube.com/watch?v=L-yxmCNkS30",
    "https://www.youtube.com/watch?v=io3-SzFyKKU",
    "https://www.youtube.com/watch?v=nVnNGDWJDKg",
    "https://www.youtube.com/watch?v=qPyP_7Xuqr0",
    "https://www.youtube.com/watch?v=G-OVrI9x8Zs",
    "https://www.youtube.com/watch?v=XvSsGhXwsDY"
  ];

  return videos[Math.floor(Math.random() * videos.length)];
}

function loadGallery() {
  const galleryContainer = document.getElementById('gallery');
  if (!galleryContainer) return;

  const galleryName = galleryContainer.dataset.gallery;
  const folder = galleryName;

  // Determine prefix based on gallery name
  let prefix;
  if (galleryName === 'places') {
    prefix = 'place';
  } else if (galleryName === 'things') {
    prefix = 'thing';
  } else {
    prefix = galleryName; // arctic and people use full name
  }

  // Load images starting from 0, stopping when image fails to load
  let imageIndex = 0;
  let consecutiveFailures = 0;
  const maxImages = 200; // Safety limit to prevent infinite loop
  const maxConsecutiveFailures = 10; // Stop after 10 consecutive missing images
  let isFirstImage = true;

  function loadNextImage() {
    if (imageIndex >= maxImages || consecutiveFailures >= maxConsecutiveFailures) {
      initLazyLoading();
      return;
    }

    const imagePath = `images/${folder}/${prefix}-${imageIndex}.jpg`;

    // Check if image exists before adding to DOM
    const testImg = new Image();
    testImg.onload = function() {
      // Image exists, create and add it to the gallery
      consecutiveFailures = 0; // Reset failure counter

      const img = document.createElement('img');
      img.className = 'imageframe';
      img.alt = `${galleryName.charAt(0).toUpperCase() + galleryName.slice(1)} photo ${imageIndex}`;

      if (isFirstImage) {
        img.src = imagePath;
        img.loading = 'eager';
        isFirstImage = false;
      } else {
        img.dataset.src = imagePath;
        img.loading = 'lazy';
      }
      galleryContainer.appendChild(img);
      imageIndex++;
      loadNextImage(); // Try loading next image
    };
    testImg.onerror = function() {
      // Image doesn't exist, try next one
      consecutiveFailures++;
      imageIndex++;
      loadNextImage();
    };
    testImg.src = imagePath;
  }

  loadNextImage();
}

function initLazyLoading() {
  // Use Intersection Observer for modern lazy loading
  const images = document.querySelectorAll('img.imageframe[data-src]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}