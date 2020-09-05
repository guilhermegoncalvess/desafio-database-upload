import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from './CreateTransactionService';
import Transaction from '../models/Transaction';

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const transactionsRepository = new TransactionsRepository();
    const createTransactionRepository = new CreateTransactionService();

    const transactionsCSV = await transactionsRepository.loadCSV(filename);

    const transactions: Transaction[] = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const transactionCSV of transactionsCSV) {
      const { title, type, value, category } = transactionCSV;

      // eslint-disable-next-line no-await-in-loop
      const transaction: Transaction = await createTransactionRepository.execute(
        {
          title,
          type,
          value,
          category,
        },
      );

      transactions.push(transaction);
    }

    return transactions;
  }
}
export default ImportTransactionsService;
