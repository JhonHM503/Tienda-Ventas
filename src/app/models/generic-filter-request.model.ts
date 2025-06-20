export class GenericFilterRequest {
    numeroPagina: number=1;
    cantidad: number=5;
    filtros: ItemFilter[] =[] ;
}

export class ItemFilter {
    name: string="";
    value: string="";
}