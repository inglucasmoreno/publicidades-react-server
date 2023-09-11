import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query, Headers, Res, UseGuards } from '@nestjs/common';
import { PublicidadesService } from './publicidades.service';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('publicaciones')
export class PublicidadesController {

  constructor(private readonly publicidadesService: PublicidadesService) { }

  // @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getIdPublicidad(@Res() res, @Param('id') id: number): Promise<any> {

    const publicidad = await this.publicidadesService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Publicidad obtenida correctamente',
      publicidad
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAllPublicidades(@Res() res, @Query() query): Promise<any> {
    const { publicidades, totalItems } = await this.publicidadesService.getAll(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Publicidades obtenidas correctamente',
      publicidades,
      totalItems
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createPublicidad(
    @Res() res, 
    @Body() createData: Prisma.PublicidadesCreateInput,
    @Headers('userLogin') userLogin: any
    ): Promise<any> {

    const data = {
      ...createData,
      creatorUserId: Number(userLogin),
    }

    const publicidad = await this.publicidadesService.insert(data);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Publicidad creada correctamente',
      publicidad
    })

  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updatePublicidad(@Res() res, @Param('id') id: number, @Body() updateData: Prisma.PublicidadesUpdateInput): Promise<any> {

    const publicidad = await this.publicidadesService.update(id, updateData);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Publicidad actualizada correctamente',
      publicidad
    })

  }

}
