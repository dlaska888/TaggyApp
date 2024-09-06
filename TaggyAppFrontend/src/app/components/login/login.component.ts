import { TaggyAppApiService } from './../../services/taggyAppApi.service';
import { Component } from '@angular/core';
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
import { ExternalAuthDto } from '../../models/auth/externalAuthDto';

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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(
    private api: TaggyAppApiService,
    private authService: SocialAuthService
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

  user!: any;
  loggedIn!: boolean;

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;
      if (user) {
        const externalAuth: ExternalAuthDto = {
          provider: user.provider,
          idToken: user.idToken,
        };
        this.api.googleLogin(externalAuth).subscribe((authToken: any) => {
          console.log(authToken);
        });
      }
      console.log(user);
    });
  }

  onSubmit() {
    this.api
      .login({
        userName: this.loginForm.value.userName!,
        password: this.loginForm.value.password!,
      })
      .subscribe((response) => {
        console.log(response);
      });
  }

  onGoogleLogin() {
    this.authService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then((x: any) => console.log(x));
  }

  signOut(): void {
    this.authService.signOut();
  }
}
