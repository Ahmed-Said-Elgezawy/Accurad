import { createReducer, on } from '@ngrx/store';
import * as CartActions from './cart.actions';
import { Product } from '../../service/products.service';


export interface CartState {
items: Product[];
}


export const initialCartState: CartState = {
items: []
};


export const cartReducer = createReducer(
initialCartState,
on(CartActions.addToCart, (state, { product }) => {
  const exist = state.items.some(item => item.id == product.id);
  return{
    ...state,
    items : [...state.items , product]
  }
  // return{
  //   ...state,
  //   items: exist ? state.items.filter(item => item.id !== product.id) : [...state.items , product]
  // }
    // return{
    //   ...state,
    //   items: exist 
    //   ? state.items.map(item => item.id == product.id ? {...item , Quantity : item.Quantity + 1 , subtotal: (item.Quantity + 1) * item.price} : item)
    //   : [...state.items , product]
    // }
}),
on(CartActions.removeFromCart, (state, { productId }) => ({
...state,
items: state.items.filter(i => i.id !== productId)
})),

on(CartActions.updateQuantity, (state, { productId, value }) => ({
  ...state,
  items: state.items.map(i =>
    i.id === productId
      ? {
          ...i,
          Quantity: value,
          subtotal: value * i.price
        }
      : i
  )
}))
);
