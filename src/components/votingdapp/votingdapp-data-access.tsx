"use client";

import { getVotingdappProgram, getVotingdappProgramId } from "@project/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Cluster, Keypair, PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";
import * as anchor from '@coral-xyz/anchor'
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import { useTransactionToast } from "../ui/ui-layout";

export function useVotingdappProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getVotingdappProgramId(cluster.network as Cluster),
    [cluster],
  );
  const program = useMemo(
    () => getVotingdappProgram(provider, programId),
    [provider, programId],
  );

  const accounts = useQuery({
    queryKey: ["candidate", "all", { cluster }],
    queryFn: () => program.account.candidate.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account", { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const initialize = useMutation({
    mutationKey: ["votingdapp", "initialize", { cluster }],
    mutationFn: (publicKey: PublicKey) =>
      program.methods
        .initializePoll(new anchor.BN(1), "Test Poll", new anchor.BN(Date.now()), new anchor.BN(Date.now() + 3600000))
        .accounts({ signer: publicKey })
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error("Failed to initialize candidate"),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  };
}

export function useVotingdappProgramAccount({
  account,
}: {
  account: PublicKey;
}) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useVotingdappProgram();

  const accountQuery = useQuery({
    queryKey: ["candidate", "fetch", { cluster, account }],
    queryFn: () => program.account.candidate.fetch(account),
  });


  return {
    accountQuery,
  };
}
