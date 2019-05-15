

import { Injectable } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { map, catchError } from 'rxjs/operators';  

import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { Router } from '@angular/router';


import swal from 'sweetalert'; 
import { Observable } from 'rxjs';
 

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuario: Usuario;
  token: string;
  menu: any= [];

  constructor(public http: HttpClient, public router: Router, public _subirArchivoService: SubirArchivoService) { 
      this.cargarStorage();

  }

  estaLogueado(){
    return(this.token.length>0)?true: false;
  }

  cargarStorage(){
    if(localStorage.getItem('token')){
      this.token=localStorage.getItem('token');
      this.usuario=JSON.parse(localStorage.getItem('usuario'));
      this.menu=JSON.parse(localStorage.getItem('menu'));
    }else{
      this.token='';
      this.usuario=null;
      this.menu=[];
    }
  }
  guardarStorage(id: string, token: string, usuario: Usuario, menu: any){
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario=usuario;
    this.token=token;
    this.menu=menu;


  }

  logout(){
    this.usuario=null;
    this.token='';
    this.menu=[];
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');
    this.router.navigate(['/login']);
  }

  loginGoogle(token: string){
    let url=URL_SERVICIOS + '/login/google';

    return this.http.post(url,{token})
    .pipe(map((res: any)=>{

      this.guardarStorage(res.id,res.token, res.usuario, res.menu);
  
      return true;
    }));
  }


  login(usuario: Usuario, recordar: boolean =false){
if(recordar){
  localStorage.setItem('email',usuario.email);
}else{
  localStorage.removeItem('email');
}

    let url=URL_SERVICIOS + '/login';

    return this.http.post(url,usuario)
    .pipe(map((res: any)=>{

     
      this.guardarStorage(res.id,res.token, res.usuario,res.menu);
      // localStorage.setItem('id', res.id);
      // localStorage.setItem('token', res.token);
      // localStorage.setItem('usuario', JSON.stringify(res.usuario));

      return true;
    })).pipe(catchError((err: any)=>{
      swal('Error en el login', err.error.mensaje,'error');
      return Observable.throw(err);
      
    }))
  }

  crearUsuario(usuario: Usuario){
    let url=URL_SERVICIOS + '/usuario';

   return this.http.post(url,usuario)
   .pipe(map((res: any)=>{
    swal('Usuario creado',usuario.email,'success');
     return res.usuario
  }))
  .pipe(catchError((err: any)=>{
    swal(err.error.mensaje, err.error.mensaje,'error');
// tslint:disable-next-line: deprecation
    return Observable.throw(err); 
  }));
  }

  actualizarUsuario( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;

    return this.http.put( url, usuario )
               .pipe(map( (resp: any) => {

                if(usuario._id===this.usuario._id){
                  let usuarioDB: Usuario = resp.usuario;
                  this.guardarStorage( usuarioDB._id, this.token, usuarioDB ,this.menu);
                }
                // this.usuario = resp.usuario
                swal('Usuario actualizado', usuario.nombre, 'success' );

                return true;
              }));

  }

  cambiarImagen( archivo: File, id: string ) {

    this._subirArchivoService.subirArchivo( archivo, 'usuarios', id )
          .then( (resp: any) => {

            this.usuario.img = resp.usuario.img;
            swal( 'Imagen Actualizada', this.usuario.nombre, 'success' );
            this.guardarStorage( id, this.token, this.usuario , this.menu);

          })
          .catch( resp => {
            console.log( resp );
          }) ;

  }

  cargarUsuarios(desde:number=0){
      let url=URL_SERVICIOS +'/usuario?desde=' + desde;
      return this.http.get(url);
  }
  buscarUsuarios(termino: string){
    let url=URL_SERVICIOS + '/busqueda/coleccion/usuarios/'+ termino;
    return this.http.get(url)
    .pipe(map((res: any)=>res.usuarios));
  }

  borrarUsuario(id: string){
    let url=URL_SERVICIOS+"/usuario/" + id;
    url+="?token="+this.token;

    return  this.http.delete(url)
    .pipe(map(res=>{
      swal('Usuario borrado', "El usuario ha sido eliminado correctamente",'success');
      return true;
    }));
  }
 
}


