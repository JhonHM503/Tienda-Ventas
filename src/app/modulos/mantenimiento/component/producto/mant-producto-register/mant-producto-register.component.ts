import { Component, EventEmitter, input, Input, OnInit, Output } from '@angular/core';
import { ProductoResponse } from '../../../models/producto-response.model';
import { VProducto } from '../../../models/VProductos.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductoRequest } from '../../../models/producto-request.model';
import { ProductoService } from '../../../service/producto.service';
import { CategoriaResponse } from '../../../models/categoria-response.model';
import { CategoriaService } from '../../../service/categoria.service';
import { Router } from '@angular/router';
import { ImagenResponse } from '../../../models/imagen-response.model';
import { ImagenRequest } from '../../../models/imagen-request.model';
import { ImagenService } from '../../../service/imagen.service';
import { AccionMantConst } from 'src/app/constans/general.constans';
import { forkJoin } from 'rxjs';
import { alert_error, alert_success } from 'src/app/functions/general.functions';
import { TipoDispositivoResponse } from '../../../models/tipoDispositivo-response.model';
import { MarcaResponse } from '../../../models/marca-response.model';
import { ModeloDispositivoResponse } from '../../../models/modeloDispositivo-response.model';
import { TipoDispositivoService } from '../../../service/tipo-dispositivo.service';
import { MarcaService } from '../../../service/marca.service';
import { ModeloDispositivoService } from '../../../service/modelo-dispositivo.service';
import { ProductoDispositivoService } from '../../../service/producto-dispositivo.service';
import { ProductoDispositivoRequest } from '../../../models/productoDispositivo-request.model';
import { TipoProductoRequest } from '../../../models/tipoProducto-request.model';
import { TipoProductoResponse } from '../../../models/tipoProducto-response.model';
import { TipoProductoService } from '../../../service/tipo-producto.service';

interface DispositivoSeleccionado {
  tipoDispositivo:TipoDispositivoResponse;
  marca: MarcaResponse;
  modelos: ModeloDispositivoResponse
}

@Component({
  selector: 'app-mant-producto-register',
  standalone: false,
  // imports: [],
  templateUrl: './mant-producto-register.component.html',
  styleUrl: './mant-producto-register.component.scss'
})
export class MantProductoRegisterComponent implements OnInit {
  
  
  @Input() title:string="";
  @Input() accion: number = 0;
  @Input() producto:ProductoResponse = new ProductoResponse();
  @Input() imagen:ImagenResponse = new ImagenResponse();
  @Input() categorias:CategoriaResponse[] =[];
  // @Input() tipoFundas:TipoFundaResponse[] =[];
  // @Input() tipoProtectores:TipoProtectorResponse[] =[];

  @Output() closeModalEmmit = new EventEmitter<boolean>();


  myForm:FormGroup;
  dispositivo: FormGroup; // Formulario para dispositivo principal
  dispositivoForm: FormGroup; // Nuevo formulario para dispositivos
  productoEnvio:ProductoRequest = new ProductoRequest();
  imagenEnvio:ImagenRequest = new ImagenRequest();

  selectedFile: File | null = null;
  imagenActualUrl: string | null = null;
  isLoading: boolean = false; // Nueva propiedad para controlar el estado de carga


  //Propiedades para dispositivos
  tiposDispositivo: TipoDispositivoResponse[] = [];
  marcas: MarcaResponse[] = [];
  modelos: ModeloDispositivoResponse[] = [];
  dispositivoPrincipalSeleccionado: DispositivoSeleccionado | null = null;  
  dispositivosAdicionalesSeleccionados: DispositivoSeleccionado[] = [];


  categoria:CategoriaResponse[]=[];
  tiposProducto: TipoProductoResponse[] = [];
  todosTiposProducto: TipoProductoResponse[] = []; 

