import React from "react";
import * as moment from "moment";

class PurchaseForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ticker: "",
            quantity: "",
            currentStock: ""
        };
        this.partOne = this.partOne.bind(this);
        this.partTwo = this.partTwo.bind(this);
        this.switchToPartTwo = this.switchToPartTwo.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    update(field) {
        return e => this.setState({
            [field]: e.currentTarget.value
        });
    }

    switchToPartTwo() {
        this.setState({ 
            currentStock: this.state.ticker.toUpperCase(),
            quantity: ""
        });
        if (this.state.ticker.toUpperCase() in this.props.stocks) {
            this.props.removeStockError();
        }

        if (!(this.state.ticker.toUpperCase() in this.props.stocks)) {
            this.props.getStock(this.state.ticker);
        }
    }

    partOne() {
        return (
            <>
                <input
                    type="text"
                    value={this.state.ticker}
                    onChange={this.update("ticker")}
                    placeholder="Ticker"
                    
                />
                <div className={"purchase-button " + ((this.state.ticker.length > 0 && (this.state.currentStock !== this.state.ticker.toUpperCase())) ? "" : "disabled" )} 
                    onClick={ (e) => { e.preventDefault();
                        (this.state.ticker.length > 0 && (this.state.currentStock !== this.state.ticker.toUpperCase())) ? this.switchToPartTwo() : null }}
                >
                    Lookup
                </div>
                {this.props.stockError.noStockFound ? 
                <div className="purchase-error">
                        {`${this.props.stockError.noStockFound} ${this.props.stockError.symbol}`}
                </div> : null}
            </>
        );
    }

    partTwo() {
        return (
            <>
                {this.state.currentStock in this.props.stocks ?
                    <>
                        <span>{this.props.stocks[this.state.currentStock].quote.symbol} ({this.props.stocks[this.state.currentStock].quote.companyName})</span>
                        <span>{`Latest Price: $${this.props.stocks[this.state.currentStock].quote.latestPrice.toFixed(2)}`}</span>
                        <span>Last Updated:{" "}
                            {moment(
                                this.props.stocks[this.state.currentStock].quote.latestUpdate
                            ).calendar()}
                        </span>
                    </> :
                    <>
                        <span>– – –</span>
                        <span>– – –</span>
                        <span>– – –</span>
                    </>
                }
                <input
                    type="number"
                    value={this.state.quantity}
                    onChange={this.update("quantity")}
                    placeholder="Quantity"
                    disabled={!(this.state.currentStock in this.props.stocks)}
                />
                <input
                    className="purchase-button"
                    disabled={(this.state.currentStock.length === 0) || (!this.state.quantity) }
                    type="submit"
                    value="Submit"
                />
            </>
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        let trade = {
            symbol: this.state.currentStock,
            purchasePrice: this.props.stocks[this.state.currentStock].quote.latestPrice.toFixed(2),
            numberOfShares: this.state.quantity
        }
        this.props.createTrade(trade);
        this.setState({
            ticker: "",
            quantity: "",
            currentStock: ""
        })
    }

    render() {
        return (
            <section className="purchase-form-container">
                <form onSubmit={this.handleSubmit}>
                    { this.partOne() }
                    { this.partTwo() }
                </form>
            </section>
        );
    }

}

export default PurchaseForm;