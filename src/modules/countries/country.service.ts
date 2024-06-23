import { SortedCountries } from '../../db/countrylist';
import { Country } from '../../types';
import { CountriesQuery } from './country.schema';

export const getCountryList = (filter?: CountriesQuery) => {
  if (!filter) {
    return SortedCountries;
  }

  const {letters, continents } = filter;

  const letterArray = letters?.split(',') || Object.keys(SortedCountries);
  const continentArray = continents?.split(',');

  const filteredCountries = letterArray.reduce((acc, letter) => {
    const countries = SortedCountries[letter];

    if (countries) {
      const filteredByContinent = continentArray
        ? countries.filter((country) => continentArray.includes(country.continent[0]) || continentArray.includes(country.continent[1]))
        : countries;

      if (filteredByContinent.length) {
        acc[letter] = filteredByContinent;
      }
    }

    return acc;
  }, {} as Record<string, Country[]>);

  return filteredCountries;
};
