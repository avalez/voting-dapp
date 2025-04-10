'use client'

import { getVotingdappProgram, getVotingdappProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useVotingdappProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getVotingdappProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getVotingdappProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['candidate', 'all', { cluster }],
    queryFn: () => program.account.candidate.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    /*
    mutationKey: ['votingdapp', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initializePoll( ).accounts({ votingdapp: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize candidate'),
    */
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useVotingdappProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useVotingdappProgram()

  const accountQuery = 
  useQuery({
    queryKey: ['candidate', 'fetch', { cluster, account }],
    queryFn: () => program.account.candidate.fetch(account),
  })

  const closeMutation = () => {} 
  // useMutation({
  //   mutationKey: ['votingdapp', 'close', { cluster, account }],
  //   mutationFn: () => program.methods.close().accounts({ votingdapp: account }).rpc(),
  //   onSuccess: (tx) => {
  //     transactionToast(tx)
  //     return accounts.refetch()
  //   },
  // })

  const decrementMutation = () => {}
  // useMutation({
  //   mutationKey: ['votingdapp', 'decrement', { cluster, account }],
  //   mutationFn: () => program.methods.decrement().accounts({ votingdapp: account }).rpc(),
  //   onSuccess: (tx) => {
  //     transactionToast(tx)
  //     return accountQuery.refetch()
  //   },
  // })

  const incrementMutation = () => {}
  //  useMutation({
  //   mutationKey: ['votingdapp', 'increment', { cluster, account }],
  //   mutationFn: () => program.methods.increment().accounts({ votingdapp: account }).rpc(),
  //   onSuccess: (tx) => {
  //     transactionToast(tx)
  //     return accountQuery.refetch()
  //   },
  // })

  const setMutation = () => {}
  //  useMutation({
  //   mutationKey: ['votingdapp', 'set', { cluster, account }],
  //   mutationFn: (value: number) => program.methods.set(value).accounts({ votingdapp: account }).rpc(),
  //   onSuccess: (tx) => {
  //     transactionToast(tx)
  //     return accountQuery.refetch()
  //   },
  // })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
