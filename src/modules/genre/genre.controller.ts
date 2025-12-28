import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from '@prisma/client';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ApiCommonResponses } from 'src/common/decorators/api-common-responses.decorator';
import { Public } from 'src/common/decorators/public-route.decorator';

@Controller('genre')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Post()
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Tạo một thể loại mới' })
  @ApiResponse({ status: 201, description: 'Tạo thành công.' })
  async handleCreateGenre(
    @Body() createGenreDto: CreateGenreDto,
  ): Promise<Genre> {
    return this.genreService.create(createGenreDto);
  }

  @Get()
  @Public()
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Lấy tất cả thể loại' })
  @ApiResponse({ status: 200, description: 'Lấy tất cả thể loại thành công.' })
  async handleFindAllGenre(): Promise<Genre[]> {
    return this.genreService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Lấy thể loại theo id' })
  @ApiResponse({ status: 200, description: 'Lấy thể loại theo id thành công.' })
  async handleFindOneGenre(@Param('id') id: string): Promise<Genre> {
    return this.genreService.findById(id);
  }

  @Patch(':id')
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Cập nhật thể loại theo id' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thể loại theo id thành công.',
  })
  async handleUpdateGenre(
    @Param('id') id: string,
    @Body() updateGenreDto: UpdateGenreDto,
  ): Promise<Genre> {
    return this.genreService.update(id, updateGenreDto);
  }

  @Delete(':id')
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Xóa thể loại theo id' })
  @ApiResponse({ status: 204, description: 'Xóa thành công.' })
  async handleRemoveGenre(@Param('id') id: string): Promise<Genre> {
    return this.genreService.remove(id);
  }
}
