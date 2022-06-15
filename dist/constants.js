"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__prod__ = exports.COOKIE_NAME = void 0;
require('dotenv').config();
exports.COOKIE_NAME = 'beematie-cookie';
exports.__prod__ = (process.env.NODE_ENV === 'production');
//# sourceMappingURL=constants.js.map