import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';
import { AdminGuard } from './guards/admin.guard';


import {
  SettingsService,
SidebarService,
SharedService,
UsuarioService ,
LoginGuardGuard,
SubirArchivoService,
HospitalService,
MedicoService

} from './service.index';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SettingsService,
    SidebarService,
    SharedService,
    UsuarioService,
    LoginGuardGuard,
    SubirArchivoService,
    ModalUploadService,
   HospitalService,
   MedicoService,
   AdminGuard
  ]
})
export class ServiceModule { }
