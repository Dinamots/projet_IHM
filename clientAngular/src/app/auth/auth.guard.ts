import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  NavigationExtras,
  Route,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url: string = state.url;
    if (this.acceptRedirect(url)) {
      return this.checkLogin(url);
    }
    this.navigate('/login');
    return false;
  }

  navigate(url) {
    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;
    // Navigate to the login page with extras
    this.router.navigate([url]);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {
    const url = `/${route.path}`;

    return this.checkLogin(url);
  }

  acceptRedirect(url: string) {
    switch (url) {
      case '/infirmier':
        if (this.authService.loginData) {
          return this.authService.loginData.role === 'ROLE_INFIRMIER';
        }
        return false;
      case '/secretary':
        if (this.authService.loginData) {
          return this.authService.loginData.role === 'ROLE_SECRETAIRE';
        }
        return false;
      default:
        return false;
    }
  }

  checkLogin(url: string): boolean {
    if (this.authService.isLoggedIn) {
      return true;
    }
    this.navigate(url);
    return false;
  }
}
