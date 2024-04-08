// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html"
// Establish Phoenix Socket and LiveView configuration.
import { Socket } from "phoenix"
import { LiveSocket } from "phoenix_live_view"
import type { ViewHook } from "phoenix_live_view"
import topbar from "../vendor/topbar"
import { Connection, TransactionMessage, TransactionInstruction, ComputeBudgetProgram, Keypair, VersionedTransaction, clusterApiUrl, PublicKey, SystemProgram, AccountMeta } from "@solana/web3.js";
import { SolanaConnect } from "solana-connect";
import { Adapter } from "@solana/wallet-adapter-base";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { AnchorProvider, BN, web3, utils, Program } from "@coral-xyz/anchor";
import { createBountyExample, claimBountyExample } from "./codegen/tossbounty/instructions";
import { pauseExample } from "./codegen/tossbounty_pauser/instructions";
import { PROGRAM_ID as TOSSBOUNTY_PROGRAM_ID } from "./codegen/tossbounty/programId";
import { PROGRAM_ID as EXAMPLE_PROGRAM_ID } from "./codegen/example/programId";
import { PROGRAM_ID as TOSSBOUNTY_PAUSER_PROGRAM_ID } from "./codegen/tossbounty_pauser/programId";
import { Bounty } from "./codegen/tossbounty/accounts";
//import {TOKEN_PROGRAM_ID, Token, AccountLayout} from '@solana/spl-token';

export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');

const solConnect = new SolanaConnect({
  additionalAdapters: [
    new SolflareWalletAdapter({
      network: WalletAdapterNetwork.Devnet,
    }),
  ]
});

const connection = new Connection(clusterApiUrl("devnet"));

const csrfToken = document.querySelector("meta[name='csrf-token']")!.getAttribute("content")

