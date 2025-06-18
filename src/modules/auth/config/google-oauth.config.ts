import { registerAs } from '@nestjs/config';

export default registerAs('google0Auth', () => ({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}));
