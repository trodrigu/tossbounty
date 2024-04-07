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
import { Connection, TransactionMessage, TransactionInstruction, ComputeBudgetProgram, Keypair, VersionedTransaction, clusterApiUrl, } from "@solana/web3.js";
import { SolanaConnect } from "solana-connect";
import { Adapter } from "@solana/wallet-adapter-base";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { AnchorProvider, BN, web3, utils, Program } from "@coral-xyz/anchor";
import { IDL } from "./tossbounty";
import { IDL as ExampleIDL } from "./example";
//import * as splToken from "@solana/spl-token";

const solConnect = new SolanaConnect({
  additionalAdapters: [
    new SolflareWalletAdapter({
      network: WalletAdapterNetwork.Devnet,
    }),
  ]
});

const connection = new Connection(clusterApiUrl("devnet"));
console.log("connection:", connection)

const csrfToken = document.querySelector("meta[name='csrf-token']")!.getAttribute("content")

const hooks = {
  SimulateTransaction: {
    mounted() {
      this.el.addEventListener("click", e => {
        console.log("solConnect:", solConnect);
        const wallet: Adapter | null = solConnect.getWallet();
        console.log("wallet:", wallet.publicKey.toBuffer());

        const provider = new AnchorProvider(connection, (wallet as any), {});
        console.log("provider:", provider);

        //const program = workspace.Tossbounty as Program<Tossbounty>;
        const program = new Program(IDL, "BYzWEaZXS7Zf4SY6dcqnsjySp9qLEmB9C3WvyigxtpYQ", provider);
        console.log("program:", program);
        //console.log("program:", program);
        //const example = workspace.Example as Program<Example>;
        const example = new Program(ExampleIDL, "BYzWEaZXS7Zf4SY6dcqnsjySp9qLEmB9C3WvyigxtpYR", provider);
        const [bountyPda, bump] = web3.PublicKey.findProgramAddressSync([
          utils.bytes.utf8.encode("bounty"),
          wallet.publicKey.toBuffer(),
          example.programId.toBuffer()
        ], program.programId)

        console.log("bountyPda:", bountyPda);

        const description = "Fix a bug in our app";
        const org = "coral-xyz";
        const bountyRewardAmount = new BN(10000);

        // TODO: deal with funding account?
        //const mintPubkey = await splToken.createMint(
          //provider.connection,
          //payer,
          //provider.wallet.publicKey,
          //provider.wallet.publicKey,
          //6,
        //);
        //const fundingAccount = await splToken.createAccount(
          //provider.connection,
          //payer,
          //mintPubkey, 
          //payer.publicKey, 
        //);
        // TODO: create associated token funding account offline
        const fundingAccount = wallet.publicKey;


        const ix = program.methods.createBountyExample(description, org, bountyRewardAmount, bump).accounts({
          bounty: bountyPda,
          fundingAccount: fundingAccount, 
          programId: example.programId,
        });

        ix.rpc();
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
  console.log("connection simulate:", connection);
  const latestBlockHash = await connection.getLatestBlockhash();
  console.log("latestBlockHash:", latestBlockHash);
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

declare global {
  interface Window {
    liveSocket: LiveSocket
  }
}

let liveSocket = new LiveSocket("/live", Socket, {
  hooks,
  params: { _csrf_token: csrfToken }
})

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

