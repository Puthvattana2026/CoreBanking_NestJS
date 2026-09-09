import { Injectable } from '@nestjs/common';
import { Transfer } from '../entity/transfer.entity';
import { TransferRequest } from '../dto/TransferRequest.dto';

export interface TransferService {
    sendMoney(request: Transfer): Promise<Transfer>;
    getTransfer(id: string): Promise<Transfer | null>;
    getTransfers(): Promise<Transfer[]>;
}
