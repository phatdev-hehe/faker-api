import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { parse } from "qs";
import { AppModule } from "./app.module";
import { version } from "./shared";

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.getHttpAdapter().getInstance().set("query parser", parse);

  SwaggerModule.setup("", app, () =>
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle("Faker API")
        .setDescription("[GitHub](https://github.com/phatdev-hehe/faker-api)")
        .setVersion(version)
        .setLicense("fakerjs.dev API", "https://fakerjs.dev/api")
        .setExternalDoc("ljharb/qs", "https://github.com/ljharb/qs")
        .build()
    )
  );

  await app.listen(3000);
};

bootstrap();
