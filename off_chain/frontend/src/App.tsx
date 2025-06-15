import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { createPublicClient, encodeFunctionData, http, parseAbi, parseUnits } from 'viem'
import { arbitrumSepolia } from 'viem/chains'
import { createBundlerClient } from 'viem/account-abstraction'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { toSimpleSmartAccount, type ToSimpleSmartAccountReturnType } from "permissionless/accounts"

// チェーンとの接続を確立
const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http("https://sepolia-rollup.arbitrum.io/rpc"),
});

const countContractAddress = import.meta.env.VITE_COUNT_CONTRACT_ADDRESS

async function getSmartAccount() {
  // プライベートキーを生成
  const privateKey = generatePrivateKey()

  // プライベートキーを用いてウォレットを作成 or 取得
  const owner = privateKeyToAccount(privateKey)

  // スマートアカウントを取得。
  // スマートアカウントがユーザーオペレーションの実行時にオンチェーンに存在しなければ自動的にデプロイされる。
  const smartAccount = await toSimpleSmartAccount({
    owner: owner,
    client: publicClient,
    entryPoint: {
      address: '0x4337084d9e255ff0702461cf8895ce9e3b5ff108',
      version: "0.8",
    },
  })

  return smartAccount
}

async function getCount() {
  const abi = parseAbi([
    'function getCount() public view returns (uint)',
  ])

  const count = await publicClient.readContract({
    address: `0x${countContractAddress}`,
    abi,
    functionName: 'getCount',
    args: []
  })

  return count
}

async function incrementCount(
  smartAccount: ToSimpleSmartAccountReturnType<"0.8">,
  setLoading: (loading: boolean) => void = () => {},
) {
  setLoading(true)
  try {
    // トランザクションを代わりに送ってくれるサーバー群との接続を確立
    const bundlerClient = createBundlerClient({
      client: publicClient,
      transport: http("https://api.pimlico.io/v2/421614/rpc?apikey=pim_WMWv25QoSnBYqr1hWkAMym")
    });

    const paymasterAddress = import.meta.env.VITE_PAYMASTER_ADDRESS

    const abi = parseAbi(["function incrementCount() public"])
    const data = encodeFunctionData({
      abi,
      functionName: "incrementCount",
      args: [],
    });

    // ユーザーオペレーションを作成。
    const userOp = await bundlerClient.prepareUserOperation({
      account: smartAccount,
      paymaster: `0x${paymasterAddress}`,
      calls: [{ to: `0x${countContractAddress}`, data: data }],
      maxPriorityFeePerGas: parseUnits("1", 9)
    })

    // ユーザーオペレーションに署名
    const signature = await smartAccount.signUserOperation(userOp);
    userOp.signature = signature;

    console.log(userOp)

    // ユーザーオペレーションをバンドラーに送信
    const hash = await bundlerClient.sendUserOperation({
      ...userOp
    })

    console.log(`UserOp Hash: ${hash}`)

    // トランザクションの完了を待機
    await bundlerClient.waitForUserOperationReceipt({
      hash: hash,
      pollingInterval: 1000,
      retryCount: 3,
    });

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
}

function App() {
  const [count, setCount] = useState(-1)

  const [smartAccount, setSmartAccount] = useState<ToSimpleSmartAccountReturnType<"0.8"> | undefined>(undefined);
  const [loading, setLoading] = useState(false)

  async function _setCount() {
    setCount(Number(await getCount()));
  }

  useEffect(() => {
    (async () => {
      setCount(Number(await getCount()));
      setSmartAccount(await getSmartAccount());
    })()
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React (Decentralized)</h1>
      <div className="card">
        <button onClick={async () => { if (smartAccount) { await incrementCount(smartAccount, setLoading); _setCount(); } }} disabled={loading}>
          {loading ? 'Loading...' : `count is ${count}`}
        </button>
        <p>
          Add your address to whitelist to get approval from paymaster
        </p>
      </div>
      <p className="read-the-docs">
        Your smart account address is {smartAccount?.address}
      </p>
    </>
  )
}

export default App
