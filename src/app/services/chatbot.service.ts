import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

declare global {
  interface Window {
    StackAI: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

 private chatbotSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor() {
    this.initChatbot();
  }

  private initChatbot(): void {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/react-stackai@latest/dist/vanilla/vanilla-stackai.js';
    script.setAttribute('data-project-url','https://www.stack-ai.com/embed/96b85f2c-b430-4279-9b5c-d167f62070c4/88866e6b-4b7d-4f65-b463-98e330bef81c/66c74b3031cbf0b98022044b');
    script.onload = () => {
      if (window.StackAI) {
        const chatbot = new window.StackAI();
        this.chatbotSubject.next(chatbot);
      }
    };
    document.body.appendChild(script);
  }

  getChatbot(): Observable<any> {
    return this.chatbotSubject.asObservable();
  }

  openChat(): void {
    const chatbot = this.chatbotSubject.getValue();
    if (chatbot) {
      chatbot.open();
    }
  }

  closeChat(): void {
    const chatbot = this.chatbotSubject.getValue();
    if (chatbot) {
      chatbot.close();
    }
  }
}
