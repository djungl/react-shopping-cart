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

	changeQuantity ( value ) {
		var new_quantity = this.get("quantity") + value;
		this.set("quantity", new_quantity);
		return new_quantity;
	}
}
