import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { authConfig } from '../config/auth.config';

@Injectable()
export class GoogleAuthService {
  async getUser(accessToken: string) {
    const client = new google.auth.OAuth2(
      authConfig.google.appId as string,
      authConfig.google.appSecret,
    );

    client.setCredentials({ id_token: accessToken, access_token: accessToken });

    const data = await client.verifyIdToken({
      idToken: accessToken,
      audience: authConfig.google.appId as string,
    });

    return { ...data.getPayload(), id: data.getPayload().sub };
  }
}
