import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PublicidadesProductos } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

const includeRelaciones = {
  producto: {
    include: { 
      unidadMedida: true
    }
  },
  publicidad: true,
  imagen: true,
  creatorUser: true
}

@Injectable()
export class PublicidadesProductosService {

  constructor(private prisma: PrismaService) { }

  // Relacion por ID
  async getId(id: number): Promise<PublicidadesProductos> {
    const relacion = await this.prisma.publicidadesProductos.findFirst({
      where: { id },
      include: includeRelaciones
    })
    if (!relacion) throw new NotFoundException('La relacion no existe');
    return relacion;
  }

  // Listar relaciones
  async getAll({
    publicidad,
    columna = 'id',
    direccion = 1,
    activo,
    parametro = '',
    desde = 0,
    cantidadItems = 100000
  }: any): Promise<any> {

    // // Ordenando datos
    // let order = {};
    // order[columna] = Number(direccion);

    // // Filtrando datos
    // let where = [];
    // let campos = ['comentarios'];

    // campos.forEach(campo => {
    //   const filtro = {};
    //   filtro[campo] = Like('%' + parametro.toUpperCase() + '%');
    //   if (activo.trim() !== '') filtro['activo'] = activo === 'true' ? true : false;
    //   where.push(filtro)
    // })

    // Filter
    let where = { 
      publicidadId: publicidad ? Number(publicidad) : undefined,
      activo: (activo === 'true' ? true : activo === 'false' ? false : undefined) 
    };
    
    if(publicidad) where = { 
      publicidadId: Number(publicidad), 
      activo: (activo === 'true' ? true : activo === 'false' ? false : undefined)
    }

    // const totalItems = await this.publicacionesProductosRepository.count({ where });

    const relaciones = await this.prisma.publicidadesProductos.findMany({
      include: includeRelaciones,
      orderBy: { peso: 'desc' },
      where
    })

    return {
      relaciones,
      totalItems: relaciones.length
    };

  }

  // Crear relacion
  async insert(createData: Prisma.PublicidadesProductosCreateInput): Promise<PublicidadesProductos> {
    createData.comentarios = createData.comentarios?.toUpperCase().trim();
    return await this.prisma.publicidadesProductos.create({
      data: createData,
      include: includeRelaciones
    })
  }

  // Crear relaciones - Multiples
  async insertMulti(createData: any): Promise<string> {

    const { productos } = createData;

    productos.map(async producto => {
      await this.prisma.publicidadesProductos.create({
        data: producto  
      })
    })

    return 'Productos cargados correctamente';

  }


  // Actualizar relacion
  async update(id: number, updateData: Prisma.PublicidadesProductosUpdateInput): Promise<any> {

    updateData.comentarios = updateData.comentarios?.toString().toUpperCase().trim();

    const relacionDB = await this.prisma.publicidadesProductos.findFirst({
      where: { id }
    })

    // Verificacion: La relacion no existe
    if (!relacionDB) throw new NotFoundException('La relacion no existe');

    return await this.prisma.publicidadesProductos.update({ where: { id }, data: updateData, include: includeRelaciones })

  }

  // Eliminar relacion
  async delete(id: number): Promise<any> {

    const relacionDB = await this.prisma.publicidadesProductos.findFirst({ where: { id } });

    // Verificacion: La relacion no existe
    if (!relacionDB) throw new NotFoundException('La relacion no existe');

    await this.prisma.publicidadesProductos.delete({ where: { id } })
   
    return 'Relacion eliminada correctamente';

  }

}
