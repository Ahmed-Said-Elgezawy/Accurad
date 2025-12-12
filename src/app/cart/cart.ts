import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../service/products.service';
import { Store } from '@ngrx/store';
import * as CartSelectors from './store/cart.selectors';
import * as CartActions from './store/cart.actions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-cart',
  imports: [CommonModule,FormsModule],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})

export class Cart implements OnInit{
ngOnInit(): void {

}
private store = inject(Store)

items$: Observable<Product[]> = this.store.select(CartSelectors.selectCartItems);
total$ = this.store.select(CartSelectors.selectCartTotal);
  

remove(id: number) {
this.store.dispatch(CartActions.removeFromCart({ productId: id }));
}
// quantity:number = 1
// increase(id: number ) {
//   this.quantity++
//   this.store.dispatch(CartActions.updateQuantity({ productId: id , value: this.quantity}));
// }

// decrease(id: number ) {
//   if(this.quantity > 1){
//     this.quantity--
//   }
//   this.store.dispatch(CartActions.updateQuantity({ productId: id, value: this.quantity }));
// }

currentvalue:number = 1
updateQte(id:number , value:number){
  this.store.dispatch(CartActions.updateQuantity({productId:id , value  })) 
}

}
