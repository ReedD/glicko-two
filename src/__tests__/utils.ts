import Match from '../Match';
import Player from '../Player';

export const serializePlayer = (player: Player) => {
  const p: any = player;

  return {
    _rating: +p._rating.toFixed(1),
    _ratingDeviation: +p._ratingDeviation.toFixed(2),
    _volatility: +p._volatility.toFixed(4),
    defaultRating: +p.defaultRating.toFixed(0),
    opponentRatingDeviations: p.opponentRatingDeviations.map(
      num => +num.toFixed(2),
    ),
    opponentRatings: p.opponentRatings.map(num => +num.toFixed(1)),
    outcomes: p.outcomes,
    rating: +p.rating.toFixed(1),
    ratingDeviation: +p.ratingDeviation.toFixed(2),
    tau: p.tau,
    volatility: +p.volatility.toFixed(4),
  };
};

export const serializeTeam = (players: Player[]) =>
  players.map(player => serializePlayer(player));

export const serializeMatch = (match: Match) => {
  return {
    aTeam: serializeTeam(match.aTeam),
    bTeam: serializeTeam(match.bTeam),
  };
};
