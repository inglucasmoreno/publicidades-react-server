import { Injectable, NotFoundException } from '@nestjs/common';
import { CartasSecciones, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CartasSeccionesService {

  constructor(private prisma: PrismaService) { }

  // Seccion por ID
  async getId(id: number): Promise<CartasSecciones> {
    const seccion = await this.prisma.cartasSecciones.findFirst({
      where: { id },
      include: { 
        cartaDigital: true,
        creatorUser: true 
      },
    })
    if (!seccion) throw new NotFoundException('La seccion no existe');
    return seccion;
  }

  // Listar secciones
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

    const secciones = await this.prisma.cartasSecciones.findMany({
      include: { 
        cartaDigital: true,
        creatorUser: true
      },
      orderBy: { descripcion: 'asc' }
    })

    return {
      secciones,
      totalItems: secciones.length
    };

  }

  // Crear seccion
  async insert(createData: Prisma.CartasSeccionesCreateInput): Promise<CartasSecciones> {

    // Uppercase y Lowercase
    createData.descripcion = createData.descripcion?.toLocaleUpperCase().trim();

    const { descripcion } = createData;

    // Verificacion: Seccion repetida
    if (descripcion !== '') {
      let seccionDB = await this.prisma.cartasSecciones.findFirst({ where: { descripcion } });
      if (seccionDB) throw new NotFoundException('La seccion ya fue cargada');
    }

    return await this.prisma.cartasSecciones.create({ data: createData })

  }

  // Actualizar seccion
  async update(id: number, updateData: Prisma.CartasSeccionesUpdateInput): Promise<any> {

    const { descripcion } = updateData;

    const cartaSeccionDB = await this.prisma.cartasSecciones.findFirst({ where: { id } });

    // Verificacion: La seccion no existe
    if (!cartaSeccionDB) throw new NotFoundException('La seccion no existe');

    // Verificacion: Descripcion repetida
    if (descripcion) {
      const descripcionRepetida = await this.prisma.cartasSecciones.findFirst({ where: { descripcion: descripcion.toString().toLocaleUpperCase().trim() } })
      if (descripcionRepetida && descripcionRepetida.id !== id) throw new NotFoundException('La descripción ya se encuentra cargada');
    }

    updateData.descripcion = descripcion?.toString().toLocaleUpperCase().trim();

    return await this.prisma.cartasSecciones.update({ 
      where: { id }, 
      data: updateData, 
      include: { 
        cartaDigital: true,
        creatorUser: true 
      } 
    });

  }

}
