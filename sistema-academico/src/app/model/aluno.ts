export class Aluno {
    constructor(
        public nome: string,
        public nota: number,
        public id?: number // opcional para criação
    ) { }

    estaAprovado(): boolean {
        return this.nota >= 7;
    }
}