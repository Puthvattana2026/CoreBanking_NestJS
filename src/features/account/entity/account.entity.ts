import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UUID } from "typeorm/driver/mongodb/bson.typings.js";
import { AccountType } from "../enums/AccountType";
import { IsNotEmpty } from "class-validator";

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
}
