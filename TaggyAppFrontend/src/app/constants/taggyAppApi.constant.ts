import { environment } from "../../environments/environment.development";

export class TaggyAppApiConstant {
    public static readonly LOGIN = environment.taggyappApi.url + '/auth/login';
    public static readonly REGISTER = environment.taggyappApi.url + '/auth/register';
    public static readonly GOOGLE_LOGIN = environment.taggyappApi.url + '/auth/google-login';
};