import { TransactionHash } from "./TransactionHash";
import { formatEther, formatUnits, decodeEventLog } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { TransactionWithFunction } from "~~/utils/scaffold-eth";
import { TransactionsTableProps } from "~~/utils/scaffold-eth/";

// USDC Transfer event ABI
const transferEventAbi = {
  anonymous: false,
  inputs: [
    { indexed: true, name: "from", type: "address" },
    { indexed: true, name: "to", type: "address" },
    { indexed: false, name: "value", type: "uint256" }
  ],
  name: "Transfer",
  type: "event"
} as const;

export const TransactionsTable = ({ blocks, transactionReceipts }: TransactionsTableProps) => {
  const { targetNetwork } = useTargetNetwork();

  // Function to extract USDC transfer amount from transaction logs
  const getUSDCTransferAmount = (tx: TransactionWithFunction) => {
    const receipt = transactionReceipts[tx.hash];
    if (!receipt || !receipt.logs) return null;

    // Look for Transfer events in logs
    for (const log of receipt.logs) {
      try {
        // Check if this is a Transfer event (topic0 should match Transfer event signature)
        if (log.topics[0] === "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef") {
          const decoded = decodeEventLog({
            abi: [transferEventAbi],
            data: log.data,
            topics: log.topics,
          });
          
          if (decoded.eventName === "Transfer" && decoded.args) {
            // Format USDC amount (6 decimals)
            return formatUnits(decoded.args.value as bigint, 6);
          }
        }
      } catch (error) {
        // Skip logs that can't be decoded
        continue;
      }
    }
    return null;
  };

  return (
    <div className="flex justify-center px-4 md:px-0">
      <div className="overflow-x-auto w-full shadow-2xl rounded-xl">
        <table className="table text-xl bg-base-100 table-zebra w-full md:table-md table-sm">
          <thead>
            <tr className="rounded-xl text-sm text-base-content">
              <th className="bg-primary">Transaction Hash</th>
              <th className="bg-primary">Function Called</th>
              <th className="bg-primary">Block Number</th>
              <th className="bg-primary">Time Mined</th>
              <th className="bg-primary">From</th>
              <th className="bg-primary">To</th>
              <th className="bg-primary text-end">Value ({targetNetwork.nativeCurrency.symbol})</th>
              <th className="bg-primary text-end">Value (USDC)</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map(block =>
              (block.transactions as TransactionWithFunction[]).map(tx => {
                const receipt = transactionReceipts[tx.hash];
                const timeMined = new Date(Number(block.timestamp) * 1000).toLocaleString();
                const functionCalled = tx.input.substring(0, 10);
                const usdcAmount = getUSDCTransferAmount(tx);

                return (
                  <tr key={tx.hash} className="hover text-sm">
                    <td className="w-1/12 md:py-4">
                      <TransactionHash hash={tx.hash} />
                    </td>
                    <td className="w-2/12 md:py-4">
                      {tx.functionName === "0x" ? "" : <span className="mr-1">{tx.functionName}</span>}
                      {functionCalled !== "0x" && (
                        <span className="badge badge-primary font-bold text-xs">{functionCalled}</span>
                      )}
                    </td>
                    <td className="w-1/12 md:py-4">{block.number?.toString()}</td>
                    <td className="w-2/12 md:py-4">{timeMined}</td>
                    <td className="w-2/12 md:py-4">
                      <Address address={tx.from} size="sm" onlyEnsOrAddress />
                    </td>
                    <td className="w-2/12 md:py-4">
                      {!receipt?.contractAddress ? (
                        tx.to && <Address address={tx.to} size="sm" onlyEnsOrAddress />
                      ) : (
                        <div className="relative">
                          <Address address={receipt.contractAddress} size="sm" onlyEnsOrAddress />
                          <small className="absolute top-4 left-4">(Contract Creation)</small>
                        </div>
                      )}
                    </td>
                    <td className="text-right md:py-4">
                      {tx.value > 0n ? (
                        <span className="text-green-600 font-semibold">
                          {formatEther(tx.value)} {targetNetwork.nativeCurrency.symbol}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="text-right md:py-4">
                      {usdcAmount ? (
                        <span className="text-blue-600 font-semibold">{usdcAmount} USDC</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              }),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
