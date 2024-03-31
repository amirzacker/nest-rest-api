import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Gestionnaire de liste de courses')
    .setDescription(
      `Il s’agit d’une application qui gérera une liste de course et votre caddie de course.

L’application devra dans un premier temps gérer la liste des courses (nom produit et sa quantité), affichage, ajout et suppression.

Dans un deuxième temps, la gestion du caddie sera à prendre en compte.

- Demander à l’utilisateur un choix pour telle ou telle fonctionnalité et avoir un moyen de sortir de l’application.
- Les produits du caddie seront représenté par une paire clé valeur (nom produit, prix).
- Dès qu’un produit est positionné dans le caddie, il sera automatiquement archivé de la liste (liste qui dit que les produits ont été pris).
- Afficher la liste des produits le caddie.
- Afficher un produit qui reste dans la liste.
- Enlever le produit du caddie, donc automatiquement le produit se retrouve sur la liste. (optionnel)`,
    )
    .setVersion('1.0')
    .addTag('Liste de courses')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
