import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { ManyToOne } from 'typeorm';
import { Breed } from 'src/breeds/entities/breed.entity';
import { Response } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('cats')
@UseGuards(AuthGuard)
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto, @Res() res: Response) {
    const cat = await this.catsService.create(createCatDto);

    return res.status(HttpStatus.OK).json({
      message: 'Cat created successfully!',
      data: cat,
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const cats = await this.catsService.findAll();

    return res.status(HttpStatus.OK).json({
      data: cats,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res: Response) {
    const cat = await this.catsService.findOne(id);

    return res.status(HttpStatus.OK).json({
      data: cat,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCatDto: UpdateCatDto,
    @Res() res: Response,
  ) {
    const cat = await this.catsService.update(id, updateCatDto);

    return res.status(HttpStatus.OK).json({
      message: 'Cat updated successfully!',
      data: cat,
    });
  }

  @ManyToOne(() => Breed, (breed) => breed.id, {
    eager: true,
  })
  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response) {
    const cat = await this.catsService.remove(id);

    return res.status(HttpStatus.OK).json({
      message: 'Cat deleted successfully!',
      data: cat,
    });
  }
}
