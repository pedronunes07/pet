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
    this.carregarPets();
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
    return this.http.post<Pet>(this.API, pet).pipe(
      tap((novoPet: Pet) => {
        const petsAtuais = this.petsSignal();
        this.petsSignal.set([...petsAtuais, novoPet]);
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
        this.listar().subscribe();
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

