import { inject, Injectable, signal } from '@angular/core';
import { Dono } from '../model/dono';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root', 
})
export class DonoService {
  private http = inject(HttpClient);
  private readonly API = "http://localhost:5281/api/dono";
  private donosSignal = signal<Dono[]>([]);

  constructor() {
    this.carregarDonos();
  }

  getDonos() {
    return this.donosSignal;
  }

  private carregarDonos() {
    this.http.get<Dono[]>(this.API).subscribe({
      next: (donos: Dono[]) => this.donosSignal.set(donos),
      error: (erro: any) => {
        console.error('Erro ao carregar donos:', erro);
        this.donosSignal.set([]);
      }
    });
  }

  listar(): Observable<Dono[]> {
    return this.http.get<Dono[]>(this.API).pipe(
      tap((donos: Dono[]) => this.donosSignal.set(donos))
    );
  }

  adicionar(dono: Dono | Omit<Dono, 'id'>): Observable<Dono> {
    const { id, ...donoSemId } = dono as Dono;
    return this.http.post<Dono>(this.API, donoSemId).pipe(
      tap((novoDono: Dono) => {
        const donosAtuais = this.donosSignal();
        this.donosSignal.set([...donosAtuais, novoDono]);
      })
    );
  }

  atualizar(dono: Dono): Observable<Dono> {
    return this.http.put<Dono>(`${this.API}/${dono.id}`, dono).pipe(
      tap((donoAtualizado: Dono) => {
        const donosAtuais = this.donosSignal();
        const index = donosAtuais.findIndex((d: Dono) => d.id === dono.id);
        if (index !== -1) {
          donosAtuais[index] = donoAtualizado;
          this.donosSignal.set([...donosAtuais]);
        }
      })
    );
  }

  excluirDono(id: number) {
    this.http.delete(`${this.API}/${id}`).subscribe({
      next: () => {
        const donosAtuais = this.donosSignal();
        this.donosSignal.set(donosAtuais.filter((d: Dono) => d.id !== id));
        this.listar().subscribe();
      },
      error: (erro: any) => {
        console.error('Erro ao excluir dono:', erro);
        alert('Erro ao excluir dono');
      }
    });
  }

  obterPorId(id: number): Observable<Dono> {
    return this.http.get<Dono>(`${this.API}/${id}`);
  }

  getDonoById(id: number): Dono | undefined {
    return this.donosSignal().find((d: Dono) => d.id === id);
  }
}

