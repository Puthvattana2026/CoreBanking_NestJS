import { Injectable } from "@nestjs/common";
import { Transfer } from "../entity/transfer.entity";
import { TransactionResponse } from "../dto/TransactionResponse";
import { Transaction } from "../entity/transaction.entity";
import { TransactionRequest } from "../dto/TransactionRequest";
import { Account } from "../../account/entity/account.entity";
import { AccountType } from "../../account/enums/AccountType";

@Injectable()
export class TransactionMapper {

    toTransaction(toTransactionRequest: TransactionRequest): Transaction {
        const transaction =  new Transaction();
        transaction.dailyLimitAmount = toTransactionRequest.dailyLimitAmount;
        transaction.limitPerDay = toTransactionRequest.limitPerDay;
        transaction.amountMinBetweenMax = toTransactionRequest.amountMinBetweenMax;
        return transaction;
    };

    async toTransactionResponse(toTransactionResponse: TransactionResponse): Promise<Transaction>{
        const transaction = new Transaction();
        transaction.dailyLimitAmount = toTransactionResponse.dailyLimitAmount;
        transaction.limitPerDay = toTransactionResponse.limitPerDay;
        transaction.amountMinBetweenMax = toTransactionResponse.amountMinBetweenMax;
        return transaction;
    }
    
}