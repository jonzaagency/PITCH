/* PITCH! card decks and prospect profile pieces.
 * Edit these lists freely: add a line, save, rebuild. Every deck is shuffled each round.
 * House rule from the rulebook: spokespeople are fictional characters, never real celebrities. */
(function (P) {
  const C = (P.content = {});

  // Peddler deck 1 of 3: the physical object the invention starts from.
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

  // Peddler deck 2 of 3: what the invention does.
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

  // Peddler deck 3 of 3: who endorses it. Fictional archetypes only.
  C.spokespeople = [
    'A retired pirate', 'Your brutally honest grandma', 'A sleep-deprived new dad',
    'A medieval knight who time-traveled', 'A golden retriever (with a translator)',
    'A conspiracy-loving ghost', 'A kindergarten teacher on summer break', 'An alien tourist',
    'A grumpy lighthouse keeper', 'A motivational goat', 'A soap opera villain',
    'An overly dramatic weather reporter', 'A vending machine that gained sentience',
    'Your high school gym coach', 'A Victorian chimney sweep', 'A cowboy from the year 3000',
    'A mime who just broke his silence', 'A suburban mom with a black belt', 'A nervous magician',
    'A robot learning human emotions', 'A yoga instructor who hates yoga',
    'A smooth-talking used-car dealer', 'A fairy godmother on her last day', 'A very tired superhero',
    'A bake-off champion', 'A detective who has never solved a case', 'A rapping librarian',
    'A surfer philosopher', 'A wise old tortoise', 'A game show host', 'A friendly haunted doll',
    'A space station chef', 'A Shakespearean actor', 'An influencer with 12 followers',
    'A drill sergeant', 'A spa receptionist', 'A vampire with a day job', 'A clown on vacation',
    'A lumberjack poet', 'A toddler CEO', 'An opera singer', 'A theme park mascot',
    'A news anchor stuck in 1985', 'A zen monk', 'A dinosaur who survived', 'A professional hype man',
    'A retired secret agent', 'A royal butler'
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
  // One secret per Prospect. The Peddler has to uncover it with good questions.
  C.secrets = [
    'Is secretly terrified of birds.',
    'Won $50,000 in a scratch-off and has told no one.',
    'Has a fake British accent at work and cannot stop now.',
    'Is allergic to the main material of their own job.',
    'Has 14 cats and tells people it is "a few."',
    'Is quietly planning to run away and join the circus.',
    'Has never learned to ride a bike.',
    'Is the anonymous author of a popular romance novel series.',
    'Cannot swim, despite their job or hobbies suggesting otherwise.',
    'Is a two-time regional yodeling champion.',
    'Sleeps with a nightlight shaped like a dolphin.',
    'Is secretly building a time machine in the basement.',
    'Has been pretending to like their in-laws\' cooking for 10 years.',
    'Is deeply afraid of the dark.',
    'Gets motion sick on escalators.',
    'Talks to their houseplants and thinks the plants talk back.',
    'Has a second phone just for playing mobile games.',
    'Hates the beach but keeps getting invited.',
    'Is saving up to buy a llama.',
    'Has a secret talent for opera singing.',
    'Has been lying about knowing how to cook.',
    'Is learning to read music in secret to impress someone.',
    'Is scared of their own smart speaker.',
    'Still has every tooth they ever lost, in a jar.',
    'Cries at every single commercial.',
    'Has never seen the ocean.',
    'Is up for a huge promotion but does not want it.',
    'Is secretly very afraid of heights.',
    'Has a hidden tattoo of a cartoon frog.',
    'Is hopelessly addicted to reality TV.',
    'Has never paid a parking ticket on time.',
    'Is quietly writing a musical about their own life.',
    'Owns 200 pairs of sneakers.',
    'Lost their wedding ring and has been wearing a replica.',
    'Is terrified of clowns.',
    'Can only fall asleep with the TV on.',
    'Is hiding a pet snake from the landlord.',
    'Has been taking secret dance lessons for a year.',
    'Hates the color of their own house.',
    'Is about to quit their job to open a food truck.',
    'Has a phobia of buttons.',
    'Is a champion competitive whistler.',
    'Has not changed their password since 2009.',
    'Is pretending to be vegetarian for someone they like.',
    'Has never once used the gym membership they pay for.'
  ];

  // SCREW! cards: each Prospect gets three and may play one during the pitch.
  // The Peddler gets 15 seconds to respond. Keep them playful, never personal.
  C.screws = [
    { t: 'Allergy Alert', d: "I'm allergic to your product's main ingredient. Convince me it's safe." },
    { t: 'Sticker Shock', d: 'It costs $10,000. Justify the price.' },
    { t: 'Rhyme Time', d: 'Answer my next question only in rhymes.' },
    { t: 'Spokesperson Quit', d: 'Your spokesperson just quit on live TV. Introduce their replacement.' },
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
    { id: 'pitch', name: 'Overall Pitch', hint: 'Persuasion, clear value, delivery, and spokesperson integration.' },
    { id: 'close', name: 'The Close', hint: 'Clear call to action and appropriate request for commitment.' }
  ];
})(window.PITCH = window.PITCH || {});
