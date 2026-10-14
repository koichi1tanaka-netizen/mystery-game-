"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

type Look = {
  skin: string;
  hair: string;
  clothes: string;
  pants: string;
  style: string;
};

type Question = {
  id: string;
  text: string;
  answer: string;
  clueId?: string;
};

type Suspect = {
  id: string;
  name: string;
  x: number;
  y: number;
  look: Look;
  introduction: string;
  questions: Question[];
};

type Clue = {
  id: string;
  name: string;
  description: string;
  x?: number;
  y?: number;
};

type Furniture = {
  kind: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
};

type Mystery = {
  id: string;
  title: string;
  subtitle: string;
  room: string;
  description: string;
  culprit: string;
  solution: string;
  required: string[];
  hints: string[];
  furniture: Furniture[];
  clues: Clue[];
  suspects: Suspect[];
};

const look = (
  skin: string,
  hair: string,
  clothes: string,
  pants: string,
  style = "short"
): Look => ({ skin, hair, clothes, pants, style });

const q = (
  id: string,
  text: string,
  answer: string,
  clueId?: string
): Question => ({ id, text, answer, clueId });

const c = (
  id: string,
  name: string,
  description: string,
  x?: number,
  y?: number
): Clue => ({ id, name, description, x, y });

const f = (
  kind: string,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string
): Furniture => ({ kind, x, y, w, h, label });

const s = (
  id: string,
  name: string,
  x: number,
  y: number,
  appearance: Look,
  introduction: string,
  questions: Question[]
): Suspect => ({
  id,
  name,
  x,
  y,
  look: appearance,
  introduction,
  questions,
});

