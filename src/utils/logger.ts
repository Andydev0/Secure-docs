import { NextApiRequest } from 'next';
import prisma from '@/lib/prisma';
import UAParserModule from 'ua-parser-js';

const UAParser = UAParserModule as any; // Força o TypeScript a aceitar o tipo

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

const formatUserAgent = (userAgent: string): string => {
  try {
    console.log('User-Agent Original:', userAgent);
    
    const parser = new UAParser(userAgent);
    console.log('UAParser Instance:', parser);

    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();

    console.log('Browser:', browser);
    console.log('OS:', os);
    console.log('Device:', device);

    const deviceInfo = [];

    if (browser.name && browser.version) {
      deviceInfo.push(`${browser.name} ${browser.version}`);
    }

    if (os.name && os.version) {
      deviceInfo.push(`${os.name} ${os.version}`);
    }

    if (device.vendor || device.model) {
      const deviceString = [device.vendor, device.model]
        .filter(Boolean)
        .join(' ');
      if (deviceString) {
        deviceInfo.push(deviceString);
      }
    }

    const formattedInfo = deviceInfo.join(' | ');
    console.log('Formatted Device Info:', formattedInfo);

    return formattedInfo || 'Unknown';
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
  const userAgent = req.headers['user-agent'];
  const formattedUserAgent = userAgent ? formatUserAgent(userAgent) : 'Unknown';

  try {
    await prisma.log.create({
      data: {
        type,
        userId,
        postId,
        ip,
        userAgent: formattedUserAgent,
      },
    });
  } catch (error) {
    console.error('Error creating log:', error);
  }
};
