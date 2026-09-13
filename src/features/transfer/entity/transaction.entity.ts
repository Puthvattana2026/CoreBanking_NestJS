import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Transfer } from "./transfer.entity";
import { Account } from "../../account/entity/account.entity";

@Entity()
export class Transaction {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { default: 5 })
    dailyLimitAmount: number; // input

    @Column({ default: 1 })
    limitPerDay: number; // input

    @Column('decimal', { default: 5 })
    amountMinBetweenMax: number; // condition

    @ManyToOne(() => Account)
    @JoinColumn({ name: 'accountId' })
    account: Account;
}