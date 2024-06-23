import { UserCard, UserCardDto } from '../../types';
import { v4 as uuidv4 } from 'uuid';
import { generateMockCards, getRandomArrItem, getRandomArrItems, getRandomNumber } from '../../utils/helpers';
import { FemaleNames, FemaleSurnames, Genders, MaleNames, MaleSurnames } from '../../utils/mocks';
import { CardListById, CardPool } from '../../db/cardlist';


export const createNewCard = async (data: UserCardDto) => {
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

  await createUserEntry(userCard);
  return newId;
};

async function createUserEntry(userCard: UserCard) {
  const userId = userCard.cardId;
  const userCountries = userCard.countryList.map((country) => country.name);
  const userTransport = userCard.transport;

  const selectedCards = new Set<UserCard>();
  selectedCards.add(userCard);
  const SELECTED_CARDS_COUNT = 12;

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
}
