import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';


export interface Product {
id: number;
title: string;
img:string;
price: number;
subtotal:number;
Quantity:number;
}


@Injectable({ providedIn: 'root' })
export class ProductsService {


private api = 'http://localhost:3000/products'
    
private data: Product[] = [
// { id: 1, title: 'Laptop', price: 20000 , subtotal: 20000 , Quantity: 1},
// { id: 2, title: 'Mobile', price: 12000 , subtotal: 12000 , Quantity: 1},
// { id: 3, title: 'Headphones', price: 800 , subtotal: 800 ,  Quantity: 1},
];


constructor(private http :HttpClient) {}


// Simulate HTTP call
getProducts(): Observable<Product[]> {
// return of(this.data).pipe(delay(500));
return this.http.get<Product[]>(this.api)
}
}
// json-server --watch "D:\Others\Ahmed\angular state\state\public\products.json" --port 3000