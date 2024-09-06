import { HttpClient } from '@angular/common/http';
import { TaggyAppApiConstant } from '../constants/taggyAppApi.constant';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoginDto } from '../models/auth/loginDto';
import { RegisterDto } from '../models/auth/registerDto';
import { ExternalAuthDto } from '../models/auth/externalAuthDto';

@Injectable({
  providedIn: 'root',
})
export class TaggyAppApiService {
  constructor(private http: HttpClient) {}

  public login(loginDto: LoginDto): Observable<any> {
    return this.http.post(TaggyAppApiConstant.LOGIN, loginDto);
  }

  public register(registerDto: RegisterDto): Observable<any> {
    return this.http.post(TaggyAppApiConstant.REGISTER, registerDto);
  }

  public googleLogin(externalAuthDto: ExternalAuthDto): Observable<any> {
    return this.http.post(TaggyAppApiConstant.GOOGLE_LOGIN, externalAuthDto);
  }
}
