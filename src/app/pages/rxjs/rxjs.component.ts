import { Component, OnInit, OnDestroy } from '@angular/core';
// tslint:disable-next-line: import-blacklist
import { Observable, Subscriber, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subs: Subscription;


  constructor() {
      // this.regresaObservable().pipe(
      //   retry()
      // )
 this.subs=this.regresaObservable().subscribe(
    numero=>console.log("Subs",numero),
    error=>console.error("Error obs", error),
    ()=> console.log("el observador termino")
    );

   }

  ngOnInit() {
  }
  ngOnDestroy(){
    console.log("Se va a cerrar");
    this.subs.unsubscribe;
  }
  
regresaObservable(): Observable <any  >{
  
  return new Observable((observer: Subscriber<any>) =>{
    let contador=0;
 let intervalo=setInterval(()=>{

   contador+=1;

    const salida={
      valor: contador
    }

   observer.next(salida);
     
   if(contador==3){
     clearInterval(intervalo);
     observer.complete();
   }

  //  if(contador==2){
  //   //  clearInterval(intervalo);
  //    observer.error("ERROR");
  //  }

 },1000);//fin intervalo

 }).pipe(
   map(resp =>resp.valor),         //obteniendo informacion del observador
    filter(( valor,index )=>{
      // console.log("Filtro", valor, index);

      if((valor%2)==1 ){//impar
          return true;
      }else{ //par
        
        return false;
      }
    })
   );//fin map//fin pipe

}
}

