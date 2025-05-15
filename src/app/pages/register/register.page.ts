import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface RegisterResponse {
  success: boolean;
}

@Component({
  selector: 'app-register',
  templateUrl: 'register.page.html',
  styleUrls: ['register.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule],
})
export class RegisterPage {

  username: string = '';
  id: string = '';
  password: string = '';

  constructor(private userService: UserService, private router: Router) {}

  register() {
    this.userService.register(this.username, this.id, this.password).subscribe((response: RegisterResponse) => {
      if (response.success) {
        this.router.navigate(['/login']);
      } else {
        alert('Registration failed');
      }
    });
  }
}
