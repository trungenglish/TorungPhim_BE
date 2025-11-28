import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { Company, CompanyType } from '@prisma/client';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

const mockCompanyService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

const mockCompany: Company = {
  id: 'company-uuid',
  name: 'Marvel Studios',
  slug: 'marvel-studios',
  type: CompanyType.PRODUCER,
  country: 'USA',
  createdAt: new Date(),
};

describe('CompanyController', () => {
  let controller: CompanyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      providers: [
        {
          provide: CompanyService,
          useValue: mockCompanyService,
        },
      ],
    }).compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should delegate to service.create', async () => {
      const dto: CreateCompanyDto = {
        name: 'Marvel Studios',
        type: CompanyType.PRODUCER,
        country: 'USA',
      };
      mockCompanyService.create.mockResolvedValue(mockCompany);

      const result = await controller.create(dto);

      expect(mockCompanyService.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockCompany);
    });
  });

  describe('findAll', () => {
    it('should return list from service', async () => {
      mockCompanyService.findAll.mockResolvedValue([mockCompany]);

      const result = await controller.findAll();

      expect(mockCompanyService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockCompany]);
    });
  });

  describe('findOne', () => {
    it('should call service.findById with id', async () => {
      mockCompanyService.findById.mockResolvedValue(mockCompany);

      const result = await controller.findOne('company-uuid');

      expect(mockCompanyService.findById).toHaveBeenCalledWith('company-uuid');
      expect(result).toEqual(mockCompany);
    });
  });

  describe('update', () => {
    it('should call service.update with id and dto', async () => {
      const dto: UpdateCompanyDto = { name: 'New Name' };
      const updated = { ...mockCompany, name: 'New Name' };
      mockCompanyService.update.mockResolvedValue(updated);

      const result = await controller.update('company-uuid', dto);

      expect(mockCompanyService.update).toHaveBeenCalledWith('company-uuid', dto);
      expect(result).toEqual(updated);
    });
  });

  describe('remove', () => {
    it('should call service.remove with id', async () => {
      mockCompanyService.remove.mockResolvedValue(mockCompany);

      const result = await controller.remove('company-uuid');

      expect(mockCompanyService.remove).toHaveBeenCalledWith('company-uuid');
      expect(result).toEqual(mockCompany);
    });
  });
});
