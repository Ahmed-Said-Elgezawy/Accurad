import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Product } from '../service/products.service';
import * as ProductsSelectors from './store/products.selectors';
import * as ProductsActions from './store/products.actions';
import * as CartActions from '../cart/store/cart.actions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-products',
  imports: [CommonModule,FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.css',
})


export class ProductsComponent implements OnInit{

private store = inject(Store);
private route = inject(Router)
products$: Observable<Product[]> = this.store.select(ProductsSelectors.selectAllProducts);
// loading$ = this.store.select(ProductsSelectors.selectProductsLoading);



ngOnInit(): void {
this.store.dispatch(ProductsActions.loadProducts());
}


addToCart(product: Product) {
this.store.dispatch(CartActions.addToCart({ product }));
}
cr:string = ''
text:string = this.cr



opendetails(productId:number){
this.route.navigate(['/details',productId])
}


value!: string;
}