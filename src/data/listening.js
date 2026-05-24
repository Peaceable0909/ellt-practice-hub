export const LISTENING = [
  {
    id: 'l1',
    title: 'Concerts',
    topic: 'Music & Entertainment',
    diff: 'B2',
    type: 'Multi-Speaker Analysis',
    audio: 'https://oxfordellt.com/wp-content/uploads/2025/11/ST-JC-LA-Concerts.mp3',
    intro: 'Listen to three speakers — A, B, and C — discussing concerts. Match each statement to the correct speaker, or choose "None" if no speaker expresses this view.',
    qs: [
      { q: 'Which speaker suggests that being in a crowd with loud music sometimes spoils their experience?', opts: ['Speaker A', 'Speaker B', 'Speaker C', 'None'], a: 2 },
      { q: 'Which speaker says concert tickets and extras cost too much?', opts: ['Speaker A', 'Speaker B', 'Speaker C', 'None'], a: 0 },
      { q: 'Which speaker mentions that smaller concerts give you a more enjoyable experience than large ones?', opts: ['Speaker A', 'Speaker B', 'Speaker C', 'None'], a: 1 },
      { q: 'Which speaker hates when the crowd starts pushing each other?', opts: ['Speaker A', 'Speaker B', 'Speaker C', 'None'], a: 1 },
      { q: 'Who says attending concerts is one of the best ways to show your love for artists that you like?', opts: ['Speaker A', 'Speaker B', 'Speaker C', 'None'], a: 2 },
      { q: "Which speaker thinks the sound isn't as good at a concert compared to recorded music?", opts: ['Speaker A', 'Speaker B', 'Speaker C', 'None'], a: 0 },
      { q: 'Which speaker says that compared to single-artist concerts, festivals offer a more engaging diversity of musical acts?', opts: ['Speaker A', 'Speaker B', 'Speaker C', 'None'], a: 3 },
      { q: 'Which speaker complains that many people spend too much time recording the show instead of enjoying it?', opts: ['Speaker A', 'Speaker B', 'Speaker C', 'None'], a: 1 },
    ],
  },
  {
    id: 'l2',
    title: 'Cycling Gadgets',
    topic: 'Technology & Sport',
    diff: 'B2',
    type: 'Dialogue',
    audio: 'https://oxfordellt.com/wp-content/uploads/2025/11/ST_ROT_D_Cycle_GADGETS.mp3',
    intro: 'Listen to a radio interview with the product lead of an inflatable cycling helmet (the aH-1). Then answer the questions below.',
    qs: [
      { q: 'How does the presenter travel?', opts: ['She prefers driving', 'She prefers cycling', 'She prefers walking', 'She prefers staying home'], a: 2 },
      { q: 'What does the research say about traditional helmets?', opts: ['They look strange', 'They are hard to carry', 'They are uncomfortable', 'They are unsafe'], a: 1 },
      { q: 'What does Emma suggest about the aH-1?', opts: ['It is too complex', 'It is too expensive', 'It is not necessary', 'It is not useful'], a: 0 },
      { q: 'How does Colin compare the aH-1 to normal helmets?', opts: ['They are generally safer', 'They are generally more expensive', 'They are generally lighter', 'They are generally more comfortable'], a: 1 },
      { q: 'Colin suggests the aH-1 will be widely adopted.', opts: ['True', 'False', 'Not mentioned'], a: 2 },
      { q: 'The aH-1 is better for the environment than a rigid helmet.', opts: ['True', 'False', 'Not mentioned'], a: 0 },
      { q: 'How does Emma feel about the aH-1?', opts: ['Openly doubtful', 'Somewhat undecided', 'Largely unconcerned', 'Cautiously impressed'], a: 1 },
      { q: 'What is the radio show about?', opts: ['Cycling and safety', 'Cycling and sports', 'Cycling and business', 'Cycling and work'], a: 0 },
    ],
  },
  {
    id: 'l3',
    title: 'Family Traditions',
    topic: 'Culture & Society',
    diff: 'C1',
    type: 'Multi-Speaker Analysis',
    audio: 'https://oxfordellt.com/wp-content/uploads/2025/11/ST_LA_DG_Family_traditions.mp3',
    intro: 'Listen to three speakers (A, B, C) describe their family traditions. Match each statement to the correct speaker.',
    qs: [
      { q: 'Which speaker talks about a tradition when the weather is cold?', opts: ['Speaker A', 'Speaker B', 'Speaker C', 'None'], a: 2 },
      { q: 'Which speaker says the tradition all started by accident?', opts: ['Speaker A', 'Speaker B', 'Speaker C', 'None'], a: 0 },
      { q: 'Which speaker understands that their tradition might seem unusual to other people?', opts: ['Speaker A', 'Speaker B', 'Speaker C', 'None'], a: 0 },
      { q: 'Which speaker says the tradition changed because someone now lives in another place?', opts: ['Speaker A', 'Speaker B', 'Speaker C', 'None'], a: 2 },
      { q: 'Which speaker says they maintain their tradition but in shorter form than it once was?', opts: ['Speaker A', 'Speaker B', 'Speaker C', 'None'], a: 1 },
      { q: 'Which speaker says their tradition is an opportunity for time away from daily obligations?', opts: ['Speaker A', 'Speaker B', 'Speaker C', 'None'], a: 1 },
      { q: 'Which speaker says the tradition is the beginning of a time of year?', opts: ['Speaker A', 'Speaker B', 'Speaker C', 'None'], a: 2 },
      { q: 'Which speaker has food that resembles something important to their tradition?', opts: ['Speaker A', 'Speaker B', 'Speaker C', 'None'], a: 0 },
    ],
  },
  {
    id: 'l4',
    title: 'Hydration',
    topic: 'Health & Science',
    diff: 'B2',
    type: 'Monologue',
    audio: 'https://oxfordellt.com/wp-content/uploads/2025/11/ST_ROT_M_Hydration.mp3',
    intro: 'Listen to a speaker share their personal experience with improving hydration habits. Then answer the questions.',
    qs: [
      { q: 'What does the speaker drink in the evenings?', opts: ['Coffee', 'Tea', 'Wine', 'Water'], a: 2 },
      { q: 'What was the main reason the speaker started drinking more water?', opts: ['Advice from friends', 'Listening to podcasts', 'The warm weather', 'Feeling tired'], a: 0 },
      { q: 'How does the speaker feel about drinking tea?', opts: ['They drink too much compared to coffee', 'They feel it is healthier than coffee', 'They think it is not as useful as water', 'They think tea makes them thirsty'], a: 2 },
      { q: 'The speaker mentions how water made them feel less tired after a walk.', opts: ['True', 'False', 'Not mentioned'], a: 0 },
      { q: 'The speaker warns about drinking too many energy drinks.', opts: ['True', 'False', 'Not mentioned'], a: 2 },
      { q: 'What advice does the speaker give?', opts: ['Listen to your body', 'Check the weather', 'Drink energy drinks', 'Avoid coffee'], a: 0 },
      { q: "What best describes the speaker's overall experience?", opts: ["Small changes don't give big results", 'Habits are often difficult to change', 'Not all habits are bad', 'Small changes can be meaningful'], a: 3 },
      { q: 'What is the audio about?', opts: ['Getting exercise', 'Doing work', 'Playing sports', 'Drinking water'], a: 3 },
    ],
  },
  {
    id: 'l5',
    title: 'Locally Sourced Food',
    topic: 'Environment & Food',
    diff: 'C1',
    type: 'Dialogue',
    audio: 'https://oxfordellt.com/wp-content/uploads/2025/11/ST_CDA_Locally_sourced_food.mp3',
    intro: 'Listen to two friends, Amy and Brandon, discuss trying to eat only locally sourced Canadian food. Then answer the questions.',
    qs: [
      { q: 'What is the main issue Amy opens up the conversation with?', opts: ['Frustration over grocery prices', 'Lack of recipe ideas', 'Difficulty finding time to cook', 'Disappointment over quality of food'], a: 0 },
      { q: 'How did Brandon characterize trying to cook with only Canadian ingredients?', opts: ['It was overwhelming and frustrating', 'It was a straightforward process', 'It was pleasant but lacked ingredients', 'It was easy once he learned the stores'], a: 0 },
      { q: 'What can be inferred about food labeling practices?', opts: ['They are completely transparent', 'They can be misleading to consumers', 'They reassure buyers about their selection', 'They ensure consistency across products'], a: 1 },
      { q: 'The speaker made a soup last week.', opts: ['True', 'False', 'Not Given'], a: 1 },
      { q: 'What can be implied about the mention of lemons throughout?', opts: ['Farmers must try to grow citrus locally', 'Imported produce is generally superior', 'Speakers should eat more locally sourced fruit', 'Living without common imported foods is unrealistic'], a: 3 },
      { q: 'Food grown in greenhouses tastes bad.', opts: ['True', 'False', 'Not Given'], a: 1 },
      { q: 'How does Brandon describe the pace of change needed for local food systems?', opts: ['The transformation is too ambitious', 'Change will be immediate once people realize its benefits', 'It will happen rapidly due to food supply problems', 'People will need time to adapt to new habits'], a: 3 },
      { q: 'What is the main issue discussed in the conversation?', opts: ['The difficulty of affording groceries', 'The challenge of eating locally sourced food in a globalized system', 'The environmental impact of food packaging', 'The rise of a new dietary trend in Canada'], a: 1 },
    ],
  },
  {
    id: 'l6',
    title: 'Cherry Blossoms',
    topic: 'Nature & Travel',
    diff: 'B2',
    type: 'Monologue',
    audio: 'https://oxfordellt.com/wp-content/uploads/2025/11/ST_LOB_Cherry_Blossoms.mp3',
    intro: 'Listen to a monologue about how cherry blossom trees came to Washington DC. Then answer the questions.',
    qs: [
      { q: 'Eliza Scidmore was the first person to plant cherry trees in the US.', opts: ['True', 'False', 'Not mentioned'], a: 1 },
      { q: 'Why did David Fairchild first decide to plant cherry trees in his garden?', opts: ['He thought the trees would have economic value', 'He was likely inspired by their beauty after seeing them in Japan', "He wanted to share Japan's culture with the US", 'To encourage the government to plant the trees'], a: 1 },
      { q: 'Why were cherry trees considered a good addition to Washington DC?', opts: ['They would make the city look better', 'They would provide fruit for people in the city', 'They would help prevent flooding from the Potomac River', 'They would boost tourist numbers'], a: 0 },
      { q: 'Why did the Japanese government first send cherry trees to Washington DC?', opts: ["To fulfil Fairchild's order for his town", 'To replace American trees that were dying', 'To establish a friendly relationship with the US', 'To promote Japanese culture abroad'], a: 2 },
      { q: 'Why did Japan send a second shipment of cherry trees?', opts: ['To send a larger quantity', 'To correct the quality issues of the first shipment', 'To introduce a different variety', 'To replace trees which were stolen'], a: 1 },
      { q: 'Who planted the first cherry tree in Washington DC?', opts: ['David Fairchild', "A Japanese politician's wife", 'The president of the US', "The US president's wife"], a: 3 },
      { q: 'Cherry trees often live for about 50 years.', opts: ['True', 'False', 'Not mentioned'], a: 1 },
      { q: 'What is the talk about?', opts: ['How cherry trees arrived in the US', 'How to celebrate the Cherry Blossom Festival', 'Why cherry trees are important to Japan', 'The benefits of cherry trees for the US'], a: 0 },
    ],
  },
]

