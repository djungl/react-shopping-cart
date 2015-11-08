'use strict';

var app = window.app;

app.Items = class Items extends Backbone.Collection {

	constructor(options) {
		super(options);
		this.model = app.Item;
	}	
}
