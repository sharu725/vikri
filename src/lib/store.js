import { derived, writable } from "svelte/store";

const VikriCart = JSON.parse(localStorage.getItem("vikriCart")) || [];
export const cart = writable(VikriCart);
cart.subscribe((val) => (localStorage.vikriCart = JSON.stringify(val)));

export const totalItems = derived(cart, ($cart) =>
  $cart ? $cart.reduce((a, b) => +a + +b.count, 0) : 0
);

export const totalPrice = derived(cart, ($cart) =>
  $cart ? $cart.reduce((a, b) => +a + +b.price * b.count, 0) : 0
);

export const pay = writable();
