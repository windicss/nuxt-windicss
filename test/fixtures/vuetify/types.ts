export interface ChatMessageAction {
  text: string
  // eslint-disable-next-line no-use-before-define
  callback (this: ChatMessage, action: this): void
}

export interface ChatMessageAttributes extends Object {
  userJoined: boolean
}

export default class ChatMessage {
  system: boolean = false
  id = String(Math.random())
  sent = false
  disabled = false
  actions: ChatMessageAction[] = []
  contentUrl: Promise<string> | false = false
  filename: string = ''
  isImage: boolean = false

  constructor (data: any) {
    Object.assign(this, data)
  }
}
