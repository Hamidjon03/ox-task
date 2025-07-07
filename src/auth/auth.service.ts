import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify.dto';
import { ResData } from 'src/common/resData';
import * as dayjs from 'dayjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const { email } = dto;

    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          role: 'manager',
        },
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = dayjs().add(3, 'minute').toDate();

    await this.prisma.user.update({
      where: { email },
      data: { otp, otpExpiresAt },
    });

    const responseData = process.env.NODE_ENV === 'production' ? {} : { otp };

    return new ResData('OTP has been generated', 201, responseData);
  }

  async verify(dto: VerifyOtpDto) {
    const { email, otp } = dto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (
      !user ||
      user.otp !== otp ||
      !user.otpExpiresAt ||
      new Date() > user.otpExpiresAt
    ) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const payload = { sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return new ResData('Access token has been generated', 200, { access_token: token });
  }
}
