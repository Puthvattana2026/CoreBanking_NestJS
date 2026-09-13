import { Injectable } from "@nestjs/common";
import { TransferRequest } from "../dto/TransferRequest.dto";
import { TransferRespone } from "../dto/TransferResponse.dto";
import { Transfer } from "../entity/transfer.entity";
import { Account } from "../../account/entity/account.entity";

@Injectable()
export class TransferMapper{

    toTransfer(toTransfeRequest: TransferRequest): Transfer {
        const transfer = new Transfer();

        const sourceAccount = new Account();
        sourceAccount.accountNumber = toTransfeRequest.fromAccount;

        const destinationAccount = new Account();
        destinationAccount.accountNumber = toTransfeRequest.toAccount;

        transfer.sourceAccount = sourceAccount;
        transfer.amount = toTransfeRequest.amount;
        transfer.destinationAccount = destinationAccount;
        transfer.currencyType = toTransfeRequest.currencyType;
        transfer.fromCurrency = toTransfeRequest.fromCurrency ?? "";
        transfer.toCurrency = toTransfeRequest.toCurrency ?? "";
 
        return transfer; 
    }
 
    toTransferResponse(toTransfer: Transfer): TransferRespone {
        const transferReponse = new TransferRespone();
        transferReponse.toAccount = toTransfer.destinationAccount.accountNumber;
        transferReponse.credit = toTransfer.credit;
        transferReponse.debit = toTransfer.debit;
        transferReponse.currencyType = toTransfer.currencyType;
        transferReponse.fromCurrency = toTransfer.fromCurrency;
        transferReponse.fromAccount = toTransfer.sourceAccount.accountNumber;
        transferReponse.toCurrency = toTransfer.toCurrency;
        transferReponse.transactionId = toTransfer.transactionId;
        transferReponse.message = toTransfer.message;
        return transferReponse;
    }
}