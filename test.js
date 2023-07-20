const requester = require('nurzhan-package/requester');
const debounce = require('nurzhan-package/debounce');

const cards = document.getElementById("cards");
const input = document.getElementById("input");

const BASE_URL = 'https://www.googleapis.com/books/v1';
const API_KEY = 'AIzaSyAHetf-9nnIkznkw1ihl36pErV0mGuvgCk';

async function renderCards(response) {

  cards.innerHTML = "";

  await response.items.forEach(book => {
    const cardWrapper = document.createElement("div");
    const icon = document.createElement("img");
    const info = document.createElement("div");
    const name = document.createElement("div");
    const authors = document.createElement("div");
    const fragmentInfo = document.createDocumentFragment();
    const fragmentOption = document.createDocumentFragment();
    const accordion = document.createElement('div');

    accordion.style.display = 'none';
    accordion.className = 'accordion';

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
    cardWrapper.appendChild(accordion);

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

const xhr = new XMLHttpRequest();

const getBooks = async (value) => {
  const { get } = requester(`${BASE_URL}/volumes?q=${value}:keyes&key=${API_KEY}`);

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

const clearInput = () => {
  cards.innerHTML = "";
  input.value = "";
}

const onChange = () => {
  const value = input.value;
  if (value) {
    xhr.abort();
    getBooks(value);
  }
};


const onChangeWithDebounce = debounce(onChange, 500);
// publish requester
input.addEventListener('change', onChangeWithDebounce);
