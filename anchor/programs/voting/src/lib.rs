#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;

declare_id!("A1jSYWiD4Q8MvbuA7wwx16ftYMGJSoEyPvR2uDrk8EyF");

#[program]
pub mod votingdapp {
    use super::*;

    pub fn initialize_poll(ctx: Context<InitializePoll>,
        poll_id: u64, description: String, poll_start: u64, poll_end: u64) -> Result<()> {
        let poll = &mut ctx.accounts.poll;
        poll.poll_id = poll_id;
        poll.description = description;
        poll.poll_start = poll_start;
        poll.poll_end = poll_end;
        poll.candidate_amount = 0;
        msg!("Poll initialized with ID: {}", poll_id);
        Ok(())
    }

    pub fn initialize_candidate(ctx: Context<InitializeCandidate>,
        candidate_name: String, poll_id: u64) -> Result<()> {
        let candidate = &mut ctx.accounts.candidate;
        let poll = &mut ctx.accounts.poll;
        poll.candidate_amount += 1;
        candidate.poll_id = poll_id;
        candidate.candidate_name = candidate_name.clone();
        candidate.candidate_votes = 0;
        msg!("Candidate initialized with name: {}", candidate_name);
        Ok(())
    }

    pub fn vote(ctx: Context<Vote>, _candidate_name: String, _poll_id: u64) -> Result<()> {
        let candidate = &mut ctx.accounts.candidate;
        let _poll = &mut ctx.accounts.poll;
        let voter = &mut ctx.accounts.signer;

        // Check if the voter has already voted
        //require!(voter.key != candidate.key(), ErrorCode::AlreadyVoted);

        // Increment the candidate's votes
        candidate.candidate_votes += 1;
        msg!("Voter {} voted for candidate {}", voter.key(), candidate.candidate_name);
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct InitializePoll<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init,
        payer = signer,
        space = Poll::INIT_SPACE,
        seeds = [ poll_id.to_le_bytes().as_ref() ],
        bump,
    )]
    pub poll: Account<'info, Poll>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Poll {
    pub poll_id: u64,
    #[max_len(280)]
    pub description: String,
    pub poll_start: u64,
    pub poll_end: u64,
    pub candidate_amount: u64,
}

#[derive(Accounts)]
#[instruction(candidate_name: String, poll_id: u64)]
pub struct InitializeCandidate<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        mut,
        seeds = [ poll_id.to_le_bytes().as_ref() ],
        bump,
    )]
    pub poll: Account<'info, Poll>,
    #[account(
        init,
        payer = signer,
        space = 8 * Candidate::INIT_SPACE,
        seeds = [ poll_id.to_le_bytes().as_ref(), candidate_name.as_ref() ],
        bump,
    )]
    pub candidate: Account<'info, Candidate>,
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct Candidate {
    #[max_len(280)]
    pub candidate_name: String,
    pub candidate_votes: u64,
    pub poll_id: u64,
}

#[derive(Accounts)]
#[instruction(candidate_name: String, poll_id: u64)]
pub struct Vote<'info> {
    pub signer: Signer<'info>,
    #[account(
        seeds = [ poll_id.to_le_bytes().as_ref() ],
        bump,
    )]
    pub poll: Account<'info, Poll>,
    #[account(
        mut,
        seeds = [ poll_id.to_le_bytes().as_ref(), candidate_name.as_ref() ],
        bump,
    )]
    pub candidate: Account<'info, Candidate>,
    pub system_program: Program<'info, System>,
}
