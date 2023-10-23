import { Body, Controller, Get, HttpStatus, Param, Post, Query, Res, Headers, UseGuards, Patch } from '@nestjs/common';
import { CartasDigitalesService } from './cartas-digitales.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('cartas-digitales')
export class CartasDigitalesController {

  constructor(private readonly cartasDigitalesService: CartasDigitalesService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async cartaDigitalPorId(@Res() res, @Param('id') id: number): Promise<any> {

    const cartaDigital = await this.cartasDigitalesService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Carta digital obtenida correctamente',
      cartaDigital
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async listarCartasDigitales(@Res() res, @Query() query): Promise<any> {
    const { cartasDigitales, totalItems } = await this.cartasDigitalesService.getAll(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Cartas digitales obtenidas correctamente',
      cartasDigitales,
      totalItems
    })

  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async nuevaCartaDigital(
    @Res() res,
    @Body() createData: Prisma.CartasDigitalesCreateInput,
    @Headers('userLogin') userLogin: any
  ): Promise<any> {

    const data = {
      ...createData,
      creatorUserId: Number(userLogin),
    }

    const cartaDigital = await this.cartasDigitalesService.insert(data);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Carta digital creada correctamente',
      cartaDigital
    })

  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async actualizarCartaDigital(@Res() res, @Param('id') id: number, @Body() updateData:Prisma.CartasDigitalesUpdateInput): Promise<any> {

    const cartaDigital = await this.cartasDigitalesService.update(id, updateData);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Carta digital actualizada correctamente',
      cartaDigital
    })

  }

}
