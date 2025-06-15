import dotenv from 'dotenv';
dotenv.config();

import { createWalletClient, http, parseAbi, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { arbitrumSepolia } from 'viem/chains'

const privateKey = process.env.PRIVATE_KEY
const account = privateKeyToAccount(`0x${privateKey}`)

const client = createWalletClient({
  account,
  chain: arbitrumSepolia,
  transport: http('https://sepolia-rollup.arbitrum.io/rpc'),
})

const paymasterAddress = process.env.PAYMASTER_ADDRESS
const abi = parseAbi([
  'function deposit() payable',
])

async function depositToPaymaster(amountEth: string) {
  const amountWei = parseEther(amountEth)

  const txHash = await client.writeContract({
    address: `0x${paymasterAddress}`,
    abi: abi,
    functionName: 'deposit',
    args: [],
    value: amountWei, // Send ETH with the call
  })

  console.log('TX Hash:', txHash)
}

depositToPaymaster('0.01').catch(console.error)