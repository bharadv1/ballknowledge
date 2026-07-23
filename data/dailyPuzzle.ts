export type DailyPuzzle = {
  puzzleNumber: number;
  playerId: number;
  clues: string[];
};

export const puzzles: DailyPuzzle[] = [
  {
    puzzleNumber: 1,
    playerId: 200751,
    clues: [
      "Born with every major organ on the opposite side of his body.",
      "His draft rights changed hands twice before he ever played an NBA game.",
      "One of the first stars to help put Jay Wright’s program back on the national map.",
      "Played for seven different NBA teams without ever making an All-Star Game.",
      "Nicknamed 'The Shot Maker'",
      "Big East Player of the Year (2006)",
    ],
  },

  {
    puzzleNumber: 2,
    playerId: 2554,
    clues: [
      "Born in Guadeloupe and represented France internationally.",
      "Won two French League championships before entering the NBA.",
      "Earned the nickname 'Air France' for his athletic style of play.",
      "Played for five NBA teams: Golden State, Orlando, Phoenix, Boston and Toronto.",
      "Helped Orlando reach the 2009 NBA Finals, frequently defending LeBron James and Kobe Bryant during the playoff run.",
      "His older brother Florent also played professionally and represented France.",
    ],
  },

  {
    puzzleNumber: 3,
    playerId: 2446,
    clues: [
      "Was part of the largest trade in NBA history at the time—a deal involving 13 players and five teams.",
      "Changed his legal name before reaching the NBA.",
      "Played for eight NBA franchises over a 13-year career.",
      "Won the NBA D-League Impact Player of the Year award after briefly leaving the NBA.",
      "Spent part of his career with the New Orleans franchise while it temporarily played its home games in Oklahoma City after Hurricane Katrina.",
      "Finished his NBA career by appearing for three different teams in a single season.",
    ],
  },

  {
    puzzleNumber: 4,
    playerId: 201936,
    clues: [
      "Joined Oscar Robertson, Michael Jordan, LeBron James, and later Luka Dončić as one of the only rookies to average at least 20 points, 5 rebounds, and 5 assists.",
      "Led one of the biggest regular-season comebacks in NBA history after his team erased a 35-point deficit against Chicago.",
      "Spent four years away from the NBA before earning another opportunity.",
      "Was once considered one of the league’s most versatile young guards, playing point guard, shooting guard, and small forward throughout his career.",
      "Won NBA Rookie of the Year in back-to-back years for the same college program after Derrick Rose did it the season before.",
      "His final full NBA season ended with him averaging nearly 20 points per game again—almost a decade after winning Rookie of the Year.",
    ],
  },

  {
    puzzleNumber: 5,
    playerId: 201627,
    clues: [
      "In my first NBA start, I dropped 37 points—the most ever by an undrafted rookie in his first career start.",
      "I became the first rookie in franchise history to lead the entire NBA in three-point percentage.",
      "Scored 47 points in an NBA Summer League game, setting a league record at the time.",
      "Despite never being drafted, I finished my career as one of the best three-point shooters in NBA history by percentage.",
      "Played alongside both Stephen Curry and Kevin Durant—but never at the same time.",
      "My quickest release made me one of the NBA’s most feared catch-and-shoot specialists of the 2010s.",
    ],
  },

  {
    puzzleNumber: 6,
    playerId: 2052,
    clues: [
      "Finished second to Desmond Mason in the 2001 NBA Slam Dunk Contest.",
      "Became the youngest player in Utah Jazz history to start an NBA game.",
      "Publicly challenged LeBron James to a one-on-one matchup during the 2008 playoffs.",
      "Started every game for the Mavericks during their 2011 championship run as a defensive specialist.",
      "Celebrated Dallas’ title by getting the Larry O’Brien Trophy tattooed on his neck.",
      "Wore No. 92 in honor of the year his father was sentenced to prison.",
    ],
  },

  {
    puzzleNumber: 7,
    playerId: 2564,
    clues: [
      "Began his professional career as a point guard before eventually playing every position in the NBA.",
      "Won the NBA’s Most Improved Player award after being traded for Joe Johnson.",
      "Led every player in total assists during the 2014 NBA Finals despite not being a guard.",
      "His mother won a silver medal in high jump at the Olympic Games, while his father played professional basketball for Senegal.",
      "Was famous for traveling with an espresso machine—even taking it on a road trip through U.S. national parks after being traded.",
      "Spent his post-playing years producing wine and directing short films rather than becoming a coach or broadcaster.",
    ],
  },
];

const launchDate = new Date(2026, 6, 23); // July 23, 2026

export function getDailyPuzzle(date = new Date()): DailyPuzzle {
  const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const start = new Date(
    launchDate.getFullYear(),
    launchDate.getMonth(),
    launchDate.getDate()
  );

  const daysSinceLaunch = Math.floor(
    (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  const index = Math.max(0, daysSinceLaunch);

  if (index >= puzzles.length) {
    throw new Error(
      `No puzzle exists for day ${index + 1}. Add more puzzles to dailyPuzzle.ts.`
    );
  }

  return puzzles[index];
}