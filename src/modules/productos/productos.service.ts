import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, Productos } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ProductosService {

  constructor(private prisma: PrismaService) { }

  // Producto por ID
  async getId(id: number): Promise<Productos> {

    const producto = await this.prisma.productos.findFirst({
      where: { id },
      include: {
        unidadMedida: true,
        creatorUser: true
      }
    })

    if (!producto) throw new NotFoundException('El producto no existe');
    return producto;

  }

  // Listar productos
  async getAll({
    columna = 'descripcion',
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
    // let campos = ['descripcion'];

    // campos.forEach( campo => {
    //   const filtro = {};
    //   filtro[campo] = Like('%' + parametro.toUpperCase() + '%');
    //   if(activo.trim() !== '') filtro['activo'] = activo === 'true' ? true : false;
    //   where.push(filtro)
    // })

    // const totalItems = await this.productosRepository.count({where});

    let where = {};

    if(activo) where = { activo: activo === 'true' ? true : false };
    
    const productos = await this.prisma.productos.findMany({
      include: {
        unidadMedida: true,
        creatorUser: true,
      },
      orderBy: { descripcion: 'asc' },
      where
    })

    return {
      productos,
      totalItems: productos.length
    };

  }

  // Crear producto
  async insert(createData: Prisma.ProductosCreateInput): Promise<Productos> {

    // Uppercase y Lowercase
    createData.descripcion = createData.descripcion?.toLocaleUpperCase().trim();

    const { descripcion } = createData;

    // Verificacion: producto repetido
    if (descripcion !== '') {
      let productoDB = await this.prisma.productos.findFirst({ where: { descripcion } });
      if (productoDB) throw new NotFoundException('La descripción ya fue cargada');
    }

    return await this.prisma.productos.create({ data: createData, include: { unidadMedida: true, creatorUser: true } });

  }

  // Actualizar producto
  async update(id: number, updateData: Prisma.ProductosUpdateInput): Promise<Productos> {

    const { descripcion } = updateData;

    const productoDB = await this.prisma.productos.findFirst({ where: { id } });

    // Verificacion: El producto no existe
    if (!productoDB) throw new NotFoundException('El producto no existe');

    // Verificacion: Descripcion repetida
    if (descripcion) {
      const descripcionRepetida = await this.prisma.productos.findFirst({ where: { descripcion: descripcion.toString().toLocaleUpperCase().trim() } })
      if (descripcionRepetida && descripcionRepetida.id !== id) throw new NotFoundException('La descripción ya se encuentra cargada');
    }

    updateData.descripcion = descripcion?.toString().toLocaleUpperCase().trim();

    return await this.prisma.productos.update({ 
      where: { id }, 
      data: updateData,
      include: {
        unidadMedida: true,
        creatorUser: true
      }
    })

  }

}
