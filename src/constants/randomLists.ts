export interface PickerList {
  id: string;
  label: string;
  emoji: string;
  items: string[];
}

export const PICKER_LISTS: PickerList[] = [
  {
    id: "food",
    label: "Food",
    emoji: "🍽️",
    // Update these with her actual fridge/cupboard options
    items: [
      "Waffles",
      "Chickpea Masala",
      "Red Lentil Dal",
    ],
  },
  {
    id: "coin",
    label: "Coin flip",
    emoji: "🪙",
    items: ["Yes ✨", "No 🌿"],
  },
];
