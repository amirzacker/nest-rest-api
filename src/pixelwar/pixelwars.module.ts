import { Module } from '@nestjs/common';
import { PixelWarsGateway } from './pixelwars.gateway';
import { PixelWarsService } from './pixelwars.service';

@Module({
  providers: [PixelWarsGateway, PixelWarsService],
})
export class PixelWarsModule {}
