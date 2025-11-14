import { inject, Injectable, signal } from '@angular/core';
import { Pet } from '../model/pet';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root', 
})
export class PetService {
  private http = inject(HttpClient);
  private readonly API = "http://localhost:5281/api/pet";
  private petsSignal = signal<Pet[]>([]);

  constructor() {
    // Carrega pets apenas se a API estiver disponível
    try {
      this.carregarPets();
    } catch (error) {
      console.warn('Erro ao inicializar carregamento de pets:', error);
    }
  }

  getPets() {
    return this.petsSignal;
  }

  private carregarPets() {
    this.http.get<Pet[]>(this.API).subscribe({
      next: (pets: Pet[]) => this.petsSignal.set(pets),
      error: (erro: any) => {
        console.error('Erro ao carregar pets:', erro);
        this.petsSignal.set([]);
      }
    });
  }

  listar(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.API).pipe(
      tap((pets: Pet[]) => this.petsSignal.set(pets))
    );
  }

  adicionar(pet: Omit<Pet, 'id'>): Observable<Pet> {
    // Limpa os dados antes de enviar
    const petLimpo: any = {};
    
    Object.keys(pet).forEach(key => {
      const value = (pet as any)[key];
      
      // Campos obrigatórios sempre são incluídos
      if (['nome', 'especie', 'raca', 'idade', 'donoId'].includes(key)) {
        petLimpo[key] = value;
        return;
      }
      
      // Arrays vazios podem ser enviados (backend pode esperar)
      if (Array.isArray(value)) {
        petLimpo[key] = value;
        return;
      }
      
      // Remove apenas campos opcionais que estão undefined/null
      // Strings vazias em campos opcionais são removidas
      if (value !== undefined && value !== null) {
        if (typeof value === 'string' && value === '') {
          return; // Não inclui strings vazias em campos opcionais
        }
        petLimpo[key] = value;
      }
    });
    
    console.log('Enviando pet para API:', JSON.stringify(petLimpo, null, 2));
    
    return this.http.post<Pet>(this.API, petLimpo).pipe(
      tap({
        next: (novoPet: Pet) => {
          console.log('Pet salvo com sucesso:', novoPet);
          const petsAtuais = this.petsSignal();
          this.petsSignal.set([...petsAtuais, novoPet]);
        },
        error: (erro: any) => {
          console.error('Erro ao adicionar pet:', erro);
          if (erro?.status) {
            console.error('Status:', erro.status);
          }
          if (erro?.message) {
            console.error('Mensagem:', erro.message);
          }
          if (erro?.error) {
            console.error('Erro do servidor:', erro.error);
          }
        }
      })
    );
  }

  atualizar(pet: Pet): Observable<Pet> {
    return this.http.put<Pet>(`${this.API}/${pet.id}`, pet).pipe(
      tap((petAtualizado: Pet) => {
        const petsAtuais = this.petsSignal();
        const index = petsAtuais.findIndex((p: Pet) => p.id === pet.id);
        if (index !== -1) {
          petsAtuais[index] = petAtualizado;
          this.petsSignal.set([...petsAtuais]);
        }
      })
    );
  }

  excluirPet(id: number) {
    this.http.delete(`${this.API}/${id}`).subscribe({
      next: () => {
        const petsAtuais = this.petsSignal();
        this.petsSignal.set(petsAtuais.filter((p: Pet) => p.id !== id));
      },
      error: (erro: any) => {
        console.error('Erro ao excluir pet:', erro);
        alert('Erro ao excluir pet');
      }
    });
  }

  obterPorId(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.API}/${id}`);
  }
}

