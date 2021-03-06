import React, { Component } from "react"
import LedgerContract from "./contracts/Ledger.json"
import FIFSRegistrar from "./contracts/FIFSRegistrar.json"
import ENSRegistry from "./contracts/ENSRegistry.json"
import getWeb3 from "./utils/getWeb3"
import AccountComponent from "./AccountComponent"
import EnsRegistrarComponent from "./EnsRegistrarComponent"


import "./css/App.css"
import "./css/pure-min.css"
import "./css/grids-responsive-min.css"


class App extends Component {
  state = {
    web3: null,
    accounts: null,
    contract: null,
    ensContract: null,
    ensRegistrarContract: null,
  }
  
  constructor(props) {
    super(props);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3()

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts()

      // Get the contract instance.
      const networkId = await web3.eth.net.getId()
      const deployedNetwork = LedgerContract.networks[networkId]
      const instance = new web3.eth.Contract(
        LedgerContract.abi,
        deployedNetwork && deployedNetwork.address,
      )

      const deployedNetworkFIFSRegistrar = FIFSRegistrar.networks[networkId]
      const instanceEnsRegistrar = new web3.eth.Contract(
        FIFSRegistrar.abi,
        deployedNetworkFIFSRegistrar && deployedNetworkFIFSRegistrar.address,
      )

      const deployedNetworkEns = ENSRegistry.networks[networkId]
      const instanceEns = new web3.eth.Contract(
        ENSRegistry.abi,
        deployedNetworkEns && deployedNetworkEns.address,
      )

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3,
        accounts,
        contract: instance,
        ensContract: instanceEns,
        ensRegistrarContract: instanceEnsRegistrar
      })
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      )
      console.error(error)
    }
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    return (
      <div className="App">
        <h1 className="title">ZEXE on Ethereum (with Plasma)</h1>
        <h2>Team Reiwa @ EDCON 2019</h2>
        <AccountComponent
          web3={this.state.web3}
          contract={this.state.contract}
          ensContract={this.state.ensContract}
          accounts={this.state.accounts}
        />
        <EnsRegistrarComponent
          web3={this.state.web3}
          contract={this.state.ensRegistrarContract}
          accounts={this.state.accounts}
        />
      </div>
    )
  }
}

export default App
