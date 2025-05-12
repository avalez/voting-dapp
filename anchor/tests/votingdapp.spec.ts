import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { Votingdapp } from '../target/types/votingdapp'


describe('votingdapp', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Votingdapp as Program<Votingdapp>
  const voitingAdress = program.programId

  beforeAll(async () => {
  })

  it('Initialize Votingdapp', async () => {
    console.log("Calling initialize");
    await program.methods
      .initializePoll(new anchor.BN(1), "Test Poll", new anchor.BN(0), new anchor.BN(1777000000000))
      .accounts({
				signer: provider.wallet.publicKey,
			})
      .rpc()
    const [pollAddress] = await PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8)],
      voitingAdress
    )
    const poll = await program.account.poll.fetch(pollAddress)
    expect(poll.pollId.toString()).toEqual(new anchor.BN(1).toString())
    expect(poll.description).toEqual("Test Poll")
    expect(poll.pollStart.toNumber()).toBeLessThan(poll.pollEnd.toNumber())
    console.log("Poll: ", poll)
  })

  it('Initialize Candidate', async () => {
    console.log("Calling initialize candidate");
    await program.methods
      .initializeCandidate("Vote1", new anchor.BN(1))
      .rpc()
    const [pollAddress] = await PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Vote1")],
      voitingAdress
    )
    const candidate = await program.account.candidate.fetch(pollAddress)
    expect(candidate.candidateName).toEqual("Vote1")
    expect(candidate.candidateVotes.toNumber()).toEqual(0)
    console.log("Candidate: ", candidate)
  })

  it('Initialize Candidate 2', async () => {
    console.log("Calling initialize candidate 2");
    await program.methods
      .initializeCandidate("Vote2", new anchor.BN(1))
      .rpc()
    const [pollAddress] = await PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, 'le', 8), Buffer.from("Vote2")],
      voitingAdress
    )
    const candidate = await program.account.candidate.fetch(pollAddress)
    expect(candidate.candidateName).toEqual("Vote2")
    expect(candidate.candidateVotes.toNumber()).toEqual(0)
    console.log("Candidate 2: ", candidate)
  })

  it('Vote', async () => {
    await program.methods.vote("Vote1", new anchor.BN(1)).rpc()
  })
})
