export interface MathQuestion {
  question: string;
  answer: number;
  options: number[];
}

export function generateMathQuestion(): MathQuestion {
  const type = Math.floor(Math.random() * 3);

  if (type === 0) {
    const a = Math.floor(Math.random() * 8) + 1;
    const b = Math.floor(Math.random() * 8) + 1;
    const answer = a + b;
    return {
      question: `${a} + ${b} = ?`,
      answer,
      options: shuffleOptions(answer),
    };
  } else if (type === 1) {
    const answer = Math.floor(Math.random() * 8) + 2;
    const b = Math.floor(Math.random() * (answer - 1)) + 1;
    const a = answer + b;
    return {
      question: `${a} - ${b} = ?`,
      answer,
      options: shuffleOptions(answer),
    };
  } else {
    const a = Math.floor(Math.random() * 15) + 1;
    let b = Math.floor(Math.random() * 15) + 1;
    while (b === a) b = Math.floor(Math.random() * 15) + 1;
    const answer = Math.max(a, b);
    return {
      question: `Which is bigger: ${a} or ${b}?`,
      answer,
      options: [a, b].sort(() => Math.random() - 0.5),
    };
  }
}

function shuffleOptions(correct: number): number[] {
  const options = new Set<number>([correct]);
  while (options.size < 3) {
    const offset = Math.floor(Math.random() * 5) + 1;
    const candidate = Math.random() > 0.5 ? correct + offset : Math.max(0, correct - offset);
    options.add(candidate);
  }
  return Array.from(options).sort(() => Math.random() - 0.5);
}
