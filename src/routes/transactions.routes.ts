import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';

import uploadConfig from '../config/upload';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import Transaction from '../models/Transaction';
// import AppError from '../errors/AppError';

const upload = multer(uploadConfig);
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';
interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface StatementOfTransactions {
  transactions: Transaction[];
  balance: Balance;
}

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = await getCustomRepository(
    TransactionsRepository,
  );

  const transactions = await transactionsRepository.find({
    relations: ['category'],
  });

  const balance = await transactionsRepository.getBalance();

  const statementOfTransactions: StatementOfTransactions = {
    transactions,
    balance,
  };

  return response.status(200).json(statementOfTransactions);
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    type,
    value,
    category,
  });

  delete transaction.created_at;
  delete transaction.updated_at;

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransactions = new DeleteTransactionService();

  await deleteTransactions.execute(id);

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactionService = new ImportTransactionsService();

    const transactions = await importTransactionService.execute(
      `${uploadConfig.directory}/${request.file.filename}`,
    );

    return response.status(200).json(transactions);
  },
);

export default transactionsRouter;
