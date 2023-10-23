import { Module } from '@nestjs/common';
import { SubseccionesProductosController } from './subsecciones-productos.controller';
import { SubseccionesProductosService } from './subsecciones-productos.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SubseccionesProductosController],
  providers: [SubseccionesProductosService, PrismaService]
})
export class SubseccionesProductosModule {}