  constructor(
    private fb: FormBuilder,
    private _productoService: ProductoService,
    private _imagenService: ImagenService,
    private _categoriaService: CategoriaService,
    private _tipoDispositivoService: TipoDispositivoService,
    private _marcaService: MarcaService,
    private _modeloDispositivoService: ModeloDispositivoService,
    private _productoDispositivoService: ProductoDispositivoService,
    private _tipoProductoService: TipoProductoService,
    private router: Router
  ) {
    this.myForm = this.fb.group({
      //imagen fields
      url: [''],

      //producto fields
      idProducto:[{ value: 0, disabled: true }, [Validators.required]],
      idCategoria: ['', Validators.required],
      idImagen: [{ value: 0, disabled: true }, [Validators.required]],
      idTipoProducto: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      stock: ['', Validators.required],
      color: ['', Validators.required],
      marcaAccesorio: ['', Validators.required], 
      // material: ['', Validators.required],  
      esUniversal: [false, Validators.required], 
      // codigoProducto: ['', Validators.required], 
    });

    // Formulario para dispositivo principal
    this.dispositivo = this.fb.group({
      idTipoDispositivo: [null, Validators.required],
      idMarca: [null, Validators.required],
      idModelo: [null, Validators.required]
    });

    // Formulario para agregar dispositivos adicionales
    this.dispositivoForm = this.fb.group({
      idTipoDispositivo: [null, Validators.required],
      idMarca: [null, Validators.required],
      idModelo: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarTiposDispositivo();

    this.cargarTodosTiposProducto().then(()=> {
      if (this.accion === AccionMantConst.editar) {
        this.myForm.patchValue({ ...this.imagen, ...this.producto });
        this.imagenActualUrl = this.imagen.url;
         // Cargar tipos de producto para la categoría del producto en edición
        if (this.producto.idCategoria) {
          this.filtrarTiposProductoPorCategoria(this.producto.idCategoria);
        }
        // Si el producto es universal, cargar dispositivos asociados
          this.cargarDispositovosDelProducto();
        
      }
    });

    // Escuchar cambios en la categoría
    this.myForm.get('idCategoria')?.valueChanges.subscribe(categoriaId => {
      if (categoriaId) {
        this.filtrarTiposProductoPorCategoria(categoriaId);
        // Limpiar la selección de tipo de producto cuando cambie la categoría
        this.myForm.get('idTipoProducto')?.setValue(null);
      } else {
        this.tiposProducto = [];
        this.myForm.get('idTipoProducto')?.setValue(null);
      }
    });
    
    // Escuchar cambios en esUniversal
    this.myForm.get('esUniversal')?.valueChanges.subscribe(value => {
      if (!value) {
        this.dispositivosAdicionalesSeleccionados = [];
      }
    });
  }

  cargarTiposDispositivo(): void {
    this._tipoDispositivoService.getAll().subscribe({
      next: (data: TipoDispositivoResponse[]) => {
        this.tiposDispositivo = data;
      },
      error: (error) => console.error('Error cargando tipos de dispositivo:', error)
    });
  }

  // Método para cargar todos los tipos de producto
  cargarTodosTiposProducto(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._tipoProductoService.getAll().subscribe({
        next: (data: TipoProductoResponse[]) => {
          this.todosTiposProducto = data;
          resolve();
        },
        error: (error) => {
          console.error('Error cargando tipos de producto:', error);
          this.todosTiposProducto = [];
          reject(error);
        }
      });
    });
  }

  // Método para filtrar tipos de producto por categoría
  filtrarTiposProductoPorCategoria(categoriaId: number): void {
    // Filtrar los tipos de producto que pertenecen a la categoría seleccionada
    this.tiposProducto = this.todosTiposProducto.filter(
      tipo => tipo.idCategoria === Number(categoriaId)
    );
  }

  
  onTipoDispositivoChange(): void {
    const tipoId = this.dispositivoForm.get('idTipoDispositivo')?.value;
    if (tipoId) {
      this._marcaService.getAll().subscribe({
        next: (data: MarcaResponse[]) => {
          this.marcas = data;
          this.dispositivoForm.get('idMarca')?.setValue(null);
          this.dispositivoForm.get('idModelo')?.setValue(null);
          this.modelos = [];
        },
        error: (error) => console.error('Error cargando marcas:', error)
      });
    }
  }

  onMarcaChange(): void {
    const marcaId = this.dispositivoForm.get('idMarca')?.value;
    if (marcaId) {
      this._modeloDispositivoService.getAll().subscribe({
        next: (data: ModeloDispositivoResponse[]) => {
          // Filtrar modelos por marca
          this.modelos = data.filter(modelo => modelo.idMarca == marcaId);
          this.dispositivoForm.get('idModelo')?.setValue(null);
        },
        error: (error) => console.error('Error cargando modelos:', error)
      });
    }
  }

