import { Component, OnInit } from '@angular/core';
import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';


declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[]=[];
  desde: number=0;

  totalRegistros: number=0;
  cargando: boolean=true;

  constructor(
    public _hospitalService: HospitalService, 
    public _modalUploadService:ModalUploadService
    )
     {
   }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notificacion.subscribe(()=>this.cargarHospitales());
  }
  
  mostrarModal(id:string){
    this._modalUploadService.mostrarModal('hospital',id);
  }
  cargarHospitales(){
    this.cargando=true;
    this._hospitalService.cargarHospitales(this.desde)
    .subscribe( (hospitales: any) => {
      this.totalRegistros=hospitales.totalHospitales;
      this.cargando=false;
      this.hospitales = hospitales 
    });

    
  }
  
cambiarDesde(valor: number){
  let desde=this.desde + valor;
  console.log(desde);
  if(desde>=this.totalRegistros){
    return;
  }
  if(desde<0){
    return;
  }
  this.desde+=valor;
  this.cargarHospitales();
}

  borrarHospital(hospital: Hospital){
   
    swal({
      title: "¿Esta seguro?",
      text: "Esta apunto de borrar a" + hospital.nombre,
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((  borrar) => {
       if(borrar){
         this._hospitalService.borrarHospital(hospital._id)
         .subscribe((res: any)=>{
           this.cargando=false;
           this.cargarHospitales();
         })
       }
    });

  }
  
  buscarHospital(termino:string){
    
    if(termino.length<=0){
      this.cargarHospitales();
      return;
    }

    this._hospitalService.buscarHospital(termino)
    .subscribe((hospitales: Hospital[])=>{
      this.hospitales=hospitales;
      this.cargando=false;
    });
  }

  
  guardarHospital(hospital: Hospital){
    this._hospitalService.actualizarHospital(hospital)
    .subscribe();
  }
  
  crearHospital() {

    swal({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del hospital',
      content: 'input',
      icon: 'info',
      buttons: true,
      dangerMode: true
    }).then( (valor: string ) => {

      if ( !valor || valor.length === 0 ) {
        return;
      }

      this._hospitalService.crearHospital( valor )
              .subscribe( () => this.cargarHospitales() );

    });

  }
  actualizarImagen( hospital: Hospital ) {

    this._modalUploadService.mostrarModal( 'hospitales', hospital._id );

  }
  

}
