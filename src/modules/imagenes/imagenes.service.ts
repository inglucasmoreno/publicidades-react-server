import { Injectable, NotFoundException } from '@nestjs/common';
import { Imagenes, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import * as fs from 'fs';
import sharp from 'sharp';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ImagenesService {

  public urlImagenes = 'public/uploads/imagenes';

  constructor(private prisma: PrismaService) { }

  // Imagen por ID
  async getId(id: number): Promise<Imagenes> {
    const imagen = await this.prisma.imagenes.findFirst({ where: { id }, include: { creatorUser: true } })
    if (!imagen) throw new NotFoundException('La imagen no existe');
    return imagen;
  }

  // Listar imagenes
  async getAll({
    columna = 'descripcion',
    direccion = 1,
    activo = '',
    parametro = '',
    desde = 0,
    cantidadItems = 100000
  }: any): Promise<any> {

    // // Ordenando datos
    // let order = {};
    // order[columna] = Number(direccion);

    // // Filtrando datos
    // let where = [];
    // let campos = ['descripcion'];

    // campos.forEach(campo => {
    //   const filtro = {};
    //   filtro[campo] = Like('%' + parametro.toUpperCase() + '%');
    //   if (activo.trim() !== '') filtro['activo'] = activo === 'true' ? true : false;
    //   where.push(filtro)
    // })

    // const totalItems = await this.imagenesRepository.count({ where });

    const imagenes = await this.prisma.imagenes.findMany({
      include: { creatorUser: true },
      orderBy: { descripcion: 'asc' }
    })

    return {
      imagenes,
      totalItems: imagenes.length
    };

  }

  // Crear imagen
  async insert(createData: Prisma.ImagenesCreateInput, file: Express.Multer.File): Promise<Imagenes> {

    // Uppercase y Lowercase
    createData.descripcion = createData.descripcion?.toLocaleUpperCase().trim();

    const { descripcion } = createData;
    
    // Verificacion: Envio de descripcion
    if (descripcion === '') throw new NotFoundException('Se debe enviar una descripcion');

    // Verificacion: Imagen repetida
    let imagenDB = await this.prisma.imagenes.findFirst({ where: { descripcion } });
    if (imagenDB) throw new NotFoundException('La imagen ya se encuentra cargada');

    // if (imagenDB) {
    //   fs.unlink(`${this.urlImagenes}/${createData.url}`, (error) => {
    //     if(error){
    //       console.error('Error al eliminar el archivo:', error);
    //     }else{
    //       console.error('Archivo eliminado correctamente:', error);
    //     }
    //   })
    //   throw new NotFoundException('La descripción ya fue cargada');
    // }

    try{
    
      // Nombre de archivo
      const filename = `${uuid()}.webp`;
      createData.url = filename;
  
      // Realiza la conversión a WebP utilizando sharp
      const outputBuffer = await sharp(file.buffer).webp().toBuffer();
      
      // Guarda la imagen WebP en el sistema de archivos
      const outputPath = `${process.env.URL_IMAGE}${filename}`;
      fs.writeFileSync(outputPath, outputBuffer);
    
    }catch(error){
      throw new NotFoundException(error);
    }

    return await this.prisma.imagenes.create({
      data: createData
    })

  }

  // Actualizar imagen
  async update(id: number, updateData: Prisma.ImagenesUpdateInput): Promise<any> {

    const { descripcion } = updateData;

    const imagenDB = await this.prisma.imagenes.findFirst({ where: { id } });

    // Verificacion: La imagen no existe
    if (!imagenDB) throw new NotFoundException('La imagen no existe');

    // Verificacion: Descripcion repetida
    if (descripcion) {
      const descripcionRepetida = await this.prisma.imagenes.findFirst({ where: { descripcion: descripcion.toString().toLocaleUpperCase().trim() } })
      if (descripcionRepetida && descripcionRepetida.id !== id) throw new NotFoundException('La descripción ya se encuentra cargada');
    }

    updateData.descripcion = descripcion?.toString().toLocaleUpperCase().trim();

    return await this.prisma.imagenes.update({ where: { id }, data: updateData, include: { creatorUser: true } });

  }

  // Eliminar imagen
  async delete(id: number): Promise<any> {

    // Verificacion: Existencia de imagen
    const imagenDB: any = await this.prisma.imagenes.findFirst({ where: { id } });
    if (!imagenDB) throw new NotFoundException('La imagen no existe');

    // Verificacion: Relacion con publicacion
    const publicacionesProductosDB = await this.prisma.publicidadesProductos.findFirst({ where: { imagenId: id }, include: { publicidad: true } });
    if (publicacionesProductosDB) throw new NotFoundException(`La imagen esta vinculada con una publicidad`);

    fs.unlink(`${process.env.URL_IMAGE}${imagenDB.url}`, async (error) => {
      if (error) {
        console.error('Error al eliminar el archivo:', error);
        throw new NotFoundException('Error al eliminar la imagen');
      } else {
        console.error('Archivo eliminado correctamente:', error);
        await this.prisma.imagenes.delete({ where: { id } });
      }
    })

    return 'Imagen eliminada correctamente';

  }

}
