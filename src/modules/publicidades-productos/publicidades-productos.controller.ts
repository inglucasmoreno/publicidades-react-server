import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, Headers, Res, UseGuards } from '@nestjs/common';
import { PublicidadesProductosService } from './publicidades-productos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('publicidades-productos')
export class PublicidadesProductosController {

  constructor(private readonly relacionesService: PublicidadesProductosService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getIdRelacion(@Res() res, @Param('id') id: number): Promise<any> {

    const relacion = await this.relacionesService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Relacion obtenida correctamente',
      relacion
    })

  }

  // @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAllRelaciones(@Res() res, @Query() query): Promise<any> {
    const { relaciones, totalItems } = await this.relacionesService.getAll(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Relaciones obtenidas correctamente',
      relaciones,
      totalItems
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createRelacion(
    @Res() res, 
    @Body() createData: Prisma.PublicidadesProductosCreateInput,
    @Headers('userLogin') userLogin: any
    ): Promise<any> {

    const data = {
      ...createData,
      creatorUserId: Number(userLogin),
    }

    const relacion = await this.relacionesService.insert(data);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Relacion creada correctamente',
      relacion
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post('/multi')
  async createMultiPublicaciones(
    @Res() res, 
    @Body() createData: Prisma.PublicidadesProductosCreateInput,
    @Headers('userLogin') userLogin: any
    ): Promise<any> {

    const data = {
      ...createData,
      creatorUserId: Number(userLogin),
    }

    const relaciones = await this.relacionesService.insertMulti(data);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Relaciones creadas correctamente',
      relaciones
    })

  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateData(@Res() res, @Param('id') id: number, @Body() updateData: Prisma.PublicidadesProductosCreateInput): Promise<any> {

    const relacion = await this.relacionesService.update(id, updateData);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Relacion actualizada correctamente',
      relacion
    })

  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteRelacion(@Res() res, @Param('id') id: number): Promise<any> {

    await this.relacionesService.delete(id);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Relacion eliminada correctamente',
    })

  }



}
