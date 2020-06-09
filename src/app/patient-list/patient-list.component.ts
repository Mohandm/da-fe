import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { PatientListDataSource } from './patient-list-datasource';
import { PatientService } from '../patient.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Patient } from '../modal';
import { tap } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css'],
})
export class PatientListComponent implements AfterViewInit, OnInit {
  constructor(
    private patientService: PatientService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router
  ) {}
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<Patient>;
  dataSource: PatientListDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['id', 'firstName', 'status', 'actions'];

  ngOnInit() {
    this.dataSource = new PatientListDataSource(this.patientService);
    this.dataSource.loadPatients(0, 10);
  }

  ngAfterViewInit() {
    this.paginator.page.pipe(tap(() => this.loadPatientPage())).subscribe();
  }

  loadPatientPage() {
    this.dataSource.loadPatients(
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }

  delete(id: number) {
    this.patientService.delete(id).subscribe((result) => {
      this.snackBar.open('Deleted', 'ok', {
        duration: 2000,
      });
      this.loadPatientPage();
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
