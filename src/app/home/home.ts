import { Component, OnInit } from '@angular/core';
import { Api } from '../service/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserComponent } from '../user/user';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, UserComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home  implements OnInit {
  data: any[] = [];
  dataFiltrada: any[] = [];
  paginaActual: number = 1;
  haySiguiente: boolean = true;
  user: any = null;
  showUserInfo: boolean = false;
  userId: number | null = null;
  busqueda: string = '';
  personajeSeleccionado: any = null;
  mostrarInfoPersonaje: boolean = false;
  nuevoPersonaje: any = {
    id: '',
    name: '',
    status: '',
    species: '',
    gender: '',
    origin: { name: '' },
    image: '',
  };
  mostrarAgregarPersonaje: boolean = false;
  abrirAgregarPersonaje() {
    this.mostrarAgregarPersonaje = true;
  }
  cerrarAgregarPersonaje() {
    this.mostrarAgregarPersonaje = false;
  }
  agregarPersonaje() {
    // Validación visual personalizada
    this.validacionesAgregar = [];
    if (!this.nuevoPersonaje.name.trim()) this.validacionesAgregar.push('El nombre es obligatorio.');
    if (!this.nuevoPersonaje.status.trim()) this.validacionesAgregar.push('El estado es obligatorio.');
    if (!this.nuevoPersonaje.species.trim()) this.validacionesAgregar.push('La especie es obligatoria.');
    if (this.validacionesAgregar.length > 0) return;

    if (!window.confirm('¿Seguro que quieres agregar este personaje?')) return;

    let maxId = this.data.length > 0 ? Math.max(...this.data.map(p => Number(p.id) || 0)) : 0;
    const nuevo = {
      ...this.nuevoPersonaje,
      id: maxId + 1,
      editando: false,
      origin: { name: this.nuevoPersonaje.origin.name }
    };
    this.data.unshift(nuevo);
    this.filtrarPersonajes();
    this.nuevoPersonaje = {
      id: '',
      name: '',
      status: '',
      species: '',
      gender: '',
      origin: { name: '' },
      image: '',
    };
    this.cerrarAgregarPersonaje();
  }

  validacionesAgregar: string[] = [];

  constructor(private apiService: Api) {}

  ngOnInit(): void {
    this.llenarData();
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      this.userId = userObj.id;
    }
  }

  toggleUserInfo() {
    this.showUserInfo = !this.showUserInfo;
    if (this.showUserInfo && this.userId) {
      this.apiService.getUserById(this.userId).subscribe(data => {
        this.user = data;
      });
    }
  }

  llenarData(pagina: number = 1){
    this.apiService.getData(pagina).subscribe((response: any) => {
      this.data = (response.results || []).map((personaje: any) => ({ ...personaje, editando: false }));
      this.dataFiltrada = [...this.data];
      this.haySiguiente = !!response.info?.next;
      this.paginaActual = pagina;
      console.log(this.data);
    }); 
  }

  filtrarPersonajes() {
    const filtro = this.busqueda.trim().toLowerCase();
    if (!filtro) {
      this.dataFiltrada = [...this.data];
      return;
    }
    this.dataFiltrada = this.data.filter(p =>
      p.name.toLowerCase().includes(filtro) ||
      p.status.toLowerCase().includes(filtro) ||
      p.species.toLowerCase().includes(filtro)
    );
  }

  mostrarPersonaje(personaje: any) {
    this.personajeSeleccionado = { ...personaje };
    this.mostrarInfoPersonaje = true;
  }

  cerrarPersonaje() {
    this.mostrarInfoPersonaje = false;
    this.personajeSeleccionado = null;
  }

  confirmarAccion(mensaje: string): boolean {
    return window.confirm(mensaje);
  }

  editarPersonajeSeleccionado() {
    if (this.confirmarAccion('¿Seguro que quieres editar este personaje?')) {
      this.personajeSeleccionado.editando = true;
    }
  }

  guardarPersonajeSeleccionado() {
    if (this.confirmarAccion('¿Seguro que quieres guardar los cambios?')) {
      this.personajeSeleccionado.editando = false;
      // Actualiza el personaje en la tabla local
      const idx = this.data.findIndex(p => p.id === this.personajeSeleccionado.id);
      if (idx !== -1) {
        this.data[idx] = { ...this.personajeSeleccionado };
        this.filtrarPersonajes();
      }
    }
  }

  eliminarPersonajeSeleccionado() {
    if (this.confirmarAccion('¿Seguro que quieres eliminar este personaje?')) {
      // Elimina el personaje de la tabla local
      this.data = this.data.filter(p => p.id !== this.personajeSeleccionado.id);
      this.filtrarPersonajes();
      this.cerrarPersonaje();
    }
  }

  cambiarPagina(direccion: number) {
    const nuevaPagina = this.paginaActual + direccion;
    if (nuevaPagina < 1) return;
    this.llenarData(nuevaPagina);
  }

  irAPagina(pagina: number) {
    if (pagina < 1 || pagina === this.paginaActual) return;
    this.llenarData(pagina);
  }

  getPaginasParaMostrar(): number[] {
    // Muestra hasta 5 páginas centradas en la actual
    const paginas: number[] = [];
    let total = this.paginaActual;
    // Si hay siguiente, asumimos al menos una más
    if (this.haySiguiente) {
      total = this.paginaActual + 1;
    }
    let start = Math.max(1, this.paginaActual - 2);
    let end = Math.max(total, this.paginaActual + 2);
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }
    for (let i = start; i <= end; i++) {
      paginas.push(i);
    }
    return paginas;
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
