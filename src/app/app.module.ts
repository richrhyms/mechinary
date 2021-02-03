import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MachineryService } from './machinery.service';
import { MachineryGuard } from './machinery.guard';
import { Routes } from './machinery.routes'


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { HeaderComponent } from './header/header.component';
import { MachineriesComponent } from './machineries/machineries.component';
import { MachineryComponent } from './machinery/machinery.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './profile/dashboard/dashboard.component';
import { MyProfileComponent } from './profile/my-profile/my-profile.component';
import { MyListingsComponent } from './profile/my-listings/my-listings.component';
import { RegisterComponent } from './register/register.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { ProfileComponent } from './profile/profile.component';
import { ClassifiedComponent } from './classified/classified.component';
import { PaymentComponent } from './payment/payment/payment.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    HeaderComponent,
    MachineriesComponent,
    MachineryComponent,
    FooterComponent,
    LoginComponent,
    DashboardComponent,
    MyProfileComponent,
    MyListingsComponent,
    RegisterComponent,
    SubscribeComponent,
    AboutComponent,
    ContactComponent,
    ProfileComponent,
    ClassifiedComponent,
    PaymentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(Routes),
    HttpClientModule
  ],
  providers: [
    MachineryService,
    MachineryGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
