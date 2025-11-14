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
    // Cria objeto limpo removendo undefined e null
    const petLimpo: any = {};
    
    // Processa cada campo do pet
    for (const key in pet) {
      if (pet.hasOwnProperty(key)) {
        const value = (pet as any)[key];
        
        // Ignora undefined e null
        if (value === undefined || value === null) {
          continue;
        }
        
        // Para arrays, envia mesmo se vazio (backend pode esperar)
        if (Array.isArray(value)) {
          petLimpo[key] = value;
          continue;
        }
        
        // Para strings vazias em campos opcionais, não envia
        // Mas mantém campos obrigatórios mesmo vazios
        if (typeof value === 'string' && value === '') {
          const camposObrigatorios = ['nome', 'especie', 'raca'];
          if (camposObrigatorios.includes(key)) {
            petLimpo[key] = value;
          }
          continue;
        }
        
        // Inclui o valor
        petLimpo[key] = value;
      }
    }
    
    console.log('=== ENVIANDO PET PARA API ===');
    console.log('URL:', this.API);
    console.log('Dados:', JSON.stringify(petLimpo, null, 2));
    
    return this.http.post<Pet>(this.API, petLimpo).pipe(
      tap({
        next: (novoPet: Pet) => {
          console.log('✅ Pet salvo com sucesso:', novoPet);
          const petsAtuais = this.petsSignal();
          this.petsSignal.set([...petsAtuais, novoPet]);
        },
        error: (erro: any) => {
          console.error('❌ ERRO AO ADICIONAR PET');
          console.error('Erro completo:', erro);
          console.error('Status HTTP:', erro?.status);
          console.error('Status Text:', erro?.statusText);
          console.error('URL:', erro?.url);
          if (erro?.error) {
            console.error('Resposta do servidor:', JSON.stringify(erro.error, null, 2));
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

