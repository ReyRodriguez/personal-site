import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminService } from './admin.service';
import { PostDto, PublishDto } from './dto/post.dto';

@Controller('admin/posts')
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get()
  list() {
    return this.admin.list();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.admin.getById(id);
  }

  @Post()
  create(@Body() dto: PostDto) {
    return this.admin.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: PostDto) {
    return this.admin.update(id, dto);
  }

  @Patch(':id/publish')
  setPublished(@Param('id') id: string, @Body() dto: PublishDto) {
    return this.admin.setPublished(id, dto.published);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.admin.remove(id);
  }
}
