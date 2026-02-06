import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) { }

  create(createOrderDto: CreateOrderDto) {
    const { patientId, items, totalAmount, quoteId } = createOrderDto;

    return this.prisma.order.create({
      data: {
        patientId,
        totalAmount,
        quoteId,
        status: 'PENDING',
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: { product: true }
        }
      }
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: {
        items: { include: { product: true } },
        patient: true,
      }
    });
  }

  findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true } },
        patient: true,
        quote: true,
      }
    });
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: string) {
    return `This action removes a #${id} order`;
  }
}
