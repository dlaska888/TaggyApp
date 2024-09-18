import { environment } from "../../environments/environment.development";

export class TaggyAppApiConstant {
    public static readonly LOGIN = environment.taggyappApi.url + '/auth/login';
    public static readonly REGISTER = environment.taggyappApi.url + '/auth/register';
    public static readonly GOOGLE_LOGIN = environment.taggyappApi.url + '/auth/google-login';
    public static readonly REFRESH_TOKEN = environment.taggyappApi.url + '/auth/refresh';
    public static readonly ACCOUNT = environment.taggyappApi.url + '/account';
    public static readonly FILE = environment.taggyappApi.url + '/file';
    public static readonly GROUP = environment.taggyappApi.url + '/group';
    public static readonly UPLOAD_FILE = environment.taggyappApi.url + '/blob/upload-block';
    // public static readonly UPLOAD_FILE = 'https://www.primefaces.org/cdn/api/upload.php';
};