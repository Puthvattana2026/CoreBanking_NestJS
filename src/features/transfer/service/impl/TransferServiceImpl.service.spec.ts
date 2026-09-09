import { TransferServiceImpl } from './TransferServiceImpl';
import { Account } from '../../../account/entity/account.entity';
import { AccountRepository } from '../../../account/repository/AccountRepository';
import { TransferRepository } from '../../repository/TransferRepository';
import { Transfer } from '../../entity/transfer.entity';
import { Currency } from '../../enums/Currency';
import { AccountType } from '../../../account/enums/AccountType';

describe('TransferServiceImpl', () => {
  it('decreases the sender and credits the receiver for a same-currency transfer', async () => {
    const sender = Object.assign(new Account(), {
      accountNumber: 1001,
      accountType: AccountType.USD,
      balance: 30,
      credit: 30,
      debit: 0,
    });
    const receiver = Object.assign(new Account(), {
      accountNumber: 1002,
      accountType: AccountType.USD,
      balance: 0,
      credit: 0,
      debit: 0,
    });
    const accountRepository = {
      findOneByAccountNumberAndType: jest.fn()
        .mockResolvedValueOnce(sender)
        .mockResolvedValueOnce(receiver),
      save: jest.fn().mockImplementation(async (account: Account) => account),
    } as unknown as AccountRepository;
    const transferRepository = {
      save: jest.fn().mockImplementation(async (transfer: Transfer) => transfer),
    } as unknown as TransferRepository;
    const service = new TransferServiceImpl(transferRepository, accountRepository);
    const transfer = Object.assign(new Transfer(), {
      fromAccount: 1001,
      toAccount: 1002,
      amount: 20,
      currencyType: Currency.USD,
      fromCurrency: Currency.USD,
      toCurrency: Currency.USD,
    });

    await service.sendMoney(transfer);

    expect(sender.balance).toBe(10);
    expect(sender.credit).toBe(30);
    expect(sender.debit).toBe(-20);
    expect(receiver.balance).toBe(20);
    expect(receiver.credit).toBe(20);
    expect(receiver.debit).toBe(0);
    expect(transfer.credit).toBe(20);
    expect(accountRepository.save).toHaveBeenNthCalledWith(1, sender);
    expect(accountRepository.save).toHaveBeenNthCalledWith(2, receiver);
  });

  it('converts KHR from the sender into USD for the receiver', async () => {
    const sender = Object.assign(new Account(), {
      accountNumber: 2001,
      accountType: AccountType.KHR,
      balance: 1000,
      credit: 1000,
      debit: 0,
    });
    const receiver = Object.assign(new Account(), {
      accountNumber: 2002,
      accountType: AccountType.USD,
      balance: 0,
      credit: 0,
      debit: 0,
    });
    const accountRepository = {
      findOneByAccountNumberAndType: jest.fn()
        .mockResolvedValueOnce(sender)
        .mockResolvedValueOnce(receiver),
      save: jest.fn().mockImplementation(async (account: Account) => account),
    } as unknown as AccountRepository;
    const transferRepository = {
      save: jest.fn().mockImplementation(async (transfer: Transfer) => transfer),
    } as unknown as TransferRepository;
    const service = new TransferServiceImpl(transferRepository, accountRepository);
    const transfer = Object.assign(new Transfer(), {
      fromAccount: 2001,
      toAccount: 2002,
      amount: 1000,
      currencyType: Currency.KHR,
      fromCurrency: Currency.KHR,
      toCurrency: Currency.USD,
    });

    await service.sendMoney(transfer);

    expect(sender.balance).toBe(0);
    expect(sender.debit).toBe(-1000);
    expect(receiver.balance).toBe(0.25);
    expect(receiver.credit).toBe(0.25);
    expect(transfer.credit).toBe(0.25);
    expect(transfer.exchangeRate).toBe(4058);
  });

  it('converts USD from the USD account into KHR for the KHR account', async () => {
    const usdAccount = Object.assign(new Account(), {
      accountNumber: 5001,
      accountType: AccountType.USD,
      balance: 100,
      credit: 100,
      debit: 0,
    });
    const khrAccount = Object.assign(new Account(), {
      accountNumber: 5001,
      accountType: AccountType.KHR,
      balance: 0,
      credit: 0,
      debit: 0,
    });
    const accountRepository = {
      findOneByAccountNumberAndType: jest.fn()
        .mockResolvedValueOnce(usdAccount)
        .mockResolvedValueOnce(khrAccount),
      save: jest.fn().mockImplementation(async (account: Account) => account),
    } as unknown as AccountRepository;
    const transferRepository = {
      save: jest.fn().mockImplementation(async (transfer: Transfer) => transfer),
    } as unknown as TransferRepository;
    const service = new TransferServiceImpl(transferRepository, accountRepository);
    const transfer = Object.assign(new Transfer(), {
      fromAccount: 5001,
      toAccount: 5001,
      amount: 100,
      currencyType: Currency.USD,
      fromCurrency: Currency.USD,
      toCurrency: Currency.KHR,
    });

    await service.sendMoney(transfer);

    expect(usdAccount.balance).toBe(0);
    expect(usdAccount.debit).toBe(-100);
    expect(khrAccount.balance).toBe(403700);
    expect(khrAccount.credit).toBe(403700);
    expect(transfer.credit).toBe(403700);
    expect(transfer.exchangeRate).toBe(4037);
  });

  it('converts USD into KHR while debiting the KHR account', async () => {
    const khrAccount = Object.assign(new Account(), {
      accountNumber: 6001,
      accountType: AccountType.KHR,
      balance: 500000,
      credit: 500000,
      debit: 0,
    });
    const receiver = Object.assign(new Account(), {
      accountNumber: 6002,
      accountType: AccountType.KHR,
      balance: 0,
      credit: 0,
      debit: 0,
    });
    const accountRepository = {
      findOneByAccountNumberAndType: jest.fn()
        .mockResolvedValueOnce(khrAccount)
        .mockResolvedValueOnce(receiver),
      save: jest.fn().mockImplementation(async (account: Account) => account),
    } as unknown as AccountRepository;
    const transferRepository = {
      save: jest.fn().mockImplementation(async (transfer: Transfer) => transfer),
    } as unknown as TransferRepository;
    const service = new TransferServiceImpl(transferRepository, accountRepository);
    const transfer = Object.assign(new Transfer(), {
      fromAccount: 6001,
      toAccount: 6002,
      amount: 100,
      currencyType: Currency.KHR,
      fromCurrency: Currency.USD,
      toCurrency: Currency.KHR,
    });

    await service.sendMoney(transfer);

    expect(khrAccount.balance).toBe(96300);
    expect(khrAccount.debit).toBe(-403700);
    expect(receiver.balance).toBe(403700);
    expect(receiver.credit).toBe(403700);
    expect(transfer.credit).toBe(403700);
    expect(transfer.exchangeRate).toBe(4037);
  });

  it('allows a transfer to the same account in the same currency', async () => {
    const account = Object.assign(new Account(), {
      accountNumber: 3001,
      accountType: AccountType.USD,
      balance: 30,
      credit: 30,
      debit: 0,
    });
    const accountRepository = {
      findOneByAccountNumberAndType: jest.fn().mockResolvedValue(account),
      save: jest.fn().mockImplementation(async (savedAccount: Account) => savedAccount),
    } as unknown as AccountRepository;
    const transferRepository = {
      save: jest.fn().mockImplementation(async (transfer: Transfer) => transfer),
    } as unknown as TransferRepository;
    const service = new TransferServiceImpl(transferRepository, accountRepository);
    const transfer = Object.assign(new Transfer(), {
      fromAccount: 3001,
      toAccount: 3001,
      amount: 20,
      currencyType: Currency.USD,
      fromCurrency: Currency.USD,
      toCurrency: Currency.USD,
    });

    await service.sendMoney(transfer);

    expect(account.balance).toBe(30);
    expect(account.credit).toBe(50);
    expect(account.debit).toBe(-20);
    expect(transfer.credit).toBe(20);
  });

  it('debits a USD account with the USD equivalent of a KHR amount', async () => {
    const account = Object.assign(new Account(), {
      accountNumber: 4001,
      accountType: AccountType.USD,
      balance: 10,
      credit: 10,
      debit: 0,
    });
    const accountRepository = {
      findOneByAccountNumberAndType: jest.fn().mockResolvedValue(account),
      save: jest.fn().mockImplementation(async (savedAccount: Account) => savedAccount),
    } as unknown as AccountRepository;
    const transferRepository = {
      save: jest.fn().mockImplementation(async (transfer: Transfer) => transfer),
    } as unknown as TransferRepository;
    const service = new TransferServiceImpl(transferRepository, accountRepository);
    const transfer = Object.assign(new Transfer(), {
      fromAccount: 4001,
      toAccount: 4001,
      amount: 1000,
      currencyType: Currency.USD,
      fromCurrency: Currency.KHR,
      toCurrency: Currency.USD,
    });

    await service.sendMoney(transfer);

    expect(account.balance).toBe(10);
    expect(account.debit).toBe(-0.001232);
    expect(account.credit).toBe(10.001232);
    expect(transfer.credit).toBe(0.001232);
  });
});
