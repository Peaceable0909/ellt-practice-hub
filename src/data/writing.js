export const WRITING = [
  {
    id: 'w1',
    title: 'Team Work',
    prompt: 'Group projects are often part of studying at university.',
    task: 'In your experience, what are the pros and cons of working in groups when studying?',
    minWords: 200,
    band: 8,
    model: `In my opinion, working in groups is an essential part of studying at university. Many teachers encourage this type of learning because they believe it improves students' cooperation and motivation. From my own experience, it brings a lot of benefits, though it can also cause certain difficulties.

One advantage of group work is that it gives students the chance to exchange ideas and develop their critical thinking. When people study together, they usually become more creative, as they are pushed to explain their thoughts to others. It also helps them to manage time more efficiently and to stay motivated when they would have given up if studying alone.

However, working in groups can also bring problems. Sometimes decisions take longer than they should, because everyone wants their opinion to be accepted. There can also appear conflicts about how to divide the work or who is responsible for which part. In addition, when one member doesn't respect deadlines, it might affect the whole group.

To conclude, I think group work is generally positive, but it requires good organisation and respect between members. If these aspects are improved, studying in groups could become even more effective.`,
  },
  {
    id: 'w2',
    title: 'Digital Detox',
    prompt: 'People sometimes decide not to use digital tools, like phones or apps, for a few days.',
    task: 'In your experience, what are the advantages and disadvantages of taking a short break from digital technology?',
    minWords: 200,
    band: 8,
    model: `Nowadays, many people choose to stay away from digital tools for a few days. They feel that phones and social media take too much of their time and attention. I tried doing a short digital detox last year, and I realised that this experience can bring both advantages and disadvantages.

To start with, switching off from technology allows you to feel calmer and more concentrated. Without all the notifications and messages, your brain can rest and you can focus on what is happening around you. During my break, I spent more time outdoors and I felt I could actually enjoy small things again. Another positive aspect is that it strengthens relationships, because you speak face to face instead of just texting.

Even so, there are also a few downsides. In modern life, we rely on technology for many practical things, so when you stop using it, daily routines might get complicated. On top of that, when I went online again, I was overwhelmed with all the messages I had to reply to, which somehow cancelled the peace I had before.

All in all, taking a short break from digital tools can be very refreshing, but it needs to be done wisely. If people don't prepare for it, the return to the online world might feel even more stressful than before.`,
  },
  {
    id: 'w3',
    title: 'Post vs Email',
    prompt: 'The Danish post service has announced it will stop letter services at the end of the year. Instead, it will concentrate on its parcel business.',
    task: 'In your experience, what are the advantages and disadvantages of sending and receiving mail through the post instead of electronic mail?',
    minWords: 250,
    band: 10,
    model: `In recent years, traditional letter services have almost disappeared in many countries, replaced by electronic communication. Although digital messages are faster and cheaper, I still believe that sending and receiving physical mail has some unique values which are difficult to substitute entirely.

One of the main advantages of postal mail is its personal and emotional character. A handwritten letter often feels more genuine and thoughtful than an email typed in a hurry. The effort of writing, sealing and posting something gives the message a sense of importance that online communication rarely achieves. In addition, physical letters are tangible objects that can be kept as memories; for instance, many people still treasure postcards or old notes from friends and relatives.

Nevertheless, there are obvious disadvantages. Postal mail is slow and sometimes unreliable, especially for international correspondence. It also requires more resources — paper, transport, and time — which makes it less sustainable in the long term. In professional contexts, letters can hardly compete with the speed and efficiency of digital tools, which allow instant exchange of information.

To conclude, while electronic communication clearly dominates modern life, traditional mail still has emotional and cultural significance. It might never return to its previous importance, but it continues to remind us that communication is not only about speed, but also about meaning.`,
  },
  {
    id: 'w4',
    title: 'Working From Home',
    prompt: 'Many companies now allow employees to work remotely from home.',
    task: 'In your experience, what are the advantages and disadvantages of working from home? Discuss both sides and give your own opinion.',
    minWords: 220,
    band: 8,
    model: `In recent years, working from home has become a common arrangement, particularly after the global pandemic forced many organisations to rethink traditional office life. This shift has produced both clear benefits and noticeable problems.

The biggest advantage is flexibility. Without the daily commute, employees recover hours that can be spent with family, exercising, or simply sleeping more. This often translates into better mental health and higher productivity for tasks that require deep concentration. Working from home can also reduce expenses, since people spend less on transport, lunch and work clothes.

On the other hand, isolation is a serious downside. When colleagues are reduced to faces in a video call, casual conversations and creative brainstorming sessions are lost, and new employees in particular struggle to feel part of a team. There can also be problems with separating work and personal life: when the laptop sits in the living room, it is tempting to keep checking emails late at night, which leads to burnout.

In conclusion, working from home suits some people and some jobs very well, but it is not a perfect solution. A hybrid model, with a few days at the office, often produces the best of both worlds.`,
  },
  {
    id: 'w5',
    title: 'Daily Journal',
    prompt: 'Journaling or writing in a diary for just a few minutes every day can help turn it into a stress-relieving, sustainable habit.',
    task: 'What are the advantages and disadvantages of keeping a daily journal or diary? Discuss both sides and give your own opinion.',
    minWords: 200,
    band: 7,
    model: `Nowadays many people start writing a diary because they think it can help to reduce stress and understand their feelings better. I tried this activity a few times, and in my opinion it has some good effects but also a few disadvantages.

On the positive side, keeping a journal can make your mind more calm. When you write what happens during the day, you can think more clearly and see things from different sides. It also helps to remember nice moments and see how you changed over time. Another advantage is that writing a diary in English or another language can practise your writing skills.

However, there are also some bad sides. Writing every day can be boring or feel like a duty if you don't have time. Some people start with energy but stop after a week because they lose motivation. In addition, it is not always safe to write private things, since somebody could read them by accident.

In conclusion, I think keeping a daily journal can really help people who feel stressed or who like writing. But it depends on the person, because not everyone has the patience to do it every day. For me, I prefer to write only sometimes, when I really need to put my thoughts in order.`,
  },
]

