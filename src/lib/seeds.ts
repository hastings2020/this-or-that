export type SeedQuestion = {
  prompt: string;
  options: string[];
};

/** ~100 lighthearted prompts: usual picks + one out-of-box option. */
export const SEED_QUESTIONS: SeedQuestion[] = [
  {
    prompt: "Which pet person are you?",
    options: ["Dog","Cat","None","Kids"],
  },
  {
    prompt: "Fork or chopsticks for noodles?",
    options: ["Fork","Chopsticks","Hand"],
  },
  {
    prompt: "Pineapple in pizza?",
    options: ["Yes","No","What’s the problem"],
  },
  {
    prompt: "Coffee or tea to start the day?",
    options: ["Coffee","Tea","Neither — just water and hope"],
  },
  {
    prompt: "Beach or mountains for a weekend?",
    options: ["Beach","Mountains","Hotel bathtub"],
  },
  {
    prompt: "Sweet or savory breakfast?",
    options: ["Sweet","Savory","Leftover dinner"],
  },
  {
    prompt: "Early bird or night owl?",
    options: ["Early bird","Night owl","Chronically confused"],
  },
  {
    prompt: "Text or call?",
    options: ["Text","Call","Voice note essay"],
  },
  {
    prompt: "Windows or aisle seat?",
    options: ["Window","Aisle","Middle, somehow"],
  },
  {
    prompt: "Books on paper or screen?",
    options: ["Paper","Screen","I listen while dishwashing"],
  },
  {
    prompt: "Soup or salad when in doubt?",
    options: ["Soup","Salad","Bread basket as a meal"],
  },
  {
    prompt: "Rainy day plan?",
    options: ["Movies","Walk in the rain","Reorganize a drawer"],
  },
  {
    prompt: "Hot sauce level?",
    options: ["Mild","Bring the heat","I fear spice"],
  },
  {
    prompt: "City stroll or nature trail?",
    options: ["City","Nature","Mall with AC"],
  },
  {
    prompt: "Playlist: classics or new releases?",
    options: ["Classics","New releases","Whatever the algorithm decides"],
  },
  {
    prompt: "Pancakes or waffles?",
    options: ["Pancakes","Waffles","French toast diplomacy"],
  },
  {
    prompt: "Cats on the keyboard: cute or chaos?",
    options: ["Cute","Chaos","Both, simultaneously"],
  },
  {
    prompt: "Preferred snack texture?",
    options: ["Crunchy","Chewy","Mysterious and soft"],
  },
  {
    prompt: "Meeting notes: typed or handwritten?",
    options: ["Typed","Handwritten","I remember vibes only"],
  },
  {
    prompt: "Road trip soundtrack?",
    options: ["Sing-alongs","Podcasts","Comfortable silence"],
  },
  {
    prompt: "Ice cream cone or cup?",
    options: ["Cone","Cup","Straight from the pint"],
  },
  {
    prompt: "Desk setup: minimal or cozy clutter?",
    options: ["Minimal","Cozy clutter","Whatever fell there"],
  },
  {
    prompt: "Preferred weather for a walk?",
    options: ["Crisp and cool","Warm and sunny","Dramatic storm"],
  },
  {
    prompt: "Sushi: soy sauce dunk style?",
    options: ["Light dip","Full soak","I invent new ratios"],
  },
  {
    prompt: "Gift wrapping: neat or chaotic charm?",
    options: ["Neat","Chaotic charm","Gift bag forever"],
  },
  {
    prompt: "Preferred kitchen dance partner?",
    options: ["Playlist","Podcast","The smoke alarm"],
  },
  {
    prompt: "Socks: matching or free spirit?",
    options: ["Matching","Free spirit","One sock missing"],
  },
  {
    prompt: "Museum pace?",
    options: ["Slow and thorough","Highlights only","Gift shop first"],
  },
  {
    prompt: "Preferred pizza crust?",
    options: ["Thin","Thick","Stuffed with secrets"],
  },
  {
    prompt: "Work focus fuel?",
    options: ["Silence","Lo-fi beats","Neighbor’s lawnmower"],
  },
  {
    prompt: "Camping: tent or cabin?",
    options: ["Tent","Cabin","Day trip and soft bed"],
  },
  {
    prompt: "Photo style on trips?",
    options: ["Candid moments","Careful compositions","300 near-identical sunsets"],
  },
  {
    prompt: "Preferred cereal relationship?",
    options: ["Classic milk bowl","Dry handfuls","I invent dessert hybrids"],
  },
  {
    prompt: "Board game night role?",
    options: ["Rules lawyer","Chaotic fun","Snack quartermaster"],
  },
  {
    prompt: "Preferred candle vibe?",
    options: ["Fresh linen","Warm spice","I light it then forget"],
  },
  {
    prompt: "Laundry folding philosophy?",
    options: ["Neat stacks","Clean pile is fine","Wear from the dryer"],
  },
  {
    prompt: "Preferred sandwich architecture?",
    options: ["Balanced layers","Overloaded hero","Open-face rebellion"],
  },
  {
    prompt: "Weekend morning energy?",
    options: ["Errands conqueror","Slow coffee ritual","Accidental noon"],
  },
  {
    prompt: "Plant parenting style?",
    options: ["Attentive waterer","Benign neglect","Decorative plastic"],
  },
  {
    prompt: "Preferred map app voice?",
    options: ["Calm guidance","Strict reroutes","I ignore it anyway"],
  },
  {
    prompt: "Chocolate: dark or milk?",
    options: ["Dark","Milk","Whatever has caramel"],
  },
  {
    prompt: "Preferred elevator etiquette?",
    options: ["Quiet nod","Friendly chat","Press every floor by accident"],
  },
  {
    prompt: "Fridge organization?",
    options: ["Labeled zones","Creative tetris","Archaeology dig"],
  },
  {
    prompt: "Preferred rain sound?",
    options: ["Soft drizzle","Thunderstorm","AC white noise"],
  },
  {
    prompt: "Toast topping loyalty?",
    options: ["Butter","Jam","Avocado industrial complex"],
  },
  {
    prompt: "Preferred group chat energy?",
    options: ["Quick replies","Thoughtful essays","React and vanish"],
  },
  {
    prompt: "Shoe removal at home?",
    options: ["Always","Sometimes","I am the outdoor shoe"],
  },
  {
    prompt: "Preferred bakery weakness?",
    options: ["Croissant","Cookie","Whatever smells strongest"],
  },
  {
    prompt: "Alarm clock strategy?",
    options: ["One alarm","Cascade of alarms","Optimistic vibes"],
  },
  {
    prompt: "Preferred soup season drink?",
    options: ["Hot cocoa","Herbal tea","Iced drink in winter"],
  },
  {
    prompt: "Movie snacks hierarchy?",
    options: ["Popcorn","Candy","I smuggle a full meal"],
  },
  {
    prompt: "Preferred notepad?",
    options: ["Lined","Blank","Sticky notes everywhere"],
  },
  {
    prompt: "Sunset or sunrise person?",
    options: ["Sunset","Sunrise","Golden hour wherever it finds me"],
  },
  {
    prompt: "Preferred pasta shape loyalty?",
    options: ["Long noodles","Short shapes","Whatever’s on sale"],
  },
  {
    prompt: "Email inbox philosophy?",
    options: ["Inbox zero","Controlled chaos","Archaeology forever"],
  },
  {
    prompt: "Preferred winter accessory?",
    options: ["Scarf","Beanie","Overcommitment to layers"],
  },
  {
    prompt: "Smoothie thickness?",
    options: ["Sip-able","Spoon-able","I chew my drinks"],
  },
  {
    prompt: "Preferred party role?",
    options: ["Host with snacks","Delightful guest","Early quiet exit"],
  },
  {
    prompt: "Keyboard preference?",
    options: ["Clicky","Quiet","Laptop forever"],
  },
  {
    prompt: "Preferred fruit personality?",
    options: ["Crisp apple","Sweet berry","Mango as a lifestyle"],
  },
  {
    prompt: "Commute entertainment?",
    options: ["Music","Audiobook","People-watching"],
  },
  {
    prompt: "Preferred blanket weight?",
    options: ["Light","Weighted","I become a burrito"],
  },
  {
    prompt: "Grocery shopping style?",
    options: ["List loyalist","Inspired wandering","Delivery and dreams"],
  },
  {
    prompt: "Preferred comedy flavor?",
    options: ["Dry wit","Slapstick","Wholesome chaos"],
  },
  {
    prompt: "Desk snack drawer?",
    options: ["Healthy-ish","Candy vault","Mysterious crumbs"],
  },
  {
    prompt: "Preferred notebook size?",
    options: ["Pocket","A5 comfort","Giant sketchpad energy"],
  },
  {
    prompt: "Hot drink mug size?",
    options: ["Modest","Large","Bowl pretending to be a mug"],
  },
  {
    prompt: "Preferred weekend chore?",
    options: ["Cooking batch","Tidying nest","Strategic postponement"],
  },
  {
    prompt: "Sandals or sneakers in summer?",
    options: ["Sandals","Sneakers","Barefoot rebellion"],
  },
  {
    prompt: "Preferred cloud watching?",
    options: ["Shapes and stories","Weather forecasting","I nap instead"],
  },
  {
    prompt: "Salad dressing loyalty?",
    options: ["Vinaigrette","Creamy","Just olive oil and vibes"],
  },
  {
    prompt: "Preferred calendar color coding?",
    options: ["Rainbow system","Two calm colors","Everything is red"],
  },
  {
    prompt: "Soup bread companion?",
    options: ["Crusty loaf","Soft roll","Crackers in bulk"],
  },
  {
    prompt: "Preferred vacation packing?",
    options: ["Capsule wardrobe","Overpacker","Buy it there"],
  },
  {
    prompt: "Tea bag dunking style?",
    options: ["Gentle bob","Aggressive swirl","I steep and forget"],
  },
  {
    prompt: "Preferred houseplant leaf?",
    options: ["Big and dramatic","Tiny and many","Succulent survivalist"],
  },
  {
    prompt: "Preferred bakery line patience?",
    options: ["Worth the wait","I’ll come back","I invent a new craving"],
  },
  {
    prompt: "Desk lamp mood?",
    options: ["Warm glow","Bright focus","Overhead forever"],
  },
  {
    prompt: "Preferred ice in drinks?",
    options: ["Lots","A little","No ice, thank you"],
  },
  {
    prompt: "Kitchen timer trust?",
    options: ["Phone timer","Oven beep","Smell-based intuition"],
  },
  {
    prompt: "Preferred weekend footwear indoors?",
    options: ["Socks","Slippers","Barefoot on cold floors"],
  },
  {
    prompt: "Map vs wandering on trips?",
    options: ["Planned route","Gentle wandering","Follow the good smells"],
  },
  {
    prompt: "Preferred yogurt situation?",
    options: ["Plain with fruit","Flavored cup","I build parfait towers"],
  },
  {
    prompt: "Meeting camera default?",
    options: ["On","Off until needed","Virtual background chaos"],
  },
  {
    prompt: "Preferred sidewalk rule?",
    options: ["Keep right","Weave gracefully","I am a gentle obstacle"],
  },
  {
    prompt: "Cookie dough: bake or sneak?",
    options: ["Bake fully","Sneak a bite","Dough is the dessert"],
  },
  {
    prompt: "Preferred umbrella policy?",
    options: ["Always carry","Risk it","Hood and optimism"],
  },
  {
    prompt: "Notebook pen color?",
    options: ["Black","Blue","A surprising gel pen"],
  },
  {
    prompt: "Preferred picnic blanket?",
    options: ["Classic check","Waterproof pragmatism","I sit on my jacket"],
  },
  {
    prompt: "Leftovers strategy?",
    options: ["Labeled plan","Creative remix","Forgotten science project"],
  },
  {
    prompt: "Preferred stadium snack?",
    options: ["Pretzel","Nachos","I pack my own"],
  },
  {
    prompt: "Morning stretch habit?",
    options: ["Full routine","One big yawn","Coffee is the stretch"],
  },
  {
    prompt: "Preferred soup bowl size?",
    options: ["Normal","Oversized","Mug soup forever"],
  },
  {
    prompt: "Playlist naming style?",
    options: ["Poetic titles","Practical labels","Untitled (1)"],
  },
  {
    prompt: "Preferred toast doneness?",
    options: ["Light gold","Deep brown","Occasionally charcoal"],
  },
  {
    prompt: "Weekend texting energy?",
    options: ["Quick check-ins","Long catch-ups","Emoji and disappear"],
  },
  {
    prompt: "Preferred park bench activity?",
    options: ["People-watch","Read","Snack aggressively"],
  },
  {
    prompt: "Kitchen sponge lifespan?",
    options: ["Replace often","Push the limit","I forget it exists"],
  },
  {
    prompt: "Preferred nightcap drink?",
    options: ["Herbal tea","Warm milk-ish","Cold water victory"],
  },
  {
    prompt: "Sticky note usage?",
    options: ["Organized reminders","Artful chaos","Decorative only"],
  },
  {
    prompt: "Preferred sandwich cut?",
    options: ["Diagonal","Straight","I don’t cut, I commit"],
  },
  {
    prompt: "Cloud storage habits?",
    options: ["Neat folders","Search will find it","Desktop archaeology"],
  },
  {
    prompt: "Preferred soup season sweater?",
    options: ["Chunky knit","Soft hoodie","I am always cold"],
  },
  {
    prompt: "Fruit cutting commitment?",
    options: ["Nice slices","Rustic chunks","Bite directly, bravely"],
  },
  {
    prompt: "Preferred hallway greeting?",
    options: ["Smile and nod","Quick hello","Elaborate wave"],
  },
  {
    prompt: "End of day ritual?",
    options: ["Tidy reset","Soft couch collapse","One more tiny task"],
  },
];
