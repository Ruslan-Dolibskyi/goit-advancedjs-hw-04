import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import axios from 'axios';

const form = document.getElementById('search-form');
const gallery = document.getElementById('gallery');
const loadMoreButton = document.getElementById('load-more');

let page = 1;
let currentQuery = '';
const perPage = 40;
const apiKey = '44455355-2a7bcc134ac57944b610f09f9';
const baseUrl = 'https://pixabay.com/api/';
let lightbox = new SimpleLightbox('.gallery a');

const fetchImages = async (query, page) => {
  try {
    const response = await axios.get(baseUrl, {
      params: {
        key: apiKey,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: perPage,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    iziToast.show({
      title: 'Error',
      message: 'Failed to fetch images. Please try again later.',
      position: 'topRight',
      backgroundColor: 'lightcoral',
      color: 'white',
    });
    throw error;
  }
};

const renderImages = images => {
  const markup = images
    .map(
      image => `
    <a href="${image.largeImageURL}" class="photo-card">
      <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${image.likes}</p>
        <p class="info-item"><b>Views:</b> ${image.views}</p>
        <p class="info-item"><b>Comments:</b> ${image.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
      </div>
    </a>
  `
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
};

const clearGallery = () => {
  gallery.innerHTML = '';
};

const handleSearch = async event => {
  event.preventDefault();
  const queryInput = form.searchQuery.value.trim();

  if (!queryInput) {
    iziToast.show({
      title: 'Error',
      message: 'Please enter a search query.',
      position: 'topRight',
      backgroundColor: 'lightcoral',
      color: 'white',
    });
    return;
  }

  currentQuery = queryInput;
  page = 1;
  clearGallery();
  loadMoreButton.style.display = 'none';

  try {
    const data = await fetchImages(currentQuery, page);
    if (data.hits.length === 0) {
      iziToast.show({
        title: 'Error',
        message: `No images found for "${currentQuery}". Please try again.`,
        position: 'topRight',
        backgroundColor: 'lightcoral',
        color: 'white',
      });
      return;
    }
    renderImages(data.hits);
    iziToast.show({
      title: 'Success',
      message: `Found ${data.totalHits} images for "${currentQuery}".`,
      position: 'topRight',
      backgroundColor: 'lightgreen',
      color: 'white',
    });

    if (data.hits.length === perPage) {
      loadMoreButton.style.display = 'block';
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
};

const loadMoreImages = async () => {
  page += 1;

  try {
    const data = await fetchImages(currentQuery, page);
    renderImages(data.hits);

    if (page * perPage >= data.totalHits) {
      loadMoreButton.style.display = 'none';
      iziToast.show({
        title: 'Info',
        message: "You've reached the end of search results.",
        position: 'topRight',
        backgroundColor: 'lightcoral',
        color: 'white',
      });
    }
  } catch (error) {
    console.error('Error fetching more images:', error);
    iziToast.show({
      title: 'Error',
      message: 'Failed to fetch more images. Please try again later.',
      position: 'topRight',
      backgroundColor: 'lightcoral',
      color: 'white',
    });
  }
};

form.addEventListener('submit', handleSearch);
loadMoreButton.addEventListener('click', loadMoreImages);
