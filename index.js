const dropdown = document.getElementById("dropdown");
const input = document.getElementById("input");

let controller = new AbortController();
let signal = controller.signal;

async function renderList(response) {

  dropdown.innerHTML = ""

  await response.forEach(option => {

    const optionWrapper = document.createElement("div");
    const icon = document.createElement("img");
    const info = document.createElement("div");
    const name = document.createElement("div");
    const country = document.createElement("div");

    optionWrapper.className = "optionWrapper";
    info.className = "info";
    name.className = "name";
    country.className = "country";

    icon.src = './assets/location-icon.svg';

    name.innerHTML = option.name;
    country.innerHTML = option.country;

    info.appendChild(name);
    info.appendChild(country);

    optionWrapper.appendChild(icon);
    optionWrapper.appendChild(info);

    dropdown.appendChild(optionWrapper);

    dropdown.style.display = "block";
  });
}

const getCountries = async (value, signal) => {
  try {
    const response = await fetch(
      `http://universities.hipolabs.com/search?name=${value}`,
      { signal }
    )
    const jsonValue = await response.json();

    renderList(jsonValue);
  } catch (error) {
    console.log(error)
  }
};

const clearInput = () => {
  dropdown.innerHTML = "";
  input.value = "";
}

const onChange = () => {
  const value = input.value;
  if (value) {
    controller.abort();
    controller = new AbortController();
    signal = controller.signal;
    getCountries(value, signal);
  }
};

input.onkeyup = onChange;
