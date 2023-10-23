import { Body, Controller, Get, HttpStatus, Param, Post, Query, Headers, Res, UseGuards, Patch } from '@nestjs/common';
import { SubseccionesProductosService } from './subsecciones-productos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('subsecciones-productos')
export class SubseccionesProductosController {

  constructor(private readonly productosService: SubseccionesProductosService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async productoPorId(@Res() res, @Param('id') id: number): Promise<any> {

    const producto = await this.productosService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Producto obtenido correctamente',
      producto
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async listarProductos(@Res() res, @Query() query): Promise<any> {
    const { productos, totalItems } = await this.productosService.getAll(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Productos obtenidos correctamente',
      productos,
      totalItems
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async nuevoProducto(
    @Res() res,
    @Body() createData: Prisma.SubseccionesProductosCreateInput,
    @Headers('userLogin') userLogin: any
  ): Promise<any> {

    const data = {
      ...createData,
      creatorUserId: Number(userLogin),
    }

    const producto = await this.productosService.insert(data);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Producto creado correctamente',
      producto
    })

  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async actualizarProducto(@Res() res, @Param('id') id: number, @Body() updateData:Prisma.SubseccionesProductosUpdateInput): Promise<any> {

    const producto = await this.productosService.update(id, updateData);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Producto actualizado correctamente',
      producto
    })

  }

}
