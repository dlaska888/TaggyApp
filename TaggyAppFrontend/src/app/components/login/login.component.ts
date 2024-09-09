import { TaggyAppApiService } from './../../services/taggyAppApi.service';
import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { SocialAuthService } from '@abacritt/angularx-social-login';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExternalAuthDto } from '../../models/dtos/auth/externalAuthDto';
import { LocalStorageService } from '../../services/localStorageService';
import { AuthService } from '../../services/authService';
import { HttpResponse } from '@angular/common/http';
import { TokenDto } from '../../models/dtos/auth/tokenDto';
import { LocalStorageConstant } from '../../constants/localStorage.constant';
import { Router, RouterModule } from '@angular/router';
import { PathConstant } from '../../constants/path.constant';

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
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {

  pathConst = PathConstant;

  constructor(
    private api: TaggyAppApiService,
    private socialAuthService: SocialAuthService,
    private authService: AuthService,
    private router: Router
  ) {}

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

  ngOnInit() {
    this.tryNavigateToDashboard();
    this.socialAuthService.authState.subscribe((user) => {
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
    this.authService.tryAuthenticateUser().then((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate([PathConstant.DASHBOARD]);
      }
    });
  }
}
