import dotenv from 'dotenv';
dotenv.config();

import { createPublicClient, http } from 'viem'
import { arbitrumSepolia } from 'viem/chains'

const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http('https://sepolia-rollup.arbitrum.io/rpc'),
})

const entryPointAddress = '4337084d9e255ff0702461cf8895ce9e3b5ff108'

const abi = [
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'getDepositInfo',
    outputs: [
      {
        components: [
          { internalType: 'uint256', name: 'deposit', type: 'uint256' },
          { internalType: 'bool', name: 'staked', type: 'bool' },
          { internalType: 'uint112', name: 'stake', type: 'uint112' },
          { internalType: 'uint32', name: 'unstakeDelaySec', type: 'uint32' },
          { internalType: 'uint48', name: 'withdrawTime', type: 'uint48' }
        ],
        internalType: 'struct IStakeManager.DepositInfo',
        name: 'info',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]

const paymasterAddress = process.env.PAYMASTER_ADDRESS

async function checkDeposit() {
  const info = await publicClient.readContract({
    address: `0x${entryPointAddress}`,
    abi,
    functionName: 'getDepositInfo',
    args: [`0x${paymasterAddress}`]
  })
  console.log(info)
}

checkDeposit().catch(console.error)
