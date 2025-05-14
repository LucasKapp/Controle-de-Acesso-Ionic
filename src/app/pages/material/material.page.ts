import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { MaterialService } from '../../services/material.service';

interface Material { id: number; name: string; description: string; quantity: number; }

@Component({
  selector: 'app-material',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: 'material.page.html',
  styleUrls: ['material.page.scss'],
})
export class MaterialPage implements OnInit {

  materialName = '';
  materialDescription = '';
  materialQuantity = 0;

  materials: Material[] = [];

  constructor(private materialService: MaterialService) {}

  ngOnInit() {
    this.loadMaterials();
  }

  registerMaterial() {
    this.materialService.registerMaterial(this.materialName, this.materialDescription, this.materialQuantity)
      .subscribe(res => {
        if (res.success) {
          alert('Material Cadastrado com Sucesso!');
          this.resetForm();
          this.loadMaterials();
        } else {
          alert('Algo deu errado, tente novamente');
        }
      });
  }

  resetForm() {
    this.materialName = '';
    this.materialDescription = '';
    this.materialQuantity = 0;
  }

  loadMaterials() {
    this.materialService.getMaterials().subscribe(list => {
      this.materials = list;
    });
  }
}
