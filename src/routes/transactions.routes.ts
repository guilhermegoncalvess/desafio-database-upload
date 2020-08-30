import { Router } from 'express';

import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';

import Transaction from '../models/Transaction';

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

  const transactions = await transactionsRepository.find({});
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

  const transactions = deleteTransactions.execute(id);

  return response.json(transactions);
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
