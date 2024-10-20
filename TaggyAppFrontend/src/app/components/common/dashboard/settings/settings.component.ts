import { CommonModule } from '@angular/common';
import { UserStateService } from './../../../../services/userStateService';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { GetAccountDto } from '../../../../models/dtos/account/getAccountDto';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'settings',
  standalone: true,
  imports: [CommonModule, ButtonModule, ProgressSpinnerModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent implements OnInit {
  user!: GetAccountDto;

  constructor(private userState: UserStateService) {}

  ngOnInit(): void {
    this.userState.getUser$().subscribe((user) => {
      if (!user) return;
      this.user = user;
    });
  }
}
