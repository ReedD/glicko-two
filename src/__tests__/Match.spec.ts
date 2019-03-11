import Match from '../Match';
import { createPlayerFactory } from '../Player';
import { serializeMatch } from './utils';

describe('Match', () => {
  const createPlayer = createPlayerFactory();
  const createTeam = (...ratings: number[]) =>
    ratings.map(rating => createPlayer({ rating }));

  describe('constructor', () => {
    it('should create a match between two players', () => {
      const aPlayer = createPlayer();
      const bPlayer = createPlayer({ rating: 1600 });
      const match = new Match(aPlayer, bPlayer);
      expect(serializeMatch(match)).toMatchSnapshot();
    });

    it('should create a match between two teams', () => {
      const aTeam = createTeam(1501, 1502, 1503);
      const bTeam = createTeam(1601, 1602, 1603);
      const match = new Match(aTeam, bTeam);
      expect(serializeMatch(match)).toMatchSnapshot();
    });

    it('should create a match between a player and a team', () => {
      const aPlayer = createPlayer();
      const bTeam = createTeam(1601, 1602, 1603);
      const match = new Match(aPlayer, bTeam);
      expect(serializeMatch(match)).toMatchSnapshot();
    });

    it('should create a match between uneven teams', () => {
      const aTeam = createTeam(1501, 1502, 1503, 1504);
      const bTeam = createTeam(1601, 1602, 1603);
      const match = new Match(aTeam, bTeam);
      expect(serializeMatch(match)).toMatchSnapshot();
    });

    it('should fail to create if missing opponent', () => {
      const aTeam = createTeam(1601, 1602, 1603);
      expect(() => {
        new Match(aTeam, undefined);
      }).toThrowErrorMatchingSnapshot();
    });

    it('should fail to create if team is empty', () => {
      const aTeam = createTeam();
      const bTeam = createTeam(1601, 1602, 1603);
      expect(() => {
        new Match(aTeam, bTeam);
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe('reporting', () => {
    it('should report player A won', () => {
      const aPlayer = createPlayer();
      const bPlayer = createPlayer();
      const match = new Match(aPlayer, bPlayer);
      expect(serializeMatch(match)).toMatchSnapshot();
      match.reportTeamAWon();
      expect(serializeMatch(match)).toMatchSnapshot();
    });

    it('should report player B won', () => {
      const aPlayer = createPlayer();
      const bPlayer = createPlayer();
      const match = new Match(aPlayer, bPlayer);
      expect(serializeMatch(match)).toMatchSnapshot();
      match.reportTeamBWon();
      expect(serializeMatch(match)).toMatchSnapshot();
    });

    it('should report players tied', () => {
      const aPlayer = createPlayer();
      const bPlayer = createPlayer();
      const match = new Match(aPlayer, bPlayer);
      expect(serializeMatch(match)).toMatchSnapshot();
      match.reportTie();
      expect(serializeMatch(match)).toMatchSnapshot();
    });

    it('should report team A won', () => {
      const aTeam = createTeam(1501, 1502, 1503);
      const bTeam = createTeam(1601, 1602, 1603);
      const match = new Match(aTeam, bTeam);
      expect(serializeMatch(match)).toMatchSnapshot();
      match.reportTeamAWon();
      expect(serializeMatch(match)).toMatchSnapshot();
    });

    it('should report team B won', () => {
      const aTeam = createTeam(1501, 1502, 1503);
      const bTeam = createTeam(1601, 1602, 1603);
      const match = new Match(aTeam, bTeam);
      expect(serializeMatch(match)).toMatchSnapshot();
      match.reportTeamBWon();
      expect(serializeMatch(match)).toMatchSnapshot();
    });

    it('should report teams tied', () => {
      const aTeam = createTeam(1501, 1502, 1503);
      const bTeam = createTeam(1601, 1602, 1603);
      const match = new Match(aTeam, bTeam);
      expect(serializeMatch(match)).toMatchSnapshot();
      match.reportTie();
      expect(serializeMatch(match)).toMatchSnapshot();
    });
  });

  describe('updatePlayerRatings', () => {
    it('should handle team A win in 1v1 best of 5', () => {
      const aPlayer = createPlayer();
      const bPlayer = createPlayer();
      const match = new Match(aPlayer, bPlayer);
      expect(serializeMatch(match)).toMatchSnapshot();
      match.reportTeamAWon();
      match.reportTeamAWon();
      match.reportTie();
      match.reportTeamBWon();
      match.reportTeamAWon();
      match.updatePlayerRatings();
      expect(serializeMatch(match)).toMatchSnapshot();
    });

    it('should handle team B win in 3v3 best of 5', () => {
      const aTeam = createTeam(1500, 1500, 1500);
      const bTeam = createTeam(1500, 1500, 1500);
      const match = new Match(aTeam, bTeam);
      expect(serializeMatch(match)).toMatchSnapshot();
      match.reportTeamAWon();
      match.reportTeamAWon();
      match.reportTie();
      match.reportTeamBWon();
      match.reportTeamAWon();
      match.updatePlayerRatings();
      expect(serializeMatch(match)).toMatchSnapshot();
    });
  });
});
