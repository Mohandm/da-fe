import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Patient } from './modal';
import { AuthService } from './service/auth.service';

const httpOptions = {
  headers: new HttpHeaders(),
};

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private apiUrl: String =
    //'http://ec2-54-255-140-128.ap-southeast-1.compute.amazonaws.com:8080/v1/patients/';
    'http://localhost:8080/v1/patients/';

  create(data: Patient): Observable<any> {
    return this.http
      .post<Patient>(this.apiUrl + '', data, this.getHeader())
      .pipe(catchError(this.handleError<any>('create')));
  }

  edit(id: string): Observable<Patient> {
    return this.http
      .get<Patient>(this.apiUrl + id, this.getHeader())
      .pipe(catchError(this.handleError<Patient>('edit')));
  }

  update(data: Patient): Observable<any> {
    return this.http
      .put<Patient>(this.apiUrl + data.id.toString(), data, this.getHeader())
      .pipe(catchError(this.handleError<any>('update')));
  }

  softDelete(id: number) {
    const data = { status: 'DELETED' };
    return this.http
      .patch<Patient>(this.apiUrl + id.toString(), data, this.getHeader())
      .pipe(catchError(this.handleError<any>('soft delete')));
  }

  getPatients(page: number, size: number): Observable<any> {
    return this.http.get<any>(
      this.apiUrl + '?page=' + page + '&size=' + size,
      this.getHeader()
    );
  }

  delete(id: number): Observable<any> {
    return this.http
      .delete<Patient>(this.apiUrl + id.toString(), this.getHeader())
      .pipe(catchError(this.handleError<any>('update')));
  }

  private getHeader() {
    httpOptions.headers = httpOptions.headers.set(
      'Authorization',
      'Bearer ' + this.authService.getToken()
    );
    return httpOptions;
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
