import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert';
import { SubirArchivoService } from '../../services/subir-archivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';
@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  // oculto: string="";
  imagenSubir: File;
  imagenTemp: any;
  constructor(
    public _subirArchivoService:SubirArchivoService, 
    public _modalUploadService: ModalUploadService
    ) { }

  ngOnInit() {
  }

  subirImagen(){
    this._subirArchivoService.subirArchivo(this.imagenSubir,this._modalUploadService.tipo,this._modalUploadService.id)
    .then(res=>{
      this._modalUploadService.notificacion.emit(res);
      // this._modalUploadService.ocultarModal();
      this.cerrarModal();
    })
    .catch(err=>{
      console.log('Error en la carga...');  
    })
  }
  
  cerrarModal(){
    this.imagenTemp=null;
    this.imagenSubir=null;

    this._modalUploadService.ocultarModal();
  }
  seleccionImagen(archivo:File){
    if(!archivo){
      this.imagenSubir=archivo;
      return;
    }
    if(archivo.type.indexOf('image')<0){
      swal('Solo imagenes', 'el archivo seleccionado no es un imagen', 'error');
      return;
      
    }
    this.imagenSubir=archivo;

    let reader=new FileReader();
    let urlImagenTemp= reader.readAsDataURL(archivo);
    reader.onloadend=()=> this.imagenTemp = reader.result;

 
  }


}
