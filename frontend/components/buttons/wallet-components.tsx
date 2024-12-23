import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { Address, Avatar, Name, Identity } from "@coinbase/onchainkit/identity";
import { color } from "@coinbase/onchainkit/theme";
import { useAccount } from "wagmi";

export function WalletComponents() {
    const { address } = useAccount()
  return (
    <div className="flex justify-end">
      <Wallet>
        <ConnectWallet className="text-black">
          <Avatar address={address} className="h-6 w-6" />
          <Name address={address} />
        </ConnectWallet>
        <WalletDropdown>
          <Identity address={address} className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar address={address} />
            <Name address={address} />
            <Address address={address} className={color.foregroundMuted} />
            <Address className={color.foregroundMuted} />
          </Identity>
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </div>
  );
}
