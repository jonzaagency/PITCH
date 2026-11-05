/* P!TCH card decks and prospect profile pieces.
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
  // PROSPECT STORIES. Each Prospect gets a fun fact (everyone sees it) and a secret (only they see it),
  // and both are tied to the product: when the Peddler picks an Item, every Prospect gets a story from
  // that Item's theme. {item} becomes the Peddler's Item, e.g. "hot tub".
  // Each story is { fact, ask: the Peddler's opening question, secret, act: [two ways to act it out], try: one line to try }.
  // Secret Sleuth uses other stories from the same theme as decoys, so keep at least 6 per theme.
  // To add one: add a story to any theme. To add an Item, put it in C.items and in one theme's `items`.
  C.themes = [
    { id: 'water', items: ['Rubber duck', 'Bathtub', 'Fishbowl', 'Shower cap', 'Pool noodle', 'Hot tub', 'Garden hose', 'Ice cube tray', 'Umbrella'], stories: [
      { fact: 'Grew up next to a public pool and still smells like chlorine.', ask: 'What’s your morning shower routine like?', secret: 'Is terrified of hot water. Showers are cold, every day.',
        act: ['Shiver a little when anything warm and wet comes up.', 'Brag about how “refreshing” cold showers are, a bit too hard.'], try: 'Ask whether the {item} comes in an “ice-cold only” version.' },
      { fact: 'Takes three baths a day “for the vibes.”', ask: 'When were you last in the ocean?', secret: 'Has never actually learned to swim.',
        act: ['Talk big about water, then dodge anything deeper than a bathtub.', 'Change the subject when beaches or pools come up.'], try: 'Ask if the {item} works “in shallow water only.”' },
      { fact: 'Lifeguarded one summer in 1994 and still mentions it.', ask: 'Why did you stop lifeguarding?', secret: 'Got fired from lifeguarding for napping in the pool.',
        act: ['Bring up your lifeguard days proudly, then get vague about how it ended.', 'Yawn whenever water comes up.'], try: 'Say you “just rest your eyes” near water.' },
      { fact: 'Waters their houseplants with a spray bottle named Gerald.', ask: 'How do you get along with your neighbors?', secret: 'Is in a years-long feud with the neighbor over water pressure.',
        act: ['Get tense whenever neighbors come up.', 'Talk about water pressure like it’s personal.'], try: 'Say the {item} “better not end up on Doug’s side of the fence.”' },
      { fact: 'Refuses to own an umbrella on principle.', ask: 'What do you do when it rains?', secret: 'Is secretly terrified of getting their hair wet.',
        act: ['Touch your hair protectively when water comes up.', 'Ask very specific questions about splashing.'], try: 'Ask whether the {item} has “a splash guard for the hair.”' },
      { fact: 'Fills every free hour with bubble baths.', ask: 'Ever had a disaster at home?', secret: 'Once flooded an entire apartment building.',
        act: ['Get jumpy if anyone mentions leaks or plumbing.', 'Insist everything is “fully under control now.”'], try: 'Ask if the {item} comes with an emergency shut-off. Twice.' }] },
    { id: 'kitchen', items: ['Toaster', 'Lunchbox', 'Pizza cutter', 'Waffle iron', 'Rolling pin', 'Pickle jar', 'Teapot', 'Slow cooker', 'Salad spinner'], stories: [
      { fact: 'Hosts a famous Sunday brunch for the whole street.', ask: 'What’s your secret recipe?', secret: 'Secretly buys everything frozen and reheats it.',
        act: ['Brag about your cooking, then go vague on recipes.', 'Mention the microwave a little too fondly.'], try: 'Ask if the {item} can “make store-bought look homemade.”' },
      { fact: 'Has entered the county pie contest nine years in a row.', ask: 'How many times have you won?', secret: 'Has never once won, and is plotting revenge on the judges.',
        act: ['Get competitive whenever food comes up.', 'Mention “the judges” with a dark look.'], try: 'Say “this year is MY year” about the {item}.' },
      { fact: 'Eats the exact same lunch every single day.', ask: 'When did you last try a new food?', secret: 'Is terrified of trying new foods.',
        act: ['Look nervous when the Peddler describes anything unusual.', 'Ask what the {item} “normally” makes.'], try: 'Ask “has anyone ever gotten sick from the {item}?”' },
      { fact: 'Owns more kitchen gadgets than plates.', ask: 'Which gadget do you use the most?', secret: 'Has never actually used a single one of them.',
        act: ['Brag about your gadgets, never about using them.', 'Ask how to turn things on.'], try: 'Ask where the on button is on the {item}. Then ask again.' },
      { fact: 'Was once a contestant on a TV cooking show.', ask: 'How far did you get on the show?', secret: 'Got eliminated in the first round for burning water.',
        act: ['Talk about the show proudly, but go vague on how far you got.', 'Wince at the word “burn.”'], try: 'Say you’re “more of a judge than a cook now.”' },
      { fact: 'Bakes bread every weekend and gives it to the neighbors.', ask: 'Do you ever eat your own bread?', secret: 'Is allergic to wheat and has never tasted their own bread.',
        act: ['Rave about bread, then sneeze.', 'Politely push away any food that comes up.'], try: 'Ask if the {item} is “gluten-free,” very seriously.' }] },
    { id: 'fitness', items: ['Bowling ball', 'Trampoline', 'Pogo stick', 'Unicycle', 'Yoga mat', 'Hula hoop', 'Treadmill', 'Bicycle helmet', 'Ski goggles'], stories: [
      { fact: 'Has had a gym membership for 12 years running.', ask: 'What’s your favorite machine at the gym?', secret: 'Has never once gone inside the gym.',
        act: ['Talk about “working out” with zero details.', 'Get vague about which gym.'], try: 'Ask if the {item} counts as “cardio just by looking at it.”' },
      { fact: 'Was the high school bowling champion.', ask: 'How did you win the championship?', secret: 'Won the championship with a secretly weighted ball.',
        act: ['Brag about the trophy, get cagey about the ball.', 'Get defensive about the word “fair.”'], try: 'Ask if the {item} is “tournament legal.”' },
      { fact: 'Runs five miles every morning before work.', ask: 'What’s your running route?', secret: 'Actually takes the bus and jogs the last block.',
        act: ['Look a little too fresh for someone who “just ran.”', 'Know the bus schedule by heart.'], try: 'Ask if the {item} has “a shortcut mode.”' },
      { fact: 'Teaches a weekend yoga class.', ask: 'What’s the hardest pose for you?', secret: 'Can’t touch their own toes.',
        act: ['Talk about flexibility, then avoid bending.', 'Wince whenever anyone mentions stretching.'], try: 'Ask if the {item} works “for people who prefer sitting.”' },
      { fact: 'Went to circus school for one week in college.', ask: 'Why only one week?', secret: 'Got kicked out for juggling the teacher’s phone. And dropping it.',
        act: ['Brag about your circus skills, then trail off.', 'Change the subject when phones come up.'], try: 'Offer to “demonstrate” on the {item}, then don’t.' },
      { fact: 'Bikes to work in every kind of weather.', ask: 'What’s the scariest part of your ride?', secret: 'Is terrified of going downhill.',
        act: ['Go pale when anyone mentions hills or slopes.', 'Ask how the {item} handles “steep stuff.”'], try: 'Ask if the {item} has brakes. Really good brakes.' }] },
    { id: 'party', items: ['Kazoo', 'Disco ball', 'Accordion', 'Tuba', 'Megaphone', 'Wind chime', 'Lava lamp', 'Mood ring'], stories: [
      { fact: 'Throws a themed party every single month.', ask: 'Who came to your last party?', secret: 'Hasn’t had a single guest show up since March.',
        act: ['Rave about your parties, then go quiet about who came.', 'Invite the Peddler to everything.'], try: 'Ask if the {item} “works for a party of one.”' },
      { fact: 'Played in the marching band for 20 years.', ask: 'How did you learn all your parts?', secret: 'Can’t read music and has faked it the whole time.',
        act: ['Talk about music with big words and no details.', 'Hum confidently, a little off-key.'], try: 'Ask if the {item} “comes with the notes already in it.”' },
      { fact: 'Was a wedding DJ for a decade.', ask: 'What’s on your go-to playlist?', secret: 'Only knows three songs.',
        act: ['Name the same song twice.', 'Get nervous when anyone asks for a request.'], try: 'Ask if the {item} can “play the Electric Slide on loop.”' },
      { fact: 'Believes everything happens because of the stars.', ask: 'Where do you get your horoscopes?', secret: 'Secretly writes the horoscopes for the local paper. Makes them all up.',
        act: ['Ask the Peddler their sign, then predict something silly.', 'Get defensive about “accuracy.”'], try: 'Say the {item} has “very Scorpio energy.”' },
      { fact: 'Sang backup on a song that was almost a hit.', ask: 'Why didn’t the song make it?', secret: 'Was cut from the final recording and is still bitter.',
        act: ['Get wistful when music comes up.', 'Hum the chorus of a song nobody knows.'], try: 'Ask if the {item} “gives credit where credit is due.”' },
      { fact: 'Has a karaoke machine in every room.', ask: 'What’s your karaoke song?', secret: 'Is terrified of singing in front of people.',
        act: ['Rave about karaoke, then refuse to sing.', 'Get flustered whenever anyone says “perform.”'], try: 'Ask if the {item} works “with the lights off.”' }] },
    { id: 'lounge', items: ['Lawn chair', 'Hammock', 'Rocking chair', 'Bean bag chair', 'Recliner', 'Ceiling fan', 'Sleeping bag'], stories: [
      { fact: 'Takes naps so seriously they keep a nap schedule.', ask: 'How do you sleep at night?', secret: 'Hasn’t slept a full night since 2015.',
        act: ['Yawn a lot, then deny being tired.', 'Talk about sleep like a lost love.'], try: 'Ask if the {item} is “nap certified.”' },
      { fact: 'Has the comfiest living room on the block.', ask: 'Do the neighbors come over a lot?', secret: 'Secretly charges the neighbors to sit in it.',
        act: ['Get very businesslike about comfort.', 'Mention “seat fees” by accident.'], try: 'Ask what the {item} would rent for “per hour.”' },
      { fact: 'Went camping every summer as a kid.', ask: 'What was camping like at night?', secret: 'Is secretly terrified of the dark.',
        act: ['Talk about camping, then shudder at the word “night.”', 'Ask whether things “glow.”'], try: 'Ask if the {item} comes with a night-light.' },
      { fact: 'Retired early and loves to relax.', ask: 'What do you do all day?', secret: 'Is bored out of their mind and desperate for adventure.',
        act: ['Say you love relaxing in a very tense voice.', 'Perk up at anything exciting.'], try: 'Ask if the {item} “goes fast.” Hopefully.' },
      { fact: 'Has a recliner with its own name.', ask: 'Any recliner horror stories?', secret: 'Got stuck in it for six hours last week.',
        act: ['Get nervous about anything that folds or tilts.', 'Ask about “the emergency exit.”'], try: 'Ask if the {item} has an eject button.' },
      { fact: 'Works from home in the comfiest chair possible.', ask: 'Ever had an embarrassing work call?', secret: 'Fell asleep on a video call with the CEO.',
        act: ['Get jumpy when anyone mentions meetings.', 'Insist you are “very alert.”'], try: 'Ask if the {item} “keeps you awake, legally speaking.”' }] },
    { id: 'yard', items: ['Garden gnome', 'Leaf blower', 'Wheelbarrow', 'Scarecrow', 'Mailbox', 'Traffic cone', 'Step ladder'], stories: [
      { fact: 'Has the best-kept lawn on the street.', ask: 'What time do you usually mow?', secret: 'Pays a teenager to do all of it at 5 a.m.',
        act: ['Brag about your lawn with no details.', 'Look at your hands like they’ve never done yard work.'], try: 'Ask if the {item} “does the work while you sleep.”' },
      { fact: 'Collects garden gnomes. Has 87 of them.', ask: 'Where did you find all your gnomes?', secret: 'Steals gnomes from the neighbors’ yards.',
        act: ['Get cagey about where your gnomes came from.', 'Glance over your shoulder at the word “neighbor.”'], try: 'Ask if the {item} is “easy to carry quietly.”' },
      { fact: 'Runs the neighborhood association.', ask: 'What’s your favorite rule?', secret: 'Wrote all the rules just to annoy one neighbor.',
        act: ['Mention “the rules” a lot.', 'Get dark when one particular neighbor comes up.'], try: 'Ask if the {item} is “against the bylaws.” Hopefully.' },
      { fact: 'Spends every weekend fixing up the house.', ask: 'Do you ever work on the roof?', secret: 'Is terrified of ladders and heights.',
        act: ['Talk about projects, never about anything high up.', 'Look down whenever anyone says “roof.”'], try: 'Ask if the {item} works “from the ground.”' },
      { fact: 'Checks the mail six times a day.', ask: 'Who are you waiting to hear from?', secret: 'Is waiting on a letter from a secret pen pal in Iceland.',
        act: ['Perk up at the word “mail.”', 'Get vague about who writes to you.'], try: 'Ask if the {item} works “internationally.”' },
      { fact: 'Grows prize-winning pumpkins.', ask: 'What’s your growing secret?', secret: 'Buys the pumpkins at the farmers market every year.',
        act: ['Brag about your pumpkins, get vague about growing them.', 'Change the subject when seeds come up.'], try: 'Ask if the {item} “comes with a receipt you can hide.”' }] },
    { id: 'style', items: ['Sock', 'Hairbrush', 'Fanny pack', 'Cowboy boots', 'Tiara', 'Backpack', 'Shopping cart'], stories: [
      { fact: 'Has never been seen without a fanny pack.', ask: 'What’s in the fanny pack?', secret: 'Keeps an emergency rubber chicken in it at all times.',
        act: ['Pat your hip protectively.', 'Get cagey when anyone asks what you carry.'], try: 'Ask if the {item} has “a secret pocket for… things.”' },
      { fact: 'Shops at the mall every single weekend.', ask: 'What’s your favorite thing you’ve bought?', secret: 'Returns everything they buy on Monday.',
        act: ['Brag about buying things, never about owning them.', 'Ask about the return policy right away.'], try: 'Ask how long you can “borrow” the {item} before returning it.' },
      { fact: 'Was a pageant queen in 1998.', ask: 'Do you still have the crown?', secret: 'Still wears the tiara at home every night.',
        act: ['Touch your head like something should be there.', 'Wave like royalty, then stop.'], try: 'Ask if the {item} “comes in sparkly.”' },
      { fact: 'Owns 40 pairs of cowboy boots.', ask: 'Where do you go riding?', secret: 'Has never once been on a horse.',
        act: ['Talk like a cowboy, but dodge every horse question.', 'Say “yeehaw” once, nervously.'], try: 'Ask if the {item} is “horse-optional.”' },
      { fact: 'Is known for having perfect hair every day.', ask: 'What’s your hair routine?', secret: 'Has been wearing a wig since 2010.',
        act: ['Touch your hair very carefully.', 'Panic a little at the word “wind.”'], try: 'Ask if the {item} is “safe for hair that might not be yours.”' },
      { fact: 'Has the most organized backpack in history.', ask: 'Can I see what’s inside?', secret: 'Has a whole sandwich from 2019 in the bottom pocket.',
        act: ['Brag about organization, avoid opening any bags.', 'Sniff the air suspiciously.'], try: 'Ask if the {item} has “a pocket you never have to open.”' }] },
    { id: 'gadgets', items: ['Stapler', 'Paperclip', 'Doorbell', 'Phone booth', 'Cuckoo clock', 'Baby monitor', 'Bubble wrap', 'Snow globe', 'Toilet plunger', 'Fire extinguisher'], stories: [
      { fact: 'Is the office tech genius everyone asks for help.', ask: 'How do you fix things so fast?', secret: 'Just turns everything off and on again.',
        act: ['Use big tech words, then go vague.', 'Suggest “restarting” anything that comes up.'], try: 'Ask if the {item} has an off button and an on button. Both, ideally.' },
      { fact: 'Is obsessed with being on time.', ask: 'Were you on time today?', secret: 'Is late for everything and blames the clocks.',
        act: ['Check the time constantly.', 'Blame “the clocks” for anything that goes wrong.'], try: 'Ask if the {item} “keeps accurate time,” suspiciously.' },
      { fact: 'Has a security camera on every door.', ask: 'Who are you keeping an eye out for?', secret: 'Is hiding from a very persistent salesperson.',
        act: ['Glance nervously at the door.', 'Get suspicious of the Peddler.'], try: 'Ask if the {item} can “screen visitors.”' },
      { fact: 'Collects snow globes from every city they visit.', ask: 'What’s your favorite city you’ve visited?', secret: 'Has never left their home state. Buys them all online.',
        act: ['Name cities, then get vague about visiting them.', 'Change the subject when travel comes up.'], try: 'Ask if the {item} “makes it look like you’ve traveled.”' },
      { fact: 'Is the safety officer at work.', ask: 'Any incidents at work lately?', secret: 'Set off the fire sprinklers at the company holiday party.',
        act: ['Tense up at the words “fire” or “alarm.”', 'Insist safety is “very important now.”'], try: 'Ask if the {item} is “sprinkler-safe.”' },
      { fact: 'Pops bubble wrap to relax.', ask: 'Where do you keep all that bubble wrap?', secret: 'Has a whole spare room filled with bubble wrap.',
        act: ['Get dreamy whenever anything “pops.”', 'Ask about packaging before the product.'], try: 'Ask if the {item} comes “really, REALLY well wrapped.”' }] }
  ];
  C.themeOf = (item) => C.themes.find((t) => t.items.indexOf(item) >= 0) || C.themes[0];
  /** A story told for one Item: the fun fact, the secret and the Prospect's hints, with {item} filled in. */
  const PLURAL_ITEMS = ['Cowboy boots', 'Ski goggles'];
  const PLURAL_VERB = { is: 'are', has: 'have', comes: 'come', works: 'work', does: 'do', goes: 'go', keeps: 'keep', makes: 'make', gives: 'give', counts: 'count' };
  C.tell = (theme, i, item) => {
    const name = String(item || 'product').toLowerCase();
    const plural = PLURAL_ITEMS.indexOf(item) >= 0;
    // "the cowboy boots is" -> "the cowboy boots are"
    const fill = (x) => {
      const out = x.replace(/\{item\}/g, name);
      return plural ? out.replace(new RegExp('(' + name + ') (“?)(' + Object.keys(PLURAL_VERB).join('|') + ')\\b', 'g'), (m, n, q, v) => n + ' ' + q + PLURAL_VERB[v]) : out;
    };
    const st = theme.stories[i];
    return { key: theme.id + i, topic: theme.id, fact: st.fact, ask: st.ask, secret: fill(st.secret), hints: st.act.map(fill).concat('Try this: ' + fill(st.try)) };
  };

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
  // Investor objections: during the pitch, Investors vote one of these onto a Prospect's phone,
  // and the Prospect performs it out loud, in character.
  C.investorObjections = [
    '“I object! This would never fit in my apartment.”',
    '“Hold on. What happens if it breaks on day one?”',
    'Stand up and say: “My cousin sells this for half the price.”',
    '“Is this even legal in this state?”',
    'Gasp loudly, then ask: “Does it come in beige?”',
    '“I object! My dog would hate this.”',
    'Ask the Peddler to demonstrate it. Right now.',
    '“Who exactly asked for this?”',
    'Whisper loudly: “Is this a pyramid scheme?”',
    '“I don’t trust anything with buttons.”',
    'Object in a dramatic soap-opera voice.',
    '“My horoscope says no.”',
    'Ask for a discount. Then ask for a bigger one.',
    'Object by singing it: “Too expensive!”',
    '“I need to ask my mom first.”',
    'Ask: “What’s the return policy, exactly?”',
    'Slowly shake your head and say: “Nope. Not convinced.”',
    '“I saw this on the news, and not in a good way.”',
    'Like a TV lawyer: “Objection, Your Honor!”',
    'Ask the Peddler to prove it works. On you.',
    '“Does it come with a warranty? A long one?”',
    'Pretend to faint at the price.',
    '“Will this make my neighbors jealous? Because it needs to.”',
    'Ask: “Can I get one that’s quieter? And smaller? And free?”'
  ];

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
    insider: { id: 'insider', name: 'INSIDE TRADING', price: 100, when: 'Fact-Finding', effect: 'Secretly peek at one Investor’s Secret Sleuth guess for any Prospect.' }
  };

  // The six Investor scoring categories, $0-$50 each (rulebook section 9).
  C.categories = [
    { id: 'invention', name: 'Invention', hint: 'Product concept, name, and how well the invention is presented.' },
    { id: 'ingenuity', name: 'Ingenuity', hint: 'Originality, creative thinking, and adaptation under pressure.' },
    { id: 'factFinding', name: 'Fact-Finding', hint: 'Questions, listening, follow-ups, and discoveries across Prospects.' },
    { id: 'objections', name: 'Overcoming Objections', hint: 'Direct, confident, credible handling of SCREW! and customer concerns.' },
    { id: 'pitch', name: 'Overall Pitch', hint: 'Persuasion, clear value, and delivery.' },
    { id: 'close', name: 'The Close', hint: 'Clear call to action and appropriate request for commitment.' }
  ];

  // Scoring anchors: what each $10 band means in every category, so Investors score the same way.
  C.scoreAnchors = [
    { min: 0, max: 10, name: 'Little or none', desc: 'Little or no demonstration of the skill.' },
    { min: 11, max: 20, name: 'Weak', desc: 'Attempted, but weak or incomplete.' },
    { min: 21, max: 30, name: 'Acceptable', desc: 'Did the job. Solid, nothing special.' },
    { min: 31, max: 40, name: 'Strong', desc: 'Clear, confident and convincing.' },
    { min: 41, max: 50, name: 'Outstanding', desc: 'Memorable. The best you’ve seen tonight.' }
  ];
  C.anchorFor = (v) => C.scoreAnchors.find((a) => Number(v) <= a.max) || C.scoreAnchors[C.scoreAnchors.length - 1];
})(window.PITCH = window.PITCH || {});
