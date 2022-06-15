require('dotenv').config();
export const COOKIE_NAME = 'beematie-cookie'
export const __prod__ = (process.env.NODE_ENV === 'production')