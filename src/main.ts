import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerModule } from '@nestjs/swagger/dist';
import { CustomLogger } from 'logger/custom.logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CustomLogger(),
    bufferLogs: true,
  });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Users JWT and Bcrypt authentication')
    .setDescription('Users JWT and Bcrypt authentication project')
    .setVersion('1.0.0')
    .addBearerAuth({
      name: 'jwt',
      description: 'JWT authentication',
      type: 'http',
      scheme: 'Bearer',
    })
    .build();

  // Swagger initialization
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
