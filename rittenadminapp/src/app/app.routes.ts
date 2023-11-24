import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OrderComponent } from './order/order.component';
import { RouteComponent } from './route/route.component';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent,
        title: "Home page"
    },
    {
        path: "orders",
        component: OrderComponent,
        title: "Orders"
    },
    {
        path: "routes",
        component: RouteComponent,
        title: "Routes"
    }
];
