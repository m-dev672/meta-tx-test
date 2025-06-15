import dotenv from 'dotenv';
dotenv.config();

import { createWalletClient, http, parseAbi } from 'viem'
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
  'function addToWhitelist(address user) external',
])

const smartAccountAddress = process.env.SMART_ACCOUNT_ADDRESS

async function depositToPaymaster() {
  const txHash = await client.writeContract({
    address: `0x${paymasterAddress}`,
    abi: abi,
    functionName: 'addToWhitelist',
    args: [`0x${smartAccountAddress}`]
  })

  console.log('TX Hash:', txHash)
}

depositToPaymaster()