import jwt from 'jsonwebtoken';
const issuer = 'taskflow-api';
const audience = 'taskflow-client';
export function signToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, {
    algorithm: 'HS256', subject: String(userId), expiresIn: '15m', issuer, audience
  });
}
export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ['HS256'], issuer, audience
  });
}
