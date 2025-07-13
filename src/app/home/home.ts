import { Component, OnInit } from '@angular/core';
import { Api } from '../service/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home  implements OnInit {
  data: any[] = [];
  paginaActual: number = 1;
  haySiguiente: boolean = true;

  constructor(private apiService: Api) {
    // Initialization logic can go here
  }

  ngOnInit(): void {
    this.llenarData();
  }

  llenarData(pagina: number = 1){
    this.apiService.getData(pagina).subscribe((response: any) => {
      this.data = (response.results || []).map((personaje: any) => ({ ...personaje, editando: false }));
      this.haySiguiente = !!response.info?.next;
      this.paginaActual = pagina;
      console.log(this.data);
    }); 
  }

  cambiarPagina(direccion: number) {
    const nuevaPagina = this.paginaActual + direccion;
    if (nuevaPagina < 1) return;
    this.llenarData(nuevaPagina);
  }

  editarPersonaje(index: number) {
    this.data[index].editando = true;
  }

  guardarPersonaje(index: number) {
    this.data[index].editando = false;
  }

  eliminarPersonaje(index: number) {
    this.data.splice(index, 1);
  }
}
