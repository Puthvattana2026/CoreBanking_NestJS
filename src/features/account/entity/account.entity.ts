import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UUID } from "typeorm/driver/mongodb/bson.typings.js";
import { AccountType } from "../enums/AccountType";
import { IsNotEmpty } from "class-validator";
import { Transfer } from "../../transfer/entity/transfer.entity";
import { Transaction } from "../../transfer/entity/transaction.entity";

@Entity()
export class Account {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    accountNumber: number;

    @Column({
        type: 'enum',
        enum: AccountType

    })
    @IsNotEmpty()
    accountType: AccountType;

    @Column(
        {   
            type: 'decimal', 
            precision: 10,
            scale: 2,
            default: 0,
            transformer: {
                to: (value: number) => value,
                from: (value: string) => parseFloat(value),
            },
        }
    )
    balance: number;

    @Column(
        {   
            type: 'decimal', 
            precision: 10,
            scale: 2,
            default: 0,
            transformer: {
                to: (value: number) => value,
                from: (value: string) => parseFloat(value),
            },
        }
    )
    deposit: number;

    @Column(
        {   
            type: 'decimal', 
            precision: 10,
            scale: 2,
            default: 0,
            transformer: {
                to: (value: number) => value,
                from: (value: string) => parseFloat(value),
            },
        }
    )
    credit: number;

    @Column(
        {   
            type: 'decimal', 
            precision: 10,
            scale: 2,
            default: 0,
            transformer: {
                to: (value: number) => value,
                from: (value: string) => parseFloat(value),
            },
        }
    )
    debit: number;

    // Transfers where this account sent money
    @OneToMany(() => Transfer, (transfer) => transfer.sourceAccount)
    sentTransfers: Transfer[];

    // Transfers where this account received money
    @OneToMany(() => Transfer, (transfer) => transfer.destinationAccount)
    receivedTransfers: Transfer[];

    // Ledger entries directly altering this account's balance
    @OneToMany(() => Transaction, (transaction) => transaction.account)
    transactions: Transaction[];
}
