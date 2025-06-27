import { Component, OnInit } from '@angular/core';

import { ProductoService } from '../../service/producto.service';
import { CommonModule } from '@angular/common';
import { ProductoResponse } from '../../models/producto-response.model';
import { ImagenService } from 'src/app/modulos/mantenimiento/service/imagen.service';
import { CarritoService } from '../../service/carrito.service';
import { CarritoItem } from '../../models/carrito-response.model';
import { CategoriaResponse } from 'src/app/modulos/mantenimiento/models/categoria-response.model';
import { CategoriaService } from 'src/app/modulos/mantenimiento/service/categoria.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SearchService } from '../../service/search.service';
import { Subscription } from 'rxjs';
import { TipoProductoResponse } from '../../models/tipoProducto-response.model';
import { TipoProductoService } from '../../service/tipo-producto.service';
import { MarcaResponse } from '../../models/marca-response.model';
import { TipoDispositivoResponse } from '../../models/tipoDispositivo-response.model';
import { ModeloDispositivoResponse } from '../../models/modeloDispositivo-response.model';
import { ProductoDispositivoResponse } from '../../models/productoDispositivo-response.model';
import { MarcaService } from 'src/app/modulos/mantenimiento/service/marca.service';
import { TipoDispositivoService } from 'src/app/modulos/mantenimiento/service/tipo-dispositivo.service';
import { ModeloDispositivoService } from 'src/app/modulos/mantenimiento/service/modelo-dispositivo.service';
import { ProductoDispositivoService } from 'src/app/modulos/mantenimiento/service/producto-dispositivo.service';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-productos.component.html',
  styleUrl: './lista-productos.component.scss'
})
export class ListaProductosComponent implements OnInit {
  productos: ProductoResponse[] = [];
  productosFiltrados: ProductoResponse[] = [];
  
  categorias: CategoriaResponse[] = [];
  tiposProducto: TipoProductoResponse[] = [];
  marca: MarcaResponse[]=[]
  tiposDispositivo: TipoDispositivoResponse[] = [];
  modelosDispositivo: ModeloDispositivoResponse[] = [];
  productosDispositivo: ProductoDispositivoResponse[] = [];
  
  tiposProductoFiltrados: TipoProductoResponse[] = [];
  marcasFiltradas: MarcaResponse[] = [];
  tiposDispositivoFiltrados: TipoDispositivoResponse[] = [];
  modelosDispositivoFiltrados: ModeloDispositivoResponse[] = [];

  categoriaSeleccionada: number | null = null;
  tipoProductoSeleccionado: number | null = null;
  marcaSeleccionada: number | null = null;
  tipoDispositivoSeleccionado: number | null = null;
  modeloDispositivoSeleccionado: number | null = null;
  filtroUniversal: boolean | null = null; // Para filtrar productos universales

  private searchSubscription: Subscription;
  currentSearchTerm: string = '';
  filterForm :FormGroup; 


