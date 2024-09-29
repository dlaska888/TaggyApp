import {
  HttpClient,
  HttpContext,
  HttpEvent,
  HttpParams,
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
import { UpdateFileDto } from '../models/dtos/file/updateFileDto';
import { CreateGroupDto } from '../models/dtos/group/createGroupDto';
import { UpdateGroupDto } from '../models/dtos/group/updateGroupDto';
import { GetGroupUserDto } from '../models/dtos/groupUser/getGroupUserDto';
import { CreateGroupUserDto } from '../models/dtos/groupUser/createGroupUserDto';
import { UpdateGroupUserDto } from '../models/dtos/groupUser/updateGroupUserDto';

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

  public getGroups(
    query: SieveModelDto = new SieveModelDto()
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

  public createGroup(dto: CreateGroupDto): Observable<HttpResponse<any>> {
    return this.http.post(`${TaggyAppApiConstant.GROUP}`, dto, {
      reportProgress: true,
      observe: 'response',
    });
  }

  public updateGroup(
    groupId: string,
    dto: UpdateGroupDto
  ): Observable<HttpResponse<GetGroupDto>> {
    return this.http.put<GetGroupDto>(
      `${TaggyAppApiConstant.GROUP}/${groupId}`,
      dto,
      {
        observe: 'response',
      }
    );
  }

  public deleteGroup(groupId: string): Observable<HttpResponse<any>> {
    return this.http.delete(`${TaggyAppApiConstant.GROUP}/${groupId}`, {
      observe: 'response',
    });
  }

  public getGroupUsers(
    groupId: string,
    query: SieveModelDto = new SieveModelDto()
  ): Observable<HttpResponse<PagedResults<GetGroupUserDto>>> {
    return this.http.get<PagedResults<GetGroupUserDto>>(
      `${TaggyAppApiConstant.GROUP}/${groupId}/group-user`,
      {
        observe: 'response',
        params: this.getQueryParams(query),
      }
    );
  }

  public getGroupUserById(
    groupId: string,
    groupUserId: string
  ): Observable<HttpResponse<GetGroupUserDto>> {
    return this.http.get<GetGroupUserDto>(
      `${TaggyAppApiConstant.GROUP}/${groupId}/group-user/${groupUserId}`,
      {
        observe: 'response',
      }
    );
  }

  public createGroupUser(
    groupId: string,
    dto: CreateGroupUserDto
  ): Observable<HttpResponse<GetGroupUserDto>> {
    return this.http.post<GetGroupUserDto>(
      `${TaggyAppApiConstant.GROUP}/${groupId}/group-user`,
      dto,
      {
        observe: 'response',
      }
    );
  }

  public updateGroupUser(
    groupId: string,
    groupUserId: string,
    dto: UpdateGroupUserDto
  ): Observable<HttpResponse<GetGroupUserDto>> {
    return this.http.put<GetGroupUserDto>(
      `${TaggyAppApiConstant.GROUP}/${groupId}/group-user/${groupUserId}`,
      dto,
      {
        observe: 'response',
      }
    );
  }

  public deleteGroupUser(
    groupId: string,
    groupUserId: string
  ): Observable<HttpResponse<any>> {
    return this.http.delete(
      `${TaggyAppApiConstant.GROUP}/${groupId}/group-user/${groupUserId}`,
      {
        observe: 'response',
      }
    );
  }

  public getGroupFiles(
    groupId: string,
    query: SieveModelDto = new SieveModelDto()
  ): Observable<HttpResponse<PagedResults<GetFileDto>>> {
    return this.http.get<PagedResults<GetFileDto>>(
      `${TaggyAppApiConstant.GROUP}/${groupId}/file`,
      {
        observe: 'response',
        params: this.getQueryParams(query),
      }
    );
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
