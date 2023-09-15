import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Headers, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ImagenesService } from './imagenes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { Prisma } from '@prisma/client';

@Controller('imagenes')
export class ImagenesController {

  constructor(private readonly imagenesService: ImagenesService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/:id')
  async getIdImagen(@Res() res, @Param('id') id: number): Promise<any> {

    const imagen = await this.imagenesService.getId(id);

    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Imagen obtenida correctamente',
      imagen
    })

  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAllImagenes(@Res() res, @Query() query): Promise<any> {
    const { imagenes, totalItems } = await this.imagenesService.getAll(query);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: 'Imagenes obtenidas correctamente',
      imagenes,
      totalItems
    })
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor(
      'file',
      // {
      //   storage: diskStorage({
      //     destination: './public/uploads/imagenes',
      //     filename: function (req, file, cb) {
      //       const stringSplit = file.mimetype.split('/');
      //       const ext = stringSplit[stringSplit.length - 1];
      //       cb(null, uuid() + '.' + ext);
      //     }
      //   })
      // }
    )
  )
  @Post('/')
  async createImagen(
    @UploadedFile() file: Express.Multer.File,
    @Res() res,
    @Body() createData: Prisma.ImagenesCreateInput,
    @Headers('userLogin') userLogin: any): Promise<any> {

    const data = {
      ...createData,
      creatorUserId: Number(userLogin),
    }

    const imagen = await this.imagenesService.insert(data, file);

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Imagen creado correctamente',
      imagen
    })

  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id')
  async updateImagen(@Res() res, @Param('id') id: number, @Body() updateData: Prisma.ImagenesUpdateInput): Promise<any> {

    const imagen = await this.imagenesService.update(id, updateData);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Imagen actualizado correctamente',
      imagen
    })

  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async deleteImagen(@Res() res, @Param('id') id: number) {

    await this.imagenesService.delete(id);

    res.status(HttpStatus.OK).json({
      success: true,
      message: 'Imagen eliminada correctamente',
    })

  }

}
