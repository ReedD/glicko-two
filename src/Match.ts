import Outcome, { negateOutcome } from './Outcome';
import Player from './Player';

export type MatchOpponent = Player | Player[];

// http://rhetoricstudios.com/downloads/AbstractingGlicko2ForTeamGames.pdf

export default class Match {
  readonly aTeam: Player[];
  readonly bTeam: Player[];

  constructor(a: MatchOpponent, b: MatchOpponent) {
    this.aTeam = Array.isArray(a) ? a : [a];
    this.bTeam = Array.isArray(b) ? b : [b];
    if (!a || !b || this.aTeam.length < 1 || this.bTeam.length < 1) {
      throw new Error('Each team must consist of at least one player');
    }
  }

  private get aComposite() {
    return Player.compositePlayer(this.aTeam);
  }

  private get bComposite() {
    return Player.compositePlayer(this.bTeam);
  }

  reportTeamAWon() {
    this.reportATeamResult(Outcome.Win);
  }

  reportTeamBWon() {
    this.reportATeamResult(Outcome.Loss);
  }

  reportTie() {
    this.reportATeamResult(Outcome.Tie);
  }

  updatePlayerRatings() {
    this.aTeam.forEach(player => player.updateRating());
    this.bTeam.forEach(player => player.updateRating());
  }

  private reportATeamResult(outcome: Outcome) {
    const aComposite = this.aComposite;
    const bComposite = this.bComposite;
    this.aTeam.forEach(player => {
      player.addResult(bComposite, outcome);
    });
    const oppositeOutcome = negateOutcome(outcome);
    this.bTeam.forEach(player => player.addResult(aComposite, oppositeOutcome));
  }
}