const hooks = {
  ReleaseBountyWithPause: {
    mounted() {
      this.el.addEventListener("click", async e => {
        const wallet: Adapter | null = solConnect.getWallet();

        const provider = new AnchorProvider(connection, (wallet as any), {});

        const tokenAccount = document.getElementById("bounty_token_account") as HTMLInputElement;
        const tokenAccountValue = tokenAccount.value;
        console.log("tokenAccountValue:", tokenAccountValue);

        const programId = document.getElementById("bounty_program_id") as HTMLInputElement;
        const programIdValue = programId.value;

        console.log("programIdValue:", programIdValue);

        const fundingAccount = new PublicKey("BpaQ5nkQDRJEFSMXFEdhVMizMGoztXZHcuZA7HLmozN1");

        const ixns = [
          claimBountyExampleIx(wallet?.publicKey, provider, new PublicKey(programIdValue), new PublicKey(tokenAccountValue), fundingAccount),
        ];
        console.log("ixns:", ixns);

        const pauseIxn = pauseExampleIx(wallet.publicKey, new PublicKey(programIdValue));

        ixns.push(pauseIxn);

        const sig = await simulate(wallet, ixns, []);
        //const sig = await launch(wallet, ixns, []);
        console.log("sig:", sig);


        const [_bountyPublicKey, bounty] = await readBountyExample(wallet, new PublicKey(programIdValue), fundingAccount);
        console.log("bounty:", bounty);
        this.pushEvent("claim_bounty", { org: bounty.org, description: bounty.description, amount: parseInt(bounty.amount), programId: bounty.programId, fundingAccount: bounty.fundingAccount, bump: bounty.bump, paused: true });
      });
    }
  },
  ReleaseBounty: {
    mounted() {
      this.el.addEventListener("click", async e => {
        const wallet: Adapter | null = solConnect.getWallet();

        const provider = new AnchorProvider(connection, (wallet as any), {});

        const tokenAccount = document.getElementById("bounty_token_account") as HTMLInputElement;
        const tokenAccountValue = tokenAccount.value;
        console.log("tokenAccountValue:", tokenAccountValue);

        const programId = document.getElementById("bounty_program_id") as HTMLInputElement;
        const programIdValue = programId.value;

        console.log("programIdValue:", programIdValue);

        const fundingAccount = new PublicKey("BpaQ5nkQDRJEFSMXFEdhVMizMGoztXZHcuZA7HLmozN1");

        const ixns = [
          claimBountyExampleIx(wallet?.publicKey, provider, new PublicKey(programIdValue), new PublicKey(tokenAccountValue), fundingAccount),
        ];
        console.log("ixns:", ixns);

        const sig = await simulate(wallet, ixns, []);
        //const sig = await launch(wallet, ixns, []);
        console.log("sig:", sig);


        const [_bountyPublicKey, bounty] = await readBountyExample(wallet, new PublicKey(programIdValue), fundingAccount);
        console.log("bounty:", bounty);
        this.pushEvent("claim_bounty", { org: bounty.org, description: bounty.description, amount: parseInt(bounty.amount), programId: bounty.programId, fundingAccount: bounty.fundingAccount, bump: bounty.bump, paused: null });
      });
    }
  },
  SimulateTransaction: {
    mounted() {
      this.el.addEventListener("click", async e => {
        const wallet: Adapter | null = solConnect.getWallet();

        const provider = new AnchorProvider(connection, (wallet as any), {});
        const description = document.getElementById("bounty_description") as HTMLInputElement;
        const descriptionValue = description.value;

        const org = document.getElementById("bounty_org") as HTMLInputElement;
        const orgValue = org.value;

        const amount = document.getElementById("bounty_amount") as HTMLInputElement;
        const amountValue = amount.value;

        const programId = document.getElementById("bounty_program_id") as HTMLInputElement;
        const programIdValue = programId.value;

        const fundingAccount = new PublicKey("BpaQ5nkQDRJEFSMXFEdhVMizMGoztXZHcuZA7HLmozN1");

        const [_bountyPda, bump] = web3.PublicKey.findProgramAddressSync([
          utils.bytes.utf8.encode("bounty"),
          wallet.publicKey.toBuffer(),
          new PublicKey(programIdValue).toBuffer(),
          fundingAccount.toBuffer(),
        ], TOSSBOUNTY_PROGRAM_ID)

        const ixns = [
          createBountyExampleIx(wallet?.publicKey, provider, descriptionValue, orgValue, new BN(parseInt(amountValue)), new PublicKey(programIdValue), fundingAccount),
        ];

        //const sig = await simulate(wallet, ixns, []);
        //const sig = await launch(wallet, ixns, []);
        //console.log("sig:", sig);
        const sig = "uKCivg9jEfJXUdrrK355Lt4BFujrwm8ogDvxtr1vNZCnaqA5XvSJhjyVf2JPtPZ9gSbcn1tNRnesAtRu8sLqg9D";

        this.pushEvent("create_bounty", { wallet: wallet ? wallet.publicKey.toString() : null, org: orgValue, description: descriptionValue, amount: amountValue, programId: programIdValue, signature: sig, fundingAccount: fundingAccount.toString(), bump: bump });
      });
    }
  },
  ConnectWallet: {
    mounted() {
      this.el.addEventListener("click", e => {
        solConnect.openMenu();

        solConnect.onWalletChange((adapter: Adapter | null) => {
          console.log("wallet change:", adapter);
          this.pushEvent("wallet_change", { wallet: adapter ? adapter.publicKey.toString() : null });

          const newBountyButton = document.getElementById("new-bounty-button") as HTMLButtonElement;
          newBountyButton.removeAttribute("hidden");

          adapter
            ? console.log("connected:", adapter.name, adapter.publicKey.toString())
            : console.log("disconnected")
        });

        solConnect.onVisibilityChange((isOpen: boolean) => {
          console.log("menu visible:", isOpen);
        });
      })
    },
  },
  ConnectWalletRelease: {
    mounted() {
      this.el.addEventListener("click", e => {
        solConnect.openMenu();

        solConnect.onWalletChange((adapter: Adapter | null) => {
          console.log("wallet change:", adapter);

          const releaseBountyButton = document.getElementById("release-bounty-button") as HTMLButtonElement;
          if (releaseBountyButton !== null) {
            releaseBountyButton.removeAttribute("disabled");
          }

          const releaseBountyWithPauseButton = document.getElementById("release-bounty-button-with-pause") as HTMLButtonElement;
          if (releaseBountyWithPauseButton !== null) {
            releaseBountyWithPauseButton.removeAttribute("disabled");
          }

          adapter
            ? console.log("connected:", adapter.name, adapter.publicKey.toString())
            : console.log("disconnected")
        });

        solConnect.onVisibilityChange((isOpen: boolean) => {
          console.log("menu visible:", isOpen);
        });
      })
    },
  }
} satisfies Record<string, Partial<ViewHook>>

async function simulate(
  wallet: Adapter,
  ixs: TransactionInstruction[],
  signers?: Keypair[]
) {
  const latestBlockHash = await connection.getLatestBlockhash();
  console.log("latestBlockHash:", latestBlockHash);
  console.log("wallet:", wallet.publicKey!);
  console.log("signers:", signers);
  const message = new TransactionMessage({
    payerKey: wallet.publicKey!,
    recentBlockhash: latestBlockHash.blockhash,
    instructions: [
      ComputeBudgetProgram.setComputeUnitLimit({ units: 500_000 }),
    ].concat(ixs),
  }).compileToV0Message();
  const tx = new VersionedTransaction(message);

  //(wallet as BaseSignerWalletAdapter)
  const signedTx = await (wallet as any).signTransaction(tx, { signers });
  const sim = await connection.simulateTransaction(signedTx);
  if (sim.value.err) {
    console.log(sim.value.logs);
    throw Error(sim.value.err.toString());
  }
  console.log(sim.value.logs!.length === 0 ? sim.value : sim.value.logs);
  return "succeed";
}

