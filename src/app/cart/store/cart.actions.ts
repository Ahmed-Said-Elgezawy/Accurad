import { createAction, props } from '@ngrx/store';
import { Product } from '../../service/products.service';


export const addToCart = createAction('[Cart] Add To Cart', props<{ product: Product }>());
export const removeFromCart = createAction('[Cart] Remove From Cart', props<{productId: number}>());
export const updateQuantity = createAction('[cart] update quantity' , props<{productId:number ; value: number}>())
