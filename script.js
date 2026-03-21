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
    <div id="nav-panel">
      <a id="site-title" href="index.html">ALEXKA.IN</a>
      <div id="verticalmenu">
        <button id="menuToggle" class="menu-toggle" aria-label="Toggle menu"></button>
        <ul id="menuItems" class="menu-items">
          <li><a href="arctic.html"><i>ARCTIC</i></a></li>
          <li><a href="people.html"><i>PEOPLE</i></a></li>
          <li><a href="places.html"><i>PLACES</i></a></li>
          <li><a href="things.html"><i>THINGS</i></a></li>
          <li><a href="holla.html">HOLLA@ME</a></li>
          <li><a id="haveSomeFun" href="">HAVE SOME FUN</a></li>
        </ul>
      </div>
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
    "https://www.youtube.com/watch?v=YbEOr5Weqb8",
    "https://www.youtube.com/watch?v=OfZiANNhJrE",
    "https://www.youtube.com/watch?v=L-yxmCNkS30",
    "https://www.youtube.com/watch?v=io3-SzFyKKU",
    "https://www.youtube.com/watch?v=nVnNGDWJDKg",
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

  let prefix;
  if (galleryName === 'places') {
    prefix = 'place';
  } else if (galleryName === 'things') {
    prefix = 'thing';
  } else {
    prefix = galleryName;
  }

  const BATCH_SIZE = 20;
  const MAX_IMAGES = 200;
  const MAX_CONSECUTIVE_FAILURES = 10;
  let consecutiveFailures = 0;
  const label = galleryName.charAt(0).toUpperCase() + galleryName.slice(1);

  function loadBatch(startIndex) {
    const count = Math.min(BATCH_SIZE, MAX_IMAGES - startIndex);
    if (count <= 0) return;

    // Probe all images in the batch in parallel, reusing each probe img in the DOM
    const probes = Array.from({ length: count }, (_, i) => {
      const index = startIndex + i;
      return new Promise(resolve => {
        const img = new Image();
        img.className = 'imageframe';
        img.alt = `${label} photo ${index}`;
        img.onload = () => resolve({ index, img, success: true });
        img.onerror = () => resolve({ index, img: null, success: false });
        img.src = `images/${folder}/${prefix}-${index}.jpg`;
      });
    });

    Promise.all(probes).then(results => {
      results.sort((a, b) => a.index - b.index);
      for (const { img, success } of results) {
        if (success) {
          consecutiveFailures = 0;
          galleryContainer.appendChild(img);
        } else {
          if (++consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) return;
        }
      }
      if (consecutiveFailures < MAX_CONSECUTIVE_FAILURES) {
        loadBatch(startIndex + BATCH_SIZE);
      }
    });
  }

  loadBatch(0);
}
