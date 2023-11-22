import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBreedDto } from './dto/create-breed.dto';
import { UpdateBreedDto } from './dto/update-breed.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Breed } from './entities/breed.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BreedsService {
  constructor(
    @InjectRepository(Breed)
    private readonly breedsRepository: Repository<Breed>,
  ) {}

  async create(createBreedDto: CreateBreedDto) {
    const breed = this.breedsRepository.create(createBreedDto);
    return await this.breedsRepository.save(breed);
  }

  async findAll() {
    return await this.breedsRepository.find();
  }

  async update(id: number, updateBreedDto: UpdateBreedDto) {
    const breed = await this.breedsRepository.findOneBy({ id });

    if (!breed) {
      throw new NotFoundException(`Breed ${id} not found`);
    }

    await this.breedsRepository.update(id, updateBreedDto);

    return breed;
  }
}
