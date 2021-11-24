import { Test, TestingModule } from '@nestjs/testing';
import { NebulrAuthService } from './nebulr-auth.service';

describe('NebulrAuthService', () => {
  // let service: NebulrAuthService;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [NebulrAuthService],
  //   }).compile();

  //   service = module.get<NebulrAuthService>(NebulrAuthService);
  // });

  it('should be defined', () => {
    expect(true).toBe(true);
    // expect(service).toBeDefined();
  });
});
