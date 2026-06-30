import { Component, computed, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PROYECTOS_MOCK, CampanaProyecto, ProyectoDetalle, ProductoRef, AnguloVenta } from '../../../../../mocks/gali-v6/proyectos.mock';

interface CatalogoItem { id: string; nombre: string; adaScore: number; margenEst: string; stockLabel: string; }

const CATALOGO_CD: CatalogoItem[] = [
  { id: 'collar-gps', nombre: 'Collar GPS para mascotas', adaScore: 91, margenEst: '38%', stockLabel: '145 uds' },
  { id: 'kbeauty-kit', nombre: 'Kit K-Beauty Hidratación', adaScore: 87, margenEst: '22%', stockLabel: '12 uds' },
  { id: 'difusor-aromas', nombre: 'Difusor de Aromas USB', adaScore: 84, margenEst: '42%', stockLabel: '230 uds' },
  { id: 'masajeador-cuello', nombre: 'Masajeador Cuello & Espalda', adaScore: 81, margenEst: '35%', stockLabel: '88 uds' },
  { id: 'organizador-escritorio', nombre: 'Organizador Escritorio Bambú', adaScore: 78, margenEst: '45%', stockLabel: '310 uds' },
  { id: 'luz-led-rgb', nombre: 'Tira LED RGB Smart 5m', adaScore: 76, margenEst: '40%', stockLabel: '195 uds' },
  { id: 'soporte-celular', nombre: 'Soporte Celular Auto Magnético', adaScore: 74, margenEst: '48%', stockLabel: '425 uds' },
  { id: 'auriculares-bt', nombre: 'Auriculares Bluetooth Sport', adaScore: 73, margenEst: '32%', stockLabel: '67 uds' },
  { id: 'jardin-hidroponico', nombre: 'Kit Jardín Hidropónico Indoor', adaScore: 71, margenEst: '37%', stockLabel: '45 uds' },
  { id: 'almohada-cervical', nombre: 'Almohada Cervical Memory Foam', adaScore: 69, margenEst: '33%', stockLabel: '120 uds' },
];

const AGENTE_LABEL: Record<string, { label: string; icono: string; autopilot: boolean }> = {
  'roax-ads':            { label: 'ROAS Tracker',         icono: 'pi-chart-bar',  autopilot: true  },
  'stock-guardian':      { label: 'Stock Guardian',        icono: 'pi-box',        autopilot: true  },
  'vigilante-logistico': { label: 'Vigilante Logístico',  icono: 'pi-truck',      autopilot: false },
  'ada-spy':             { label: 'ADA Spy',              icono: 'pi-search',     autopilot: false },
  'chatea-pro':          { label: 'Chatea Pro',           icono: 'pi-comments',   autopilot: true  },
};

const CONEXION_LABEL: Record<string, { label: string; icono: string; estado: string }> = {
  'tiktok-ads':  { label: 'TikTok Ads',  icono: 'pi-tiktok',    estado: 'Conectado' },
  'meta-ads':    { label: 'Meta Ads',    icono: 'pi-facebook',  estado: 'Conectado' },
  'google-ads':  { label: 'Google Ads', icono: 'pi-google',    estado: 'Conectado' },
  'whatsapp':    { label: 'WhatsApp',    icono: 'pi-whatsapp',  estado: 'Conectado' },
};

interface HistorialItem {
  tiempo: string;
  agente: string;
  accion: string;
  impacto?: string;
}

const HISTORIAL_MOCK: HistorialItem[] = [
  { tiempo: 'hace 2h',  agente: 'ROAS Tracker',  accion: 'Escaló presupuesto 20%',              impacto: 'ROAS pasó de 1.8x a 2.3x' },
  { tiempo: 'ayer',     agente: 'Stock Guardian', accion: 'Alertó stock bajo en proveedor',       impacto: 'Pediste reposición a tiempo' },
  { tiempo: '2 días',   agente: 'ROAS Tracker',  accion: 'Detectó audiencia de alto rendimiento', impacto: 'CTR +12% en 18-28 años' },
  { tiempo: '3 días',   agente: 'Stock Guardian', accion: 'Sincronizó inventario con proveedor',  impacto: '120 unidades confirmadas' },
];

