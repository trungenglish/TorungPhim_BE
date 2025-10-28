import { Test, TestingModule } from '@nestjs/testing';
import { GenreController } from './genre.controller';
import { GenreService } from './genre.service';
import { Genre } from '@prisma/client';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { CreateGenreDto } from './dto/create-genre.dto';

// 1. TẠO MỘT SERVICE GIẢ
const mockGenreService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

// 2. TẠO DỮ LIỆU MẪU
const mockGenre: Genre = {
  id: 'some-uuid-123',
  name: 'Hành động',
  slug: 'hanh-dong',
  createdAt: new Date(),
};

describe('GenreController', () => {
  let controller: GenreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenreController],
      providers: [
        // 3. "TRÁO HÀNG" (Provide)
        {
          provide: GenreService,
          useValue: mockGenreService,
        },
      ],
    }).compile();

    controller = module.get<GenreController>(GenreController);
  });

  // 4. DỌN DẸP
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // === TEST HÀM CREATE (POST) ===
  describe('create', () => {
    it('should call service.create with the correct DTO', async () => {
      const dto: CreateGenreDto = { name: 'Hành động' };

      // Giả lập: "Khi hàm create được gọi, hãy trả về mockGenre"
      mockGenreService.create.mockResolvedValue(mockGenre);

      // Chạy hàm controller
      const result = await controller.handleCreateGenre(dto);

      // Kiểm tra: Hàm mock 'create' có được gọi VỚI 'dto' không?
      expect(mockGenreService.create).toHaveBeenCalledWith(dto);
      // Kiểm tra: Controller có trả về đúng thứ mà service đã đưa không?
      expect(result).toEqual(mockGenre);
    });
  });

  // === TEST HÀM FINDALL (GET) ===
  describe('findAll', () => {
    it('should call service.findAll', async () => {
      const genresArray = [mockGenre];
      mockGenreService.findAll.mockResolvedValue(genresArray);

      const result = await controller.handleFindAllGenre();

      // Kiểm tra: Hàm mock 'findAll' có được gọi không?
      expect(mockGenreService.findAll).toHaveBeenCalledTimes(1);
      // Kiểm tra: Kết quả trả về có đúng là mảng genres không?
      expect(result).toEqual(genresArray);
    });
  });

  // === TEST HÀM FINDONE (GET /:id) ===
  describe('findOne', () => {
    it('should call service.findById with the correct id', async () => {
      const id = 'some-uuid-123';
      mockGenreService.findById.mockResolvedValue(mockGenre);

      const result = await controller.handleFindOneGenre(id);

      // Kiểm tra: Hàm mock 'findById' có được gọi VỚI 'id' không?
      expect(mockGenreService.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockGenre);
    });
  });

  // === TEST HÀM UPDATE (PATCH /:id) ===
  describe('update', () => {
    it('should call service.update with correct id and DTO', async () => {
      const id = 'some-uuid-123';
      const dto: UpdateGenreDto = { name: 'Hành động Mới' };
      const updatedGenre = { ...mockGenre, ...dto };

      mockGenreService.update.mockResolvedValue(updatedGenre);

      const result = await controller.handleUpdateGenre(id, dto);

      // Kiểm tra: Hàm mock 'update' có được gọi VỚI 'id' và 'dto' không?
      expect(mockGenreService.update).toHaveBeenCalledWith(id, dto);
      expect(result).toEqual(updatedGenre);
    });
  });

  // === TEST HÀM REMOVE (DELETE /:id) ===
  describe('remove', () => {
    it('should call service.remove with the correct id', async () => {
      const id = 'some-uuid-123';
      mockGenreService.remove.mockResolvedValue(mockGenre); // Giả sử hàm remove trả về object đã xóa

      await controller.handleRemoveGenre(id);

      // Kiểm tra: Hàm mock 'remove' có được gọi VỚI 'id' không?
      expect(mockGenreService.remove).toHaveBeenCalledWith(id);
    });
  });
});
