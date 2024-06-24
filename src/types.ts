export type Country = {
  name: {
    common: string;
    rus: string
  },
  flags: {
    png: string;
    svg: string;
  },
  continent: string[];
  island: boolean;
}

export enum Continent {
  Europe = 'Europe',
  Africa = 'Africa',
  NorthAmerica = 'North_America',
  SouthAmerica = 'South_America',
  Asia = 'Asia',
  Oceania = 'Oceania'
}

export type ValidationErrorField = {
  field: string;
  value: string;
  messages: string[];
}

export enum Transport {
  plane = 'plane',
  bus = 'bus',
  bike = 'bike',
  walk = 'walk'
}

export type CardCountry = {
  countryData: Country;
  description?: string;
}

export type UserCardDto = {
  companionCount: number;
  children: boolean;
  startDate: string;
  endDate: string;
  countryList: {
    name: string;
    description?: string;
  }[];
  hashTags?: string[];
  transport: Transport[];
}

export type UserCard = {
  cardId: string;
  name: string;
  avatarUrl: string;
  countryList: CardCountry[];
  hashTags?: string[];
  transport: Transport[];
}

export type ValidationFieldIssue = {
  field?: string;
  message?: string;
}


