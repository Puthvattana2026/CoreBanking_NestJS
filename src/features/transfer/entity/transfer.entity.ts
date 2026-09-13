import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UUID } from "typeorm/driver/mongodb/bson.typings.js";
import { Currency } from "../enums/Currency";
import { IsNotEmpty } from "class-validator";
import { Account } from "../../account/entity/account.entity";
import { from } from "rxjs";
import { Transaction } from "./transaction.entity";

@Entity()
export class Transfer {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'varchar', length: 50 })
    transactionId: string;

    @Column('decimal')
    amount: number; 

    @Column(
        {
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
            transformer: {
                to: (value: number) => value,
                from: (value: string) => parseFloat(value)
            }
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
                from: (value: string) => parseFloat(value)
            }
        }
    )
    debit: number;

    @Column()
    message: string;

    @Column({    
        type: 'enum',
        enum: Currency,
    })
    @IsNotEmpty()
    currencyType: Currency; 

    fromCurrency: string;
    toCurrency: string;

    @Column('decimal')
    exchangeRate: number;

    @ManyToOne(() => Account)
    @JoinColumn({ name: 'sourceAccountId' })
    sourceAccount: Account;

    @ManyToOne(() => Account)
    @JoinColumn({ name: 'destinationAccountId' })
    destinationAccount: Account;
}
