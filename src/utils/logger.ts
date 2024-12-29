import { NextApiRequest } from 'next';
import prisma from '@/lib/prisma';
import UAParserModule from 'ua-parser-js';

type LogType = 'LOGIN' | 'LOGOUT' | 'VIEW_POST' | 'CREATE_POST' | 'UPDATE_POST' | 'DELETE_POST';

const getClientIp = (req: NextApiRequest | any): string => {
  const forwarded = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];
  
  if (forwarded) {
    return forwarded.split(',')[0];
  }
  
  if (realIp) {
    return realIp;
  }
  
  return req.socket?.remoteAddress || 
         req.connection?.remoteAddress || 
         req.ip || 
         '0.0.0.0';
};

const formatUserAgent = (req: NextApiRequest | any): string => {
  try {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    return userAgent;
  } catch (error) {
    console.error('Error parsing user agent:', error);
    return 'Unknown';
  }
};

export const createLog = async (
  type: LogType,
  userId: string,
  req: NextApiRequest | any,
  postId?: string
) => {
  const ip = getClientIp(req);
  const userAgent = formatUserAgent(req);

  try {
    await prisma.log.create({
      data: {
        type,
        userId,
        postId,
        ip,
        userAgent,
      },
    });
  } catch (error) {
    console.error('Error creating log:', error);
  }
};
