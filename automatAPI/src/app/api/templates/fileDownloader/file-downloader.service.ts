import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/env';

@Injectable({
  providedIn: 'root',
})
export class FileDownloaderService {
  constructor(private http: HttpClient) {}

  downloadFile(token: string, fileName: string) {
    const path = `${environment.awsRoute}${environment.awsBucket}${environment.awsTemplates}/${token}`;
    this.http.get(path, { responseType: 'blob' }).subscribe((res) => {
      saveAs(res, `${fileName}.zip`);
    });
  }
}
