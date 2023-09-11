import { Controller, Get, Post, Body, Patch, Param, UseGuards, Res, HttpStatus, Query, Headers } from '@nestjs/common';
import { UnidadesMedidaService } from './unidades-medida.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UnidadesMedida, Prisma } from '@prisma/client';

@Controller('unidades-medida')
export class UnidadesMedidaController {
  
  constructor(private readonly unidadesMedidaService: UnidadesMedidaService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async unidadPorId(@Res() res, @Param('id') id: number): Promise<any> {

    const unidad = await this.unidadesMedidaService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Unidad obtenido correctamente',
      unidad
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async listarUnidades(@Res() res, @Query() query): Promise<any> {
    const { unidades, totalItems } = await this.unidadesMedidaService.getAll(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Unidades obtenidas correctamente',
      unidades,
      totalItems
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async nuevaUnidad(
    @Res() res,
    @Body() createData: Prisma.UnidadesMedidaCreateInput,
    @Headers('userLogin') userLogin: any
  ): Promise<any> {

    const data = {
      ...createData,
      creatorUserId: Number(userLogin),
    }

    const unidad = await this.unidadesMedidaService.insert(data);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Unidad creada correctamente',
      unidad
    })

  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async actualizarUnidad(@Res() res, @Param('id') id: number, @Body() updateData:Prisma.UnidadesMedidaUpdateInput): Promise<any> {

    const unidad = await this.unidadesMedidaService.update(id, updateData);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Unidad actualizada correctamente',
      unidad
    })

  }

}
