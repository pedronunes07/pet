export class Dono {
    constructor(
        public nomeCompleto: string,
        public email: string,
        public telefone: string,
        public cidade: string,
        public id?: number, 
        public endereco?: string,
        public cep?: string,
        public estado?: string,
        public contatoEmergencia?: string,
        public telefoneEmergencia?: string,
        public observacao?: string
    ) { }
}

