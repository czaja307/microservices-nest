import { Module } from '@nestjs/common';
import { ReviewController } from './review/review.controller';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule],
  controllers: [ReviewController],
  providers: [],
})
export class ReviewModule {}
