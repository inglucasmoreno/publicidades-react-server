import { Module } from '@nestjs/common';
import { PublicidadesController } from './publicidades.controller';
import { PublicidadesService } from './publicidades.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PublicidadesController],
  providers: [PublicidadesService, PrismaService]
})
export class PublicidadesModule {}
