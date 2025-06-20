// welcome.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent  {

  // constructor() { }

  // ngOnInit(): void {
  //   this.loadExternalScript();
  // }

  // loadExternalScript(): void {
  //   const script = document.createElement('script');
  //   script.src = "https://unpkg.com/react-stackai@latest/dist/vanilla/vanilla-stackai.js";
  //   script.setAttribute('data-project-url', 'https://www.stack-ai.com/embed/96b85f2c-b430-4279-9b5c-d167f62070c4/88866e6b-4b7d-4f65-b463-98e330bef81c/66c74b3031cbf0b98022044b');
  //   script.async = true;
  //   document.body.appendChild(script);
  // }
}
