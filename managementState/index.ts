import { io } from 'socket.io-client';
import { getMyStringValue, removeValue, setStringValue } from '../Utilis/functions/localStorage';
import { HOST } from '../constants/Value';
import createSQueryFrom from '../lib/SQueryClient';
import { CacheValues, Controller, Descriptions } from './server/Descriptions';

const socket = io(HOST, {
  extraHeaders: {},
});

export const SQuery = createSQueryFrom(Descriptions, CacheValues, Controller, {
  socket: socket,
  async getCookie() {
    const cookie = await getMyStringValue('@cookie');
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
