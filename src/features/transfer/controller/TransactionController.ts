import { Body, Controller, Inject, Post } from "@nestjs/common";
import { TransactionRequest } from "../dto/TransactionRequest";
import { TransactionResponse } from "../dto/TransactionResponse";
import { TransactionMapper } from "../mapper/TrasactionMapper";
import type { TransactionService } from "../service/transaction.service";

@Controller('transactions')
export class TransactionController {

    constructor(
        @Inject('TransactionService')
        private readonly transactionService: TransactionService,
        private readonly transactionMapper: TransactionMapper
    ){}

    @Post('/limit/amount')
    async setDailyLimitAmount(@Body() request: TransactionRequest): Promise<TransactionResponse>{
        const transaction = this.transactionMapper.toTransaction(request);
        const savedTransaction = 
            await this.transactionService.setDailyLimitAmount(
                transaction,
                request.accountNumber,
                request.accountType
            );

        return this.transactionMapper.toTransactionResponse(savedTransaction);
    }

    @Post('/limit/perday')
    async setLimitPerDay(@Body() request: TransactionRequest): Promise<TransactionResponse>{
        const transaction = this.transactionMapper.toTransaction(request);
        const savedTransaction = 
            await this.transactionService.setLimitPerDay(
                transaction,
                request.accountNumber,
                request.accountType
            );

        return this.transactionMapper.toTransactionResponse(savedTransaction);
    }
}