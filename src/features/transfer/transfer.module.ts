import { Module } from '@nestjs/common';
import { TransferServiceImpl } from './service/impl/TransferServiceImpl';
import { TransferRepository } from './repository/TransferRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transfer } from './entity/transfer.entity';
import { TransferController } from './controller/TransferController';
import { TransferMapper } from './mapper/TransferMapper';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transfer]), 
    AccountModule
  ], 
  controllers: [TransferController],
  providers: [
    TransferRepository, 
    TransferMapper,
    {
        provide: 'TransferService',
        useClass: TransferServiceImpl,
    }],
})
export class TransferModule {

}
