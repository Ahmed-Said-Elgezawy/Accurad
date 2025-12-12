import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Product } from '../service/products.service';
import * as CartActions from '../cart/store/cart.actions';
import * as ProductSelectors from '../products/store/products.selectors';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-details',
  imports: [CommonModule],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {

private route = inject(ActivatedRoute)
private store = inject(Store)

id = Number(this.route.snapshot.paramMap.get('id'))
product$ = this.store.select(ProductSelectors.selectProductById(this.id))

addToCart(product: Product) {
  this.store.dispatch(CartActions.addToCart({ product }));
}
}
