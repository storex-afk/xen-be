/* eslint-disable @typescript-eslint/no-unused-vars */
import { DynamicModule, Module } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheModule as NestJSCacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisClientOptions, createClient } from 'redis';
import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';

// export const cacheManagerOptions: CacheModuleAsyncOptions<RedisClientOptions> =
//   {
//     useFactory: async (configService: ConfigService) => ({
//       store: createClient({
//         password: configService.get('REDIS_PASSWORD'),
//         socket: {
//           host: configService.get('REDIS_HOST'),
//           port: +configService.get('REDIS_PORT'),
//         },
//       }),
//     }),
//     inject: [ConfigService],
//   };

export const RedisOptions: CacheModuleAsyncOptions = {
  isGlobal: true,
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const store = createClient({
      password: configService.get('REDIS_PASSWORD'),
      socket: {
        host: configService.get('REDIS_HOST'),
        port: +configService.get('REDIS_PORT'),
      },
    });
    await store.connect().catch(console.error);
    return { store, ttl: 10 * 3000 };
  },
  inject: [ConfigService],
};

@Module({})
export class CacheModule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static register(_storeName: string): DynamicModule {
    return {
      providers: [CacheService],
      imports: [NestJSCacheModule.registerAsync(RedisOptions)],
      exports: [CacheService],
      module: CacheModule,
    };
  }
}
