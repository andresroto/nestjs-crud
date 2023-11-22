import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { BreedsService } from './breeds.service';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/guard/auth.guard';
import { Response } from 'express';

@ApiBearerAuth()
@ApiTags('breeds')
@UseGuards(AuthGuard)
@Controller('breeds')
export class BreedsController {
  constructor(private readonly breedsService: BreedsService) {}

  @Post()
  async create(@Body() createBreedDto: CreateBreedDto, @Res() res: Response) {
    const breed = await this.breedsService.create(createBreedDto);

    return res.status(HttpStatus.OK).json({
      message: 'Breed created successfully!',
      data: breed,
    });
  }

  @Get()
  async findAll(@Res() res: Response) {
    const breeds = await this.breedsService.findAll();

    return res.status(HttpStatus.OK).json({
      data: breeds,
    });
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateBreedDto: UpdateBreedDto,
    @Res() res: Response,
  ) {
    const breed = await this.breedsService.update(id, updateBreedDto);

    return res.status(HttpStatus.OK).json({
      message: 'Breed updated successfully!',
      data: breed,
    });
  }
}
