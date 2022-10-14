import './css/styles.css';
const debounce = require('lodash.debounce');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchInput = document.querySelector('#search-box');
const listCountries = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchInput.addEventListener(
  'input',
  debounce(() => {
    if (searchInput.value.length > 0) {
      fetchCountries(searchInput.value)
        .then(users => renderUserList(users))
        .catch(error => {
          //   console.log(error);
          if (error == 'Error: 404') {
            resetInfo();
            Notify.failure('Oops, there is no country with that name');
          }
        });
    } else {
      resetInfo();
    }
  }, DEBOUNCE_DELAY)
);

function resetInfo() {
  listCountries.innerHTML = '';
  countryInfo.innerHTML = '';
}

function fetchLanguages(languagesObj) {
  return Object.values(languagesObj).join(', ');
}

function showCountryDetailInfo(countryObj) {
  listCountries.innerHTML = '';
  countryInfo.innerHTML = `
          <div class="country-info">
            <div class="country-holder">
                <img class="country-flag" width="40"  src="${
                  countryObj.flags.svg
                }">
                <p class="country-name-big"> ${countryObj.name.common}</p>
            </div>
            
            <ul>
                <li class="country-detail-item"><b>Capital:</b> ${
                  countryObj.capital
                }</li>
                <li class="country-detail-item"><b>Population:</b> ${
                  countryObj.population
                }</li>
                <li class="country-detail-item"><b>Languages:</b> ${fetchLanguages(
                  countryObj.languages
                )}</li>
            </ul>
          </div>
      `;
}

function showCountryList(arrCountries) {
  countryInfo.innerHTML = '';
  const markup = arrCountries
    .map(country => {
      return `
          <li class="country-item">
          <img class="country-flag" width="40"  src="${country.flags.svg}">
            <p class="country-name"> ${country.name.common}</p>
          </li>
      `;
    })
    .join('');
  listCountries.innerHTML = markup;
}

function renderUserList(countries) {
  if (countries.length > 2 && countries.length <= 10) {
    showCountryList(countries);
  } else if (countries.length > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else {
    showCountryDetailInfo(countries[0]);
  }
}
