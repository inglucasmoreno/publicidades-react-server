import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, SubseccionesProductos } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class SubseccionesProductosService {

  constructor(private prisma: PrismaService) { }

  // Producto por ID
  async getId(id: number): Promise<SubseccionesProductos> {
    const producto = await this.prisma.subseccionesProductos.findFirst({
      where: { id },
      include: { 
        subseccion: true,
        producto: true,
        creatorUser: true 
      },
    })
    if (!producto) throw new NotFoundException('El producto no existe');
    return producto;
  }

  // Listar productos
  async getAll({
    columna = 'createdAt',
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

    const productos = await this.prisma.subseccionesProductos.findMany({
      include: { 
        subseccion: true,
        producto: true,
        creatorUser: true
      },
      orderBy: { createdAt: 'desc' }
    })

    return {
      productos,
      totalItems: productos.length
    };

  }

  // Crear producto
  async insert(createData: Prisma.SubseccionesProductosCreateInput): Promise<SubseccionesProductos> {
    return await this.prisma.subseccionesProductos.create({ data: createData })
  }

  // Actualizar producto
  async update(id: number, updateData: Prisma.SubseccionesProductosUpdateInput): Promise<any> {


    const productoDB = await this.prisma.subseccionesProductos.findFirst({ where: { id } });

    // Verificacion: El producto no existe
    if (!productoDB) throw new NotFoundException('El producto no existe');

    return await this.prisma.subseccionesProductos.update({ 
      where: { id }, 
      data: updateData, 
      include: { 
        subseccion: true,
        producto: true,
        creatorUser: true 
      } 
    });

  }

}
