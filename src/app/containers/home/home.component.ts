import { Component, OnInit } from '@angular/core';
import { ClientService, AuthService, FileSaverService } from '../../services';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [ClientService, FileSaverService]
})
export class HomeComponent implements OnInit {
  doc: any;
  constructor(
    private auth: AuthService,
    private client: ClientService,
    private saver: FileSaverService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.client.getInfo()
      .subscribe(
        r => this.doc = r,
        er => {
          this.logout();
        });
  }

  downloadXml() {
    if (this.doc.xmlFile) {
      this.saveFile(this.doc.xmlFile);
      return;
    }

    this.openSnackBar('Descargando XML');
    this.client.getXml()
    .subscribe(f => {
      this.doc.xmlFile = f;
      this.saveFile(f);
    });
  }

  downloadPdf() {
    if (this.doc.pdfFile) {
      this.saveFile(this.doc.pdfFile);
      return;
    }

    this.openSnackBar('Descargando PDF');
    this.client.getPdf()
    .subscribe(f => {
      this.doc.pdfFile = f;
      this.saveFile(f);
    });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
    });
  }

  logout() {
    this.auth.signOut();
  }

  getTipo(code: string) {
    switch (code) {
      case '03':
        return 'BOLETA ELECTRÓNICA';
      case '07':
        return 'NOTA DE CRÉDITO ELECTRÓNICA';
      case '08':
        return 'NOTA DE DÉBITO ELECTRÓNICA';
      default:
        return 'FACTURA ELECTRÓNICA';
    }
  }

  private saveFile(file) {
    this.saver.saveAs(file, this.doc.filename);
  }
}
