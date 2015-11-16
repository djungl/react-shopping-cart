'use strict';

var app = window.app;

app.Cart = class Cart extends Backbone.Collection {

	constructor(...options) {
		super(...options);
		
		this.model = app.CartItem;
		this.url = '/cart';
		this.localStorage = new Backbone.LocalStorage("exn-shoppimg-cart");
		// Sort direction: 1 - asc, 0 - desc
		this.sortDirection = 0;
		this.sortField = 'name';

	}

	initialize () {
		// Listen to events from dispatcher
		this.listenTo(app.dispatcher || {}, "addToCart", this.addToCart);
		this.listenTo(app.dispatcher || {}, "removeFromCart", this.removeFromCart);
		this.listenTo(app.dispatcher || {}, "sortCartBy", this.sortCartBy);
		this.listenTo(app.dispatcher || {}, "syncCart", this.syncCartWithServer);
	}

	addToCart ( selectedItem ) {
        var cartItem = this.findOrCreateItemInCart(selectedItem);
        app.dispatcher.trigger("addItem", cartItem);
	}

	removeFromCart ( selectedItem ) {
		var cartItem = this.findOrCreateItemInCart(selectedItem);
		app.dispatcher.trigger("removeItem", cartItem);
	}

	syncCartWithServer () {
		this.sync("update", this, { 
			// "ajaxSync" flag invokes native backbone.sync method 
			// to sync collection with server
			ajaxSync: true, 
			success: this.onSyncSuccess,
			error: this.onSyncError.bind(this)
		});
	}

	onSyncSuccess () {
		this.trigger('cartAjaxSynced', 'Cart synced with the server');
	}

	onSyncError (xhr) {
		this.trigger('cartAjaxSynced', 'Sync error: ' + xhr.status 
					+ " (" + xhr.statusText + ")");
	}

	getSelectedItemProps ( item ) {
		return {
        		"name": item.get("name"),
        		"price": item.get("price")
        	};	
	}

	findOrCreateItemInCart ( selectedItem ) {
        var itemProps = this.getSelectedItemProps(selectedItem),
        	cartItem = this.findWhere(itemProps);

        if (!cartItem) {
			cartItem = this.create(itemProps);        	
        }

        return cartItem;
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
