import { Min } from "class-validator";
import { AccountType } from "../enums/AccountType";

export class AccountRequest {
    accountType: AccountType;
    accaccountNumber: number; 
    deposit: number;
}
