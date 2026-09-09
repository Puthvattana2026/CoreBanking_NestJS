import { AccountType } from "../enums/AccountType";

export class AccountResponse {
    id: string;
    accountType: AccountType;
    accountNumber: number;
    deposit: number;
    balance: number;
    credit: number;
    debit: number;
}
