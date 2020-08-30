import { EntityRepository, Repository, getRepository } from 'typeorm';

import Category from '../models/Category';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Category)
class TransactionsRepository extends Repository<Category> {
  public async existingCategory(title: string): Promise<Category | null> {
    const transactions = getRepository(Category);

    const findCategory = await transactions.findOne({
      where: { title },
    });

    return findCategory || null;
  }
}

export default TransactionsRepository;
