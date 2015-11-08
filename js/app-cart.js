'use strict';

var app = window.app;

class CartItems extends React.Component  {

    constructor (props) {
        super(props);
        
        this.props.items.on('all', function() {
            this.setState({data: this.props.items});
        }.bind(this));

        this.state = {
            data: []
        }
    }

    loadItemsFromServer () {
        this.props.items.fetch({ 
            success: function() {
                this.setState({data: this.props.items});
            }.bind(this),
            error: function(){
                console.log('There was some error in loading from local storage');
            }
        });
    }

    componentDidMount () {
        this.loadItemsFromServer();
    }

    render () {
        return (
            <div className="shopItems">
                <h1>Cart</h1>
                <CartSyncMessageBox items={this.props.items} />
                <CartSortBox />
                <CartItemsList data={this.state.data} />
            </div>
        );
    }    
}

class CartItemsList extends React.Component  {

    render () {
        var itemNodes = this.props.data.map((item, index) => (
            (
                <CartItem item={item}>
                </CartItem>
            )
        ));
        return (
            <div className="shopItemsList">
                {itemNodes}
            </div>
        );
    }
}

class CartItem extends React.Component  {

    constructor (props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }    

    handleClick (e) {
        e.preventDefault();
        app.dispatcher.trigger("removeFromCart", this.props.item);
    }

    render () {
        return (
            <div className="cart-item">
                <div className="itemName">
                    {this.props.item.get('name')}
                </div>
                <div className="itemPrice">
                    {this.props.item.get('quantity')} kg
                </div>
                <div className="itemPrice">
                    {this.props.item.get('price')} EUR
                </div>
                <div className="item__close" onClick={this.handleClick}>
                    X
                </div>
            </div>
        );
    }
}

class CartSortBox extends React.Component  {

    render () {
        return (
            <div className="cart-item">
                <div className="itemName">
                    <CartSortItem item='name'></CartSortItem>
                </div>
                <div className="itemPrice">
                    <CartSortItem item='quantity'></CartSortItem>
                </div>
                <div className="itemPrice">
                    <CartSortItem item='price'></CartSortItem>
                </div>
            </div>
        );
    }    
}

class CartSyncMessageBox extends React.Component  {

    constructor (props) {
        super(props);

        this.props.items.on('cartAjaxSynced', function(result) {
            this.setState({
                    visibility: '',
                    syncResult: result
            });
            setTimeout(this.hideBox.bind(this), 1000);
        }.bind(this));

        this.handleClick = this.handleClick.bind(this);
        this.state = {
            visibility: 'hide',
            syncResult: ''
        };
    }

    hideBox () {
        this.setState({visibility: 'hide'});
    }

    handleClick (e) {
        e.preventDefault();
        app.dispatcher.trigger("syncCart");
    }  

    render () {
        return (
            <div className="cart-sync__message">
                <input type="button" onClick={this.handleClick} value="Send" />
                <div className={this.state.visibility}>
                    {this.state.syncResult}
                </div>
            </div>
        );
    }
}

class CartSortItem extends React.Component  {

    constructor (props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }    

    handleClick (e) {
        e.preventDefault();
        app.dispatcher.trigger("sortCartBy", this.props.item);
    }

    render () {
        return (
            <span className="cart-sort__item" onClick={this.handleClick}>{this.props.item}</span>
        );
    }

}

ReactDOM.render(
	<CartItems url="data/catalog.json" items={new app.Cart()} />,
	document.getElementById('cart')
);

