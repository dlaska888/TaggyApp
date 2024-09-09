import { HttpContextToken } from '@angular/common/http';

export class ApiTokenConstant {
  public static IS_PUBLIC_API = new HttpContextToken<boolean>(() => false);
  public static REFRESH_OFFSET = 5; // in seconds
}
