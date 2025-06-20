import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { PruebaComponent } from './pages/prueba/prueba.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { AuthInterceptor } from './services/auth.interceptor';
import { AppNavbarComponent } from './pages/app-navbar/app-navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';



@NgModule({ declarations: [
        AppComponent,
        PruebaComponent,
        NotFoundComponent,
        WelcomeComponent,
        AppNavbarComponent,
    ],
    bootstrap: [AppComponent], 
    imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        BrowserAnimationsModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatFormFieldModule], providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
