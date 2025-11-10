export interface Vacina {
    nomeVacina: string;
    dataAplicacao: string;
    proximaDose: string;
    nomeVeterinario: string;
}

export class Pet {
    constructor(
        public nome: string,
        public especie: string,
        public raca: string,
        public idade: number,
        public donoId?: number,
        public fotos?: string[],
        public peso?: string,
        public cor?: string,
        public sexo?: string,
        public vacinado?: string,
        public vacinas?: Vacina[],
        public observacoes?: string,
        public observacoesMedicas?: string,
        public id?: number 
    ) { }

    ehAdulto(): boolean {
        return this.idade >= 1;
    }
}

