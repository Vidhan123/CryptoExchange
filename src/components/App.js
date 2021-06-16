import React, { useState, useEffect } from 'react'
import Web3 from 'web3'
import Token from '../abis/Token.json'
import EthSwap from '../abis/EthSwap.json'
import Navbar from './Navbar'
import Main from './Main'

function App() {
  const [account, setAccount] = useState('');
  const [token, setToken] = useState({});
  const [ethSwap, setEthSwap] = useState({});
  const [ethSwapData, setEthSwapData] = useState({});
  const [ethBalance, setEthBalance] = useState('0');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [loading, setLoading] = useState(true);

  const loadBlockchainData = async () => {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])

    const ethBalance = await web3.eth.getBalance(accounts[0])
    setEthBalance(ethBalance)

    // Load Token
    const networkId =  await web3.eth.net.getId()
    const tokenData = Token.networks[networkId]
    if(tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address)
      setToken(token)
      let tokenBalance = await token.methods.balanceOf(accounts[0]).call()
      setTokenBalance(tokenBalance.toString())
    } else {
      window.alert('Token contract not deployed to detected network.')
    }

    // Load EthSwap
    const ethSwapData = EthSwap.networks[networkId]
    if(ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address)
      setEthSwap(ethSwap)
      setEthSwapData(ethSwapData)
    } else {
      window.alert('EthSwap contract not deployed to detected network.')
    }

    setLoading(false)
  }

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  useEffect(() => {
    const Load = async () => {
      await loadWeb3()
      await loadBlockchainData()
    }
    Load();
  }, [])

  const buyTokens = (etherAmount) => {
    setLoading(true)
    ethSwap.methods.buyTokens().send({ value: etherAmount, from: account }).on('transactionHash', (hash) => {
      setLoading(false)
      document.location.reload();
    })
  }

  const sellTokens = (tokenAmount) => {
    setLoading(true);
    token.methods.approve(ethSwapData.address, tokenAmount).send({ from: account }).on('transactionHash', (hash) => {
      ethSwap.methods.sellTokens(tokenAmount).send({ from: account }).on('transactionHash', (hash) => {
        setLoading(false)
        document.location.reload();
      })
    })
  }

  let content;
  if(loading) {
    content = <p id="loader" className="text-center">Loading...</p>
  } else {
    content = <Main
      ethBalance={ethBalance}
      tokenBalance={tokenBalance}
      buyTokens={buyTokens}
      sellTokens={sellTokens}
    />
  }

  return (
    <div>
      <Navbar account={account} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
            <div className="content mr-auto ml-auto">
              {content}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;