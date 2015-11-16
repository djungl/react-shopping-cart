'use strict';

var app = window.app;

app.CartItem = class CartItem extends Backbone.Model {

	defaults () {
		return {
			name: '',
			price: 0,
			quantity: 0
		};
	}

	initialize () {
		// Listen to events from dispatcher
		this.listenTo(app.dispatcher || {}, 'addItem', this.addItem);
		this.listenTo(app.dispatcher || {}, 'removeItem', this.removeItem);

	}

	addItem ( item ) {
		var newQuantity;
		
		if (this != item) {
			return;
		}

		newQuantity = item.get("quantity") + 1;
		item.set("quantity", newQuantity);
		item.save();
	}

	removeItem ( item ) {
		var newQuantity;
		
		if (this != item) {
			return;
		}

        // remove by 1 piece of item until all pieces are gone,
        // then remove item from Cart
		newQuantity = item.get("quantity") - 1;
		item.set("quantity", newQuantity);

    	if (newQuantity < 1) {
    		item.destroy();
    	} else {
    		item.save();
    	}
	}
}
