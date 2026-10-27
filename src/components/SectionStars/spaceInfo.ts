// Popup text for the background spacecraft, keyed by data-space-info.
export const SPACE_INFO = {
  sputnik: {
    title: "Sputnik 1 · 1957",
    body: "The first artificial satellite. A 58 cm polished sphere with four antennas, launched by the USSR on 4 October 1957. Its simple radio “beep” was heard around the world and started the Space Age.",
  },
  soyuz4: {
    title: "Soyuz 4 · 1969",
    body: "Commanded by Vladimir Shatalov, my great-grand-uncle. On 16 January 1969 it docked with Soyuz 5: the first docking of two crewed spacecraft. Two cosmonauts spacewalked across, and Soyuz 4 brought three crew home. Shatalov later flew Soyuz 8 and 10 and led cosmonaut training.",
  },
  soyuz5: {
    title: "Soyuz 5 · 1969",
    body: "Launched a day after Soyuz 4 with Boris Volynov, Aleksei Yeliseyev and Yevgeny Khrunov. After docking, Yeliseyev and Khrunov spacewalked to Soyuz 4, the first crew transfer between spacecraft in orbit. Volynov flew home alone through a famously rough reentry.",
  },
} as const;

export type SpaceInfoKey = keyof typeof SPACE_INFO;

// fired by the Soyuz 4 popup's "command docking" button; DockingSoyuz listens
export const COMMAND_DOCKING_EVENT = "soyuz:command-docking";

// fired by the Sputnik popup's "beep" button; SputnikFlight listens
export const SPUTNIK_BEEP_EVENT = "sputnik:beep";
