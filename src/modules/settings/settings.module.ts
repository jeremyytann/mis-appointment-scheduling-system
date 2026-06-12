import { Module } from '@nestjs/common';
import { Setting } from './entities/setting.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';

@Module({
  imports: [MikroOrmModule.forFeature([Setting])],
  providers: [SettingsService],
  controllers: [SettingsController],
  exports: [SettingsService],
})
export class SettingsModule {}