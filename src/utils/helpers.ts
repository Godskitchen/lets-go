import { CardPool } from '../db/cardlist';
import { CountryNames } from '../db/countrylist';
import { Transport, UserCard, planningCountry } from '../types';
import { FemaleNames, FemaleSurnames, Genders, HashTags, MaleNames, MaleSurnames } from './mocks';
import { v4 as uuidv4 } from 'uuid';


export const getRandomNumber = (min: number, max: number, numAfterDigit = 0): number | typeof NaN => {
  if ((!Number.isFinite(min) || !Number.isFinite(max)) || (min < 0 || max < 0)) {
    return NaN;
  }

  const lowerBound = Math.min(min, max);
  const upperBound = Math.max(min, max);

  return +(Math.random() * (upperBound - lowerBound) + lowerBound).toFixed(numAfterDigit);
};

export const getRandomArrItem = <T>(array: T[]): T =>
  array[getRandomNumber(0, array.length - 1)];

export const getRandomArrItems = <T>(array: T[], count?: number): T[] => {
  const itemsCount = (count === undefined) ? getRandomNumber(1, array.length - 1) : count;

  const uniqueSourceArray = Array.from(new Set(array));

  if (itemsCount > uniqueSourceArray.length) {
    return uniqueSourceArray;
  }

  const resultElements: T[] = [];

  for (let i = 0; i < itemsCount; i++) {
    let element = getRandomArrItem(uniqueSourceArray);
    while (resultElements.includes(element)){
      element = getRandomArrItem(uniqueSourceArray);
    }

    resultElements.push(element);
  }

  return resultElements;
};

export const generateMockCards = (count: number, srcCard: UserCard) => {
  const mockCards: UserCard[] = [];

  for (let i = 0; i < count; i++) {
    const gender = getRandomArrItem(Genders);
    const avatarUrl = `https://xsgames.co/randomusers/assets/avatars/${gender}/${getRandomNumber(1, 75)}.jpg`;

    let name: string;
    let surname: string;

    if (gender === 'male') {
      name = getRandomArrItem(MaleNames);
      surname = getRandomArrItem(MaleSurnames);
    } else {
      name = getRandomArrItem(FemaleNames);
      surname = getRandomArrItem(FemaleSurnames);
    }

    const mockCountriesCount = getRandomNumber(2, 4);
    const countryMatchesCount = Math.min(getRandomNumber(1, srcCard.countryList.length), mockCountriesCount);
    const mockCountriesList = new Set(getRandomArrItems(srcCard.countryList, countryMatchesCount));
    while(mockCountriesList.size < mockCountriesCount) {
      mockCountriesList.add({name: getRandomArrItem(CountryNames)});
    }

    const mockTransportCount = getRandomNumber(1, 4);
    const transportMatchesCount = Math.min(getRandomNumber(1, srcCard.transport.length), mockCountriesCount);
    const mockTransportList = new Set(getRandomArrItems(srcCard.transport, transportMatchesCount));
    while(mockTransportList.size < mockTransportCount) {
      mockTransportList.add(getRandomArrItem(Object.values(Transport)));
    }

    const mockCard: UserCard = {
      cardId: uuidv4(),
      name: `${name} ${surname}`,
      avatarUrl,
      countryList: Array.from(mockCountriesList),
      transport: Array.from(mockTransportList),
      hashTags: getRandomArrItems(HashTags, getRandomNumber(1, 6))
    };

    mockCards.push(mockCard);
  }

  return mockCards;
};

export const seedCardList = async (count: number) => {
  for (let i = 0; i < count; i++) {
    const gender = getRandomArrItem(Genders);
    const avatarUrl = `https://xsgames.co/randomusers/assets/avatars/${gender}/${getRandomNumber(1, 75)}.jpg`;

    let name: string;
    let surname: string;

    if (gender === 'male') {
      name = getRandomArrItem(MaleNames);
      surname = getRandomArrItem(MaleSurnames);
    } else {
      name = getRandomArrItem(FemaleNames);
      surname = getRandomArrItem(FemaleSurnames);
    }

    const mockCountriesCount = getRandomNumber(2, 4);
    const mockCountriesList = new Set<planningCountry>();
    while(mockCountriesList.size < mockCountriesCount) {
      mockCountriesList.add({name: getRandomArrItem(CountryNames)});
    }

    const mockTransportCount = getRandomNumber(1, 4);
    const mockTransportList = new Set<Transport>();
    while(mockTransportList.size < mockTransportCount) {
      mockTransportList.add(getRandomArrItem(Object.values(Transport)));
    }

    const mockCard: UserCard = {
      cardId: uuidv4(),
      name: `${name} ${surname}`,
      avatarUrl,
      countryList: Array.from(mockCountriesList),
      transport: Array.from(mockTransportList),
      hashTags: getRandomArrItems(HashTags, getRandomNumber(1, 6))
    };

    CardPool.push(mockCard);
  }
};
