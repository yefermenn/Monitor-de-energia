import { Test, TestingModule } from '@nestjs/testing';
import { MedidorController } from './medidor.controller';

describe('MedidorController', () => {
  let controller: MedidorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedidorController],
    }).compile();

    controller = module.get<MedidorController>(MedidorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
