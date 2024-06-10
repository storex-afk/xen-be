import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EmojiLogger } from './common/logger/logger';
import { HttpExceptionFilter } from './common/exceptions/http-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new EmojiLogger(),
  });
  app.setGlobalPrefix('api');
  app.enableCors({ origin: '*' });
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
