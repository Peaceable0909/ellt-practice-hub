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