// ─── NEW: IELTS Writing Tasks ────────────────────────────────────────────────
export const WRITING_TASK1 = [
  {
    id: 'wt1', title: 'Grandville Stadium Attendance', source: 'IELTS Academic — Task 1',
    prompt: 'The chart below gives attendance figures for Grandville Stadium from 2017, which are projected through 2030 after a major improvement project.',
    task: 'Summarize the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
    minWords: 150, band: 8,
    chartDescription: 'Bar chart showing projected annual attendance after 2019 stadium improvements. Three event types: Theater, Sporting Events, Concerts. Years: 2017 (blue), 2020 (orange), 2030 (yellow). Theater: ~12k → ~16k → ~50k. Sporting Events: ~150k → ~157k → ~163k. Concerts: ~30k → ~44k → ~120k.',
    model: `The bar chart illustrates the actual and projected annual attendance at Grandville Stadium for three event types — theatre, sporting events, and concerts — across three years: 2017, 2020, and 2030, following a major improvement project completed in 2019.

Overall, all three event categories are expected to see growth by 2030, with concerts showing the most dramatic increase, while sporting events remain the most attended category throughout the entire period.

In 2017, sporting events dominated attendance with approximately 150,000 visitors, far surpassing concerts at around 30,000 and theatre at only 12,000. By 2020, these figures had risen modestly, with sporting events reaching approximately 157,000, concerts climbing to around 44,000, and theatre increasing slightly to 16,000.

The most striking projected changes are seen by 2030. Concert attendance is forecast to surge to roughly 120,000 — a fourfold increase from 2017 — suggesting that the improvements have significantly enhanced the stadium's appeal for musical events. Theatre, although still the smallest category, is projected to reach approximately 50,000, representing the largest proportional growth of around 300%. Sporting events, while still the leading category at around 163,000, show comparatively modest growth over the thirteen-year period.

In summary, the stadium improvements appear to have had the greatest projected impact on concert and theatre attendance, while sporting events maintain a consistent lead.`,
  }
]

