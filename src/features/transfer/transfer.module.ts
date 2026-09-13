import { Module } from '@nestjs/common';
import { TransferServiceImpl } from './service/impl/TransferServiceImpl';
import { TransferRepository } from './repository/TransferRepository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transfer } from './entity/transfer.entity';
import { Transaction } from './entity/transaction.entity';
import { TransferController } from './controller/TransferController';
import { TransactionController } from './controller/TransactionController';
import { TransferMapper } from './mapper/TransferMapper';
import { TransactionMapper } from './mapper/TrasactionMapper';
import { AccountModule } from '../account/account.module';
import { TransactionServiceImpl } from './service/impl/transactionServiceImpl';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [Transfer, Transaction]
    ), 
    AccountModule
  ], 
  controllers: [TransferController, TransactionController],
  providers: [
    TransferRepository, 
    TransferMapper,
    TransactionMapper,
      {
          provide: 'TransferService',
          useClass: TransferServiceImpl,
      },
      {
          provide: 'TransactionService',
          useClass: TransactionServiceImpl,
      },
    ],
})
export class TransferModule {

}
