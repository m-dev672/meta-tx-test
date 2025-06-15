# meta-tx-test
Decentralized the initial React project by Vite.
The count is shared by all users, and the contract variable is treated like a field in the database.

## Screenshot
![screenshot](https://github.com/user-attachments/assets/241ba93d-9dee-4192-9c0d-bebdb78e5cfc)

## Before Use

### /off_chain/frontend/.env
You need to write the address of the count contract and the paymaster in the .env file yourself.
```.env
VITE_COUNT_CONTRACT_ADDRESS=""
VITE_PAYMASTER_ADDRESS=""
```

### /off_chain/frontend/tools/.env
You need to write the private key and the address of the paymaster and the smart account in the .env file yourself.
Smart account addresses can be found at the bottom of the page.
Carefully manage your private keys as they are included.
```.env
PRIVATE_KEY=""
PAYMASTER_ADDRESS=""
SMART_ACCOUNT_ADDRESS=""
```

### /on_chain/.env
You need to write the mnemonic words in the .env file yourself.
Carefully manage your mnemonic words as they are included.
```.env
MNEMONIC=""
```

## Usage

```
cd offchain/
npm install
truffle migrate --network arbitrumSepolia
```

then check the address of the count contract and the paymaster.

```
cd on_chain/frontend
npm run dev
```

then check your smart account address.

```
cd /on_chain/frontend/tools
node paymaster/deposit.ts
node paymaster/add_to_whitelist.ts
```

## Warning
This implementation is only for deploy on the Arbitrum Sepolia Test Network.
