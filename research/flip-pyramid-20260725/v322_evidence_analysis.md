# Goldmine Flip Pyramid v3.22 Evidence Analysis

Generated: 2026-07-25T19:51:24.086660+00:00

## Observed Evidence

- MT5 real ticks: 5 campaigns in 79 independent weekly windows.
- Real-tick outcomes: 1 flip, 5 positive, 0 losing, 0 ruin.
- Real-tick best / worst campaign final: $109,835.80 / $5,152.60.
- Real-tick worst intraday equity: $3,446.00.
- MT5 1-minute-OHLC stress outcomes: 1 flip, 2 positive, 3 losing, 0 ruin.
- Stress best / worst campaign final: $109,121.40 / $4,812.60.

## Twelve Qualifying Campaign Attempts

- Empirical probability of at least one >=$100K flip: 93.12%.
- Expected flips: 2.40.
- Expected losing attempts: 3.61.
- Probability of more than four losing attempts: 27.74%.
- Probability of an observed <=$2,500 ruin outcome: 0.00%.

This simulation resamples only the five observed campaigns and alternates between the two MT5 model outcomes. It must not be read as proof of future profitability.

## Twelve Calendar Weeks

- Probability of at least one qualifying campaign: 54.37%.
- Expected campaigns: 0.76.
- Probability of at least one >=$100K flip: 14.14%.
- Probability of at least one losing campaign: 20.58%.

## Uncertainty

- Observed campaign frequency: 5 / 79 weeks.
- Bayesian 95% interval for weekly campaign rate: 2.81% to 13.99%.
- Observed conditional flip rate: 1 / 5 campaigns.
- Bayesian 95% interval for conditional flip rate: 4.36% to 64.03%.
- Stress-model losing rate: 3 / 5 campaigns.
- Bayesian 95% interval for the stress losing rate: 22.31% to 88.17%.
- No ruin was observed in five campaigns, but the Bayesian 95% upper bound remains 46.14%.

## Verdict

**RESEARCH CANDIDATE, NOT FORWARD-APPROVED.**

v3.22 is materially better than v3.21 because its large flip survives both MT5 execution models. It is still too sparse to call reliable: there are five campaigns, one large winner, and three stress-model losses. The next valid test is frozen-code unseen data or a strictly isolated $5K demo forward run after explicit approval. No live attachment is justified by this evidence.
