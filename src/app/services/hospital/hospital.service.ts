import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Hospital } from '../../models/hospital.model';

import { SubirArchivoService } from '../service.index';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';
import swal from 'sweetalert'; 

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  hospital:Hospital;
 
  totalHospitales: number = 0;
  
  constructor(
    public http: HttpClient, 
    public _usuarioService:UsuarioService,
    public router: Router, 
    public _subirArchivoService: SubirArchivoService
    ) 
    { }

  obtenerHospital(id:string){
    let url=URL_SERVICIOS +'/hospital/' + id;
    return this.http.get(url)
    .pipe(map( (resp: any) => resp.hospital ));
  }

  cargarHospitales(desde: number=0){
    let url=URL_SERVICIOS +'/hospital?desde=' + desde;
    return this.http.get(url)
    .pipe(map( (resp: any) => {
      this.totalHospitales = resp.total;
      return resp.hospitales;
    }))
  }
  
  // cargarHospitales() {

  //   let url = URL_SERVICIOS + '/hospital';
  //   return this.http.get( url )
  //   .pipe(map( (resp: any) => {
  //     this.totalHospitales = resp.total;
  //     return resp.hospitales;
  //   }));
             

  // }
  borrarHospital(id:string){
    let url=URL_SERVICIOS+"/hospital/" + id;
    url+="?token="+this._usuarioService.token;

    return  this.http.delete(url)
    .pipe(map(res=>{
      swal('Hospital borrado', "El hospital ha sido eliminado correctamente",'success');
      return true;
    }));
  }
  
  crearHospital(nombre: string){
    let url=URL_SERVICIOS + '/hospital';
    url+="?token="+this._usuarioService.token;
    
    return this.http.post(url,{nombre})
    .pipe(map((res: any)=>{
     swal('Hospital creado',nombre,'success');
      return res.hospitales;
   }));
  }

  buscarHospital(termino:string){
    let url=URL_SERVICIOS + '/busqueda/coleccion/hospitales/'+ termino;
    return this.http.get(url)
    .pipe(map((res: any)=>res.hospitales));
  }

  actualizarHospital(hospital: Hospital){
    let url = URL_SERVICIOS + '/hospital/' + hospital._id;
    url += '?token=' +this._usuarioService.token;

    return this.http.put( url, hospital )
               .pipe(map( (resp: any) => {

                swal('Hospital actualizado', resp.hospital.nombre, 'success' );

                return resp.hospital;
              }));
  }
}