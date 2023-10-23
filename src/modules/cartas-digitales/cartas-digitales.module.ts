import { Module } from '@nestjs/common';
import { CartasDigitalesController } from './cartas-digitales.controller';
import { CartasDigitalesService } from './cartas-digitales.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [CartasDigitalesController],
  providers: [CartasDigitalesService, PrismaService]
})
export class CartasDigitalesModule {}
