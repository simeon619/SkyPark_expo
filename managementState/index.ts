import { io } from 'socket.io-client';
import { getMyStringValue, removeValue, setStringValue } from '../Utilis/functions/localStorage';
import createSQueryFrom from '../lib/SQueryClient';
import { CacheValues, Controller, Descriptions } from './server/Descriptions';

const socket = io('http://192.168.1.13:3500', {
  extraHeaders: {},
});

console.log('🚀 ~ file: index.ts:15 ~ process.env:', process.env);

export const SQuery = createSQueryFrom(Descriptions, CacheValues, Controller, {
  socket: socket,
  async getCookie() {
    const cookie = await getMyStringValue('@cookie');
    console.log('🚀 ~ file: index.ts:15 ~ getCookie ~ cookie:', cookie);
    if (cookie)
      socket.io.opts.extraHeaders = {
        ...socket.io.opts.extraHeaders,
        cookie,
      };
    return cookie || '';
  },

  async setCookie(cookie) {
    console.log({ cookie });
    removeValue('@cookie');
    try {
      setStringValue('@cookie', cookie);
      socket.io.opts.extraHeaders = {
        ...socket.io.opts.extraHeaders,
        cookie,
      };
    } catch (error) {
      console.log('Error storing cookie:', error);
    }
  },
});
