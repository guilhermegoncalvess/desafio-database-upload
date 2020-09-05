import { EntityRepository, Repository } from 'typeorm';
import csvParse from 'csv-parse';
import fs from 'fs';

import Transaction from '../models/Transaction';

interface CSVArray {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

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

  public async loadCSV(filePath: string): Promise<CSVArray[]> {
    const readCSVStream = fs.createReadStream(filePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const lines: CSVArray[] = [];

    parseCSV.on('data', line => {
      lines.push({
        title: line[0],
        type: line[1],
        value: line[2],
        category: line[3],
      });
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
      console.log('cvs carregado!');
    });

    await fs.promises.unlink(filePath);

    return lines;
  }
}
export default TransactionsRepository;
