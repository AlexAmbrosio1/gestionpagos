import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {

  mostrarModalLogout: boolean = false;
  usuario: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarUsuario();
  }

  cargarUsuario(): void {
    this.usuario = this.authService.obtenerUsuario();
  }

abrirModalLogout(): void {
  this.mostrarModalLogout = true;
  this.cd.detectChanges();
}

  cancelarLogout(): void {
    this.mostrarModalLogout = false;
  }

  confirmarLogout(): void {

    localStorage.removeItem('token');
    localStorage.removeItem('usuario_nombre');
    localStorage.removeItem('usuario_rol');

    this.mostrarModalLogout = false;

    this.router.navigate(['/login']);
  }

  esAdmin(): boolean {
    return this.usuario?.Rol === 'Administrador';
  }

  esRRHH(): boolean {
    return this.usuario?.Rol === 'RRHH';
  }
}