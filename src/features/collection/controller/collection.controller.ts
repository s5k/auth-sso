import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { environments } from 'src/environments/environments';
import { CurrentUser } from 'src/features/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/features/auth/guard/jwt-auth.guard';
import { User } from 'src/features/user/schema/user.schema';
import { SharpPipe } from 'src/shared/pipe/sharp.pipe';

@Controller('collection')
export class CollectionController {
  @Post('upload-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile(SharpPipe) image: Express.Multer.File) {
    return {
      url: `${environments.backendUrl}/public/images/${image}`,
    };
  }
}
