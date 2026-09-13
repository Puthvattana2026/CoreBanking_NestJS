import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { Account } from './features/account/entity/account.entity';
import { Transfer } from './features/transfer/entity/transfer.entity';
import { Transaction } from './features/transfer/entity/transaction.entity';
import { TransferModule } from './features/transfer/transfer.module';
import { AccountModule} from './features/account/account.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'vattanaputh_test',
      password: 'nanaSQL',
      database: 'nest',
      entities: [Account, Transfer, Transaction],
      synchronize: true
    }),
    AccountModule,
    TransferModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