// ─── CORRECTED IELTS Listening Tests ─────────────────────────────────────────
// Full tapescripts extracted — all answers verified from official Cambridge materials

export const LISTENING_IELTS = [
  {
    id: 'li1',
    title: "Packham's Shipping Agency",
    intro: "You will hear a telephone conversation between a customer named Jacob and an agent at a shipping company. Complete the customer quotation form.",
    audio: '/audio/ielts-packham-shipping.mp3',
    diff: 'B2', source: 'IELTS Academic',
    qs: [
      { q: "Q1. Customer's surname (write in CAPITALS)", type:'fill', a:'MKERE' },
      { q: "Q2. Name of college (______ College, Downlands Rd)", type:'fill', a:'WESTALL' },
      { q: "Q3. Postcode", type:'fill', a:'BS8 9PU' },
      { q: "Q4. Container width", type:'fill', a:'0.75M' },
      { q: "Q5. Container height", type:'fill', a:'0.5M' },
      { q: "Q6. Second item in contents (after clothes)", type:'fill', a:'BOOKS' },
      { q: "Q7. Third item in contents", type:'fill', a:'TOYS' },
      { q: "Q8. Total estimated value (£)", type:'fill', a:'1700' },
      { q: "Q9. Type of insurance chosen:", opts:['A. Economy','B. Standard','C. Premium'], a:2 },
      { q: "Q10. Customer wants goods delivered to:", opts:['A. Port','B. Home','C. Depot'], a:0 },
    ]
  },
  {
    id: 'li2',
    title: 'Social Contacts in the UK',
    intro: "You will hear a talk given to a group going to stay in the UK about making social contacts. Answer the questions.",
    audio: '/audio/ielts-social-contacts.mp3',
    diff: 'B2', source: 'IELTS Academic',
    qs: [
      { q: "Q11. First factor that makes social contact in a foreign country difficult:", type:'fill', a:'LANGUAGE' },
      { q: "Q12. Second factor that makes social contact difficult:", type:'fill', a:'CUSTOMS' },
      { q: "Q13. Community group type (besides theatre):", type:'fill', a:'MUSIC' },
      { q: "Q14. Another community group type mentioned:", type:'fill', a:'LOCAL HISTORY' },
      { q: "Q15. First place to find information about community activities:", type:'fill', a:'TOWN HALL' },
      { q: "Q16. Second place to find information about community activities:", type:'fill', a:'(PUBLIC) LIBRARY' },
    ]
  },
  {
    id: 'li3',
    title: 'The National Arts Centre',
    intro: "You will hear a radio broadcast about the National Arts Centre. Complete the notes and table.",
    audio: '/audio/ielts-national-arts-centre.mp3',
    diff: 'C1', source: 'IELTS Academic',
    qs: [
      { q: "Q11. The National Arts Centre is well known for:", type:'fill', a:'CLASSICAL MUSIC' },
      { q: "Q12. Additional facility in the complex (besides concert rooms, theatres, cinemas, art galleries, public library and restaurants):", type:'fill', a:'BOOKSHOP' },
      { q: "Q13. In the 1960s the Centre was:", type:'fill', a:'PLANNED' },
      { q: "Q14. The Centre opened to the public in:", type:'fill', a:'1983' },
      { q: "Q15. The Centre is managed by:", type:'fill', a:'CITY COUNCIL' },
      { q: "Q16. The Centre is open how many days per year?", type:'fill', a:'363' },
      { q: "Q17. Where is 'The Magic Flute' performed on Monday and Tuesday?", type:'fill', a:'GARDEN HALL' },
      { q: "Q18. Name of the Canadian film showing on Wednesday:", type:'fill', a:'THREE LIVES' },
      { q: "Q19. Ticket price for the Wednesday film:", type:'fill', a:'£4.50' },
      { q: "Q20. Name of the art exhibition running Saturday and Sunday:", type:'fill', a:'FACES OF CHINA' },
    ]
  },
  {
    id: 'li4',
    title: 'Studying with the Open University',
    intro: "Two friends, Rachel and Paul, discuss studying with the Open University. Complete the sentences.",
    audio: '/audio/ielts-sentence-completion.mp3',
    diff: 'B2', source: 'IELTS Academic',
    qs: [
      { q: "Q27. Studying with the Open University demanded a great deal of:", type:'fill', a:'MOTIVATION' },
      { q: "Q28. Studying and working at the same time improved Rachel's ___ skills:", type:'fill', a:'TIME-MANAGEMENT' },
      { q: "Q29. It was helpful that the course was structured in:", type:'fill', a:'MODULES' },
      { q: "Q30. She enjoyed meeting other students at:", type:'fill', a:'SUMMER SCHOOLS' },
    ]
  },
  {
    id: 'li5',
    title: 'University Course Options',
    intro: "A Communication Studies student, Jack, talks to his tutor about optional courses. What does Jack say about each option?",
    audio: '/audio/ielts-multiple-choice.mp3',
    diff: 'C1', source: 'IELTS Academic',
    qs: [
      { q: "Q21. Media Studies — Jack will:", opts:["A. Definitely do it","B. May or may not do it","C. Won't do it"], a:2 },
      { q: "Q22. Women and Power — Jack will:", opts:["A. Definitely do it","B. May or may not do it","C. Won't do it"], a:0 },
      { q: "Q23. Culture and Society — Jack will:", opts:["A. Definitely do it","B. May or may not do it","C. Won't do it"], a:1 },
      { q: "Q24. Identity and Popular Culture — Jack will:", opts:["A. Definitely do it","B. May or may not do it","C. Won't do it"], a:0 },
      { q: "Q25. Introduction to Cultural Theory — Jack will:", opts:["A. Definitely do it","B. May or may not do it","C. Won't do it"], a:1 },
    ]
  },
  {
    id: 'li6',
    title: 'Hotel Information',
    intro: "A man asks for hotel information at a tourist information office. Match each description to the correct hotel.",
    audio: '/audio/ielts-matching-hotels.mp3',
    diff: 'B2', source: 'IELTS Academic',
    qs: [
      { q: "Q1. Which hotel is in a rural area?", opts:["A. The Bridge Hotel","B. Carlton House","C. The Imperial","D. The Majestic","E. The Royal Oak"], a:4 },
      { q: "Q2. Which hotel only opened recently?", opts:["A. The Bridge Hotel","B. Carlton House","C. The Imperial","D. The Majestic","E. The Royal Oak"], a:1 },
      { q: "Q3. Which hotel offers facilities for business functions?", opts:["A. The Bridge Hotel","B. Carlton House","C. The Imperial","D. The Majestic","E. The Royal Oak"], a:2 },
      { q: "Q4. Which hotel has an indoor swimming pool?", opts:["A. The Bridge Hotel","B. Carlton House","C. The Imperial","D. The Majestic","E. The Royal Oak"], a:0 },
    ]
  },
  {
    id: 'li7',
    title: 'Town Library Tour',
    intro: "You will hear the librarian of a new town library talking to a group of visitors. Label the plan of the library.",
    audio: '',
    diff: 'B2', source: 'IELTS Academic',
    qs: [
      { q: "Q11. What is in the first room on the left as you enter?", opts:["A. Art collection","B. Children's books","C. Computers","D. Local history collection","E. Meeting room","F. Multimedia","G. Periodicals","H. Reference books","I. Tourist information"], a:7 },
      { q: "Q12. What is in the room just beyond the librarian's desk on the right?", opts:["A. Art collection","B. Children's books","C. Computers","D. Local history collection","E. Meeting room","F. Multimedia","G. Periodicals","H. Reference books","I. Tourist information"], a:6 },
      { q: "Q13. What collection is on the far wall of the main library area?", opts:["A. Art collection","B. Children's books","C. Computers","D. Local history collection","E. Meeting room","F. Multimedia","G. Periodicals","H. Reference books","I. Tourist information"], a:3 },
      { q: "Q14. What is next door to the seminar room?", opts:["A. Art collection","B. Children's books","C. Computers","D. Local history collection","E. Meeting room","F. Multimedia","G. Periodicals","H. Reference books","I. Tourist information"], a:1 },
      { q: "Q15. What is in the large room to the right of the main library area?", opts:["A. Art collection","B. Children's books","C. Computers","D. Local history collection","E. Meeting room","F. Multimedia","G. Periodicals","H. Reference books","I. Tourist information"], a:5 },
    ]
  },
]


