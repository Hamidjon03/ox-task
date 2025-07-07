import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ResData } from 'src/common/resData';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(user: { id: string; companyId: string }, dto: CreateProductDto) {
    if (!user.companyId) {
      throw new BadRequestException('User is not linked to any company');
    }

    const existing = await this.prisma.product.findFirst({
      where: {
        name: dto.name,
        companyId: user.companyId,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Product with this name already exists in your company',
      );
    }

    const product = await this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
        companyId: user.companyId,
      },
    });

    return new ResData('Product created', HttpStatus.CREATED, product);
  }

  async findAll(companyId: string) {
    const products = await this.prisma.product.findMany({
      where: { companyId },
    });

    return new ResData('Product list', HttpStatus.OK, products);
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return new ResData('Product found', HttpStatus.OK, product);
  }

  async update(id: string, dto: UpdateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    const updated = await this.prisma.product.update({
      where: { id },
      data: dto,
    });

    return new ResData('Product updated', HttpStatus.OK, updated);
  }

  async remove(id: string) {
    const existing = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Product not found');
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return new ResData('Product deleted', HttpStatus.OK);
  }
}
