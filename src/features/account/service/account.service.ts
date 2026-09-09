import { Expose } from "class-transformer";
import { Account } from "../entity/account.entity";

export interface AccountService {
    findAccountByAccountNumber(accNum: number): Promise<Account | null>;
    findAllAccount(): Promise<Account[]>;
    createAccount(): Promise<{ usdAccount: Account; khrAccount: Account }>;
    findAllTransferByAccountNumber(accountNumber: number): Promise<Account | null>;
    depositMoney(request: Account): Promise<Account>;
}