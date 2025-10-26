import { allFakers, allLocales, faker, type Faker } from "@faker-js/faker";
import devalue from "devalue";
import _ from "lodash";
import mapObject from "map-obj";

export type Locale = keyof typeof allLocales;
export type Locales = Locale[];
export type Template = object;

export const version = "10.1.0";
export const mapObjectDeep = _.partialRight(mapObject, { deep: true });

export const excludeKeys = [
  "faker", // self reference

  // https://github.com/faker-js/faker/blob/f81abc77a34d8a2016f06b73ed859fef44446c2d/test/all-functional.spec.ts#L6
  "rawDefinitions",
  "definitions",
  "helpers",
  // "_randomizer",
  // "_defaultRefDate",
];

export const supportedLocales = _.union(
  ["en", "vi"] satisfies Locales,
  Object.keys(allLocales)
) as Locales;

export const stringify = (value: Parameters<typeof devalue.stringify>[0]) =>
  typeof value === "bigint" ? devalue.stringify(value) : value;

export const safeInvoke = (value: any) => {
  let result: any;
  const isFunction = _.isFunction(value);

  if (isFunction)
    try {
      result = value();
    } catch {
      result = `Function [${value.name}] requires arguments`;
    }

  return result;
};

export const getFaker = Object.assign(
  (locale: Locale): Faker => allFakers[locale] ?? faker,
  {
    resolve: (faker: Faker, path: Parameters<typeof _.get>[1]) =>
      stringify(safeInvoke(_.get(faker, path)) ?? path),
  }
);

export const getDotPaths = (object: object, excludeKeys?: any[], prefix = "") =>
  Object.entries(object).flatMap(([key, value]) => {
    if (excludeKeys?.includes(key)) return [];

    const path = prefix ? `${prefix}.${key}` : key;

    return _.isPlainObject(value)
      ? getDotPaths(value, excludeKeys, path)
      : path;
  });
