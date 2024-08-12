<script>
  import { flip } from "svelte/animate";
  import {
    set_local_storage,
    get_local_storage,
  } from "./lib/local_storage_helper";

  import { onMount } from "svelte";

  let items = $state([]);
  let cart = $state(get_local_storage("vikri-cart", []));
  let total_items = $derived(cart.reduce((s, i) => s + +i.quantity, 0));
  let total_price = $derived(
    cart.reduce(
      (
        /** @type {number} */ s,
        /** @type {{ price: string | number; quantity: string | number; }} */ i
      ) => s + +i.price * +i.quantity,
      0
    )
  );
  let showCartDialog = {};
  let closeCartDialog = {};
  let allShowCartButtons = [];
  let currency = $state("₹");

  onMount(() => {
    allShowCartButtons = Array.from(
      document.querySelectorAll(".vikri-show-cart")
    );
    const allItems = Array.from(document.querySelectorAll(".vikri-item"));

    items = allItems.map((item) => {
      item.addEventListener("click", addToCart);
      const individual_item = Object.assign({ quantity: 1 }, item?.dataset);
      if (!individual_item.id)
        throw Error(
          "A vikri-item is missing data-id field. This can cause issues in vikri cart calculations."
        );
      if (!individual_item.price) throw Error("data-price is missing");
      return individual_item;
    });
    showCartDialog = document.querySelector("dialog.vikri__cart__popup");
    closeCartDialog = document.querySelector("dialog .close__btn");

    closeCartDialog.addEventListener("click", () => showCartDialog.close());
  });

  const addToCart = (e) => {
    const product = Object.assign({ quantity: 1 }, e.target.dataset);
    let already_in_cart = false;
    cart.forEach((item) => {
      if (item.id == product.id) {
        item.quantity = +item.quantity + 1;
        already_in_cart = true;
      }
    });

    if (!already_in_cart) {
      cart.push(product);
    }
  };

  $effect(() => {
    set_local_storage("vikri-cart", cart);
    udpateCheckoutButtons();
    handleShowCartClick();
  });

  const udpateCheckoutButtons = () => {
    const checkoutButtons = Array.from(
      document.querySelectorAll(".vikri-checkout")
    );

    checkoutButtons.forEach((checkoutButton) => {
      checkoutButton.setAttribute("data-cart", JSON.stringify(cart));
      checkoutButton.setAttribute(
        "data-total-items",
        JSON.stringify(total_items)
      );
      checkoutButton.setAttribute(
        "data-total-price",
        JSON.stringify(total_price)
      );
    });
  };

  const handleShowCartClick = () => {
    allShowCartButtons.forEach((showCartBtn) => {
      showCartBtn.addEventListener("click", () => {
        showCartDialog.showModal();
      });
    });
  };

  const incrementQuantity = (/** @type {string} */ id) => {
    cart.map((item) => {
      if (item.id == id) {
        item.quantity = +item.quantity + 1;
      }
    });
  };
  const decrementQuantity = (/** @type {string} */ id) => {
    cart.map((item) => {
      if (item.id == id) {
        if (item.quantity == 0) {
          const index = cart.indexOf(item);
          if (index > -1) {
            cart.splice(index, 1);
            return;
          }
        }
        item.quantity = +item.quantity - 1;
      }
    });
  };
</script>

<div class="vikri__app">
  <dialog class="vikri__cart__popup">
    <div class="vikri__container">
      <div class="tab">
        <div class="vikri__tab__header v__grid">
          <div>Product</div>
          <div>Quantity</div>
          <div>Price</div>
        </div>
        {#each cart as { id, image, name, price, quantity } (id)}
          <div animate:flip>
            {#if quantity > 0}
              <div class="v__grid">
                <div>
                  {#if image}
                    <img class="product__image" src={image} alt={name} />
                  {/if}
                  {#if name}
                    {name}
                  {/if}
                </div>
                <div class="v__flex">
                  {quantity}
                  <div class="btn__grp">
                    <div>
                      <button onclick={() => incrementQuantity(id)}>+</button>
                    </div>
                    <div>
                      <button onclick={() => decrementQuantity(id)}>-</button>
                    </div>
                  </div>
                </div>
                <div>
                  {currency}
                  {price * quantity}
                </div>
              </div>
            {/if}
          </div>
        {:else}
          <p>No items in cart</p>
        {/each}
        <div class="v__grid">
          <div class="a__r">
            <p>
              <strong>
                Items: {total_items}
              </strong>
            </p>
          </div>
          <div class="span__2 a__r">
            <p>
              <strong>
                Total Price: {currency}
                {total_price}
              </strong>
            </p>
          </div>
        </div>
      </div>
      <div class="v__flex">
        <div class="a__r v__flex">
          <button class="close__btn">Close</button>
        </div>
      </div>
    </div>
  </dialog>
</div>

<style>
  :root {
    --vikri-text-color: #333;
    --vikri-backdrop-color: black;
    --vikri-backdrop-opacity: 0.65;
    --vikri-dialog-background: white;
    --vikri-dialog-border-color: #555;
    --vikri-button-background: green;
    --vikri-button-text-color: white;
    --vikri-font-family: Menlo, Consolas, Monaco, Liberation Mono,
      Lucida Console, monospace;
  }
  .vikri__cart__popup {
    font-family: var(--vikri-font-family);
    background-color: var(--vikri-dialog-background);
    border-color: var(--vikri-dialog-border-color);
  }
  .vikri__cart__popup::backdrop {
    background: var(--vikri-backdrop-color);
    opacity: var(--vikri-backdrop-opacity);
  }
  .vikri__container {
    max-width: 100%;
    color: var(--vikri-text-color);

    button {
      cursor: pointer;
      border: none;
      border-radius: 2px;
      background-color: var(--vikri-button-background);
      color: var(--vikri-button-text-color);
    }
    .v__grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      place-items: center;
      gap: 1em;
      margin-bottom: 1em;
    }
    .v__flex {
      display: flex;
      place-items: center;
    }
    .vikri__tab__header {
      font-weight: bold;
    }
    .a__r {
      margin-left: auto;
    }
    .span__2 {
      grid-column: span 2;
    }
    .product__image {
      display: block;
      width: 60px;
      object-fit: contain;
      object-position: center;
    }
    .btn__grp {
      display: grid;
      margin-left: 0.5em;
      button {
        width: 100%;
      }
    }
    .close__btn {
      padding: 4px 15px;
    }
  }
</style>
