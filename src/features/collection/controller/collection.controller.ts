import {
  Body,
  Controller,
  HttpException,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { environments } from 'src/environments/environments';
import { JwtAuthGuard } from 'src/features/auth/guard/jwt-auth.guard';
import { SharpPipe } from 'src/shared/pipe/sharp.pipe';
import { UploadFileInput } from '../dto/upload-file.input';

const uploadOptions = {
  fileFilter(req, file, callback) {
    if (!file.size || file.size > 1024 * 5) {
      return callback(new HttpException('File too large', 400), false);
    }

    if (!file.originalname.match(/\.(png|jpg|jpeg|webp)$/)) {
      return callback(
        // throw error to json response
        new HttpException(
          'Invalid file type, only allowed file type .png .jpg .jpeg .webp',
          400,
        ),
        false,
      );
    }
    return callback(null, true);
  },
};

@Controller('collection')
export class CollectionController {
  @Post('upload-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image', uploadOptions))
  async uploadImage(
    @Body() fileInput: UploadFileInput,
    @UploadedFile(SharpPipe) image: Express.Multer.File,
  ) {
    return {
      url: `${environments.backendUrl}/public/images/${image}`,
    };
  }
}
