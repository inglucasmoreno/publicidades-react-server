import { Body, Controller, Get, HttpStatus, Param, Post, Headers, Query, Res, UseGuards, Patch } from '@nestjs/common';
import { CartasSeccionesService } from './cartas-secciones.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('cartas-secciones')
export class CartasSeccionesController {

  constructor(private readonly cartasSeccionesService: CartasSeccionesService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async seccionPorId(@Res() res, @Param('id') id: number): Promise<any> {

    const seccion = await this.cartasSeccionesService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Seccion obtenida correctamente',
      seccion
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async listarSecciones(@Res() res, @Query() query): Promise<any> {
    const { secciones, totalItems } = await this.cartasSeccionesService.getAll(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Secciones obtenidas correctamente',
      secciones,
      totalItems
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async nuevaSeccion(
    @Res() res,
    @Body() createData: Prisma.CartasSeccionesCreateInput,
    @Headers('userLogin') userLogin: any
  ): Promise<any> {

    const data = {
      ...createData,
      creatorUserId: Number(userLogin),
    }

    const seccion = await this.cartasSeccionesService.insert(data);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Seccion creada correctamente',
      seccion
    })

  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async actualizarSeccion(@Res() res, @Param('id') id: number, @Body() updateData:Prisma.CartasSeccionesUpdateInput): Promise<any> {

    const seccion = await this.cartasSeccionesService.update(id, updateData);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Seccion actualizada correctamente',
      seccion
    })

  }

}
