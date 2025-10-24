import type { Faker } from '@faker-js/faker';
import { allFakers, allLocales, faker } from '@faker-js/faker';
import devalue from 'devalue';
import _ from 'lodash';
import mapObject from 'map-obj';

export type Locale = keyof typeof allLocales;
export type Locales = Locale[];
export type Template = object;

export const version = '10.1.0';
export const getFaker = (locale: Locale): Faker => allFakers[locale] ?? faker;
export const mapObjectDeep = _.partialRight(mapObject, { deep: true });

export const excludeKeys = [
  'faker', // self reference
];

export const supportedLocales = _.union(
  ['en', 'vi'] satisfies Locales,
  Object.keys(allLocales),
) as Locales;

export const serializeValue = (value: unknown) =>
  typeof value === 'bigint' ? devalue.stringify(value) : value;

export const getFakerValue = (faker: Faker, path: any) => {
  const fn: unknown = _.get(faker, path);

  return serializeValue(_.isFunction(fn) ? fn() : path);
};

export const getDotPaths = (object: object, excludeKeys?: any[], prefix = '') =>
  Object.entries(object).flatMap(([key, value]) => {
    if (excludeKeys?.includes(key)) return [];

    const path = prefix ? `${prefix}.${key}` : key;

    return _.isPlainObject(value)
      ? getDotPaths(value, excludeKeys, path)
      : path;
  });
