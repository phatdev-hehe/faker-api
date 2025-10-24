import type { Faker } from '@faker-js/faker';
import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiParam, ApiQuery } from '@nestjs/swagger';
import _ from 'lodash';
import { mapObjectSkip } from 'map-obj';
import {
  excludeKeys,
  getFaker,
  getFakerValue,
  mapObjectDeep,
  serializeValue,
  supportedLocales,
  type Locale,
  type Locales,
  type Template,
} from './shared';

@Controller()
export class AppController {
  @Get('locales') getLocales(): Locales {
    return supportedLocales;
  }

  @Get('locale/:locale')
  @ApiParam({
    name: 'locale',
    enum: supportedLocales,
  })
  getLocale(@Param('locale') locale: Locale) {
    const resolveFakerValues = (faker: Faker | any) =>
      mapObjectDeep(faker, (key, value) => {
        if (_.isPlainObject(value)) value = resolveFakerValues(value);

        if (_.isFunction(value))
          try {
            value = value();
          } catch {
            value = `Function "${key}" requires arguments`;
          }

        return [key, value];
      });

    return mapObjectDeep(resolveFakerValues(getFaker(locale)), (key, value) => {
      if (excludeKeys.includes(key)) return mapObjectSkip;

      return [key, serializeValue(value)];
    });
  }

  @Get('api/:locale/:path')
  @ApiParam({
    name: 'locale',
    enum: supportedLocales,
  })
  @ApiParam({
    name: 'path',
    example: 'color.human',
  })
  getAPI(@Param('locale') locale: Locale, @Param('path') path: string) {
    return getFakerValue(getFaker(locale), path);
  }

  @Get('template/:locale/:count')
  @ApiParam({
    name: 'locale',
    enum: supportedLocales,
  })
  @ApiParam({
    name: 'count',
    example: 100,
  })
  @ApiQuery({
    name: 'ip[v6]',
    example: 'internet.ipv6',
  })
  @ApiQuery({
    name: 'ip[v4]',
    example: 'internet.ipv4',
  })
  @ApiQuery({
    name: 'account[jwt]',
    example: 'internet.jwt',
  })
  @ApiQuery({
    name: 'account[userAgent]',
    example: 'internet.userAgent',
  })
  @ApiQuery({
    name: 'account[password]',
    example: 'internet.password',
  })
  @ApiQuery({
    name: 'account[username]',
    example: 'internet.username',
  })
  @ApiQuery({
    name: 'language',
    example: 'location.language',
  })
  @ApiQuery({
    name: 'favorite[animalType]',
    example: 'animal.type',
  })
  @ApiQuery({
    name: 'favorite[book]',
    example: 'book.title',
  })
  @ApiQuery({
    name: 'favorite[country]',
    example: 'location.country',
  })
  @ApiQuery({
    name: 'favorite[vehicleManufacturer]',
    example: 'vehicle.manufacturer',
  })
  @ApiQuery({
    name: 'favorite[songName]',
    example: 'music.songName',
  })
  @ApiQuery({
    name: 'favorite[color]',
    example: 'color.human',
  })
  @ApiQuery({
    name: 'avatar',
    example: 'image.avatar',
  })
  @ApiQuery({
    name: 'jobTitle',
    example: 'person.jobTitle',
  })
  @ApiQuery({
    name: 'streetAddress',
    example: 'location.streetAddress',
  })
  @ApiQuery({
    name: 'phone',
    example: 'phone.number',
  })
  @ApiQuery({
    name: 'birthdate',
    example: 'date.birthdate',
  })
  @ApiQuery({
    name: 'sex',
    example: 'person.sex',
  })
  @ApiQuery({
    name: 'bio',
    example: 'person.bio',
  })
  @ApiQuery({
    name: 'fullName',
    example: 'person.fullName',
  })
  @ApiQuery({
    name: 'id',
    example: 'database.mongodbObjectId',
  })
  generateTemplate(
    @Param('locale') locale: Locale,
    @Param('count', ParseIntPipe) count: number,
    @Query() template: Template,
  ) {
    const faker = getFaker(locale);

    const fillTemplate = (template: Template): Template =>
      _.mapValues(template, (value) => {
        if (_.isPlainObject(value)) return fillTemplate(value);

        return getFakerValue(faker, value);
      });

    return Array.from({ length: count }).map(() => fillTemplate(template));
  }
}
