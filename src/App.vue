<template>
 <div id="app">
 <span>
        <font-awesome-icon icon="fas fa-text-height" />
        Test Console
</span>
 <header v-if="testConsole && showTestConsole">
    <strong class="test-elemen">HTTPS link: <a v-bind:href="serverURL" target="_blank">link</a></strong>
    
    <button @click="deleteAllCaches" class="test-elem">
        <font-awesome-icon icon="fas fa-trash" />
        Delete All Caches
    </button>
    
    <button @click="unregisterAllServiceWorkers" class="test-elem">
        <font-awesome-icon icon="fab fa-uniregistry" />
        Unregister All ServiceWorkers
    </button>
    <button @click="reloadPage" class="test-elem">
        <font-awesome-icon icon="fas fa-sync" />
        Reload Page
    </button>
 </header>
 <nav class="toolbar-container">
    <center>
        <h1 style="font-size: 2rem;" v-text="sitename"></h1>
    </center>
    <!-- search bar -->
    <div>
        <label for="search">
            <input id="search" class="bg-white rounded border-0 p-2" type="text" v-model="searchQuery"
                @input="searchProducts" placeholder='Search...'>
        </label>
    </div>
    <!-- checkbutton -->
    <div id="checkOutContainer">
        <button v-on:click="showCheckout" v-if="showCheckoutButton" class="btn">
            <!-- 'cartItemCount' is used the same way as a data property. -->
            {{ cartItemCount }}
            <!-- add the cart icon -->
            <font-awesome-icon icon="fa-solid fa-cart-shopping" /> Checkout
        </button>
        <button v-else disabled>
            {{ cartItemCount }}
            <!-- add the cart icon -->
            <font-awesome-icon icon="fa-solid fa-cart-shopping" /> Checkout
        </button>
    </div>
    </nav>
 <main>
 <component :is="currentView" :cart="cart" :products="products" :order="order" @remove-from-cart="removeFromCart" @add-item-to-cart="addToCart" @sort-type="sortSelection" @sort-products="sortProducts" @submit-order="submitOrder" @show-checkout-item="showCheckoutItem"></component>
 </main>
