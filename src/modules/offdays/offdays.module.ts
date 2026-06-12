import { Module } from '@nestjs/common';
import { OffdaysService } from './offdays.service';
import { OffdaysController } from './offdays.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Offday } from './entities/offday.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Offday])],
  controllers: [OffdaysController],
  providers: [OffdaysService],
  exports: [OffdaysService],
})
export class OffdaysModule {}