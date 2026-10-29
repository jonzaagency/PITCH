/* PITCH! card decks and prospect profile pieces.
 * Edit these lists freely: add a line, save, rebuild. Every deck is shuffled each round.
 * The Peddler builds an invention from two decks: Items and Functions. */
(function (P) {
  const C = (P.content = {});

  // Peddler deck 1 of 2: the physical object the invention starts from.
  C.items = [
    'Toaster', 'Umbrella', 'Garden gnome', 'Rubber duck', 'Bowling ball', 'Sock', 'Lawn chair',
    'Step ladder', 'Lunchbox', 'Hairbrush', 'Trampoline', 'Kazoo', 'Disco ball', 'Fanny pack',
    'Pogo stick', 'Bathtub', 'Snow globe', 'Traffic cone', 'Accordion', 'Pizza cutter', 'Hammock',
    'Lava lamp', 'Tuba', 'Shopping cart', 'Rocking chair', 'Fishbowl', 'Waffle iron', 'Unicycle',
    'Shower cap', 'Leaf blower', 'Mailbox', 'Wheelbarrow', 'Mood ring', 'Yoga mat', 'Rolling pin',
    'Bean bag chair', 'Megaphone', 'Ice cube tray', 'Stapler', 'Cowboy boots', 'Pool noodle',
    'Toilet plunger', 'Ceiling fan', 'Hula hoop', 'Fire extinguisher', 'Tiara', 'Paperclip',
    'Doorbell', 'Hot tub', 'Scarecrow', 'Sleeping bag', 'Pickle jar', 'Wind chime', 'Treadmill',
    'Teapot', 'Backpack', 'Phone booth', 'Slow cooker', 'Bicycle helmet', 'Bubble wrap',
    'Garden hose', 'Recliner', 'Cuckoo clock', 'Salad spinner', 'Ski goggles', 'Baby monitor'
  ];

  // Peddler deck 2 of 2: what the invention does.
  C.functions = [
    'Predicts the weather', 'Plays smooth jazz', 'Folds laundry', 'Translates baby talk',
    'Detects lies', 'Walks your dog', 'Grows vegetables', 'Brews coffee', 'Tells bedtime stories',
    'Removes wrinkles', 'Charges your phone', 'Finds lost keys', 'Fills awkward silences',
    'Does your taxes', 'Repels mosquitoes', 'Cooks a three-course meal', 'Gives compliments',
    'Cleans the gutters', 'Teaches French', 'Keeps secrets', 'Reads minds', 'Breaks up arguments',
    'Schedules your meetings', 'Glows in the dark', 'Plays fetch', 'Writes poetry',
    'Massages your feet', 'Calls your mom', 'Counts calories', 'Plays the bagpipes',
    'Waters your plants', 'Tracks the moon', 'Blocks spam calls', 'Cuts hair', 'Blends smoothies',
    'Generates electricity', 'Hatches eggs', 'Purifies the air', 'Remembers birthdays',
    'Plays chess against you', 'Counts your steps', 'Delivers the mail', 'Warms your bed',
    'Flies short distances', 'Records your dreams', 'Sorts the recycling', 'Irons shirts',
    'Wakes you up gently', 'Cheers you on', 'Babysits', 'Paints portraits', 'Makes popcorn',
    'Measures vibes', 'Tells the future', 'Scares away raccoons', 'Writes thank-you notes',
    'Helps you parallel park', 'Composes theme music', 'Teaches karate', 'Cures hiccups'
  ];

  // Prospect profile pieces. Each Prospect gets a random combination.
  C.firstNames = [
    'Agnes', 'Barry', 'Carmen', 'Dmitri', 'Esther', 'Felix', 'Gloria', 'Hank', 'Imani', 'Jules',
    'Kofi', 'Lorraine', 'Marco', 'Nadia', 'Otis', 'Priya', 'Quentin', 'Rosa', 'Stan', 'Tamsin',
    'Ulysses', 'Valentina', 'Walt', 'Ximena', 'Yusuf', 'Zelda', 'Bev', 'Chad', 'Dolores', 'Earl',
    'Fern', 'Gus', 'Harriet', 'Iggy', 'Jolene', 'Kurt', 'Lupe', 'Mabel', 'Ned', 'Opal', 'Percy',
    'Rhonda', 'Sal', 'Trixie', 'Vince', 'Wanda', 'Mei', 'Ravi', 'Sunny', 'Bo'
  ];
  C.lastNames = [
    'Puddlesworth', 'McGillicuddy', 'Okonkwo', 'Vanderbeek', 'Featherstone', 'Ramirez', 'Kowalski',
    'Nakamura', 'Bramble', 'Fitzwilliam', 'Haddock', 'Lindqvist', 'Moreau', 'Pickering', 'Quill',
    'Thistlewood', 'Underhill', 'Winterbottom', 'Zamora', 'Abernathy', 'Bellweather', 'Crumb',
    'Dumont', 'Esposito', 'Goldfarb', 'Honeycutt', 'Iyer', 'Jablonski', 'Krumholz', 'Larkspur'
  ];
  C.marital = ['Single', 'Married', 'Divorced', 'Widowed', 'Engaged', "It's complicated", 'Recently remarried', 'Married (third time)'];
  C.occupations = [
    'Dental hygienist', 'Competitive eater', 'Middle school vice principal', 'Long-haul trucker',
    'Wedding DJ', 'Beekeeper', 'Accountant', 'Mall Santa (seasonal)', 'Park ranger', 'Night-shift nurse',
    'Hot dog vendor', 'Retired astronaut', 'Pet psychic', 'Crossing guard', 'Real estate agent',
    'Ice sculptor', 'Startup founder', 'Lifeguard', 'Funeral director', 'Mattress tester',
    'Elevator inspector', 'Food critic', 'Zookeeper', 'Wedding planner', 'Retired wrestler',
    'Librarian', 'Submarine cook', 'Yoga influencer', 'Plumber', 'Lighthouse keeper',
    'Theme park ride operator', 'Professional bridesmaid', 'Fortune cookie writer',
    'Golf course groundskeeper', 'Taxidermist', 'Air traffic controller', 'Clown college dropout',
    'Chicken farmer', 'Substitute teacher', 'Bounty hunter (retired)', 'Ferry captain', 'Florist'
  ];
  C.backgrounds = [
    'Grew up on a houseboat and still gets landsick.',
    'Has lived in the same small town for 60 years and knows everyone.',
    'Just moved to the city after a big life change.',
    'Coaches a very bad youth soccer team with great enthusiasm.',
    'Spends every weekend at flea markets hunting for treasure.',
    'Is training for a marathon for the fourth year in a row.',
    'Runs a neighborhood watch group that mostly watches birds.',
    'Recently inherited a large, slightly haunted farmhouse.',
    'Hosts a weekly trivia night at the local bowling alley.',
    'Is the family member everyone calls in an emergency.',
    'Has a garage full of half-finished projects.',
    'Takes a cruise every year and loves the buffet.',
    'Volunteers at the animal shelter twice a week.',
    'Works from home and has not worn real pants since 2020.',
    'Is famous in the family for burning the Thanksgiving turkey.',
    'Collects vintage lunchboxes and is very serious about it.',
    'Wakes up at 4 a.m. every day, on purpose.',
    'Plays in a garage band that has never had a gig.',
    'Is planning a big anniversary surprise.',
    'Is extremely competitive about board games.',
    'Lives with three generations under one roof.',
    'Keeps a detailed spreadsheet of every purchase ever made.',
    'Just started a backyard vegetable garden.',
    'Is a lifelong night owl in a family of morning people.',
    'Drives a 1987 station wagon named Doris.',
    'Recently took up ballroom dancing.',
    'Has strong opinions about pizza toppings.',
    'Is the self-appointed mayor of the apartment building.',
    'Travels constantly for work and misses home.',
    'Has never once been on time for anything.'
  ];
  // SECRETS. Every Prospect gets one. They are everyday, believable, and easy to uncover with good
  // questions, built from topics a Peddler would naturally ask about (hobbies, fears, plans, money...).
  // `tip` is shown to the Prospect: how to work the secret into conversation without blurting it out.
  // Secret Sleuth also uses this pool for its decoy options, so it is big on purpose (~220 secrets).
  // To add secrets: add a line to any `fill` list, or add a whole new topic.
  C.secretTopics = [
    { id: 'learning', lead: 'Is secretly learning to ', tip: 'Mention your evenings are busy lately, or that you signed up for a class.',
      fill: ['play the ukulele', 'speak Italian', 'salsa dance', 'bake sourdough bread', 'ride a motorcycle', 'ice skate', 'juggle',
        'paint with watercolors', 'do stand-up comedy', 'surf', 'knit', 'play chess', 'sing opera', 'skateboard', 'play the drums',
        'speak sign language', 'build websites', 'do magic tricks', 'fly a drone', 'ballroom dance'] },
    { id: 'fear', lead: 'Is afraid of ', tip: 'Steer away from anything related to it, and flinch a little if it comes up.',
      fill: ['spiders', 'deep water', 'elevators', 'flying', 'heights', 'big dogs', 'the dentist', 'driving on the highway',
        'public speaking', 'birds', 'the dark', 'clowns', 'escalators', 'thunderstorms', 'roller coasters', 'boats', 'horses', 'bees'] },
    { id: 'never', lead: 'Has never ', tip: 'If travel, food or "firsts" come up, change the subject a little too fast.',
      fill: ['been on a plane', 'learned to swim', 'ridden a bike', 'seen snow', 'eaten sushi', 'been to the ocean', 'driven a car',
        'had a pet', 'left their home state', 'been to a concert', 'cooked a turkey', 'been camping', 'watched a horror movie',
        'been on a boat', 'ridden a roller coaster', 'been to a wedding', 'stayed in a hotel', 'had a birthday party'] },
    { id: 'saving', lead: 'Is saving up for ', tip: 'Act careful with money. Say you are "cutting back" for something special.',
      fill: ['a trip to Japan', 'a hot tub', 'a fishing boat', 'a vintage car', 'a tiny house', 'a horse', 'a food truck', 'a backyard pool',
        'a motorcycle', 'their dream wedding', 'a trip to Paris', 'a new kitchen', 'a camper van', 'a home recording studio',
        'a cruise around the world', 'a fancy espresso machine', 'a cabin in the woods', 'season tickets'] },
    { id: 'hates', lead: 'Secretly hates ', tip: 'Act a little too enthusiastic about it, or make a face when it comes up.',
      fill: ['pizza', 'the beach', 'birthday parties', 'coffee', 'holiday music', 'chocolate', 'cats', 'camping', 'football',
        'brunch', 'karaoke', 'board games', 'surprise parties', 'road trips', 'theme parks', 'gardening', 'small talk', 'their own car'] },
    { id: 'plan', lead: 'Is planning to ', tip: 'Hint that big changes are coming. Sound a little too excited about "next year."',
      fill: ['quit their job', 'move to another state', 'propose to their partner', 'go back to school', 'adopt a dog', 'open a bakery',
        'run for city council', 'start a podcast', 'buy a farm', 'run a marathon', 'sell their house', 'retire early', 'write a book',
        'join a band', 'start a YouTube channel', 'move to the beach', 'renovate their kitchen', 'get a second puppy'] },
    { id: 'talent', lead: 'Has a hidden talent for ', tip: 'Drop a hint about something you are secretly good at, or offer to "show them sometime."',
      fill: ['yodeling', 'opera singing', 'card tricks', 'beatboxing', 'origami', 'doing impressions', 'speed typing', 'whistling',
        'baking wedding cakes', 'solving puzzle cubes', 'tap dancing', 'ventriloquism', 'calligraphy', 'arm wrestling', 'writing poetry',
        'painting portraits', 'bowling', 'parallel parking'] },
    { id: 'obsessed', lead: 'Is obsessed with ', tip: 'Bring it up more than you should, and light up when it is mentioned.',
      fill: ['reality dating shows', 'true-crime podcasts', 'bird-watching', 'video games', 'collecting sneakers', 'houseplants', 'model trains',
        'crossword puzzles', 'cooking competitions', 'horoscopes', 'fantasy football', 'garage sales', 'scented candles', 'coupons',
        "a '90s boy band", 'soap operas', 'jigsaw puzzles', 'their air fryer'] },
    { id: 'justDid', lead: 'Just ', tail: " and hasn't told anyone", tip: 'Act like something big happened this week, and be vague about what.',
      fill: ['got a tattoo', 'bought a motorcycle', 'got a promotion', 'failed their driving test', 'won a radio contest', 'adopted a second cat',
        'dyed their hair blue', 'bought a timeshare', 'quit the gym', 'booked a solo trip', 'entered a pie contest', 'sold their car',
        'joined a bowling league', 'started a side business', 'won a cooking contest', 'auditioned for a reality show', 'bought a drum set', 'got bangs'] },
    { id: 'pretends', lead: 'Pretends to ', tip: 'Claim to love it, but get vague when asked for details.',
      fill: ["like their in-laws' cooking", 'know how to cook', 'understand wine', 'enjoy jogging', 'be a morning person', 'speak French',
        'like jazz', 'read the news every day', 'know how to swim', 'love their job', 'be good with kids', 'enjoy yoga', 'understand football',
        'be handy around the house', 'like spicy food', 'be a vegetarian', 'have read all the classics', 'follow the stock market'] },
    { id: 'still', lead: 'Still ', tip: 'Let a childhood habit slip out when you talk about your daily routine.',
      fill: ['sleeps with a stuffed animal', 'calls their mom every single day', 'eats cereal for dinner', 'sleeps with a nightlight',
        'collects trading cards', 'watches Saturday morning cartoons', 'keeps every birthday card they ever got', 'has their baby blanket',
        'gets their parents to do their taxes', 'writes in a diary', 'plays with action figures', 'carries a lucky charm everywhere',
        'counts on their fingers', 'has a curfew at their parents\' house', 'can\'t whistle', 'takes naps every afternoon'] },
    { id: 'owns', lead: 'Secretly owns ', tip: 'Mention your place is "a little full" or that you need more storage.',
      fill: ['40 pairs of sneakers', 'a closet full of costumes', 'six cats', 'a pet snake', '300 coffee mugs', 'a jukebox', 'a karaoke machine',
        'a hot sauce collection', 'a suit of armor', 'a pet tarantula', 'a vintage pinball machine', 'a drawer full of hotel soaps',
        'a motorcycle they can\'t ride', 'nine bicycles', 'a mannequin named Steve', 'a popcorn machine', 'a cotton candy maker', 'a llama'] }
  ];
  C.secrets = [];
  C.secretTopics.forEach((t) => t.fill.forEach((f) => {
    C.secrets.push({ text: t.lead + f + (t.tail || '') + '.', topic: t.id, tip: t.tip });
  }));
  // Shown to the Peddler during Fact-Finding: the kinds of questions that uncover secrets.
  C.peddlerQuestionTips = ['hobbies and weekends', 'fears', 'plans for next year', 'what they are saving for', 'hidden talents',
    'things they have never done', 'what they are into lately', 'their daily routine'];

  // SCREW! cards: each Prospect gets three and may play one during the pitch.
  // The Peddler gets 15 seconds to respond. Keep them playful, never personal.
  C.screws = [
    { t: 'Allergy Alert', d: "I'm allergic to your product's main ingredient. Convince me it's safe." },
    { t: 'Sticker Shock', d: 'It costs $10,000. Justify the price.' },
    { t: 'Rhyme Time', d: 'Answer my next question only in rhymes.' },
    { t: 'Mascot Time', d: 'Invent a mascot for the product on the spot and do its voice.' },
    { t: 'Show Me', d: 'Demonstrate the product using only mime. No words.' },
    { t: 'Cheaper Next Door', d: 'My neighbor sells the same thing for half the price. Why yours?' },
    { t: 'Under the Sea', d: 'I live on a submarine. How does it work for me?' },
    { t: "Explain It Like I'm Five", d: 'Explain the product to a five-year-old.' },
    { t: 'Product Recall', d: "There's been a recall. Tell us what went wrong and how you fixed it." },
    { t: 'Haiku', d: 'Pitch the main benefit as a haiku (5-7-5).' },
    { t: 'Jingle', d: "Sing the product's jingle. Right now." },
    { t: 'Slow Motion', d: 'Deliver the next 15 seconds in slow motion.' },
    { t: 'Hostile Witness', d: 'Swear under oath that your product is safe. I am the lawyer.' },
    { t: 'Plot Twist', d: 'Surprise! It also does the opposite of what it says. Sell that as a feature.' },
    { t: 'Tech Support', d: "It's broken. Walk me through fixing it." },
    { t: 'Grandma Test', d: 'My grandma is on the phone. Sell it to her instead.' },
    { t: 'Battery Dead', d: 'The battery is dead. Prove it still works.' },
    { t: 'Wrong Room', d: 'Pitch it to a room full of penguins.' },
    { t: 'Mic Drop', d: 'Use only three words to win me back.' },
    { t: 'Fine Print', d: 'Read us the "fine print." It had better be funny.' },
    { t: 'Customer Review', d: 'Read a one-star review out loud and respond to it.' },
    { t: 'Speed Round', d: 'List five uses for the product in 15 seconds.' },
    { t: 'Gravity Off', d: 'We are on the moon now. How does it work in low gravity?' },
    { t: 'Size Matters', d: 'It just shrank to the size of a grape. Still worth it?' },
    { t: 'Super Size', d: 'It is now the size of a school bus. Where do I keep it?' },
    { t: 'The Competition', d: 'Name your rival product and roast it, nicely.' },
    { t: 'Emotional Support', d: 'I feel sad. Make me feel better using only the product.' },
    { t: 'Interpretive Dance', d: 'Show how it works through interpretive dance.' },
    { t: 'Return Policy', d: "I want to return it. Talk me out of it." },
    { t: 'Robot Voice', d: 'Answer in your best robot voice.' },
    { t: 'The Sequel', d: 'Announce version 2.0. What does it add?' },
    { t: 'Pet Owner', d: 'My dog ate it. Is that a problem?' },
    { t: 'Commercial Break', d: 'Act out a 10-second TV commercial for it.' },
    { t: 'No Hands', d: 'Pitch with your hands behind your back.' },
    { t: 'Whisper Mode', d: 'Everyone is asleep. Whisper the pitch.' },
    { t: 'Plan B', d: 'Your main feature is illegal in this state. What else does it do?' },
    { t: 'Origin Story', d: 'Tell us the dramatic origin story of the invention.' },
    { t: 'Skeptic', d: "I don't believe it exists. Prove it." },
    { t: 'Translate', d: 'Pitch it as if you were translating from a language you made up.' },
    { t: 'Weather Report', d: 'Deliver the benefits as a weather forecast.' }
  ];

  // DADDY MADE A CALL challenges: a Prospect has to do one of these.
  C.daddyChallenges = [
    'Give the product a dramatic five-star review.',
    "Do your best infomercial 'Wow!' reaction, three times.",
    "Testify like a satisfied customer in a late-night commercial.",
    "Hum the product's theme song.",
    'Explain why you would name your firstborn after this product.',
    'Do a slow-motion unboxing of the product.',
    'Describe your life before this product, in black and white.',
    'Give a tearful acceptance speech for "Customer of the Year."',
    'Pretend to call a friend and tell them they NEED this.',
    'Do a 10-second dance celebrating the purchase.',
    'Rate the product out of 10 using only interpretive gestures.',
    'Read the warning label in a movie-trailer voice.',
    "Show us how you'd use it on your worst morning.",
    'Become the product for 10 seconds. What does it say?'
  ];

  // NEPO BABY! Power Cards (rulebook section 11).
  C.nepo = {
    notToday: { id: 'notToday', name: 'NOT TODAY!', price: 75, when: 'During a SCREW!', effect: 'Cancel one SCREW! challenge played against you.' },
    knowPeople: { id: 'knowPeople', name: 'I KNOW PEOPLE', price: 100, when: 'Creation Lab', effect: 'Before fact-finding, replace one Prospect with an eligible player.' },
    daddy: { id: 'daddy', name: 'DADDY MADE A CALL', price: 125, when: 'Fact-Finding through the Close', effect: 'Require a Prospect to complete a brief, funny challenge.' }
  };

  // The six Philanthropist scoring categories, $0-$50 each (rulebook section 9).
  C.categories = [
    { id: 'invention', name: 'Invention', hint: 'Product concept, name, and how well the invention is presented.' },
    { id: 'ingenuity', name: 'Ingenuity', hint: 'Originality, creative thinking, and adaptation under pressure.' },
    { id: 'factFinding', name: 'Fact-Finding', hint: 'Questions, listening, follow-ups, and discoveries across Prospects.' },
    { id: 'objections', name: 'Overcoming Objections', hint: 'Direct, confident, credible handling of SCREW! and customer concerns.' },
    { id: 'pitch', name: 'Overall Pitch', hint: 'Persuasion, clear value, and delivery.' },
    { id: 'close', name: 'The Close', hint: 'Clear call to action and appropriate request for commitment.' }
  ];
})(window.PITCH = window.PITCH || {});
