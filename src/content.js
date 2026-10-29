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
  // FUN FACTS + SECRETS. Every Prospect gets one fun fact (everyone can see it) and a secret that grows
  // out of it (only they can see it), so digging into the fun fact is how the Peddler finds the secret.
  // Each secret is [secret, [two ways to act it out], one line to try].
  // Secret Sleuth uses the other secrets of the same fun fact as decoys, so keep at least 3 per fun fact.
  // To add one: add a [secret, [act, act], try] entry to any fun fact, or add a whole new fun fact.
  C.funFacts = [
    { fact: 'Grew up on a houseboat and still gets landsick.', secrets: [
      ['Is secretly a pirate. A real one.', ['Say “arr” or “matey” once, then pretend you coughed.', 'Get strangely interested in anything gold or shiny.'], 'Mention you “borrowed” your boat and never gave it back.'],
      ['Has never actually learned to swim.', ['Change the subject whenever swimming comes up.', 'Brag about boat life, but go vague on the water itself.'], 'Say you “always stayed on deck.”'],
      ['Sold the family houseboat without telling anyone.', ['Get a little guilty when family comes up.', 'Talk about the houseboat in the past tense, then fix it.'], 'Say you “came into some money recently.”']] },
    { fact: 'Has lived in the same small town for 60 years and knows everyone.', secrets: [
      ['Is the anonymous gossip columnist for the town paper.', ['Know a little too much about everyone.', 'Ask the Peddler a nosy question back.'], 'Say “you didn’t hear it from me…”'],
      ['Has never once left the county.', ['Call the next town over “abroad.”', 'Get vague about vacations.'], 'Ask whether the product is “allowed across the county line.”'],
      ['Secretly runs the whole town from behind the scenes.', ['Talk like every decision goes through you.', 'Mention you “know a guy” for everything.'], 'Say the mayor “still owes you one.”']] },
    { fact: 'Just moved to the city after a big life change.', secrets: [
      ['Is dodging the tax man back home.', ['Get vague about why you moved.', 'Flinch whenever anyone says “taxes,” “paperwork” or “audit.”'], 'Say you’re “keeping a low profile” for now.'],
      ['Left town after losing a bet with the mayor.', ['Act like you never want to talk about your old town.', 'Get competitive about anything that sounds like a bet.'], 'Say you’ll “never wager on a pie-eating contest again.”'],
      ['Is in the world’s least secret witness protection.', ['Forget your own name for a second when asked.', 'Glance over your shoulder now and then.'], 'Say “my name is… what I said it was.”']] },
    { fact: 'Coaches a very bad youth soccer team with great enthusiasm.', secrets: [
      ['Has never actually watched a soccer game.', ['Use sports words a little wrong.', 'Get vague when asked about the rules.'], 'Call the goal “the net zone.”'],
      ['Bribes the kids with candy to show up.', ['Mention snacks way more than soccer.', 'Get defensive about your “coaching methods.”'], 'Say practice is “mostly about morale.”'],
      ['Secretly bets on their own team to lose.', ['Sound oddly cheerful about losing.', 'Change the subject when money and sports come up together.'], 'Say a loss is “good for business.”']] },
    { fact: 'Spends every weekend at flea markets hunting for treasure.', secrets: [
      ['Accidentally sold a priceless painting for $5.', ['Get quiet when anyone mentions art.', 'Sound bitter about “the one that got away.”'], 'Say you “check the auction news every day, for no reason.”'],
      ['Resells their flea market finds online for a fortune.', ['Act casual about money, then get very specific about prices.', 'Look at objects like you’re pricing them.'], 'Ask what the Peddler would pay for “a vintage anything.”'],
      ['Has a storage unit nobody knows about.', ['Say your home is “very minimalist.”', 'Get cagey about your weekends.'], 'Mention you carry “a key you can’t explain.”']] },
    { fact: 'Is training for a marathon for the fourth year in a row.', secrets: [
      ['Has never actually finished a marathon.', ['Talk a lot about training, never about finish lines.', 'Get vague about race results.'], 'Say you’re “more of a starter than a finisher.”'],
      ['Took a taxi for part of last year’s race.', ['Get oddly defensive about race times.', 'Speak a little too warmly about taxis.'], 'Say mile 18 is “really more of a suggestion.”'],
      ['Only runs because of a crush on the running coach.', ['Light up whenever training comes up.', 'Mention the coach by first name a lot.'], 'Say you “never miss Tuesday practice. Never.”']] },
    { fact: 'Runs a neighborhood watch group that mostly watches birds.', secrets: [
      ['Is secretly spying on the neighbors, not the birds.', ['Know oddly specific things about your street.', 'Squint at the Peddler like you’re taking notes.'], 'Say “I see everything on this block.”'],
      ['Has never actually spotted a rare bird.', ['Act like a bird expert, but stay vague on details.', 'Change the subject if someone asks about your best sighting.'], 'Call every bird “a classic.”'],
      ['Started the group just to get out of the house.', ['Talk about the meetings like they’re a vacation.', 'Dodge any questions about home life.'], 'Say the meetings are “three hours of peace and quiet.”']] },
    { fact: 'Recently inherited a large, slightly haunted farmhouse.', secrets: [
      ['Rents the haunted rooms out to ghost tourists.', ['Get oddly businesslike about the “haunting.”', 'Defend the ghost a little too much.'], 'Say the ghost “has great reviews.”'],
      ['Is the one making the ghost noises.', ['Laugh a little too hard when ghosts come up.', 'Make a tiny “oooo” sound once, then deny it.'], 'Say the haunting “started the week I moved in.”'],
      ['Is secretly too scared to sleep there.', ['Talk tough about ghosts, then get jumpy.', 'Mention you’ve been staying “with friends” lately.'], 'Say you sleep “with every light on, for the vibe.”']] },
    { fact: 'Hosts a weekly trivia night at the local bowling alley.', secrets: [
      ['Writes the answers on their hand before every trivia night.', ['Glance at your palm before answering anything.', 'Get defensive if anyone says “cheat.”'], 'Say you “just have a great memory. In ink.”'],
      ['Has been banned from three other trivia nights.', ['Get way too competitive about any question.', 'Change the subject when other bars come up.'], 'Say you “can’t go to Pete’s Pub anymore.”'],
      ['Rigs the questions so their friends always win.', ['Brag about your friends’ trivia record.', 'Get vague about how the questions get picked.'], 'Say your friends “just happen to love questions about themselves.”']] },
    { fact: 'Is the family member everyone calls in an emergency.', secrets: [
      ['Secretly screens every single family call.', ['Act super available, then admit you “missed a few calls.”', 'Glance at your phone and frown.'], 'Say your phone “has been acting up for three years.”'],
      ['Has no idea what they’re doing and searches everything online.', ['Sound confident, then get vague about how you know.', 'Mention “looking things up” a lot.'], 'Say “I’m basically a doctor. An internet doctor.”'],
      ['Is planning a fake vacation just to get a break.', ['Sound tired and a little sneaky about next month.', 'Get vague about your travel plans.'], 'Say you’ll be “very unreachable” soon.']] },
    { fact: 'Has a garage full of half-finished projects.', secrets: [
      ['Is building a boat in the garage that won’t fit through the door.', ['Talk about your project with enormous pride.', 'Get vague about how big it is.'], 'Ask how hard it is to “remove a garage wall.”'],
      ['Has never finished a single thing in their life.', ['Start answers and let them trail off.', 'Get excited about starting things, quiet about finishing them.'], 'Say “I’m more of an ideas person.”'],
      ['Is secretly building a robot butler.', ['Mention “wires” and “testing” in passing.', 'Get very protective of the garage.'], 'Say your garage has “a new roommate.”']] },
    { fact: 'Takes a cruise every year and loves the buffet.', secrets: [
      ['Has been banned from a cruise line for buffet behavior.', ['Get defensive about “portion sizes.”', 'Describe buffets like a battle.'], 'Say there’s “one cruise line that knows my face.”'],
      ['Gets seasick every single time.', ['Rave about cruises, then turn a little green.', 'Dodge details about actually being on the boat.'], 'Say your favorite part is “the dock.”'],
      ['Sneaks food containers onto the buffet every trip.', ['Ask whether the product comes “to go.”', 'Talk about leftovers a lot.'], 'Mention your bag is “mostly containers.”']] },
    { fact: 'Volunteers at the animal shelter twice a week.', secrets: [
      ['Has secretly adopted eleven animals from the shelter.', ['Mention “the kids” at home, very vaguely.', 'Pick fur off your clothes while you talk.'], 'Say your house is “a little noisy.”'],
      ['Is allergic to cats and dogs.', ['Sniffle a little when animals come up.', 'Love animals loudly, from a distance.'], 'Say you “mostly volunteer at the front desk.”'],
      ['Only volunteers because the vet is cute.', ['Mention the vet a lot.', 'Get flustered when anyone asks why you volunteer.'], 'Say you “really care about the animals. And the staff.”']] },
    { fact: 'Works from home and has not worn real pants since 2020.', secrets: [
      ['Secretly works two full-time jobs at once.', ['Look tired and a little too busy.', 'Get vague about who your boss is.'], 'Say you keep “two calendars.”'],
      ['Hasn’t actually done any work since 2020.', ['Talk about “meetings” with zero details.', 'Get vague about what your job even is.'], 'Say your camera is “always broken.”'],
      ['Moved to a beach town and never told their boss.', ['Mention the weather is “always great” lately.', 'Get cagey about where home is.'], 'Say your video background is “a virtual one.”']] },
    { fact: 'Is famous in the family for burning the Thanksgiving turkey.', secrets: [
      ['Burns the turkey on purpose so they never have to host.', ['Act sad about the turkey, but smirk a little.', 'Change the subject if anyone asks you to cook.'], 'Say “what a shame, I guess someone else hosts this year.”'],
      ['Secretly orders the whole meal from a restaurant.', ['Brag about your side dishes in suspicious detail.', 'Get nervous about recipes.'], 'Say your gravy is “a family secret. The family runs a diner.”'],
      ['Is secretly a trained chef.', ['Act clueless about cooking, then slip up with a fancy word.', 'Wince when anyone describes bad cooking.'], 'Say “a little brunoise,” then pretend you sneezed.']] },
    { fact: 'Collects vintage lunchboxes and is very serious about it.', secrets: [
      ['Spent their savings on a single lunchbox.', ['Get very defensive about “investments.”', 'Change the subject when savings come up.'], 'Say the lunchbox is “basically a retirement plan.”'],
      ['Eats lunch out of a priceless lunchbox every day.', ['Mention lunch with suspicious pride.', 'Get nervous if anyone talks about spills.'], 'Say your sandwich is “worth more than my car.”'],
      ['“Borrowed” a lunchbox from a museum display.', ['Get jumpy when museums come up.', 'Talk about your collection like a heist.'], 'Say the museum “had too many anyway.”']] },
    { fact: 'Wakes up at 4 a.m. every day, on purpose.', secrets: [
      ['Actually goes back to sleep at 4:15.', ['Brag about waking up, never about what you do after.', 'Yawn a lot.'], 'Say 4 a.m. is “a great time for a second nap.”'],
      ['Runs a secret 4 a.m. donut-delivery business.', ['Mention donuts out of nowhere.', 'Get vague about where you go so early.'], 'Say the bakery “knows your car.”'],
      ['Gets up early just to avoid their roommate.', ['Mention you “rarely see” the people you live with.', 'Change the subject when home comes up.'], 'Say you leave “before anyone can talk to me.”']] },
    { fact: 'Plays in a garage band that has never had a gig.', secrets: [
      ['Turned down a record deal and regrets it.', ['Get wistful whenever music comes up.', 'Change the subject when fame comes up.'], 'Say you “almost had a tour bus once.”'],
      ['Can’t actually play their instrument.', ['Talk about the band a lot, never about playing.', 'Air-guitar badly.'], 'Say your role in the band is “more of a vibe.”'],
      ['Secretly writes jingles for TV commercials.', ['Hum something catchy.', 'Get very interested in the product’s slogan.'], 'Offer to write the Peddler a jingle.']] },
    { fact: 'Is planning a big anniversary surprise.', secrets: [
      ['Forgot the anniversary last year and is overcompensating.', ['Act a little guilty when dates come up.', 'Go way too big when describing the surprise.'], 'Say you rented “a small blimp.”'],
      ['Is planning the surprise for the wrong date.', ['Sound very sure about the date, then hesitate.', 'Ask the Peddler what today’s date is.'], 'Say the anniversary is “the twelfth. Or the twenty-first.”'],
      ['Spent the whole surprise budget on lottery tickets.', ['Get nervous about money.', 'Sound very optimistic about “a big win.”'], 'Say the surprise “depends on Friday’s numbers.”']] },
    { fact: 'Is extremely competitive about board games.', secrets: [
      ['Flipped a Monopoly board at a family reunion.', ['Tense up when anyone mentions family game night.', 'Get very competitive about small things.'], 'Say you’re “not allowed to be the banker anymore.”'],
      ['Secretly cheats at every game.', ['Brag about your record a little too much.', 'Get vague about the rules.'], 'Say rules are “more like guidelines.”'],
      ['Has never won a single game.', ['Talk tough about strategy, but never mention a win.', 'Get prickly when anyone asks about your record.'], 'Say you’re “playing the long game.”']] },
    { fact: 'Lives with three generations under one roof.', secrets: [
      ['Is moving out and hasn’t told anyone.', ['Talk about family with a hint of goodbye.', 'Get vague about next year.'], 'Say you’ve been “packing a little, for fun.”'],
      ['Is grandma’s secret partner in her poker nights.', ['Defend grandma a little too much.', 'Be oddly quick with numbers.'], 'Say grandma “has a lot of card nights.”'],
      ['Built a secret room in the basement to get some quiet.', ['Mention you “disappear” at home a lot.', 'Get cagey about the basement.'], 'Say you have “a spot nobody can find.”']] },
    { fact: 'Keeps a detailed spreadsheet of every purchase ever made.', secrets: [
      ['Keeps a second spreadsheet of secret purchases.', ['Sound super organized, then get vague about one category.', 'Change the subject when shopping comes up.'], 'Say you have “a tab called Miscellaneous.”'],
      ['Is quietly a millionaire from all that budgeting.', ['Act frugal, then slip up about something fancy.', 'Get vague about money.'], 'Say your yacht is “just a big boat.”'],
      ['Still has no idea where their money goes.', ['Brag about the spreadsheet, never the totals.', 'Get nervous about numbers.'], 'Say the spreadsheet is “mostly color-coding.”']] },
    { fact: 'Just started a backyard vegetable garden.', secrets: [
      ['Buys vegetables at the store and plants them.', ['Brag about your harvest a little too much.', 'Get vague about how you grew anything.'], 'Say your tomatoes “came with stickers on them, weirdly.”'],
      ['Is in a fierce rivalry with the neighbor’s garden.', ['Get competitive when the neighbors come up.', 'Talk about vegetables like a sport.'], 'Say “my zucchini will be bigger than Doug’s.”'],
      ['Has killed every plant they’ve ever owned.', ['Talk about the garden with forced optimism.', 'Get quiet when asked how it’s going.'], 'Say the garden is “in a resting phase.”']] },
    { fact: 'Is a lifelong night owl in a family of morning people.', secrets: [
      ['Is secretly a late-night radio DJ.', ['Use a smooth, low radio voice once.', 'Get vague about where you are at night.'], 'Say “you’re listening to…” then stop.'],
      ['Fakes being a morning person at family breakfasts.', ['Act cheerful about mornings, then yawn.', 'Get vague about breakfast.'], 'Say you’re “up with the sun. Eventually.”'],
      ['Runs an all-night bakery nobody knows about.', ['Mention bread at odd moments.', 'Get cagey about your nights.'], 'Say you smell “like croissants for no reason.”']] },
    { fact: 'Drives a 1987 station wagon named Doris.', secrets: [
      ['Turned down a fortune for Doris.', ['Get protective whenever cars come up.', 'Talk about Doris like a person.'], 'Say “Doris is not for sale. Don’t ask again.”'],
      ['Doris doesn’t actually run anymore.', ['Talk about road trips in the past tense.', 'Get vague about how you got here.'], 'Say Doris is “resting in the driveway.”'],
      ['Lives in Doris part-time.', ['Say your “home” has wheels, then correct yourself.', 'Get cagey about your address.'], 'Say your bedroom “gets great gas mileage.”']] },
    { fact: 'Recently took up ballroom dancing.', secrets: [
      ['Is training for a dance competition on TV.', ['Move your feet a little while you talk.', 'Get very excited about “the big night.”'], 'Say you need to “save your knees for Saturday.”'],
      ['Only took it up to win back an ex.', ['Get wistful about your dance partner.', 'Change the subject if love comes up.'], 'Say your ex “always wanted to waltz.”'],
      ['Has stepped on every partner’s feet.', ['Brag about dancing, then wince.', 'Get vague about your partners.'], 'Say your instructor “now wears steel-toed shoes.”']] },
    { fact: 'Has strong opinions about pizza toppings.', secrets: [
      ['Secretly puts ketchup on pizza.', ['Defend weird toppings with passion.', 'Get cagey when anyone asks your order.'], 'Say ketchup is “basically tomato sauce.”'],
      ['Got fired from a pizza place for “creative toppings.”', ['Talk about pizza like a lost career.', 'Get defensive about your ideas.'], 'Say the world “isn’t ready for pickle pizza.”'],
      ['Has never actually eaten pizza.', ['Have strong opinions, but no details.', 'Get vague when asked your favorite slice.'], 'Ask “is it good hot?”']] },
    { fact: 'Is the self-appointed mayor of the apartment building.', secrets: [
      ['Is secretly running for real mayor.', ['Shake the Peddler’s hand like you’re campaigning.', 'Talk about “the community” a lot.'], 'Say “I’d appreciate your vote. For… anything.”'],
      ['Has a key to every apartment in the building.', ['Know oddly specific things about the neighbors.', 'Get cagey about keys.'], 'Say you have “access to all areas.”'],
      ['Is three months behind on their own rent.', ['Talk big about the building, then get nervous about the landlord.', 'Change the subject when money comes up.'], 'Say the landlord is “a misunderstanding.”']] },
    { fact: 'Travels constantly for work and misses home.', secrets: [
      ['Isn’t traveling for work at all: they tour with a cover band.', ['Get vague about your job title.', 'Hum when travel comes up.'], 'Say you play “a lot of hotel lobbies.”'],
      ['Got fired months ago and still pretends to travel.', ['Talk about trips with no details.', 'Get nervous when work comes up.'], 'Say your next “meeting” is at the beach.'],
      ['Is a professional mall Santa every December.', ['Get vague about what you do in winter.', 'Say “ho ho” once, then cough.'], 'Say your work trips are “mostly up north.”']] },
    { fact: 'Has never once been on time for anything.', secrets: [
      ['Has a doctor’s note saying they’re allergic to clocks.', ['Defend being late like it’s medical.', 'Avoid looking at any clock.'], 'Say you have “a condition.”'],
      ['Is secretly early to everything and hides around the corner.', ['Act casual about being late, but know exactly what happened before you “arrived.”', 'Get vague about where you were.'], 'Say “I just got here,” too quickly.'],
      ['Missed their own wedding.', ['Get quiet when weddings come up.', 'Over-explain why you’re late.'], 'Say your spouse “has forgiven you. Mostly.”']] }
  ];
  C.backgrounds = C.funFacts.map((f) => f.fact);
  C.secrets = [];
  C.funFacts.forEach((f, i) => f.secrets.forEach(([text, act, say]) => {
    C.secrets.push({ text, topic: 'ff' + i, fact: f.fact, hints: act.concat('Try this: ' + say) });
  }));

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
    daddy: { id: 'daddy', name: 'DADDY MADE A CALL', price: 125, when: 'Fact-Finding through the Close', effect: 'Require a Prospect to complete a brief, funny challenge.' },
    insider: { id: 'insider', name: 'INSIDE TRADING', price: 100, when: 'Fact-Finding', effect: 'Secretly peek at one Philanthropist’s Secret Sleuth guess for any Prospect.' }
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
