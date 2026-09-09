import { Test, TestingModule } from '@nestjs/testing';
import { TransferService } from './transfer.service';
import { TransferServiceImpl } from './impl/TransferServiceImpl';

describe('ServiceService', () => {
  let service: TransferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransferServiceImpl],
    }).compile();

    service = module.get<TransferService>(TransferServiceImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
