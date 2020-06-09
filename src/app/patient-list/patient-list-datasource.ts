import { DataSource, CollectionViewer } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, catchError, finalize } from 'rxjs/operators';
import {
  Observable,
  of as observableOf,
  merge,
  BehaviorSubject,
  of,
} from 'rxjs';
import { PatientService } from '../patient.service';
import { Patient } from '../modal';

// TODO: Replace this with your own data model type

/**
 * Data source for the PatientList view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class PatientListDataSource extends DataSource<Patient> {
  private patientSubject = new BehaviorSubject<Patient[]>([]);

  paginator: MatPaginator;
  sort: MatSort;
  totalElements;

  constructor(private patientService: PatientService) {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(collectionViewer: CollectionViewer): Observable<Patient[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    return this.patientSubject.asObservable();
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(collectionViewer: CollectionViewer): void {
    this.patientSubject.complete();
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */

  loadPatients(pageIndex: number, pageSize: number) {
    return this.patientService
      .getPatients(pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => true)
      )
      .subscribe((res) => {
        this.totalElements = res.totalElements;
        this.patientSubject.next(res.content);
      });
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: Patient[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'firstName':
          return compare(a.firstName, b.firstName, isAsc);
        case 'id':
          return compare(+a.id, +b.id, isAsc);
        default:
          return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
