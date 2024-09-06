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
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ExternalAuthDto } from '../../models/auth/externalAuthDto';
import { passwordMatchValidator } from '../../validators/passwordMatch.validator';
import { passwordValidator } from '../../validators/password.validator';
import { TransConstant } from '../../constants/trans.constant';

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
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  constructor(
    private api: TaggyAppApiService,
    private authService: SocialAuthService
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
      .register({
        userName: this.registerForm.value.userName!,
        email: this.registerForm.value.email!,
        password: this.registerForm.value.password!,
        confirmPassword: this.registerForm.value.confirmPassword!,
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
}
