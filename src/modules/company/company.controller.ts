import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from '@prisma/client';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiCommonResponses } from 'src/common/decorators/api-common-responses.decorator';
import { Public } from 'src/common/decorators/public-route.decorator';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Tạo một công ty mới' })
  @ApiResponse({ status: 201, description: 'Tạo thành công.' })
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.companyService.create(createCompanyDto);
  }

  @Get()
  @Public()
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Lấy tất cả công ty' })
  @ApiResponse({ status: 200, description: 'Lấy tất cả công ty thành công.' })
  async findAll(): Promise<Company[]> {
    return this.companyService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Lấy công ty theo id' })
  @ApiResponse({ status: 200, description: 'Lấy công ty theo id thành công.' })
  async findOne(@Param('id') id: string): Promise<Company> {
    return this.companyService.findById(id);
  }

  @Patch(':id')
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Cập nhật công ty theo id' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật công ty theo id thành công.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    return this.companyService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Xóa công ty theo id' })
  @ApiResponse({ status: 204, description: 'Xóa thành công.' })
  async remove(@Param('id') id: string): Promise<Company> {
    return this.companyService.remove(id);
  }
}
