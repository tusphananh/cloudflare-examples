import { getAuth } from '@clerk/nextjs/server';
import { NextApiRequest } from 'next';

export const authMiddleware = (request: Request | NextApiRequest) => {
  const authInfo = getAuth(request as any);

  if (!authInfo.userId) {
    throw new Error('Unauthorized');
  }

  return authInfo;
};
