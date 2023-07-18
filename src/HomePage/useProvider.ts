import { useState } from 'react'
import { Web3 } from 'web3'
import { EEthereumNetworkId, RPCConfig } from './const'
import { EthereumProvider } from '@walletconnect/ethereum-provider'

export const useProvider = () => {
  const [ web3, setWeb3 ] = useState<Web3 | undefined>()
  const [ provider, setProvider ] = useState<any>()
  const connect = async () => {
    const optionalChains: any[] = Object.values(EEthereumNetworkId as any).filter(
      value =>
        typeof value !== 'string',
    )
    const rpcMap = Object.entries(RPCConfig).reduce(
      (acc, [ key, { rpcUrls } ]) => ({ ...acc, [key]: rpcUrls[0] }),
      {} as Record<EEthereumNetworkId, string>,
    )
    console.log(optionalChains, 'optionalChains')
    console.log(rpcMap, 'rpcMap')
    const provider = await EthereumProvider.init({
      projectId: '8632f6ad3de177c2e04ba5248e27a743',
      chains: [ 56 ],
      optionalChains,
      rpcMap,
      showQrModal: true,
      qrModalOptions: {
        themeMode: 'light',
        themeVariables: {
          '--wcm-z-index': '1301',
        },
      },
      methods: [
        'eth_sendTransaction',
        'eth_signTransaction',
        'eth_sign',
        'personal_sign',
        'eth_signTypedData',
        'wallet_addEthereumChain',
      ],
      optionalMethods: [

        'wallet_switchEthereumChain',
      ],
      events: [ 'chainChanged', 'accountsChanged' ],
    })

    console.log('run1')

    await provider.enable()

    console.log('run2')

    const web3 = new Web3(provider)
    setWeb3(web3)
    setProvider(provider)
  }

  const switchNetwork = (chainId: string) => async () => {

    console.log('start switchNetwork', provider.switchNetwork)

    provider.switchEthereumChain(+chainId)

    const cd = await web3!.eth.getChainId()

    console.log(cd, 'cd')
  }

  const getChainId = async () => {
    const chainId = await web3!.eth.getChainId()

    console.log(chainId, 'chainId')
  }

  const addChain = (chainId: string) => async () => {
    const config = RPCConfig[+chainId as any]

    console.log(config, 'configconfigconfig')


    const result = await web3!.currentProvider!.request({
      'method': 'wallet_addEthereumChain',
      'params': [
        config
      ]
    })

    console.log(result, 'add network result')
  }

  const send = async () => {
    const tx = await web3!.eth.sendTransaction({
      from: '0xF94a621A90fF4aE7D6024D23FD4a178D6dB8F3De',
      to: '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe',
      value: '100000000000000'
    })

    console.log('tx: ', tx)
  }

  const getTxReceipt = (txHash: string) => async () =>  {
    const result = await web3!.eth.getTransactionReceipt(txHash)

    console.log(result)
  }

  return {
    send,
    getTxReceipt,
    connect,
    addChain,
    getChainId,
    switchNetwork,
  }
}