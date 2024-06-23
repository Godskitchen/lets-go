import { UserCard, UserCardDto } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { generateMockCards, getRandomArrItem, getRandomArrItems, getRandomNumber } from '../../utils/helpers';
import { FemaleNames, FemaleSurnames, Genders, MaleNames, MaleSurnames } from '../../utils/mocks';
import { CardListById, CardPool } from '../../db/cardlist';
import { GetCardsQuery } from './card.schema';
import { SortedCountries } from '../../db/countrylist';
import { taskQueue } from '../../utils/task-queue';


export const createNewCard = async (data: UserCardDto) => taskQueue.enqueue(async () => {
  const newId = uuidv4();
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

  const userCard: UserCard = {
    cardId: newId,
    name: `${name} ${surname}`,
    avatarUrl,
    countryList: data.countryList,
    hashTags: data.hashTags,
    transport: data.transport
  };

  CardPool.push(userCard);

  createUserEntry(userCard);
  return newId;
});

export const getCardsById = async (id: string, query: GetCardsQuery) => taskQueue.enqueue(async () => {
  const cards = CardListById.get(id);
  const {page, countries, continents} = query;

  if (!cards) {
    return null;
  }

  let selected: UserCard[] = Array.from(cards);

  const MAX_CARDS_PER_PAGE = 4;

  const countryFilterList = countries?.split(',') ?? [];
  const continentFilterList = continents?.split(',') ?? [];

  if (countryFilterList.length || continentFilterList.length) {
    selected = selected.filter(({countryList: countryListFromCards}) => {
      let isMatch = false;
      for (const country of countryListFromCards) {
        if (countryFilterList.includes(country.name)) {
          isMatch = true;
          break;
        }

        if (continentFilterList.length) {
          const countryData = Object.values(SortedCountries).flat().find((countryInList) => countryInList.name.rus === country.name);
          if (countryData && (continentFilterList.includes(countryData.continent[0]) || continentFilterList.includes(countryData.continent[1]))) {
            isMatch = true;
            break;
          }
        }
      }

      return isMatch;
    });
  }

  const startIndex = MAX_CARDS_PER_PAGE * (page - 1);
  const endIndex = startIndex + MAX_CARDS_PER_PAGE;

  return {
    cardList: selected.slice(startIndex, endIndex),
    totalCardsCount: selected.length
  };
});

function createUserEntry(userCard: UserCard) {
  taskQueue.enqueue(async () => {
    const userId = userCard.cardId;
    const userCountries = userCard.countryList.map((country) => country.name);
    const userTransport = userCard.transport;

    const selectedCards = new Set<UserCard>();
    selectedCards.add(userCard);
    const SELECTED_CARDS_COUNT = 20;

    const filteredPool = CardPool.filter((card) => {
      let isTransportMatch = false;
      let isCountryMatch = false;

      card.transport.forEach((transport) => {
        if (userTransport.includes(transport)) {
          isTransportMatch = true;
        }
      });

      card.countryList.forEach((country) => {
        if (userCountries.includes(country.name)) {
          isCountryMatch = true;
        }
      });

      return isTransportMatch && isCountryMatch;
    });

    const slicedFilteredPool = getRandomArrItems(filteredPool, SELECTED_CARDS_COUNT);
    slicedFilteredPool.forEach((card) => selectedCards.add(card));

    console.log('card pool length', CardPool.length);
    console.log(selectedCards.size);

    if (selectedCards.size < SELECTED_CARDS_COUNT) {
      const requiredCount = SELECTED_CARDS_COUNT - selectedCards.size;
      const restCards = generateMockCards(requiredCount, userCard);
      restCards.forEach((card) => selectedCards.add(card));
      CardPool.push(...restCards);
    }

    CardListById.set(userId, selectedCards);
  });
}

