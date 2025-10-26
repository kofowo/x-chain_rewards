
import { describe, expect, it } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const address1 = accounts.get("wallet_1")!;
const deployer = accounts.get("deployer")!;

describe("Cross-Chain Bridge Tests", () => {
  it("ensures simnet is well initialized", () => {
    expect(simnet.blockHeight).toBeDefined();
  });

  it("should get admin correctly", () => {
    const { result } = simnet.callReadOnlyFn("cross-chain-bridge", "get-admin", [], address1);
    expect(result).toStrictEqual(Cl.ok(Cl.principal(deployer)));
  });

  it("should allow locking STX", () => {
    const amount = 1000000; // 1 STX in microSTX
    const recipient = "742d35Cc6635C0532925a3b8D200dC35e843C665";
    const targetChain = 137; // Polygon

    const { result } = simnet.callPublicFn(
      "cross-chain-bridge",
      "lock-stx",
      [
        Cl.uint(amount),
        Cl.bufferFromHex(recipient),
        Cl.uint(targetChain)
      ],
      address1
    );

    expect(result).toStrictEqual(Cl.ok(Cl.uint(1)));
  });

  it("should allow oracle to confirm", () => {
    // First lock some STX
    const amount = 1000000;
    const recipient = "742d35Cc6635C0532925a3b8D200dC35e843C665";
    const targetChain = 137;

    simnet.callPublicFn(
      "cross-chain-bridge",
      "lock-stx",
      [
        Cl.uint(amount),
        Cl.bufferFromHex(recipient),
        Cl.uint(targetChain)
      ],
      address1
    );

    // Then confirm as oracle (deployer is admin/oracle)
    const destTxHash = "1234567890abcdef1234567890abcdef12345678";
    const { result } = simnet.callPublicFn(
      "cross-chain-bridge",
      "oracle-confirm",
      [
        Cl.uint(1),
        Cl.bufferFromHex(destTxHash)
      ],
      deployer
    );

    expect(result).toStrictEqual(Cl.ok(Cl.bool(true)));
  });
});
