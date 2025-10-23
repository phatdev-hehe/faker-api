import type { Faker } from '@faker-js/faker';
import { allFakers, allLocales, faker } from '@faker-js/faker';
import devalue from 'devalue';
import _ from 'lodash';
import mapObject from 'map-obj';

export type Locale = keyof typeof allLocales;
export type Locales = Locale[];
export type Template = object;

export const getFaker = (locale: Locale): Faker => allFakers[locale] ?? faker;
export const mapObjectDeep = _.partialRight(mapObject, { deep: true });

export const supportedLocales = _.union(
  ['en', 'vi'] satisfies Locales,
  Object.keys(allLocales),
) as Locales;

export const serializeValue = (value: unknown) =>
  typeof value === 'bigint' ? devalue.stringify(value) : value;

export { default as pkg } from '../package.json';
