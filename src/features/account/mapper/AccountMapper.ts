import { Injectable } from "@nestjs/common";
import { AccountRequest } from "../dto/AccountRequest.dto";
import { Account } from "../entity/account.entity";
import { AccountResponse } from "../dto/AccountResponse.dto";
import { AccountType } from "../enums/AccountType";
import { AccountRepository } from "../repository/AccountRepository";

@Injectable()
export class AccountMapper {

    constructor(private readonly accountRepository: AccountRepository){}

    toAccount(accountRequest: AccountRequest): Account {
        const accountResponse = new AccountResponse();
        const account = new Account();
        
        account.accountType = accountRequest.accountType;
        account.accountNumber = accountRequest.accaccountNumber;
        account.deposit = accountRequest.deposit;
        account.credit = account.deposit;
        account.balance = account.balance;
        account.debit = account.debit;
        return account;
    };

    toAccountResponse(account: Account): AccountResponse {
        const accountResponse = new AccountResponse();
        accountResponse.id = account.id;
        accountResponse.accountType = account.accountType;
        accountResponse.accountNumber = account.accountNumber;
        accountResponse.balance = account.balance;
        accountResponse.credit = account.credit;
        accountResponse.debit = account.debit;
        return accountResponse;
    }
}