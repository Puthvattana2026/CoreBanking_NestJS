import { BadRequestException, Injectable } from "@nestjs/common";
import { TransactionService } from "../transaction.service";
import { AccountRepository } from "../../../account/repository/AccountRepository";
import { Account } from "../../../account/entity/account.entity";
import { Transaction } from "../../entity/transaction.entity";
import { AccountType } from "../../../account/enums/AccountType";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class TransactionServiceImpl implements TransactionService{

    constructor(
        private readonly accountRepository: AccountRepository,
        
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>
    ){}

    private readonly DEFAULT_DAILY_LIMIT_AMOUNT: number = 5;
    private readonly DEFAULT_LIMIT_PER_DAY: number = 1;
    private readonly MAX_LIMIT_PER_DAY: number = 100;
    private readonly MAX_AMOUNT: number = 3000;
    private readonly MIN_AMOUNT: number = 5;


    async setDailyLimitAmount(amount: Transaction, accountNumber: number, accountType: AccountType): Promise<Transaction> {
        if (accountNumber === undefined || accountType === undefined) {
            throw new BadRequestException('accountNumber and accountType are required');
        }

        const account = await this.accountRepository.findOneByAccountNumberAndType(
            accountNumber,
            accountType
        );

        if(!account){
            throw new Error ('Invalid Credential');
        }

        const transaction = await this.findOrCreateForAccount(account, amount);
        transaction.dailyLimitAmount = amount.dailyLimitAmount ?? this.DEFAULT_DAILY_LIMIT_AMOUNT;
        if(transaction.dailyLimitAmount < this.DEFAULT_DAILY_LIMIT_AMOUNT){
            transaction.dailyLimitAmount = this.DEFAULT_DAILY_LIMIT_AMOUNT;
        }
        if(transaction.dailyLimitAmount > this.MAX_AMOUNT){
            throw new BadRequestException('Amount must be between 5$ to 3000$');
        }
        return this.transactionRepository.save(transaction);
    };

    async setLimitPerDay(limit: Transaction, accountNumber: number, accountType: AccountType): Promise<Transaction> {
        if (accountNumber === undefined || accountType === undefined) {
            throw new BadRequestException('accountNumber and accountType are required');
        }
        
        const account = await this.accountRepository.findOneByAccountNumberAndType(
            accountNumber,
            accountType
        );

        if(!account){
            throw new Error ('Invalid Credential');
        }

        const transaction = await this.findOrCreateForAccount(account, limit);
        transaction.limitPerDay = limit.limitPerDay ?? this.DEFAULT_LIMIT_PER_DAY;
        if(transaction.limitPerDay < this.DEFAULT_LIMIT_PER_DAY){
            transaction.limitPerDay = this.DEFAULT_LIMIT_PER_DAY;
        }
        if(transaction.limitPerDay > this.MAX_LIMIT_PER_DAY){
            throw new BadRequestException('Must be below 100');
        }
        return this.transactionRepository.save(transaction);
    };

    private async findOrCreateForAccount(account: Account, transaction: Transaction): Promise<Transaction> {
        const existing = await this.transactionRepository.findOne({
            where: { account: { id: account.id } },
        });

        if (existing) {
            return existing;
        }

        transaction.account = account;
        transaction.dailyLimitAmount ??= this.DEFAULT_DAILY_LIMIT_AMOUNT;
        transaction.limitPerDay ??= this.DEFAULT_LIMIT_PER_DAY;
        transaction.amountMinBetweenMax ??= this.MIN_AMOUNT;
        return transaction;
    }
    
}