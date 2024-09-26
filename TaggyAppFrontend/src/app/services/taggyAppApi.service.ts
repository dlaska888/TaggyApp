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
import { GetTagDto } from '../models/dtos/tag/getTagDto';
import { UpdateFileDto } from '../models/dtos/file/updateFileDto';

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
    return this.http.get<PagedResults<GetFileDto>>(TaggyAppApiConstant.FILE, {
      observe: 'response',
      params: this.getQueryParams(query),
    });
  }

  public getUserTags(
    query: SieveModelDto
  ): Observable<HttpResponse<PagedResults<GetTagDto>>> {
    return this.http.get<PagedResults<GetTagDto>>(TaggyAppApiConstant.TAG, {
      observe: 'response',
      params: this.getQueryParams(query),
    });
  }

  public getUserGroups(
    query: SieveModelDto
  ): Observable<HttpResponse<PagedResults<GetGroupDto>>> {
    return this.http.get<PagedResults<GetGroupDto>>(TaggyAppApiConstant.GROUP, {
      observe: 'response',
      params: this.getQueryParams(query),
    });
  }

  public getGroupById(id: string): Observable<HttpResponse<GetGroupDto>> {
    return this.http.get<GetGroupDto>(TaggyAppApiConstant.GROUP + `/${id}`, {
      observe: 'response',
    });
  }

  public createFile(
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

  public updateFile(
    groupId: string,
    fileId: string,
    dto: UpdateFileDto
  ): Observable<HttpResponse<GetFileDto>> {
    return this.http.put<GetFileDto>(
      `${TaggyAppApiConstant.GROUP}/${groupId}/file/${fileId}`,
      dto,
      {
        observe: 'response',
      }
    );
  }

  public deleteFile(
    groupId: string,
    fileId: string
  ): Observable<HttpResponse<any>> {
    return this.http.delete(
      `${TaggyAppApiConstant.GROUP}/${groupId}/file/${fileId}`,
      {
        observe: 'response',
      }
    );
  }

  private getQueryParams(query: SieveModelDto): HttpParams {
    let params = new HttpParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params = params.set(key, value.toString());
      }
    });

    return params;
  }
}
