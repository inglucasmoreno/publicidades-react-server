import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res, UseGuards, Headers, Patch } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('productos')
export class ProductosController {

  constructor(private readonly productosService: ProductosService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getIdProducto(@Res() res, @Param('id') id: number): Promise<any> {

    const producto = await this.productosService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Producto obtenido correctamente',
      producto
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAllProductos(@Res() res, @Query() query): Promise<any> {
    console.log(query);
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
  async insertProducto(
    @Res() res,
    @Body() createData: Prisma.ProductosCreateInput,
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
  async updateProducto(@Res() res, @Param('id') id: number, @Body() updateData:Prisma.ProductosUpdateInput): Promise<any> {

    const producto = await this.productosService.update(id, updateData);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Producto actualizado correctamente',
      producto
    })

  }

}
