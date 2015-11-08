'use strict';

var app = window.app;

app.Item = class Item extends Backbone.Model {

	defaults () {
		return {
			name: '',
			price: 0
		};
	}
}
