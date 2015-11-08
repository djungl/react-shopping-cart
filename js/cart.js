'use strict';

var app = window.app;

app.Cart = class Cart extends Backbone.Collection {

	constructor(options) {
		super(options);
		
		this.model = app.CartItem;
		this.url = '/cart';
		this.localStorage = new Backbone.LocalStorage("exn-shoppimg-cart");
		// Sort direction: 1 - asc, 0 - desc
		this.sortDirection = 0;
		this.sortField = 'name';

	}

	initialize () {
		// Listen to events from dispatcher
		this.listenTo(app.dispatcher || {}, 'addToCart', this.addToCart);
		this.listenTo(app.dispatcher || {}, 'removeFromCart', this.removeFromCart);
		this.listenTo(app.dispatcher || {}, 'sortCartBy', this.sortCartBy);
		this.listenTo(app.dispatcher || {}, 'syncCart', this.syncCartWithServer);
	}

	addToCart ( selectedItem ) {
        var cart_item = this.findOrCreateItemInCart(selectedItem);
    	// add 1 piece of item to cart
    	cart_item.changeQuantity(1);
        cart_item.save();
	}

	removeFromCart ( selectedItem ) {
		var cart_item = this.getItemInCart(selectedItem),
			new_quantity;

        if (!cart_item) {
        	return;
        }

        // remove by 1 piece of item until all pieces are gone,
        // then remove item from Cart
    	new_quantity = cart_item.changeQuantity(-1);

    	if (new_quantity < 1) {
    		cart_item.destroy();
    	} else {
    		cart_item.save();
    	}
	}

	syncCartWithServer () {
		this.sync("update", this, { 
			// "ajaxSync" flag invokes native backbone.sync method 
			// to sync collection with server
			ajaxSync: true, 
			success: function() {
			    this.trigger('cartAjaxSynced', 'Cart synced with the server');
			},
			error: function(xhr){
				this.trigger('cartAjaxSynced', 'Sync error: ' + xhr.status 
					+ " (" + xhr.statusText + ")");
			}.bind(this)

		});
	}

	// function returns item in cart by given 'name' and 'price' of selected item in shop
	getItemInCart ( item ) {
		return this.find(( model ) =>  
    			(model.get('name') == item.get("name") 
    			&& model.get('price') == item.get("price")) 
    		);
	}

	findOrCreateItemInCart ( selectedItem ) {
        var cart_item = this.getItemInCart(selectedItem);

        if (!cart_item) {
        	cart_item = new this.model({
	            name: selectedItem.get("name"),
				price: selectedItem.get("price")
        	});
        	this.add(cart_item);
        }

        return cart_item;
	}

	sortCartBy ( sorting ) {
		this.setSortDirection(sorting);
		this.sortField = sorting;
		this.sortCart();
	}

	sortCart () {

		if (this.sortDirection === 1) {
			this.sortAsc();
		} else {
			this.sortDesc();
		}

		// Notify when sorting done
		this.trigger('reset', this, {}); 
	}

	setSortDirection ( sorting ) {
		// change sort direction if new sort field is the same as previous
		this.sortDirection = sorting == this.sortField ? (this.sortDirection - 1) * -1 : this.sortDirection;
	}

	sortAsc () {
		// sortBy - Returns a (stably) sorted copy of list
		this.models = this.sortBy(this.sortField);
	}

	sortDesc () {
		this.models = this.sortBy(this.sortField).reverse();
	}		
	
}
