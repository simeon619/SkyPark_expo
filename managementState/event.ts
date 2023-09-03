import EventEmitter from 'eventemitter3';

const eventEmitter = new EventEmitter();

export default eventEmitter;

export const EventMessageType = {
  sendMessage: 'sendMessage',
  connexionAvailable: 'connexionAvailable',
  receiveMessage: 'receiveMessage',
  sentMessage: 'sentMessage',
} as const;