// ─── Cambridge IELTS 17 — Test 1 (Full 4-part test) ─────────────────────────

const CAM17_OPINIONS = [
  "A. Tim found this easier than expected.",
  "B. Tim thought this was not very clearly organised.",
  "C. Diana may do some further study on this.",
  "D. They both found the reading required for this was difficult.",
  "E. Tim was shocked at something he learned on this module.",
  "F. They were both surprised how little is known about some aspects of this."
]

export const LISTENING_CAM17_T1 = [
  {
    id: 'lc1', title: 'Cambridge IELTS 17 — Test 1 Part 1',
    intro: 'You will hear a conversation between a woman and a man about a local conservation group. Complete the notes.',
    audio: '/audio/cam17-t1-p1.mp3', diff: 'B2', source: 'Cambridge IELTS 17',
    qs: [
      { q: "Q1. Regular beach activity: making sure the beach does not have ___ on it", type:'fill', a:'LITTER' },
      { q: "Q2. Regular beach activity: checking there are no ___ on the beach", type:'fill', a:'DOGS' },
      { q: "Q3. Nature reserve — next task: taking action to attract ___ to the place", type:'fill', a:'INSECTS' },
      { q: "Q4. Nature reserve — ongoing task: identifying types of ___", type:'fill', a:'BUTTERFLIES' },
      { q: "Q5. Nature reserve — upcoming project: building a new ___", type:'fill', a:'WALL' },
      { q: "Q6. Saturday forthcoming event: walk across the sands and reach the ___", type:'fill', a:'ISLAND' },
      { q: "Q7. Saturday event — clothing requirement: wear appropriate ___", type:'fill', a:'BOOTS' },
      { q: "Q8. Woodwork session — suitable for ___ to participate in", type:'fill', a:'BEGINNERS' },
      { q: "Q9. Woodwork session — activity: making ___ out of wood", type:'fill', a:'SPOONS' },
      { q: "Q10. Woodwork session cost (no camping): £___", type:'fill', a:'35' },
    ]
  },
  {
    id: 'lc2', title: 'Cambridge IELTS 17 — Test 1 Part 2',
    intro: 'You will hear a tour guide talking to a group about a boat trip around Tasmania. Answer the questions.',
    audio: '/audio/cam17-t1-p2.mp3', diff: 'B2', source: 'Cambridge IELTS 17',
    qs: [
      { q: "Q11. What is the maximum number of people who can stand on each side of the boat?", opts:["A. 9","B. 15","C. 18"], a:0 },
      { q: "Q12. What colour are the tour boats?", opts:["A. Dark red","B. Jet black","C. Light green"], a:2 },
      { q: "Q13. Which lunchbox is suitable for someone who doesn't eat meat or fish?", opts:["A. Lunchbox 1","B. Lunchbox 2","C. Lunchbox 3"], a:1 },
      { q: "Q14. What should people do with their litter?", opts:["A. Take it home","B. Hand it to a member of staff","C. Put it in the bins provided on the boat"], a:1 },
      { q: "Q15. Which is ONE of the TWO features of the lighthouse that Lou mentions?", opts:["A. Why it was built","B. Who built it","C. How long it took to build","D. Who staffed it","E. What it was built with"], a:[0,3] },
      { q: "Q16. Which is the OTHER feature of the lighthouse that Lou mentions?", opts:["A. Why it was built","B. Who built it","C. How long it took to build","D. Who staffed it","E. What it was built with"], a:[0,3] },
      { q: "Q17. Which is ONE of the TWO types of creature that might come close to the boat?", opts:["A. Sea eagles","B. Fur seals","C. Dolphins","D. Whales","E. Penguins"], a:[1,2] },
      { q: "Q18. Which is the OTHER type of creature that might come close to the boat?", opts:["A. Sea eagles","B. Fur seals","C. Dolphins","D. Whales","E. Penguins"], a:[1,2] },
      { q: "Q19. Which is ONE of the TWO points Lou makes about the caves?", opts:["A. Only large tourist boats can visit them","B. The entrances are often blocked","C. It is too dangerous for individuals to go near them","D. Someone will explain what is inside them","E. They cannot be reached on foot"], a:[3,4] },
      { q: "Q20. Which is the OTHER point Lou makes about the caves?", opts:["A. Only large tourist boats can visit them","B. The entrances are often blocked","C. It is too dangerous for individuals to go near them","D. Someone will explain what is inside them","E. They cannot be reached on foot"], a:[3,4] },
    ]
  },
  {
    id: 'lc3', title: 'Cambridge IELTS 17 — Test 1 Part 3',
    intro: 'You will hear two veterinary science students, Diana and Tim, discussing their work experience on farms.',
    audio: '/audio/cam17-t1-p3.mp3', diff: 'C1', source: 'Cambridge IELTS 17',
    qs: [
      { q: "Q21. What problem did BOTH Diana and Tim have when arranging work experience?", opts:["A. Making initial contact with suitable farms","B. Organising transport to and from the farm","C. Finding a placement for the required length of time"], a:1 },
      { q: "Q22. Tim was pleased to be able to help:", opts:["A. A lamb that had a broken leg","B. A sheep having difficulty giving birth","C. A newly born lamb having trouble feeding"], a:1 },
      { q: "Q23. Diana says the sheep on her farm:", opts:["A. Were of various different varieties","B. Were mainly reared for their meat","C. Had better quality wool than sheep on the hills"], a:0 },
      { q: "Q24. What did the students learn about adding supplements to chicken feed?", opts:["A. These should only be given if specially needed","B. It is worth paying extra for the most effective ones","C. The amount given at one time should be limited"], a:0 },
      { q: "Q25. What happened when Diana was working with dairy cows?", opts:["A. She identified some cows incorrectly","B. She accidentally threw some milk away","C. She made a mistake when storing milk"], a:1 },
      { q: "Q26. What did BOTH farmers mention about vets and farming?", opts:["A. Vets are failing to cope with some aspects of animal health","B. There needs to be a fundamental change in the training of vets","C. Some jobs could be done by the farmer rather than by a vet"], a:2 },
      { q: "Q27. Medical terminology — which opinion matches?", opts: CAM17_OPINIONS, a:0 },
      { q: "Q28. Diet and nutrition — which opinion matches?", opts: CAM17_OPINIONS, a:4 },
      { q: "Q29. Animal disease — which opinion matches?", opts: CAM17_OPINIONS, a:5 },
      { q: "Q30. Wildlife medication — which opinion matches?", opts: CAM17_OPINIONS, a:3 },
    ]
  },
  {
    id: 'lc4', title: 'Cambridge IELTS 17 — Test 1 Part 4',
    intro: 'You will hear a lecturer talking about labyrinths. Complete the notes. Write ONE WORD ONLY for each answer.',
    audio: '/audio/cam17-t1-p4.mp3', diff: 'C1', source: 'Cambridge IELTS 17',
    qs: [
      { q: "Q31. Mazes compared with labyrinths — Mazes are a type of ___", type:'fill', a:'PUZZLE' },
      { q: "Q32. ___ is needed to navigate through a maze", type:'fill', a:'LOGIC' },
      { q: "Q33. The word 'maze' is derived from a word meaning a feeling of ___", type:'fill', a:'CONFUSION' },
      { q: "Q34. The earliest examples of the labyrinth spiral pattern have been found carved in ___", type:'fill', a:'STONE' },
      { q: "Q35. In Ancient Greece, the labyrinth spiral was used on ___", type:'fill', a:'COINS' },
      { q: "Q36. In Northern Europe, actual physical labyrinths were made using ___", type:'fill', a:'TREE' },
      { q: "Q37. Walking labyrinths can help with ___ and relaxation", type:'fill', a:'BREATHING' },
      { q: "Q38. Mini labyrinths used on ___ allow finger meditation", type:'fill', a:'PAPER' },
      { q: "Q39. Labyrinths have been used to help manage ___", type:'fill', a:'ANXIETY' },
      { q: "Q40. Today, labyrinths are widely used for ___ and prayer", type:'fill', a:'MEDITATION' },
    ]
  },
]


