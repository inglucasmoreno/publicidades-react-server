import { Module } from '@nestjs/common';
import { SeccionesSubseccionesService } from './secciones-subsecciones.service';
import { SeccionesSubseccionesController } from './secciones-subsecciones.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [SeccionesSubseccionesService, PrismaService],
  controllers: [SeccionesSubseccionesController]
})
export class SeccionesSubseccionesModule {}
