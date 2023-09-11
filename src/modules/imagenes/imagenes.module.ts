import { Module } from '@nestjs/common';
import { ImagenesController } from './imagenes.controller';
import { ImagenesService } from './imagenes.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [ImagenesController],
  providers: [ImagenesService, PrismaService]
})
export class ImagenesModule {}
