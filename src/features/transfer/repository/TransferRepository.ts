import { InjectRepository } from "@nestjs/typeorm";
import { MoreThanOrEqual, Repository } from "typeorm";
import { Account } from "../../account/entity/account.entity";
import { Transfer } from "../entity/transfer.entity";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TransferRepository {

    @InjectRepository(Transfer)
    private readonly transferRepository: Repository<Transfer>;

    findById(id: string): Promise<Transfer | null> {
        return this.transferRepository.findOne({ where: { id } });
    }

    findAll(): Promise<Transfer[]> {
        return this.transferRepository.find();
    }

    async getDailyOutgoingStats(accountId: string, startOfDay: Date): Promise<{ count: number; amount: number }> {
        const transfers = await this.transferRepository.find({
            where: {
                sourceAccount: { id: accountId },
                createdAt: MoreThanOrEqual(startOfDay),
            },
        });

        return {
            count: transfers.length,
            amount: transfers.reduce((total, transfer) => total + Number(transfer.debit || 0), 0),
        };
    }

    save(transfer: Transfer): Promise<Transfer> {
        return this.transferRepository.save(transfer);
    }
}