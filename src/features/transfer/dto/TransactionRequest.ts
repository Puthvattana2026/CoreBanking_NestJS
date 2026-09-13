import { AccountType } from "../../account/enums/AccountType";

export class TransactionRequest {
    accountNumber: number;
    accountType: AccountType;
    dailyLimitAmount: number;
    limitPerDay: number;
    amountMinBetweenMax: number;
}