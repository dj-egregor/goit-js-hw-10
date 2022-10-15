import './css/styles.css';
const debounce = require('lodash.debounce');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const searchInput = document.querySelector('#search-box');
const listCountries = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchInput.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
  const searchTerm = searchInput.value.trim();
  if (searchTerm === '') {
    setInfo();
    return;
  }
  if (searchInput.value.length > 0) {
    fetchCountries(searchTerm)
      .then(users => renderUserList(users))
      .catch(error => {
        setInfo();
        Notify.failure('Oops, there is no country with that name');
      });
  } else {
    setInfo();
  }
}

function setInfo(obj, html = '') {
  listCountries.innerHTML = '';
  countryInfo.innerHTML = '';
  if (obj === undefined) {
    return;
  }
  obj.innerHTML = html;
}

function fetchLanguages(languagesObj) {
  return Object.values(languagesObj).join(', ');
}

function showCountryDetailInfo(countryObj) {
  const html = `
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
  //   listCountries.innerHTML = '';
  //   countryInfo.innerHTML = `
  //           <div class="country-info">
  //             <div class="country-holder">
  //                 <img class="country-flag" width="40"  src="${
  //                   countryObj.flags.svg
  //                 }">
  //                 <p class="country-name-big"> ${countryObj.name.common}</p>
  //             </div>

  //             <ul>
  //                 <li class="country-detail-item"><b>Capital:</b> ${
  //                   countryObj.capital
  //                 }</li>
  //                 <li class="country-detail-item"><b>Population:</b> ${
  //                   countryObj.population
  //                 }</li>
  //                 <li class="country-detail-item"><b>Languages:</b> ${fetchLanguages(
  //                   countryObj.languages
  //                 )}</li>
  //             </ul>
  //           </div>
  //       `;
  setInfo(countryInfo, html);
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
