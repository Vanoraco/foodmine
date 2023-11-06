import { Injectable } from '@angular/core';
import { Cart } from '../shared/models/Cart';
import { BehaviorSubject, Observable } from 'rxjs';
import { Food } from '../shared/models/Food';
import { CartItem } from '../shared/models/cartitem';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cart: Cart = this.getCartFromLocalStorage();
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject<Cart>(this.cart);


  constructor() { }

  addToCart(food: Food): void {
      let cartItem = this.cart.items
      .find(item => item.food.id === food.id)
      if(cartItem)
       return
      
      this.cart.items.push( new CartItem(food));
      this.setCartStorageToLocalStorage();
  }

  removeFromCart(foodId: string): void {
    this.cart.items = this.cart.items
    .filter(item => item.food.id !== foodId)
    this.setCartStorageToLocalStorage();
 }

 changeQuantity(foodId: string, quantity: number): void {
  let cartItem = this.cart.items
  .find(item => item.food.id === foodId);

  if(!cartItem) return;

  cartItem.quantity = quantity;
  cartItem.price = quantity * cartItem.food.price;
  this.setCartStorageToLocalStorage();
 }

 clearCart(): void {
  this.cart = new Cart();
  this.setCartStorageToLocalStorage();
 }

 getCartObservable(): Observable<Cart> {
   return this.cartSubject.asObservable();
 }

 private setCartStorageToLocalStorage(): void {
  this.cart.totalPrice = this.cart.items.reduce((prevSum, currentItem) => prevSum + currentItem.price, 0);
  this.cart.totalCount = this.cart.items.reduce((prevSum, currentItem) => prevSum + currentItem.quantity, 0);

  const cartJson = JSON.stringify(this.cart);
  localStorage.setItem('Cart', cartJson);

  this.cartSubject.next(this.cart)
 }

 private getCartFromLocalStorage(): Cart {
   const cartJson = localStorage.getItem('Cart');
   return cartJson ? JSON.parse(cartJson) : new Cart();
 }

}
