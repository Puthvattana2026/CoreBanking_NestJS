import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UUID } from "typeorm/driver/mongodb/bson.typings.js";
import { AccountType } from "../enums/AccountType";
import { IsNotEmpty } from "class-validator";
import { Transfer } from "../../transfer/entity/transfer.entity";

@Entity()
export class Account {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: false})
    accountNumber: number;

    @OneToMany(() => Transfer, (transfer) => transfer.account)
    transfers: Transfer[];

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
}
