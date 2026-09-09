import { Column } from "typeorm";
import { Currency } from "../enums/Currency";

export class TransferRespone {
    id: string;
    toAccount: number;
    credit: number;
    debit: number;
    currencyType: Currency;
    @Column('uuid')
    fromCurrency: string;
    toCurrency: string;
    fromAccount: number; 
    transactionId: string;
    message: string;
}
