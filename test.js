const requester = require('nurzhan-package/requester');
const debounce = require('nurzhan-package/debounce');
import { Skeleton } from './components/Skeleton/skeleton';
import { BASE_URL, API_KEY } from './constants/constants';

window.xhr = new XMLHttpRequest();

const appContainer = document.getElementById('app');

const skeletonComponent = new Skeleton();
appContainer.appendChild(skeletonComponent.render());

const cards = document.getElementById("cards");
const input = document.getElementById("input");
const cross = document.getElementById('cross');
const skeleton = document.querySelector('.skeleton');

async function renderCards(response) {

  cards.innerHTML = "";
  skeleton.style.display = 'none';

  await response.items.forEach(book => {
    const cardWrapper = document.createElement("div");
    const icon = document.createElement("img");
    const info = document.createElement("div");
    const name = document.createElement("div");
    const authors = document.createElement("div");
    const fragmentInfo = document.createDocumentFragment();
    const fragmentOption = document.createDocumentFragment();

    cardWrapper.className = "cardWrapper";
    info.className = "info";
    name.className = "name";
    authors.className = "country";
    icon.className = 'mockImage'

    icon.src = book.volumeInfo?.imageLinks?.smallThumbnail || './assets/bookMock.png';

    name.textContent = book.volumeInfo.title;
    authors.textContent = book.volumeInfo.authors;

    fragmentInfo.append(name);
    fragmentInfo.append(authors);

    info.appendChild(fragmentInfo);

    fragmentOption.append(icon);
    fragmentOption.append(info);

    cardWrapper.addEventListener('click', () => getBooksById(book.id));

    cardWrapper.appendChild(fragmentOption);

    cards.appendChild(cardWrapper);
  });
}

const renderBook = (response) => {

  const content = document.getElementById('modal-content');
  content.innerHTML = "";

  const title = document.createElement("p");
  title.textContent = response.volumeInfo.title;

  content.append(title);
  modal.appendChild(content);

  modal.style.display = "block";
}

const getBooks = async (value) => {
  const { get } = requester(`${BASE_URL}/volumes?q=${value}:keyes&key=${API_KEY}`);

  cards.innerHTML = "";
  skeleton.style.display = 'block';

  return get().then((res) => {
    return JSON.parse(res.response);
  }).then((jsonValue) => {
    renderCards(jsonValue);
  });
};

const getBooksById = async (id) => {

  const { get } = requester(`${BASE_URL}/volumes/${id}`);

  return get().then((res) => {
    return JSON.parse(res.response);
  }).then((jsonValue) => {
    renderBook(jsonValue);
  });
}

cross.onclick = () => {
  cards.innerHTML = "";
  input.value = "";
}

const onChange = () => {
  const value = input.value;
  if (value) {
    debounce(xhr.abort(), 500);
    getBooks(value);
  }
};


input.addEventListener('keyup', onChange);
