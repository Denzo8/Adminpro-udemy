import { Component, OnInit } from '@angular/core';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import { Medico } from 'src/app/models/medico.model';
import { NgForm } from '@angular/forms';
import { HospitalService,MedicoService } from '../../services/service.index';
import { Hospital } from 'src/app/models/hospital.model';
import { Router, ActivatedRoute } from '@angular/router';


declare var swal: any;

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {
 
  medico: Medico=new Medico('','','','','');
  hospitales: Hospital[] = [];
  hospital: Hospital= new Hospital('');

  desde: number=0;

  totalRegistros: number=0;
  cargando: boolean=true;


  constructor(
   public  _medicosService: MedicoService,
   public _hospitalService: HospitalService,
  public  _modalUploadService: ModalUploadService,
  public router: Router,
  public activateRoute: ActivatedRoute
  ) { 

    activateRoute.params.subscribe(params=>{
      let id=params['id'];

      if(id!=='nuevo'){
        this.cargarMedico(id);
      }
    })
  }

  ngOnInit() {
    //Aaparece la lista de los hospitales creados
    this._hospitalService.cargarHospitales()
    .subscribe((hospitales : Hospital[]) => {
      this.hospitales = hospitales;
    });

    this._modalUploadService.notificacion.subscribe(res=>this.medico.img=res.medico.img);
  }
crearMedico() {

  swal({
    title: 'Crear medico',
    text: 'Ingrese el nombre del medico',
    content: 'input',
    icon: 'info',
    buttons: true,
    dangerMode: true
  }).then( (valor: string ) => {

    if ( !valor || valor.length === 0 ) {
      return;
    }

    this._medicosService.crearMedico( valor )
            .subscribe( () => this.cargarMedicos() );

  });

}
cargarMedico(id: string){
  this.cargando=true;

  this._medicosService.cargarMedico(id)
  .subscribe( medico => {
    this.medico = medico;
    this.medico.hospital = medico.hospital._id;
    this.cambioHospital( this.medico.hospital );
  });
}
cargarMedicos(){
  this.cargando=true;

  this._medicosService.cargarMedicos(this.desde)
  .subscribe((res: any)=>{
    this.totalRegistros=res.total;
    this.medico=res.medico;
    this.cargando=false;
  });
}

guardarMedico(f:NgForm){
    console.log(f.valid);
    console.log(f.value);

    if(f.invalid){
      return;
    }
    this._medicosService.guardarMedico(this.medico)
    .subscribe(medico=>{
      this.medico._id=medico._id
        this.router.navigate(['/medico',medico._id]);
    });
}

cambioHospital(id: string){
  this._hospitalService.obtenerHospital(id)
  .subscribe(hospital=>{
    this.hospital=hospital;
  });
}

cambiarImagen(){
  this._modalUploadService.mostrarModal('medicos',this.medico._id);
}

}
