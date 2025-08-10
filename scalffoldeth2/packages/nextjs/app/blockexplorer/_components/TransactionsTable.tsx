import { TransactionHash } from "./TransactionHash";
import { decodeFunctionData, formatEther, formatUnits } from "viem";
import { Address } from "~~/components/scaffold-eth";
import deployedContracts from "~~/contracts/deployedContracts";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { TransactionWithFunction } from "~~/utils/scaffold-eth";
import { TransactionsTableProps } from "~~/utils/scaffold-eth/";

export const TransactionsTable = ({ blocks, transactionReceipts }: TransactionsTableProps) => {
  const { targetNetwork } = useTargetNetwork();

  // Helper function to extrac
  // t USDC amount from transaction
  const getUSDCAmount = (tx: TransactionWithFunction): string => {
    try {
      const chainId = targetNetwork.id;
      const contracts = deployedContracts[chainId as keyof typeof deployedContracts];

      if (!contracts) return "0";

      const mockUSDC = contracts.MockUSDC;
      const ecoQuestDonation = contracts.EcoQuestDonation;

      // Check if it's a direct USDC transfer
      if (tx.to?.toLowerCase() === mockUSDC.address.toLowerCase()) {
        try {
          const decoded = decodeFunctionData({
            abi: mockUSDC.abi,
            data: tx.input as `0x${string}`,
          });

          if (decoded.functionName === "transfer" || decoded.functionName === "transferFrom") {
            const amount = decoded.args[decoded.args.length - 1] as bigint; // Last arg is amount
            return formatUnits(amount, 6); // USDC has 6 decimals
          }
        } catch {
          // Failed to decode, continue to next check
        }
      }

      // Check if it's an EcoQuestDonation offset function
      if (tx.to?.toLowerCase() === ecoQuestDonation.address.toLowerCase()) {
        try {
          const decoded = decodeFunctionData({
            abi: ecoQuestDonation.abi,
            data: tx.input as `0x${string}`,
          });

          if (decoded.functionName === "offset") {
            const amount = decoded.args[0] as bigint; // First arg is USDC amount
            return formatUnits(amount, 6); // USDC has 6 decimals
          }
        } catch {
          // Failed to decode
        }
      }

      return "0";
    } catch (error) {
      console.error("Error extracting USDC amount:", error);
      return "0";
    }
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
                const usdcAmount = getUSDCAmount(tx);

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
                      {tx.value > 0n ? `${formatEther(tx.value)} ${targetNetwork.nativeCurrency.symbol}` : "-"}
                    </td>
                    <td className="text-right md:py-4">{usdcAmount !== "0" ? `${usdcAmount} USDC` : "-"}</td>
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
