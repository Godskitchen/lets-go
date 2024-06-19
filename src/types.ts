export type Country = {
  flags: {
    png: string;
    svg: string;
  },
  name: {
    common: string;
    rus: string
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

export type planningCountry = {
  name: string;
  description?: string;
}

export type UserCard = {
  companionCount: number;
  children: boolean;
  startDate: string;
  endDate: string;
  countryList: planningCountry[];
  hashTags?: string[];
  transport: Transport[];
}


