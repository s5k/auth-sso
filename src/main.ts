import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { environments } from './environments/environments';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();
  app.enableShutdownHooks();
  app.set('trust proxy', environments.proxyEnabled);
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  const port = environments.port;
  const logger = new Logger('NestApplication');

  await app.listen(port, () =>
    logger.log(`Server initialized on port ${port}`),
  );
}

bootstrap();
