import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  public BaseUrl = environment.BaseUrl;

  constructor(private http: HttpClient) {}

  postData(url: string, data: any) {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.http.post(this.BaseUrl + url, data, headers);
  }

  putData(url: string, data: any) {
    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    return this.http.put<any>(this.BaseUrl + url, data, headers);
  }

  getData(url: string) {
    let token = localStorage.getItem('access_token') ? localStorage.getItem('access_token') : '';

    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Token: `${token}`,
      }),
    };
    return this.http.get<any>(this.BaseUrl + url, headers);
  }

  deleteData(url: string) {
    let token = localStorage.getItem('access_token') ? localStorage.getItem('access_token') : '';

    const headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Token: `${token}`
      }),
    };
    return this.http.delete<any>(this.BaseUrl + url, headers);
  }

}
