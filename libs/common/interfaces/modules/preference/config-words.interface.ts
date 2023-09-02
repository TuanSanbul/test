export interface IUnavailableWord {
  id: string;
  prohibitedWord: string;

  filterWord: string;
}

export interface IMessageSetting {
  id: string;
  messageWelcome: string;
  messageReply: string;
}

export interface IUpdateMessage {
  id: string;
  message: string;
}
