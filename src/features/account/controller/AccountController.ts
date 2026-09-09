import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import type { AccountService } from "../service/account.service";
import { AccountMapper } from "../mapper/AccountMapper";
import { AccountResponse } from "../dto/AccountResponse.dto";
import { AccountRequest } from "../dto/AccountRequest.dto";
import { request } from "http";
import { Account } from "../entity/account.entity";

@Controller('accounts')
export class AccountController {

    constructor(
        @Inject('AccountService') private readonly accountService: AccountService,
        private readonly accountMapper: AccountMapper,
    ) {}

    @Post('/create')
    async createAccount(): Promise<AccountResponse[]> {
        const { usdAccount, khrAccount } = await this.accountService.createAccount();
        return [usdAccount, khrAccount].map((acc) => this.accountMapper.toAccountResponse(acc));
    }

    @Get('/history/:id')
    async accountHistory(@Param('id', ParseIntPipe) id: number): Promise<Account | null> {
        return this.accountService.findAllTransferByAccountNumber(id);
    }

    @Post()
    async depositMoney(@Body() accountRequest: AccountRequest): Promise<AccountResponse>{
        const account = this.accountMapper.toAccount(accountRequest);
        const savedAccount = await this.accountService.depositMoney(account);
        return this.accountMapper.toAccountResponse(savedAccount);
    }

    @Get(':id')
    async findAccountByAccountNumber(@Param('id') id: number): Promise<AccountResponse | null>{
        const account = await this.accountService.findAccountByAccountNumber(id);
        return account ? this.accountMapper.toAccountResponse(account) : null;
    }

    @Get()
    async findAllAccount(): Promise<Account[]> {
        return this.accountService.findAllAccount();
    }
}