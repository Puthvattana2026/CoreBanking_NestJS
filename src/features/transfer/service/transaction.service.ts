import { AccountType } from "../../account/enums/AccountType";
import { Transaction } from "../entity/transaction.entity";

export interface TransactionService {
    setDailyLimitAmount(amount: Transaction, accountNumber: number, accountType: AccountType): Promise<Transaction>;
    setLimitPerDay(limit: Transaction, accountNumber: number, accountType: AccountType): Promise<Transaction>;
}