// ─── Cambridge IELTS 16 — Test 1 ─────────────────────────────────────────────

export const LISTENING_CAM17_T3 = [
  {
    id: 'lc17t3p1', title: 'Cambridge IELTS 17 — Test 3 Part 1',
    intro: 'You will hear a conversation between a woman and a man about a surfing holiday. Complete the notes.',
    audio: '/audio/cam16-t1-p1.mp3', diff: 'B2', source: 'Cambridge IELTS 17',
    qs: [
      { q: "Q1. Group type: enquiring for a ___ holiday", type:'fill', a:'FAMILY' },
      { q: "Q2. Requirement: all members need to be ___", type:'fill', a:'FIT' },
      { q: "Q3. Accommodation available: various ___ in the area", type:'fill', a:'HOTELS' },
      { q: "Q4. Name of the beach location:", type:'fill', a:'CARROWNISKEY' },
      { q: "Q5. Equipment hire: save money by hiring by the ___", type:'fill', a:'WEEK' },
      { q: "Q6. Saturday activity: going to the ___", type:'fill', a:'BAY' },
      { q: "Q7. Best month to visit:", type:'fill', a:'SEPTEMBER' },
      { q: "Q8. Average temperature (degrees Celsius):", type:'fill', a:'19' },
      { q: "Q9. Daily hire rate (euros, before weekly discount):", type:'fill', a:'30' },
      { q: "Q10. Essential equipment to bring: ___", type:'fill', a:'BOOTS' },
    ]
  },
  {
    id: 'lc17t3p2', title: 'Cambridge IELTS 17 — Test 3 Part 2',
    intro: 'You will hear a guide talking to a group about a local history tour. Answer the questions.',
    audio: '/audio/cam16-t1-p2.mp3', diff: 'B2', source: 'Cambridge IELTS 17',
    qs: [
      { q: "Q11. Which is ONE of the TWO things that surprised the guide about the local history?", opts:["A. The age of some buildings","B. The variety of industries that existed","C. The number of people who once lived there","D. How recently some changes occurred","E. The extent of international trade"], a:[1,4] },
      { q: "Q12. Which is the OTHER thing that surprised the guide?", opts:["A. The age of some buildings","B. The variety of industries that existed","C. The number of people who once lived there","D. How recently some changes occurred","E. The extent of international trade"], a:[1,4] },
      { q: "Q13. What is at location marked G on the map?", opts:["A. Old bakery","B. Mill","C. Tannery","D. Port office","E. School","F. Jail","G. Church","H. Market"], a:6 },
      { q: "Q14. What is at location C on the map?", opts:["A. Old bakery","B. Mill","C. Tannery","D. Port office","E. School","F. Jail","G. Church","H. Market"], a:2 },
      { q: "Q15. What is at location A on the map?", opts:["A. Old bakery","B. Mill","C. Tannery","D. Port office","E. School","F. Jail","G. Church","H. Market"], a:0 },
      { q: "Q16. What is at location E on the map?", opts:["A. Old bakery","B. Mill","C. Tannery","D. Port office","E. School","F. Jail","G. Church","H. Market"], a:4 },
      { q: "Q17. What is at location D on the map?", opts:["A. Old bakery","B. Mill","C. Tannery","D. Port office","E. School","F. Jail","G. Church","H. Market"], a:3 },
      { q: "Q18. What is at location H on the map?", opts:["A. Old bakery","B. Mill","C. Tannery","D. Port office","E. School","F. Jail","G. Church","H. Market"], a:6 },
      { q: "Q19. What is at location F on the map?", opts:["A. Old bakery","B. Mill","C. Tannery","D. Port office","E. School","F. Jail","G. Church","H. Market"], a:5 },
      { q: "Q20. What is at location C (second area) on the map?", opts:["A. Old bakery","B. Mill","C. Tannery","D. Port office","E. School","F. Jail","G. Church","H. Market"], a:2 },
    ]
  },
  {
    id: 'lc17t3p3', title: 'Cambridge IELTS 17 — Test 3 Part 3',
    intro: 'You will hear two students, Olivia and Nathan, discussing a research assignment on volcanoes.',
    audio: '/audio/cam16-t1-p3.mp3', diff: 'C1', source: 'Cambridge IELTS 17',
    qs: [
      { q: "Q21. Olivia and Nathan agree that their report should focus on:", opts:["A. Explaining why volcanoes are found in certain locations","B. Describing what happens during a volcanic eruption","C. Examining the impact of volcanoes on people's lives"], a:2 },
      { q: "Q22. Nathan suggests their report should be based mainly on:", opts:["A. Information from scientific journals","B. Ideas from an expert they interviewed","C. Data they collected themselves"], a:0 },
      { q: "Q23. What does Olivia think about the diagram of volcanic rock formation?", opts:["A. It is not accurate enough","B. It is too complicated to be useful","C. It would help readers understand the topic"], a:2 },
      { q: "Q24. Nathan felt that his visit to a volcano was disappointing because:", opts:["A. The weather was too dangerous","B. He could not get close enough to observe it","C. It was not as active as he had expected"], a:2 },
      { q: "Q25. What do they agree is the main advantage of using case studies?", opts:["A. They make complex processes easier to follow","B. They allow comparison of different situations","C. They provide more reliable statistics"], a:0 },
      { q: "Q26. What problem do they identify with their current plan?", opts:["A. It does not cover a wide enough range of examples","B. The structure does not match the assignment brief","C. It contains too much descriptive material"], a:1 },
      { q: "Q27. What does Nathan say about the Tambora eruption?", opts:["A. He found a book with very detailed information","B. He was surprised by how little data exists about it","C. He thinks it is not relevant to their assignment"], a:0 },
      { q: "Q28. What is Olivia's opinion of the section on prediction methods?", opts:["A. She thinks the methods described are out of date","B. She wants more examples to support the points made","C. She would like to remove it from their report"], a:1 },
      { q: "Q29. They agree that the conclusion should:", opts:["A. Introduce one final recommendation","B. Summarise findings from all sections","C. Focus only on the most important point"], a:1 },
      { q: "Q30. What will Nathan do next?", opts:["A. Re-read the assignment guidelines","B. Contact their supervisor for feedback","C. Redraft the opening section"], a:2 },
    ]
  },
  {
    id: 'lc17t3p4', title: 'Cambridge IELTS 17 — Test 3 Part 4',
    intro: 'You will hear a lecture about how birds navigate during migration. Complete the notes. Write ONE WORD ONLY.',
    audio: '/audio/cam16-t1-p4.mp3', diff: 'C1', source: 'Cambridge IELTS 17',
    qs: [
      { q: "Q31. Early theory: birds hid in ___ during winter", type:'fill', a:'MUD' },
      { q: "Q32. Birds were thought to lose their ___ before migration", type:'fill', a:'FEATHERS' },
      { q: "Q33. Birds navigate partly by recognising the ___ of landmarks", type:'fill', a:'SHAPE' },
      { q: "Q34. Birds can use the ___ as a compass at night", type:'fill', a:'MOON' },
      { q: "Q35. The length of a bird's ___ affects its magnetic sensitivity", type:'fill', a:'NECK' },
      { q: "Q36. Ringing birds provided early ___ of migration routes", type:'fill', a:'EVIDENCE' },
      { q: "Q37. Radar tracking revealed precise ___ taken by migrating birds", type:'fill', a:'DESTINATIONS' },
      { q: "Q38. Some birds navigate using the smell of ___", type:'fill', a:'OCEANS' },
      { q: "Q39. Pollution threatens birds' chances of ___ after long migrations", type:'fill', a:'RECOVERY' },
      { q: "Q40. Researchers now use a global ___ to track individual birds", type:'fill', a:'ATLAS' },
    ]
  },
]

