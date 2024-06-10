import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private httpService: HttpService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('country')
  async get() {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`https://api.flutterwave.com/v3/banks/NG`, {
          headers: {},
        })
        .pipe(
          catchError((error) => {
            throw `An error happened. Msg: ${JSON.stringify(
              error?.response?.data,
            )}`;
          }),
        ),
    );

    return data;
  }
}