  // Métodos para el dispositivo principal:
  onTipoDispositivoPrincipalChange(): void {
    const tipoId = this.dispositivo.get('idTipoDispositivo')?.value;
    if (tipoId) {
      this._marcaService.getAll().subscribe({
        next: (data: MarcaResponse[]) => {
          this.marcas = data;
          this.dispositivo.get('idMarca')?.setValue(null);
          this.dispositivo.get('idModelo')?.setValue(null);
          this.modelos = [];
        },
        error: (error) => console.error('Error cargando marcas principales:', error)
      });
    }
  }

  onMarcaPrincipalChange(): void {
    const marcaId = this.dispositivo.get('idMarca')?.value;
    if (marcaId) {
      this._modeloDispositivoService.getAll().subscribe({
        next: (data: ModeloDispositivoResponse[]) => {
          this.modelos = data.filter(modelo => modelo.idMarca == marcaId);
          this.dispositivo.get('idModelo')?.setValue(null);
        },
        error: (error) => console.error('Error cargando modelos principales:', error)
      });
    }
  }

  agregarDispositivoPrincipal(): void {
    if (this.dispositivo.valid) {
      const tipoId = this.dispositivo.get('idTipoDispositivo')?.value;
      const marcaId = this.dispositivo.get('idMarca')?.value;
      const modeloId = this.dispositivo.get('idModelo')?.value;

      const tipoDispositivo = this.tiposDispositivo.find(t => t.idTipoDispositivo == tipoId);
      const marca = this.marcas.find(m => m.idMarca == marcaId);
      const modelo = this.modelos.find(m => m.idModelo == modeloId);

      if (tipoDispositivo && marca && modelo) {
        this.dispositivoPrincipalSeleccionado = {
          tipoDispositivo,
          marca,
          modelos: modelo
        };
        
        // Limpiar formulario
        this.dispositivo.reset();
        this.marcas = [];
        this.modelos = [];
      }
    }
  }

  eliminarDispositivoPrincipal(): void {
    this.dispositivoPrincipalSeleccionado = null;
  }

  agregarDispositivo(): void {
    if (this.dispositivoForm.valid) {
      const tipoId = this.dispositivoForm.get('idTipoDispositivo')?.value;
      const marcaId = this.dispositivoForm.get('idMarca')?.value;
      const modeloId = this.dispositivoForm.get('idModelo')?.value;

      const tipoDispositivo = this.tiposDispositivo.find(t => t.idTipoDispositivo == tipoId);
      const marca = this.marcas.find(m => m.idMarca == marcaId);
      const modelo = this.modelos.find(m => m.idModelo == modeloId);

      if (tipoDispositivo && marca && modelo) {
        // Verificar que no sea el mismo modelo principal
        if (this.dispositivoPrincipalSeleccionado && 
            modelo.idModelo === this.dispositivoPrincipalSeleccionado.modelos.idModelo) {
          alert_error("Modelo duplicado", "No puede agregar el mismo modelo que está seleccionado como dispositivo principal.");
          return;
        }
        // Verificar que no esté duplicado
        const existe = this.dispositivosAdicionalesSeleccionados.some(d => d.modelos.idModelo === modelo.idModelo);
        if (!existe) {
          this.dispositivosAdicionalesSeleccionados.push({
            tipoDispositivo,
            marca,
            modelos: modelo
          });
          
          // Limpiar formulario
          this.dispositivoForm.reset();
          this.marcas = [];
          this.modelos = [];
        } else {
          alert_error("Dispositivo duplicado", "Este modelo ya está agregado a la lista.");
        }
        
      }
    }
  }

  eliminarDispositivo(index: number): void {
    this.dispositivosAdicionalesSeleccionados.splice(index, 1);
  }

