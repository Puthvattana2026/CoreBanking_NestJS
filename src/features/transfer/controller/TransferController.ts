import { Body, Controller, Get, Inject, Param, Post } from "@nestjs/common";
import { TransferMapper } from "../mapper/TransferMapper";
import { TransferRespone } from "../dto/TransferResponse.dto";
import { TransferRequest } from "../dto/TransferRequest.dto";
import type { TransferService } from '../service/transfer.service';
import { TransferServiceImpl } from "../service/impl/TransferServiceImpl";

@Controller('transfers')
export class TransferController {

    constructor(
        @Inject('TransferService') private readonly transferService: TransferService,
        private readonly transferMapper: TransferMapper,
    ) {}

    @Post()
    async sendMoney(@Body() request: TransferRequest): Promise<TransferRespone> {
        const transfer = this.transferMapper.toTransfer(request);
        const saved = await this.transferService.sendMoney(transfer);
        return this.transferMapper.toTransferResponse(saved);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.transferService.getTransfer(id);
    }
}