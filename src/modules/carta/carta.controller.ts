import { Body, Controller, HttpStatus, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('carta')
export class CartaController {

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor(
      'file',
      {
        storage: diskStorage({
          destination: process.env.URL_PDF,
          filename: function (req, file, cb) {
            const stringSplit = file.mimetype.split('/');
            const ext = stringSplit[stringSplit.length - 1];
            cb(null, 'VeneziaPanaderia.pdf');
          }
        })
      }
    )
  )
  @Post('/')
  async subirCarta(
    @UploadedFile() file: Express.Multer.File,
    @Res() res): Promise<any> {

    console.log()

    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'Carta actualizada correctamente',
    })

  }

}