const mysteries: Mystery[] = [
  {
    id: "diamond",
    title: "The Missing Diamond",
    subtitle: "A priceless diamond vanishes during a dinner party.",
    room: "MANSION LIBRARY",
    description:
      "The Star of Arden diamond disappeared at 9 PM. Four people have something to hide.",
    culprit: "daniel",
    solution:
      "Daniel used the open garden door to enter the library. James saw his muddy shoes, and Sophia knew about the planned meeting.",
    required: ["d-shoes", "d-door", "d-note"],
    hints: [
      "Question the people who were near the hallway around 9 PM.",
      "James knows more about the garden door than he first lets on.",
      "Ask James who came in from the garden. Then ask Sophia about the note.",
      "You need the muddy shoes, open garden door, and secret meeting evidence.",
    ],
    furniture: [
      f("bookshelf", 60, 60, 185, 100, "Bookshelf"),
      f("table", 345, 245, 220, 90, "Reading table"),
      f("desk", 650, 265, 155, 90, "Writing desk"),
      f("sofa", 65, 370, 165, 75, "Velvet sofa"),
      f("cabinet", 705, 65, 120, 90, "Display cabinet"),
      f("painting", 370, 70, 100, 100, "Landscape painting"),
    ],
    clues: [
      c("d-foot", "Muddy Footprint", "A muddy footprint leads from the garden entrance toward the library.", 280, 185),
      c("d-key", "Brass Key", "A small brass key may fit the library desk drawer.", 600, 410),
      c("d-letter", "Secret Note", "The note reads: 'Meet me in the library at 9:00.'", 280, 485),
      c("d-shoes", "Muddy Shoes Testimony", "James saw Daniel enter from the garden with mud covering his shoes."),
      c("d-door", "Open Garden Door", "James says the garden door was open during the theft, although he usually locks it every evening."),
      c("d-note", "Secret Meeting", "Sophia found a note arranging a meeting in the library at exactly 9 PM."),
    ],
    suspects: [
      s("james", "James", 270, 175, look("#bd805f", "#2b201b", "#374151", "#202938"), "I was preparing dessert in the kitchen. I barely went near the library.", [
        q("j-time", "Where were you at 9 PM?", "In the kitchen, preparing dessert. I didn't leave until after 9:15."),
        q("j-witness", "Did you see anyone?", "I saw Daniel coming in from the garden. His shoes were covered in mud.", "d-shoes"),
        q("j-door", "Was anything unusual?", "The garden door was open. I always lock it at night.", "d-door"),
      ]),
      s("emma", "Emma", 700, 180, look("#f0c5a7", "#6c3c22", "#b83266", "#5b2440", "long"), "I was upstairs most of the evening. I came down when I heard a noise.", [
        q("e-time", "Where were you?", "I was in my room upstairs until I heard something fall."),
        q("e-key", "Do you know about a key?", "Father hid a small brass key somewhere in the library."),
      ]),
      s("daniel", "Daniel", 255, 470, look("#9b6247", "#4a2a1c", "#287044", "#263b2d", "curly"), "I was outside in the garden. I only came in to get a towel.", [
        q("d-garden", "Why were you outside?", "I was tending the garden. It started raining around 8:45."),
        q("d-denial", "Did you enter the library?", "No. I never went near the library tonight."),
      ]),
      s("sophia", "Sophia", 700, 465, look("#754631", "#171717", "#7250a6", "#32264e", "curly"), "I was reading in the library, but I left before the diamond disappeared.", [
        q("so-note", "Did you find anything?", "I found a note asking someone to meet in the library at 9 PM.", "d-note"),
        q("so-see", "Did you see anyone?", "I saw Daniel near the hallway just before nine. He seemed in a hurry."),
      ]),
    ],
  },

  {
    id: "painting",
    title: "The Stolen Painting",
    subtitle: "A gallery masterpiece disappears during a blackout.",
    room: "THE ART GALLERY",
    description:
      "The lights went out for two minutes. When they returned, the famous red-and-gold painting was gone.",
    culprit: "marcus",
    solution:
      "Marcus used his storage-room access to move the painting during the blackout. The camera record and matching paint fibers expose him.",
    required: ["p-camera", "p-access", "p-paint"],
    hints: [
      "The broken window might be a distraction.",
      "Noah was monitoring the security system when the lights went out.",
      "Ask Victoria who had access to the storage room.",
      "Find the camera evidence, access testimony, and matching paint evidence.",
    ],
    furniture: [
      f("painting", 70, 65, 125, 100, "Landscape painting"),
      f("painting", 360, 65, 125, 100, "Empty painting frame"),
      f("displaycase", 335, 250, 215, 100, "Art display"),
      f("sculpture", 700, 70, 90, 120, "Stone sculpture"),
      f("bench", 80, 395, 160, 55, "Gallery bench"),
      f("cabinet", 680, 375, 145, 85, "Storage cabinet"),
    ],
    clues: [
      c("p-window", "Cracked Window", "The window is cracked, but the damage may have happened before tonight.", 270, 190),
      c("p-fiber", "Red Paint Fiber", "A red paint fiber is caught on the edge of the empty painting frame.", 580, 440),
      c("p-glove", "Paint-Stained Glove", "A white glove with red paint on its fingertips lies near the bench.", 275, 470),
      c("p-camera", "Security Camera Evidence", "Noah found a camera frame showing someone entering the storage room during the blackout."),
      c("p-access", "Storage Room Access", "Victoria confirms Marcus had a key because he helped gallery staff move paintings."),
      c("p-paint", "Matching Pigment", "Lily says the pigment on a glove matches the red paint used in the stolen artwork."),
    ],
    suspects: [
      s("victoria", "Victoria", 265, 180, look("#d9a07e", "#161616", "#8e2945", "#482033", "bun"), "I was at the main entrance when the lights went out.", [
        q("v-access", "Who had storage-room access?", "Marcus did. He helped move paintings and had a key to the back room.", "p-access"),
        q("v-window", "Was the window already damaged?", "I noticed a crack earlier in the day."),
      ]),
      s("noah", "Noah", 600, 185, look("#a96846", "#242424", "#225e9e", "#1f3449"), "I was monitoring the security system. The cameras flickered when the power failed.", [
        q("n-camera", "Did the cameras catch anything?", "One camera showed somebody entering the storage room during the blackout.", "p-camera"),
        q("n-canvas", "Did you see anyone carrying something?", "A figure carried something long and flat toward the back hallway."),
      ]),
      s("marcus", "Marcus", 260, 470, look("#8e5a40", "#211b18", "#b45322", "#422b20", "curly"), "I was checking the lights. I never entered the storage room.", [
        q("m-access", "Did you use your storage key?", "No. I haven't been in there for weeks."),
        q("m-glove", "Have you handled the painting?", "I moved it once, long before today."),
      ]),
      s("lily", "Lily", 610, 470, look("#f3c6a8", "#c88a35", "#933c7b", "#46223d", "ponytail"), "I was looking at the sculptures when the gallery went dark.", [
        q("l-glove", "Did you notice any evidence?", "I spotted a white glove with red paint near the bench. The pigment matched the missing picture.", "p-paint"),
        q("l-person", "Did you see the thief?", "Only a silhouette heading toward the back hallway."),
      ]),
    ],
  },

  {
    id: "trophy",
    title: "The Vanishing Trophy",
    subtitle: "The championship trophy disappears before the school celebration.",
    room: "THE SPORTS HALL",
    description:
      "The trophy was in its case at 3 PM and gone before the celebration began.",
    culprit: "chloe",
    solution:
      "Chloe knew where the spare key was kept and was seen near the trophy room shortly before the celebration.",
    required: ["t-copy", "t-access", "t-sighting"],
    hints: [
      "Check the equipment area for physical clues.",
      "Ben manages equipment and knows about the keys.",
      "Ask Ben about the spare key, then ask Oliver what he saw.",
      "You need evidence of a copied key, equipment access, and the witness sighting.",
    ],
    furniture: [
      f("lockers", 65, 65, 190, 95, "Sports lockers"),
      f("bleachers", 340, 245, 225, 100, "Bleachers"),
      f("cabinet", 690, 65, 130, 95, "Equipment cupboard"),
      f("bench", 75, 390, 160, 55, "Team bench"),
      f("trophycase", 660, 350, 160, 105, "Trophy case"),
    ],
    clues: [
      c("t-key", "Spare Locker Key", "A key has been dropped near the equipment lockers.", 285, 190),
      c("t-shoe", "Dusty Shoeprint", "A dusty shoeprint leads from the equipment room toward the trophy case.", 450, 435),
      c("t-time", "Timing Note", "A note reads: '3:15 — trophy room empty.'", 590, 490),
      c("t-copy", "Copied Trophy Key", "Ben says someone made a duplicate of the trophy-room key without permission."),
      c("t-access", "Equipment Room Access", "Chloe was one of the few students who regularly helped in the equipment room."),
      c("t-sighting", "Witness Sighting", "Oliver saw Chloe near the trophy room shortly before the celebration."),
    ],
    suspects: [
      s("ava", "Ava", 270, 180, look("#e7b493", "#a44f2b", "#dc5d55", "#642b2c", "ponytail"), "I was helping set up the celebration. I never went near the trophy case.", [
        q("a-last", "When did you last see the trophy?", "It was still there just after 3 PM."),
        q("a-key", "Who knew about the spare key?", "The team managers and a few students who helped with equipment."),
      ]),
      s("ben", "Ben", 610, 180, look("#754631", "#171717", "#284e7d", "#1d2938"), "I was putting sports equipment away.", [
        q("b-key", "Was there a spare key?", "Someone appears to have made a copy of the trophy-room key.", "t-copy"),
        q("b-chloe", "Did anyone ask about the key?", "Chloe asked me yesterday where the spare key was kept.", "t-access"),
      ]),
      s("chloe", "Chloe", 260, 470, look("#c58b66", "#2e201c", "#29824f", "#1f4535", "curly"), "I was helping with equipment. I didn't take the trophy.", [
        q("c-time", "Where were you at 3:15?", "In the equipment room. I was sorting balls and cones."),
        q("c-key", "Did you know about the spare key?", "I might have heard something about it, but I didn't use it."),
      ]),
      s("oliver", "Oliver", 610, 470, look("#edc5a6", "#795138", "#8b5cf6", "#30234e"), "I was practicing on the court.", [
        q("o-sighting", "Did you see anyone near the trophy?", "I saw Chloe near the trophy room shortly before the celebration.", "t-sighting"),
        q("o-time", "What time was that?", "A little after 3 PM, just before everyone left to set up the hall."),
      ]),
    ],
  },

  {
    id: "lighthouse",
    title: "The Lighthouse Signal",
    subtitle: "A rare sapphire vanishes from a remote lighthouse.",
    room: "LIGHTHOUSE KEEPING ROOM",
    description:
      "The lighthouse beam went dark at 9:10 PM, and the keeper's sapphire vanished.",
    culprit: "felix",
    solution:
      "Felix used his repair access during the blackout. The machine-oil mark and lamp log contradict his story.",
    required: ["l-oil", "l-log", "l-key"],
    hints: [
      "Focus on who could access the lantern room during the blackout.",
      "Nora keeps track of keys, and Iris records lighthouse outages.",
      "Ask Iris about the lamp log and Nora about the spare key.",
      "Gather the oil mark, lamp log, and spare-key evidence.",
    ],
    furniture: [
      f("bookshelf", 65, 65, 175, 95, "Keeper's log shelves"),
      f("maptable", 335, 245, 225, 95, "Navigation chart table"),
      f("lantern", 690, 65, 120, 115, "Signal lantern"),
      f("crate", 75, 390, 135, 70, "Supply crate"),
      f("cabinet", 680, 370, 145, 80, "Tool cabinet"),
    ],
    clues: [
      c("l-mark", "Machine Oil Smudge", "A fresh black oil mark is smeared on the lantern-room hatch.", 275, 190),
      c("l-lens", "Blue Lens Chip", "A tiny chip from the signal lens lies near the chart table.", 600, 430),
      c("l-rope", "Wet Rope Fibers", "Wet rope fibers are scattered near the supply crate.", 270, 485),
      c("l-oil", "Machine Oil Evidence", "Iris smelled fresh machine oil near the hatch after the light came back on."),
      c("l-log", "Lamp Log Entry", "Iris's log records that the signal was manually switched off at 9:10 PM."),
      c("l-key", "Spare Lantern Key", "Nora confirms Felix borrowed the spare lantern-room key earlier that evening."),
    ],
    suspects: [
      s("nora", "Captain Nora", 265, 180, look("#754631", "#171717", "#254a77", "#1c2c44", "bun"), "I was checking the storm warnings. The lighthouse should never have gone dark.", [
        q("n-key", "Who had the spare key?", "Felix borrowed the spare lantern-room key to check a loose hinge.", "l-key"),
        q("n-storm", "Was the storm dangerous?", "The weather was rough, but the signal should have stayed on."),
      ]),
      s("felix", "Felix", 610, 185, look("#efc2a0", "#9a4d2e", "#78543a", "#38322b", "curly"), "I was fixing a hinge. I didn't touch the sapphire or the lantern controls.", [
        q("f-hinge", "Did you enter the lantern room?", "Only for a second. I certainly didn't turn the signal off."),
        q("f-oil", "Why is there oil near the hatch?", "The entire lighthouse is full of machinery. Oil could be from anyone."),
      ]),
      s("iris", "Iris", 265, 470, look("#c98f6d", "#4c3026", "#287b79", "#204b52", "long"), "I maintain the lighthouse logs. The signal stopped very suddenly.", [
        q("i-log", "What did the log say?", "The lamp was manually switched off at 9:10 PM.", "l-log"),
        q("i-oil", "Did you notice anything else?", "I smelled fresh machine oil near the hatch.", "l-oil"),
      ]),
      s("leo", "Leo", 610, 470, look("#d7a078", "#473021", "#be8d26", "#58451d"), "I was visiting to photograph the storm.", [
        q("leo-see", "Did you see anyone?", "I saw someone leave the lantern platform carrying a small wrapped object."),
        q("leo-time", "When was that?", "Around 9:10, when the beam disappeared."),
      ]),
    ],
  },

  {
    id: "train",
    title: "The Last Train",
    subtitle: "A royal briefcase disappears aboard the midnight express.",
    room: "THE MIDNIGHT EXPRESS",
    description:
      "A sealed briefcase vanished from a private carriage moments before the train reached its next station.",
    culprit: "theo",
    solution:
      "Theo used the service key and trolley to move the case. June saw him moving luggage shortly before the doors were locked.",
    required: ["tr-key", "tr-dust", "tr-time"],
    hints: [
      "Think about who can move luggage without attracting attention.",
      "Elise controls the service keys. June watched the carriage near midnight.",
      "Inspect the trolley and ask Elise and June what they noticed.",
      "You need service-key evidence, platform dust, and June's sighting.",
    ],
    furniture: [
      f("trainseat", 70, 80, 160, 110, "Passenger seats"),
      f("table", 355, 250, 180, 80, "Carriage table"),
      f("luggage", 680, 80, 125, 100, "Suitcase rack"),
      f("trolley", 80, 390, 145, 80, "Luggage trolley"),
      f("trainseat", 665, 365, 155, 105, "Rear seats"),
    ],
    clues: [
      c("tr-platform", "Platform Dust", "Grey platform dust clings to the trolley wheels near the service door.", 450, 430),
      c("tr-ticket", "Ticket Stub", "A ticket stub for a station the train hasn't reached lies under a seat.", 285, 490),
      c("tr-fiber", "Red Fabric Fiber", "A red fiber is caught on the corner of the empty luggage rack.", 600, 490),
      c("tr-key", "Service Door Key", "Elise says Theo signed out the service key shortly before the briefcase disappeared."),
      c("tr-dust", "Trolley Evidence", "June noticed the trolley had fresh platform dust on its wheels after Theo moved it."),
      c("tr-time", "Late-Night Sighting", "June saw Theo pushing a trolley with a large case at 11:40 PM."),
    ],
    suspects: [
      s("elise", "Elise", 265, 180, look("#f0c8ad", "#a8a29e", "#264d76", "#253449", "bun"), "I'm the conductor. The briefcase was secure at the start of my inspection.", [
        q("elise-key", "Who used the service key?", "Theo signed it out shortly before the briefcase went missing.", "tr-key"),
        q("elise-stop", "Could someone leave the train?", "Not between stations. The service door leads to the luggage area."),
      ]),
      s("theo", "Theo", 590, 180, look("#80523b", "#181818", "#9f3030", "#302c2b"), "I was helping passengers with their bags. I didn't touch the royal briefcase.", [
        q("theo-key", "Did you use the service key?", "I use keys all the time. I can't remember exactly when I had it."),
        q("theo-cart", "Where did you take the trolley?", "Just between the passenger seats and the pantry."),
      ]),
      s("ravi", "Ravi", 265, 470, look("#a76a47", "#201915", "#e7e5e4", "#374151"), "I was in the pantry preparing tea. I heard wheels rattling past my door.", [
        q("ravi-cart", "What did you hear?", "The luggage trolley rattled past the pantry, then it was gone for several minutes."),
        q("ravi-person", "Did you see who pushed it?", "I caught a glimpse of a red uniform moving toward the service door."),
      ]),
      s("june", "June", 590, 470, look("#edc4a7", "#593b2e", "#c59b28", "#4a411e", "long"), "I was reading by the window. I noticed the porter hurrying around near midnight.", [
        q("june-time", "What did you see at 11:40?", "Theo was pushing a trolley with a large case toward the service end.", "tr-time"),
        q("june-dust", "Was anything on the floor?", "There was grey dust near the service door, like platform dust.", "tr-dust"),
      ]),
    ],
  },

  {
    id: "orchid",
    title: "The Vanishing Orchid",
    subtitle: "A rare moon orchid disappears from a locked greenhouse.",
    room: "THE GLASS GREENHOUSE",
    description:
      "The moon orchid was seen at 8 PM. By morning, its pot was empty and the side door had been disturbed.",
    culprit: "mia",
    solution:
      "Mia removed the orchid while assigned to that section. The watering log, blue fiber, and side-door testimony link her to the theft.",
    required: ["g-log", "g-fiber", "g-door"],
    hints: [
      "Look near the empty orchid stand and the greenhouse side door.",
      "Dr. Vale maintains the watering log. Omar works near the side door.",
      "Ask Ava about the fiber she found near the empty stand.",
      "Gather the watering log, blue fiber, and side-door evidence.",
    ],
    furniture: [
      f("greenhouse", 335, 245, 230, 95, "Plant table"),
      f("glasscase", 675, 65, 125, 115, "Orchid display"),
      f("plant", 80, 70, 100, 115, "Tropical plant"),
      f("plant", 215, 375, 100, 115, "Fern"),
      f("plant", 690, 380, 100, 105, "Palm"),
      f("bench", 370, 400, 155, 55, "Garden bench"),
    ],
    clues: [
      c("g-soil", "Fresh Soil", "Fresh soil forms a trail leading away from the empty orchid stand.", 285, 195),
      c("g-pot", "Empty Orchid Pot", "The pot is intact, so the rare plant was carefully removed.", 605, 455),
      c("g-glass", "Disturbed Side Pane", "The side pane has fingerprints but no broken glass.", 275, 490),
      c("g-log", "Watering Log", "Dr. Vale's log shows that Mia was assigned to the orchid section at 8:30 PM."),
      c("g-fiber", "Blue Fabric Fiber", "A blue fiber was caught on the orchid stand. Mia wore a blue gardening jacket."),
      c("g-door", "Side Door Sighting", "Omar heard the greenhouse side door open just after 8:30 PM."),
    ],
    suspects: [
      s("vale", "Dr. Vale", 270, 180, look("#e8c7b0", "#9ca3af", "#d8f0eb", "#385a56", "bun"), "I'm responsible for the orchid collection. It was healthy at my last check.", [
        q("vale-log", "Who checked the orchid at 8:30?", "Mia was assigned to that section at 8:30 PM.", "g-log"),
        q("vale-value", "Why is the orchid important?", "It's extremely rare and valuable to private collectors."),
      ]),
      s("omar", "Omar", 610, 180, look("#69442f", "#151515", "#39714a", "#274632", "curly"), "I was tending tropical plants. I didn't go near the moon orchid.", [
        q("omar-door", "Did you hear anything?", "I heard the side door open shortly after 8:30.", "g-door"),
        q("omar-soil", "Was the soil disturbed?", "There was fresh soil leading away from the orchid stand."),
      ]),
      s("mia", "Mia", 265, 470, look("#d8a17e", "#29201c", "#2563a6", "#263b53", "long"), "I was doing routine plant care. I didn't remove anything.", [
        q("mia-time", "Were you in the orchid section?", "Only earlier in the day. I finished before dinner."),
        q("mia-pane", "Did you notice the side pane?", "No, I didn't notice anything wrong with the glass."),
      ]),
      s("ava", "Ava", 610, 470, look("#be805d", "#d5ad72", "#7954a5", "#3f2d56", "ponytail"), "I was photographing the plants for the greenhouse website.", [
        q("ava-fiber", "Did you find anything?", "A blue fiber was caught on the empty stand. Mia wore a blue gardening jacket.", "g-fiber"),
        q("ava-photo", "Do you have a photo from that night?", "My last photo was taken just before 8 PM. The orchid was still there."),
      ]),
    ],
  },
];

