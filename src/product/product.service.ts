import {
  Injectable,
  BadRequestException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ResData } from 'src/common/resData';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}



  async findAllFromOX(user: { companyId: string }, query: { page: number; size: number }) {
    const { page, size } = query;

    if (!user.companyId) {
      throw new BadRequestException('User is not linked to any company');
    }

    if (size > 20) {
      throw new BadRequestException('Page size cannot be greater than 20');
    }

    const company = await this.prisma.company.findUnique({
      where: { id: user.companyId },
    });


    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const response = await firstValueFrom(
      this.httpService.get(`https://${company.subdomain}.ox-sys.com/variations`, {
        headers: {
          Authorization: `Bearer ${company.token}`,
          Accept: 'application/json',
        },
        params: {
          page,
          size,
        },
      }),
    );

    return new ResData('Product variations from OX', HttpStatus.OK, response.data);
  }

}