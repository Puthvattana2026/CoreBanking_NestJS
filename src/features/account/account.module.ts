import { Module } from '@nestjs/common';
import { AccountServiceImpl } from './service/impl/accountServiceImpl';
import { AccountRepository } from './repository/AccountRepository';
import { AccountMapper } from './mapper/AccountMapper';
import { AccountController } from './controller/AccountController';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entity/account.entity';

@Module(
    {
        imports: [TypeOrmModule.forFeature([Account])],
        controllers: [AccountController],
        exports: [AccountRepository],
        providers: [
            AccountRepository,
            AccountMapper,
            {
                provide: 'AccountService',
                useClass: AccountServiceImpl
            }
        ]
    }
)
export class AccountModule {
    
}
