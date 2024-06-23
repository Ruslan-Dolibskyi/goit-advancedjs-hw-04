// scripts.js
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('search-form');
  const searchInput = form.querySelector('input[name="searchQuery"]');
  const searchButton = form.querySelector('button[type="submit"]');
  const gallery = document.getElementById('gallery');
  const loadMoreButton = document.getElementById('load-more');
  let page = 1;
  let currentQuery = '';
  let lightbox;

  // Деактивуємо кнопку пошуку, якщо інпут порожній
  searchInput.addEventListener('input', () => {
    if (searchInput.value.trim() === '') {
      searchButton.disabled = true;
    } else {
      searchButton.disabled = false;
    }
  });

  // Перевірка на початковий стан інпуту
  if (searchInput.value.trim() === '') {
    searchButton.disabled = true;
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    page = 1;
    gallery.innerHTML = '';
    currentQuery = searchInput.value.trim();
    await fetchImages();
  });

  loadMoreButton.addEventListener('click', fetchImages);

  async function fetchImages() {
    const apiKey = '44455355-2a7bcc134ac57944b610f09f9';
    const query = encodeURIComponent(currentQuery);
    const url = `https://pixabay.com/api/?key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (page === 1 && data.totalHits > 0) {
        iziToast.show({
          message: `Hooray! We found ${data.totalHits} images.`,
          position: 'topRight',
          backgroundColor: 'lightgreen',
          color: 'white',
        });
      }

      if (data.hits.length === 0) {
        iziToast.show({
          message:
            'Sorry, there are no images matching your search query. Please try again.',
          position: 'topRight',
          backgroundColor: 'lightcoral',
          color: 'white',
        });
        loadMoreButton.style.display = 'none';
        return;
      }

      data.hits.forEach(image => {
        const photoCard = document.createElement('a');
        photoCard.href = image.largeImageURL;
        photoCard.className = 'photo-card';
        photoCard.innerHTML = `
                    <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
                    <div class="info">
                        <p class="info-item"><b>Likes</b> ${image.likes}</p>
                        <p class="info-item"><b>Views</b> ${image.views}</p>
                        <p class="info-item"><b>Comments</b> ${image.comments}</p>
                        <p class="info-item"><b>Downloads</b> ${image.downloads}</p>
                    </div>
                `;
        gallery.appendChild(photoCard);
      });

      page += 1;
      loadMoreButton.style.display = 'block';

      if (!lightbox) {
        lightbox = new SimpleLightbox('.gallery a');
      } else {
        lightbox.refresh();
      }

      if (data.totalHits <= page * 40) {
        loadMoreButton.style.display = 'none';
        iziToast.show({
          message: "We're sorry, but you've reached the end of search results.",
          position: 'topRight',
          backgroundColor: 'lightcoral',
          color: 'white',
        });
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      iziToast.show({
        message:
          'An error occurred while fetching images. Please try again later.',
        position: 'topRight',
        backgroundColor: 'lightcoral',
        color: 'white',
      });
    }
  }
});