  constructor(
     private fb: FormBuilder,
    private _productoService:ProductoService,
    private _categoriaService:CategoriaService,
    private _imagenService:ImagenService,
    private _carritoService:CarritoService,
    private _tipoProductoService: TipoProductoService,
    private _marcaService: MarcaService,
    private _tipoDispositivoService: TipoDispositivoService,
    private _modeloDispositivoService: ModeloDispositivoService,
    private _productoDispositivoService: ProductoDispositivoService,
    private searchService: SearchService,
  ){
     this.filterForm =this.fb.group({});
      this.searchSubscription = this.searchService.searchTerm$.subscribe(term => {
      this.currentSearchTerm = term;
      this.aplicarFiltros();
    });
  }
  
  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
    this.cargarTiposProducto();
    this.cargarDatosMaestros();
  }

   ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  async cargarDatosMaestros() {
    try {
      // Cargar todos los datos maestros en paralelo
      await Promise.all([
        this.cargarProductos(),
        this.cargarCategorias(),
        this.cargarTiposProducto(),
        this.cargarMarcas(),
        this.cargarTiposDispositivo(),
        this.cargarModelosDispositivo(),
        this.cargarProductosDispositivo()
      ]);
      
      // Inicializar filtros
      this.inicializarFiltros();
    } catch (error) {
      console.error('Error al cargar datos maestros:', error);
    }
  }

  inicializarFiltros() {
    this.tiposProductoFiltrados = [...this.tiposProducto];
    this.marcasFiltradas = [...this.marca];
    this.tiposDispositivoFiltrados = [...this.tiposDispositivo];
    this.modelosDispositivoFiltrados = [...this.modelosDispositivo];
  }
  aplicarFiltros() {
    let resultado = [...this.productos];

    // Filtro por categoría
    if (this.categoriaSeleccionada !== null) {
      resultado = resultado.filter(p => p.idCategoria === this.categoriaSeleccionada);
      this.filtrarTiposProductoPorCategoria();
    } else {
      this.tiposProductoFiltrados = [...this.tiposProducto];
    }

    // Filtro por tipo de producto
    if (this.tipoProductoSeleccionado !== null) {
      resultado = resultado.filter(p => p.idTipoProducto === this.tipoProductoSeleccionado);
    }

    // Filtro por productos universales
    if (this.filtroUniversal !== null) {
      resultado = resultado.filter(p => p.esUniversal === this.filtroUniversal);
    }

    // Filtros por dispositivos asociados (solo para productos no universales)
    if (this.marcaSeleccionada !== null || this.tipoDispositivoSeleccionado !== null || this.modeloDispositivoSeleccionado !== null) {
      const productosConDispositivos = this.filtrarPorDispositivos(resultado);
      resultado = productosConDispositivos;
    }

    // Filtro por búsqueda
    if (this.currentSearchTerm.trim()) {
      const termLower = this.currentSearchTerm.toLowerCase();
      resultado = resultado.filter(producto =>
        producto.nombre.toLowerCase().includes(termLower) ||
        producto.descripcion?.toLowerCase().includes(termLower) ||
        producto.codigoProducto?.toLowerCase().includes(termLower)
      );
    }
    this.productosFiltrados = resultado;
    this.actualizarFiltrosDisponibles();
  }

  filtrarPorDispositivos(productos: ProductoResponse[]): ProductoResponse[] {
    // Obtener IDs de productos que tienen dispositivos asociados según los filtros
    let productosValidosIds = new Set<number>();

    // Si no hay filtros de dispositivos, retornar productos que tienen algún dispositivo asociado
    if (!this.marcaSeleccionada && !this.tipoDispositivoSeleccionado && !this.modeloDispositivoSeleccionado) {
      productosValidosIds = new Set(this.productosDispositivo.map(pd => pd.idProducto));
    } else {
      // Aplicar filtros específicos
      let modelosValidos = [...this.modelosDispositivo];

      // Filtrar modelos por marca
      if (this.marcaSeleccionada !== null) {
        modelosValidos = modelosValidos.filter(m => m.idMarca === this.marcaSeleccionada);
      }

      // Filtrar modelos por tipo de dispositivo
      if (this.tipoDispositivoSeleccionado !== null) {
        modelosValidos = modelosValidos.filter(m => m.idTipoDispositivo === this.tipoDispositivoSeleccionado);
      }

      // Filtrar por modelo específico
      if (this.modeloDispositivoSeleccionado !== null) {
        modelosValidos = modelosValidos.filter(m => m.idModelo === this.modeloDispositivoSeleccionado);
      }

      // Obtener productos que tienen estos modelos asociados
      const idsModelosValidos = modelosValidos.map(m => m.idModelo);
      const productosConModelosValidos = this.productosDispositivo
        .filter(pd => idsModelosValidos.includes(pd.idModelo))
        .map(pd => pd.idProducto);

      productosValidosIds = new Set(productosConModelosValidos);
    }

    // Retornar solo productos que coinciden
    return productos.filter(p => productosValidosIds.has(p.idProducto));
  }

  actualizarFiltrosDisponibles() {
    // Si no hay filtros activos de dispositivos, mostrar todas las opciones
    const noHayFiltrosDispositivos = this.marcaSeleccionada === null && 
                                     this.tipoDispositivoSeleccionado === null && 
                                     this.modeloDispositivoSeleccionado === null;
  
    if (noHayFiltrosDispositivos) {
      // Mostrar todas las opciones disponibles
      this.marcasFiltradas = [...this.marca];
      this.tiposDispositivoFiltrados = [...this.tiposDispositivo];
      this.modelosDispositivoFiltrados = [...this.modelosDispositivo];
      return;
    }
   // ⚠️ SOLO ACTUALIZAR si no hay marca seleccionada
   if (this.marcaSeleccionada === null) {
    const productosIds = this.productosFiltrados.map(p => p.idProducto);

    const modelosDisponiblesIds = this.productosDispositivo
      .filter(pd => productosIds.includes(pd.idProducto))
      .map(pd => pd.idModelo);

    const modelosDisponibles = this.modelosDispositivo.filter(m => modelosDisponiblesIds.includes(m.idModelo));

    const marcasDisponiblesIds = [...new Set(modelosDisponibles.map(m => m.idMarca))];
    this.marcasFiltradas = this.marca.filter(m => marcasDisponiblesIds.includes(m.idMarca));
  }
  }

  filtrarTiposProductoPorCategoria() {
    if (this.categoriaSeleccionada !== null) {
      this.tiposProductoFiltrados = this.tiposProducto.filter(
        tipo => tipo.idCategoria === this.categoriaSeleccionada
      );
    } else {
      this.tiposProductoFiltrados = [...this.tiposProducto];
    }
  }

  // Métodos de filtrado
  filtrarPorCategoria(idCategoria: number | null) {
    this.categoriaSeleccionada = idCategoria;
    this.tipoProductoSeleccionado = null;
    this.aplicarFiltros();
  }

  filtrarPorTipoProducto(idTipoProducto: number | null) {
    this.tipoProductoSeleccionado = idTipoProducto;
    this.aplicarFiltros();
  }

  filtrarPorMarca(idMarca: number | null) {
    this.marcaSeleccionada = idMarca;
    this.modeloDispositivoSeleccionado = null; // Resetear modelo al cambiar marca
    this.aplicarFiltros();
  }

  filtrarPorTipoDispositivo(idTipoDispositivo: number | null) {
    this.tipoDispositivoSeleccionado = idTipoDispositivo;
    this.modeloDispositivoSeleccionado = null; // Resetear modelo al cambiar tipo
    this.aplicarFiltros();
  }

  filtrarPorModeloDispositivo(idModelo: number | null) {
    this.modeloDispositivoSeleccionado = idModelo;
    this.aplicarFiltros();
  }

  filtrarPorUniversal(esUniversal: boolean | null) {
    this.filtroUniversal = esUniversal;
    // Si filtramos por universales, limpiar filtros de dispositivos
    if (esUniversal === true) {
      this.marcaSeleccionada = null;
      this.tipoDispositivoSeleccionado = null;
      this.modeloDispositivoSeleccionado = null;
    }
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.categoriaSeleccionada = null;
    this.tipoProductoSeleccionado = null;
    this.marcaSeleccionada = null;
    this.tipoDispositivoSeleccionado = null;
    this.modeloDispositivoSeleccionado = null;
    this.filtroUniversal = null;
    
    // Reinicializar todos los filtros a su estado completo
    this.inicializarFiltros();
    
    this.aplicarFiltros();
  }
  // cargarCategorias() {
  //   this._categoriaService.getAll().subscribe(
  //     (categorias) => {
  //       this.categorias = categorias;
  //     },
  //     (error) => console.error('Error al cargar categorías', error)
  //   );
  // }

  // Métodos de carga de datos
  async cargarCategorias() {
    return new Promise<void>((resolve, reject) => {
      this._categoriaService.getAll().subscribe(
        (categorias) => {
          this.categorias = categorias;
          resolve();
        },
        (error) => {
          console.error('Error al cargar categorías', error);
          reject(error);
        }
      );
    });
  }

  async cargarTiposProducto() {
    return new Promise<void>((resolve, reject) => {
      this._tipoProductoService.getAll().subscribe(
        (tiposProducto) => {
          this.tiposProducto = tiposProducto;
          resolve();
        },
        (error) => {
          console.error('Error al cargar tipos de producto', error);
          reject(error);
        }
      );
    });
  }

  async cargarMarcas() {
    return new Promise<void>((resolve, reject) => {
      this._marcaService.getAll().subscribe(
        (marcas) => {
          this.marca = marcas;
          resolve();
        },
        (error) => {
          console.error('Error al cargar marcas', error);
          reject(error);
        }
      );
    });
  }

  async cargarTiposDispositivo() {
    return new Promise<void>((resolve, reject) => {
      this._tipoDispositivoService.getAll().subscribe(
        (tiposDispositivo) => {
          this.tiposDispositivo = tiposDispositivo;
          resolve();
        },
        (error) => {
          console.error('Error al cargar tipos de dispositivo', error);
          reject(error);
        }
      );
    });
  }

  async cargarModelosDispositivo() {
    return new Promise<void>((resolve, reject) => {
      this._modeloDispositivoService.getAll().subscribe(
        (modelosDispositivo) => {
          this.modelosDispositivo = modelosDispositivo;
          resolve();
        },
        (error) => {
          console.error('Error al cargar modelos de dispositivo', error);
          reject(error);
        }
      );
    });
  }

  async cargarProductosDispositivo() {
    return new Promise<void>((resolve, reject) => {
      this._productoDispositivoService.getAll().subscribe(
        (productosDispositivo) => {
          this.productosDispositivo = productosDispositivo;
          resolve();
        },
        (error) => {
          console.error('Error al cargar productos dispositivo', error);
          reject(error);
        }
      );
    });
  }

  async cargarProductos() {
    return new Promise<void>((resolve, reject) => {
      this._productoService.getAll().subscribe(
        (productos) => {
          this.productos = productos;
          this.productosFiltrados = productos;

          // Cargar imágenes
          this.productos.forEach((producto) => {
            this._imagenService.getById(producto.idImagen).subscribe(
              (imagenResponse) => {
                producto.imagenUrl = imagenResponse.url;
              },
              (error) => console.error('Error al cargar imagen', error)
            );
          });
          
          console.log(productos);
          resolve();
        },
        (error) => {
          console.error('Error al cargar productos', error);
          reject(error);
        }
      );
    });
  }


  
  agregarAlCarrito(producto: ProductoResponse) {
    const itemCarrito: CarritoItem = {
      productoId: producto.idProducto,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1,
      imagenUrl: producto.imagenUrl
    };

    this._carritoService.agregarAlCarrito(itemCarrito);
    console.log(`${producto.nombre} agregado al carrito.`);
  }

  getNombreCategoria(idCategoria: number): string {
    const categoria = this.categorias.find(c => c.idCategoria === idCategoria);
    return categoria ? categoria.nombre : 'Categoría desconocida';
  }

  getNombreTipoProducto(idTipoProducto: number): string {
    const tipoProducto = this.tiposProducto.find(t => t.idTipoProducto === idTipoProducto);
    return tipoProducto ? tipoProducto.nombre : 'Tipo desconocido';
  }

  getNombreMarca(idMarca: number): string {
    const marca = this.marca.find(m => m.idMarca === idMarca);
    return marca ? marca.nombre : 'Marca desconocida';
  }

  getNombreTipoDispositivo(idTipoDispositivo: number): string {
    const tipoDispositivo = this.tiposDispositivo.find(td => td.idTipoDispositivo === idTipoDispositivo);
    return tipoDispositivo ? tipoDispositivo.nombre : 'Tipo desconocido';
  }

  getNombreModeloDispositivo(idModelo: number): string {
    const modelo = this.modelosDispositivo.find(m => m.idModelo === idModelo);
    return modelo ? modelo.nombreModelo : 'Modelo desconocido';
  }

  // Método para obtener dispositivos compatibles de un producto
  getDispositivosCompatibles(idProducto: number): string[] {
    const dispositivosProducto = this.productosDispositivo.filter(pd => pd.idProducto === idProducto);
    return dispositivosProducto.map(pd => {
      const modelo = this.modelosDispositivo.find(m => m.idModelo === pd.idModelo);
      if (modelo) {
        const marca = this.getNombreMarca(modelo.idMarca);
        return `${marca} ${modelo.nombreModelo}`;
      }
      return 'Modelo desconocido';
    });
  }

  // Método para verificar si un producto tiene filtros de dispositivos activos
  tieneCompatibilidadEspecifica(producto: ProductoResponse): boolean {
    return !producto.esUniversal && this.getDispositivosCompatibles(producto.idProducto).length > 0;
  }
}
