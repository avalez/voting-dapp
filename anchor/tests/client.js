/*
  ANCHOR_PROVIDER_URL=http://localhost:8899 \
  ANCHOR_WALLET=~/.config/solana/id.json \
  node tests/client.js
*/
const anchor = require("@coral-xyz/anchor");
const fs = require("fs");
const splToken = require("@solana/spl-token");
const { exit } = require("process");
const main = async () => {
  console.log("Connecting to Solana...");
  
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Votingdapp;

  await program.methods
    .initializePoll(new anchor.BN(1), "Test Poll", new anchor.BN(0), new anchor.BN(1777000000000))
    .accounts({
      signer: provider.wallet.publicKey,
    })
    .rpc()

};

main();