  cargarDispositovosDelProducto():void{
    if (!this.producto.idProducto) {
      return;
    }
  
    // Usar forkJoin para hacer todas las peticiones en paralelo
    forkJoin({
      productosDispositivos: this._productoDispositivoService.getAll(),
      marcas: this._marcaService.getAll(),
      modelos: this._modeloDispositivoService.getAll(),
      tiposDispositivo: this._tipoDispositivoService.getAll()
    }).subscribe({
      next: (data) => {
        // Filtrar los ProductoDispositivo que pertenecen a este producto
        const productosDispositivosDelProducto = data.productosDispositivos.filter(
          pd => pd.idProducto === this.producto.idProducto
        );
  
        // Para cada ProductoDispositivo, construir el DispositivoSeleccionado
        const dispositivosCargados = productosDispositivosDelProducto.map(pd => {
          const modelo = data.modelos.find(m => m.idModelo === pd.idModelo);
          if (!modelo) return null;
  
          const marca = data.marcas.find(m => m.idMarca === modelo.idMarca);
          if (!marca) return null;
  
          const tipoDispositivo = data.tiposDispositivo.find(td => td.idTipoDispositivo === modelo.idTipoDispositivo);
          if (!tipoDispositivo) return null;
  
          return {
            tipoDispositivo: tipoDispositivo,
            marca: marca,
            modelos: modelo
          };
        }).filter(item => item !== null) as DispositivoSeleccionado[];
  
          // El primer dispositivo es el principal
        if (dispositivosCargados.length > 0) {
          this.dispositivoPrincipalSeleccionado = dispositivosCargados[0];
          
          // Los demás son adicionales (si los hay)
          if (this.producto.esUniversal && dispositivosCargados.length > 1) {
            this.dispositivosAdicionalesSeleccionados = dispositivosCargados.slice(1);
          } else {
            // Si no es universal o solo tiene un dispositivo, limpiar adicionales
            this.dispositivosAdicionalesSeleccionados = [];
          }
        }

        console.log('Dispositivo principal cargado:', this.dispositivoPrincipalSeleccionado);
        console.log('Dispositivos adicionales cargados:', this.dispositivosAdicionalesSeleccionados);
        console.log('Es universal:', this.producto.esUniversal);
      },
      error: (error) => {
        console.error('Error cargando dispositivos del producto:', error);
        alert_error("Error", "No se pudieron cargar los dispositivos del producto.");
      }
    });
  }
  
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] as File;
  }

  guardarRegistro(): void {
    if (this.myForm.valid) {

        // Validar que tenga dispositivo principal
      if (!this.dispositivoPrincipalSeleccionado) {
        alert_error("Dispositivo principal requerido", "Debe seleccionar un dispositivo principal para el producto.");
        return;
      }
      
      // Validar dispositivos si es universal
      if (this.myForm.get('esUniversal')?.value && this.dispositivosAdicionalesSeleccionados.length === 0) {
        alert_error("Dispositivos requeridos", "Debe agregar al menos un dispositivo compatible para productos universales.");
        return;
      }

      this.isLoading = true; // Activamos el indicador de carga

      if (this.selectedFile) {
        // Si se seleccionó un nuevo archivo, subir la nueva imagen
        this._imagenService.createImageFromImgBB(this.selectedFile).subscribe({
          next: (imagenResponse: ImagenResponse) => {
            this.procesarGuardado(imagenResponse);
          },
          error: (error) => {
            this.isLoading = false; // Desactivamos el indicador en caso de error
            alert_error("Error", "Ocurrió un error al subir la imagen.");
            console.error(error);
          }
        });
      } else if (this.accion === AccionMantConst.editar) {
        // Si es edición y no se seleccionó un nuevo archivo, usar la imagen existente
        this.procesarGuardado(this.imagen);
      } else {
        alert_error("Imagen requerida", "Por favor, seleccione una imagen para el producto.");
      }
    } else {
      alert_error("Formulario inválido", "Por favor, complete todos los campos requeridos.");
    }
  }

  procesarGuardado(imagenResponse: ImagenResponse): void {
    const formValue = this.myForm.getRawValue();
    this.imagenEnvio = {
      // idImagen: imagenResponse.idImagen,
      idImagen: this.accion === AccionMantConst.editar ? imagenResponse.idImagen : 0, // Solo enviar idImagen en edición
      url: imagenResponse.url
    };
    this.productoEnvio = {
      idProducto: formValue.idProducto,
      // idImagen: imagenResponse.idImagen,
      idImagen: this.accion === AccionMantConst.editar ? imagenResponse.idImagen : 0, // Solo enviar idImagen en edición
      idCategoria: formValue.idCategoria,
      idTipoProducto: formValue.idTipoProducto,
      nombre: formValue.nombre,
      descripcion: formValue.descripcion,
      precio: formValue.precio,
      stock: formValue.stock,
      marcaAccesorio:formValue.marcaAccesorio,
      color: formValue.color, 
      material: formValue.material, 
      esUniversal: formValue.esUniversal,    
      codigoProducto: formValue.codigoProducto, 
    };

    if (this.accion === AccionMantConst.crear) {
      this.crearRegistro();
    } else {
      this.editarRegistro();
    }
  }

  crearRegistro(){
    this._productoService.createProductoAndImagen(this.imagenEnvio, this.productoEnvio).subscribe({
      next: (data: ProductoResponse) => {
        // Crear relación con dispositivo principal
        this.crearRelacionDispositivoPrincipal(data.idProducto);
      },
      error: (error) => {
        this.isLoading = false; // Desactivamos el indicador en caso de error
        alert_error("Error", "Ocurrió un error al crear el registro.");
        console.error(error);
      }
    });
  }

  

  editarRegistro(){
    this._productoService.updateProductoAndImagen(this.imagenEnvio, this.productoEnvio).subscribe({
      next: ([imagenResponse, productoResponse]: [ImagenResponse, ProductoResponse]) => {
        this.actualizarRelacionesDispositivos(productoResponse.idProducto);
      },
      error: (error) => {
        this.isLoading = false;
        alert_error("Error", "Ocurrió un error al actualizar el registro.");
        console.error(error);
      }
    });
  }

  eliminarTodasLasRelaciones(idProducto: number): void {
    this._productoDispositivoService.getAll().subscribe({
      next: (productosDispositivos) => {
        const relacionesExistentes = productosDispositivos.filter(
          pd => pd.idProducto === idProducto
        );
  
        if (relacionesExistentes.length > 0) {
          const deleteRequests = relacionesExistentes.map(relacion =>
            this._productoDispositivoService.delete(relacion.idProductoDispositivo)
          );
  
          forkJoin(deleteRequests).subscribe({
            next: () => {
              this.isLoading = false;
              alert_success("Registro actualizado", "El producto y sus dispositivos se han actualizado correctamente.");
              this.cerrarModal(true);
            },
            error: (error) => {
              console.error('Error eliminando relaciones:', error);
              this.isLoading = false;
              alert_error("Error", "Error al eliminar las relaciones con dispositivos.");
            }
          });
        } else {
          this.isLoading = false;
          alert_success("Registro actualizado", "El producto se ha actualizado correctamente.");
          this.cerrarModal(true);
        }
      },
      error: (error) => {
        console.error('Error obteniendo relaciones:', error);
        this.isLoading = false;
        alert_error("Error", "Error al obtener las relaciones existentes.");
      }
    });
  }

  crearRelacionDispositivoPrincipal(idProducto: number): void {
    const requestPrincipal: ProductoDispositivoRequest = {
      idProductoDispositivo: 0,
      idProducto: idProducto,
      idModelo: this.dispositivoPrincipalSeleccionado!.modelos.idModelo
    };
  
    this._productoDispositivoService.create(requestPrincipal).subscribe({
      next: () => {
        // Si es universal, crear las relaciones adicionales
        if (this.productoEnvio.esUniversal && this.dispositivosAdicionalesSeleccionados.length > 0) {
          this.crearRelacionesDispositivosAdicionales(idProducto);
        } else {
          this.isLoading = false;
          alert_success("Registro creado", "El nuevo producto se ha creado correctamente.");
          this.cerrarModal(true);
        }
      },
      error: (error) => {
        this.isLoading = false;
        alert_error("Error", "Error al crear la relación con el dispositivo principal.");
        console.error(error);
      }
    });
  }
  
  crearRelacionesDispositivosAdicionales(idProducto: number): void {
    const relacionesRequests = this.dispositivosAdicionalesSeleccionados.map(dispositivo => {
      const request: ProductoDispositivoRequest = {
        idProductoDispositivo: 0,
        idProducto: idProducto,
        idModelo: dispositivo.modelos.idModelo
      };
      return this._productoDispositivoService.create(request);
    });
  
    if (relacionesRequests.length > 0) {
      forkJoin(relacionesRequests).subscribe({
        next: () => {
          this.isLoading = false;
          alert_success("Registro creado", "El producto y sus dispositivos compatibles se han creado correctamente.");
          this.cerrarModal(true);
        },
        error: (error) => {
          this.isLoading = false;
          alert_error("Error", "Error al crear las relaciones con dispositivos adicionales.");
          console.error(error);
        }
      });
    }
  }

  actualizarRelacionesDispositivos(idProducto: number): void {
    this._productoDispositivoService.getAll().subscribe({
      next: (productosDispositivos) => {
        // Filtrar las relaciones de este producto
        const relacionesExistentes = productosDispositivos.filter(
          pd => pd.idProducto === idProducto
        );
  
        // Crear array de observables para eliminar relaciones existentes
        const deleteRequests = relacionesExistentes.map(relacion =>
          this._productoDispositivoService.delete(relacion.idProductoDispositivo)
        );
  
        if (deleteRequests.length > 0) {
          // Eliminar todas las relaciones existentes
          forkJoin(deleteRequests).subscribe({
            next: () => {
              // Después de eliminar, crear las nuevas relaciones
              this.crearTodasLasRelacionesDispositivos(idProducto);
            },
            error: (error) => {
              console.error('Error eliminando relaciones existentes:', error);
              this.isLoading = false;
              alert_error("Error", "Error al actualizar las relaciones con dispositivos.");
            }
          });
        } else {
          // Si no hay relaciones existentes, solo crear las nuevas
          this.crearTodasLasRelacionesDispositivos(idProducto);
        }
      },
      error: (error) => {
        console.error('Error obteniendo relaciones existentes:', error);
        this.isLoading = false;
        alert_error("Error", "Error al obtener las relaciones existentes.");
      }
    });
  
  }

  // Método auxiliar para crear todas las relaciones (principal + adicionales)
