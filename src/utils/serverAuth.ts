import jwt from 'jsonwebtoken';

export function getDecodedToken(req: Request) {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}
