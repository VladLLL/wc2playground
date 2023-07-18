import { useState } from 'react'
import { useProvider } from './useProvider'

export function HomePage() {
  const [ value, setValue ] = useState('')
  const { connect, addChain, getChainId, switchNetwork, send, getTxReceipt } = useProvider()

  return <div style={{padding: '16px', display: 'flex', flexDirection: 'column'}}>
    <input type="text" style={{width: '500px'}} value={value} onChange={(event) => setValue(event.target.value)} />
    <div style={{marginTop: '16px'}}>
      <button onClick={connect}>Connect wallet</button>
      <button onClick={getChainId}>chainId</button>
      <button onClick={switchNetwork(value)}>switch network</button>
      <button onClick={addChain(value)}>addChain</button>
      <button onClick={send}>send tx</button>
      <button onClick={getTxReceipt(value)}>get tx receipt</button>
    </div>
  </div>
}
