import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { UsuarioService, SubirArchivoService } from '../service.index';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import swal from 'sweetalert'; 
import { Medico } from 'src/app/models/medico.model';


@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor(
    public http: HttpClient,
    public _usuarioService:UsuarioService,
    public router: Router, 
    public _subirArchivoService: SubirArchivoService
  ) { }

  cargarMedicos(desde: number=0){
    let url=URL_SERVICIOS +'/medico?desde=' + desde;
    return this.http.get(url);
  }
  cargarMedico(id:string){
    let url=URL_SERVICIOS +'/medico/' + id;
    return this.http.get(url)
    .pipe(map((res:any )=>res.medico));
  }

  borrarMedico(id:string){
    let url=URL_SERVICIOS+"/medico/" + id;
    url+="?token="+this._usuarioService.token;

    return  this.http.delete(url)
    .pipe(map(res=>{
      swal('Medico borrado', "El medico ha sido eliminado correctamente",'success');
      return true;
    }));
  }

  crearMedico(nombre: string){
    let url=URL_SERVICIOS + '/medico';
    url+="?token="+this._usuarioService.token;
    
    return this.http.post(url,{nombre})
    .pipe(map((res: any)=>{
     swal('Medico creado',nombre,'success');
      return res.medico
   }));
  }

  buscarMedicos(termino:string){
    let url=URL_SERVICIOS + '/busqueda/coleccion/medicos/'+ termino;
    return this.http.get(url)
    .pipe(map((res: any)=>res.medicos));
  }
  guardarMedico(medico: Medico){
    let url = URL_SERVICIOS + '/medico';

    if(medico._id){
      //actualizando
      url+='/' + medico._id;
      url += '?token=' +this._usuarioService.token;

      return this.http.put( url, medico )
      .pipe(map( (resp: any) => {

       swal('Medico actualizado', resp.medico.nombre, 'success' );

       return resp.medico;
     })); 
      
    }else{
      //creando
      url += '?token=' +this._usuarioService.token;

      return this.http.post( url, medico )
                 .pipe(map( (resp: any) => {
  
                  swal('Medico creado', resp.medico.nombre, 'success' );
  
                  return resp.medico;
                })); 
    }
  
  }
 
}
