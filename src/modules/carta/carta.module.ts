import { Module } from '@nestjs/common';
import { CartaController } from './carta.controller';

@Module({
  controllers: [CartaController]
})
export class CartaModule {}
