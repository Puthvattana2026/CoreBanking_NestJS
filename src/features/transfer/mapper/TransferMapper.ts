import { Injectable } from "@nestjs/common";
import { TransferRequest } from "../dto/TransferRequest.dto";
import { TransferRespone } from "../dto/TransferResponse.dto";
import { Transfer } from "../entity/transfer.entity";

@Injectable()
export class TransferMapper{

    toTransfer(toTransfeRequest: TransferRequest): Transfer {
        const transfer = new Transfer();
        transfer.fromAccount = toTransfeRequest.fromAccount;
        transfer.amount = toTransfeRequest.amount;
        transfer.toAccount = toTransfeRequest.toAccount;
        transfer.currencyType = toTransfeRequest.currencyType;
        transfer.fromCurrency = toTransfeRequest.fromCurrency ?? "";
        transfer.toCurrency = toTransfeRequest.toCurrency ?? "";
 
        return transfer; 
    }
 
    toTransferResponse(toTransfer: Transfer): TransferRespone {
        const transferReponse = new TransferRespone();
        transferReponse.toAccount = toTransfer.toAccount;
        transferReponse.credit = toTransfer.credit;
        transferReponse.debit = toTransfer.debit;
        transferReponse.currencyType = toTransfer.currencyType;
        transferReponse.fromCurrency = toTransfer.fromCurrency;
        transferReponse.fromAccount = toTransfer.fromAccount;
        transferReponse.toCurrency = toTransfer.toCurrency;
        transferReponse.transactionId = toTransfer.transactionId;
        transferReponse.message = toTransfer.message;
        return transferReponse;
    }
}