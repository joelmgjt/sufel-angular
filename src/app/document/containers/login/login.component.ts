import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services';
import { environment } from '../../../../environments/environment';
import { MatSnackBar, DateAdapter } from '@angular/material';
import { SpainDateAdapter } from '../../adapter/SpainDateAdapter';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [{provide: DateAdapter, useClass: SpainDateAdapter}]
})
export class LoginComponent implements OnInit {
  @ViewChild("docForm") docForm: NgForm;
  hasCompany = false;
  loading = false;
  maxDate = new Date();
  doc: any = {};
  logo= environment.logo;
  tipoDocs = [
    {value: '01', viewValue: 'Factura'},
    {value: '03', viewValue: 'Boleta'},
    {value: '07', viewValue: 'Nota de Crédito'},
    {value: '08', viewValue: 'Nota de Débito'}
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    public snackBar: MatSnackBar,
    private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('es');
  }

  ngOnInit() {
    if (environment.ruc) {
      this.hasCompany = true;
      this.doc.emisor = environment.ruc;
    }
    this.doc.tipo = '01';
    this.doc.fecha = new Date();
  }

  consult() {
    if (!this.docForm.valid) {
      return;
    }

    this.loading = true;
    this.auth.login(this.doc)
    .subscribe(r => {
      this.router.navigate(['/document']);
    }, er => this.showError('No se encontro resultados.'))
    .add(() => this.loading = false);
  }

  showError(message: string) {
    this.snackBar.open(message, 'ACEPTAR', {
      duration: 2000,
    });
  }
}