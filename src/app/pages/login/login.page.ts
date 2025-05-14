import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';

interface LoginResponse { success: boolean; token: string; }

@Component({
  selector: 'app-login',
  standalone: true,          
  imports: [IonicModule, FormsModule, RouterModule], 
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {
  username = '';
  password = '';

  constructor(private userService: UserService, private router: Router) {}

  login() {
    this.userService.login(this.username, this.password)
      .subscribe((res: LoginResponse) => {
        if (res.success) {
          localStorage.setItem('userToken', res.token);
          this.router.navigate(['/material']);
        } else {
          alert('Login failed');
        }
      });
  }
}
