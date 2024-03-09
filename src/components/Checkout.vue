<template>
<section class="checkOutPage">
    <div class="payContainer">
        <div class="checkOurProduct" v-for="(product,key) in cart">
            <div class="mb-3 justify-content-center">
                <div class="w-100 rounded bg-white col-md-10 p-3">
                    <div class="w-100 d-flex justify-content-between col-md-6">
                        <div class="images">
                            <div class="text-center p-2"> 
                                <img id="main-image" style="object-fit: contain;"
                                    v-bind:src="'https://post-school.eu-west-2.elasticbeanstalk.com/' + product.image"
                                    height="300" width="250" /> </div>
                        </div>

                        <div class="p-1">
                            <div class="mb-3">
                                <h5 class="text-uppercase" v-html="product.title"></h5>
                                <div class="d-flex flex-row align-items-center">
                                    <p><b><span class="act-price">${{product.price}}</span></b><span
                                            style="font-size: 13px;"> [{{product.onCart}} spaces]</span></p>
                                </div>
                            </div>
                            <p v-text="product.location"></p>
                            <!-- remove from cart button -->
                            <div class="mt-4 align-items-center">
                                <button class="btn btn-secondary" @click="removeFromCart(key)"
                                    v-show="showRemoveButton">Remove from cart</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- checkout section -->
    <div class="container">
        <h2>Checkout</h2>
        <strong>Full Name</strong><br>
        <!-- show if user input other than string -->
        <span v-if="!userNameValidate">
            Name must contain only letters!<br>
        </span>
        <input type="text" v-model="order.name" placeholder="Your full name" v-model.trim="order.name">
        <br>
        <strong>Phone Number</strong><br>
        <span v-if="!phoneNumberValidate">
            Phone Number must contain only 10 numbers!<br>
        </span>
        <input type="text" maxlength="10" v-model="order.phone" placeholder="Your phone number"
            v-model.number="order.phone"><br><br>
        <button v-bind:disabled="!(userNameValidate && phoneNumberValidate)" class="btn btn-primary mr-1 px-2"
            v-on:click="submitOrder">Place order</button>
    </div>
    <br>
    <div class="container">
        <h2>Order Information</h2>
        <p>Full Name : {{order.name}}</p>
        <p>Phone Number : {{order.phone}}</p>
    </div>
</section>
</template>

<script>
export default {
name: 'Checkout',
props:["cart","order"],
methods:{
    removeFromCart: function (key) {
        this.$emit("remove-from-cart", key);
    },
    submitOrder: function(){
        this.$emit("submit-order");
    },
},
computed:{
    showRemoveButton: function () {
        return this.cart.length != 0;
    },
    userNameValidate: function () {
        const nameRegex = /^[a-z A-Z]+$/;
        // .test method checks if the expression matches given string or input
        return nameRegex.test(this.order.name);
    },
    phoneNumberValidate: function () {
        const phoneRegex = /^[\d]{10}$/;
        return phoneRegex.test(this.order.phone);
    },
    
    }
}
</script>