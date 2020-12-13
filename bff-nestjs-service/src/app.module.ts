import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { NestModule } from '@nestjs/common/interfaces/modules/nest-module.interface';

import { ListenAllMiddleware } from './middleware/listenAll.middleware';

@Module({
  imports: [
  ],
  controllers: [
  ],
  providers: [],
})
export class AppModule implements NestModule  {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ListenAllMiddleware).forRoutes({
      path: '/**', // For all routes
      method: RequestMethod.ALL, // For all methods
    });
  }

}
