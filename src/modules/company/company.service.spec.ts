import { Test, TestingModule } from '@nestjs/testing';
import { CompanyService } from './company.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Company, CompanyType, Prisma } from '@prisma/client';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { toSlug } from 'src/common/utils/slugify';

const mockPrismaService = {
  company: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

const mockCompany: Company = {
  id: 'company-uuid',
  name: 'Marvel Studios',
  slug: 'marvel-studios',
  type: CompanyType.PRODUCER,
  country: 'USA',
  createdAt: new Date(),
};

const P2002Error = new Prisma.PrismaClientKnownRequestError(
  'Unique constraint failed',
  { code: 'P2002', clientVersion: '4.x.x' },
);

const P2025Error = new Prisma.PrismaClientKnownRequestError(
  'Record not found',
  { code: 'P2025', clientVersion: '4.x.x' },
);

jest.mock('src/common/utils/slugify', () => ({
  toSlug: jest.fn(
    (text: string) => text?.toLowerCase().replace(/\s+/g, '-') ?? '',
  ),
}));

describe('CompanyService', () => {
  let service: CompanyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CompanyService>(CompanyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create company with slug', async () => {
      const dto: CreateCompanyDto = {
        name: 'Marvel Studios',
        type: CompanyType.PRODUCER,
        country: 'USA',
      };
      mockPrismaService.company.create.mockResolvedValue(mockCompany);

      const result = await service.create(dto);

      expect(toSlug).toHaveBeenCalledWith(dto.name);
      expect(mockPrismaService.company.create).toHaveBeenCalledWith({
        data: {
          name: dto.name,
          slug: 'marvel-studios',
          type: dto.type,
          country: dto.country,
        },
      });
      expect(result).toEqual(mockCompany);
    });

    it('should propagate prisma errors', async () => {
      const dto: CreateCompanyDto = {
        name: 'Duplicated',
        type: CompanyType.PRODUCER,
        country: 'USA',
      };
      mockPrismaService.company.create.mockRejectedValue(P2002Error);

      await expect(service.create(dto)).rejects.toThrow(P2002Error);
    });
  });

  describe('findAll', () => {
    it('should return company list ordered by createdAt desc', async () => {
      mockPrismaService.company.findMany.mockResolvedValue([mockCompany]);

      const result = await service.findAll();

      expect(mockPrismaService.company.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([mockCompany]);
    });
  });

  describe('findById', () => {
    it('should return company by id', async () => {
      mockPrismaService.company.findUniqueOrThrow.mockResolvedValue(
        mockCompany,
      );

      const result = await service.findById('company-uuid');

      expect(mockPrismaService.company.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 'company-uuid' },
      });
      expect(result).toEqual(mockCompany);
    });

    it('should throw when prisma throws', async () => {
      mockPrismaService.company.findUniqueOrThrow.mockRejectedValue(P2025Error);

      await expect(service.findById('invalid')).rejects.toThrow(P2025Error);
    });
  });

  describe('update', () => {
    it('should update name and slug when name provided', async () => {
      const dto: UpdateCompanyDto = { name: 'New Name' };
      const updated = { ...mockCompany, name: 'New Name', slug: 'new-name' };
      mockPrismaService.company.update.mockResolvedValue(updated);

      const result = await service.update('company-uuid', dto);

      expect(mockPrismaService.company.update).toHaveBeenCalledWith({
        where: { id: 'company-uuid' },
        data: {
          name: dto.name,
          slug: 'new-name',
        },
      });
      expect(result).toEqual(updated);
    });

    it('should update only type when name not provided', async () => {
      const dto: UpdateCompanyDto = { type: CompanyType.NETWORK };
      const updated = { ...mockCompany, type: CompanyType.NETWORK };
      mockPrismaService.company.update.mockResolvedValue(updated);

      await service.update('company-uuid', dto);

      expect(mockPrismaService.company.update).toHaveBeenCalledWith({
        where: { id: 'company-uuid' },
        data: {
          type: CompanyType.NETWORK,
        },
      });
    });

    it('should propagate prisma errors on update', async () => {
      mockPrismaService.company.update.mockRejectedValue(P2025Error);

      await expect(
        service.update('company-uuid', { name: 'Test' }),
      ).rejects.toThrow(P2025Error);
    });
  });

  describe('remove', () => {
    it('should remove company', async () => {
      mockPrismaService.company.delete.mockResolvedValue(mockCompany);

      const result = await service.remove('company-uuid');

      expect(mockPrismaService.company.delete).toHaveBeenCalledWith({
        where: { id: 'company-uuid' },
      });
      expect(result).toEqual(mockCompany);
    });

    it('should propagate prisma errors on remove', async () => {
      mockPrismaService.company.delete.mockRejectedValue(P2025Error);

      await expect(service.remove('company-uuid')).rejects.toThrow(P2025Error);
    });
  });

  describe('findManyByIds', () => {
    it('should return list containing only ids', async () => {
      const ids = ['id-1', 'id-2'];
      const dbResult = [{ id: 'id-1' }];
      mockPrismaService.company.findMany.mockResolvedValue(dbResult);

      const result = await service.findManyByIds(ids);

      expect(mockPrismaService.company.findMany).toHaveBeenCalledWith({
        where: { id: { in: ids } },
        select: { id: true },
      });
      expect(result).toEqual(dbResult);
    });
  });
});
