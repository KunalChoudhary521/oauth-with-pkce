import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user.model';
import { AuthService } from '@auth0/auth0-angular';
import { filter, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user = new User();

  constructor(private authService: AuthService,
              private state: ActivatedRoute) { }

  public async ngOnInit() {
    this.authService.isAuthenticated$.pipe(
      filter(value => value),
      switchMap(() => this.authService.user$))
      .subscribe(user => {
        this.user.authStatus = 'AUTH';
        this.user.name = user?.name || "";
        window.sessionStorage.setItem("userdetails",JSON.stringify(this.user));
      });
  }

  public login() {
    this.authService.loginWithRedirect( {
      appState: { target: this.state.snapshot.url.toString() }
    });
  }

  public logout() {
    this.authService.logout({
      logoutParams: {
        returnTo: location.origin + '/home'
      }
    });
  }

}
