import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { UplaodFileResponseDto } from './dto/upload-file-reponse-dto';
import { ProvidersConfig } from './providers-config';

/**
 * Files service.
 */
@Injectable()
export class FilesService {
  private readonly filesApiUrl: string;

  /**
   * .ctor
   * @param http Http client.
   * @param config Config.
   */
  public constructor(private http: HttpClient, private config: ProvidersConfig) {
    this.filesApiUrl = `${config.apiRootEndpoint}/api/files`;
  }

  /**
   * Upload file
   * @param file Uploading file.
   */
  public upload(file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<UplaodFileResponseDto>(`${this.filesApiUrl}/file`, formData)
      .pipe(
        map(response => response.url),
      );
  }

  /**
   * Upload file as base64 data.
   * @param data FIle in Base64 encoding.
   * @param format File format.
   */
  public uploadBase64(data: string, format: string): Observable<string> {
    return this.http.post<UplaodFileResponseDto>
      (`${this.filesApiUrl}/base64`, { data: data, format: format })
      .pipe(
        map(response => response.url),
      );
  }

  /**
   * Upload svg.
   * @param data SVG data.
   */
  public uploadSvg(data: string): Observable<string> {
    return this.http.post<UplaodFileResponseDto>
      (`${this.filesApiUrl}/svg`, { data: data })
      .pipe(
        map(response => response.url),
      );
  }
}
