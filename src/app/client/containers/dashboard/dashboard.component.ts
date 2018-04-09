import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { LocalDataSource } from 'ng2-smart-table';
import { DocumentService } from '../../services';
import { FileSaverService } from '../../../shared/services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild("filterForm") form: NgForm;
  filter: any = {};
  currentDoc: any;
  tipoDocs = [
    {value: '01', viewValue: 'Factura'},
    {value: '03', viewValue: 'Boleta'},
    {value: '07', viewValue: 'Nota de Crédito'},
    {value: '08', viewValue: 'Nota de Débito'}
  ];
  docSiglas = {
    '01': 'FAC',
    '03': 'BOL',
    '07': 'NCR',
    '08': 'NDB',
  };
  settings = null;

  data = new LocalDataSource();;

  constructor (
    private api: DocumentService,
    private saver: FileSaverService,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.filter.start =
    this.filter.end = new Date();
    this.filter.tipoDoc = '';
    this.settings = this.getColumnSettings();
  }

  search() {
    if (!this.form.valid) {
      return;
    }

    this.api.filter(this.filter)
    .subscribe(values => this.data.load(values));
  }
  
  onSelect(event) {
    if (!event.isSelected) {
      this.currentDoc = null;
      return;
    }
    
    this.currentDoc = event.data;
  }

  downloadXml() {
    if (!this.checkSelectedDoc()) {
      return;
    }

    this.openSnackBar('Descargando XML');

    this.api.getXml(this.currentDoc.id)
    .subscribe(f => {
      this.saveFile(f);
    });
  }

  downloadPdf() {
    if (!this.checkSelectedDoc()) {
      return;
    }

    this.openSnackBar('Descargando PDF');

    this.api.getPdf(this.currentDoc.id)
    .subscribe(f => {
      this.saveFile(f);
    });
  }

  private getColumnSettings() {
    const siglas = this.docSiglas;

    return {
      actions: false,
      columns: {
        id: {
          title: 'ID'
        },
        tipo: {
          title: 'Tipo',
          valuePrepareFunction: function (cell, row) {
            if (siglas[cell]) {
              return siglas[cell];
            }
  
            return cell;
          }
        },
        serie: {
          title: 'Serie'
        },
        correlativo: {
          title: 'Correlativo'
        },
        fecha: {
          title: 'Fecha Emisión'
        },
        total: {
          title: 'Total'
        }
      }
    };
  }

  private checkSelectedDoc(): boolean {
    if (this.currentDoc) {
      return true;
    }
    this.openSnackBar('Seleccione un comprobante');

    return false;
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
    });
  }

  private saveFile(file) {
    this.saver.saveAs(file, this.currentDoc.filename);
  }
}