</div>
</template>
<script>
import Lesson from "./components/Lesson.vue";
import Checkout from "./components/Checkout.vue";
export default {
name: "App",
 data() { return { 
  sitename: "After School",
  cart: [],
  currentView: Lesson,
  products: [],
  searchQuery: '',
  sortedProducts: [],
  sortType: 'default',
  sortingDirection: 'asc',
  order: {
      name: '',
      phone: '',
      id: [],
      spaces: []
  },
  testConsole:true,
  showTestConsole:true,
  serverURL: 'https://post-school.eu-west-2.elasticbeanstalk.com/collections/lessons' } 
  },
 components: { Lesson, Checkout },
 methods: { 
   showCheckout() {
    if(this.cart.length > 0){
        if (this.currentView === Lesson) 
            this.currentView = Checkout
        else 
            this.currentView = Lesson;
    }
     
   },
   addToCart: function (item) {
      //check if the cart item is same
      let cartItem = item.id;
      let count = 0;
      if (this.cart.length != 0) {
          this.cart.forEach(element => {
              if (cartItem == element.id) {
                  //if match is found only increase the count
                  //increase oncart items
                  count += 1;
              }
          });
          //else push the item to cart and increase its onCart count
          if (count == 0) {
              this.cart.push(item);
              item.onCart++;
          }
      } else {
          this.cart.push(item);
          item.onCart += 1;
      }
      item.onCart += count;
      //decrease product availability
      item.available--;
  },
  removeFromCart(key) {
        this.cart[key].available++;
        this.cart[key].onCart--;
        // If item being removed is the last item, go back to home which means set showProduct to true
        if (this.cart[key].onCart == 0) {
            this.cart.splice(key, 1);
            //if we have nothing in cart or if cart.length is 0, then move to main page and disable checkout page
            if (this.cart.length == 0) {
                this.currentView = Lesson;
            }
        }
    },
    showCheckoutItem: function (item) {
        return item.onCart > 0;
    },
    submitOrder: function () {
        this.order.id = this.cart.map(item => item.id);
        this.order.spaces = this.cart.map(item => item.onCart);
        fetch('https://post-school.eu-west-2.elasticbeanstalk.com/collections/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.order)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Order submitted:', data);
            return fetch('https://post-school.eu-west-2.elasticbeanstalk.com/collections/lessons', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: this.order.id, spaces: this.order.spaces })
            });
        })
        .then(response => response.json())
        .then(data => {
            this.products = data;
            if (window.confirm('Order submitted successfully!')) {
                if (window.confirm('Continue shopping, have a nice day! :).')) {
                    location.reload();
                }
            }
        })
        .catch(err => {
            console.error('Error:', err);
            window.alert('Error submitting order.');
        });
    },
    searchProducts() {
        const key = this.searchQuery.toLowerCase().trim();
        if (key == "") {
            // Fetch all products when the search query is empty
            fetch('https://post-school.eu-west-2.elasticbeanstalk.com/collections/lessons')
                .then(response => response.json())
                .then(data => this.products = data)
                .catch(err => console.error('Error:', err));
            return this.products;
        } else {
            // Send the search query to the server
            fetch(`https://post-school.eu-west-2.elasticbeanstalk.com/lessons/search?q=${key}`)
                .then(response => response.json())
                .then(data => this.products = data)
                .catch(err => console.error('Error:', err));
            return this.products;
        }
    },
    deleteAllCaches() {
        caches.keys().then(function (names) {
            for (let name of names)
                caches.delete(name);
        });
        console.log("All Caches Deleted");
    },
    unregisterAllServiceWorkers() {
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
            for (let registration of registrations) {
                registration.unregister()
            }
        });
        console.log("ServiceWorkers Unregistered");
    },
    reloadPage() {
        window.location.reload();
    },
    // select the sorting direction
    sortSelection: function (direction) {
        this.sortingDirection = direction;
    },

    // sorting function
    sortProducts: function (sortType) {
        this.sortingType = sortType;
        const products = this.products.slice(0);
        let compare = function () { }
        switch (sortType) {
            // default sorting
            case 'default':
                this.products = products;
                break;
            // sorting using title
            case 'title':
                compare = function (a, b) {
                    if (a.title.toLowerCase() < b.title.toLowerCase()) {
                        return -1;
                    } else if (b.title.toLowerCase() < a.title.toLowerCase()) {
                        return 1;
                    }
                    return 0;
                }
                break;
            // sorting using location
            case 'location':
                compare = function (a, b) {
                    if (a.location.toLowerCase() < b.location.toLowerCase()) {
                        return -1;
                    } else if (b.location.toLowerCase() < a.location.toLowerCase()) {
                        return 1;
                    }
                    return 0;
                }
                break;
            // sorting using price
            case 'price':
                compare = function (a, b) {
                    return a.price - b.price;
                }
                break;
            // sorting using availability
            case 'availability':
                compare = function (a, b) {
                    return a.available - b.available;
                }
                break;
        }
        this.products = products.sort(compare);
        if (this.sortingDirection === 'desc') {
            this.products = this.products.reverse();
        }
    },
},
 computed: {
    cartItemCount: function () {
        let count = 0;
        this.cart.forEach(element => {
            count += element.onCart;
        });
        return count || "0";
    },
    showCheckoutButton: function () {
        return this.cart.length > 0;
    }
 },
 created: function () {

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("service-worker.js");
    }

    fetch('https://post-school.eu-west-2.elasticbeanstalk.com/collections/lessons')
        .then(response => response.json())
        .then(data => this.products = data)
        .catch(err => console.error('Error:', err));


},
};
</script>