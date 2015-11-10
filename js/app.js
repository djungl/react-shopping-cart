'use strict';

var app = window.app;

class ShopItems extends React.Component  {

    constructor (...props) {
        super(...props);
        
        this.loadItemsFromServer();
        this.state = {
            data: []
        }
    }

    loadItemsFromServer () {
        this.props.items.fetch({
            url: this.props.url,
            success: this.onFetchSuccess.bind(this),
            error: this.onFetchError
        });
    }    

    onFetchSuccess () {
        this.setState({
            data: this.props.items
        });
    }

    onFetchError () {
        console.log('There was some error in loading and processing the JSON file ' + this.props.url);
    }


    render () {
        return (
            <div className="shopItems">
                <h1>Shop items</h1>
                <ShopItemsList data={this.state.data} />
            </div>
        );
    }
}

class ShopItemsList extends React.Component  {

    render () {
        var itemNodes = this.props.data.map((item, index) => (
            (
                <ShopItem item={item}>
                </ShopItem>
            )
        ));
        return (
            <div className="shopItemsList">
                {itemNodes}
            </div>
        );
    }
}

class ShopItem extends React.Component  {

    constructor (...props) {
        super(...props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick (e) {
        e.preventDefault();
        app.dispatcher.trigger("addToCart", this.props.item);
    }  

    render () {
        return (
            <div className="item" onClick={this.handleClick}>
                <div className="itemName">
                    {this.props.item.get('name')}
                </div>
                <span className="itemPrice">
                    {this.props.item.get('price')} EUR
                </span>
            </div>
        );
    }
}

ReactDOM.render(
    <ShopItems url="data/catalog.json" items={new app.Items()} />,
    document.getElementById('content')
);

