import { test, expect } from '@jest/globals';
import { randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { signToken, verifyToken } from '../../../src/utils/token.js';
process.env.JWT_SECRET=randomBytes(32).toString('hex');
test('JWT válido y rechazo de algoritmo, emisor y audiencia incorrectos', () => {
 const subject='507f1f77bcf86cd799439011';
 expect(verifyToken(signToken(subject)).sub).toBe(subject);
 const base={subject,issuer:'taskflow-api',audience:'taskflow-client',expiresIn:'15m'};
 for(const override of [{algorithm:'HS384'},{issuer:'otro'},{audience:'otra'}])
  expect(()=>verifyToken(jwt.sign({},process.env.JWT_SECRET,{...base,...override}))).toThrow();
});
