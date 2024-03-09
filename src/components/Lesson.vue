<template>
 <section class="mainContainer">
    <div class="sortContainer flex-shrink-1 p-4">
        <!-- Sorting -->
        <div>
        <b>Sort By</b>
        <hr>
        <span class="btn" v-bind:class="sortType=='title'" v-on:click="sortProducts('title')"> Title</span>
        <span class="btn" v-bind:class="sortType=='location'" v-on:click="sortProducts('location')">
            Location</span>
        <span class="btn" v-bind:class="sortType=='price'" v-on:click="sortProducts('price')"> Price</span>
        <span class="btn" v-bind:class="sortType=='availability'" v-on:click="sortProducts('availability')">
            Availability</span>
        </div>
        <div>
        <b>Order by</b>
        <hr>
        <span class="btn" v-bind:disabled="sortingDirection === 'asc'" v-bind:class="sortingDirection === 'asc'"
            v-on:click="sortSelection('asc')"> Ascending <font-awesome-icon icon="fa-solid fa-arrow-up" /></span>
        <span class="btn" v-bind:disabled="sortingDirection === 'desc'"
            v-bind:class="sortingDirection === 'asc'" v-on:click="sortSelection('desc')"> Descending <font-awesome-icon icon="fa-solid fa-arrow-down" /></span>
        </div>
    </div>

    <!-- Main page view -->
    <div class="lessonsContainer">
        <!-- displaying all the list of products loaded from products.js file -->
        <div class="product" v-for="product in products">
            <div class="mb-3 justify-content-center">
                <div class="w-100 rounded bg-white col-md-10 p-3">
                    <!-- product detail container -->
                    <div class="w-100 d-flex flex-column justify-content-between col-md-6">
                        <div class="images">
                            <div class="text-center p-2"> <img id="main-image" style="object-fit: contain;"
                                    v-bind:src="'https://post-school.eu-west-2.elasticbeanstalk.com/' + product.image"
                                    height="200px" width="270" /> </div>
                        </div>

                        <div class="d-flex flex-column justify-content-center align-items-center">
                            <div class="mb-0">
                                <h5 class="text-uppercase" v-html="product.title"></h5>

                                <div class="d-flex flex-row align-items-center">
                                    <p><b><span class="act-price">${{product.price}}</span></b><span
                                            style="font-size: 13px;"> [{{product.available}} spaces]</span></p>
                                </div>
                            </div>
                            <p v-text="product.location"></p>
                            <!-- add to cart button -->
                            <div class="mt-1 align-items-center">
                                <button v-on:click="addToCart(product)" v-if="canAddToCart(product)"
                                    class="btn btn-primary text-uppercase button">Add to cart</button>
                                <!-- This button will be displayed otherwise -->
                                <span v-if="product.available >= 2">
                                    Buy now!
                                </span>
                                <span v-else-if="product.available === 1" style="color: red;">
                                    Only 1 space left!
                                </span>
                                <div v-else>
                                    <button class="btn btn-primary text-uppercase button" disabled>Add to
                                        cart</button>
                                    <span style="color: rosybrown;">No more spaces </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
</template>

<script>
export default {
name: 'Lessons',
props: ["products", "sortType", "sortingDirection"],
methods:{
    canAddToCart(product) {
        return product.available > 0;
    },
    addToCart: function (item) {
        this.$emit("add-item-to-cart", item);
    },
    sortSelection: function (direction) {
        this.$emit("sort-type", direction);
    },
    sortProducts: function (sortType) {
        this.$emit("sort-products", sortType);
    } 
}
}
</script>