async function launch(
  wallet: Adapter,
  ixs: TransactionInstruction[],
  signers?: Keypair[]
) {
  const latestBlockHash = await connection.getLatestBlockhash();
  const message = new TransactionMessage({
    payerKey: wallet.publicKey!,
    recentBlockhash: latestBlockHash.blockhash,
    instructions: [
      ComputeBudgetProgram.setComputeUnitLimit({ units: 500_000 }),
    ].concat(ixs),
  }).compileToV0Message();
  const tx = new VersionedTransaction(message);

  console.log("signers:", signers);
  try {
    const res = await wallet.sendTransaction(tx, connection, { signers });
    console.log("res:", res);
    return res;
  } catch (err) {
    console.error("Error sending transaction:", err);

    return;
  }
}

const createBountyExampleIx = (wallet: PublicKey, provider: AnchorProvider, description: string, org: string, bountyRewardAmount: BN, programId: PublicKey, fundingAccount: PublicKey) => {
  const [bountyPda, bump] = web3.PublicKey.findProgramAddressSync([
    utils.bytes.utf8.encode("bounty"),
    wallet.toBuffer(),
    programId.toBuffer(),
    fundingAccount.toBuffer(),
  ], TOSSBOUNTY_PROGRAM_ID)

  //const publicKey = new PublicKey("2ZwHc9yNYbeMuRQ6bVhGAofePxUu2hCow5sVogziRex6");
  //const publicKey = new PublicKey("BpaQ5nkQDRJEFSMXFEdhVMizMGoztXZHcuZA7HLmozN1");

  return createBountyExample({ description: description, org: org, amount: bountyRewardAmount, bump: bump }, { authority: wallet, bounty: bountyPda, fundingAccount: fundingAccount, systemProgram: SystemProgram.programId, programId: programId }, TOSSBOUNTY_PROGRAM_ID);
};

const claimBountyExampleIx = (wallet: PublicKey, provider: AnchorProvider, programId: PublicKey, whitehatTokenAccount: PublicKey, fundingAccount: PublicKey) => {
  const [bountyPda, bump] = web3.PublicKey.findProgramAddressSync([
    utils.bytes.utf8.encode("bounty"),
    wallet.toBuffer(),
    programId.toBuffer(),
    fundingAccount.toBuffer(),
  ], TOSSBOUNTY_PROGRAM_ID)

  console.log("bountyPda:", bountyPda);
  console.log("programId:", programId);
  //const publicKey = new PublicKey("2ZwHc9yNYbeMuRQ6bVhGAofePxUu2hCow5sVogziRex6");
  //const publicKey = new PublicKey("BpaQ5nkQDRJEFSMXFEdhVMizMGoztXZHcuZA7HLmozN1");

  return claimBountyExample({ authority: wallet, whitehatTokenAccount: whitehatTokenAccount, fundingAccount: fundingAccount, bounty: bountyPda, tokenProgram: TOKEN_PROGRAM_ID, systemProgram: SystemProgram.programId, programId: programId }, TOSSBOUNTY_PROGRAM_ID);
};

const pauseExampleIx = (wallet: Pubkey, programId: PublicKey) => {
  const [statePda, _bump] = web3.PublicKey.findProgramAddressSync([
    utils.bytes.utf8.encode("pause"),
    wallet.toBuffer(),
  ], programId);

  return pauseExample({ authority: wallet, state: statePda, programId: programId, systemProgram: SystemProgram.programId }, TOSSBOUNTY_PAUSER_PROGRAM_ID);
};



declare global {
  interface Window {
    liveSocket: LiveSocket
  }
}

let liveSocket = new LiveSocket("/live", Socket, {
  hooks,
  params: { _csrf_token: csrfToken }
})

function findBountyExample(wallet: Adapter, programId: PublicKey, fundingAccount: PublicKey): PublicKey {
  const [bountyPda, bump] = web3.PublicKey.findProgramAddressSync([
    utils.bytes.utf8.encode("bounty"),
    wallet.publicKey.toBuffer(),
    programId.toBuffer(),
    fundingAccount.toBuffer(),
  ], TOSSBOUNTY_PROGRAM_ID)
  return bountyPda;
}

async function readBountyExample(wallet: Adapter, programId: PublicKey, fundingAccount: PublicKey): Promise<[PublicKey, Bounty | null]> {
  const bounty = findBountyExample(wallet, programId, fundingAccount);
  return [bounty, await Bounty.fetch(connection, bounty, TOSSBOUNTY_PROGRAM_ID)];
}

// Show progress bar on live navigation and form submits
topbar.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" })
window.addEventListener("phx:page-loading-start", _info => topbar.show(300))
window.addEventListener("phx:page-loading-stop", _info => topbar.hide())

// connect if there are any LiveViews on the page
liveSocket.connect()

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket

