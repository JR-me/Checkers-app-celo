// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ─────────────────────────────────────────────────────────────
//  CHECKERS TOKEN v2  (ERC-20 + Burnable)
//  Same as v1 but adds ERC20Burnable so the CheckersPass
//  contract can burn tokens on mint.
//
//  If you already deployed v1, redeploy this version instead
//  and point CheckIn + CheckersPass at the new address.
// ─────────────────────────────────────────────────────────────

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CheckersToken is ERC20Burnable, Ownable {
    constructor()
        ERC20("Checkers", "CHECKERS")
        Ownable(msg.sender)
    {}

    /// @notice Only the CheckIn contract (owner) can mint.
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
