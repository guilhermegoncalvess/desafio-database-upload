// import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';
// import { uuid } from 'uuid';
import Category from '../models/Category';
import CategoriesRepository from '../repositories/CategoriesRepository';

class CreateCategoryService {
  public async execute({ title }: Category): Promise<Category> {
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const category = categoriesRepository.create({
      title,
    });

    await categoriesRepository.save(category);

    return category;
  }
}

export default CreateCategoryService;
