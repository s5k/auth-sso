import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { mailerConfig } from './config/mailer.config';

@Module({
  imports: [
    MailerModule.forRoot({
      ...mailerConfig.toObject(),
      template: {
        dir: join(__dirname, 'template'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class MailModule {}
