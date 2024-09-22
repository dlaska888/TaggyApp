import {
  HttpClient,
  HttpContext,
  HttpContextToken,
  HttpEvent,
  HttpParams,
  HttpParamsOptions,
  HttpResponse,
} from '@angular/common/http';
import { TaggyAppApiConstant } from '../constants/taggyAppApi.constant';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { LoginDto } from '../models/dtos/auth/loginDto';
import { RegisterDto } from '../models/dtos/auth/registerDto';
import { ExternalAuthDto } from '../models/dtos/auth/externalAuthDto';
import { TokenDto } from '../models/dtos/auth/tokenDto';
import { GetAccountDto } from '../models/dtos/account/getAccountDto';
import { ApiTokenConstant } from '../constants/apiToken.constant';
import { GetFileDto } from '../models/dtos/file/getFileDto';
import { PagedResults } from '../models/dtos/pagedResults';
import { GetGroupDto } from '../models/dtos/group/getGroupDto';
import { SieveModelDto } from '../models/dtos/sieveModelDto';

@Injectable({
  providedIn: 'root',
})
export class TaggyAppApiService {
  constructor(private http: HttpClient) {}

  public login(loginDto: LoginDto): Observable<HttpResponse<TokenDto>> {
    return this.http.post<TokenDto>(TaggyAppApiConstant.LOGIN, loginDto, {
      observe: 'response',
      context: new HttpContext().set(ApiTokenConstant.IS_PUBLIC_API, true),
    });
  }

  public register(
    registerDto: RegisterDto
  ): Observable<HttpResponse<TokenDto>> {
    return this.http.post<TokenDto>(TaggyAppApiConstant.REGISTER, registerDto, {
      observe: 'response',
      context: new HttpContext().set(ApiTokenConstant.IS_PUBLIC_API, true),
    });
  }

  public googleLogin(
    externalAuthDto: ExternalAuthDto
  ): Observable<HttpResponse<TokenDto>> {
    return this.http.post<TokenDto>(
      TaggyAppApiConstant.GOOGLE_LOGIN,
      externalAuthDto,
      {
        observe: 'response',
        context: new HttpContext().set(ApiTokenConstant.IS_PUBLIC_API, true),
      }
    );
  }

  public refreshToken(
    refreshToken: string
  ): Observable<HttpResponse<TokenDto>> {
    return this.http.post<TokenDto>(
      TaggyAppApiConstant.REFRESH_TOKEN,
      JSON.stringify(refreshToken),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        observe: 'response',
        context: new HttpContext().set(ApiTokenConstant.IS_PUBLIC_API, true),
      }
    );
  }

  public getAccount(): Observable<HttpResponse<GetAccountDto>> {
    return this.http.get<GetAccountDto>(TaggyAppApiConstant.ACCOUNT, {
      observe: 'response',
    });
  }

  public getUserFiles(
    query: SieveModelDto
  ): Observable<HttpResponse<PagedResults<GetFileDto>>> {
    let params = new HttpParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params = params.set(key, value.toString());
      }
    });

    return this.http.get<PagedResults<GetFileDto>>(TaggyAppApiConstant.FILE, {
      observe: 'response',
      params: params
    });
  }

  public getUserGroups(): Observable<HttpResponse<PagedResults<GetGroupDto>>> {
    return this.http.get<PagedResults<GetGroupDto>>(TaggyAppApiConstant.GROUP, {
      observe: 'response',
      params: new HttpParams(),
    });
  }

  public uploadFile(
    groupId: string,
    formData: FormData
  ): Observable<HttpEvent<any>> {
    return this.http.post(
      `${TaggyAppApiConstant.GROUP}/${groupId}/file`,
      formData,
      {
        reportProgress: true,
        observe: 'events',
      }
    );
  }
}
