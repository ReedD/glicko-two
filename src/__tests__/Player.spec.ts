import Outcome from '../Outcome';
import Player, { createPlayerFactory } from '../Player';
import { serializePlayer } from './utils';

describe('Player', () => {
  const createPlayer = createPlayerFactory();

  describe('createPlayerFactory', () => {
    it('should create new playerFactory', () => {
      const createCustomPlayer = createPlayerFactory({
        defaultRating: 1600,
        defaultRatingDeviation: 200,
        defaultVolatility: 0.09,
        tau: 0.8,
      });
      const player = createCustomPlayer();
      expect(serializePlayer(player)).toMatchSnapshot();
    });

    it('should not be affected by other Player factories', () => {
      const createCustomPlayer = createPlayerFactory({ defaultRating: 1600 });
      const customPlayer = createCustomPlayer();
      const player = createPlayer();
      expect(player.rating).toBe(1500);
      expect(customPlayer.rating).toBe(1600);
    });
  });

  describe('compositePlayer', () => {
    it('should make a default player when passed no settings', () => {
      const aPlayer = createPlayer();
      const bPlayer = createPlayer({ rating: 1600, ratingDeviation: 300 });
      const abPlayer = Player.compositePlayer([aPlayer, bPlayer]);
      expect(abPlayer).toMatchSnapshot();
    });

    it('should fail to make a composite of with empty array', () => {
      expect(() => {
        Player.compositePlayer([]);
      }).toThrowErrorMatchingSnapshot();
    });

    it('should fail to make a composite of two incompatible players', () => {
      const createCustomPlayer = createPlayerFactory({ defaultRating: 1600 });
      const aPlayer = createPlayer();
      const bPlayer = createCustomPlayer();
      expect(() => {
        Player.compositePlayer([aPlayer, bPlayer]);
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe('constructor', () => {
    it('should make a default player when passed no settings', () => {
      const player = createPlayer();
      expect(player).toMatchSnapshot();
    });

    it('should support setting individual settings', () => {
      const player = createPlayer({ rating: 1600 });
      expect(player).toMatchSnapshot();
    });

    it('should throw if invalid player', () => {
      expect(() =>
        createPlayer({ outcomes: [1] }),
      ).toThrowErrorMatchingSnapshot();
      expect(() =>
        createPlayer({ opponentRatingDeviations: [1] }),
      ).toThrowErrorMatchingSnapshot();
      expect(() =>
        createPlayer({ opponentRatings: [1] }),
      ).toThrowErrorMatchingSnapshot();
    });
  });

  describe('addResult', () => {
    it('should add a result with no update to rating or opponent', () => {
      const ryan = createPlayer();
      const bob = createPlayer();
      ryan.addResult(bob, Outcome.Win);
      ryan.addResult(bob, Outcome.Loss);
      ryan.addResult(bob, Outcome.Tie);
      expect(serializePlayer(ryan)).toMatchSnapshot();
      expect(serializePlayer(bob)).toMatchSnapshot();
      expect(ryan).toMatchSnapshot();
      expect(bob).toMatchSnapshot();
    });
  });

  describe('updateRatings', () => {
    it('should calculate new ratings', () => {
      // Following the example calculation given here:
      // http://www.glicko.net/glicko/glicko2.pdf
      // Suppose a player rated 1500 competes against players rated 1400, 1550
      // and 1700, winning the first game and losing the next two. Assume the
      // 1500-rated player's rating deviation is 200, and his opponents' are 30,
      // 100 and 300, respectively. Assume the 1500 player has volatility
      // σ = 0.06, and the system constant τ is 0.5.

      const ryan = createPlayer({ ratingDeviation: 200 });
      const bob = createPlayer({
        rating: 1400,
        ratingDeviation: 30,
        volatility: 0.06,
      });
      const john = createPlayer({
        rating: 1550,
        ratingDeviation: 100,
        volatility: 0.06,
      });
      const mary = createPlayer({
        rating: 1700,
        ratingDeviation: 300,
        volatility: 0.06,
      });

      ryan.addResult(bob, Outcome.Win);
      ryan.addResult(john, Outcome.Loss);
      ryan.addResult(mary, Outcome.Loss);

      ryan.updateRating();

      expect(ryan.rating).toBeCloseTo(1464.06, 1);
      expect(ryan.ratingDeviation).toBeCloseTo(151.52, 2);
      expect(ryan.volatility).toBeCloseTo(0.05999, 4);
    });

    it('should be allowed to be called multiple times', () => {
      const ryan = createPlayer({ ratingDeviation: 200 });
      const bob = createPlayer({
        rating: 1400,
        ratingDeviation: 30,
        volatility: 0.06,
      });
      const john = createPlayer({
        rating: 1550,
        ratingDeviation: 100,
        volatility: 0.06,
      });
      const mary = createPlayer({
        rating: 1700,
        ratingDeviation: 300,
        volatility: 0.06,
      });

      ryan.addResult(bob, Outcome.Win);
      ryan.addResult(john, Outcome.Loss);
      ryan.addResult(mary, Outcome.Loss);

      ryan.updateRating();
      bob.updateRating();
      john.updateRating();
      mary.updateRating();

      // Initiate clones of each player
      const ryan1 = createPlayer(ryan);
      const bob1 = createPlayer(bob);
      const john1 = createPlayer(john);
      const mary1 = createPlayer(mary);

      // Second tournament for the original players
      ryan.addResult(bob, Outcome.Loss);
      ryan.addResult(john, Outcome.Win);
      mary.addResult(bob, Outcome.Win);

      ryan.updateRating();
      bob.updateRating();
      john.updateRating();
      mary.updateRating();

      // Replay second tournament results against the clones
      ryan1.addResult(bob1, Outcome.Loss);
      ryan1.addResult(john1, Outcome.Win);
      mary1.addResult(bob1, Outcome.Win);

      ryan1.updateRating();
      bob1.updateRating();
      john1.updateRating();
      mary1.updateRating();

      // The ratings in both systems should be the same
      expect(ryan.rating).toBe(ryan1.rating);
      expect(ryan.ratingDeviation).toBe(ryan1.ratingDeviation);
      expect(ryan.volatility).toBe(ryan1.volatility);
    });

    it('should be able to update ratings when a player did not play', () => {
      const ryan = createPlayer();
      ryan.updateRating();
      expect(ryan.rating).toBeCloseTo(1500);
      expect(ryan.ratingDeviation).toBeCloseTo(350.155);
      expect(ryan.volatility).toBeCloseTo(0.06);
    });

    it('should clear internals after update', () => {
      const ryan = createPlayer();
      const bob = createPlayer();
      ryan.addResult(bob, Outcome.Win);
      ryan.addResult(bob, Outcome.Loss);
      ryan.addResult(bob, Outcome.Tie);
      expect(serializePlayer(ryan)).toMatchSnapshot();
      ryan.updateRating();
      expect(serializePlayer(ryan)).toMatchSnapshot();
    });
  });
});
