import { Test, TestingModule } from '@nestjs/testing';
import { TopicController } from './topic.controller';
import { TopicService } from './topic.service';
import { Topic } from '@prisma/client';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

// 1. TẠO MỘT SERVICE GIẢ
const mockTopicService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

// 2. TẠO DỮ LIỆU MẪU
const mockTopic: Topic = {
  id: 'some-uuid-123',
  name: 'Hành động',
  description: 'Hành động là một thể loại phim',
  slug: 'hanh-dong',
  createdAt: new Date(),
};

describe('TopicController', () => {
  let controller: TopicController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TopicController],
      providers: [
        {
          provide: TopicService,
          useValue: mockTopicService,
        },
      ],
    }).compile();

    controller = module.get<TopicController>(TopicController);
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
      const dto: CreateTopicDto = {
        name: 'Hành động',
        description: 'Hành động là một thể loại phim',
      };

      // Giả lập: "Khi hàm create được gọi, hãy trả về mockGenre"
      mockTopicService.create.mockResolvedValue(mockTopic);

      // Chạy hàm controller
      const result = await controller.handleCreateTopic(dto);

      // Kiểm tra: Hàm mock 'create' có được gọi VỚI 'dto' không?
      expect(mockTopicService.create).toHaveBeenCalledWith(dto);
      // Kiểm tra: Controller có trả về đúng thứ mà service đã đưa không?
      expect(result).toEqual(mockTopic);
    });
  });

  // === TEST HÀM FINDALL (GET) ===
  describe('findAll', () => {
    it('should call service.findAll', async () => {
      const topicsArray = [mockTopic];
      mockTopicService.findAll.mockResolvedValue(topicsArray);

      const result = await controller.handleFindAllTopic();

      // Kiểm tra: Hàm mock 'findAll' có được gọi không?
      expect(mockTopicService.findAll).toHaveBeenCalledTimes(1);
      // Kiểm tra: Kết quả trả về có đúng là mảng genres không?
      expect(result).toEqual(topicsArray);
    });
  });

  // === TEST HÀM FINDONE (GET /:id) ===
  describe('findOne', () => {
    it('should call service.findById with the correct id', async () => {
      const id = 'some-uuid-123';
      mockTopicService.findById.mockResolvedValue(mockTopic);

      const result = await controller.handleFindOneTopic(id);

      // Kiểm tra: Hàm mock 'findById' có được gọi VỚI 'id' không?
      expect(mockTopicService.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockTopic);
    });
  });

  // === TEST HÀM UPDATE (PATCH /:id) ===
  describe('update', () => {
    it('should call service.update with correct id and DTO', async () => {
      const id = 'some-uuid-123';
      const dto: UpdateTopicDto = {
        name: 'Chính kịch',
        description: 'Chính kịch là một thể loại phim',
      };
      const updatedTopic = { ...mockTopic, ...dto };

      mockTopicService.update.mockResolvedValue(updatedTopic);

      const result = await controller.handleUpdateTopic(id, dto);

      // Kiểm tra: Hàm mock 'update' có được gọi VỚI 'id' và 'dto' không?
      expect(mockTopicService.update).toHaveBeenCalledWith(id, dto);

      console.log('Giá trị trả về (result):', result);
      console.log('Giá trị mong đợi (updatedTopic):', updatedTopic);
      expect(result).toEqual(updatedTopic);
    });
  });

  // === TEST HÀM REMOVE (DELETE /:id) ===
  describe('remove', () => {
    it('should call service.remove with the correct id', async () => {
      const id = 'some-uuid-123';
      mockTopicService.remove.mockResolvedValue(mockTopic);

      await controller.handleRemoveTopic(id);

      // Kiểm tra: Hàm mock 'remove' có được gọi VỚI 'id' không?
      expect(mockTopicService.remove).toHaveBeenCalledWith(id);
    });
  });
});
