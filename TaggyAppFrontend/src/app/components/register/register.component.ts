import { TaggyAppApiService } from './../../services/taggyAppApi.service';
import { Component } from '@angular/core';
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
import { ExternalAuthDto } from '../../models/dtos/auth/externalAuthDto';
import { passwordMatchValidator } from '../../validators/passwordMatch.validator';
import { passwordValidator } from '../../validators/password.validator';
import { TransConstant } from '../../constants/trans.constant';
import { AuthService } from '../../services/authService';
import { HttpResponse } from '@angular/common/http';
import { TokenDto } from '../../models/dtos/auth/tokenDto';
import { PathConstant } from '../../constants/path.constant';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {

  pathConst = PathConstant;

  constructor(
    private api: TaggyAppApiService,
    private socialAuthService: SocialAuthService,
    private authService: AuthService,
    private router: Router
  ) {}

  registerForm = new FormGroup(
    {
      userName: new FormControl(null, [
        Validators.required,
        Validators.maxLength(255),
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.maxLength(255),
        Validators.email,
      ]),
      password: new FormControl(null, [
        Validators.required,
        passwordValidator(),
      ]),
      confirmPassword: new FormControl(null, [Validators.required]),
    },
    passwordMatchValidator('password', 'confirmPassword')
  );

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
      .register({
        userName: this.registerForm.value.userName!,
        email: this.registerForm.value.email!,
        password: this.registerForm.value.password!,
        confirmPassword: this.registerForm.value.confirmPassword!,
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

  getPasswordErrors() {
    const control = this.registerForm.get('password');
    return Object.keys(TransConstant.PASSWORD).map((key) => {
      const transKey = key as keyof typeof TransConstant.PASSWORD;
      return {
        message: TransConstant.PASSWORD[transKey],
        isSet: control?.hasError(TransConstant.PASSWORD[transKey]),
      };
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
