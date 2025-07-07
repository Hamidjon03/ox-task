import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { firstValueFrom } from 'rxjs';
import { ResData } from 'src/common/resData';

@Injectable()
export class CompanyService {
  constructor(
    private prisma: PrismaService,
    private http: HttpService,
  ) {}

  async registerCompany(user: { id: string; role: string }, dto: RegisterCompanyDto): Promise<ResData<any>> {
    const { token, subdomain } = dto;
    const bearerToken = token.replace(/^Bearer\s+/i, '').trim();
    const url = `https://${subdomain}.ox-sys.com/profile`;

    try {
      await firstValueFrom(
        this.http.get(url, {
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${bearerToken}`,
          },
        }),
      );
    } catch {
      throw new BadRequestException('Invalid OX token or subdomain');
    }

    const existingCompany = await this.prisma.company.findUnique({
      where: { subdomain },
    });

    if (!existingCompany) {
      const company = await this.prisma.company.create({
        data: {
          subdomain,
          token: bearerToken,
          adminUserId: user.id,
        },
      });

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          role: 'admin',
          companyId: company.id,
        },
      });

      return new ResData(
        'Company created and you are assigned as admin',
        HttpStatus.CREATED,
        {
          companyId: company.id,
          subdomain: company.subdomain,
        },
      );
    } else {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          role: 'manager',
          companyId: existingCompany.id,
        },
      });

      return new ResData(
        'You are assigned to existing company as manager',
        HttpStatus.OK,
        {
          companyId: existingCompany.id,
          subdomain: existingCompany.subdomain,
        },
      );
    }
  }

  async deleteCompany(userId: string, companyId: string): Promise<ResData<null>> {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.adminUserId !== userId) {
      throw new ForbiddenException('Only the admin can delete their own company');
    }

    await this.prisma.company.delete({
      where: { id: companyId },
    });

    return new ResData('Company deleted', HttpStatus.OK);
  }
}
