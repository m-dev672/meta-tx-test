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

const entryPointAddress = '4337084d9e255ff0702461cf8895ce9e3b5ff108'

const abi = parseAbi([
  'function depositTo(address to) payable',
])

const paymasterAddress = process.env.PAYMASTER_ADDRESS

async function callDepositTo(valueInEther: string) {
  const value = BigInt(Number(valueInEther) * 1e18)

  const hash = await client.writeContract({
    address: `0x${entryPointAddress}`,
    abi,
    functionName: 'depositTo',
    args: [`0x${paymasterAddress}`],
    value,
  })

  console.log('TX Hash:', hash)
}


callDepositTo('0.01').catch(console.error)