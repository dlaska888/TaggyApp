import { MessageService } from 'primeng/api';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessagesModule } from 'primeng/messages';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MessagesModule, ButtonModule],
  templateUrl: './app.component.html',
})
export class AppComponent {}
