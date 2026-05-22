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
