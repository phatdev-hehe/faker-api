import { type Faker } from "@faker-js/faker";
import { Controller, Get, Param, ParseIntPipe, Query } from "@nestjs/common";
import { ApiParam, ApiQuery } from "@nestjs/swagger";
import _ from "lodash";
import { mapObjectSkip } from "map-obj";
import {
  excludeKeys,
  getFaker,
  mapObjectDeep,
  safeInvoke,
  stringify,
  supportedLocales,
  type Locale,
  type Locales,
  type Template,
} from "./shared";

@Controller()
export class AppController {
  @Get("locales") getLocales(): Locales {
    return supportedLocales;
  }

  @Get("locale/:locale")
  @ApiParam({
    name: "locale",
    enum: supportedLocales,
  })
  getLocale(@Param("locale") locale: Locale) {
    const resolveFakerValues = (faker: Faker | any) =>
      mapObjectDeep(faker, (key, value) => {
        if (excludeKeys.includes(key)) return mapObjectSkip;
        if (_.isPlainObject(value)) return [key, resolveFakerValues(value)];

        return [key, stringify(safeInvoke(value) ?? value)];
      });

    return resolveFakerValues(getFaker(locale));
  }

  @Get("api/:locale/:path")
  @ApiParam({
    name: "locale",
    enum: supportedLocales,
  })
  @ApiParam({
    name: "path",
    example: "color.human",
  })
  getAPI(@Param("locale") locale: Locale, @Param("path") path: string) {
    return getFaker.resolve(getFaker(locale), path);
  }

  @Get("template/:locale/:count")
  @ApiParam({
    name: "locale",
    enum: supportedLocales,
  })
  @ApiParam({
    name: "count",
    example: 100,
  })
  @ApiQuery({
    name: "account[device][ipv6]",
    example: "internet.ipv6",
  })
  @ApiQuery({
    name: "account[device][ipv4]",
    example: "internet.ipv4",
  })
  @ApiQuery({
    name: "account[device][userAgent]",
    example: "internet.userAgent",
  })
  @ApiQuery({
    name: "account[lastLogin]",
    example: "date.recent",
  })
  @ApiQuery({
    name: "account[password]",
    example: "internet.password",
  })
  @ApiQuery({
    name: "account[username]",
    example: "internet.username",
  })
  @ApiQuery({
    name: "language",
    example: "location.language",
  })
  @ApiQuery({
    name: "favorite[animalType]",
    example: "animal.type",
  })
  @ApiQuery({
    name: "favorite[book]",
    example: "book.title",
  })
  @ApiQuery({
    name: "favorite[country]",
    example: "location.country",
  })
  @ApiQuery({
    name: "favorite[vehicleManufacturer]",
    example: "vehicle.manufacturer",
  })
  @ApiQuery({
    name: "favorite[songName]",
    example: "music.songName",
  })
  @ApiQuery({
    name: "favorite[color]",
    example: "color.human",
  })
  @ApiQuery({
    name: "jobTitle",
    example: "person.jobTitle",
  })
  @ApiQuery({
    name: "contact[streetAddress]",
    example: "location.streetAddress",
  })
  @ApiQuery({
    name: "contact[phone]",
    example: "phone.number",
  })
  @ApiQuery({
    name: "personal[avatar]",
    example: "image.avatar",
  })
  @ApiQuery({
    name: "personal[bio]",
    example: "person.bio",
  })
  @ApiQuery({
    name: "personal[birthdate]",
    example: "date.birthdate",
  })
  @ApiQuery({
    name: "personal[sex]",
    example: "person.sex",
  })
  @ApiQuery({
    name: "personal[fullName]",
    example: "person.fullName",
  })
  @ApiQuery({
    name: "id",
    example: "database.mongodbObjectId",
  })
  getTemplate(
    @Param("locale") locale: Locale,
    @Param("count", ParseIntPipe) count: number,
    @Query() template: Template
  ) {
    const faker = getFaker(locale);

    const fillTemplate = (template: Template): Template =>
      _.mapValues(template, (value) => {
        if (_.isPlainObject(value)) return fillTemplate(value);

        return getFaker.resolve(faker, value);
      });

    return Array.from({ length: count }).map(() => fillTemplate(template));
  }

  @Get("fake/:locale/:pattern")
  @ApiParam({
    name: "locale",
    enum: supportedLocales,
  })
  @ApiParam({
    name: "pattern",
    example: "Hi, my name is {{person.firstName}} {{person.lastName}}!",
  })
  getFake(@Param("locale") locale: Locale, @Param("pattern") pattern: string) {
    return getFaker(locale).helpers.fake(pattern);
  }

  @Get("definitions/:locale")
  @ApiParam({
    name: "locale",
    enum: supportedLocales,
  })
  getDefinitions(@Param("locale") locale: Locale) {
    const faker = getFaker(locale);

    faker.definitions; // ??
  }
}
