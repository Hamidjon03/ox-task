import {
  Controller,
  Delete,
  Param,
  Post,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { AdminOnly } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('Company')
@ApiBearerAuth()
@Controller('company')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'Company created and user assigned as admin' })
  @ApiResponse({ status: 200, description: 'User assigned to existing company as manager' })
  register(@Req() req, @Body() dto: RegisterCompanyDto) {
    return this.companyService.registerCompany(req.user, dto);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Company deleted successfully' })
  delete(@Req() req, @Param('id') id: string) {
    return this.companyService.deleteCompany(req.user.id, id);
  }
}
