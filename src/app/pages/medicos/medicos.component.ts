import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from 'src/app/services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {
  medicos: Medico[]=[];
  desde: number=0;

  totalRegistros: number=0;
  cargando: boolean=true;


  constructor(
    public _medicosService:MedicoService,
    public  _modalUploadService: ModalUploadService
  ) { }

  ngOnInit() {
    this.cargarMedicos();
  //  this._modalUploadService.notificacion.subscribe(res=>this.cargarMedicos());
  }
   
cargarMedicos(){
  this.cargando=true;

  this._medicosService.cargarMedicos(this.desde)
  .subscribe((res: any)=>{
    this.totalRegistros=res.total;
    this.medicos=res.medicos;
    this.cargando=false;
  });
}
 
borrarMedico(medico: Medico){
   
  swal({
    title: "¿Esta seguro?",
    text: "Esta apunto de borrar a" + medico.nombre,
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((  borrar) => {
     if(borrar){
       this._medicosService.borrarMedico(medico._id)
       .subscribe((res: any)=>{
         this.cargando=false;
         this.cargarMedicos();
       })
     }
  });

}
buscarMedicos(termino:string){
    
  if(termino.length<=0){
    this.cargarMedicos();
    return;
  }

  this._medicosService.buscarMedicos(termino)
  .subscribe((medicos: Medico[])=>{
    this.medicos=medicos;
    this.cargando=false;
  });
}



}
