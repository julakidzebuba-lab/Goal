# Figma Make Prompt — Football Trivia Duel (Frontend)

> Paste the block below into Figma Make. It is written in English on purpose, but ALL in-app
> copy must be rendered in **Georgian (ქართული)** — exact strings are provided inline.

---

## PROMPT (copy from here)

Design a high-fidelity, mobile-first **football trivia duel** app called **"გოლ-ვიქტორინა" (Goal Quiz)**. It is a 1-vs-1 real-time quiz game where two players compete across up to 5 rounds. Build it as a clickable prototype with all screens linked. **All UI text must be in Georgian (Georgian script). The interface language is Georgian. Use a font that fully supports Georgian glyphs (e.g. Noto Sans Georgian, or BPG-style Georgian font).**

### 1. Visual identity & art direction
Everything must scream **football**. Theme the whole app like a modern stadium broadcast.

- **Mood:** premium sports app, night-match stadium energy, broadcast/scoreboard aesthetics.
- **Backgrounds:** dark stadium at night with floodlights, blurred crowd bokeh, a green grass pitch with mowing stripes, faint center-circle and penalty-box line graphics, hexagonal football (soccer ball) pattern textures, net textures behind cards.
- **Recurring motifs:** soccer balls (rolling, spinning), goal nets, stadium floodlight beams, scoreboard LED panels, referee whistle, yellow/red cards, jersey numbers, a trophy.
- **Color palette:**
  - Pitch Green `#0B6E2E` and deep Field Green `#063D1A`
  - Stadium Night `#0A0F14` / `#101820` (primary dark background)
  - Floodlight White `#F5F7F5`
  - Scoreboard Gold / accent `#FFC83D`
  - Neon energy accent (for timers, "live") `#2BE0A8`
  - Alert / wrong answer Red `#E23B3B`, Correct green `#22C55E`
- **Typography:** bold condensed sporty display font for scores/headers (scoreboard feel), clean readable font for body — both with Georgian support. Numbers (scores, timers) should look like an LED scoreboard.
- **Components:** rounded cards with subtle inner glow, glassmorphism panels over the stadium background, glowing CTA buttons shaped slightly like a stadium/ticket, progress bars styled like a pitch with a moving ball marker.
- **Micro-interactions to mock:** spinning ball loader, floodlight flicker on splash, "GOAL!!!" celebration burst (confetti + net ripple) when a round is won, card flip animations, a speed/“who answered faster” comparison bar.

### 2. Global layout
- Mobile portrait (390×844). Also provide key tablet/desktop frames if possible.
- Persistent bottom navigation (5 icons, Georgian labels):
  - მთავარი (Home), თამაში (Play), ლიდერბორდი (Leaderboard), პროფილი (Profile)
- Top app bar shows: user avatar + nickname, current level badge, points pill (with a small ball/coin icon).

### 3. Screens to design (link them into a flow)

**A. Splash / Loading**
- Logo (a soccer ball + "გოლ-ვიქტორინა"), floodlights turning on, spinning ball loader.

**B. Onboarding (2–3 slides, swipeable)**
- Slide copy (Georgian): "ეჯიბრე მეგობრებს ფეხბურთში", "5 რაუნდი, 1 გამარჯვებული", "ააწიე ლეველი და დაიკავე ლიდერბორდის მწვერვალი".
- CTA: "დაწყება".

**C. Sign Up (რეგისტრაცია)**
- Football-themed hero (stadium + ball).
- Fields: ელ-ფოსტა (email), პაროლი (password), გაიმეორე პაროლი (confirm password), ნიქნეიმი (nickname).
- Inline validation states (passwords match / don’t match). Show a "jersey name" preview: as the user types the nickname, show it printed on the back of a football jersey graphic with a number.
- Button: "რეგისტრაცია". Link: "უკვე გაქვს ანგარიში? ავტორიზაცია".

**D. Log In (ავტორიზაცია)**
- Fields: ელ-ფოსტა, პაროლი (login is email + password only).
- Button: "შესვლა". Links: "დაგავიწყდა პაროლი?", "რეგისტრაცია".

**E. Home / Dashboard (მთავარი)**
- Big primary CTA: "ითამაშე ახლა" (Play now) — glowing ball button.
- Card showing current level + progress bar to next level (pitch-styled bar with a ball marker).
- "კვირის სტატისტიკა": wins, win-rate, current streak.
- A cooldown state: if the player already played in the last hour, show a locked card "შემდეგი თამაში: 00:43:12" with a countdown and a referee-whistle icon. (Rule: max 1 game per hour.)

**F. Matchmaking / Finding opponent (მოწინააღმდეგის ძებნა)**
- Full-screen stadium, center circle. Player A avatar on left, animated "VS" in the middle, an empty pulsing slot on the right that says "ველოდებით მოწინააღმდეგეს…" with a spinning ball and animated dots.
- After a few seconds, the empty slot fills with an opponent avatar + nickname (this can be a bot). Show a subtle "მოწინააღმდეგე მოიძებნა!" flash, then transition.