@Component({
  selector: 'app-gali6-campana-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './gali6-campana-detalle.component.html',
  styleUrls: ['./gali6-campana-detalle.component.scss'],
})
export class Gali6CampanaDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  readonly router = inject(Router);

  readonly proyectoId = signal('');
  readonly campanaId = signal('');
  readonly pausada = signal(false);
  readonly toastMsg = signal<string | null>(null);

  // ── Modal cambiar/agregar producto ───────────────────────────────────
  readonly cambiarProductoOpen = signal(false);
  readonly cambiarProductoTargetId = signal<string | null>(null);
  readonly modalBusqueda = signal('');

  // ── Ángulos de venta ─────────────────────────────────────────────────
  readonly angulosVisibles = signal<Set<string>>(new Set());
  readonly nuevoAnguloForm = signal<{ prodId: string; nombre: string; publico: string } | null>(null);

  // ── Pausa granular ───────────────────────────────────────────────────
  readonly pausaMenuOpen = signal(false);

  togglePausaMenu(): void {
    this.pausaMenuOpen.update(v => !v);
  }

  readonly proyecto = computed<ProyectoDetalle | null>(() => {
    const id = this.proyectoId();
    const enMock = PROYECTOS_MOCK.find(p => p.id === id);
    if (enMock) return enMock;
    try {
      const extra: ProyectoDetalle[] = JSON.parse(localStorage.getItem('g6_proyectos_extra') ?? '[]');
      return extra.find(p => p.id === id) ?? null;
    } catch { return null; }
  });

  readonly campana = computed<CampanaProyecto | null>(() =>
    this.proyecto()?.campanas.find(c => c.id === this.campanaId()) ?? null
  );

  // ── Prev/Next campañas ───────────────────────────────────────────────
  readonly todasCampanas = computed(() =>
    this.proyecto()?.campanas ?? []
  );

  readonly campanaIndex = computed(() =>
    this.todasCampanas().findIndex(c => c.id === this.campanaId())
  );

  readonly campanaAnterior = computed(() =>
    this.todasCampanas()[this.campanaIndex() - 1] ?? null
  );

  readonly campanaSiguiente = computed(() =>
    this.todasCampanas()[this.campanaIndex() + 1] ?? null
  );

  // ── Lista de productos de la campaña ─────────────────────────────────
  readonly productosEnCampana = computed<ProductoRef[]>(() => {
    const c = this.campana();
    if (!c) return [];
    if (c.productos && c.productos.length > 0) return c.productos;
    if (c.producto) return [{ id: 'legacy', nombre: c.producto, margenPct: 0, precioVentaLabel: '' }];
    return [];
  });

  readonly historial = HISTORIAL_MOCK;

  ngOnInit(): void {
    this.proyectoId.set(this.route.snapshot.paramMap.get('proyectoId') ?? '');
    this.campanaId.set(this.route.snapshot.paramMap.get('campanaId') ?? '');
  }

  irCampana(id: string): void {
    this.campanaId.set(id);
    this.router.navigate(['/gali-6/proyecto', this.proyectoId(), 'campana', id]);
  }

  volver(): void {
    this.router.navigate(['/gali-6/proyecto', this.proyectoId()], {
      queryParams: { tab: 'campanas' },
    });
  }

  togglePausa(): void {
    this.pausada.update(v => !v);
    this.toastMsg.set(this.pausada() ? '⏸ Campaña pausada' : '▶ Campaña activada');
    setTimeout(() => this.toastMsg.set(null), 2000);
  }

  abrirCambiarProducto(productoId: string): void {
    this.cambiarProductoTargetId.set(productoId);
    this.cambiarProductoOpen.set(true);
  }

  cerrarCambiarProducto(): void {
    this.cambiarProductoOpen.set(false);
    this.cambiarProductoTargetId.set(null);
    this.modalBusqueda.set('');
  }

  // ── Catálogo con búsqueda (corrección 4C) ────────────────────────────
  readonly productosCatalogoBuscados = computed<CatalogoItem[]>(() => {
    const q = this.modalBusqueda().toLowerCase().trim();
    if (!q) return CATALOGO_CD.slice(0, 8);
    return CATALOGO_CD.filter(p => p.nombre.toLowerCase().includes(q));
  });

  asignarProducto(item: CatalogoItem): void {
    const c = this.campana();
    if (!c) return;
    const existeYa = (c.productos ?? []).some(p => p.id === item.id);
    if (existeYa) {
      this.toastMsg.set('Este producto ya está en la campaña.');
      setTimeout(() => this.toastMsg.set(null), 2500);
      this.cerrarCambiarProducto();
      return;
    }
    const nuevo: ProductoRef = {
      id: item.id,
      nombre: item.nombre,
      margenPct: parseInt(item.margenEst, 10),
      precioVentaLabel: '$—',
    };
    const targetId = this.cambiarProductoTargetId();
    if (targetId) {
      const prods = c.productos ?? [];
      const idx = prods.findIndex(p => p.id === targetId);
      if (idx >= 0) prods[idx] = nuevo;
    } else {
      if (!c.productos) c.productos = [];
      c.productos.push(nuevo);
    }
    this.cerrarCambiarProducto();
    this.toastMsg.set(`"${item.nombre}" ${targetId ? 'reemplazado' : 'agregado'} a la campaña.`);
    setTimeout(() => this.toastMsg.set(null), 3000);
  }

  // ── Ángulos de venta (corrección 4B) ─────────────────────────────────
  toggleAngulos(prodId: string): void {
    this.angulosVisibles.update(s => {
      const n = new Set(s);
      n.has(prodId) ? n.delete(prodId) : n.add(prodId);
      return n;
    });
  }

  abrirNuevoAngulo(prodId: string): void {
    this.nuevoAnguloForm.set({ prodId, nombre: '', publico: '' });
  }

  cerrarNuevoAngulo(): void {
    this.nuevoAnguloForm.set(null);
  }

  actualizarNuevoAnguloNombre(nombre: string): void {
    this.nuevoAnguloForm.update(f => f ? { ...f, nombre } : f);
  }

  actualizarNuevoAnguloPublico(publico: string): void {
    this.nuevoAnguloForm.update(f => f ? { ...f, publico } : f);
  }

  guardarNuevoAngulo(): void {
    const f = this.nuevoAnguloForm();
    if (!f || !f.nombre.trim()) return;
    const c = this.campana();
    if (!c) return;
    const prod = (c.productos ?? []).find(p => p.id === f.prodId);
    if (prod) {
      if (!prod.angulos) prod.angulos = [];
      prod.angulos.push({
        id: `a-${Date.now().toString(36)}`,
        nombre: f.nombre.trim(),
        publicoObj: f.publico.trim(),
        estado: 'borrador',
      });
    }
    this.cerrarNuevoAngulo();
    this.toastMsg.set('Ángulo creado como Borrador. Actívalo cuando tengas los creativos.');
    setTimeout(() => this.toastMsg.set(null), 3500);
  }

  toggleAnguloEstado(prodId: string, anguloId: string): void {
    const c = this.campana();
    if (!c) return;
    const prod = (c.productos ?? []).find(p => p.id === prodId);
    const a = prod?.angulos?.find(ang => ang.id === anguloId);
    if (!a) return;
    a.estado = a.estado === 'activo' ? 'pausado' : 'activo';
    this.toastMsg.set(`Ángulo "${a.nombre}" ${a.estado === 'activo' ? 'activado' : 'pausado'}.`);
    setTimeout(() => this.toastMsg.set(null), 3000);
  }

  // ── Pausa granular (corrección 4D) ───────────────────────────────────
  pausarProductoEnCampana(prodId: string): void {
    const c = this.campana();
    if (!c) return;
    const prod = (c.productos ?? []).find(p => p.id === prodId);
    if (!prod) return;
    (prod as any)['pausado'] = true;
    this.pausaMenuOpen.set(false);
    this.toastMsg.set(`"${prod.nombre}" pausado en esta campaña. La pauta de los demás productos sigue activa.`);
    setTimeout(() => this.toastMsg.set(null), 3500);
  }

  // ── Rendimiento: métricas por producto ───────────────────────────────
  readonly tieneMetricasRendimiento = computed(() =>
    (this.campana()?.productos ?? []).some(p => !!(p as any).metricas?.pedidosSem)
  );

  readonly maxHistorial = computed(() => {
    const vals = (this.campana()?.productos ?? [])
      .flatMap(p => ((p as any).metricas?.historial5sem ?? []) as number[]);
    return Math.max(...vals, 1);
  });

  sparkColor(val: number): string {
    const ratio = val / this.maxHistorial();
    if (ratio >= 0.75) return '#22c55e';
    if (ratio >= 0.4)  return '#f59e0b';
    return '#ef4444';
  }

  getAgenteInfo(id: string) { return AGENTE_LABEL[id] ?? { label: id, icono: 'pi-microchip-ai', autopilot: false }; }
  getConexionInfo(id: string) { return CONEXION_LABEL[id] ?? { label: id, icono: '🔌', estado: 'Conectado' }; }

  getRoasClass(c: CampanaProyecto): string {
    if (!c.roasActual) return '';
    return c.roasActual >= c.roasObjetivo ? 'roas--ok' : 'roas--low';
  }
}