crearTodasLasRelacionesDispositivos(idProducto: number): void {
  const todasLasRelaciones: ProductoDispositivoRequest[] = [];

  // Agregar dispositivo principal
  if (this.dispositivoPrincipalSeleccionado) {
    todasLasRelaciones.push({
      idProductoDispositivo: 0,
      idProducto: idProducto,
      idModelo: this.dispositivoPrincipalSeleccionado.modelos.idModelo
    });
  }

   // CAMBIO: Solo agregar dispositivos adicionales si el producto es universal
   if (this.productoEnvio.esUniversal) {
    this.dispositivosAdicionalesSeleccionados.forEach(dispositivo => {
      todasLasRelaciones.push({
        idProductoDispositivo: 0,
        idProducto: idProducto,
        idModelo: dispositivo.modelos.idModelo
      });
    });
  }

  // Crear todas las relaciones
  if (todasLasRelaciones.length > 0) {
    const createRequests = todasLasRelaciones.map(relacion =>
      this._productoDispositivoService.create(relacion)
    );

    forkJoin(createRequests).subscribe({
      next: () => {
        this.isLoading = false;
        const mensaje = this.productoEnvio.esUniversal 
        ? "El producto universal y sus dispositivos se han actualizado correctamente."
        : "El producto específico se ha actualizado correctamente.";
        alert_success("Registro actualizado", "El producto y sus dispositivos se han actualizado correctamente.");
        this.cerrarModal(true);
      },
      error: (error) => {
        this.isLoading = false;
        alert_error("Error", "Error al crear las nuevas relaciones con dispositivos.");
        console.error(error);
      }
    });
  } else {
    this.isLoading = false;
    alert_success("Registro actualizado", "El producto se ha actualizado correctamente.");
    this.cerrarModal(true);
  }
}

  obtenerTDocs(){
     this._categoriaService.getAll().subscribe({
      next:(data:CategoriaResponse[])=>
        {
          this.categoria=data;
        },
      error:()=>{},
      complete:()=>{}
    })
  }

  cerrarModal(res:boolean)
  {
    //true ==> hubo modificacion en la base de datos
    //false ==> NO hubo modificacion en la base de datos
    this.closeModalEmmit.emit(res);
  }
}