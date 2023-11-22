import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { Breed } from 'src/breeds/entities/breed.entity';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private readonly catsRepository: Repository<Cat>,

    @InjectRepository(Breed)
    private readonly breedsRepository: Repository<Breed>,
  ) {}

  async create(createCatDto: CreateCatDto) {
    const breed = await this.breedsRepository.findOneBy({
      id: createCatDto.breed,
    });

    if (!breed) {
      throw new NotFoundException(`Breed ${createCatDto.breed} not found`);
    }

    const cat = this.catsRepository.create({
      ...createCatDto,
      breed,
    });

    return await this.catsRepository.save(cat);
  }

  async findAll() {
    return await this.catsRepository.find();
  }

  async findOne(id: number) {
    const cat = await this.catsRepository.findOneBy({ id });

    if (!cat) {
      throw new NotFoundException(`Cat ${id} not found`);
    }

    return cat;
  }

  async update(id: number, updateCatDto: UpdateCatDto) {
    const cat = await this.catsRepository.findOneBy({ id });

    if (!cat) {
      throw new NotFoundException(`Cat ${id} not found`);
    }

    let breed;
    if (updateCatDto.breed) {
      breed = await this.breedsRepository.findOneBy({
        id: updateCatDto.breed,
      });
    }

    if (!breed) {
      throw new NotFoundException(`Breed ${breed} not found`);
    }

    return await this.catsRepository.save({
      ...cat,
      ...updateCatDto,
      breed,
    });
  }

  async remove(id: number) {
    const cat = await this.catsRepository.findOneBy({ id });

    if (!cat) {
      throw new NotFoundException(`Cat ${id} not found`);
    }

    await this.catsRepository.softDelete(id);

    return cat;
  }
}
