import { Module } from '@nestjs/common';
import { UnidadesMedidaService } from './unidades-medida.service';
import { UnidadesMedidaController } from './unidades-medida.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  imports: [],
  providers: [UnidadesMedidaService, PrismaService],
  controllers: [UnidadesMedidaController],
  exports: [UnidadesMedidaService]
})
export class UnidadesMedidaModule {}
