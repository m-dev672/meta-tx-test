import dotenv from 'dotenv';
dotenv.config();

import { createPublicClient, http, parseAbi } from 'viem'
import { arbitrumSepolia } from 'viem/chains'

const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http('https://sepolia-rollup.arbitrum.io/rpc'),
})

const paymasterAddress = process.env.PAYMASTER_ADDRESS
const abi = parseAbi([
  'function isWhitelisted(address user) public view returns (bool)',
])

const smartAccountAddress = process.env.SMART_ACCOUNT_ADDRESS

async function checkDeposit() {
  const info = await publicClient.readContract({
    address: `0x${paymasterAddress}`,
    abi,
    functionName: 'isWhitelisted',
    args: [`0x${smartAccountAddress}`]
  })
  
  console.log(info)
}

checkDeposit().catch(console.error)
