import { Injectable, NotFoundException } from '@nestjs/common';
import { CartasDigitales, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CartasDigitalesService {

  constructor(private prisma: PrismaService) { }

  // Carta digital por ID
  async getId(id: number): Promise<CartasDigitales> {
    const cartaDigital = await this.prisma.cartasDigitales.findFirst({
      where: { id },
      include: { creatorUser: true },
    })
    if (!cartaDigital) throw new NotFoundException('La carta digital no existe');
    return cartaDigital;
  }

  // Listar cartas digitales
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

    const cartasDigitales = await this.prisma.cartasDigitales.findMany({
      include: { creatorUser: true },
      orderBy: { descripcion: 'asc' }
    })

    return {
      cartasDigitales,
      totalItems: cartasDigitales.length
    };

  }

  // Crear carta digital
  async insert(createData: Prisma.CartasDigitalesCreateInput): Promise<CartasDigitales> {

    // Uppercase y Lowercase
    createData.descripcion = createData.descripcion?.toLocaleUpperCase().trim();

    const { descripcion } = createData;

    // Verificacion: carta digital repetida
    // if (descripcion !== '') {
    //   let cartaDigitalDB = await this.prisma.cartasDigitales.findFirst({ where: { descripcion } });
    //   if (cartaDigitalDB) throw new NotFoundException('La carta digital ya fue cargada');
    // }

    return await this.prisma.cartasDigitales.create({ data: createData })

  }

  // Actualizar carta digital
  async update(id: number, updateData: Prisma.CartasDigitalesUpdateInput): Promise<any> {

    const { descripcion } = updateData;

    const cartaDigitalDB = await this.prisma.cartasDigitales.findFirst({ where: { id } });

    // Verificacion: La carta digital no existe
    if (!cartaDigitalDB) throw new NotFoundException('La carta digital no existe');

    // Verificacion: Descripcion repetida
    if (descripcion) {
      const descripcionRepetida = await this.prisma.cartasDigitales.findFirst({ where: { descripcion: descripcion.toString().toLocaleUpperCase().trim() } })
      if (descripcionRepetida && descripcionRepetida.id !== id) throw new NotFoundException('La descripción ya se encuentra cargada');
    }

    updateData.descripcion = descripcion?.toString().toLocaleUpperCase().trim();

    return await this.prisma.cartasDigitales.update({ 
      where: { id }, 
      data: updateData, 
      include: { 
        creatorUser: true 
      } 
    });

  }

}