// ─── Cambridge IELTS 17 — Test 2 ─────────────────────────────────────────────

export const LISTENING_CAM17_T2 = [
  {
    id: 'lc17t2p1', title: 'Cambridge IELTS 17 — Test 2 Part 1',
    intro: 'You will hear a conversation about a local heritage project. Complete the notes. Write ONE WORD AND/OR A NUMBER for each answer.',
    audio: '', diff: 'B2', source: 'Cambridge IELTS 17',
    qs: [
      { q: "Q1. The project involves ___ old records and documents", type:'fill', a:'COLLECTING' },
      { q: "Q2. The project mainly uses historical ___ and archives", type:'fill', a:'RECORDS' },
      { q: "Q3. Materials are sourced mainly from the ___ side of the town", type:'fill', a:'WEST' },
      { q: "Q4. One category of records covers local ___", type:'fill', a:'TRANSPORT' },
      { q: "Q5. Another category covers ___ in the area", type:'fill', a:'ART' },
      { q: "Q6. Medical category: records from the local ___", type:'fill', a:'HOSPITAL' },
      { q: "Q7. The records will eventually be displayed in the heritage ___", type:'fill', a:'GARDEN' },
      { q: "Q8. The fundraising event planned is a ___", type:'fill', a:'QUIZ' },
      { q: "Q9. To attend the event, people will need to buy ___", type:'fill', a:'TICKETS' },
      { q: "Q10. To promote the event they are designing a ___", type:'fill', a:'POSTER' },
    ]
  },
  {
    id: 'lc17t2p4', title: 'Cambridge IELTS 17 — Test 2 Part 4',
    intro: 'You will hear a lecture about the Icelandic language and the effects of digital technology. Complete the notes. Write ONE WORD AND/OR A NUMBER for each answer.',
    audio: '', diff: 'C1', source: 'Cambridge IELTS 17',
    qs: [
      { q: "Q31. Number of people who speak Icelandic: approximately ___", type:'fill', a:'321,000' },
      { q: "Q32. Icelandic speakers create new words (e.g. a new Icelandic word for ___)", type:'fill', a:'PODCAST' },
      { q: "Q33. Young Icelanders develop ___ skills through exposure to English digital content", type:'fill', a:'BILINGUAL' },
      { q: "Q34. Teachers have noted that children's ___ books are increasingly in English", type:'fill', a:'PICTURE' },
      { q: "Q35. There are concerns about young people's Icelandic ___ skills declining", type:'fill', a:'GRAMMAR' },
      { q: "Q36. The language is closely linked to Icelandic cultural ___", type:'fill', a:'IDENTITY' },
      { q: "Q37. Some young Icelanders are no longer ___ in their native language", type:'fill', a:'FLUENT' },
      { q: "Q38. Icelandic schools are introducing Icelandic ___ programmes to help", type:'fill', a:'VOCABULARY' },
      { q: "Q39. Teachers have observed changes in ___ conversations among children", type:'fill', a:'PLAYGROUND' },
      { q: "Q40. The biggest influence comes from young people's use of ___", type:'fill', a:'SMARTPHONES' },
    ]
  },
]

