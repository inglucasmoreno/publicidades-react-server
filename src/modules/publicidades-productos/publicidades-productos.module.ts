import { Module } from '@nestjs/common';
import { PublicidadesProductosController } from './publicidades-productos.controller';
import { PublicidadesProductosService } from './publicidades-productos.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PublicidadesProductosController],
  providers: [PublicidadesProductosService, PrismaService]
})
export class PublicidadesProductosModule {}
