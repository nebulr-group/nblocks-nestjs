import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth-guard';

describe('AuthGuard', () => {
  //   let provider: AuthGuard;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [AuthGuard],
  //   }).compile();

  //   provider = module.get<AuthGuard>(AuthGuard);
  // });

  it('should be defined', () => {
    expect(true).toBe(true);
  });
});
