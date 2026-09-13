import { Min } from "class-validator";
import { AccountType } from "../enums/AccountType";

export class AccountRequest {
    accountType: AccountType;
    accountNumber: number; 
    deposit: number;
}
