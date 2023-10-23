import { Body, Controller, Get, HttpStatus, Param, Post, Query, Headers, Res, UseGuards, Patch } from '@nestjs/common';
import { SeccionesSubseccionesService } from './secciones-subsecciones.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('secciones-subsecciones')
export class SeccionesSubseccionesController {

  constructor(private readonly subseccionesService: SeccionesSubseccionesService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async subseccionPorId(@Res() res, @Param('id') id: number): Promise<any> {

    const subseccion = await this.subseccionesService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Subseccion obtenida correctamente',
      subseccion
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async listarSubsecciones(@Res() res, @Query() query): Promise<any> {
    const { subsecciones, totalItems } = await this.subseccionesService.getAll(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Subsecciones obtenidas correctamente',
      subsecciones,
      totalItems
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async nuevaSubseccion(
    @Res() res,
    @Body() createData: Prisma.SeccionesSubseccionesCreateInput,
    @Headers('userLogin') userLogin: any
  ): Promise<any> {

    const data = {
      ...createData,
      creatorUserId: Number(userLogin),
    }

    const subseccion = await this.subseccionesService.insert(data);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Subseccion creada correctamente',
      subseccion
    })

  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async actualizarSubseccion(@Res() res, @Param('id') id: number, @Body() updateData:Prisma.SeccionesSubseccionesUpdateInput): Promise<any> {

    const subseccion = await this.subseccionesService.update(id, updateData);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Subseccion actualizada correctamente',
      subseccion
    })

  }

}
