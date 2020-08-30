// import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';
// import { uuid } from 'uuid';
import Transaction from '../models/Transaction';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const categoriesRepository = getCustomRepository(CategoriesRepository);
    const findCategoryExisting = await categoriesRepository.existingCategory(
      category,
    );
    let category_id: string;

    if (findCategoryExisting) {
      category_id = findCategoryExisting.id;
    } else {
      const createCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(createCategory);

      category_id = createCategory.id;
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
