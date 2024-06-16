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