/* -------------------- GAME HELPERS -------------------- */

const W = 900;
const H = 600;
const PW = 34;
const PH = 46;
const SPEED = 6;
const NEAR = 70;

type Position = {
  x: number;
  y: number;
  dx: number;
  dy: number;
  steps: number;
};

function makePositions(suspects: Suspect[]): Record<string, Position> {
  return Object.fromEntries(
    suspects.map((p, i) => [
      p.id,
      {
        x: p.x,
        y: p.y,
        dx: i % 2 ? -1 : 1,
        dy: 0,
        steps: 15 + i * 4,
      },
    ])
  );
}

function distance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
) {
  return Math.hypot(x1 - x2, y1 - y2);
}

function canStand(x: number, y: number, furniture: Furniture[]) {
  if (
    x < 12 ||
    y < 15 ||
    x > W - PW - 12 ||
    y > H - PH - 12
  ) {
    return false;
  }

  return !furniture.some(
    (item) =>
      x + PW > item.x + 2 &&
      x < item.x + item.w - 2 &&
      y + PH > item.y + 2 &&
      y < item.y + item.h - 2
  );
}

/* -------------------- FURNITURE ART -------------------- */

function FurnitureArt({ item }: { item: Furniture }) {
  const style: CSSProperties = {
    left: item.x,
    top: item.y,
    width: item.w,
    height: item.h,
  };

  return (
    <div
      className={`furniture ${item.kind}`}
      style={style}
      title={item.label}
      aria-label={item.label}
    >
      {item.kind === "bookshelf" && (
        <div className="books">
          {[0, 1, 2].map((row) => (
            <div className="book-row" key={row}>
              {Array.from({ length: 8 }, (_, i) => (
                <i
                  key={i}
                  style={{
                    height: `${16 + ((i * 7 + row * 3) % 13)}px`,
                    background: [
                      "#ad5142",
                      "#d4aa56",
                      "#416b61",
                      "#394c78",
                      "#79538b",
                      "#decda9",
                    ][(i + row) % 6],
                  }}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {["table", "desk", "maptable", "greenhouse"].includes(item.kind) && (
        <>
          <div className="table-leg left-leg" />
          <div className="table-leg right-leg" />
          <div className="table-surface" />
          <div className="drawer" />
          {item.kind === "maptable" && <div className="map-paper" />}
          {item.kind === "greenhouse" && (
            <div className="mini-plants"><i /><i /><i /><i /></div>
          )}
          {item.kind === "desk" && <div className="desk-lamp" />}
        </>
      )}

      {item.kind === "sofa" && (
        <>
          <div className="sofa-back" />
          <div className="sofa-seat" />
          <div className="sofa-arm sofa-arm-left" />
          <div className="sofa-arm sofa-arm-right" />
          <div className="sofa-cushion cushion-left" />
          <div className="sofa-cushion cushion-right" />
        </>
      )}

      {item.kind === "cabinet" && (
        <>
          <div className="cabinet-top" />
          <div className="cabinet-door cabinet-left"><i /></div>
          <div className="cabinet-door cabinet-right"><i /></div>
          <div className="cabinet-feet" />
        </>
      )}

      {item.kind === "painting" && (
        <>
          <div className="picture-frame" />
          <div className="picture">
            <i className="picture-sun" />
            <i className="picture-hill hill-a" />
            <i className="picture-hill hill-b" />
          </div>
        </>
      )}

      {item.kind === "displaycase" && (
        <>
          <div className="glass-top" />
          <div className="glass-pane" />
          <div className="glass-shelf" />
          <div className="art-statue" />
          <div className="glass-base" />
        </>
      )}

      {item.kind === "bench" && (
        <>
          <div className="bench-back" />
          <div className="bench-seat" />
          <div className="bench-leg bench-leg-left" />
          <div className="bench-leg bench-leg-right" />
        </>
      )}

      {item.kind === "sculpture" && (
        <>
          <div className="statue-base" />
          <div className="statue-body" />
          <div className="statue-head" />
          <div className="statue-arm" />
        </>
      )}

      {item.kind === "lockers" && (
        <div className="locker-row">
          {[0, 1, 2, 3].map((n) => (
            <i key={n}><b /></i>
          ))}
        </div>
      )}

      {item.kind === "bleachers" && (
        <div className="bleacher-rows"><i /><i /><i /></div>
      )}

      {item.kind === "trophycase" && (
        <>
          <div className="trophy-glass" />
          <div className="little-trophy trophy-one"><i /></div>
          <div className="little-trophy trophy-two"><i /></div>
          <div className="trophy-base" />
        </>
      )}

      {item.kind === "lantern" && (
        <>
          <div className="lantern-glow" />
          <div className="lantern-top" />
          <div className="lantern-glass" />
          <div className="lantern-base" />
          <div className="lantern-handle" />
        </>
      )}

      {item.kind === "crate" && (
        <>
          <div className="crate-plank" />
          <div className="crate-cross" />
          <div className="crate-cross second-cross" />
        </>
      )}

      {item.kind === "trainseat" && (
        <>
          <div className="seat-back" />
          <div className="seat-pad" />
          <div className="seat-arm seat-arm-left" />
          <div className="seat-arm seat-arm-right" />
          <div className="seat-foot" />
        </>
      )}

      {item.kind === "luggage" && (
        <>
          <div className="rack-bar" />
          <div className="suitcase suitcase-one" />
          <div className="suitcase suitcase-two" />
          <div className="suitcase-handle" />
        </>
      )}

      {item.kind === "trolley" && (
        <>
          <div className="trolley-box" />
          <div className="trolley-handle" />
          <div className="trolley-wheel wheel-left" />
          <div className="trolley-wheel wheel-right" />
          <div className="trolley-bag" />
        </>
      )}

      {item.kind === "glasscase" && (
        <>
          <div className="orchid-glass" />
          <div className="orchid-stem" />
          <div className="orchid-flower" />
          <div className="orchid-pot" />
        </>
      )}

      {item.kind === "plant" && (
        <>
          <div className="plant-stem stem-a" />
          <div className="plant-stem stem-b" />
          <div className="plant-leaf leaf-a" />
          <div className="plant-leaf leaf-b" />
          <div className="plant-leaf leaf-c" />
          <div className="plant-pot" />
        </>
      )}
    </div>
  );
}

/* -------------------- CHARACTER ART -------------------- */

function PersonSprite({
  appearance,
  x,
  y,
  name,
  player = false,
  facingLeft = false,
}: {
  appearance: Look;
  x: number;
  y: number;
  name?: string;
  player?: boolean;
  facingLeft?: boolean;
}) {
  const style = {
    left: x,
    top: y,
    "--skin": appearance.skin,
    "--hair": appearance.hair,
    "--shirt": appearance.clothes,
    "--pants": appearance.pants,
  } as CSSProperties;

  return (
    <div
      className={`person ${player ? "player" : "npc"}`}
      style={style}
    >
      <div
        className={`sprite ${appearance.style}`}
        style={{ transform: facingLeft ? "scaleX(-1)" : undefined }}
      >
        <div className={`hair hair-${appearance.style}`} />
        <div className="face">
          <i className="eye eye-left" />
          <i className="eye eye-right" />
          <i className="mouth" />
        </div>
        <div className="neck" />
        <div className="arm arm-left" />
        <div className="arm arm-right" />
        <div className="torso" />
        <div className="leg leg-left" />
        <div className="leg leg-right" />
        <div className="shoe shoe-left" />
        <div className="shoe shoe-right" />
      </div>
      {!player && <div className="person-name">{name}</div>}
    </div>
  );
}

/* -------------------- MAIN GAME -------------------- */

export default function Home() {
  const [caseId, setCaseId] = useState("diamond");
  const mystery = mysteries.find((item) => item.id === caseId) ?? mysteries[0];

  const [player, setPlayer] = useState({
    x: 430,
    y: 510,
    facing: "right" as "left" | "right",
  });

  const playerRef = useRef(player);
  playerRef.current = player;

  const [positions, setPositions] = useState<Record<string, Position>>(
    () => makePositions(mysteries[0].suspects)
  );

  const [inventory, setInventory] = useState<Clue[]>([]);
  const [message, setMessage] = useState("Explore the room, find clues, and question the suspects.");
  const [activeSuspect, setActiveSuspect] = useState<Suspect | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [unlockedClueName, setUnlockedClueName] = useState<string | null>(null);
  const [answered, setAnswered] = useState<string[]>([]);
  const [showAccusation, setShowAccusation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [showCases, setShowCases] = useState(false);
  const [won, setWon] = useState(false);

  function startCase(id: string) {
    const selected = mysteries.find((item) => item.id === id) ?? mysteries[0];

    setCaseId(selected.id);
    setPlayer({ x: 430, y: 510, facing: "right" });
    setPositions(makePositions(selected.suspects));
    setInventory([]);
    setMessage("New case opened. Search the room and question the suspects.");
    setActiveSuspect(null);
    setShowQuestions(false);
    setAnswer(null);
    setUnlockedClueName(null);
    setAnswered([]);
    setShowAccusation(false);
    setShowHint(false);
    setHintIndex(0);
    setWon(false);
    setShowCases(false);
  }

  const interact = useCallback(() => {
    const nearby = mystery.suspects.find((person) => {
      const pos = positions[person.id] ?? { x: person.x, y: person.y };
      return distance(
        player.x + PW / 2,
        player.y + PH / 2,
        pos.x + PW / 2,
        pos.y + PH / 2
      ) < NEAR;
    });

    if (nearby) {
      setActiveSuspect(nearby);
      setShowQuestions(false);
      setAnswer(null);
      setUnlockedClueName(null);
      setMessage(`You are talking to ${nearby.name}.`);
      return;
    }

    const clue = mystery.clues.find((item) =>
      item.x !== undefined &&
      item.y !== undefined &&
      !inventory.some((known) => known.id === item.id) &&
      distance(
        player.x + PW / 2,
        player.y + PH / 2,
        item.x + 12,
        item.y + 12
      ) < NEAR
    );

    if (clue) {
      setInventory((items) => [...items, clue]);
      setMessage(`Evidence collected: ${clue.name}`);
      return;
    }

    setMessage("Nothing nearby. Look for glowing clues or walk closer to a suspect.");
  }, [mystery, player, positions, inventory]);

  // Make every suspect wander around, turn, and avoid furniture.
  useEffect(() => {
    if (activeSuspect || won || showAccusation || showHint || showCases) return;

    const directions = [
      { dx: 1, dy: 0 },
      { dx: -1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: 0, dy: -1 },
    ];

    const timer = window.setInterval(() => {
      setPositions((old) => {
        const updated = { ...old };

        for (const person of mystery.suspects) {
          const current = old[person.id] ?? {
            x: person.x,
            y: person.y,
            dx: 1,
            dy: 0,
            steps: 15,
          };

          let dx = current.dx;
          let dy = current.dy;
          let steps = current.steps - 1;

          if (steps <= 0 || Math.random() < 0.035) {
            const next = directions[Math.floor(Math.random() * directions.length)];
            dx = next.dx;
            dy = next.dy;
            steps = 10 + Math.floor(Math.random() * 24);
          }

          let nx = current.x + dx * 2;
          let ny = current.y + dy * 2;

          const tooClose = distance(
            nx + PW / 2,
            ny + PH / 2,
            playerRef.current.x + PW / 2,
            playerRef.current.y + PH / 2
          ) < 42;

          if (!canStand(nx, ny, mystery.furniture) || tooClose) {
            const options = directions.filter((dir) => {
              const tx = current.x + dir.dx * 2;
              const ty = current.y + dir.dy * 2;
              return canStand(tx, ty, mystery.furniture) &&
                distance(
                  tx + PW / 2,
                  ty + PH / 2,
                  playerRef.current.x + PW / 2,
                  playerRef.current.y + PH / 2
                ) >= 42;
            });

            if (options.length) {
              const next = options[Math.floor(Math.random() * options.length)];
              dx = next.dx;
              dy = next.dy;
              nx = current.x + dx * 2;
              ny = current.y + dy * 2;
              steps = 12;
            } else {
              nx = current.x;
              ny = current.y;
            }
          }

          updated[person.id] = { x: nx, y: ny, dx, dy, steps };
        }

        return updated;
      });
    }, 110);

    return () => window.clearInterval(timer);
  }, [mystery, activeSuspect, won, showAccusation, showHint, showCases]);

  // Movement and interaction keys.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.toLowerCase();

      if (key === "escape") {
        if (activeSuspect) {
          setActiveSuspect(null);
          setShowQuestions(false);
          setAnswer(null);
        } else if (showHint) setShowHint(false);
        else if (showAccusation) setShowAccusation(false);
        else if (showCases) setShowCases(false);
        return;
      }

      if (activeSuspect || showHint || showAccusation || won || showCases) return;

      if (key === "e" || key === " ") {
        event.preventDefault();
        interact();
        return;
      }

      let xChange = 0;
      let yChange = 0;

      if (key === "w" || key === "arrowup") yChange = -SPEED;
      if (key === "s" || key === "arrowdown") yChange = SPEED;
      if (key === "a" || key === "arrowleft") xChange = -SPEED;
      if (key === "d" || key === "arrowright") xChange = SPEED;

      if (!xChange && !yChange) return;
      event.preventDefault();

      setPlayer((current) => {
        const x = current.x + xChange;
        const y = current.y + yChange;

        if (!canStand(x, y, mystery.furniture)) return current;

        return {
          x,
          y,
          facing: xChange < 0 ? "left" : xChange > 0 ? "right" : current.facing,
        };
      });
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    interact,
    mystery,
    activeSuspect,
    showHint,
    showAccusation,
    showCases,
    won,
  ]);

  function askQuestion(question: Question) {
    setAnswer(question.answer);
    setUnlockedClueName(null);

    const key = `${activeSuspect?.id}:${question.id}`;
    setAnswered((items) => items.includes(key) ? items : [...items, key]);

    if (question.clueId) {
      const clue = mystery.clues.find((item) => item.id === question.clueId);

      if (clue && !inventory.some((item) => item.id === clue.id)) {
        setInventory((items) => [...items, clue]);
        setUnlockedClueName(clue.name);
      } else if (clue) {
        setUnlockedClueName("Already in your evidence folder");
      }
    }
  }

  function accuse(suspectId: string) {
    const hasEvidence = mystery.required.every((id) =>
      inventory.some((item) => item.id === id)
    );

    setShowAccusation(false);

    if (suspectId === mystery.culprit && hasEvidence) {
      setWon(true);
    } else if (suspectId === mystery.culprit) {
      setMessage("You suspect the right person, but your case is incomplete. Find the key evidence first.");
    } else {
      setMessage("That accusation doesn't fit all the evidence. Keep investigating.");
    }
  }

  function nearbyPrompt() {
    const person = mystery.suspects.find((suspect) => {
      const pos = positions[suspect.id] ?? { x: suspect.x, y: suspect.y };
      return distance(
        player.x + PW / 2, player.y + PH / 2,
        pos.x + PW / 2, pos.y + PH / 2
      ) < NEAR;
    });

    if (person) return `E — Talk to ${person.name}`;

    const clue = mystery.clues.find((item) =>
      item.x !== undefined &&
      item.y !== undefined &&
      !inventory.some((known) => known.id === item.id) &&
      distance(
        player.x + PW / 2, player.y + PH / 2,
        item.x + 12, item.y + 12
      ) < NEAR
    );

    if (clue) return `E — Examine ${clue.name}`;
    return "WASD / arrows to move · E to interact";
  }

  if (showCases) {
    return (
      <main className="case-page">
        <div className="case-selection">
          <p className="eyebrow">THE DETECTIVE AGENCY</p>
          <h1>Choose Your Next Case</h1>
          <p className="selection-subtitle">Six mysteries. Dozens of clues. One very observant detective.</p>

          <div className="case-grid">
            {mysteries.map((item, index) => (
              <button
                key={item.id}
                className={`case-card card-${item.id}`}
                onClick={() => startCase(item.id)}
              >
                <div className="case-art">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <i />
                </div>
                <small>CASE FILE {String(index + 1).padStart(2, "0")}</small>
                <h2>{item.title}</h2>
                <p>{item.subtitle}</p>
                <div className="case-footer">
                  <span>{item.suspects.length} suspects</span>
                  <span>Open case →</span>
                </div>
              </button>
            ))}
          </div>

          <button className="secondary-button" onClick={() => setShowCases(false)}>
            Back to current case
          </button>
        </div>
        <style jsx global>{STYLES}</style>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="game-container">
        <header className="header">
          <div className="title-block">
            <p className="case-label">PRIVATE INVESTIGATION · CASE FILE</p>
            <h1>{mystery.title}</h1>
            <p>{mystery.description}</p>
          </div>

          <div className="header-buttons">
            <button className="hint-button" onClick={() => { setHintIndex(0); setShowHint(true); }}>
              Hint
            </button>
            <button className="change-button" onClick={() => setShowCases(true)}>
              All Cases
            </button>
            <button className="accuse-button" onClick={() => setShowAccusation(true)}>
              Make Accusation
            </button>
          </div>
        </header>

        <div className="game-layout">
          <section className="game-section">
            <div className="room-scroll">
              <div className={`room theme-${mystery.id}`}>
                <div className="room-wall-sign">{mystery.room}</div>
                <div className="room-window window-left" />
                <div className="room-window window-right" />

                {mystery.furniture.map((item, i) => (
                  <FurnitureArt item={item} key={`${item.kind}-${i}`} />
                ))}

                {mystery.clues.filter((item) =>
                  item.x !== undefined &&
                  item.y !== undefined &&
                  !inventory.some((known) => known.id === item.id)
                ).map((item) => (
                  <div
                    key={item.id}
                    className="clue-marker"
                    style={{ left: item.x, top: item.y }}
                    title={item.name}
                  >
                    <i />
                  </div>
                ))}

                {mystery.suspects.map((person) => {
                  const pos = positions[person.id] ?? {
                    x: person.x,
                    y: person.y,
                    dx: 1,
                    dy: 0,
                    steps: 10,
                  };

                  return (
                    <PersonSprite
                      key={person.id}
                      name={person.name}
                      appearance={person.look}
                      x={pos.x}
                      y={pos.y}
                      facingLeft={pos.dx < 0}
                    />
                  );
                })}

                <PersonSprite
                  appearance={look("#e8b995", "#30241e", "#3465a4", "#24344a")}
                  x={player.x}
                  y={player.y}
                  player
                  facingLeft={player.facing === "left"}
                />

                <div className="interaction-prompt">
                  {nearbyPrompt()}
                  <span>ESC · Close dialog</span>
                </div>
              </div>
            </div>

            <div className="message-box">
              <span className="message-dot" />
              {message}
            </div>

            <div className="control-bar">
              <span><b>W A S D</b> or arrows <small>MOVE</small></span>
              <span><b>E</b> <small>INTERACT</small></span>
              <span><b>HINT</b> <small>GET HELP</small></span>
            </div>
          </section>

          <aside className="sidebar">
            <div className="sidebar-title">
              <div>
                <p className="mini-label">CASE NOTES</p>
                <h2>Evidence Board</h2>
              </div>
              <span className="clue-count">{inventory.length}</span>
            </div>

            <div className="evidence-list">
              {inventory.length === 0 ? (
                <div className="empty-evidence">
                  <div className="empty-icon">+</div>
                  <p>No evidence collected yet.</p>
                  <span>Look for glowing clues or question the suspects.</span>
                </div>
              ) : inventory.map((item) => (
                <article className="evidence-card" key={item.id}>
                  <div className="evidence-pin" />
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>

            <div className="case-status">
              <div className="status-row">
                <h3>Investigation progress</h3>
                <span>{inventory.length}/{mystery.clues.length}</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{
                    width: `${Math.min(inventory.length / mystery.clues.length * 100, 100)}%`,
                  }}
                />
              </div>
              <p>Talk to everyone. Compare their stories.</p>
            </div>

            <button className="sidebar-hint" onClick={() => { setHintIndex(0); setShowHint(true); }}>
              I'm stuck — give me a hint
            </button>
          </aside>
        </div>
      </div>

      {activeSuspect && (
        <div className="modal-overlay">
          <div className="suspect-modal">
            <button
              className="modal-x"
              onClick={() => { setActiveSuspect(null); setShowQuestions(false); setAnswer(null); }}
            >
              ×
            </button>

            <div className="suspect-modal-top">
              <div
                className="modal-person"
                style={{ background: activeSuspect.look.clothes }}
              >
                {activeSuspect.name.slice(0, 1)}
              </div>
              <div>
                <p className="mini-label">PERSON OF INTEREST</p>
                <h2>{activeSuspect.name}</h2>
                <p className="suspect-intro">{activeSuspect.introduction}</p>
              </div>
            </div>

            {!showQuestions ? (
              <div className="conversation-start">
                <p>They pause and look at you, waiting for your questions.</p>
                <button className="primary-button" onClick={() => setShowQuestions(true)}>
                  Ask Questions <span>→</span>
                </button>
              </div>
            ) : (
              <div className="question-area">
                {!answer ? (
                  <>
                    <p className="modal-section-label">WHAT WOULD YOU LIKE TO ASK?</p>
                    <div className="question-list">
                      {activeSuspect.questions.map((question) => {
                        const wasAsked = answered.includes(`${activeSuspect.id}:${question.id}`);

                        return (
                          <button
                            key={question.id}
                            className={`question-button ${wasAsked ? "asked" : ""}`}
                            onClick={() => askQuestion(question)}
                          >
                            <span className="question-mark">?</span>
                            {question.text}
                            {wasAsked && <span className="question-check">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      className="secondary-button"
                      onClick={() => { setActiveSuspect(null); setShowQuestions(false); }}
                    >
                      Finish conversation
                    </button>
                  </>
                ) : (
                  <div className="answer-area">
                    <blockquote>{answer}</blockquote>

                    {unlockedClueName && (
                      <div className="evidence-unlocked">
                        <span>EVIDENCE UPDATED</span>
                        <b>{unlockedClueName}</b>
                        <p>Added to your evidence board.</p>
                      </div>
                    )}

                    <button className="primary-button" onClick={() => { setAnswer(null); setUnlockedClueName(null); }}>
                      Ask another question
                    </button>
                    <button
                      className="secondary-button"
                      onClick={() => { setActiveSuspect(null); setShowQuestions(false); setAnswer(null); }}
                    >
                      Finish
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {showHint && (
        <div className="modal-overlay">
          <div className="hint-modal">
            <div className="hint-bulb">?</div>
            <p className="mini-label">DETECTIVE ASSISTANCE</p>
            <h2>Need a little help?</h2>
            <div className="hint-card">
              <span>HINT {hintIndex + 1} OF {mystery.hints.length}</span>
              <p>{mystery.hints[hintIndex]}</p>
            </div>
            <div className="hint-actions">
              {hintIndex < mystery.hints.length - 1 && (
                <button className="primary-button" onClick={() => setHintIndex((i) => i + 1)}>
                  Another hint
                </button>
              )}
              <button className="secondary-button" onClick={() => setShowHint(false)}>
                Back to game
              </button>
            </div>
          </div>
        </div>
      )}

      {showAccusation && (
        <div className="modal-overlay">
          <div className="accusation-modal">
            <p className="mini-label">FINAL DECISION</p>
            <h2>Who is responsible?</h2>
            <p className="accusation-copy">
              Choose the suspect you believe is responsible. You need all the important evidence to solve the case.
            </p>

            <div className="accusation-list">
              {mystery.suspects.map((person) => (
                <button key={person.id} onClick={() => accuse(person.id)}>
                  <span
                    className="suspect-dot"
                    style={{ background: person.look.clothes }}
                  />
                  {person.name}
                  <span>→</span>
                </button>
              ))}
            </div>

            <button className="secondary-button" onClick={() => setShowAccusation(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {won && (
        <div className="modal-overlay">
          <div className="win-modal">
            <div className="win-stamp">CASE SOLVED</div>
            <p className="mini-label">EXCELLENT DETECTIVE WORK</p>
            <h2>{mystery.title}</h2>
            <p>{mystery.solution}</p>
            <div className="win-buttons">
              <button className="primary-button" onClick={() => startCase(mystery.id)}>
                Play this case again
              </button>
              <button className="secondary-button" onClick={() => { setWon(false); setShowCases(true); }}>
                Choose another case
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{STYLES}</style>
    </main>
  );
}

/* -------------------- GAME STYLES -------------------- */

const STYLES = `
*{box-sizing:border-box}
body{margin:0;background:#111a25;color:#f5f0e6;font-family:Arial,Helvetica,sans-serif}
button{font-family:inherit}
.page{min-height:100vh;padding:25px;background:radial-gradient(circle at top,#35465b,#111a25 65%)}
.game-container{max-width:1250px;margin:auto}
.header{display:flex;align-items:center;justify-content:space-between;gap:22px;margin-bottom:22px}
.case-label,.mini-label{margin:0 0 7px;color:#d8b777;font-size:10px;font-weight:900;letter-spacing:2px}
.title-block h1{margin:0 0 7px;font:700 34px Georgia,serif;color:#f3e6ce}
.title-block>p:last-child{max-width:650px;color:#aeb9c6;font-size:13px;line-height:1.5}
.header-buttons{display:flex;gap:8px;flex-wrap:wrap}
.header-buttons button,.sidebar-hint{padding:11px 14px;border:1px solid transparent;border-radius:6px;font-size:12px;font-weight:800;cursor:pointer}
.hint-button{background:#e5c57f;color:#312717}
.change-button{background:#293849;color:#f4e8d1;border-color:#455669!important}
.accuse-button{background:#923c3c;color:#fff4e6}
.hint-button:hover{background:#f1d89b}.change-button:hover{background:#36495e}.accuse-button:hover{background:#ac4b49}
.game-layout{display:grid;grid-template-columns:minmax(0,1fr) 285px;gap:19px}
.game-section{min-width:0}
.room-scroll{width:100%;overflow-x:auto;padding-bottom:4px}
.room{position:relative;width:900px;height:600px;overflow:hidden;border:10px solid #6b503a;border-radius:8px;background-color:#bd9d73;background-image:linear-gradient(90deg,#00000008 1px,transparent 1px),linear-gradient(#00000008 1px,transparent 1px),repeating-linear-gradient(0deg,#d1b38a 0 68px,#c8a980 68px 70px);background-size:35px 35px,35px 35px,100% 70px;box-shadow:0 22px 40px #0004,inset 0 0 0 3px #967654}
.room:before{content:"";position:absolute;inset:0;pointer-events:none;border:9px solid #fff1;z-index:2}
.theme-painting{background-color:#8b8172;background-image:linear-gradient(90deg,#ffffff08 1px,transparent 1px),repeating-linear-gradient(0deg,#b2a591 0 68px,#a99a83 68px 70px)}
.theme-trophy{background-color:#8a9b86;background-image:repeating-linear-gradient(0deg,#a4b19b 0 68px,#8f9e87 68px 70px)}
.theme-lighthouse{background-color:#8d9ca8;background-image:repeating-linear-gradient(0deg,#acb8c0 0 68px,#99a9b5 68px 70px)}
.theme-train{background-color:#82675d;background-image:repeating-linear-gradient(0deg,#a68c7b 0 68px,#927666 68px 70px)}
.theme-orchid{background-color:#8bac83;background-image:repeating-linear-gradient(0deg,#b5c69b 0 68px,#a6bb8f 68px 70px)}
.room-wall-sign{position:absolute;z-index:25;top:12px;left:50%;transform:translateX(-50%);padding:8px 14px;border:1px solid #eed6a477;border-radius:4px;background:#192431eF;color:#e7d2a9;font-size:10px;font-weight:900;letter-spacing:2px;white-space:nowrap}
.room-window{position:absolute;top:0;width:110px;height:36px;background:linear-gradient(135deg,#8ab6ce,#dce9e3 48%,#739bb2);border:6px solid #604834;box-shadow:inset 0 0 0 2px #e9d7b4;z-index:1}
.window-left{left:280px}.window-right{right:270px}
.furniture{position:absolute;z-index:5}
.books{position:absolute;inset:0;border:7px solid #4b3021;background:#765034;box-shadow:inset 0 0 0 3px #9a6d45;display:flex;flex-direction:column;justify-content:space-around;padding:3px}
.book-row{height:28%;display:flex;align-items:flex-end;gap:2px;border-bottom:5px solid #4b3021;padding:0 2px}
.book-row i{flex:1;min-width:0;border-radius:2px 2px 0 0;box-shadow:inset 2px 0 #ffffff27,inset -2px 0 #0002}
.table-leg{position:absolute;top:48%;bottom:-6px;width:12px;background:#684326;border:2px solid #4c301d}
.left-leg{left:15px}.right-leg{right:15px}
.table-surface{position:absolute;inset:10% 0 40%;border:5px solid #684326;border-radius:4px;background:repeating-linear-gradient(0deg,#8c603a 0 8px,#9e7449 8px 13px);box-shadow:0 5px 0 #4e331f}
.drawer{position:absolute;left:34%;top:35%;width:32%;height:14%;border:2px solid #4c301d;background:#754728}
.drawer:after{content:"";position:absolute;left:45%;top:35%;width:8px;height:4px;border-radius:3px;background:#d3ac63}
.desk .table-surface{background:linear-gradient(0deg,#795031,#a7794d)}
.desk-lamp{position:absolute;right:14px;top:2px;width:20px;height:30px;border-top:6px solid #e4be72;border-radius:50%}
.map-paper{position:absolute;left:15%;top:8%;width:70%;height:25%;background:#e6d6ac;border:2px solid #9f8054;transform:rotate(-2deg);background-image:linear-gradient(45deg,transparent 48%,#9e9a7a 49%,transparent 51%)}
.mini-plants{position:absolute;top:-10px;left:15%;right:15%;display:flex;justify-content:space-around}
.mini-plants i{width:18px;height:25px;background:#3e7950;border-radius:90% 0 90% 0;border-bottom:6px solid #8e6644}
.sofa-back{position:absolute;inset:0 6% 35%;border:4px solid #4a273a;border-radius:9px;background:linear-gradient(90deg,#61344f,#8b496b,#61344f)}
.sofa-seat{position:absolute;left:8%;right:8%;top:52%;bottom:10%;border:4px solid #4a273a;border-radius:7px;background:linear-gradient(#965b77,#6a3c56)}
.sofa-arm{position:absolute;top:35%;width:16%;height:62%;border:4px solid #4a273a;border-radius:7px;background:#784460}
.sofa-arm-left{left:0}.sofa-arm-right{right:0}
.sofa-cushion{position:absolute;top:56%;width:31%;height:25%;border-radius:4px;background:#bd8b9b;border:2px solid #704358}
.cushion-left{left:22%}.cushion-right{right:22%}
.cabinet-top{position:absolute;top:0;left:-5%;right:-5%;height:12%;border:3px solid #4a2d1d;background:#a2764c}
.cabinet-door{position:absolute;top:13%;bottom:8%;width:47%;border:4px solid #553821;background:linear-gradient(90deg,#6c4327,#94673e,#6c4327)}
.cabinet-left{left:2%}.cabinet-right{right:2%}
.cabinet-door i{position:absolute;right:5px;top:45%;width:5px;height:5px;border-radius:50%;background:#e1bd73}
.cabinet-feet{position:absolute;bottom:0;left:9%;right:9%;height:8%;background:#4a2d1d}
.picture-frame{position:absolute;inset:0;border:9px solid #aa8045;background:#5a3927;box-shadow:0 3px 0 #0003}
.picture{position:absolute;inset:13px;background:linear-gradient(#6eafc5 0 45%,#e2c47c 45% 49%,#6c8a5d 49%)}
.picture-sun{position:absolute;top:10%;right:16%;width:19px;height:19px;border-radius:50%;background:#f7d783}
.picture-hill{position:absolute;bottom:0;width:100%;height:45%;border-radius:80% 80% 0 0}
.hill-a{left:-25%;background:#386653}.hill-b{left:38%;background:#5c7946}
.displaycase{border:6px solid #594633;background:#b6d7d5a6;box-shadow:inset 0 0 0 2px #ecf5ec}
.glass-top{position:absolute;top:0;left:0;right:0;height:14%;background:#e1f0e8aa;border:3px solid #8a9b90}
.glass-pane{position:absolute;top:12%;left:8%;right:8%;bottom:22%;border:3px solid #a0b9b3;background:#c9e7e24d}
.glass-shelf{position:absolute;top:65%;left:0;right:0;height:5px;background:#a4ada0}
.art-statue{position:absolute;left:43%;top:25%;width:20%;height:40%;border-radius:40% 40% 20% 20%;background:linear-gradient(90deg,#d0b679,#f2e1a2,#b99b5c)}
.glass-base{position:absolute;bottom:0;left:0;right:0;height:20%;background:#654832;border-top:5px solid #a47e52}
.bench-back{position:absolute;top:0;left:8%;right:8%;height:27%;background:#805636;border:4px solid #4c3221}
.bench-seat{position:absolute;top:30%;left:0;right:0;height:34%;background:linear-gradient(#b08351,#765033);border:4px solid #4e331e;border-radius:4px}
.bench-leg{position:absolute;top:55%;bottom:0;width:10px;background:#4b3324}
.bench-leg-left{left:15%}.bench-leg-right{right:15%}
.sculpture .statue-base{position:absolute;bottom:0;left:10%;right:10%;height:15%;background:#a89a7d;border:3px solid #605747}
.statue-body{position:absolute;left:30%;top:35%;width:40%;height:45%;border-radius:40% 40% 12% 12%;background:linear-gradient(90deg,#817f78,#c1bbb0,#77766e)}
.statue-head{position:absolute;left:38%;top:15%;width:25%;height:23%;border-radius:50%;background:#c4bfb3}
.statue-arm{position:absolute;left:20%;top:45%;width:25%;height:12%;background:#9b988e;transform:rotate(-35deg)}
.locker-row{position:absolute;inset:0;display:flex;gap:4px;background:#506b77;padding:4px;border:4px solid #344650}
.locker-row i{position:relative;flex:1;border:3px solid #344650;background:linear-gradient(90deg,#74919c,#597780);box-shadow:inset 0 0 0 2px #8ba6aa}
.locker-row i b{position:absolute;right:4px;top:48%;width:4px;height:9px;background:#dec88c}
.bleacher-rows{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:space-between;padding:5px;background:#754d37;border:4px solid #4c3024}
.bleacher-rows i{height:24%;border:3px solid #4c3024;background:linear-gradient(#a87953,#855738)}
.trophy-glass{position:absolute;inset:0 0 12%;border:4px solid #b3c5c1;background:#c7e4e242}
.little-trophy{position:absolute;top:20%;width:26%;height:47%;background:#e8bd4c;border:2px solid #8d6628;clip-path:polygon(25% 0,75% 0,75% 40%,100% 50%,90% 70%,65% 65%,60% 100%,40% 100%,35% 65%,10% 70%,0 50%,25% 40%)}
.trophy-one{left:18%}.trophy-two{right:18%;transform:scale(.8);top:25%}
.trophy-base{position:absolute;bottom:0;left:0;right:0;height:15%;background:#68462d;border-top:4px solid #c9a55f}
.lantern-glow{position:absolute;inset:0;border-radius:50%;background:#f6d97a66;filter:blur(7px)}
.lantern-top{position:absolute;top:8%;left:28%;right:28%;height:13%;background:#45484a;clip-path:polygon(20% 0,80% 0,100% 100%,0 100%)}
.lantern-glass{position:absolute;top:20%;left:28%;right:28%;height:50%;border:5px solid #4e5555;background:linear-gradient(90deg,#d09c44,#ffe8a4,#bf8337);box-shadow:0 0 18px #ffe093}
.lantern-base{position:absolute;bottom:12%;left:22%;right:22%;height:17%;background:#505254;border:3px solid #30373a}
.lantern-handle{position:absolute;left:34%;right:34%;top:0;height:18%;border:4px solid #4c5255;border-radius:50% 50% 0 0}
.crate{background:repeating-linear-gradient(0deg,#8c6037 0 13px,#a77849 13px 23px);border:6px solid #654329;box-shadow:inset 0 0 0 2px #c09460}
.crate-plank{position:absolute;inset:5px;background:repeating-linear-gradient(0deg,transparent 0 15px,#543820 16px 18px)}
.crate-cross{position:absolute;top:0;bottom:0;left:33%;width:12px;background:#6a482c;transform:skew(-20deg)}
.second-cross{left:65%}
.trainseat .seat-back{position:absolute;top:0;left:6%;right:6%;height:66%;border:5px solid #53313b;border-radius:11px 11px 4px 4px;background:linear-gradient(90deg,#6d3d4d,#af6971,#753c4b)}
.trainseat .seat-pad{position:absolute;bottom:0;left:5%;right:5%;height:35%;border:4px solid #53313b;border-radius:6px;background:#a7575f}
.seat-arm{position:absolute;top:48%;width:15%;height:32%;border:3px solid #53313b;background:#75424c}
.seat-arm-left{left:0}.seat-arm-right{right:0}
.seat-foot{position:absolute;bottom:-3px;left:20%;right:20%;height:8%;background:#4a3431}
.luggage .rack-bar{position:absolute;top:22%;left:0;right:0;height:9px;background:#584b43;border:2px solid #302c29}
.suitcase{position:absolute;top:30%;width:43%;height:42%;border:4px solid #594032;border-radius:5px;background:#925d43}
.suitcase-one{left:4%}.suitcase-two{right:4%;background:#586d78}
.suitcase-handle{position:absolute;top:24%;left:34%;width:32%;height:12%;border:4px solid #4a3730;border-bottom:0;border-radius:6px 6px 0 0}
.trolley-box{position:absolute;left:8%;right:8%;top:15%;height:65%;border:4px solid #59402b;background:linear-gradient(90deg,#936740,#bd8952,#805433)}
.trolley-handle{position:absolute;left:10%;top:0;width:8px;height:28%;background:#575a58}
.trolley-wheel{position:absolute;bottom:0;width:15px;height:15px;border:3px solid #b4b4aa;border-radius:50%;background:#30373b}
.wheel-left{left:18%}.wheel-right{right:18%}
.trolley-bag{position:absolute;left:30%;top:22%;width:45%;height:33%;background:#5f4147;border:3px solid #36282c}
.glasscase{border:5px solid #8da69d;background:#d4eee84d}
.orchid-glass{position:absolute;inset:0;background:linear-gradient(90deg,#d6f1e766,#ffffff17,#d6f1e766)}
.orchid-stem{position:absolute;left:49%;top:30%;width:4px;height:48%;background:#3b804e}
.orchid-flower{position:absolute;left:36%;top:18%;width:36%;height:26%;background:#d5a5e8;border-radius:50% 50% 35% 35%;box-shadow:inset 0 -4px #9166b4}
.orchid-pot{position:absolute;bottom:8%;left:28%;width:44%;height:26%;background:#b87348;clip-path:polygon(0 0,100% 0,82% 100%,18% 100%);border-top:4px solid #e4b280}
.plant-stem{position:absolute;bottom:18%;left:45%;width:6px;height:70%;background:#366c43;transform:rotate(10deg)}
.stem-b{left:60%;transform:rotate(-20deg)}
.plant-leaf{position:absolute;width:38%;height:24%;border-radius:100% 0 100% 0;background:linear-gradient(135deg,#5b9653,#2d6740)}
.leaf-a{left:15%;top:25%;transform:rotate(5deg)}.leaf-b{right:10%;top:40%;transform:rotate(80deg)}.leaf-c{left:30%;top:50%;transform:rotate(35deg)}
.plant-pot{position:absolute;bottom:0;left:25%;width:52%;height:25%;background:#b66e48;clip-path:polygon(0 0,100% 0,82% 100%,18% 100%)}
.person{position:absolute;width:34px;height:46px;z-index:15;transition:left .11s linear,top .11s linear}
.sprite{position:absolute;inset:0;animation:characterBob .5s ease-in-out infinite alternate}
.hair{position:absolute;z-index:3;top:2px;left:6px;width:23px;height:12px;border-radius:9px 9px 4px 4px;background:var(--hair);box-shadow:inset 0 -3px #0002}
.hair-long{height:22px;border-radius:10px 10px 7px 7px}
.hair-bun{height:11px}.hair-bun:after{content:"";position:absolute;right:-4px;top:-4px;width:11px;height:11px;border-radius:50%;background:var(--hair)}
.hair-curly{height:14px;border-radius:50%;box-shadow:-4px 3px 0 var(--hair),4px 4px 0 var(--hair),inset 0 -2px #0003}
.hair-ponytail:after{content:"";position:absolute;right:-5px;top:7px;width:7px;height:17px;border-radius:0 8px 8px 8px;background:var(--hair)}
.face{position:absolute;top:5px;left:9px;width:18px;height:19px;background:var(--skin);border-radius:7px 7px 9px 9px;border:1px solid #553c30;z-index:2}
.eye{position:absolute;top:8px;width:2px;height:3px;border-radius:50%;background:#2d2520}
.eye-left{left:4px}.eye-right{right:4px}
.mouth{position:absolute;left:7px;bottom:3px;width:4px;height:2px;background:#8b5148;border-radius:0 0 3px 3px}
.neck{position:absolute;z-index:2;left:14px;top:21px;width:8px;height:6px;background:var(--skin)}
.torso{position:absolute;left:5px;top:24px;width:25px;height:17px;border:1px solid #17212a;border-radius:5px 5px 3px 3px;background:linear-gradient(90deg,#0002,var(--shirt),#ffffff18,var(--shirt));box-shadow:inset 0 2px #ffffff2c}
.arm{position:absolute;top:26px;width:7px;height:16px;border-radius:4px;background:var(--skin);border:1px solid #0002;z-index:1}
.arm-left{left:1px;transform:rotate(8deg)}.arm-right{right:1px;transform:rotate(-8deg)}
.leg{position:absolute;top:39px;width:9px;height:7px;background:var(--pants);border:1px solid #252b32}
.leg-left{left:7px}.leg-right{right:7px}
.shoe{position:absolute;top:43px;width:12px;height:4px;border-radius:3px;background:#272b30}
.shoe-left{left:4px}.shoe-right{right:4px}
.npc .person-name{position:absolute;top:47px;left:50%;transform:translateX(-50%);padding:3px 5px;border:1px solid #624b34;background:#f3e7d0;color:#27231f;font-size:10px;font-weight:800;white-space:nowrap;border-radius:3px;box-shadow:0 2px 4px #0002}
.player{z-index:20}
.player .torso{box-shadow:inset 0 2px #ffffff45,0 0 0 1px #192b46}
@keyframes characterBob{from{translate:0 0}to{translate:0 -1.5px}}
.clue-marker{position:absolute;z-index:12;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:#f7d67f99;border:2px solid #f7d67f;box-shadow:0 0 0 5px #ffdc7c22,0 0 19px #ffe295;animation:cluePulse 1.2s ease-in-out infinite alternate}
.clue-marker i{width:7px;height:7px;border-radius:50%;background:#fff7cb;box-shadow:0 0 8px #fff4b3}
@keyframes cluePulse{from{transform:scale(.9)}to{transform:scale(1.12)}}
.interaction-prompt{position:absolute;z-index:28;left:15px;bottom:14px;min-width:275px;padding:10px 13px;border:1px solid #e2c17b66;border-radius:6px;background:#151d26ed;color:#f4e5c7;font-size:12px;font-weight:800}
.interaction-prompt span{display:block;margin-top:4px;color:#aeb9c5;font-size:9px;letter-spacing:1px}
.message-box{margin-top:11px;min-height:50px;display:flex;align-items:flex-start;gap:10px;padding:13px 15px;border:1px solid #374657;border-radius:7px;background:#1c2734;color:#d8e0e9;font-size:13px;line-height:1.5}
.message-dot{flex:none;margin-top:4px;width:7px;height:7px;border-radius:50%;background:#d8b777;box-shadow:0 0 9px #d8b777}
.control-bar{display:flex;gap:20px;padding:13px 3px;color:#b7c1cd;font-size:11px;flex-wrap:wrap}
.control-bar span{display:flex;gap:6px;align-items:center}
.control-bar b{display:inline-flex;padding:4px 6px;border:1px solid #506071;border-radius:4px;background:#202c39;color:#f2e4ca;font-size:10px}
.control-bar small{color:#8897a7;font-size:9px;letter-spacing:1px}
.sidebar{border:1px solid #3a4655;border-radius:9px;background:linear-gradient(160deg,#222e3d,#19232f);padding:17px;min-height:300px;box-shadow:0 16px 36px #0002}
.sidebar-title{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #ffffff16;padding-bottom:14px;margin-bottom:13px}
.sidebar-title h2{font:700 21px Georgia,serif;margin:0;color:#f5ead6}
.sidebar-title .mini-label{margin-bottom:5px;font-size:9px}
.clue-count{width:30px;height:30px;display:flex;align-items:center;justify-content:center;border:1px solid #cda85c;border-radius:50%;color:#f4d48e;font-weight:800;font-size:12px}
.evidence-list{display:flex;flex-direction:column;gap:9px;max-height:510px;overflow:auto}
.empty-evidence{padding:24px 10px;text-align:center;color:#9ca9b7}
.empty-icon{margin:0 auto 12px;width:36px;height:36px;border:1px dashed #6f7d8c;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;color:#d8b777}
.empty-evidence p{margin:0 0 7px;color:#d5dde5;font-size:13px;font-weight:700}
.empty-evidence span{font-size:11px;line-height:1.5}
.evidence-card{position:relative;padding:12px 12px 12px 15px;background:#151e29;border:1px solid #364456;border-radius:6px;border-left:3px solid #c9a762}
.evidence-pin{position:absolute;top:12px;left:-5px;width:7px;height:7px;border-radius:50%;background:#f4d48e;box-shadow:0 0 6px #f4d48e66}
.evidence-card h3{margin:0 0 6px;color:#f0dfbd;font-size:12px}
.evidence-card p{margin:0;color:#aeb9c5;font-size:11px;line-height:1.5}
.case-status{margin-top:20px;border-top:1px solid #ffffff18;padding-top:15px}
.status-row{display:flex;align-items:center;justify-content:space-between;gap:8px}
.status-row h3{margin:0 0 10px;font-size:12px;color:#dce4ec}
.status-row span{margin-top:-8px;font-size:11px;color:#d8b777}
.progress-bar{height:6px;border-radius:7px;background:#101720;overflow:hidden}
.progress{height:100%;background:linear-gradient(90deg,#b58a45,#f0d28b);transition:width .25s}
.case-status>p{font-size:10px;color:#8e9cac;line-height:1.5}
.sidebar-hint{width:100%;margin-top:8px;border-color:#655438;background:#322c22;color:#ead5a5}
.sidebar-hint:hover{background:#433925}
.modal-overlay{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;background:#070b11c9;backdrop-filter:blur(5px)}
.suspect-modal,.hint-modal,.accusation-modal,.win-modal{position:relative;width:min(610px,100%);max-height:90vh;overflow-y:auto;padding:27px;border:1px solid #536172;border-radius:12px;background:linear-gradient(145deg,#f5f0e6,#e4e1d8);color:#202936;box-shadow:0 30px 80px #0008}
.suspect-modal-top{display:flex;align-items:flex-start;gap:15px;padding-bottom:19px;border-bottom:1px solid #c6c5be}
.modal-person{position:relative;flex:none;width:56px;height:56px;border:3px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:20px;font-weight:900;box-shadow:0 4px 12px #0002}
.suspect-modal-top h2,.hint-modal h2,.accusation-modal h2,.win-modal h2{margin:0 0 7px;font:700 28px Georgia,serif;color:#232b34}
.suspect-intro{margin:0;color:#53606c;font-size:13px;line-height:1.55;max-width:440px}
.modal-x{position:absolute;right:15px;top:12px;width:30px;height:30px;border:0;border-radius:50%;background:#d7d8d4;color:#3b4650;font-size:22px;cursor:pointer}
.modal-x:hover{background:#c3c8c8}
.conversation-start{padding-top:20px}
.conversation-start p{color:#596574;font-size:13px;line-height:1.5}
.primary-button,.secondary-button{display:inline-flex;align-items:center;justify-content:center;gap:10px;padding:11px 15px;border:0;border-radius:6px;font-size:12px;font-weight:800;cursor:pointer}
.primary-button{background:#314a5e;color:#fff}
.primary-button:hover{background:#223b4f}
.primary-button span{font-size:16px}
.secondary-button{background:#d9dcd9;color:#37434e;border:1px solid #c1c7c7}
.secondary-button:hover{background:#cfd4d2}
.question-area{padding-top:18px}
.modal-section-label{margin:0 0 12px;color:#8b7147;font-size:9px;font-weight:900;letter-spacing:2px}
.question-list{display:grid;gap:8px;margin-bottom:17px}
.question-button{display:flex;align-items:center;gap:10px;width:100%;padding:12px;border:1px solid #c9d0d2;border-radius:6px;background:#fffdfa;text-align:left;color:#273441;font-size:12px;font-weight:700;cursor:pointer}
.question-button:hover{border-color:#b08b4d;background:#fff8e8}
.question-button.asked{background:#e7e8e4;color:#66717a}
.question-mark{flex:none;width:22px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:#e2d1a9;color:#4d4028}
.question-check{margin-left:auto;color:#6a9468}
.answer-area blockquote{margin:0 0 15px;padding:15px 17px;border-left:3px solid #b08b4d;background:#fffdfa;border-radius:0 6px 6px 0;color:#394653;font-size:13px;line-height:1.7}
.evidence-unlocked{padding:10px 12px;margin-bottom:15px;border:1px solid #b8cfb7;border-radius:6px;background:#e6f0e4}
.evidence-unlocked span{display:block;margin-bottom:4px;color:#467149;font-size:9px;letter-spacing:1.5px;font-weight:900}
.evidence-unlocked b{font-size:12px;color:#2c5936}
.evidence-unlocked p{margin:4px 0 0;color:#58735b;font-size:10px}
.question-area>.secondary-button{margin-left:7px}
.hint-modal{width:min(475px,100%);text-align:center}
.hint-bulb{display:flex;align-items:center;justify-content:center;width:46px;height:46px;margin:2px auto 15px;border-radius:50%;background:#e9d19b;color:#584321;font:700 27px Georgia,serif}
.hint-card{margin:21px 0;padding:18px;border:1px solid #d8c394;border-radius:8px;background:#fffaf0;text-align:left}
.hint-card span{font-size:9px;letter-spacing:2px;font-weight:900;color:#927744}
.hint-card p{margin:10px 0 0;color:#374350;font-size:14px;line-height:1.65}
.hint-actions{display:flex;justify-content:center;gap:8px;flex-wrap:wrap}
.accusation-modal{width:min(460px,100%)}
.accusation-copy{color:#5a6673;font-size:13px;line-height:1.55}
.accusation-list{display:grid;gap:8px;margin:20px 0}
.accusation-list button{display:flex;align-items:center;gap:10px;padding:12px;border:1px solid #cbd0d0;border-radius:6px;background:#fffdfa;color:#2a3743;text-align:left;font-size:13px;font-weight:700;cursor:pointer}
.accusation-list button:hover{border-color:#b08b4d;background:#fff7e5}
.accusation-list button>span:last-child{margin-left:auto;color:#ad8a4b;font-size:18px}
.suspect-dot{width:13px;height:13px;border-radius:50%;border:2px solid #fff;box-shadow:0 0 0 1px #56616a}
.win-modal{text-align:center;width:min(540px,100%)}
.win-stamp{display:inline-block;padding:8px 14px;border:2px solid #567c5a;border-radius:3px;color:#46734b;letter-spacing:3px;font-size:10px;font-weight:900;transform:rotate(-4deg);margin-bottom:17px}
.win-modal>p:not(.mini-label){color:#53606b;font-size:13px;line-height:1.7}
.win-buttons{display:flex;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:20px}
.case-page{min-height:100vh;padding:45px 25px;background:radial-gradient(circle at 50% -10%,#36465b,#111827 62%);color:#f9fafb}
.case-selection{max-width:1240px;margin:auto;text-align:center}
.eyebrow{font-size:11px;letter-spacing:4px;color:#e6bd72;font-weight:800}
.case-selection>h1{font:700 46px Georgia,serif;margin:12px 0}
.selection-subtitle{color:#aeb8c6;margin-bottom:32px}
.case-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;text-align:left}
.case-card{display:flex;flex-direction:column;min-height:310px;padding:0 20px 18px;border:1px solid #465367;border-radius:12px;background:linear-gradient(145deg,#263449,#17202f);color:white;cursor:pointer;overflow:hidden;text-align:left;transition:transform .18s,border-color .18s}
.case-card:hover{transform:translateY(-5px);border-color:#e6bd72}
.case-art{height:70px;margin:0 -20px 18px;position:relative;background:linear-gradient(135deg,#625039,#1c2939);overflow:hidden}
.case-art:before{content:"";position:absolute;inset:20px -20px;border:1px solid #ffffff33;transform:rotate(-10deg)}
.case-art span{position:absolute;right:17px;top:4px;font:700 40px Georgia,serif;color:#fff5}
.case-art i{position:absolute;left:23px;top:11px;width:46px;height:46px;border:3px solid #e6bd72;border-radius:50%;box-shadow:0 0 0 7px #e6bd7222}
.card-painting .case-art{background:linear-gradient(120deg,#593d37,#17202f)}
.card-trophy .case-art{background:linear-gradient(120deg,#50431f,#17202f)}
.card-lighthouse .case-art{background:linear-gradient(120deg,#17465b,#17202f)}
.card-train .case-art{background:linear-gradient(120deg,#593a42,#17202f)}
.card-orchid .case-art{background:linear-gradient(120deg,#26543f,#17202f)}
.case-card small{font-size:10px;color:#e6bd72;font-weight:800;letter-spacing:2px}
.case-card h2{font:700 22px Georgia,serif;margin:9px 0}
.case-card p{font-size:13px;line-height:1.5;color:#aeb8c6;flex:1}
.case-footer{border-top:1px solid #ffffff20;padding-top:13px;display:flex;justify-content:space-between;font-size:12px;color:#e2e8f0}
.case-selection>.secondary-button{margin-top:28px}
@media(max-width:1100px){.game-layout{grid-template-columns:minmax(0,1fr) 260px}.header{align-items:flex-start;flex-direction:column}.header-buttons{justify-content:flex-start}}
@media(max-width:850px){.game-layout{grid-template-columns:1fr}.sidebar{max-width:900px}.evidence-list{max-height:320px}.page{padding:16px}.case-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:600px){.case-grid{grid-template-columns:1fr}.case-page{padding:25px 14px}.case-selection>h1{font-size:34px}.header-buttons button{padding:10px;font-size:11px}.control-bar{gap:9px}.suspect-modal,.hint-modal,.accusation-modal,.win-modal{padding:22px 18px}.suspect-modal-top{padding-right:20px}.question-area>.secondary-button{margin:8px 0 0}}
`;
