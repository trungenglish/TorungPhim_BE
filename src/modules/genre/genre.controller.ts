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
  handleCreateGenre(@Body() createGenreDto: CreateGenreDto) {
    return this.genreService.create(createGenreDto);
  }

  @Get()
  @Public()
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Lấy tất cả thể loại' })
  @ApiResponse({ status: 200, description: 'Lấy tất cả thể loại thành công.' })
  handleFindAllGenre() {
    return this.genreService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Lấy thể loại theo id' })
  @ApiResponse({ status: 200, description: 'Lấy thể loại theo id thành công.' })
  handleFindOneGenre(@Param('id') id: string) {
    return this.genreService.findById(id);
  }

  @Patch(':id')
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Cập nhật thể loại theo id' })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật thể loại theo id thành công.',
  })
  handleUpdateGenre(
    @Param('id') id: string,
    @Body() updateGenreDto: UpdateGenreDto,
  ) {
    return this.genreService.update(id, updateGenreDto);
  }

  @Delete(':id')
  @ApiCommonResponses()
  @ApiOperation({ summary: 'Xóa thể loại theo id' })
  @ApiResponse({ status: 204, description: 'Xóa thành công.' })
  handleRemoveGenre(@Param('id') id: string) {
    return this.genreService.remove(id);
  }
}