export const WRITING_IELTS = [
  {
    id: 'wi1', title: 'Tablets Replacing Books in Schools', source: 'IELTS Academic — Task 2',
    prompt: 'An increasing number of schools provide tablets and laptop computers for students to use in school, replacing books and other printed materials like exams and assignments.',
    task: 'What are the advantages and disadvantages of this trend? Write at least 250 words.',
    minWords: 250, band: 8,
    model: `In recent years, digital devices such as tablets and laptops have become increasingly common in educational settings, gradually replacing traditional textbooks, printed assignments and paper-based examinations. While this shift brings a number of significant benefits, it also introduces challenges that cannot be ignored.

One of the main advantages of using digital devices in schools is the ability to provide students with immediate access to a vast amount of information. Instead of relying on a single textbook, students can explore multiple sources, watch educational videos, and access updated content at any time. This not only enriches the learning experience but also helps develop independent research skills that are essential in the modern world. Furthermore, devices can be tailored to meet the needs of individual learners; teachers can assign different tasks to students based on their abilities, making lessons more inclusive and personalized. From an environmental standpoint, reducing the use of paper also contributes positively to sustainability.

However, there are notable drawbacks to consider. Excessive screen time has been linked to health concerns such as eye strain, poor posture, and sleep disruption, particularly among younger students. Additionally, the use of devices in the classroom can create significant distractions, as students may be tempted to access social media or entertainment platforms instead of focusing on their studies. Schools in less affluent areas may also struggle to provide sufficient devices for all students, potentially widening the educational gap between privileged and underprivileged groups.

In conclusion, while the integration of tablets and laptops into schools offers exciting possibilities for learning, it must be managed carefully. Clear guidelines, appropriate supervision, and equitable access are essential if schools are to harness the benefits while minimising the risks associated with this digital transition.`
  }
]

// ─── NEW: Additional IELTS Writing Tasks ──────────────────────────────────────

export const WRITING_IELTS_2 = [
  {
    id: 'wi2',
    title: 'Further Education in Britain',
    source: 'IELTS Academic — Task 1',
    prompt: 'The chart below shows the number of men and women in further education in Britain in three periods and whether they were studying full-time or part-time.',
    task: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
    minWords: 150,
    band: 7,
    chartDescription: 'Bar chart showing men and women in further education in Britain across three time periods. Data split by full-time and part-time study. Key trends: women increasingly outnumber men in part-time study; full-time numbers rise for both genders over the periods; women show the most dramatic growth in participation.',
    model: `The bar chart illustrates the participation of men and women in further education in Britain across three time periods, comparing those studying full-time and part-time.

Overall, the number of both men and women in further education increased over the three periods, with part-time study showing particularly notable growth, especially among women.

In the earliest period, men outnumbered women in both categories. However, this trend shifted significantly over time. In terms of full-time study, both genders saw steady increases, with men consistently representing a slightly higher proportion. By the final period, the gap between male and female full-time students had narrowed considerably.

The most striking change can be observed in part-time education. Women's participation in part-time study grew dramatically across the three periods, eventually surpassing that of men. This suggests a significant shift in the profile of the female student population, with more women balancing education alongside other commitments such as work or family responsibilities.

In conclusion, while male participation remained relatively stable, the most significant development was the substantial rise in female participation, particularly in part-time further education.`
  },
  {
    id: 'wi3',
    title: 'Car Ownership and Alternative Transport',
    source: 'IELTS Academic — Task 2',
    prompt: 'The first car appeared on British roads in 1888. By the year 2000 there may be as many as 29 million vehicles on British roads. Alternative forms of transport should be encouraged and international laws introduced to control car ownership and use.',
    task: 'To what extent do you agree or disagree? Give reasons for your answer and include any relevant examples from your knowledge or experience. Write at least 250 words.',
    minWords: 250,
    band: 7,
    model: `The rapid rise in car ownership over the past century has undeniably transformed society, bringing both convenience and serious consequences. While I largely agree that alternative transport should be encouraged and that some regulation of car use is necessary, I believe that introducing international laws to control car ownership may be an overly restrictive approach.

The environmental case for reducing car dependency is compelling. Vehicles remain one of the leading contributors to carbon dioxide emissions and air pollution in urban areas. Cities such as Oslo and Amsterdam have demonstrated that investing in public transport, cycling infrastructure, and pedestrianised zones can significantly reduce traffic congestion while improving public health. Encouraging such alternatives through subsidies, improved public transport networks, and urban planning is a practical and broadly supported policy direction.

However, the proposal to introduce international laws controlling car ownership raises significant concerns. Car ownership is closely tied to personal freedom, particularly in rural areas where public transport is inadequate or non-existent. Restricting the right to own a vehicle could disproportionately affect lower-income individuals and those living outside major cities. Furthermore, enforcing such laws across different nations with varying infrastructure, economies, and cultural attitudes towards the car would be extraordinarily complex.

A more balanced approach would involve incentivising greener alternatives rather than restricting ownership outright. Governments could introduce congestion charges, invest heavily in electric vehicle infrastructure, and make public transport more affordable and reliable. These measures would reduce the impact of cars without infringing on individual freedoms.

In conclusion, while I support encouraging alternative forms of transport, I believe international laws restricting car ownership would be impractical and potentially unjust. Policy should focus on changing behaviour through incentives rather than prohibition.`
  }
]

