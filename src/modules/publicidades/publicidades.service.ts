import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Publicidades } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

const includePublicidades = {
  publicidadesProductos: {
    include: {
      producto: {
        include: {
          unidadMedida: true
        }
      },
      imagen: true
    },
  },
}

@Injectable()
export class PublicidadesService {

  constructor(private prisma: PrismaService) { }

  // Publicidad por ID
  async getId(id: number): Promise<Publicidades> {

    const publicidad = await this.prisma.publicidades.findFirst({
      where: { id },
      include: includePublicidades
    });

    if (!publicidad) throw new NotFoundException('La publicidad no existe');

    return publicidad;

  }

  // Listar publicidades
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

    // const totalItems = await this.publicacionesRepository.count({ where });

    const publicidades = await this.prisma.publicidades.findMany({
      include: includePublicidades,
      orderBy: { descripcion: 'asc' }
    })

    return {
      publicidades,
      totalItems: publicidades.length
    };

  }

  // Crear publicidad
  async insert(createData: Prisma.PublicidadesCreateInput): Promise<Publicidades> {

    // Uppercase y Lowercase
    createData.descripcion = createData.descripcion?.toLocaleUpperCase().trim();

    const { descripcion } = createData;

    // Verificacion: publicidad repetida
    if (descripcion !== '') {
      let publicidadDB = await this.prisma.publicidades.findFirst({ where: { descripcion } })
      if (publicidadDB) throw new NotFoundException('La descripción ya fue cargada');
    }

    return await this.prisma.publicidades.create({
      data: createData,
      include: includePublicidades
    })

  }

  // Actualizar publicidad
  async update(id: number, updateData: Prisma.PublicidadesUpdateInput): Promise<any> {

    const { descripcion } = updateData;

    const publicidadDB = await this.prisma.publicidades.findFirst({ where: { id } });

    // Verificacion: La publicidad no existe
    if (!publicidadDB) throw new NotFoundException('La publicidad no existe');

    // Verificacion: Descripcion repetida
    if (descripcion) {
      const descripcionRepetida = await this.prisma.publicidades.findFirst({ where: { descripcion: descripcion.toString().toLocaleUpperCase().trim() } })
      if (descripcionRepetida && descripcionRepetida.id !== id) throw new NotFoundException('La descripción ya se encuentra cargada');
    }

    updateData.descripcion = descripcion?.toString().toLocaleUpperCase().trim();

    return await this.prisma.publicidades.update({ where: { id }, data: updateData, include: includePublicidades });

  }

}
