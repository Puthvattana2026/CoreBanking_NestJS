import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Account } from "../../entity/account.entity";
import { AccountType } from "../../enums/AccountType";
import { AccountRepository } from "../../repository/AccountRepository";
import { AccountService } from "../account.service";

@Injectable()
export class AccountServiceImpl implements AccountService {

    constructor(private readonly accountRepository: AccountRepository){}
    
    findById(id: string): Promise<Account | null>{
        return this.accountRepository.findById(id);
    }

    findAccountByAccountNumber(accNum: number): Promise<Account | null> {
        return this.accountRepository.findOneByAccountNumber(accNum);
    }

    findAllAccount(): Promise<Account[]> {
        return this.accountRepository.findAllAccount();
    }

    async createAccount(): Promise<{ usdAccount: Account; khrAccount: Account }>{
        const min = 1_000_000;
        const max = 9_000_000;
        let accNum: number;
        let existing: Account | null;

        do{
            accNum = Math.floor(Math.random() * (max - min + 1) + min);
            existing = await this.accountRepository.findOneByAccountNumber(accNum);
        } while(existing);

        const usdAccount = new Account();
        usdAccount.accountNumber = accNum;
        usdAccount.accountType = AccountType.USD;
        usdAccount.deposit = 0;
        usdAccount.balance = 0;
        usdAccount.credit = 0;
        usdAccount.debit = 0
        
        const khrAccount = new Account();
        khrAccount.accountNumber = accNum;
        khrAccount.accountType = AccountType.KHR;
        khrAccount.deposit = 0;
        khrAccount.balance = 0;
        khrAccount.credit = 0;
        khrAccount.debit = 0;


        const [savedUsd, savedKhr] = await Promise.all(
            [
                this.accountRepository.save(usdAccount),
                this.accountRepository.save(khrAccount)
            ]
        )
        return { usdAccount: savedUsd, khrAccount: savedKhr };
    }

    async depositMoney(request: Account): Promise<Account> {
        const account = await this.accountRepository.findOneByAccountNumberAndType(
            request.accountNumber,
            request.accountType,
        );
        if (!account) 
            throw new NotFoundException('Account not found');

        if (account.accountType !== request.accountType) {
            throw new BadRequestException('Currency mismatch between request and account');
        }

        const deposit = request.deposit ?? 0;
        account.deposit += deposit;
        account.balance += deposit;
        account.credit += deposit;
        return this.accountRepository.save(account);
    }
}