// ─── Official IELTS 2023 — Additional Tasks ───────────────────────────────────

export const WRITING_OFFICIAL_2023 = [
  {
    id: 'wo1',
    title: 'Radio and TV Audiences 1992',
    source: 'IELTS Official Sample — Task 1',
    prompt: 'The graph below shows radio and television audiences throughout the day in 1992.',
    task: 'Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.',
    minWords: 150, band: 7,
    chartDescription: 'Line graph showing the percentage of the UK population watching TV or listening to radio at different times of day in 1992. Radio peaks in the morning (around 7-8am). TV audience grows through the day, peaking in the evening (around 8-9pm). The two lines cross mid-morning and again in the early afternoon. Radio audience is higher than TV from early morning until around midday. TV overtakes radio from lunchtime onwards.',
    model: `The line graph illustrates the proportion of the UK population who listened to the radio or watched television at various points throughout the day in 1992.

Overall, the two media had contrasting patterns of popularity. Radio dominated in the morning, while television attracted progressively larger audiences as the day progressed, reaching its peak in the evening.

Radio audiences were notably high in the early morning, peaking at around 7 to 8 am when approximately 25 to 30 percent of the population tuned in, presumably during the breakfast and commuting period. However, radio listenership declined steadily throughout the rest of the day, falling to very low levels by the evening.

Television, by contrast, attracted relatively few viewers in the morning but grew steadily from midday onwards. The two audiences were roughly equal in the late morning before television overtook radio during the afternoon. TV viewing reached its highest point in the late evening, at around 8 to 9 pm, when it attracted the largest proportion of the population of any medium at any time of day.

In conclusion, radio was the dominant medium in the mornings while television clearly dominated afternoons and evenings in 1992.`
  },
  {
    id: 'wo2',
    title: 'Children, Wealth and Adult Life',
    source: 'IELTS Official Sample — Task 2',
    prompt: 'Children who are brought up in families that do not have large amounts of money are better prepared to deal with the problems of adult life than children brought up by wealthy parents.',
    task: 'To what extent do you agree or disagree with this opinion? Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    minWords: 250, band: 7,
    model: `The idea that children raised in less affluent households are better equipped for the challenges of adult life is a view held by many, and while there is some truth to it, I believe the relationship between wealth and life preparation is more nuanced than this statement suggests.

On the one hand, children from lower-income families may indeed develop important qualities that help them navigate adult life. Growing up with limited resources can foster resilience, resourcefulness, and a strong work ethic. These children often learn from an early age to manage money carefully, to persevere through difficulty, and to appreciate what they have. Such qualities can be invaluable in adulthood, particularly when facing financial hardship or professional setbacks. Furthermore, having experienced real-world challenges as children, they may be less likely to feel overwhelmed by the demands of independent adult life.

On the other hand, it would be simplistic and unfair to conclude that wealth automatically produces poorly prepared adults. Much depends on the values instilled by parents and the environment in which children are raised. Wealthy families who teach their children responsibility, the value of hard work, and empathy for others can produce adults who are equally well-prepared for life's challenges. Moreover, access to better education, healthcare, and opportunities can provide advantages that help children thrive in adulthood regardless of whether they face financial hardship.

In conclusion, while growing up without financial privilege can build certain character strengths, I do not fully agree that it is a prerequisite for being well-prepared for adult life. Parenting style, values, and the cultivation of resilience matter far more than the size of a family's bank account.`
  },
  {
    id: 'wo3',
    title: 'International Tourism: Advantages vs Disadvantages',
    source: 'IELTS Official Sample — Task 2',
    prompt: 'International tourism has brought enormous benefit to many places. At the same time, there is concern about its impact on local inhabitants and the environment.',
    task: 'Do the disadvantages of international tourism outweigh the advantages? Give reasons for your answer and include any relevant examples. Write at least 250 words.',
    minWords: 250, band: 7,
    model: `International tourism has become one of the world's largest industries, generating significant economic benefits while simultaneously raising serious concerns about its environmental and social impact. In my view, the advantages of international tourism still outweigh the disadvantages, provided that it is managed responsibly.

The economic benefits of tourism are substantial and wide-ranging. It creates employment across numerous sectors including hospitality, transport, retail, and entertainment. In many developing nations, tourism revenue is a vital source of foreign exchange and government income. Countries such as Thailand, Greece, and Kenya rely heavily on tourism to sustain their economies and fund public services. Additionally, tourism can help preserve cultural heritage by providing funding for the restoration of historic sites and encouraging communities to maintain their traditions.

However, the negative consequences of mass tourism are increasingly difficult to ignore. Overcrowding at popular destinations — such as Venice, Barcelona, and Machu Picchu — has strained local infrastructure, driven up housing costs, and created tension between residents and visitors. The environmental impact is also a serious concern, as increased air travel contributes significantly to carbon emissions, while coastal and natural destinations often suffer from pollution, littering, and damage to ecosystems.

Despite these drawbacks, I believe the solution lies in sustainable tourism practices rather than in restricting tourism altogether. Governments and businesses can limit visitor numbers, promote less popular destinations, and invest in eco-friendly infrastructure to mitigate the negative effects while preserving the economic and cultural benefits.

In conclusion, while the disadvantages of international tourism are real and growing, they do not yet outweigh the advantages, provided that the industry embraces a more responsible approach.`
  }
]

