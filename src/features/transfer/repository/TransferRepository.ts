import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
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

    save(transfer: Transfer): Promise<Transfer> {
        return this.transferRepository.save(transfer);
    }
}