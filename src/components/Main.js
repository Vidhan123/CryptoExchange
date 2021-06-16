import React, { useState } from 'react'
import BuyForm from './BuyForm'
import SellForm from './SellForm'

function Main(props) {
  const [currentForm, setCurrentForm] = useState('buy');

    let content
    if(currentForm === 'buy') {
      content = <BuyForm
        ethBalance={props.ethBalance}
        tokenBalance={props.tokenBalance}
        buyTokens={props.buyTokens}
      />
    } else {
      content = <SellForm
        ethBalance={props.ethBalance}
        tokenBalance={props.tokenBalance}
        sellTokens={props.sellTokens}
      />
    }

  return (
    <div id="content" className="mt-3">
      <div className="d-flex justify-content-between mb-3">
        <button
            className="btn btn-light"
            onClick={(event) => {
              setCurrentForm('buy')
            }}
          >
          Buy
        </button>
        <span className="text-muted">&lt; &nbsp; &gt;</span>
        <button
            className="btn btn-light"
            onClick={(event) => {
              setCurrentForm('sell')
            }}
          >
          Sell
        </button>
      </div>
      <div className="card mb-4" >
        <div className="card-body">
          {content}
        </div>
      </div>
    </div>
  );
}

export default Main;