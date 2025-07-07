import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterCompanyDto {
  @ApiProperty({ example: 'Bearer xyz123' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'demo' })
  @IsString()
  subdomain: string;
}
