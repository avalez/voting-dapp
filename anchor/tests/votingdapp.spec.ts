import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { Votingdapp } from '../target/types/votingdapp'


describe('votingdapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Votingdapp as Program<Votingdapp>

  it('Initialize Votingdapp', async () => {
    console.log("Calling initialize");
    await program.methods
      .initializePoll(new anchor.BN(1), "Test Poll", new anchor.BN(0), new anchor.BN(1777000000000))
      .accounts({
				signer: provider.wallet.publicKey,
			})
      .rpc()
  })
})
