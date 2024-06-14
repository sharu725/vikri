<script>
  import { checkIfDuplicateExists } from "./lib/utils";
  import { cart, totalItems, totalPrice } from "./lib/store";
  import { onMount } from "svelte";
  import Page from "./Page.svelte";

  let products = [];
  let priceElements = [];
  let cartCountElements = [];
  let paymentButtons = [];
  let showCartButtons = [];
  let showCartDialog = {};

  onMount(() => {
    products = document.querySelectorAll(".vikri-product");
    priceElements = document.querySelectorAll(".vikri-price");
    cartCountElements = document.querySelectorAll(".vikri-cart-count");
    paymentButtons = document.querySelectorAll(".vikri-pay");
    showCartButtons = document.querySelectorAll(".vikri-show-cart");
  });

  const addToCart = (e) => {
    console.log(e)
    const item = e.currentTarget;
    const id = item?.dataset?.id;
    const name = item?.dataset?.name;
    const image = item?.dataset?.image;
    const price = parseInt(item.dataset.price);

    if (!name) throw Error("unique data-id is missing");
    if (!name) throw Error("data-name is missing");
    if (!price) throw Error("data-price is missing");

    const product = { id, name, image, price, count: 1 };

    if ($cart.some((item) => item.id == product.id)) {
      $cart.map((item) => {
        if (item.id == product.id) item.count += 1;
        $cart = $cart;
      });
    } else {
      $cart = [product, ...$cart];
    }
  };

  let allIds = [];

  for (const node of products) {
    let id = node.dataset.id;
    allIds = [id, ...allIds];
    if (checkIfDuplicateExists(allIds)) throw Error("data-id should be unique");
    node.addEventListener("click", addToCart);
  }

  const updatePriceElements = () => {
    for (const node of priceElements) {
      node.dataset.price = node.textContent = $totalPrice;
    }
  };

  const updatePaymentButtons = () => {
    for (const node of paymentButtons) {
      node.dataset.finalPrice = JSON.stringify($totalPrice);
      node.dataset.cart = JSON.stringify($cart);
      node.dataset.items = JSON.stringify($totalItems);
    }
  };

  const updateCartCountElements = () => {
    for (const node of cartCountElements) {
      node.dataset.count = node.textContent = $totalItems;
    }
  };

  onMount(() => {
    showCartDialog = document.querySelector("dialog.vikri__cart__popup");
    for (const node of showCartButtons) {
      node.addEventListener("click", () => showCartDialog.showModal());
    }
    for (const node of paymentButtons) {
      node.dataset.finalPrice = JSON.stringify($totalPrice);
      node.dataset.cart = JSON.stringify($cart);
      node.dataset.items = JSON.stringify($totalItems);
    }
    updateEverything();
  });

  const updateEverything = () => {
    updatePriceElements();
    updatePaymentButtons();
    updateCartCountElements();
    updateCartCountElements();
  };

  $: $cart, updateEverything();
</script>

<Page />


<dialog class="vikri__cart__popup">
  <div class="container">
    <div class="tab">
      <div class="flex bold">
        <div>
          <p>Product</p>
        </div>
        <div class="ml__4">
          <p>Count</p>
        </div>
        <div class="ml__4">
          <p>Price</p>
        </div>
      </div>
      {#each $cart as { image, name, price, count }}
        <div class="flex">
          <div>
            <p>
              <img class="product__image" src={image} alt={name} />
              {name}
            </p>
          </div>
          <div class="ml__4">
            <p>
              {count}
            </p>
          </div>
          <div class="ml__4">
            <p>
              {price * count}
            </p>
          </div>
        </div>
      {/each}
      <div class="flex">
        <div class="a__r">
          <p>
            <strong>
              Items: {$totalItems}
            </strong>
          </p>
        </div>
        <div class="a__r">
          <p>
            <strong>
              Total Price: {$totalPrice}
            </strong>
          </p>
        </div>
      </div>
    </div>
    <div class="flex">
      <div class="a__r flex">
        <form class="ml__4" method="dialog">
          <button class="close__button">Close</button>
        </form>
      </div>
    </div>
  </div>
</dialog>

<style>
  .container {
    max-width: 100%;
  }
  .flex {
    display: flex;
  }
  .ml__4 {
    margin-left: 1em;
  }
  .bold {
    font-weight: bold;
  }
  dialog::backdrop {
    background: black;
    opacity: 0.65;
  }
  .tab .flex {
    place-items: center;
  }
  .a__r {
    margin-left: auto;
  }
  p {
    margin: 0;
    padding: 1em;
  }
  .product__image {
    display: block;
    width: 100px;
    margin-bottom: 0.5em;
    object-fit: contain;
    object-position: center;
  }
</style>
