import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, SeccionesSubsecciones } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SeccionesSubseccionesService {

  constructor(private prisma: PrismaService) { }

  // Subseccion por ID
  async getId(id: number): Promise<SeccionesSubsecciones> {
    const subseccion = await this.prisma.seccionesSubsecciones.findFirst({
      where: { id },
      include: { 
        seccion: true,
        creatorUser: true 
      },
    })
    if (!subseccion) throw new NotFoundException('La subseccion no existe');
    return subseccion;
  }

  // Listar subsecciones
  async getAll({
    columna = 'descripcion',
    direccion = 1,
    activo = '',
    parametro = '',
    desde = 0,
    cantidadItems = 100000
  }: any): Promise<any> {

    // Ordenando datos
    let order = {};
    order[columna] = Number(direccion);

    // Filtrando datos
    let where = [];
    let campos = ['descripcion'];

    // campos.forEach(campo => {
    //   const filtro = {};
    //   filtro[campo] = Like('%' + parametro.toUpperCase() + '%');
    //   if (activo.trim() !== '') filtro['activo'] = activo === 'true' ? true : false;
    //   where.push(filtro)
    // })

    // const totalItems = await this.unidadesMedidaRepository.count({ where });

    // const unidades = await this.unidadesMedidaRepository
    //   .find({
    //     relations: ['creatorUser', 'updatorUser'],
    //     order,
    //     skip: Number(desde),
    //     take: Number(cantidadItems),
    //     where
    //   });

    const subsecciones = await this.prisma.seccionesSubsecciones.findMany({
      include: { 
        seccion: true,
        creatorUser: true
      },
      orderBy: { descripcion: 'asc' }
    })

    return {
      subsecciones,
      totalItems: subsecciones.length
    };

  }

  // Crear subseccion
  async insert(createData: Prisma.SeccionesSubseccionesCreateInput): Promise<SeccionesSubsecciones> {

    // Uppercase y Lowercase
    createData.descripcion = createData.descripcion?.toLocaleUpperCase().trim();

    const { descripcion } = createData;

    // Verificacion: Seccion repetida
    if (descripcion !== '') {
      let subseccionDB = await this.prisma.seccionesSubsecciones.findFirst({ where: { descripcion } });
      if (subseccionDB) throw new NotFoundException('La subseccion ya fue cargada');
    }

    return await this.prisma.seccionesSubsecciones.create({ data: createData })

  }

  // Actualizar subseccion
  async update(id: number, updateData: Prisma.SeccionesSubseccionesUpdateInput): Promise<any> {

    const { descripcion } = updateData;

    const subseccionDB = await this.prisma.seccionesSubsecciones.findFirst({ where: { id } });

    // Verificacion: La seccion no existe
    if (!subseccionDB) throw new NotFoundException('La subseccion no existe');

    // Verificacion: Descripcion repetida
    if (descripcion) {
      const descripcionRepetida = await this.prisma.seccionesSubsecciones.findFirst({ where: { descripcion: descripcion.toString().toLocaleUpperCase().trim() } })
      if (descripcionRepetida && descripcionRepetida.id !== id) throw new NotFoundException('La descripción ya se encuentra cargada');
    }

    updateData.descripcion = descripcion?.toString().toLocaleUpperCase().trim();

    return await this.prisma.seccionesSubsecciones.update({ 
      where: { id }, 
      data: updateData, 
      include: { 
        seccion: true,
        creatorUser: true 
      } 
    });

  }

}
