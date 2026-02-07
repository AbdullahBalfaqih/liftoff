"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditCard, PlusCircle, Copy, Wallet, Link as LinkIcon, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ethers } from "ethers";
import Currency from "@/components/currency";
import { useAppContext } from "@/context/AppContext";
import { Skeleton } from "@/components/ui/skeleton";

const cards = [
  { id: "card1", provider: "Mada", last4: "1234", expiry: "12/25" },
  { id: "card2", provider: "Visa", last4: "5678", expiry: "10/26" },
];

const CONTRACT_ADDRESS = "0x8C9C95A830b7E7e86f2f12DB88e911499A6f695f";
const CONTRACT_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "achievementName",
				"type": "string"
			}
		],
		"name": "mintAchievement",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
];


export default function WalletPanel() {
  const { toast } = useToast();
  const { user, balance, loading } = useAppContext();
  const [metamaskAddress, setMetamaskAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  const walletAddress = user?.web3_wallet_address;

  const handleAddCard = () => {
    toast({
      title: "Add New Card",
      description: "This feature is for demonstration purposes.",
    });
  };
  
  const handleConnectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        setProvider(browserProvider);

        await browserProvider.send("eth_requestAccounts", []);
        const signer = await browserProvider.getSigner();
        const address = await signer.getAddress();
        setMetamaskAddress(address);
        toast({
          title: "Wallet Connected!",
          description: `Connected to address: ${address.substring(0, 6)}...${address.substring(address.length - 4)}`,
        });
      } catch (error: any) {
        if (error.code === 4001 || error.code === "ACTION_REJECTED") {
          toast({ variant: "destructive", title: "Connection Canceled", description: "You canceled the connection request in your wallet." });
        } else {
          console.error("Failed to connect wallet", error);
          toast({ variant: "destructive", title: "Connection Failed", description: "An unexpected error occurred." });
        }
      }
    } else {
      toast({ variant: "destructive", title: "MetaMask Not Found", description: "Please install the MetaMask browser extension." });
    }
  };
  
  const handleCopy = (text: string, subject: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${subject} Copied!`,
      description: `${subject} copied to clipboard.`,
    });
  };

  const handleAirdrop = () => {
    toast({
      title: "Requesting Testnet Funds",
      description: "For a real app, you would use a testnet faucet to get free test tokens.",
    });
  }

  const handleMintNFT = async (badgeName: string) => {
    const mintToAddress = metamaskAddress || walletAddress;
    if (!mintToAddress || !provider) {
      toast({ variant: "destructive", title: "Wallet Not Connected", description: "Please connect your wallet first." });
      return;
    }
     if (CONTRACT_ADDRESS === "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE") {
      toast({ variant: "destructive", title: "Contract Not Ready", description: "Please deploy the smart contract and add its address." });
      return;
    }

    try {
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      
      toast({ title: "Sending Transaction...", description: "Please confirm the transaction in your wallet." });

      const tx = await contract.mintAchievement(mintToAddress, badgeName);
      await tx.wait(); // Wait for the transaction to be mined

      toast({ title: "Success!", description: `Your "${badgeName}" NFT badge has been minted!` });

    } catch (error: any) {
      if (error.code === 4001 || error.code === "ACTION_REJECTED") {
        toast({ variant: "destructive", title: "Transaction Canceled", description: "You rejected the transaction in your wallet." });
      } else {
        console.error("Minting failed:", error);
        toast({ variant: "destructive", title: "Transaction Failed", description: error.message || "Could not mint the NFT." });
      }
    }
  }

  const renderLoadingSkeletons = () => (
    <>
      <Card>
        <CardHeader><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-64 mt-2" /></CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-64 mt-2" /></CardHeader>
        <CardContent><Skeleton className="h-10 w-full" /></CardContent>
      </Card>
    </>
  );

  if (loading) {
    return <div className="space-y-8">{renderLoadingSkeletons()}</div>
  }

  return (
    <div className="space-y-8">
      {/* Fiat Wallet Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl font-bold">
            <span>Digital Wallet</span>
            <CreditCard className="h-6 w-6 text-primary" />
          </CardTitle>
          <CardDescription>
            Manage your fiat balance and linked cards.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground">Current Balance</p>
            <Currency amount={balance} amountClassName="text-3xl font-bold" symbolClassName="h-7" />
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Linked Cards</h4>
            {cards.map((card) => (
              <div
                key={card.id}
                className="flex items-center justify-between rounded-lg border bg-muted/20 p-4"
              >
                <div className="flex items-center gap-4">
                  <CreditCard className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">{card.provider}</p>
                    <p className="text-sm text-muted-foreground">
                      **** **** **** {card.last4}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-medium">Exp: {card.expiry}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full" onClick={handleAddCard}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Card
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Web3 Wallet Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl font-bold">
            <div className="flex items-center gap-3">
              <Wallet className="h-6 w-6 text-accent"/>
              <span>Web3 Wallet (Testnet)</span>
            </div>
            <Badge variant="outline" className="border-accent text-accent">Polygon Mumbai</Badge>
          </CardTitle>
          <CardDescription>
            Connect your MetaMask wallet to mint achievements as NFTs on the Polygon testnet.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {!metamaskAddress ? (
              <Button className="w-full" onClick={handleConnectWallet}>
                  <LinkIcon className="mr-2"/> Connect MetaMask
              </Button>
          ) : (
            <>
              <div>
                  <h4 className="text-sm font-semibold text-muted-foreground mb-2">Connected MetaMask Address</h4>
                  <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                      <p className="flex-1 truncate font-mono text-sm">{metamaskAddress}</p>
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(metamaskAddress, 'Address')}>
                          <Copy className="h-4 w-4"/>
                      </Button>
                  </div>
              </div>

              <div className="space-y-4 rounded-lg border p-4">
                  <h4 className="font-semibold">On-Chain Achievements (Testnet NFTs)</h4>
                  <p className="text-xs text-muted-foreground">Mint your achievements as unique NFT badges to your connected wallet, powered by the `Achievements` smart contract.</p>
                  <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleMintNFT('Budget Master')}>Mint 'Budget Master'</Button>
                      <Button variant="outline" size="sm" onClick={() => handleMintNFT('30-Day Streak')}>Mint '30-Day Streak'</Button>
                  </div>
                  <div className="pt-2">
                      <a href={`https://mumbai.polygonscan.com/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1 text-muted-foreground hover:text-primary underline">
                          <FileCode className="h-3 w-3" />
                          View Smart Contract on Polygonscan
                      </a>
                  </div>
              </div>
            </>
          )}
        </CardContent>
        {metamaskAddress && (
          <CardFooter>
              <Button variant="link" className="text-xs text-muted-foreground" onClick={handleAirdrop}>
                  Need test funds? (Use Polygon Faucet)
              </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
