import { BN, Program, web3 } from "@coral-xyz/anchor"
import { ActionPostRequest, ACTIONS_CORS_HEADERS, createPostResponse } from "@solana/actions"
import { Connection, PublicKey } from "@solana/web3.js"
import { Votingdapp } from "@/../anchor/target/types/votingdapp"
const IDL = require('@/../anchor/target/idl/votingdapp.json')

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: ACTIONS_CORS_HEADERS,
  });
}

export async function GET(request: Request) {
  const actionMetadata = {
    icon: 'https://cupe15.org/wp-content/uploads/2023/05/vote-980x783.jpg',
    title: 'Vote',
    description: 'Vote for a candidate',  
    label: 'Vote',
    links: {
      actions: [
        { href: '/api/vote?candidate=Vote1', label: 'Vote 1' },
        { href: '/api/vote?candidate=Vote2', label: 'Vote 2' },  
      ]
    }
  }
  return Response.json(actionMetadata, { headers: ACTIONS_CORS_HEADERS })
}

export async function POST(request: Request) {
  const url = new URL(request.url)
  const { searchParams } = url
  const candidate = searchParams.get('candidate') ?? ''
  if (!candidate) {
    return new Response('Candidate not found', { status: 400 })
  }
  const connection = new Connection('http://localhost:8899', "confirmed")
	const program : Program<Votingdapp> = new Program(IDL, {connection})
  const body: ActionPostRequest = await request.json()
  let voter = new PublicKey(body.account)
  try {
    voter = new PublicKey(body.account)
  } catch (e) {
    return new Response('Invalid account', { status: 400 })
  }

  const instruction = await program.methods
    .vote(candidate, new BN(1))
    .accounts({
      signer: voter
    })
    .instruction()

  const blockhash = await connection.getLatestBlockhash()
  const transaction = new web3.Transaction({
    feePayer: voter,
    blockhash: blockhash.blockhash,
    lastValidBlockHeight: blockhash.lastValidBlockHeight,
  }).add(instruction)

  const response = await createPostResponse({
    fields: {
      type: "transaction",
      transaction,
    }
  })
  return Response.json(response, { headers: ACTIONS_CORS_HEADERS })
}
