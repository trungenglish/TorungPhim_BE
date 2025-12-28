import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TopicService } from './topic.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Topic } from '@prisma/client';
import { ApiCommonResponses } from 'src/common/decorators/api-common-responses.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public-route.decorator';

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Post()
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Tạo một chủ đề mới' })
  @ApiResponse({ status: 201, description: 'Tạo chủ đề thành công.' })
  async handleCreateTopic(
    @Body() createTopicDto: CreateTopicDto,
  ): Promise<Topic> {
    return this.topicService.create(createTopicDto);
  }

  @Get()
  @Public()
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Lấy tất cả chủ đề' })
  @ApiResponse({ status: 200, description: 'Lấy tất cả chủ đề thành công.' })
  async handleFindAllTopic(): Promise<Topic[]> {
    return this.topicService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Lấy chủ đề theo id' })
  @ApiResponse({ status: 200, description: 'Lấy chủ đề theo id thành công.' })
  async handleFindOneTopic(@Param('id') id: string): Promise<Topic> {
    return this.topicService.findById(id);
  }

  @Patch(':id')
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Cập nhật chủ đề theo id' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật chủ đề theo id thành công.',
  })
  async handleUpdateTopic(
    @Param('id') id: string,
    @Body() updateTopicDto: UpdateTopicDto,
  ): Promise<Topic> {
    return this.topicService.update(id, updateTopicDto);
  }

  @Delete(':id')
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Xóa chủ đề theo id' })
  @ApiResponse({ status: 204, description: 'Xóa chủ đề theo id thành công.' })
  async handleRemoveTopic(@Param('id') id: string): Promise<Topic> {
    return this.topicService.remove(id);
  }
}
