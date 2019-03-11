enum Outcome {
  Win = 1,
  Loss = 0,
  Tie = 0.5,
}

export const negateOutcome = (outcome: Outcome) => {
  switch (outcome) {
    case Outcome.Win:
      return Outcome.Loss;
    case Outcome.Loss:
      return Outcome.Win;
    default:
      return Outcome.Tie;
  }
};

export default Outcome;
