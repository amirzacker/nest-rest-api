import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('API multiweb services ')
    .setDescription(
      `Il s'agit d'une multiweb services API qui permet d'avoir toutes les informations sur les services de multiweb`,
    )
    .setVersion('1.0')
    .addTag('multiweb')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
