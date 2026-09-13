import { BadRequestException, Injectable } from '@nestjs/common';
import { TransferService } from '../transfer.service';
import { Transfer } from '../../entity/transfer.entity';
import { TransferRepository } from '../../repository/TransferRepository';
import { randomUUID } from 'crypto';
import { Currency } from '../../enums/Currency';
import { AccountRepository } from '../../../account/repository/AccountRepository';
import { AccountType } from '../../../account/enums/AccountType';
import { Transaction } from '../../entity/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class TransferServiceImpl implements TransferService {
 
    constructor(
        private readonly transferRepository: TransferRepository,
        private readonly accountRepository: AccountRepository,
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>
    ){}

    private readonly USD_KHR_RATE = 4037.00;
    private readonly KHR_USD_RATE = 4058.00;
 
    async sendMoney(request: Transfer): Promise<Transfer> {
 
        const amount = Number(request.amount);
        request.amount = amount;
        if (amount <= 0) {
            throw new Error('Transfer amount must be greater than zero');
        }
        if (request.sourceAccount?.accountNumber == null) {
            throw new Error('Source account is required');
        }
        if (request.destinationAccount?.accountNumber == null) {
            throw new Error('Destination account is required');
        }
 
        const fromCurrency = request.fromCurrency as Currency;
        if (fromCurrency !== Currency.USD && fromCurrency !== Currency.KHR) {
            throw new Error(`Unsupported source currency: ${fromCurrency}`);
        }

        const toCurrency = fromCurrency === Currency.USD ? Currency.KHR : Currency.USD;
        const byCurrency = request.currencyType as Currency;
        if (byCurrency !== Currency.USD && byCurrency !== Currency.KHR) {
            throw new Error(`Unsupported amount currency: ${byCurrency}`);
        }
        if (byCurrency !== fromCurrency && byCurrency !== toCurrency) {
            throw new Error(
                `Amount currency ${byCurrency} does not match either side of the transfer (${fromCurrency} -> ${toCurrency})`,
            );
        }
 
        const sourceAcc = await this.accountRepository.findOneByAccountNumberAndType(
            request.sourceAccount.accountNumber,
            fromCurrency === Currency.USD ? AccountType.USD : AccountType.KHR,
        );
        if (!sourceAcc) {
            throw new Error(`Source account not found: ${request.sourceAccount}`);
        }
 
        const receiverAcc = await this.accountRepository.findOneByAccountNumberAndType(
            request.destinationAccount.accountNumber,
            toCurrency === Currency.USD ? AccountType.USD : AccountType.KHR,
        );
        if (!receiverAcc) {
            throw new Error(`Destination account not found: ${request.destinationAccount}`);
        }
 
        const exchangeRate = byCurrency === Currency.USD ? this.USD_KHR_RATE : this.KHR_USD_RATE;
        const { debitAmount, creditAmount } = this.calculator(amount, byCurrency, fromCurrency);

        await this.validateTransferLimits(sourceAcc.id, debitAmount);
 
        if (debitAmount > sourceAcc.balance) {
            throw new Error(
                `Your balance is not enough. Available balance: ${sourceAcc.balance} ${fromCurrency}`,
            );
        }
 
        sourceAcc.balance -= debitAmount;
        sourceAcc.credit -= debitAmount;
        sourceAcc.debit -= debitAmount;
 
        receiverAcc.balance += creditAmount;
        receiverAcc.credit += creditAmount;
        sourceAcc.debit -= creditAmount;
 
 
        request.sourceAccount = sourceAcc;
        request.debit = debitAmount;
        request.credit = creditAmount;
        request.exchangeRate = exchangeRate;
        request.fromCurrency = fromCurrency;
        request.toCurrency = toCurrency;
        request.destinationAccount = receiverAcc;
        request.transactionId = "TXN-" + randomUUID().replaceAll("-", "")
                                                     .substring(0, 12)
                                                     .toUpperCase();
        request.message = "Successfully";
 
        await this.accountRepository.save(sourceAcc);
        await this.accountRepository.save(receiverAcc);
        return this.transferRepository.save(request);
    }

    private async validateTransferLimits(accountId: string, debitAmount: number): Promise<void> {
        const limits = await this.transactionRepository.findOne({
            where: { account: { id: accountId } },
        });

        if (!limits) {
            return;
        }

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const dailyStats = await this.transferRepository.getDailyOutgoingStats(accountId, startOfDay);

        if (dailyStats.count >= limits.limitPerDay) {
            throw new BadRequestException('Daily transfer count limit exceeded');
        }

        if (dailyStats.amount + debitAmount > Number(limits.dailyLimitAmount)) {
            throw new BadRequestException('Daily transfer amount limit exceeded');
        }
    }
 
    private calculator(
        amount: number,
        byCurrency: Currency,
        fromCurrency: Currency,
    ): { debitAmount: number; creditAmount: number } {
        let usdAmount: number;
        let khrAmount: number;
 
        if (byCurrency === Currency.USD) {
            usdAmount = amount;
            khrAmount = amount * this.USD_KHR_RATE;
        } else if (byCurrency === Currency.KHR) {
            khrAmount = amount;
            usdAmount = amount / this.KHR_USD_RATE;
        } else {
            throw new Error(`Unsupported currency: ${byCurrency}`);
        }
 
        const debitAmount = fromCurrency === Currency.USD ? usdAmount : khrAmount;
        const creditAmount = fromCurrency === Currency.USD ? khrAmount : usdAmount;
 
        return { debitAmount, creditAmount };
    }
 
    getTransfer(id: string): Promise<Transfer | null> {
        return this.transferRepository.findById(id);
    }
 
    getTransfers(): Promise<Transfer[]> {
        return this.transferRepository.findAll();
    }
}