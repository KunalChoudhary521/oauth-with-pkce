import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { User } from '../model/user.model';
import { AuthGuard, AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthKeyClockGuard extends AuthGuard {
  user = new User();
  constructor(protected readonly router: Router,
              protected authService: AuthService) {
    super(authService);
  }

  override canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.authService.isAuthenticated$.subscribe(value => {
      // Force the user to log in if currently unauthenticated.
      if(!value) {
        this.authService.loginWithRedirect( {
          appState: { target: state.url }
        });
      } else {
        this.authService.user$.subscribe(user => {
          this.user.authStatus = 'AUTH';
          this.user.name = user?.name || "";
          this.user.email = user?.email || "";
          window.sessionStorage.setItem("userdetails",JSON.stringify(this.user));
        })
      }
    })

    // Get the roles required from the route.
    const requiredRoles = route.data["roles"];

    // Allow the user to proceed if no additional roles are required to access the route.
    if (!(requiredRoles instanceof Array) || requiredRoles.length === 0) {
      return of(true);
    }

    // Allow the user to proceed if all the required roles are present.
    return of(true);//requiredRoles.some((role) => this.roles.includes(role));
  }
}
