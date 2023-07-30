const requester = require('nurzhan-package/requester');
const debounce = require('nurzhan-package/debounce');
const Skeleton = require('nurzhan-package/components/Skeleton/skeleton');
const Modal = require('nurzhan-package/components/Modal/modal');
const Tooltip = require('nurzhan-package/components/Tooltip/tooltip');

import { BASE_URL, API_KEY } from './constants/constants';

window.xhr = new XMLHttpRequest();

const appContainer = document.getElementById('app');

const SkeletonComponent = new Skeleton();
const ModalComponent = new Modal();
const TooltipComponent = new Tooltip();

appContainer.appendChild(SkeletonComponent.render());
appContainer.appendChild(ModalComponent.render());

const cards = document.getElementById("cards");
const input = document.getElementById("input");
const skeleton = document.querySelector('.skeleton');

window.modal = document.getElementById("modal");

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

const getAuthors = (arr) => {
  let str = "";

  for(let item of arr){
    str += `${item}, `
  }

  return str;
}

const renderBook = (response) => {

  appContainer.appendChild(TooltipComponent.render());

  const content = document.getElementById('modal-content');
  content.innerHTML = "";

  const image = document.createElement("img");
  const detail = document.createElement("div");
  const title = document.createElement("p");
  const authors = document.createElement("p");
  const description = document.createElement('p');
  const country = document.createElement('p');
  const readLink = document.createElement('button');

  const tooltip = document.getElementById('tooltip');
  const tooltipText = document.getElementById('tooltipText');

  tooltipText.textContent = response.volumeInfo?.title;

  image.src = response.volumeInfo.imageLinks?.medium || './assets/bookMock.png';

  image.width = 300;
  image.height = 400;

  title.textContent = response.volumeInfo?.title;
  authors.textContent = 'Authors: ' + getAuthors(response.volumeInfo?.authors);
  country.textContent = 'Country: ' + response.accessInfo.country;
  description.textContent = 'Description: ' + response.volumeInfo?.description;
  readLink.textContent = 'Read';

  readLink.addEventListener('click', function () {
    const url = response.accessInfo.webReaderLink;
    window.open(url, '_blank');
  })

  detail.className = 'book-detail';

  tooltip.appendChild(title);
  detail.append(tooltip);
  detail.append(authors);
  detail.append(country);
  detail.append(readLink);
  detail.append(description);

  content.append(image);
  content.append(detail);

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
