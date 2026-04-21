import type { DailyContent } from "@/types/article";

export const apr23ProBuddy: DailyContent = {
  date: "April 23, 2026",
  dayOfWeek: "Wednesday",
  level: "Pro Buddy",
  levelEmoji: "🔴",
  ageRange: "11–13",
  articles: [
    {
      id: "2026-04-23-amazing-world-pro",
      category: "amazing_world",
      headline: "Greenland's Ice Sheet Melted Completely 7,000 Years Ago — and Could Again",
      body: [
        "What's up, everyone? Today's story might change how you think about climate change.",
        "Scientists drilling deep beneath Greenland's Prudhoe Dome — one of the highest points of the ice sheet — have uncovered evidence that this massive ice formation completely melted approximately 7,000 years ago during a period known as the Holocene Thermal Maximum.",
        "This finding is significant for several reasons. The Prudhoe Dome was considered one of the most stable parts of Greenland's ice sheet. If even this section melted during a period when global temperatures were only slightly above today's levels, it suggests the entire ice sheet is more vulnerable to warming than previously thought.",
        "The implications are serious. Greenland's ice sheet contains enough frozen water to raise global sea levels by about 7 meters if it fully melted. Coastal cities, island nations, and low-lying agricultural regions would face catastrophic flooding.",
        "The critical difference between then and now is speed. The Holocene melting occurred gradually over thousands of years, giving ecosystems time to adapt. Current warming is happening roughly 10 times faster, driven by greenhouse gas emissions from human activity."
      ],
      vocab: [
        { word: "thermal", meaning: "열의 — relating to heat or temperature" },
        { word: "vulnerable", meaning: "취약한 — easily damaged or at risk" },
        { word: "catastrophic", meaning: "재앙적인 — causing great damage or suffering" },
        { word: "ecosystem", meaning: "생태계 — all living things in an area and how they interact" },
        { word: "greenhouse gas", meaning: "온실가스 — gases that trap heat in Earth's atmosphere" }
      ],
      quiz: [
        { question: "Why is the Prudhoe Dome melting significant?", options: ["It's the smallest ice area", "It was considered the most stable part", "It's the newest ice"], answerIndex: 1 },
        { question: "How much would sea levels rise if Greenland's ice fully melted?", options: ["1 meter", "7 meters", "70 meters"], answerIndex: 1 },
        { question: "Current warming is happening roughly how much faster than the Holocene melting?", options: ["2 times", "5 times", "10 times"], answerIndex: 2 }
      ]
    },
    {
      id: "2026-04-23-economy-pro",
      category: "economy",
      headline: "The Hidden Environmental Cost of Everyday Products: The Melamine Sponge Case",
      body: [
        "What's up, Buddies? Today we're examining how a $2 cleaning product reveals a much bigger economic problem.",
        "Melamine foam sponges — sold under brand names as \"magic erasers\" — have become household staples worldwide. They're cheap, effective, and seemingly harmless. But a new study has revealed that each sponge releases trillions of microplastic fibers during normal use.",
        "This is a textbook example of what economists call a negative externality — a cost that's not reflected in the product's price. The sponge costs $2, but the environmental damage from trillions of microplastic particles entering waterways is borne by society as a whole, not by the manufacturer or consumer.",
        "The scale is staggering. Researchers estimate that melamine sponges globally contribute billions of microplastic fibers to water systems daily. These fibers are too small for most water treatment facilities to capture, meaning they pass directly into rivers and oceans.",
        "Some economists argue that products like these should carry an \"environmental surcharge\" — an additional fee that funds cleanup or develops alternatives. Others suggest stricter regulations that require manufacturers to test and disclose the microplastic output of their products before they reach store shelves."
      ],
      vocab: [
        { word: "externality", meaning: "외부효과 — a cost or benefit affecting someone not involved in a transaction" },
        { word: "microplastic", meaning: "미세 플라스틱 — plastic particles smaller than 5mm" },
        { word: "surcharge", meaning: "추가 요금 — an extra fee added to the normal price" },
        { word: "regulation", meaning: "규제 — official rules controlling how things are done" },
        { word: "disclose", meaning: "공개하다 — to make information known publicly" }
      ],
      quiz: [
        { question: "What is a 'negative externality' in this context?", options: ["A product that doesn't work", "A cost not included in the product's price", "A negative review online"], answerIndex: 1 },
        { question: "Why can't water treatment facilities solve this problem?", options: ["They're too expensive", "The fibers are too small to capture", "They don't have enough workers"], answerIndex: 1 },
        { question: "What are two proposed economic solutions mentioned in the article?", options: ["Ban all sponges and use only paper", "Environmental surcharge and manufacturer disclosure regulations", "Make sponges more expensive and smaller"], answerIndex: 1 }
      ]
    },
    {
      id: "2026-04-23-tech-pro",
      category: "tech",
      headline: "Artificial Neurons Successfully Communicate with Living Brain Cells",
      body: [
        "What's up, everyone? Today we're covering a breakthrough that sits at the intersection of engineering and neuroscience.",
        "Engineers at Northwestern University have created 3D-printed artificial neurons that can successfully communicate with living brain cells. This is the first time synthetic structures have achieved bidirectional signaling with biological neurons.",
        "The process works like this: real neurons communicate by sending electrochemical signals across synapses — tiny gaps between cells. The Northwestern team designed artificial structures that mimic this process, generating signals that real neurons recognize and respond to.",
        "In laboratory tests, the printed neurons were placed near mouse brain cells. The artificial neurons initiated signals, and the biological cells responded with their own signals — essentially creating a conversation between machine and brain tissue.",
        "The potential applications are profound. Patients with neurodegenerative diseases like Parkinson's or Alzheimer's could eventually receive implants that replace damaged neurons with functional artificial ones. Spinal cord injury patients might regain motor function through artificial neural bridges.",
        "However, significant challenges remain. The current prototypes work only in controlled laboratory conditions. Integrating artificial neurons into a living brain without triggering immune rejection, maintaining long-term stability, and scaling the technology to handle the brain's complexity — estimated at 86 billion neurons — will require years of additional research."
      ],
      vocab: [
        { word: "bidirectional", meaning: "양방향의 — working in both directions" },
        { word: "synapse", meaning: "시냅스 — the tiny gap between neurons where signals pass" },
        { word: "neurodegenerative", meaning: "신경퇴행성의 — diseases where nerve cells gradually break down" },
        { word: "implant", meaning: "임플란트 — a device placed inside the body" },
        { word: "immune rejection", meaning: "면역 거부 — the body attacking a foreign object" }
      ],
      quiz: [
        { question: "What makes this achievement a 'first'?", options: ["First artificial brain ever made", "First bidirectional signaling between synthetic and biological neurons", "First time a printer was used in science"], answerIndex: 1 },
        { question: "How do real neurons communicate with each other?", options: ["Through blood flow", "Through electrochemical signals across synapses", "Through vibrations"], answerIndex: 1 },
        { question: "The brain has an estimated 86 billion neurons. If we could print 1 million per day, how many years would it take to match the brain's neuron count?", options: ["About 235 years", "About 23 years", "About 2,350 years"], answerIndex: 0 }
      ]
    },
    {
      id: "2026-04-23-kpop-pro",
      category: "kpop",
      headline: "Panama Tomb Discovery Reveals a Forgotten Pre-Columbian Civilization",
      body: [
        "Hey Buddies, today's story reads like an Indiana Jones movie — except it's real.",
        "Archeologists in Panama have uncovered a tomb overflowing with gold and ceramic artifacts, offering unprecedented insights into a pre-Columbian civilization that historians know remarkably little about.",
        "The tomb, discovered in central Panama, contained gold necklaces, ceremonial plates, intricately designed rings, and ceramic vessels. The craftsmanship suggests a society with advanced metallurgical skills and complex social hierarchies — the burial site clearly belonged to someone of significant status.",
        "What makes this discovery particularly valuable is its context. Unlike well-documented civilizations like the Maya or Inca, the indigenous societies of pre-Columbian Panama left few written records. Archeologists must reconstruct their history almost entirely through physical artifacts.",
        "The artifacts show influences from both South American and Mesoamerican cultures, suggesting Panama served as a cultural crossroads — a meeting point where trade, ideas, and artistic traditions flowed between north and south.",
        "The collection will undergo years of analysis before being displayed publicly. Researchers hope isotopic analysis of the remains and artifacts will reveal details about the individual's diet, origin, and the trade networks that connected this region to the broader pre-Columbian world."
      ],
      vocab: [
        { word: "pre-Columbian", meaning: "콜럼버스 이전의 — before Christopher Columbus arrived in the Americas" },
        { word: "metallurgical", meaning: "야금의 — relating to the science of working with metals" },
        { word: "hierarchy", meaning: "위계 — a system where people are ranked by status or authority" },
        { word: "crossroads", meaning: "교차로 — a place where different cultures or paths meet" },
        { word: "isotopic analysis", meaning: "동위원소 분석 — a scientific method to study the origin and age of materials" }
      ],
      quiz: [
        { question: "Why is this discovery especially valuable?", options: ["The gold is very expensive", "Very little is known about pre-Columbian Panamanian societies", "The tomb is very deep underground"], answerIndex: 1 },
        { question: "What does the evidence suggest about Panama's role in the ancient world?", options: ["It was isolated", "It served as a cultural crossroads", "It was always empty"], answerIndex: 1 },
        { question: "Why must archeologists rely on physical artifacts rather than written records?", options: ["The writing was destroyed", "These societies left few written records", "The writing is in a modern language"], answerIndex: 1 }
      ]
    },
    {
      id: "2026-04-23-sports-pro",
      category: "sports",
      headline: "Massive Study Confirms: Walking More Offsets the Health Risks of Prolonged Sitting",
      body: [
        "What's up, everyone? Today we're looking at a study that should change how you think about your daily routine.",
        "A comprehensive study tracking over 72,000 participants has delivered a clear message: increasing daily step counts can significantly reduce the health risks associated with prolonged sitting, regardless of how many hours you spend seated.",
        "The research, published in a leading medical journal, measured participants' activity using accelerometers over a seven-year period. The results showed that individuals who walked 8,000 to 10,000 steps daily had substantially lower rates of cardiovascular disease, metabolic disorders, and premature mortality — even among those who reported sitting for 10 or more hours per day.",
        "This challenges the previous assumption that sitting is an independent risk factor that exercise cannot fully mitigate. The data suggests a dose-response relationship: more steps consistently correlated with better outcomes, with the most significant health gains occurring between 4,000 and 8,000 daily steps.",
        "For students, this has practical implications. The average school day involves 6–7 hours of seated time. Adding a 30-minute walk before or after school — roughly 3,000 to 4,000 steps — could meaningfully improve long-term health outcomes.",
        "The researchers emphasized that their findings support a simple public health message: any increase in walking is beneficial, and perfection isn't required. You don't need to hit 10,000 steps to see results."
      ],
      vocab: [
        { word: "accelerometer", meaning: "가속도계 — a device that measures movement and steps" },
        { word: "cardiovascular", meaning: "심혈관의 — relating to the heart and blood vessels" },
        { word: "metabolic", meaning: "대사의 — relating to how the body processes food into energy" },
        { word: "dose-response", meaning: "용량-반응 — more of something produces a stronger effect" },
        { word: "mortality", meaning: "사망률 — the rate of death in a population" }
      ],
      quiz: [
        { question: "What did the study find about the relationship between walking and sitting?", options: ["Sitting damage can't be fixed", "Walking can offset sitting risks", "Only running helps"], answerIndex: 1 },
        { question: "At what step range did researchers see the most significant health gains?", options: ["0–1,000 steps", "4,000–8,000 steps", "20,000+ steps"], answerIndex: 1 },
        { question: "A student sits 7 hours at school and walks 30 minutes (about 3,500 steps) daily. Based on this study, is this walking amount beneficial?", options: ["No, it's not enough", "Yes, any increase is beneficial", "Only if they also run"], answerIndex: 1 }
      ]
    }
  ],
  bonusWord: {
    word: "unprecedented",
    korean: "전례 없는",
    example: "The discovery of gold artifacts in Panama was an unprecedented find for archeologists.",
    challenge: "Can you think of something unprecedented that happened in your life this year?"
  }
};