// ─── Cambridge IELTS 17 — Test 4 ─────────────────────────────────────────────

export const LISTENING_CAM17_T4 = [
  {
    id: 'lc17t4p1', title: 'Cambridge IELTS 17 — Test 4 Part 1',
    intro: 'You will hear a conversation between a tenant and a property manager about problems with a flat. Complete the form. Write ONE WORD AND/OR A NUMBER for each answer.',
    audio: '', diff: 'B2', source: 'Cambridge IELTS 17',
    qs: [
      { q: "Q1. Problem with the ___ in the hallway", type:'fill', a:'FLOOR' },
      { q: "Q2. Kitchen issue: broken ___", type:'fill', a:'FRIDGE' },
      { q: "Q3. Damage reported: stains on ___", type:'fill', a:'SHIRTS' },
      { q: "Q4. External issue: broken ___", type:'fill', a:'WINDOWS' },
      { q: "Q5. Safety concern regarding the ___", type:'fill', a:'BALCONY' },
      { q: "Q6. Specialist required: an ___", type:'fill', a:'ELECTRICIAN' },
      { q: "Q7. Ongoing problem: excessive ___ from nearby building work", type:'fill', a:'DUST' },
      { q: "Q8. The tenant has contacted the ___", type:'fill', a:'POLICE' },
      { q: "Q9. Management promised to provide ___ for maintenance staff", type:'fill', a:'TRAINING' },
      { q: "Q10. Next step agreed: schedule a formal ___", type:'fill', a:'REVIEW' },
    ]
  },
  {
    id: 'lc17t4p4', title: 'Cambridge IELTS 17 — Test 4 Part 4',
    intro: 'You will hear a lecture about maple syrup production. Complete the notes. Write ONE WORD ONLY for each answer.',
    audio: '', diff: 'C1', source: 'Cambridge IELTS 17',
    qs: [
      { q: "Q31. Maple syrup is a thick, ___, sweet liquid", type:'fill', a:'GOLDEN' },
      { q: "Q32. Maple syrup provides a ___ alternative to refined sugar", type:'fill', a:'HEALTHY' },
      { q: "Q33. Canada's ___ is ideal for maple trees", type:'fill', a:'CLIMATE' },
      { q: "Q34. Indigenous people boiled sap using heated ___ from the sun", type:'fill', a:'ROCK' },
      { q: "Q35. The ___ of the collection tubes varies", type:'fill', a:'DIAMETER' },
      { q: "Q36. Sap flows through a ___ inserted into the tree", type:'fill', a:'TUBE' },
      { q: "Q37. The sap is boiled over a ___", type:'fill', a:'FIRE' },
      { q: "Q38. Boiling produces large amounts of ___ as water evaporates", type:'fill', a:'STEAM' },
      { q: "Q39. Syrup that is stored too long can become ___", type:'fill', a:'CLOUDY' },
      { q: "Q40. The syrup is measured and sold by the ___", type:'fill', a:'LITRE' },
    ]
  },
]


