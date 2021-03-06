import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { NbMenuItem, NbSidebarService } from '@nebular/theme';
import { AuthService } from '../../services';
import { environment } from './../../../../environments/environment';

const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home',
    link: '/client/',
    home: true,
  },
  {
    title: 'Opciones',
    group: true,
  },
  {
    title: 'Perfil',
    icon: { icon: 'person-outline', pack: 'eva' },
    link: '/client/perfil',
  },
];

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent implements OnInit {
  menu = MENU_ITEMS;
  ruc: string;
  product = environment.product;

  constructor(
    private sidebarService: NbSidebarService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.ruc = this.auth.ruc;
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  logout() {
    this.auth.signOut();
  }

}
