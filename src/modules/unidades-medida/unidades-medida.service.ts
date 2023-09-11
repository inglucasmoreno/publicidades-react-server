import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, UnidadesMedida } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UnidadesMedidaService {

  constructor(private prisma: PrismaService) { }

  // Unidad por ID
  async getId(id: number): Promise<UnidadesMedida> {
    const unidad = await this.prisma.unidadesMedida.findFirst({
      where: { id },
      include: { creatorUser: true },
    })
    if (!unidad) throw new NotFoundException('La unidad no existe');
    return unidad;
  }

  // Listar unidades
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

    const unidades = await this.prisma.unidadesMedida.findMany({
      include: { creatorUser: true },
      orderBy: { descripcion: 'asc' }
    })

    return {
      unidades,
      totalItems: unidades.length
    };

  }

  // Crear unidad
  async insert(createData: Prisma.UnidadesMedidaCreateInput): Promise<UnidadesMedida> {

    // Uppercase y Lowercase
    createData.descripcion = createData.descripcion?.toLocaleUpperCase().trim();

    const { descripcion } = createData;

    // Verificacion: unidad de medida repetida
    if (descripcion !== '') {
      let unidadDB = await this.prisma.unidadesMedida.findFirst({ where: { descripcion } });
      if (unidadDB) throw new NotFoundException('La descripción ya fue cargada');
    }

    return await this.prisma.unidadesMedida.create({ data: createData })

  }

  // Actualizar unidad de medida
  async update(id: number, updateData: Prisma.UnidadesMedidaUpdateInput): Promise<any> {

    const { descripcion } = updateData;

    const unidadDB = await this.prisma.unidadesMedida.findFirst({ where: { id } });

    // Verificacion: La unidad no existe
    if (!unidadDB) throw new NotFoundException('La unidad no existe');

    // Verificacion: Descripcion repetida
    if (descripcion) {
      const descripcionRepetida = await this.prisma.unidadesMedida.findFirst({ where: { descripcion: descripcion.toString().toLocaleUpperCase().trim() } })
      if (descripcionRepetida && descripcionRepetida.id !== id) throw new NotFoundException('La descripción ya se encuentra cargada');
    }

    updateData.descripcion = descripcion?.toString().toLocaleUpperCase().trim();

    return await this.prisma.unidadesMedida.update({ 
      where: { id }, 
      data: updateData, 
      include: { creatorUser: true } 
    });

  }

}
