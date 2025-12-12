import { createReducer, on } from '@ngrx/store';
import * as ProductsActions from './products.actions';
import { Product } from '../../service/products.service';


export interface ProductsState {
products: Product[];
loading: boolean;
error: any | null;
}


export const initialProductsState: ProductsState = {
products: [],
loading: false,
error: null
};


export const productsReducer = createReducer(
initialProductsState,
on(ProductsActions.loadProducts, (state) => {
  return{
    ...state,
     loading: true 
  }
}),

on(ProductsActions.loadProductsSuccess, (state, { products }) => ({
...state,
loading: false,
products
})),

on(ProductsActions.loadProductsFailure, (state, { error }) => ({
...state,
loading: false,
error
}))
);