export const WRITING_IELTS_3 = [
  {
    id: 'wi4',
    title: 'Consumer Expenditure — UK vs France (2010)',
    source: 'IELTS Academic',
    type: 'task1',
    prompt: 'The chart below illustrates the amount of money spent on five consumer goods in France and the UK in 2010. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    task: 'Write at least 150 words. You should spend about 20 minutes on this task.',
    chartDescription: 'Bar chart comparing UK and France spending (in £) on cars, computers, books, perfume and cameras in 2010.',
    minWords: 150,
    band: 9,
    model: `The chart illustrates the amount of money spent on five consumer goods (cars, computers, books, perfume and cameras) in France and the UK in 2010. Units are measured in pounds sterling.

Overall, the UK spent more money on consumer goods than France in the period given. Both the British and the French spent most of their money on cars, whereas the least amount was spent on perfume in the UK compared to cameras in France.

In terms of cars, people in the UK spent about £450,000 compared to the French at £400,000. Similarly, British expenditure was higher on books than the French (around £400,000 and £300,000 respectively). Expenditure on cameras in the UK (just over £350,000) was over double that of France at only £150,000.

On the other hand, France spent more on the remaining goods. Above £350,000 was spent by the French on computers, slightly more than the British who spent exactly £350,000. Neither country spent much on perfume — £200,000 in France but under £150,000 in the UK.`
  },
  {
    id: 'wi5',
    title: 'Consumption of Spreads (1981–2007)',
    source: 'IELTS Academic',
    type: 'task1',
    prompt: 'The graph below shows the consumption of three kinds of spreads (margarine, butter and low-fat/reduced spreads) between 1981 and 2007. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    task: 'Write at least 150 words. You should spend about 20 minutes on this task.',
    chartDescription: 'Line graph showing grams consumed per person per week of margarine, butter and low-fat spreads from 1981 to 2007.',
    minWords: 150,
    band: 9,
    model: `The line graph illustrates the amount of three kinds of spreads consumed from 1981 to 2007. Units are measured in grams per person per week.

Overall, the consumption of margarine and butter decreased over the period, while low-fat and reduced spreads rose. At the start, butter was the most popular spread, but by the end low-fat spreads had become most widely consumed.

With regards to butter, consumption began at around 140 grams and peaked at 160 grams in 1986, before falling dramatically to about 50 grams in 2007. Likewise, approximately 90 grams of margarine was consumed in 1981, after which the figure fluctuated and dropped to a low of 40 grams by the final year.

In contrast, low-fat and reduced spreads only appeared in 1996 at around 10 grams. This figure rose to a high of just over 80 grams in 2001, before falling slightly to approximately 70 grams in 2007.`
  },
  {
    id: 'wi6',
    title: 'Indian Students in British Universities (2020–2022)',
    source: 'IELTS Academic',
    type: 'task1',
    prompt: 'The table below gives information about the number of full-time students from India in six British universities and the percentage increase between 2020/21 and 2021/22. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    task: 'Write at least 150 words. You should spend about 20 minutes on this task.',
    chartDescription: 'Table showing Indian full-time students in 6 UK universities in 2020/21 and 2021/22 with % change.',
    minWords: 150,
    band: 9,
    model: `The table gives information about full-time students from India studying at six British universities in two academic years (2020/21 and 2021/22), as well as the percentage increase.

Overall, the greatest increase in Indian students was seen at Sheffield University, while BBP University showed the lowest percentage growth. Coventry University had the most Indian students in the second year.

Sheffield University saw a dramatic rise of 187.7%, reaching 2,345 students in 2021/22. Similarly, Coventry University saw a considerable increase of 121.3%, climbing by 2,900 students to hit 5,290. Leicester University also more than doubled, rising from 1,175 to 2,390 students — a rise of 103.4%.

All other universities saw increases of under 100%. Greenwich and Anglia Ruskin rose by 84.9% and 69.6% respectively. Regarding BBP University, numbers remained high in both years at 3,505 and 5,145, representing a more modest growth of 46.8%.`
  },
]

