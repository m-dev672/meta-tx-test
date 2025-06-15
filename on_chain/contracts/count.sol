// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract count {

  uint private _currentCount;

  constructor() {
    _currentCount = 0;
  }

  function setCount(uint newCount) public {
    _currentCount = newCount;
  }

  function incrementCount() public {
    _currentCount += 1;
  }

  function getCount() public view returns (uint) {
    return _currentCount;
  }
}
