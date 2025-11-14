import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PetService } from '../../service/pet-service';
import { DonoService } from '../../service/dono-service';
import { Pet } from '../../model/pet';
import { Dono } from '../../model/dono';

type PetComDono = Pet & { dono?: Dono };

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  pets = computed<PetComDono[]>(() => {
    const pets = this.petService.getPets()();
    const donos = this.donoService.getDonos()();
    
    return pets.map((pet: Pet) => ({
      ...pet,
      dono: donos.find((dono: Dono) => dono.id === pet.donoId)
    } as PetComDono));
  });
  donos = computed(() => this.donoService.getDonos()());

  constructor(
    private petService: PetService,
    private donoService: DonoService,
    private router: Router
  ) {}

  irParaCadastrarPet() {
    this.router.navigate(['/cadastrar-pet']);
  }

  irParaCadastrarDono() {
    this.router.navigate(['/cadastrar-dono']);
  }

  verDetalhesPet(pet: PetComDono) {
    this.router.navigate(['/detalhes-pet', pet.id]);
  }

  editarPet(pet: PetComDono) {
    this.router.navigate(['/editar-pet', pet.id]);
  }

  excluirPet(pet: PetComDono) {
    if (confirm(`Tem certeza que deseja excluir o pet ${pet.nome}?`)) {
      this.petService.excluirPet(pet.id!);
    }
  }

  editarDono(donoId: number) {
    this.router.navigate(['/editar-dono', donoId]);
  }

  excluirDono(donoId: number) {
    const dono = this.donoService.getDonoById(donoId);
    if (dono && confirm(`Tem certeza que deseja excluir o dono ${dono.nomeCompleto}? Isso também excluirá todos os pets associados.`)) {
      this.donoService.excluirDono(donoId);
      this.petService.listar().subscribe();
    }
  }
}
