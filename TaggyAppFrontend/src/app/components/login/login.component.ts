import { TaggyAppApiService } from './../../services/taggyAppApi.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import {
  SocialLoginModule,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/authService';
import { HttpResponse } from '@angular/common/http';
import { TokenDto } from '../../models/dtos/auth/tokenDto';
import { Router, RouterModule } from '@angular/router';
import { PathConstant } from '../../constants/path.constant';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CardModule,
    CommonModule,
    FloatLabelModule,
    SocialLoginModule,
    GoogleSigninButtonModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  pathConst = PathConstant;

  loginForm = new FormGroup({
    userName: new FormControl(null, [
      Validators.required,
      Validators.maxLength(255),
    ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.maxLength(255),
    ]),
  });

  constructor(
    private api: TaggyAppApiService,
    private socialAuth: SocialAuthService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.tryNavigateToDashboard();
    this.socialAuth.authState.pipe(untilDestroyed(this)).subscribe((user) => {
      if (!user) return;
      this.api
        .googleLogin({
          provider: user.provider,
          idToken: user.idToken,
        })
        .subscribe(async (response: HttpResponse<TokenDto>) => {
          if (!response.ok || !response.body) {
            console.error(response);
            return;
          }
          this.authService.setTokens(response.body);
          this.tryNavigateToDashboard();
        });
    });
  }

  ngOnDestroy() {
    this.socialAuth.signOut();
  }

  onSubmit() {
    this.api
      .login({
        userName: this.loginForm.value.userName!,
        password: this.loginForm.value.password!,
      })
      .subscribe((response: HttpResponse<TokenDto>) => {
        if (!response.ok || !response.body) {
          console.error(response);
          return;
        }
        this.authService.setTokens(response.body);
        this.tryNavigateToDashboard();
      });
  }

  private tryNavigateToDashboard() {
    this.router.navigate([PathConstant.DASHBOARD]);
  }
}
