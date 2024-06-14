import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  UseInterceptors,
  BadRequestException,
  InternalServerErrorException,
  UploadedFile,
} from '@nestjs/common';
import { WalletService } from 'src/wallet/wallet.service';
import { ObjectId } from 'mongodb';
import { FileInterceptor } from '@nestjs/platform-express';
// import { memoryStorage } from 'multer';
import { AdminService } from './admin.service';
@Controller('admin')
export class AdminController {
  constructor(
    private walletService: WalletService,
    private adminService: AdminService,
  ) {}

  @Post('confirm-deposit/:id')
  async confirmDeposit() {
    // send email to user about transaction it was either not confirm or confirmed
  }

  @Post('confirm-withdrawal/:id')
  async confirmWithdrawal() {
    // send email to user
  }

  @Get('users')
  async getUsers() {}

  @Get('user/:userId/challenge')
  async getUserPortfolio() {}

  @Put('user/:userId/challenge/:challengeId')
  async updateUserPortfolio() {}

  @Post('user/:userId/challenge/:challengeId/trade')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { files: 1, fileSize: 1024 * 1024 * 5 }, // 1 MB you can adjust size here
      fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['text/csv'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          cb(new BadRequestException('Invalid file type'), false);
        } else if (file?.size > 1024 * 1024 * 5) {
          // 1MB
          cb(
            new BadRequestException('Max File Size Reached. Max Allowed: 1MB'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  async uploadCsvFile(
    @UploadedFile() file: Express.Multer.File,
    @Param() params,
  ): Promise<any> {
    try {
      return await this.adminService.parse(file, params);
    } catch (e) {
      throw new InternalServerErrorException(
        e?.message || 'Internal Server Error',
      );
    }
  }

  @Post('create-wallet/:userId')
  async getWallet(@Param('userId') userId) {
    return await this.walletService.createWallet(new ObjectId(userId));
  }
}
