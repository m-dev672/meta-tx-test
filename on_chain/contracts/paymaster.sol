// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@account-abstraction/contracts/core/BasePaymaster.sol";
import "@account-abstraction/contracts/interfaces/IEntryPoint.sol";
import { SIG_VALIDATION_SUCCESS, SIG_VALIDATION_FAILED } from "@account-abstraction/contracts/core/Helpers.sol";

contract paymaster is BasePaymaster {
  // ホワイトリストをStorageに格納
  mapping(address => bool) public whitelist;

  // BasePaymasterのconstructorを明示的に継承
  constructor(IEntryPoint _entryPoint) BasePaymaster(_entryPoint) {}

  function addToWhitelist(address user) external onlyOwner {
    whitelist[user] = true;
  }

  function removeFromWhitelist(address user) external onlyOwner {
    whitelist[user] = false;
  }

  function isWhitelisted(address user) public view returns (bool) {
    return whitelist[user];
  }

  // BasePaymasterのvalidatePaymasterUserOp内で実行される関数を定義
  // つまりここには、どのようなユーザーからのどのようなオペレーションであれば、ガス代を代理で支払って実行しても良いかを判断するための基準を書く。
  function _validatePaymasterUserOp(
    PackedUserOperation calldata userOp,
    bytes32 userOpHash,
    uint256 maxCost
  ) internal virtual override view returns (bytes memory context, uint256 validationData) {
    if (whitelist[userOp.sender]) {
      context = "";
      validationData = SIG_VALIDATION_SUCCESS;
    } else {
      validationData = SIG_VALIDATION_FAILED;
    }
  }
}
