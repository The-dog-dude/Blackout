class AblyChat extends AblyBaseComponent {
  static get observedAttributes() {
    return ['messages'];
  }
  
  get messages() {
    const val = this.getAttribute('messages') || "[]"; 
    return JSON.parse(val);
  }

  set messages(messages) {
    this.setAttribute('messages', JSON.stringify(messages));
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback();
    super.subscribe('chat', 'chat-message', (message) => {
      this.onAblyMessageReceived(message);
    });
    this.renderTemplateAndRegisterClickHandlers();
    this.inputBox.focus();
  }

  onAblyMessageReceived(message) {
    const history = this.messages.slice(-199);
    const updatedMessages = [...history, message];
    this.messages = updatedMessages;
  }

  sendChatMessage(messageText) {
    super.publish("chat", { name: "chat-message", data: messageText });
    this.inputBox.value = "";
    this.inputBox.focus();
  }
}

customElements.define('ably-chat', AblyChat);
