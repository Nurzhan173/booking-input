const dropdown = document.getElementById("dropdown");
const input = document.getElementById("input");

const BASE_URL = 'http://universities.hipolabs.com'

async function renderList(response) {

  dropdown.innerHTML = ""

  await response.forEach(option => {
    const optionWrapper = document.createElement("div");
    const icon = document.createElement("img");
    const info = document.createElement("div");
    const name = document.createElement("div");
    const country = document.createElement("div");
    const fragmentInfo = document.createDocumentFragment();
    const fragmentOption = document.createDocumentFragment();

    optionWrapper.className = "optionWrapper";
    info.className = "info";
    name.className = "name";
    country.className = "country";

    icon.src = './assets/location-icon.svg';

    name.textContent = option.name;
    country.textContent = option.country;

    fragmentInfo.append(name);
    fragmentInfo.append(country);

    info.appendChild(fragmentInfo);

    fragmentOption.append(icon);
    fragmentOption.append(info);

    optionWrapper.appendChild(fragmentOption);

    dropdown.appendChild(optionWrapper);

    dropdown.style.display = "block";
  });
}

const xhr = new XMLHttpRequest();

const getCountries = async (value) => {
  const { get } = requester(`${BASE_URL}/search?name=${value}`)

  return get().then((res) => {
    return JSON.parse(res.response);
  }).then((jsonValue) => {
    renderList(jsonValue);
  });
};

const methodTypes = {
  GET: 'GET',
  POST: 'POST'
}

const requester = (url) => {
  let errorEvents = {
    hasGenericError: false,
    hasServerError: false
  };

  const { GET } = methodTypes;

  return {
    get: () => {
      return new Promise((resolve, reject) => {

        xhr.open(GET, url);
        xhr.send();

        xhr.onreadystatechange = function (ev) {
          if (ev.currentTarget.readyState === 4 && ev.currentTarget.status === 200) {
            resolve(ev.currentTarget);
          } else if (ev.status === 400) {
            errorEvents.hasGenericError = true;
            reject(ev.error);
          } else if (ev.status === 500) {
            errorEvents.hasServerError = true
          }
        }
      })
    }
  }
};

const clearInput = () => {
  dropdown.innerHTML = "";
  input.value = "";
}

const onChange = () => {
  const value = input.value;
  if (value) {
    xhr.abort();
    getCountries(value);
  }
};

input.onkeyup = onChange;
