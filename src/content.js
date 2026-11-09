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

  // Peddler deck 2 of 2: what the invention does. Mostly wacky; each hand also gets 1-2 boring ones (below).
  C.functions = [
    'Narrates your life like a nature documentary', 'Translates what your cat is plotting', 'Yells motivational quotes at 3 a.m.',
    'Plays dramatic music when you enter a room', 'Gives you a standing ovation for doing chores', 'Writes your breakup texts',
    'Hypnotizes your in-laws', 'Summons a tiny rain cloud over your enemies', 'Makes everything taste like birthday cake',
    'Turns your sneezes into glitter', 'Negotiates with your toddler', 'Teaches your houseplants French',
    'Finds your missing socks in another dimension', 'Gives brutally honest fashion advice', 'Makes you 4% taller on weekends',
    'Talks to ghosts (badly)', 'Grows you a mustache on command', 'Launches confetti every time you get an email',
    'Turns awkward silences into smooth jazz', 'Replies-all to every email for you', 'Cancels your plans so you don’t have to',
    'Turns any food into soup', 'Rates your dance moves out loud', 'Hatches a baby dragon every Tuesday',
    'Gets you out of jury duty', 'Makes your boss forget about meetings', 'Bakes cookies using only moonlight',
    'Teleports your keys back to you, eventually', 'Detects lies, but only from pigeons', 'Hires a mariachi band on demand',
    'Predicts who will win every argument', 'Smells exactly like your grandma’s house', 'Sings your name like an opera star',
    'Hides vegetables in your dessert', 'Turns Mondays into Fridays (emotionally)', 'Reads your dog’s diary out loud',
    'Shrinks your problems to the size of a grape', 'Wins staring contests for you', 'Makes you sound smart on video calls',
    'Scares away raccoons with interpretive dance', 'Writes thank-you notes in your handwriting', 'Composes a theme song for your commute',
    'Cures hiccups by startling you constantly', 'Tells your neighbors exactly what you think of them', 'Makes popcorn using pure enthusiasm',
    'Plays chess against you and gloats', 'Records your dreams and posts the good ones', 'Gives compliments, but sarcastically'
  ];
  // A couple of plain, sensible Functions go into every hand, for Peddlers who want to play it straight.
  C.boringFunctions = [
    'Charges your phone', 'Tells the time', 'Keeps drinks cold', 'Has a built-in flashlight', 'Folds laundry',
    'Counts your steps', 'Holds snacks', 'Has a USB port', 'Blocks spam calls', 'Doubles as a coaster',
    'Waters your plants', 'Reminds you of birthdays', 'Purifies the air', 'Sorts the recycling'
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
  // PROSPECT STORIES. Every Item has its own 3 stories, so each Prospect's fun fact (everyone sees it),
  // opening line, secret (only they see it) and hints are about the Peddler's actual product.
  // Each story: { fact, open: the Prospect's opening line, ask: the Peddler's paid hint question,
  //               secret, act: [two ways to act it out], try: one line to try }.
  // To add a story or an Item: add it here (and put a new Item in C.items and one theme below).
  C.productStories = {
    "Rubber duck": [
      { fact: "Has a collection of 300 rubber ducks.", open: "I brought a friend. *pulls out a rubber duck* His name is Kevin.", ask: "Who’s your favorite duck?",
        secret: "Talks to the rubber ducks every night, and they “talk back.”", act: ["Pause like you’re listening to someone nobody else can hear.", "Mention that Kevin “has opinions” about things."], try: "Ask if the rubber duck can “keep up a conversation.”" },
      { fact: "Takes three bubble baths a day.", open: "I smell like lavender because I just got out of the tub. Again.", ask: "What do you do in the bath for so long?",
        secret: "Is terrified of real ducks.", act: ["Get jumpy if anyone mentions ponds or parks.", "Insist rubber ones are “the only safe kind.”"], try: "Ask if the rubber duck “definitely won’t quack at you.”" },
      { fact: "Won a rubber duck race at the county fair.", open: "Two-time rubber duck race champion. Ask me how.", ask: "How did you win the duck race?",
        secret: "Cheated by putting a tiny motor in their duck.", act: ["Get defensive whenever anyone says “fair.”", "Know way too much about tiny engines."], try: "Ask if the rubber duck “comes with a motor option.”" }],
    "Bathtub": [
      { fact: "Just renovated their bathroom.", open: "You should see my new bathroom. Actually, you shouldn’t. It’s… complicated.", ask: "How did the bathroom renovation go?",
        secret: "Installed the bathtub upside down and is too proud to admit it.", act: ["Change the subject when plumbing comes up.", "Insist everything is “exactly how I wanted it.”"], try: "Ask if the bathtub “works either way up.”" },
      { fact: "Reads a whole novel in the bath every week.", open: "Excuse the wrinkly fingers. Long bath. Long book.", ask: "What are you reading in the tub lately?",
        secret: "Has dropped eleven library books in the bath and is banned from the library.", act: ["Get nervous when anyone mentions libraries.", "Ask whether things are “waterproof,” very often."], try: "Ask if the bathtub has “a dry shelf for books.”" },
      { fact: "Grew up in a family of eight with one bathroom.", open: "Eight siblings, one bathroom. I can shower in ninety seconds flat.", ask: "What were mornings like in your house?",
        secret: "Has never had a bath alone in their life. Someone is always knocking.", act: ["Look over your shoulder like someone’s waiting.", "Get emotional about the word “privacy.”"], try: "Ask if the bathtub “has a lock that actually works.”" }],
    "Fishbowl": [
      { fact: "Has had the same goldfish since 2003.", open: "Bubbles says hello. Bubbles is twenty-one years old.", ask: "How old is your goldfish now?",
        secret: "Has secretly replaced “Bubbles” nine times.", act: ["Get cagey about pet store receipts.", "Insist Bubbles is “the original.”"], try: "Ask if the fishbowl “keeps a fish looking the same forever.”" },
      { fact: "Works as an aquarium tour guide.", open: "I’ll be watching this pitch closely. Like a fish watching the glass.", ask: "What’s your favorite fish at the aquarium?",
        secret: "Can’t swim and is scared of fish touching them.", act: ["Shudder at the word “slimy.”", "Only admire fish from behind glass."], try: "Ask if the fishbowl has “a very thick wall.”" },
      { fact: "Won a goldfish at a carnival as a kid and never got over it.", open: "I’m good at carnival games. Very good. Ask me anything.", ask: "What’s your best carnival game?",
        secret: "Lost the carnival goldfish on the bus home and still dreams about it.", act: ["Get misty-eyed about goldfish.", "Ask whether things are “bus-safe.”"], try: "Ask if the fishbowl has “a lid for public transport.”" }],
    "Shower cap": [
      { fact: "Is known for having perfect hair every day.", open: "Please don’t open a window. The hair is perfect today.", ask: "What’s your hair routine?",
        secret: "Has been wearing a wig since 2010.", act: ["Touch your hair very carefully.", "Panic a little at the word “wind.”"], try: "Ask if the shower cap is “safe for hair that might not be yours.”" },
      { fact: "Sings in the shower so loudly the neighbors applaud.", open: "My neighbors call me “the Shower Singer.” It’s a compliment. Mostly.", ask: "What do you sing in the shower?",
        secret: "Only knows the first line of every song.", act: ["Start a song and trail off.", "Hum confidently, then stop."], try: "Ask if the shower cap “helps you remember lyrics.”" },
      { fact: "Works as a hotel housekeeper.", open: "I’ve seen every hotel bathroom in this city. Every. One.", ask: "What’s the strangest thing you’ve found in a hotel?",
        secret: "Takes home a shower cap from every room and has 4,000 of them.", act: ["Get cagey about storage space.", "Say you “never buy” anything for the bathroom."], try: "Ask if the shower cap “comes in bulk. Like, really bulk.”" }],
    "Pool noodle": [
      { fact: "Teaches water aerobics at the community pool.", open: "Water aerobics, Tuesdays and Thursdays. My students adore me.", ask: "What’s your hardest water aerobics move?",
        secret: "Can’t actually swim and never goes past the shallow end.", act: ["Stay vague about “deep water.”", "Clutch an invisible noodle when water comes up."], try: "Ask if the pool noodle “works as a life jacket. Asking for a friend.”" },
      { fact: "Throws a big pool party every summer.", open: "You’re invited to my pool party. Bring a noodle.", ask: "What’s the best part of your pool parties?",
        secret: "Doesn’t have a pool. Fills a kiddie pool and calls it “the lagoon.”", act: ["Get vague about the size of the pool.", "Say “it’s more of an intimate pool.”"], try: "Ask if the pool noodle “makes small pools look bigger.”" },
      { fact: "Lifeguarded one summer in college.", open: "Former lifeguard. I can spot trouble a mile away.", ask: "Why did you stop lifeguarding?",
        secret: "Got fired for falling asleep on a pool noodle.", act: ["Yawn whenever water comes up.", "Say you “just rest your eyes” sometimes."], try: "Ask if the pool noodle “is comfy enough to nap on. Hypothetically.”" }],
    "Hot tub": [
      { fact: "Grew up next to a public pool and still smells like chlorine.", open: "Sorry about the smell. Chlorine. It never really washes out.", ask: "What’s your shower routine like?",
        secret: "Is terrified of hot water. Showers are cold, every day.", act: ["Shiver a little when anything warm and wet comes up.", "Brag about cold showers a bit too hard."], try: "Ask whether the hot tub comes in an “ice-cold only” version." },
      { fact: "Just bought a house with a hot tub.", open: "New house, new hot tub. Life is good. Very relaxing.", ask: "How often do you use the hot tub?",
        secret: "Got stuck in the hot tub at the office party and the fire department came.", act: ["Tense up at the words “fire department.”", "Talk about hot tubs like a war story."], try: "Ask if the hot tub has “an easy exit. A really easy exit.”" },
      { fact: "Runs a spa in the next town.", open: "Welcome. Breathe in. Breathe out. I run a spa.", ask: "What’s the most popular thing at your spa?",
        secret: "The “luxury spa” is their backyard with a kiddie pool and a kettle.", act: ["Get vague about the address.", "Call everything “boutique.”"], try: "Ask if the hot tub “would make a backyard look like a real spa.”" }],
    "Garden hose": [
      { fact: "Has the greenest lawn on the street.", open: "You may have noticed my lawn. Everyone notices my lawn.", ask: "How do you keep your lawn so green?",
        secret: "Waters it with the neighbor’s hose every night.", act: ["Glance over your shoulder at the word “neighbor.”", "Get defensive about your water bill."], try: "Ask if the garden hose “is long enough to reach next door.”" },
      { fact: "Runs the neighborhood car wash fundraiser.", open: "Car wash this Saturday! For charity. Mostly.", ask: "What’s the money for this year?",
        secret: "Keeps the car wash money to build a tiki bar in their garage.", act: ["Get vague about where the money goes.", "Mention tiki torches out of nowhere."], try: "Ask if the garden hose “doubles as a party decoration.”" },
      { fact: "Is a volunteer firefighter.", open: "Volunteer firefighter. I’m very good with a hose.", ask: "What was your last call like?",
        secret: "Has never put out a fire. Mostly rescues cats from trees.", act: ["Get modest, then change the subject.", "Mention cats a lot."], try: "Ask if the garden hose “works on cats stuck in trees.”" }],
    "Ice cube tray": [
      { fact: "Makes fancy cocktails for every party.", open: "I’ll be making the drinks at your next party. You’re welcome.", ask: "What’s your signature drink?",
        secret: "Has never tasted a single one of their own cocktails.", act: ["Describe drinks by color, not taste.", "Politely refuse any drink offered."], try: "Ask if the ice cube tray “makes drinks taste better without tasting them.”" },
      { fact: "Hates summer more than anything.", open: "Is it hot in here? It’s hot in here. I hate summer.", ask: "How do you survive the summer?",
        secret: "Sleeps with a bag of ice cubes every night.", act: ["Fan yourself constantly.", "Ask for the air conditioning to be turned up."], try: "Ask if the ice cube tray “makes enough ice to sleep on.”" },
      { fact: "Is a professional ice sculptor.", open: "Ice sculptor. Weddings, mostly. Swans. So many swans.", ask: "What’s the hardest sculpture you’ve made?",
        secret: "Every sculpture is just ice cubes glued together.", act: ["Get defensive about the word “real.”", "Talk about “technique” with no details."], try: "Ask if the ice cube tray “makes cubes that stick together.”" }],
    "Umbrella": [
      { fact: "Refuses to own an umbrella on principle.", open: "If it rains during this pitch, I’m not sharing anyone’s umbrella.", ask: "What do you do when it rains?",
        secret: "Lost a fight with an umbrella in a windstorm and is still scared of them.", act: ["Flinch when anything opens suddenly.", "Say umbrellas are “unpredictable.”"], try: "Ask if the umbrella “stays calm in the wind.”" },
      { fact: "Has an umbrella for every occasion.", open: "I have an umbrella for every outfit. Every single one.", ask: "Where do you get all your umbrellas?",
        secret: "Has never bought one. Takes them from restaurant umbrella stands.", act: ["Get cagey about where things come from.", "Mention restaurants a little too often."], try: "Ask if the umbrella “comes without someone else’s name tag.”" },
      { fact: "Is the local TV weatherperson.", open: "Good evening! Expect sunshine and a strong sales pitch.", ask: "What’s your forecast for tomorrow?",
        secret: "Has never predicted the weather right and just guesses.", act: ["Answer any question with “partly cloudy.”", "Get defensive about “accuracy.”"], try: "Ask if the umbrella “predicts the weather so you don’t have to.”" }],
    "Toaster": [
      { fact: "Eats toast for every meal.", open: "Toast for breakfast, toast for lunch. Guess what’s for dinner.", ask: "What’s your favorite thing on toast?",
        secret: "Has burned down two kitchens making toast.", act: ["Get nervous at the word “smoke.”", "Mention your “brand new” kitchen a lot."], try: "Ask if the toaster “has a fire extinguisher built in.”" },
      { fact: "Runs a famous breakfast café.", open: "Welcome! I run the best breakfast spot in town.", ask: "What’s the secret to your café’s breakfast?",
        secret: "The café’s toast is bought frozen from a gas station.", act: ["Get vague about suppliers.", "Call everything “artisanal.”"], try: "Ask if the toaster “makes gas station bread look homemade.”" },
      { fact: "Collects vintage kitchen appliances.", open: "I have a toaster from 1952. It still works. Mostly.", ask: "What’s your oldest appliance?",
        secret: "Is terrified of the toaster pop and hides when it goes off.", act: ["Jump at any sudden noise.", "Talk about toasters from a safe distance."], try: "Ask if the toaster “pops very, very gently.”" }],
    "Lunchbox": [
      { fact: "Collects vintage lunchboxes and is very serious about it.", open: "Mint condition, 1979. Don’t touch it.", ask: "What’s your most valuable lunchbox?",
        secret: "Spent their entire savings on a single lunchbox.", act: ["Get defensive about “investments.”", "Change the subject when savings come up."], try: "Ask if the lunchbox is “basically a retirement plan.”" },
      { fact: "Eats the exact same lunch every day.", open: "Same lunch every day for eleven years. Don’t try to change me.", ask: "Who makes your lunch?",
        secret: "Their mom still packs their lunch, with a note.", act: ["Mention a note “someone” left in your lunch.", "Get embarrassed about napkins with hearts on them."], try: "Ask if the lunchbox “has a spot for notes from home.”" },
      { fact: "Works night shifts at a hospital.", open: "Night shift nurse. Lunch at 3 a.m. is normal for me.", ask: "What’s the hardest part of night shifts?",
        secret: "Has been eating coworkers’ lunches from the staff fridge for years.", act: ["Get cagey when anyone mentions missing food.", "Know suspiciously much about other people’s lunches."], try: "Ask if the lunchbox “has a lock. For other people.”" }],
    "Pizza cutter": [
      { fact: "Has strong opinions about pizza toppings.", open: "Before we start: pineapple on pizza. Yes or no?", ask: "What’s your go-to pizza order?",
        secret: "Secretly puts ketchup on pizza.", act: ["Defend weird toppings with passion.", "Get cagey when anyone asks your order."], try: "Ask if the pizza cutter “works on extra-ketchup pizza.”" },
      { fact: "Runs the local pizza place.", open: "Best pizza in town. Ask anyone. Well, ask my mom.", ask: "What makes your pizza special?",
        secret: "Orders their own pizzeria’s pizzas from a chain across town.", act: ["Get vague about the kitchen.", "Mention delivery apps a little too often."], try: "Ask if the pizza cutter “cuts delivery pizza too.”" },
      { fact: "Holds the pizza-eating record at the county fair.", open: "County fair pizza champion. Three years running.", ask: "How many slices did you eat to win?",
        secret: "Hates pizza and only eats it to win.", act: ["Make a face when pizza comes up, then smile.", "Talk about pizza like it’s a job."], try: "Ask if the pizza cutter “makes slices smaller and easier.”" }],
    "Waffle iron": [
      { fact: "Hosts a famous Sunday brunch.", open: "Sunday brunch at my place. Everyone comes. Everyone.", ask: "What’s on the brunch menu?",
        secret: "Buys frozen waffles and toasts them in secret.", act: ["Brag about your cooking, then go vague.", "Mention the freezer a little too fondly."], try: "Ask if the waffle iron “makes frozen waffles look homemade.”" },
      { fact: "Won a waffle-making contest in Belgium.", open: "Belgian waffle champion. Yes, Belgium.", ask: "What was the contest in Belgium like?",
        secret: "Has never been to Belgium. The contest was at a Belgian-themed diner.", act: ["Get vague about travel.", "Use one French word, badly."], try: "Ask if the waffle iron “makes things taste more European.”" },
      { fact: "Makes breakfast for the whole house every morning.", open: "I’m up at 5 a.m. making breakfast. Every single day.", ask: "Who do you make breakfast for?",
        secret: "Lives alone and makes breakfast for their seven cats.", act: ["Say “the family” vaguely.", "Pick fur off your sleeve."], try: "Ask if the waffle iron “makes cat-sized waffles.”" }],
    "Rolling pin": [
      { fact: "Bakes bread every weekend for the neighbors.", open: "I brought bread! I always bring bread.", ask: "Do you ever eat your own bread?",
        secret: "Is allergic to wheat and has never tasted their own bread.", act: ["Rave about bread, then sneeze.", "Politely push away any food."], try: "Ask if the rolling pin is “gluten-free,” very seriously." },
      { fact: "Has entered the county pie contest nine years in a row.", open: "Nine years at the pie contest. This is my year.", ask: "How many times have you won?",
        secret: "Has never won and is plotting revenge on the judges.", act: ["Get competitive whenever food comes up.", "Mention “the judges” with a dark look."], try: "Ask if the rolling pin “could intimidate a judge.”" },
      { fact: "Was a famous TV chef’s assistant.", open: "I worked with a TV chef. Very famous. Can’t say who.", ask: "What did you learn from the TV chef?",
        secret: "Got fired for eating all the dough on live TV.", act: ["Wince at the word “live.”", "Lick your lips whenever baking comes up."], try: "Ask if the rolling pin “stops you snacking on the dough.”" }],
    "Pickle jar": [
      { fact: "Makes homemade pickles and gives them as gifts.", open: "Everyone gets pickles from me. It’s my thing.", ask: "What’s your secret pickle recipe?",
        secret: "Can’t open a jar and has to ask the neighbors every time.", act: ["Pretend your hand hurts when jars come up.", "Mention your “helpful neighbor” a lot."], try: "Ask if the pickle jar “opens itself.”" },
      { fact: "Is obsessed with pickles lately.", open: "I had pickles for breakfast. And a snack. You get it.", ask: "Why the sudden pickle craving?",
        secret: "Is expecting a baby and hasn’t told anyone.", act: ["Hint that something big is coming in the spring.", "Get emotional about baby clothes."], try: "Ask if the pickle jar “is safe for the whole family. The whole family.”" },
      { fact: "Runs a booth at the farmers market.", open: "Come to my booth Saturday. Best pickles in the county.", ask: "What sells best at your booth?",
        secret: "Buys pickles at the store and puts new labels on them.", act: ["Get cagey about your “recipe.”", "Peel at an imaginary label."], try: "Ask if the pickle jar “comes without a label.”" }],
    "Teapot": [
      { fact: "Hosts a fancy tea party every Sunday.", open: "Pinkies up. Tea is served at four.", ask: "What’s your favorite tea?",
        secret: "Hates tea and secretly drinks coffee out of the teapot.", act: ["Make a face at the word “tea.”", "Perk up when coffee comes up."], try: "Ask if the teapot “can hold coffee without anyone knowing.”" },
      { fact: "Collects antique teapots.", open: "I have 140 teapots. Antique. Don’t touch them.", ask: "What’s your oldest teapot?",
        secret: "Broke a priceless teapot at a museum and glued it back together.", act: ["Get jumpy at the word “museum.”", "Hold your hands very carefully."], try: "Ask if the teapot is “unbreakable. Very unbreakable.”" },
      { fact: "Lived in England for a year.", open: "Cheerio! Sorry, habit. I lived in England.", ask: "What did you love about England?",
        secret: "Never lived in England. Just watched a lot of British TV.", act: ["Slip in and out of an accent.", "Get vague about English places."], try: "Ask if the teapot “makes you sound more British.”" }],
    "Slow cooker": [
      { fact: "Brings a slow-cooker dish to every potluck.", open: "Potluck legend. My chili is famous.", ask: "What’s your famous potluck dish?",
        secret: "The famous chili is three cans of beans and nothing else.", act: ["Brag about “layers of flavor.”", "Get cagey about ingredients."], try: "Ask if the slow cooker “makes canned food taste fancy.”" },
      { fact: "Works 80 hours a week.", open: "Sorry, I’m on my lunch break. It’s 30 seconds long.", ask: "When do you have time to cook?",
        secret: "Hasn’t cooked a meal in four years and lives on cereal.", act: ["Talk about food in the past tense.", "Mention cereal brands like old friends."], try: "Ask if the slow cooker “cooks while you work 80 hours.”" },
      { fact: "Feeds the whole neighborhood on game days.", open: "Game day at my place. Everyone’s invited. Bring nothing.", ask: "What do you cook on game days?",
        secret: "Doesn’t understand any sport and just likes the food.", act: ["Cheer at the wrong moments.", "Mix up team names."], try: "Ask if the slow cooker “knows when it’s halftime.”" }],
    "Salad spinner": [
      { fact: "Eats a salad every single day.", open: "Salad for lunch, salad for dinner. Very healthy.", ask: "What’s in your daily salad?",
        secret: "Uses so much ranch dressing that it’s basically soup.", act: ["Lick your lips at the word “dressing.”", "Get defensive about portion sizes."], try: "Ask if the salad spinner “spins in extra ranch.”" },
      { fact: "Just became a personal trainer.", open: "Personal trainer. Abs, glutes, salads. Ask me anything.", ask: "What do you eat on a normal day?",
        secret: "Eats fast food in the car before every training session.", act: ["Wipe imaginary crumbs off your shirt.", "Get vague about your diet."], try: "Ask if the salad spinner “hides the smell of fries.”" },
      { fact: "Grows all their own vegetables.", open: "Everything I eat, I grow. Farm to table, baby.", ask: "What grows best in your garden?",
        secret: "Has killed every plant they’ve ever owned and buys everything.", act: ["Talk about the garden with forced optimism.", "Get quiet when asked how it’s going."], try: "Ask if the salad spinner “makes store lettuce look homegrown.”" }],
    "Bowling ball": [
      { fact: "Was the high school bowling champion.", open: "Bowling champion, class of ’91. I still have the trophy.", ask: "How did you win the championship?",
        secret: "Won the championship with a secretly weighted ball.", act: ["Brag about the trophy, get cagey about the ball.", "Get defensive about the word “fair.”"], try: "Ask if the bowling ball is “tournament legal.”" },
      { fact: "Joined a bowling league to make friends.", open: "Thursday night bowling. My team needs me.", ask: "How’s your team doing this season?",
        secret: "Has never knocked down a single pin.", act: ["Talk about “team spirit” instead of scores.", "Get vague about your average."], try: "Ask if the bowling ball “aims itself.”" },
      { fact: "Runs the snack bar at the bowling alley.", open: "I run the snack bar at the lanes. Best nachos in town.", ask: "What’s the best thing on your snack bar menu?",
        secret: "Has dropped a bowling ball on their own foot six times.", act: ["Wince when anyone mentions toes.", "Shift your weight like your foot hurts."], try: "Ask if the bowling ball “is foot-friendly.”" }],
    "Trampoline": [
      { fact: "Has a giant trampoline in the backyard.", open: "Kids love my backyard. I have a trampoline. A big one.", ask: "Who uses your trampoline the most?",
        secret: "Bounces on it alone at midnight so nobody sees.", act: ["Get vague about who it’s really for.", "Look tired, like you were up late."], try: "Ask if the trampoline “works in the dark.”" },
      { fact: "Is a retired circus acrobat.", open: "Former circus acrobat. I can still do a backflip. Probably.", ask: "What was your best circus trick?",
        secret: "Was the circus ticket seller, not an acrobat.", act: ["Get vague about stunts.", "Talk about ticket prices like an expert."], try: "Ask if the trampoline “makes anyone look like an acrobat.”" },
      { fact: "Teaches a kids’ gymnastics class.", open: "I teach gymnastics to kids. Flexible body, flexible mind.", ask: "What’s the hardest move you teach?",
        secret: "Is terrified of heights and never leaves the floor.", act: ["Look down whenever height comes up.", "Talk about “floor work” a lot."], try: "Ask if the trampoline “has a low setting.”" }],
    "Pogo stick": [
      { fact: "Holds a local record for pogo stick jumps.", open: "Pogo record holder. 4,000 bounces in a row.", ask: "How did you set the record?",
        secret: "Set the “record” on a trampoline and called it a pogo stick.", act: ["Get vague about the details.", "Change the subject when “proof” comes up."], try: "Ask if the pogo stick “counts bounces for you.”" },
      { fact: "Gets to work on a pogo stick every day.", open: "Sorry I’m out of breath. I bounced here.", ask: "How long does it take to bounce to work?",
        secret: "Got banned from their office building for bouncing in the lobby.", act: ["Tense up when anyone mentions “building security.”", "Mention working from home “for now.”"], try: "Ask if the pogo stick “is quiet enough for lobbies.”" },
      { fact: "Hosted a kids’ TV show in the ’90s.", open: "You might remember me from TV. Bouncy Bob. Or Bouncy Barb.", ask: "What was your TV show about?",
        secret: "Got fired for falling off a pogo stick on live TV.", act: ["Wince at the word “live.”", "Rub your elbow when bouncing comes up."], try: "Ask if the pogo stick “has training wheels.”" }],
    "Unicycle": [
      { fact: "Rides a unicycle to work every day.", open: "Yes, I unicycle to work. It builds character.", ask: "How long did it take to learn the unicycle?",
        secret: "Can’t ride a regular bicycle.", act: ["Get vague about anything with two wheels.", "Look nervous when bikes come up."], try: "Ask if the unicycle “is easier than a bike. Asking for me.”" },
      { fact: "Is training to join the circus.", open: "Circus auditions next month. I’m going all in.", ask: "Why the circus?",
        secret: "Is running away from a very boring accounting job.", act: ["Mention spreadsheets with a shudder.", "Get excited about “freedom.”"], try: "Ask if the unicycle “can outrun a manager.”" },
      { fact: "Juggles at kids’ birthday parties.", open: "Party entertainer. I juggle, I unicycle, I sing.", ask: "What’s your best party trick?",
        secret: "Is scared of clowns and refuses to work with them.", act: ["Shudder whenever anyone mentions clowns.", "Ask nervously about face paint."], try: "Ask if the unicycle “is clown-proof.”" }],
    "Yoga mat": [
      { fact: "Teaches a weekend yoga class.", open: "Namaste. I teach yoga, so I’m very centered right now.", ask: "What’s the hardest pose for you?",
        secret: "Can’t touch their own toes.", act: ["Talk about flexibility, then avoid bending.", "Wince whenever anyone mentions stretching."], try: "Ask if the yoga mat “works for people who prefer sitting.”" },
      { fact: "Meditates for two hours every morning.", open: "I meditate every morning. Inner peace. Total calm.", ask: "What do you think about while you meditate?",
        secret: "Has never stayed awake through a whole meditation.", act: ["Yawn whenever “calm” comes up.", "Say you “go very deep.”"], try: "Ask if the yoga mat “is comfy enough to nap on.”" },
      { fact: "Just got back from a yoga retreat in Bali.", open: "Just back from Bali. Yoga retreat. Life-changing.", ask: "What was the retreat like?",
        secret: "Spent the whole retreat at the hotel buffet.", act: ["Get vague about the yoga part.", "Get very detailed about the desserts."], try: "Ask if the yoga mat “comes with snacks.”" }],
    "Hula hoop": [
      { fact: "Can hula hoop for an hour straight.", open: "One hour, no drops. I’ve been practicing.", ask: "Where do you practice?",
        secret: "Practices hula hooping at work during meetings.", act: ["Get vague about your job.", "Sway your hips a little while you talk."], try: "Ask if the hula hoop “works under a desk.”" },
      { fact: "Teaches a dance fitness class.", open: "Dance fitness instructor. Five, six, seven, eight!", ask: "What’s your class like?",
        secret: "Has two left feet and copies all the moves from videos.", act: ["Count out loud a lot.", "Mention videos you “study.”"], try: "Ask if the hula hoop “teaches you the moves.”" },
      { fact: "Won a hula hoop contest as a kid.", open: "Hula hoop champion, age nine. I’ve still got it.", ask: "Do you still hula hoop?",
        secret: "Threw out their back hula hooping last month.", act: ["Move very carefully.", "Wince when you turn around."], try: "Ask if the hula hoop “is gentle on the back.”" }],
    "Treadmill": [
      { fact: "Has had a gym membership for 12 years.", open: "I just came from the gym. Well, near the gym.", ask: "What’s your favorite machine at the gym?",
        secret: "Has never once gone inside the gym.", act: ["Talk about “working out” with zero details.", "Get vague about which gym."], try: "Ask if the treadmill “counts as cardio just by looking at it.”" },
      { fact: "Owns a treadmill and talks about it constantly.", open: "My treadmill and I are very close.", ask: "How often do you use your treadmill?",
        secret: "Uses the treadmill as a clothes rack.", act: ["Get vague about mileage.", "Mention laundry a lot."], try: "Ask if the treadmill “has hooks for shirts.”" },
      { fact: "Runs five miles every morning.", open: "Five miles this morning. Every morning. Exhausted.", ask: "What’s your running route?",
        secret: "Actually takes the bus and jogs the last block.", act: ["Look a little too fresh for someone who “just ran.”", "Know the bus schedule by heart."], try: "Ask if the treadmill “has a shortcut mode.”" }],
    "Bicycle helmet": [
      { fact: "Bikes to work in every kind of weather.", open: "I biked here, rain or shine. Mostly flat roads.", ask: "What’s the scariest part of your ride?",
        secret: "Is terrified of going downhill.", act: ["Go pale when anyone mentions hills.", "Ask how things handle “steep stuff.”"], try: "Ask if the bicycle helmet “has brakes. Really good brakes.”" },
      { fact: "Wears a helmet everywhere, even indoors.", open: "Safety first. Always. Even in here.", ask: "Why do you wear a helmet indoors?",
        secret: "Is hiding a really bad haircut.", act: ["Touch the top of your head carefully.", "Get nervous at the word “barber.”"], try: "Ask if the bicycle helmet “hides a bad haircut.”" },
      { fact: "Leads the city bike tour.", open: "City bike tours every Saturday. I know every street.", ask: "What’s the best stop on your tour?",
        secret: "Gets lost on their own tour every week.", act: ["Get vague about directions.", "Pull out an imaginary map."], try: "Ask if the bicycle helmet “has GPS.”" }],
    "Ski goggles": [
      { fact: "Goes skiing every winter.", open: "Fresh off the slopes. Look at this goggle tan.", ask: "What’s your favorite ski run?",
        secret: "Has never skied. Just sits in the lodge drinking cocoa.", act: ["Talk about the lodge more than the slopes.", "Get vague about ski runs."], try: "Ask if the ski goggles “work from inside the lodge.”" },
      { fact: "Was a ski instructor in Colorado.", open: "Former ski instructor. Colorado. Pizza, French fries.", ask: "What’s the hardest thing to teach beginners?",
        secret: "Is terrified of chairlifts and walked up the mountain every day.", act: ["Shudder at the word “lift.”", "Talk about “the walk up.”"], try: "Ask if the ski goggles “make heights less scary.”" },
      { fact: "Wears goggles or sunglasses indoors.", open: "Sorry about the goggles. It’s bright in here.", ask: "Why the goggles indoors?",
        secret: "Has a black eye from a snowball fight with their kids.", act: ["Keep your eyes covered.", "Get defensive about snowballs."], try: "Ask if the ski goggles “hide a black eye.”" }],
    "Kazoo": [
      { fact: "Played kazoo in a band that toured three states.", open: "Kazoo player. Toured three states. Ask me anything.", ask: "Where did the band play?",
        secret: "The band only ever played at grandma’s birthday parties.", act: ["Get vague about venues.", "Mention grandma a lot."], try: "Ask if the kazoo “works for big audiences. Or small ones.”" },
      { fact: "Plays music at every family event.", open: "I’ll be playing at your next family event. You’re welcome.", ask: "What do you play at family events?",
        secret: "Can only play one song on the kazoo.", act: ["Hum the same tune every time music comes up.", "Change the subject when requests come up."], try: "Ask if the kazoo “knows more than one song.”" },
      { fact: "Is a substitute music teacher.", open: "Music teacher. I bring joy to children. Loudly.", ask: "What do you teach the kids?",
        secret: "Gave every student a kazoo and got them banned from the school.", act: ["Tense up when anyone says “principal.”", "Talk about “noise complaints.”"], try: "Ask if the kazoo “has a quiet mode.”" }],
    "Disco ball": [
      { fact: "Throws a themed party every month.", open: "You’re invited to my party next month. Please come.", ask: "Who came to your last party?",
        secret: "Hasn’t had a single guest show up since March.", act: ["Rave about your parties, then go quiet.", "Invite the Peddler to everything."], try: "Ask if the disco ball “works for a party of one.”" },
      { fact: "Was a disco dance champion in 1978.", open: "1978 disco champion. Still got the moves.", ask: "What was your winning move?",
        secret: "Only won because the other dancer slipped. Can’t dance at all.", act: ["Get vague about dance moves.", "Do one move, badly."], try: "Ask if the disco ball “makes bad dancers look good.”" },
      { fact: "Runs a roller rink.", open: "I run the roller rink. Couples skate is at eight.", ask: "What’s the best night at the rink?",
        secret: "Can’t roller skate and has never tried.", act: ["Talk about skating from the sidelines.", "Wobble a little when you stand."], try: "Ask if the disco ball “works on solid ground.”" }],
    "Accordion": [
      { fact: "Has played accordion at 200 weddings.", open: "Wedding accordionist. Two hundred weddings. I’ve seen it all.", ask: "What’s the craziest wedding you played?",
        secret: "Has been asked to stop playing at most of them.", act: ["Get defensive about “volume.”", "Mention being “escorted out” once."], try: "Ask if the accordion “has a quieter setting.”" },
      { fact: "Comes from five generations of accordion players.", open: "My family has played accordion for five generations.", ask: "Who taught you to play?",
        secret: "Can’t play. Mimes along to a recording.", act: ["Move your hands like you’re playing, with no sound.", "Get vague about “sheet music.”"], try: "Ask if the accordion “plays itself.”" },
      { fact: "Plays accordion downtown every weekend.", open: "You might’ve heard me downtown. Accordion. Saturdays.", ask: "How much do you make playing on the street?",
        secret: "Makes more money when people pay them to stop.", act: ["Brag about tips, then explain why.", "Look proud and a little hurt."], try: "Ask if the accordion “makes people tip happily.”" }],
    "Tuba": [
      { fact: "Played in the marching band for 20 years.", open: "Twenty years in the marching band. I hear music in everything.", ask: "How did you learn all your parts?",
        secret: "Can’t read music and has faked it the whole time.", act: ["Talk about music with big words, no details.", "Hum confidently, a little off-key."], try: "Ask if the tuba “comes with the notes already in it.”" },
      { fact: "Lives in a tiny apartment.", open: "Tiny apartment. Big dreams. Bigger instrument.", ask: "How do you fit everything in your apartment?",
        secret: "Sleeps curled up in the tuba case.", act: ["Get vague about your bed.", "Stretch your back a lot."], try: "Ask if the tuba “folds up small.”" },
      { fact: "Plays tuba in a polka band.", open: "Polka band, Saturdays. Bring your dancing shoes.", ask: "What’s your favorite polka?",
        secret: "Hates polka and secretly loves heavy metal.", act: ["Make a face at the word “polka.”", "Headbang once, by accident."], try: "Ask if the tuba “can play heavy metal.”" }],
    "Megaphone": [
      { fact: "Is a high school cheer coach.", open: "GO TEAM! Sorry. Cheer coach. Habit.", ask: "What’s your team’s best cheer?",
        secret: "Lost their voice three years ago and has been faking it.", act: ["Whisper, then suddenly shout.", "Clear your throat a lot."], try: "Ask if the megaphone “talks for you.”" },
      { fact: "Leads marches around town.", open: "I lead marches. For causes. Many causes.", ask: "What was your last march about?",
        secret: "Can’t remember what any of the marches were about.", act: ["Get vague about the cause.", "Say “it’s about the principle.”"], try: "Ask if the megaphone “tells you what to chant.”" },
      { fact: "Is a double-decker bus tour guide.", open: "On your left, a great opportunity. On your right, me.", ask: "What’s the best stop on your tour?",
        secret: "Makes up all the history facts.", act: ["State a very fake historical fact confidently.", "Get defensive about “sources.”"], try: "Ask if the megaphone “makes facts sound true.”" }],
    "Wind chime": [
      { fact: "Has forty wind chimes on their porch.", open: "My porch sounds like a fairy tale. Forty wind chimes.", ask: "Why so many wind chimes?",
        secret: "Is in a feud with the neighbor over the noise.", act: ["Tense up whenever neighbors come up.", "Defend “ambient sound” passionately."], try: "Ask if the wind chime “is louder than a neighbor.”" },
      { fact: "Is a meditation coach.", open: "Breathe in. Breathe out. I coach meditation.", ask: "What helps you relax?",
        secret: "Can’t sleep because of every tiny sound.", act: ["Jump at any small noise.", "Ask for quiet more than once."], try: "Ask if the wind chime “has an off switch.”" },
      { fact: "Sells handmade crafts at fairs.", open: "I make wind chimes by hand. Every one is unique.", ask: "What do you make your chimes from?",
        secret: "Makes them from the neighbors’ missing silverware.", act: ["Get cagey about materials.", "Glance at any forks nearby."], try: "Ask if the wind chime “is made of… anything special.”" }],
    "Lava lamp": [
      { fact: "Still decorates their home like it’s 1970.", open: "Groovy. My place is pure 1970. Shag carpet and all.", ask: "What’s your favorite thing in your house?",
        secret: "Has lived in their parents’ house for 30 years. It’s their parents’ decor.", act: ["Get vague about who owns the house.", "Mention “Mom’s rules” by accident."], try: "Ask if the lava lamp “makes a parent’s house feel like yours.”" },
      { fact: "Is a party hypnotist.", open: "Look into my eyes. I’m a hypnotist. You will love this pitch.", ask: "Have you ever really hypnotized someone?",
        secret: "Has never hypnotized anyone. Everyone just plays along.", act: ["Stare dramatically, then blink first.", "Get defensive about “results.”"], try: "Ask if the lava lamp “hypnotizes people for real.”" },
      { fact: "Collects vintage lamps.", open: "Ninety-three lamps. All vintage. All plugged in.", ask: "What’s your electric bill like?",
        secret: "Owes the power company thousands of dollars.", act: ["Wince at the word “bill.”", "Call candles a “lifestyle choice.”"], try: "Ask if the lava lamp “runs without electricity.”" }],
    "Mood ring": [
      { fact: "Believes everything happens because of the stars.", open: "Before we start: what’s your sign? This matters.", ask: "Where do you get your horoscopes?",
        secret: "Writes the horoscopes for the local paper and makes them all up.", act: ["Predict something silly about the Peddler.", "Get defensive about “accuracy.”"], try: "Ask if the mood ring “has very Scorpio energy.”" },
      { fact: "Is a relationship counselor.", open: "Couples counselor. I can read people instantly.", ask: "How do you know what couples are feeling?",
        secret: "Has been divorced four times.", act: ["Get quiet when marriage comes up.", "Say “my ex” before stopping yourself."], try: "Ask if the mood ring “works on exes.”" },
      { fact: "Never shows any emotion. Total poker face.", open: "You won’t know what I’m thinking. I’m unreadable.", ask: "Do you ever play poker?",
        secret: "Cries at every commercial with a puppy in it.", act: ["Get misty-eyed at anything cute.", "Deny it immediately."], try: "Ask if the mood ring “keeps your feelings secret.”" }],
    "Lawn chair": [
      { fact: "Sits on the front lawn every evening watching the street.", open: "I see everything on this street. Everything.", ask: "What do you see from your lawn chair?",
        secret: "Secretly writes a gossip column about the neighbors.", act: ["Know a little too much about everyone.", "Ask the Peddler a nosy question back."], try: "Ask if the lawn chair “has a notepad holder.”" },
      { fact: "Goes to every outdoor concert in the park.", open: "First one there, best spot, every concert.", ask: "What’s the best concert you’ve seen in the park?",
        secret: "Sleeps through every single concert.", act: ["Yawn when music comes up.", "Get vague about the bands."], try: "Ask if the lawn chair “wakes you up for the encore.”" },
      { fact: "Camps out for every big store sale.", open: "I camped out three nights for a TV. I always get the deal.", ask: "What’s the best deal you’ve camped out for?",
        secret: "Never actually buys anything. Just likes being first in line.", act: ["Talk about lines, not purchases.", "Get vague about what you bought."], try: "Ask if the lawn chair “is good for three nights in a row.”" }],
    "Hammock": [
      { fact: "Takes naps so seriously they keep a schedule.", open: "You have exactly until my 2:15 nap. Go.", ask: "How do you sleep at night?",
        secret: "Hasn’t slept a full night since 2015.", act: ["Yawn a lot, then deny being tired.", "Talk about sleep like a lost love."], try: "Ask if the hammock is “nap certified.”" },
      { fact: "Just got back from a tropical vacation.", open: "Just back from the tropics. Hammock life. Pure bliss.", ask: "What did you do on vacation?",
        secret: "Fell out of a hammock on day one and spent the trip in a cast.", act: ["Rub your arm when vacation comes up.", "Get vague about the beach."], try: "Ask if the hammock “has seatbelts.”" },
      { fact: "Works from home in the comfiest spot possible.", open: "I work from home, so this is the most awake I’ve been all week.", ask: "Ever had an embarrassing work call?",
        secret: "Fell asleep on a video call with the CEO.", act: ["Get jumpy when meetings come up.", "Insist you are “very alert.”"], try: "Ask if the hammock “keeps you awake, legally speaking.”" }],
    "Rocking chair": [
      { fact: "Retired early and loves to relax.", open: "I’m retired. I relax full time. It’s… so relaxing.", ask: "What do you do all day?",
        secret: "Is bored out of their mind and desperate for adventure.", act: ["Say you love relaxing in a tense voice.", "Perk up at anything exciting."], try: "Ask if the rocking chair “goes fast.” Hopefully." },
      { fact: "Babysits all the grandkids on weekends.", open: "Grandkids every weekend. I’m the fun one.", ask: "What do you do with the grandkids?",
        secret: "Hides from the grandkids in the closet to take naps.", act: ["Look around like someone’s searching for you.", "Mention “quiet time” a lot."], try: "Ask if the rocking chair “fits in a closet.”" },
      { fact: "Builds furniture by hand.", open: "I build furniture. Handmade. Built to last.", ask: "What’s your best piece?",
        secret: "Every chair they’ve built has collapsed within a week.", act: ["Get defensive about the word “sturdy.”", "Talk about “character” in furniture."], try: "Ask if the rocking chair “holds up to real sitting.”" }],
    "Bean bag chair": [
      { fact: "Is a professional video gamer.", open: "Pro gamer. Eight hours a day. It’s a real job.", ask: "What’s your favorite game?",
        secret: "Has never won a single tournament.", act: ["Talk about “practice” instead of wins.", "Blame lag for everything."], try: "Ask if the bean bag chair “makes you better at games.”" },
      { fact: "Runs a startup out of their garage.", open: "Startup founder. We’re disrupting the industry.", ask: "What does your company do?",
        secret: "The “office” is a garage full of bean bags and zero employees.", act: ["Say “we” about a team of one.", "Get vague about the business plan."], try: "Ask if the bean bag chair “makes a garage look like an office.”" },
      { fact: "Has a college-dorm-style apartment.", open: "Bean bags, string lights, posters. My place is a vibe.", ask: "How old is your furniture?",
        secret: "Is 52 and has never owned a real couch.", act: ["Get vague about your age.", "Say “real furniture is a trap.”"], try: "Ask if the bean bag chair “counts as grown-up furniture.”" }],
    "Recliner": [
      { fact: "Has a recliner with its own name.", open: "Barry and I almost didn’t make it today. Barry is my recliner.", ask: "Any recliner horror stories?",
        secret: "Got stuck in it for six hours last week.", act: ["Get nervous about anything that tilts.", "Ask about “the emergency exit.”"], try: "Ask if the recliner “has an eject button.”" },
      { fact: "Watches every football game from the same chair.", open: "Same chair, every game. It’s lucky.", ask: "What happens if someone sits in your chair?",
        secret: "Fell asleep during the championship and missed the whole thing.", act: ["Get vague about the big game.", "Act like you know the final score."], try: "Ask if the recliner “wakes you up for touchdowns.”" },
      { fact: "Sells furniture at a big store.", open: "Furniture salesperson. I know a good recliner.", ask: "What’s the best chair you sell?",
        secret: "Naps in the store’s display recliners during shifts.", act: ["Yawn at the word “work.”", "Get defensive about “product testing.”"], try: "Ask if the recliner “looks busy while you nap.”" }],
    "Ceiling fan": [
      { fact: "Is always too hot, no matter what.", open: "Is it hot in here? It’s hot in here.", ask: "How do you survive the summer?",
        secret: "Sleeps with the freezer door open.", act: ["Fan yourself constantly.", "Talk about ice like a best friend."], try: "Ask if the ceiling fan “goes to freezer level.”" },
      { fact: "Is the family handyman.", open: "Need something fixed? I’m the family handyman.", ask: "What’s the last thing you fixed?",
        secret: "Installed a ceiling fan that flew off and broke a window.", act: ["Wince at the word “install.”", "Look up at the ceiling nervously."], try: "Ask if the ceiling fan “stays attached. Really attached.”" },
      { fact: "Has a cat that loves to climb.", open: "My cat climbs everything. She’s basically a monkey.", ask: "Where does your cat like to climb?",
        secret: "Their cat lives on top of the ceiling fan and won’t come down.", act: ["Look up a lot.", "Mention “feeding her with a pole.”"], try: "Ask if the ceiling fan “is cat-friendly.”" }],
    "Sleeping bag": [
      { fact: "Went camping every summer as a kid.", open: "I grew up camping. Love the outdoors. During the day.", ask: "What was camping like at night?",
        secret: "Is secretly terrified of the dark.", act: ["Shudder at the word “night.”", "Ask whether things “glow.”"], try: "Ask if the sleeping bag “comes with a night-light.”" },
      { fact: "Leads a scout troop.", open: "Scout leader. Knots, campfires, the works.", ask: "What’s your favorite camping trip?",
        secret: "Sneaks off to a hotel on every camping trip.", act: ["Get vague about where you sleep.", "Mention room service by accident."], try: "Ask if the sleeping bag “feels like a hotel bed.”" },
      { fact: "Is between apartments right now.", open: "Just between places right now. Very exciting time.", ask: "Where are you staying these days?",
        secret: "Has been sleeping at the office for two months.", act: ["Get vague about your address.", "Mention the office kitchen a lot."], try: "Ask if the sleeping bag “fits under a desk.”" }],
    "Garden gnome": [
      { fact: "Collects garden gnomes. Has 87 of them.", open: "I have 87 garden gnomes, and I know where each one came from.", ask: "Where did you find all your gnomes?",
        secret: "Steals gnomes from the neighbors’ yards.", act: ["Get cagey about where your gnomes came from.", "Glance over your shoulder at the word “neighbor.”"], try: "Ask if the garden gnome is “easy to carry quietly.”" },
      { fact: "Has won “best garden” three years in a row.", open: "Best garden, three years running. My gnomes help.", ask: "What’s your garden secret?",
        secret: "Pays a teenager to do all the gardening at 5 a.m.", act: ["Brag about your garden with no details.", "Look at your hands like they’ve never gardened."], try: "Ask if the garden gnome “does the work while you sleep.”" },
      { fact: "Believes gnomes bring good luck.", open: "Every gnome in my yard brings luck. I’m very lucky.", ask: "Has a gnome ever brought you luck?",
        secret: "Is terrified the gnomes move around at night.", act: ["Glance around nervously at the word “night.”", "Say you “count them every morning.”"], try: "Ask if the garden gnome “definitely stays put.”" }],
    "Leaf blower": [
      { fact: "Has the tidiest yard on the street.", open: "You may have driven past my yard. Not a single leaf.", ask: "What time do you do your yard work?",
        secret: "Blows all their leaves into the neighbor’s yard at 5 a.m.", act: ["Tense up when neighbors come up.", "Defend your yard work hours."], try: "Ask if the leaf blower “aims over fences.”" },
      { fact: "Runs a lawn care business.", open: "Lawn care, landscaping, leaf removal. Call me.", ask: "How many clients do you have?",
        secret: "Has exactly one client: their mom.", act: ["Say “clients” vaguely.", "Mention Mom’s yard a lot."], try: "Ask if the leaf blower “impresses clients. Plural.”" },
      { fact: "Hates noise of any kind.", open: "Could we keep this pitch quiet? I hate noise.", ask: "What sounds drive you crazy?",
        secret: "Calls the city on every leaf blower in the neighborhood.", act: ["Get dark when anyone says “leaf blower.”", "Quote noise rules by number."], try: "Ask if the leaf blower “is whisper quiet.”" }],
    "Wheelbarrow": [
      { fact: "Spends every weekend landscaping.", open: "Every weekend I move dirt. It’s my therapy.", ask: "What are you building in your yard?",
        secret: "Is digging a secret tunnel to the neighbor’s pool.", act: ["Get vague about the “project.”", "Mention digging a little too much."], try: "Ask if the wheelbarrow “fits through a tunnel.”" },
      { fact: "Grows prize-winning pumpkins.", open: "I grow prize-winning pumpkins. Ask me anything. Except about seeds.", ask: "What’s your growing secret?",
        secret: "Buys the pumpkins at the farmers market every year.", act: ["Brag about your pumpkins, go vague about growing them.", "Change the subject when seeds come up."], try: "Ask if the wheelbarrow “comes with a receipt you can hide.”" },
      { fact: "Is a construction site foreman.", open: "Construction foreman. I run the whole site.", ask: "What are you building right now?",
        secret: "Has never lifted anything heavier than a clipboard.", act: ["Talk tough, then avoid lifting anything.", "Mention your “bad back” vaguely."], try: "Ask if the wheelbarrow “pushes itself.”" }],
    "Scarecrow": [
      { fact: "Runs a small farm.", open: "Farm life. Up at dawn, chickens, the whole thing.", ask: "What’s the hardest part of farming?",
        secret: "Is terrified of birds.", act: ["Flinch at the word “crow.”", "Duck slightly when anything flies."], try: "Ask if the scarecrow “scares birds really far away.”" },
      { fact: "Runs the town’s haunted Halloween maze.", open: "Haunted maze every October. I’m the scariest thing in it.", ask: "What’s the scariest part of your maze?",
        secret: "Gets scared in their own maze every year.", act: ["Laugh nervously about scary things.", "Insist it’s “for the kids.”"], try: "Ask if the scarecrow “can be less scary.”" },
      { fact: "Wins the costume contest every Halloween.", open: "Best costume, three years running. Scarecrow. Classic.", ask: "What’s your costume secret?",
        secret: "Doesn’t take the costume off for days afterward.", act: ["Pick straw off your clothes.", "Get vague about laundry."], try: "Ask if the scarecrow “comes in your size.”" }],
    "Mailbox": [
      { fact: "Checks the mail six times a day.", open: "Quick question before we start: has the mail come yet?", ask: "Who are you waiting to hear from?",
        secret: "Is waiting on a letter from a secret pen pal in Iceland.", act: ["Perk up at the word “mail.”", "Get vague about who writes to you."], try: "Ask if the mailbox “works internationally.”" },
      { fact: "Is a mail carrier.", open: "Mail carrier. Rain, sleet, snow. Nothing stops me.", ask: "What’s the hardest part of your route?",
        secret: "Is terrified of dogs and throws the mail from the street.", act: ["Shudder when dogs come up.", "Brag about your “throwing arm.”"], try: "Ask if the mailbox “is dog-proof.”" },
      { fact: "Never seems to get any bills.", open: "Bills? Never get them. Lucky me.", ask: "How do you handle your bills?",
        secret: "Hides every bill in a box and never opens them.", act: ["Get nervous at the word “bill.”", "Change the subject when money comes up."], try: "Ask if the mailbox “filters out bills.”" }],
    "Traffic cone": [
      { fact: "Works on a road crew.", open: "Road crew. If there’s a detour, I probably made it.", ask: "What’s the longest detour you’ve made?",
        secret: "Has a garage full of “borrowed” traffic cones.", act: ["Get cagey about your garage.", "Know oddly specific facts about cones."], try: "Ask if the traffic cone “comes with a receipt.”" },
      { fact: "Is a driving instructor.", open: "Driving instructor. Hands at ten and two, please.", ask: "What’s your students’ biggest mistake?",
        secret: "Failed their own driving test four times.", act: ["Get defensive about parking.", "Say you “prefer the passenger seat.”"], try: "Ask if the traffic cone “helps people pass the test.”" },
      { fact: "Organizes the town parade.", open: "Parade organizer. Floats, bands, the whole show.", ask: "What’s the best part of the parade?",
        secret: "Got the route wrong last year and the parade ended in a parking lot.", act: ["Get vague about directions.", "Insist the parking lot was “intentional.”"], try: "Ask if the traffic cone “points the way.”" }],
    "Step ladder": [
      { fact: "Spends every weekend fixing up the house.", open: "Spent all weekend fixing up the house. Down low, mostly.", ask: "Do you ever work on the roof?",
        secret: "Is terrified of ladders and heights.", act: ["Talk about projects, never about anything high up.", "Look down whenever anyone says “roof.”"], try: "Ask if the step ladder “works from the ground.”" },
      { fact: "Is a professional window washer.", open: "Window washer. Skyscrapers, mostly. Very high up.", ask: "What’s the tallest building you’ve washed?",
        secret: "Only ever washes ground-floor windows.", act: ["Get vague about heights.", "Say “the bottom floors need love too.”"], try: "Ask if the step ladder “has a very low setting.”" },
      { fact: "Is the shortest person in their family.", open: "Shortest in the family. I make it work.", ask: "How do you reach the high shelves?",
        secret: "Secretly stands on a step ladder in every family photo.", act: ["Stand up very straight.", "Get cagey about family photos."], try: "Ask if the step ladder “is invisible in photos.”" }],
    "Sock": [
      { fact: "Only wears mismatched socks.", open: "Mismatched socks. It’s a lifestyle. Look.", ask: "Why do you wear mismatched socks?",
        secret: "Lost every matching pair in the dryer and is too proud to admit it.", act: ["Get defensive about laundry.", "Glare at the word “dryer.”"], try: "Ask if the sock “stays out of dryers.”" },
      { fact: "Knits socks for the whole family.", open: "Everyone in my family is wearing my socks right now.", ask: "How long does a pair of socks take you?",
        secret: "Buys the socks at the store and cuts off the labels.", act: ["Get vague about knitting.", "Pretend to knit, badly."], try: "Ask if the sock “looks handmade even if it isn’t.”" },
      { fact: "Has a perfectly organized sock drawer.", open: "My sock drawer is a work of art. Color-coded.", ask: "How many pairs of socks do you own?",
        secret: "Has a sock puppet collection with names and voices.", act: ["Say one line in a puppet voice.", "Say the puppets are “for the kids.”"], try: "Ask if the sock “comes with eyes.”" }],
    "Hairbrush": [
      { fact: "Has hair down to their waist.", open: "Fourteen years of growing. Don’t touch the hair.", ask: "How long does it take to brush your hair?",
        secret: "Hasn’t brushed it since 2019. Something lives in there now.", act: ["Scratch your head now and then.", "Mention “a little friend.”"], try: "Ask if the hairbrush “is safe for wildlife.”" },
      { fact: "Owns a hair salon downtown.", open: "Salon owner. I’ve seen every bad haircut in town.", ask: "Who cuts your hair?",
        secret: "Cuts their own hair with kitchen scissors.", act: ["Touch your bangs self-consciously.", "Get vague about “your stylist.”"], try: "Ask if the hairbrush “fixes a home haircut.”" },
      { fact: "Is known for having perfect hair every day.", open: "Please don’t open a window. The hair is perfect today.", ask: "What’s your hair routine?",
        secret: "Has a stylist come over at 5 a.m. every single day.", act: ["Get vague about your mornings.", "Yawn, then touch your hair proudly."], try: "Ask if the hairbrush “works without a stylist.”" }],
    "Fanny pack": [
      { fact: "Has never been seen without a fanny pack.", open: "Don’t mind the fanny pack. It goes everywhere I go.", ask: "What’s in the fanny pack?",
        secret: "Keeps an emergency rubber chicken in it at all times.", act: ["Pat your hip protectively.", "Get cagey when anyone asks what you carry."], try: "Ask if the fanny pack has “a secret pocket for… things.”" },
      { fact: "Plays tourist in their own city every weekend.", open: "Tourist in my own town. Every weekend. Map and all.", ask: "What’s your favorite tourist spot here?",
        secret: "Has gotten lost in their own neighborhood three times.", act: ["Pull out an imaginary map.", "Get vague about the way home."], try: "Ask if the fanny pack “has a GPS pocket.”" },
      { fact: "Is a fashion blogger.", open: "Fashion blogger. Fanny packs are back. Trust me.", ask: "What’s the next big trend?",
        secret: "Has eleven followers, and nine are family.", act: ["Brag about your “community.”", "Get vague about numbers."], try: "Ask if the fanny pack “makes you go viral.”" }],
    "Cowboy boots": [
      { fact: "Owns 40 pairs of cowboy boots.", open: "Howdy. Forty pairs of boots and counting.", ask: "Where do you go riding?",
        secret: "Has never once been on a horse.", act: ["Talk like a cowboy, but dodge every horse question.", "Say “yeehaw” once, nervously."], try: "Ask if the cowboy boots are “horse-optional.”" },
      { fact: "Goes line dancing every Friday night.", open: "Friday line dancing. I know every step.", ask: "What’s your favorite line dance?",
        secret: "Only knows one dance and does it to every song.", act: ["Do the same step whenever music comes up.", "Change the subject when requests come up."], try: "Ask if the cowboy boots “teach new steps.”" },
      { fact: "Moved here from Texas.", open: "Born and raised in Texas. Everything’s bigger there.", ask: "Where in Texas are you from?",
        secret: "Is from New Jersey and has never been to Texas.", act: ["Get vague about Texas towns.", "Let the accent slip."], try: "Ask if the cowboy boots “make you sound like a Texan.”" }],
    "Tiara": [
      { fact: "Was a pageant queen in 1998.", open: "*waves like royalty* Miss County, 1998. You may begin.", ask: "Do you still have the crown?",
        secret: "Still wears the tiara at home every night.", act: ["Touch your head like something should be there.", "Wave like royalty, then stop."], try: "Ask if the tiara “comes in extra sparkly.”" },
      { fact: "Says they’re distantly related to royalty.", open: "I’m distantly royal. Very distantly. Still counts.", ask: "Which royal family are you related to?",
        secret: "Made up the whole family tree online.", act: ["Get vague about names and dates.", "Use a fancy title for yourself."], try: "Ask if the tiara “proves you’re royal.”" },
      { fact: "Plans weddings for a living.", open: "Wedding planner. I make dreams come true.", ask: "What’s the biggest wedding you’ve planned?",
        secret: "Is secretly engaged and has planned their own wedding four times.", act: ["Get emotional about cake.", "Say “my own day” by accident."], try: "Ask if the tiara “works for… any bride.”" }],
    "Backpack": [
      { fact: "Has the most organized backpack in history.", open: "Everything has a pocket. Every… single… pocket.", ask: "Can I see what’s inside?",
        secret: "Has a whole sandwich from 2019 in the bottom pocket.", act: ["Brag about organization, avoid opening any bags.", "Sniff the air suspiciously."], try: "Ask if the backpack has “a pocket you never have to open.”" },
      { fact: "Is backpacking across the country.", open: "Backpacking across the country. Day 3 of 300.", ask: "Where are you headed next?",
        secret: "Has been on “day 3” for six months and lives at their cousin’s.", act: ["Get vague about distances.", "Mention your cousin’s couch."], try: "Ask if the backpack “goes far. Eventually.”" },
      { fact: "Went back to college at 50.", open: "Back to school! New backpack, new me.", ask: "What are you studying?",
        secret: "Still hasn’t found any of the classrooms.", act: ["Ask for directions to things.", "Get vague about your classes."], try: "Ask if the backpack “has a campus map.”" }],
    "Shopping cart": [
      { fact: "Shops at the mall every single weekend.", open: "I love a good sales pitch. I shop every weekend.", ask: "What’s your favorite thing you’ve bought?",
        secret: "Returns everything they buy on Monday.", act: ["Brag about buying things, never owning them.", "Ask about the return policy right away."], try: "Ask how long you can “borrow” the shopping cart before returning it." },
      { fact: "Is an extreme couponer.", open: "I paid four cents for my groceries last week.", ask: "What’s your best coupon deal?",
        secret: "Has 400 tubes of toothpaste in their garage.", act: ["Get vague about storage.", "Mention toothpaste out of nowhere."], try: "Ask if the shopping cart “holds 400 of something.”" },
      { fact: "Works at the grocery store.", open: "Grocery store, aisle seven. Ask me where anything is.", ask: "What’s the funniest thing you’ve seen at work?",
        secret: "Races shopping carts in the parking lot after closing.", act: ["Get excited at the word “race.”", "Rub a scraped elbow."], try: "Ask if the shopping cart “has a turbo mode.”" }],
    "Stapler": [
      { fact: "Is the office supply manager.", open: "Office supply manager. I know where every stapler is.", ask: "Do people ever borrow your supplies?",
        secret: "Has taken home 200 staplers from work.", act: ["Get cagey about your desk drawers.", "Defend the word “borrowing.”"], try: "Ask if the stapler “comes without a name tag.”" },
      { fact: "Works in a very busy office.", open: "Office life. Meetings, emails, staplers. Living the dream.", ask: "What’s the worst part of your job?",
        secret: "Hides in the supply closet to avoid meetings.", act: ["Jump whenever anyone says “meeting.”", "Mention the supply closet fondly."], try: "Ask if the stapler “gets you out of meetings.”" },
      { fact: "Does arts and crafts with the kids every weekend.", open: "Crafts every weekend. Glitter everywhere.", ask: "What’s the best craft you’ve made?",
        secret: "Stapled their own thumb to a poster board. Twice.", act: ["Hold your thumb carefully.", "Wince at the word “staple.”"], try: "Ask if the stapler “has a thumb guard.”" }],
    "Paperclip": [
      { fact: "Is the office tech genius everyone asks for help.", open: "I’m the tech genius at work, so I’ll know if this is any good.", ask: "How do you fix things so fast?",
        secret: "Fixes everything by poking it with a paperclip.", act: ["Use big tech words, then go vague.", "Mime poking something into a tiny hole."], try: "Ask if the paperclip “counts as a tech tool.”" },
      { fact: "Is a professional magician.", open: "Magician. Pick a card. Any card. Okay, not now.", ask: "What’s your best trick?",
        secret: "Only knows one trick, and it uses a paperclip.", act: ["Offer to “show them sometime.”", "Fidget with something tiny."], try: "Ask if the paperclip “does more than one trick.”" },
      { fact: "Is extremely organized.", open: "Everything I own is clipped, labeled, and filed.", ask: "How do you keep everything so organized?",
        secret: "Clipped their own fingers together and went to the ER.", act: ["Hold your fingers carefully.", "Get defensive about “safety.”"], try: "Ask if the paperclip “is finger-friendly.”" }],
    "Doorbell": [
      { fact: "Has a security camera on every door.", open: "Just so you know, I have cameras on every door. Who sent you?", ask: "Who are you keeping an eye out for?",
        secret: "Is hiding from a very persistent salesperson.", act: ["Glance nervously at the door.", "Get suspicious of the Peddler."], try: "Ask if the doorbell “can screen visitors.”" },
      { fact: "Says their door is always open.", open: "My door is always open. Well, unlocked. Come by.", ask: "How many people come by in a week?",
        secret: "Pretends not to be home whenever the doorbell rings.", act: ["Freeze whenever anything rings.", "Whisper “shh” by accident."], try: "Ask if the doorbell “has a ‘not home’ setting.”" },
      { fact: "Lives on a very busy street.", open: "Busy street. Delivery trucks all day long.", ask: "What do you order online?",
        secret: "Orders a package every day just to hear the doorbell.", act: ["Light up at the word “delivery.”", "Get vague about what you ordered."], try: "Ask if the doorbell “rings more often.”" }],
    "Phone booth": [
      { fact: "Collects antique telephones.", open: "I have a 1960s phone booth in my living room.", ask: "Where did you get a phone booth?",
        secret: "Took it from a train station in the middle of the night.", act: ["Get cagey about how you got it.", "Say “it was abandoned, basically.”"], try: "Ask if the phone booth “fits in a pickup truck.”" },
      { fact: "Refuses to own a cell phone.", open: "No cell phone. Never. They’re watching us.", ask: "How do people reach you?",
        secret: "Has three secret cell phones in their car.", act: ["Pat your pocket when anything buzzes.", "Get defensive about “privacy.”"], try: "Ask if the phone booth “hides cell phones.”" },
      { fact: "Collects first-edition comic books.", open: "Comic book collector. First editions. Mint condition.", ask: "Who’s your favorite superhero?",
        secret: "Changes into a superhero costume in phone booths. For fun.", act: ["Mention capes vaguely.", "Strike a hero pose once."], try: "Ask if the phone booth “is good for quick changes.”" }],
    "Cuckoo clock": [
      { fact: "Is obsessed with being on time.", open: "You’re thirty seconds late. I noticed. I notice these things.", ask: "Were you on time today?",
        secret: "Is late for everything and blames the clocks.", act: ["Check the time constantly.", "Blame “the clocks” for anything that goes wrong."], try: "Ask if the cuckoo clock “keeps accurate time,” suspiciously." },
      { fact: "Just got back from a trip to Switzerland.", open: "Just back from Switzerland. Chocolate, mountains, clocks.", ask: "What was your favorite part of Switzerland?",
        secret: "Never went. Bought everything at the airport gift shop.", act: ["Get vague about Swiss places.", "Mention the airport a lot."], try: "Ask if the cuckoo clock “makes it look like you traveled.”" },
      { fact: "Works the night shift.", open: "Night shift. I sleep during the day. Don’t call me.", ask: "How do you sleep during the day?",
        secret: "Their cuckoo clock wakes them up every hour and they haven’t slept in years.", act: ["Twitch every few minutes.", "Say “cuckoo” under your breath."], try: "Ask if the cuckoo clock “has a mute button.”" }],
    "Baby monitor": [
      { fact: "Has a brand-new baby.", open: "New parent! Sorry if I fall asleep mid-sentence.", ask: "How is the baby sleeping?",
        secret: "Uses the baby monitor to listen in on the neighbors.", act: ["Know oddly specific things about the neighbors.", "Hold an invisible earpiece."], try: "Ask if the baby monitor “has long range.”" },
      { fact: "Is the family worrier.", open: "I worry about everything. It’s my job in the family.", ask: "What do you worry about most?",
        secret: "Uses a baby monitor on their 30-year-old son.", act: ["Mention your son a lot.", "Ask if things “work across town.”"], try: "Ask if the baby monitor “works on grown-ups.”" },
      { fact: "Runs a doggy daycare.", open: "Doggy daycare owner. Forty dogs a day.", ask: "What’s the hardest part of the job?",
        secret: "Lost a dog for a whole day. It was under their desk.", act: ["Look under things nervously.", "Count to forty under your breath."], try: "Ask if the baby monitor “works on dogs.”" }],
    "Bubble wrap": [
      { fact: "Pops bubble wrap to relax.", open: "*pop* Sorry. Bubble wrap. It calms me down. *pop*", ask: "Where do you keep all that bubble wrap?",
        secret: "Has a whole spare room filled with bubble wrap.", act: ["Get dreamy whenever anything “pops.”", "Ask about packaging before the product."], try: "Ask if the bubble wrap comes “really, REALLY well wrapped.”" },
      { fact: "Is very, very clumsy.", open: "Sorry in advance. I knock things over.", ask: "What’s the last thing you broke?",
        secret: "Wraps themselves in bubble wrap before leaving the house.", act: ["Move very carefully.", "Make a tiny crinkling sound when you sit."], try: "Ask if the bubble wrap “comes in full-body size.”" },
      { fact: "Works for a moving company.", open: "Professional mover. I’ve packed a thousand houses.", ask: "What’s the hardest thing you’ve moved?",
        secret: "Has broken something in every single move.", act: ["Get defensive about “accidents.”", "Talk about insurance a lot."], try: "Ask if the bubble wrap “is mover-proof.”" }],
    "Snow globe": [
      { fact: "Collects snow globes from every city they visit.", open: "I collect snow globes from every city. I’ve been everywhere.", ask: "What’s your favorite city you’ve visited?",
        secret: "Has never left their home state. Buys them online.", act: ["Name cities, then get vague about visiting them.", "Change the subject when travel comes up."], try: "Ask if the snow globe “makes it look like you’ve traveled.”" },
      { fact: "Loves winter more than anything.", open: "Winter is the best. Snow, cocoa, sweaters.", ask: "What’s your favorite winter activity?",
        secret: "Has never seen real snow.", act: ["Ask whether snow is “more like sugar or salt.”", "Get vague about winter trips."], try: "Ask if the snow globe “shows what real snow is like.”" },
      { fact: "Runs a gift shop.", open: "Gift shop owner. Snow globes are my best sellers.", ask: "What’s your best-selling item?",
        secret: "Shakes every snow globe in the shop when no one’s looking.", act: ["Shake an imaginary globe.", "Get dreamy at the word “glitter.”"], try: "Ask if the snow globe “is shake-proof.”" }],
    "Toilet plunger": [
      { fact: "Is a plumber.", open: "Plumber. Twenty years. I’ve seen things.", ask: "What’s the worst job you’ve had?",
        secret: "Is terrified of toilets after a childhood incident.", act: ["Shudder at the word “flush.”", "Talk about sinks instead."], try: "Ask if the toilet plunger “keeps a safe distance.”" },
      { fact: "Hosts the big family holidays.", open: "Thanksgiving at my house. Thirty people, one bathroom.", ask: "How do thirty people share one bathroom?",
        secret: "Clogged the toilet at the in-laws’ house and blamed the dog.", act: ["Get nervous about in-laws.", "Blame the dog for something."], try: "Ask if the toilet plunger “works quietly.”" },
      { fact: "Is a fancy restaurant critic.", open: "Restaurant critic. Five stars or nothing.", ask: "What do you judge restaurants on?",
        secret: "Only rates restaurants on their bathrooms.", act: ["Talk about soap quality.", "Mention hand dryers with passion."], try: "Ask if the toilet plunger “is five-star quality.”" }],
    "Fire extinguisher": [
      { fact: "Is the safety officer at work.", open: "As a trained safety officer, I’ll need to see the fire exits first.", ask: "Any incidents at work lately?",
        secret: "Set off the fire sprinklers at the company holiday party.", act: ["Tense up at the words “fire” or “alarm.”", "Insist safety is “very important now.”"], try: "Ask if the fire extinguisher is “sprinkler-safe.”" },
      { fact: "Cooks dinner every night.", open: "I cook every night. Chef-level. Ask anyone.", ask: "What did you cook last night?",
        secret: "Sets off the smoke alarm every single time.", act: ["Wave away invisible smoke.", "Call burnt food “blackened.”"], try: "Ask if the fire extinguisher “comes in a two-pack.”" },
      { fact: "Loves camping and campfires.", open: "Campfire stories, s’mores, the works. I love camping.", ask: "What’s your best campfire story?",
        secret: "Has never managed to light a campfire.", act: ["Talk about fires without ever lighting one.", "Mention matches with frustration."], try: "Ask if the fire extinguisher “starts fires too.”" }]
  };
  // Item categories: only used to pick believable Secret Sleuth decoys from similar products.
  C.themes = [
    { id: "water", items: ["Rubber duck", "Bathtub", "Fishbowl", "Shower cap", "Pool noodle", "Hot tub", "Garden hose", "Ice cube tray", "Umbrella"] },
    { id: "kitchen", items: ["Toaster", "Lunchbox", "Pizza cutter", "Waffle iron", "Rolling pin", "Pickle jar", "Teapot", "Slow cooker", "Salad spinner"] },
    { id: "fitness", items: ["Bowling ball", "Trampoline", "Pogo stick", "Unicycle", "Yoga mat", "Hula hoop", "Treadmill", "Bicycle helmet", "Ski goggles"] },
    { id: "party", items: ["Kazoo", "Disco ball", "Accordion", "Tuba", "Megaphone", "Wind chime", "Lava lamp", "Mood ring"] },
    { id: "lounge", items: ["Lawn chair", "Hammock", "Rocking chair", "Bean bag chair", "Recliner", "Ceiling fan", "Sleeping bag"] },
    { id: "yard", items: ["Garden gnome", "Leaf blower", "Wheelbarrow", "Scarecrow", "Mailbox", "Traffic cone", "Step ladder"] },
    { id: "style", items: ["Sock", "Hairbrush", "Fanny pack", "Cowboy boots", "Tiara", "Backpack", "Shopping cart"] },
    { id: "gadgets", items: ["Stapler", "Paperclip", "Doorbell", "Phone booth", "Cuckoo clock", "Baby monitor", "Bubble wrap", "Snow globe", "Toilet plunger", "Fire extinguisher"] }
  ];
  C.themeOf = (item) => C.themes.find((t) => t.items.indexOf(item) >= 0) || C.themes[0];
  /** Story i of an Item, ready for a Prospect: fun fact, opening line, hint question, secret and acting hints. */
  C.tell = (item, i) => {
    const st = (C.productStories[item] || [])[i];
    if (!st) return null;
    return { key: item + '#' + i, item, topic: C.themeOf(item).id, fact: st.fact, open: st.open, ask: st.ask, secret: st.secret, hints: st.act.concat('Try this: ' + st.try) };
  };
  C.storiesFor = (item) => (C.productStories[item] || []).map((_, i) => C.tell(item, i));

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
  // Hidden Prospect details: what would make them buy, and what holds them back. The Peddler has to
  // find these out (+$5 each when the Prospect ticks them off).
  C.motivations = [
    'Wants to impress the neighbors.', 'Needs more free time in the mornings.', 'Wants to save money in the long run.',
    'Is shopping for a gift for a very picky relative.', 'Wants something the whole family can use.', 'Loves being the first to own new gadgets.',
    'Wants to feel less stressed at home.', 'Is trying to get healthier this year.', 'Needs something that makes work easier.',
    'Wants to finally win at something.', 'Wants to be the most popular person on the block.', 'Is trying to make their home cozier.',
    'Wants a great story to tell at parties.', 'Needs to keep the kids busy.', 'Is redecorating and wants a statement piece.',
    'Wants peace and quiet, at any cost.'
  ];
  C.concerns = [
    'Thinks it’s too expensive.', 'Doesn’t have room for it.', 'Worries it will break in a week.', 'Doesn’t trust new gadgets.',
    'Needs to ask their partner first.', 'Thinks it looks complicated.', 'Worries what the neighbors will say.', 'Already owns something similar.',
    'Hates monthly payments.', 'Is worried it’s too loud.', 'Doesn’t want to deal with returns.', 'Thinks it’s just a fad.',
    'Is nervous about safety.', 'Worries it will need batteries forever.', 'Doesn’t have time to learn something new.',
    'Got burned by a salesperson once and never forgot it.'
  ];
  // The hidden details, in the order the Prospect's checklist shows them.
  C.detailFields = [
    { id: 'age', name: 'Exact age' }, { id: 'marital', name: 'Relationship status' }, { id: 'kids', name: 'Children and family' },
    { id: 'job', name: 'Occupation' }, { id: 'motive', name: 'Buying motivation' }, { id: 'concern', name: 'Biggest objection' }
  ];
  C.detailText = (field, pr) => field === 'kids' ? (pr.kids ? pr.kids + (pr.kids === 1 ? ' kid' : ' kids') : 'No kids') : String(pr[field]);

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
