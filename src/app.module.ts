import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import { Account } from './features/account/entity/account.entity';
import { Transfer } from './features/transfer/entity/transfer.entity';
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
      entities: [Account, Transfer],
      synchronize: true
    }),
    AccountModule,
    TransferModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
