import { Component } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Patient } from '../modal';
import { PatientService } from '../patient.service';

@Component({
  selector: 'app-form',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css'],
})
export class PatientComponent {
  addressForm = this.fb.group({
    id: [null],
    firstName: [null, Validators.required],
    lastName: [null, Validators.required],
    contactNumber: [null, Validators.required],
    status: [null],
    addresses: this.fb.array([]),
  });

  patient: Patient;

  isNew: boolean;

  showStatus: boolean = false;

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.isNew = true;
      this.addAddressForm();
    } else {
      this.isNew = false;
      this.patientService.edit(id).subscribe(this.populateData);
    }
  }

  private populateData = (data: Patient): void => {
    this.patient = data;
    const { id, firstName, lastName, contactNumber, status, addresses } = data;
    addresses.forEach((address) => {
      this.addAddressForm();
    });
    if(status === 'DELETED') {
      this.showStatus = true;
    }
    this.addressForm.patchValue({
      id,
      firstName,
      lastName,
      contactNumber,
      status,
      addresses,
    });
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private snackBar: MatSnackBar
  ) {}

  get addresses() {
    return this.addressForm.get('addresses') as FormArray;
  }
  addAddressForm() {
    this.addresses.push(this.buildAddress());
  }

  buildAddress() {
    return this.fb.group({
      id: [null],
      addressLine1: [null, Validators.required],
      addressLine2: [null, Validators.required],
      city: [null, Validators.required],
      country: [null, Validators.required],
      postalCode: [null, Validators.required]
    });
  }

  onSubmit(form: any) {
    this.patient = { ...this.patient, ...form };
    if (this.addressForm.valid) {
      if (!this.isNew) {
        this.patientService.update(this.patient).subscribe((result) => {
          this.snackBar.open('Updated', 'ok', {
            duration: 2000,
          });
          this.router.navigate(['/list']);
        });
      } else {
        this.patientService.create(this.patient).subscribe((result) => {
          this.snackBar.open('Created', 'ok', {
            duration: 2000,
          });
          this.router.navigate(['/list']);
        });
      }
    }
  }

  softDelete() {
    this.patientService
      .softDelete(this.addressForm.controls['id'].value)
      .subscribe((result) => {
        this.snackBar.open('Soft Deleted', 'ok', {
          duration: 2000,
        });
        this.router.navigate(['/list']);
      });
  }
}
