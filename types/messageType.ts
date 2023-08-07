interface MessageStatus {
  send: number | null;
  received: number | null;
  seen: number | null;
}

export interface Message {
  date: number;
  text: string;
  owner: boolean;
  status: MessageStatus;
}
