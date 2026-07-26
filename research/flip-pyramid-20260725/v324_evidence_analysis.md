# Goldmine Flip Pyramid v3.24 Evidence Analysis

Generated: 2026-07-26T05:24:06.943500+00:00

## Observed Evidence

- Frozen binary SHA-256: `eeb6260ef29837d15df1a00c7a0c7ca9d66aa9204e6db2023bcb3ea9beea0505`
- MT5 real ticks: 5 campaigns in 79 weekly windows.
- Real outcomes: 1 >=$200K flip, 5 positive, 0 losing, 0 ruin.
- Real best / worst campaign final: $242,835.80 / $5,152.60.
- Real worst intra-test equity / margin level: $3,446.00 / 118.94%.
- MT5 1-minute-OHLC stress: 1 >=$200K flip, 2 positive, 3 losing, 0 ruin.
- Stress best / worst campaign final: $255,141.40 / $4,812.60.
- Stress worst intra-test equity / margin level: $3,344.00 / 29.81%.

## Twelve Qualifying Campaign Attempts

- Empirical probability of at least one >=$200K flip: 93.16%.
- Expected flips: 2.40.
- Expected losing attempts: 3.60.
- Probability of more than four losing attempts: 27.63%.

This resamples only five observed campaign pairs and is not proof of future profitability.

## Twelve Calendar Weeks

- Probability of at least one qualifying campaign: 54.54%.
- Expected campaigns: 0.76.
- Empirical probability of at least one >=$200K flip: 14.34%.
- Probability of at least one losing campaign: 20.66%.

## Uncertainty

- Observed campaign frequency: 5 / 79 weeks.
- Bayesian 95% weekly campaign-rate interval: 2.81% to 13.98%.
- Observed conditional >=$200K flip rate: 1 / 5 campaigns.
- Bayesian 95% conditional flip-rate interval: 4.39% to 64.05%.
- Stress-model loss rate: 3 / 5 campaigns.
- No ruin was observed, but the Bayesian 95% upper bound is 45.99%.

## Verdict

**FROZEN RESEARCH CANDIDATE, AWAITING AN ISOLATED DEMO FORWARD TEST.**

v3.24 is the first branch to exceed $200K in both full-batch MT5 models: $242,835.80 on real ticks and $255,141.40 on 1-minute OHLC. The 50-lot fourth-layer branch was rejected after falling to $1,189.60 under the stress model. The surviving 35-lot branch is still exceptionally fragile: one flip dominates the evidence and stress margin fell to 29.81%. It must not be treated as a guaranteed or production-ready bot.
