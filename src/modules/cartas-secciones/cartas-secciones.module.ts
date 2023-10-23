import { Module } from '@nestjs/common';
import { CartasSeccionesController } from './cartas-secciones.controller';
import { CartasSeccionesService } from './cartas-secciones.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CartasSeccionesController],
  providers: [CartasSeccionesService, PrismaService]
})
export class CartasSeccionesModule {}
