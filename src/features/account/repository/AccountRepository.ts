import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Account } from "../entity/account.entity";
import { Repository } from "typeorm";
import { AccountType } from "../enums/AccountType";

@Injectable()
export class AccountRepository{

    constructor( @InjectRepository(Account) private accountRepository: Repository<Account>){}
   
    findById(id: string): Promise<Account | null>{
        return this.accountRepository.findOne({where: { id }});
    }

    findByAccountType(accountType: AccountType): Promise <Account | null>{
        return this.accountRepository.findOneBy({accountType});
    }

    findOneByAccountNumber(accountNumber: number): Promise<Account | null> {
        return this.accountRepository.findOneBy({ accountNumber });
    }

    findOneByAccountNumberAndType(accountNumber: number,  accountType: AccountType): Promise<Account | null> {
        return this.accountRepository.findOneBy({ accountNumber,  accountType });
    }

    findAllAccount(): Promise<Account[]>{
        return this.accountRepository.find();
    }

    findAllTransferByAccount(accountNumber: number): Promise<Account | null> {
        return this.accountRepository.findOne({
            where: { accountNumber },
            relations: {
                sentTransfers: true,
                receivedTransfers: true,
            },
        });
    }

    save(account: Account): Promise<Account>{
        return this.accountRepository.save(account);
    }
}