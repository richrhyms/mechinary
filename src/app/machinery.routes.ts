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
import { MachineryGuard } from './machinery.guard';
import { ClassifiedComponent } from './classified/classified.component';
import { PaymentComponent } from './payment/payment/payment.component';



export const Routes = [
    { path: '', redirectTo: 'home' ,pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'machines', component: MachineriesComponent },
    { path: 'machine/:id', component: MachineryComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'profile', canActivate: [MachineryGuard] , component: ProfileComponent, children: [
        { path: 'dashboard', component: DashboardComponent },
        { path: 'my-listings', component: MyListingsComponent },    
        { path: 'my-profile', component: MyProfileComponent },
        { path: '**', component: DashboardComponent }
    ] },    
    { path: 'pricing', component: SubscribeComponent },   
    { path: 'classified', component: ClassifiedComponent },       
    { path: 'payment', component: PaymentComponent },
    { path: '**', component: HomeComponent }
]