export const WRITING_IELTS_4 = [
  {
    id: 'wi7',
    title: "Teenagers' Activities in Chester (2002–2007)",
    source: 'IELTS Academic', type: 'task1',
    prompt: "The bar chart shows the number of hours per week teenagers in Chester spent on various activities in 2002 and 2007. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.",
    task: 'Write at least 150 words. You should spend about 20 minutes on this task.',
    chartDescription: 'Grouped bar chart showing weekly hours spent on 7 activities in 2002 vs 2007.',
    minWords: 150, band: 9,
    model: `The bar chart compares the number of hours per week that teenagers in Chester spent on seven activities in 2002 and 2007.

Overall, watching television was by far the most popular activity in both years. While time spent on TV, shopping and going to pubs or discos increased, the hours devoted to homework, sport, reading and cinema all fell over the period.

In 2002, teenagers spent approximately 25 hours per week watching television. This rose significantly to around 40 hours by 2007, the largest increase of any activity. Time spent visiting pubs and discos and going shopping both doubled over the five-year period, rising from roughly 10 to 20 hours and 8 to 16 hours respectively.

In contrast, the hours devoted to homework fell from around 20 to 14, while sport dropped from 18 to 12 hours per week. Reading and cinema both saw modest declines, falling from approximately 8 to 6 hours and 5 to 4 hours respectively.`
  },
  {
    id: 'wi8',
    title: 'Global Digital Game Sales (2000–2006)',
    source: 'IELTS Academic', type: 'task1',
    prompt: 'The bar chart below shows global sales of handheld, console, online, and mobile games from 2000 to 2006. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    task: 'Write at least 150 words. You should spend about 20 minutes on this task.',
    chartDescription: 'Bar chart showing digital game sales (billions USD) by type from 2000 to 2006.',
    minWords: 150, band: 9,
    model: `The bar chart illustrates global sales of four types of digital games — handheld, console, online and mobile — between 2000 and 2006, measured in billions of US dollars.

Overall, handheld games consistently dominated sales throughout the period, while online and mobile games showed the most significant growth toward the end of the period.

Handheld game sales were highest in every year, beginning at approximately $11 billion in 2000 and peaking at around $16 billion in 2005 before falling slightly. Console games were the second most popular category, fluctuating between $8 and $10 billion over the period.

Online and mobile games began with negligible sales but grew considerably. Online sales rose from virtually zero in 2000 to approximately $5 billion by 2006, while mobile game sales followed a similar upward trajectory to reach around $4 billion. Both categories showed the most rapid growth in the final two years of the period.`
  },
  {
    id: 'wi9',
    title: 'Meat Consumption in a European Country (1979–2004)',
    source: 'IELTS Academic', type: 'task1',
    prompt: 'The graph shows the weekly consumption in grams of four different types of meat in a European country from 1979 to 2004. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    task: 'Write at least 150 words. You should spend about 20 minutes on this task.',
    chartDescription: 'Line graph showing weekly grams consumed of beef, chicken, lamb and fish 1979–2004.',
    minWords: 150, band: 9,
    model: `The line graph illustrates the weekly consumption in grams of four types of meat — beef, chicken, lamb and fish — in a European country over a 25-year period from 1979 to 2004.

Overall, the most striking trend is the dramatic rise in chicken consumption and the notable decline in beef and lamb. Fish consumption remained relatively stable throughout the period.

In 1979, beef was the most widely consumed meat at approximately 250 grams per week. However, this figure declined steadily to around 100 grams by 2004. Lamb followed a similar downward trend, falling from about 150 grams to just 50 grams over the same period.

In contrast, chicken saw a dramatic increase. Beginning at approximately 150 grams per week in 1979, it rose sharply to surpass beef in the early 1990s and reached around 250 grams by 2004, making it the most popular meat by the end of the period. Fish consumption hovered consistently between 50 and 60 grams throughout.`
  },
  {
    id: 'wi10',
    title: 'Underground Railway Systems — 6 Cities',
    source: 'IELTS Academic', type: 'task1',
    prompt: 'The table below gives information about the underground railway systems in six cities. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    task: 'Write at least 150 words. You should spend about 20 minutes on this task.',
    chartDescription: 'Table: city, year opened, km of route, stations, passengers per year.',
    minWords: 150, band: 9,
    model: `The table gives information about the underground railway systems in six cities worldwide, including when they opened, the total route length, number of stations and annual passenger figures.

Overall, London has the oldest and most extensive underground system, while Tokyo carries by far the largest number of passengers each year. The newer systems in Washington DC and Kyoto are comparatively smaller in scale.

London's underground opened in 1863 — the earliest of the six — and now has 394 kilometres of track and 275 stations. Despite its size, it carries 775 million passengers annually, which is fewer than Tokyo. The Tokyo system, opened in 1927, has 155 kilometres of route but an impressive 1,927 million passengers per year.

Paris, which opened in 1900, has 199 kilometres and 297 stations, with 1,191 million annual passengers. Washington DC and Kyoto are smaller and more recently established systems. Los Angeles, opened in 2001, is the newest and smallest, with only 28 kilometres of track.`
  },
  {
    id: 'wi11',
    title: 'Electricity Generation — Germany vs France (2009)',
    source: 'IELTS Academic', type: 'task1',
    prompt: 'The pie charts below show the sources of electricity generation in Germany and France in 2009. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    task: 'Write at least 150 words. You should spend about 20 minutes on this task.',
    chartDescription: 'Two pie charts comparing electricity sources in Germany and France in 2009.',
    minWords: 150, band: 9,
    model: `The pie charts compare the proportions of electricity generated from different energy sources in Germany and France in 2009.

Overall, the most striking difference between the two countries is their reliance on nuclear power. France generated the vast majority of its electricity from nuclear sources, whereas Germany used a much more diverse mix of energy types.

In France, nuclear power accounted for 75% of electricity production — by far the largest share. Hydroelectric power made up 13%, with gas contributing 6% and other sources making up the remaining 6%.

Germany's electricity generation was more evenly distributed. Coal was the largest source at 29%, followed by gas at 24% and nuclear at 22%. Renewable and other sources accounted for the remaining 25%. This contrasts sharply with France, where a single energy source dominated completely. The data suggests that France had a much lower carbon footprint for electricity generation due to its heavy reliance on nuclear power.`
  },
  {
    id: 'wi12',
    title: 'Goods Transported in the UK (1974–2002)',
    source: 'IELTS Academic', type: 'task1',
    prompt: 'The graph below shows the amounts of goods transported in the UK between 1974 and 2002 by four different modes of transport. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    task: 'Write at least 150 words. You should spend about 20 minutes on this task.',
    chartDescription: 'Line graph showing billion tonne-km transported by road, water, rail, and pipeline 1974–2002.',
    minWords: 150, band: 9,
    model: `The line graph shows the quantity of goods transported in the UK from 1974 to 2002 by road, water, rail and pipeline, measured in billion tonne-kilometres.

Overall, road transport was by far the most dominant mode throughout the period and saw the greatest growth. All other forms of transport showed more modest and stable patterns over the same period.

In 1974, road transport accounted for approximately 70 billion tonne-kilometres. This figure rose steadily, reaching around 100 billion by 2002 — an increase of roughly 30 billion over the period. Water transport was the second most common mode, remaining relatively stable between 50 and 60 billion tonne-kilometres throughout.

Rail transport began at approximately 40 billion tonne-kilometres in 1974 and fluctuated with a slight overall decline before recovering slightly toward the end of the period. Pipeline transport remained the least used method, hovering consistently around 5 billion tonne-kilometres with minimal change over the entire period.`
  },
  {
    id: 'wi13',
    title: 'Turtle Populations in India (1980–2012)',
    source: 'IELTS Academic', type: 'task1',
    prompt: 'The graph shows the population of three types of turtles (Olive Ridley, Leatherback, and Green) in India between 1980 and 2012. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    task: 'Write at least 150 words. You should spend about 20 minutes on this task.',
    chartDescription: 'Line graph showing turtle population trends in India from 1980 to 2012.',
    minWords: 150, band: 9,
    model: `The line graph illustrates changes in the populations of three turtle species — Olive Ridley, Leatherback and Green — in India between 1980 and 2012.

Overall, all three species experienced population decline over the period, with Olive Ridley turtles showing the most dramatic fall. Green turtles remained the most stable of the three.

In 1980, Olive Ridley turtles had the largest population at approximately 180,000. However, numbers fell sharply throughout the period, dropping to just under 60,000 by 2012. Leatherback turtles also declined considerably, from around 120,000 in 1980 to approximately 70,000 by the end of the period, though the decline was more gradual than for Olive Ridley turtles.

Green turtle numbers were the most stable of the three species, beginning at around 90,000 in 1980 and declining only slightly to approximately 80,000 by 2012. The data highlights serious conservation concerns, particularly for the Olive Ridley species.`
  },
  {
    id: 'wi14',
    title: 'Household Expenditure (1950 vs 2010)',
    source: 'IELTS Academic', type: 'task1',
    prompt: 'The pie charts show the average household expenditure in 1950 and 2010. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    task: 'Write at least 150 words. You should spend about 20 minutes on this task.',
    chartDescription: 'Two pie charts comparing household spending categories in 1950 vs 2010.',
    minWords: 150, band: 9,
    model: `The pie charts compare average household expenditure across five categories in 1950 and 2010.

Overall, food spending decreased dramatically over the sixty-year period, while the proportions spent on housing and transport both rose considerably. The share devoted to clothing fell, while other expenditure increased.

In 1950, food accounted for the largest proportion of household spending at 44%. By 2010, this had fallen significantly to just 23%, representing the most notable change across all categories. Clothing also saw a decline, from 12% to 9% over the period.

In contrast, housing costs rose from 25% to 31%, reflecting increased property prices and rents. Transport spending nearly doubled from 10% to 18%, likely due to greater car ownership. Other expenditure also grew from 9% to 19%, suggesting households were spending more on leisure, technology, and services by 2010. Overall, the data reflects a shift away from basic necessities toward housing, transport and discretionary spending.`
  },
]