**G. Theme selection / Ban screen (თემის არჩევა)**
- Headline: "დაბლოკე არასასურველი თემა".
- Three large **theme posters** side by side (e.g. "იტალიური ფეხბურთი", "ინგლისური ფეხბურთი", "მარადონას ისტორია"), each a vivid illustrated poster with a title ribbon.
- Interaction mock: Player bans one (poster gets a red "X" / red card overlay + dimmed), opponent bans one (shown after), the remaining poster lights up gold with "ამ თემაზე ვთამაშობთ". Show a small VS strip with both players’ ban indicators.
- Generate the poster artwork yourself (illustrated, football-themed). Make 3 example posters per round type.

**H. Round 1 — Multiple choice (რაუნდი 1: ხუთკუთხედი)**
- Top: scoreboard strip "შენ 0 — 0 მოწინააღმდეგე", round indicator "შეკითხვა 1/5", a circular countdown timer (neon).
- Question card over the pitch. Four answer buttons (2×2 grid), large tap targets.
- States to mock: default, selected, correct (green + check), wrong (red + shake), opponent-answered indicator.
- A **speed bar** at the bottom comparing answer time: "შენ 3.2წ • მოწინააღმდეგე 4.1წ" with a faster/slower highlight.

**I. Goal celebration (გოლის ანიმაცია)**
- When a round is won: big "გოოოლი!" burst, net ripple, scoreboard flips to "1 — 0", confetti, crowd roar visual. Short overlay then continue.

**J. Round 2 — Enumerate (რაუნდი 2: ჩამოთვალე)**
- Theme banner + task, e.g. "ჩამოთვალე ბარსელონას მოთამაშეები, ვისაც კლუბთან მინიმუმ 2 ლიგა აქვს მოგებული". Hint chip: "სულ: 8".
- A text input where the player types surnames; each accepted surname appears as a chip on a scrolling "team sheet" (lineup card). Progress counter "5/8". Live speed/score vs opponent strip.

**K. Round 3 — Cardathon (რაუნდი 3: ბარათონი)**
- A deck/stack of 10 cards. Front of card shows a **visual** (national-team crest, club badge, trophy, player photo) and the prompt "რომელი ნაკრების გერბია?".
- Flip/swipe interaction, multiple-choice or quick-type answer. Show progress "ბარათი 4/10" and the live VS speed strip. Generate placeholder crest/badge illustrations.

**L. Round 4 — Clues (რაუნდი 4: მინიშნებები)**
- "გამოიცანი" screen: 5 large clue cards revealed one by one (clue 1 worth most, clue 5 worth least). A reveal button "შემდეგი მინიშნება", an open answer input "შენი პასუხი". Show a "ვინც ნაკლები მინიშნებით გამოიცნობს, ის იგებს" hint. Live VS strip.

**M. Tiebreaker (რაუნდი 5: ფლეი-ოფი)** — only shown if score is 2–2.
- Same layout as Round 1 but with a dramatic "დამატებითი დრო / ფლეი-ოფი" banner, red-hot scoreboard, sudden-death feel.

**N. Match result (შედეგი)**
- Win state: trophy raise animation, "შენ მოიგე!", final score big on scoreboard, "+3 ქულა", level progress update, rematch/home buttons.
- Lose state: "ამჯერად წააგე", final score, points still shown, "სცადე ისევ".
- Buttons: "მთავარი", "გაზიარება".

**O. Profile (პროფილი)**
- Avatar on a jersey, nickname, level badge + rank name (e.g. "ლეგენდა").
- Big points number (scoreboard style). Progress bar to next level "შემდეგ ლეველამდე: 14 ქულა".
- Stats grid: მატჩები, მოგება, წაგება, საუკეთესო სერია, საშ. სიჩქარე.
- Trophy / achievements shelf. Edit profile + log out.

**P. Leaderboard (ლიდერბორდი)**
- Top-3 podium (stadium podium with trophies, gold/silver/bronze, jersey avatars).
- Ranked list below: rank #, avatar, nickname, level badge, points. Highlight the current user’s row ("შენ"). Tabs: "გლობალური", "მეგობრები", "კვირის".

**Q. Cooldown / locked state (already covered on Home)** — also a modal: "საათში მხოლოდ ერთხელ შეგიძლია თამაში" with countdown.

### 4. Deliverables
- All screens above as connected frames with a clickable prototype flow:
  Splash → Onboarding → Sign Up/Log In → Home → Matchmaking → Theme ban → Round 1 → Goal → Round 2 → Round 3 → Round 4 → Tiebreaker → Result → Profile/Leaderboard.
- A small design system page: colors, typography, buttons, inputs, cards, scoreboard component, timer, badges, theme-poster template.
- Light and dark variants if feasible (dark is primary).
- Generate all illustrative artwork (posters, crests, ball/stadium graphics) in an illustrated, cohesive football style.

## END OF PROMPT
