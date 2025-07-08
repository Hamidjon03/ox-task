import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiResponse } from '@nestjs/swagger';
import { ManagerOnly } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('Product')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ManagerOnly()
  @ApiResponse({ status: 200, description: 'OX Product list fetched successfully' })
  @ApiResponse({ status: 400, description: 'Page size too large or company not linked' })
  getFromOX(@Req() req, @Query('page') page = 1, @Query('size') size = 10) {
    return this.productService.findAllFromOX(req.user, { page: Number(page), size: Number(size) });
  }
}
