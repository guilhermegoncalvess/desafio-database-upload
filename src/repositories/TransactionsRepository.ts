import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const transactionsIncome = transactions
      .filter(transaction => transaction.type === 'income')
      .reduce((totalIncome, transaction) => {
        return totalIncome + transaction.value;
      }, 0);

    const transactionsOutcome = transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce((totalOutcome, transaction) => {
        return totalOutcome + transaction.value;
      }, 0);

    const balance = {
      income: transactionsIncome,
      outcome: transactionsOutcome,
      total: transactionsIncome - transactionsOutcome,
    };

    return balance;
  }
}
export default TransactionsRepository;