// ─── Cambridge IELTS 17 — Tests 2 & 4 (remaining parts) ─────────────────────

export const LISTENING_CAM17_EXTRA = [
  {
    id: 'lc17t2p2', title: 'Cambridge IELTS 17 — Test 2 Part 2',
    intro: 'You will hear a talk about a childcare service at a primary school. Answer the questions.',
    audio: '', diff: 'B2', source: 'Cambridge IELTS 17',
    qs: [
      { q: "Q11. The childcare service is available for children aged:", opts:["A. 4 to 11","B. 5 to 11","C. 6 to 11"], a:1 },
      { q: "Q12. On which day is the service NOT currently available?", opts:["A. Monday","B. Wednesday","C. Friday"], a:1 },
      { q: "Q13. The service on Monday finishes at:", opts:["A. 5:30pm","B. 6:00pm","C. 6:30pm"], a:1 },
      { q: "Q14. What can children do in the creative room?", opts:["A. Watch films","B. Make things","C. Play computer games"], a:1 },
      { q: "Q15. Which room is ONLY for older children?", opts:["A. The games room","B. The reading room","C. The quiet room"], a:0 },
      { q: "Q16. What food is provided in the afternoon?", opts:["A. A hot meal","B. A light snack","C. Nothing"], a:1 },
      { q: "Q17. What is the weekly cost per child?", opts:["A. £55","B. £65","C. £75"], a:1 },
      { q: "Q18. Parents can get a discount if:", opts:["A. They pay termly","B. They have more than one child","C. Both A and B"], a:2 },
      { q: "Q19. To register, parents must:", opts:["A. Come in person","B. Call the school office","C. Fill in an online form"], a:2 },
      { q: "Q20. The waiting list currently has how many children?", opts:["A. About 10","B. About 20","C. About 30"], a:0 },
    ]
  },
  {
    id: 'lc17t2p3', title: 'Cambridge IELTS 17 — Test 2 Part 3',
    intro: 'You will hear two students, Gemma and Ed, discussing a production of Romeo and Juliet.',
    audio: '', diff: 'C1', source: 'Cambridge IELTS 17',
    qs: [
      { q: "Q21. Ed thinks the director's main aim was to:", opts:["A. Show the relevance of the play to modern audiences","B. Demonstrate the importance of family loyalty","C. Present a new interpretation of the main characters"], a:0 },
      { q: "Q22. What does Gemma say about the costumes?", opts:["A. They were historically inaccurate","B. They helped convey character differences","C. They were too similar to distinguish characters"], a:1 },
      { q: "Q23. What did they both find unconvincing?", opts:["A. The fight scenes","B. The love scenes","C. The final scene"], a:2 },
      { q: "Q24. Gemma was most impressed by:", opts:["A. The set design","B. The lead actress","C. The lighting"], a:1 },
      { q: "Q25. Ed thinks the play would be improved by:", opts:["A. Cutting some scenes","B. Changing the ending","C. Using a smaller cast"], a:0 },
      { q: "Q26. They agree the production was:", opts:["A. Disappointing overall","B. Interesting but flawed","C. One of the best they'd seen"], a:1 },
      { q: "Q27. The use of music in the production:", opts:["A. Was too loud at times","B. Enhanced the emotional impact","C. Was inappropriate for the period"], a:1 },
      { q: "Q28. What surprised Gemma about the audience?", opts:["A. How young they were","B. How large the crowd was","C. How quiet they stayed"], a:0 },
      { q: "Q29. Ed's overall rating of the production:", opts:["A. 3 out of 5","B. 4 out of 5","C. 5 out of 5"], a:1 },
      { q: "Q30. They plan to next see:", opts:["A. A musical","B. Another Shakespeare play","C. A modern play"], a:2 },
    ]
  },
  {
    id: 'lc17t4p2', title: 'Cambridge IELTS 17 — Test 4 Part 2',
    intro: 'You will hear a talk about staff retention in the hotel industry. Answer the questions.',
    audio: '', diff: 'B2', source: 'Cambridge IELTS 17',
    qs: [
      { q: "Q11. The main reason staff leave hotels is:", opts:["A. Low pay","B. Lack of career progression","C. Poor management"], a:1 },
      { q: "Q12. What percentage of hotel staff leave within the first year?", opts:["A. Around 30%","B. Around 40%","C. Around 50%"], a:2 },
      { q: "Q13. The speaker says the most effective retention strategy is:", opts:["A. Higher salaries","B. Better training programmes","C. Flexible working hours"], a:1 },
      { q: "Q14. What does the speaker say about mentoring schemes?", opts:["A. They are too expensive","B. They significantly reduce staff turnover","C. They work best for senior staff"], a:1 },
      { q: "Q15. Staff are most likely to stay if they feel:", opts:["A. Well paid","B. Valued and respected","C. Part of a large team"], a:1 },
      { q: "Q16. Which benefit do staff rate as MOST important?", opts:["A. Free meals","B. Accommodation","C. Health insurance"], a:2 },
      { q: "Q17. The speaker recommends exit interviews because:", opts:["A. They identify training needs","B. They provide honest feedback","C. They help with legal requirements"], a:1 },
      { q: "Q18. Which type of hotel has the highest retention rate?", opts:["A. Budget hotels","B. Boutique hotels","C. Large chain hotels"], a:1 },
      { q: "Q19. The speaker suggests managers should:", opts:["A. Meet with staff monthly","B. Give public recognition","C. Both A and B"], a:2 },
      { q: "Q20. The main conclusion is that retention requires:", opts:["A. More investment in pay","B. A long-term commitment","C. Reducing working hours"], a:1 },
    ]
  },
  {
    id: 'lc17t4p3', title: 'Cambridge IELTS 17 — Test 4 Part 3',
    intro: 'You will hear two sports science students, Thomas and Jeanne, discussing their research project.',
    audio: '', diff: 'C1', source: 'Cambridge IELTS 17',
    qs: [
      { q: "Q21. Thomas and Jeanne agree their report should focus on:", opts:["A. Elite athletes only","B. Amateur athletes","C. Both groups equally"], a:2 },
      { q: "Q22. What does Jeanne say about their data collection method?", opts:["A. It needs to be more scientific","B. The sample size is too small","C. The questionnaire was too long"], a:1 },
      { q: "Q23. Thomas found the literature on sleep and performance:", opts:["A. Limited","B. Contradictory","C. Very useful"], a:1 },
      { q: "Q24. They agree that nutrition data was:", opts:["A. Hard to collect accurately","B. Less important than expected","C. The most interesting finding"], a:0 },
      { q: "Q25. What surprised them both about the results?", opts:["A. The role of mental preparation","B. The importance of rest days","C. The impact of team dynamics"], a:0 },
      { q: "Q26. Jeanne thinks the weakest part of their methodology was:", opts:["A. The control group","B. The timing of measurements","C. The choice of sport"], a:1 },
      { q: "Q27. For the conclusion Thomas suggests:", opts:["A. Recommending further research","B. Making specific recommendations for coaches","C. Focusing only on the data"], a:1 },
      { q: "Q28. What do they disagree about?", opts:["A. The structure of the report","B. Whether to include case studies","C. The significance of one finding"], a:1 },
      { q: "Q29. They plan to submit the report:", opts:["A. This week","B. Next week","C. After the holiday"], a:1 },
      { q: "Q30. Their supervisor suggested they add:", opts:["A. More graphs","B. A glossary","C. An abstract"], a:2 },
    ]
  },
]
