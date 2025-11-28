import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Company, Prisma } from '@prisma/client';
import { toSlug } from 'src/common/utils/slugify';

@Injectable()
export class CompanyService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const slug = toSlug(createCompanyDto.name);

    return this.prisma.company.create({
      data: {
        name: createCompanyDto.name,
        slug,
        type: createCompanyDto.type,
        country: createCompanyDto.country,
      },
    });
  }

  async findAll(): Promise<Company[]> {
    return this.prisma.company.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Company> {
    return this.prisma.company.findUniqueOrThrow({
      where: { id },
    });
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    const data: Prisma.CompanyUpdateInput = {
      ...updateCompanyDto,
    };

    if (updateCompanyDto.name) {
      data.slug = toSlug(updateCompanyDto.name);
    }

    return this.prisma.company.update({
      where: { id },
      data: data,
    });
  }

  async remove(id: string): Promise<Company> {
    return this.prisma.company.delete({
      where: { id },
    });
  }

  async findManyByIds(ids: string[]): Promise<{ id: string }[]> {
    return this.prisma.company.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });
  }
}
