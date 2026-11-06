/**
 * LUMINA｜微光日常 · Little by Little
 * Localized prompts for small, self-directed steps. Stable IDs keep saved
 * wishes compatible; changing the interface language never rewrites them.
 */
import { t, onLocaleChange } from './i18n.js';

function localizedContent() {
  const CATEGORIES = [
    {
      id: 'growth',
      name: t("學術與成長", "Study & growth"),
      shortName: t("成長", "Growth"),
      color: '#B7D3BC',
      icon: 'book',
      titlePlaceholder: t("例如：從容完成一篇讓自己滿意的文章", "For example: finish a piece of writing I feel good about, at my own pace"),
      visionPlaceholder: t("寫下那個畫面：我坐在明亮的書桌前，清楚地說出自己的想法……", "Picture the moment: I am at a bright desk, expressing my ideas clearly…"),
      actions: [
        t("為手上的題目寫下一句核心想法。", "Write one sentence that captures the main idea of your current topic."),
        t("專心閱讀一頁，留下三個關鍵詞。", "Read one page with care and note three key words."),
        t("打開草稿，只修改一個段落。", "Open your draft and revise just one paragraph."),
        t("把一個大任務拆成三個小步驟。", "Break one big task into three smaller steps."),
        t("整理一則筆記，讓下次更容易找到。", "Organize one note so it is easier to find next time."),
        t("列出一個想弄清楚的問題。", "Write down one question you would like to understand better.")
      ],
      reflections: [
        t("想像你完成今天這一小步後，桌面上會多了甚麼？", "Picture your desk after this small step. What will be there that was not there before?"),
        t("當你從容表達自己的想法時，聲音和姿態是怎樣的？", "When you express your ideas at ease, how do your voice and posture feel?"),
        t("把目光放到下一步：你希望帶着哪一種心情開始？", "Think about your next step. What feeling would you like to bring to it?")
      ],
      affirmations: [
        t("我容許作品先有雛形，再慢慢變好。", "I can let my work begin as a rough draft and improve it gradually."),
        t("一小段專注，也在累積我的能力。", "Even a short stretch of focus helps me build my skills."),
        t("我可以帶着好奇，走好眼前這一步。", "I can bring curiosity to the step in front of me.")
      ]
    },
    {
      id: 'love',
      name: t("愛與連結", "Love & connection"),
      shortName: t("連結", "Connection"),
      color: '#DDB6AC',
      icon: 'heart',
      titlePlaceholder: t("例如：建立自在、互相珍惜的關係", "For example: build a relationship where we feel at ease and value each other"),
      visionPlaceholder: t("寫下那個畫面：我們安心地分享日常，也尊重彼此的空間……", "Picture the moment: we share everyday life with trust and respect each other’s space…"),
      actions: [
        t("寫下一個你珍惜自己的地方。", "Write down one thing you appreciate about yourself."),
        t("給一位願意聯絡的朋友一句真心問候。", "Send a thoughtful hello to a friend you would like to reach out to."),
        t("記下一項讓你感到被尊重的相處方式。", "Note one way of relating to others that helps you feel respected."),
        t("認真聽一個人說完今天的心情。", "Give someone your attention as they share how their day has felt."),
        t("為自己安排十分鐘喜歡的小事。", "Set aside ten minutes for something small you enjoy."),
        t("寫下你希望溫柔表達的一個需要。", "Write down one need you would like to express with kindness.")
      ],
      reflections: [
        t("想像一段自在的相處：你可以安心說出甚麼？", "Picture being at ease with someone. What would you feel comfortable saying?"),
        t("當彼此都被尊重時，一個平凡的下午會怎樣度過？", "What might an ordinary afternoon look like when you both feel respected?"),
        t("如果今天多給自己一點溫柔，你會選擇甚麼？", "If you offered yourself a little more kindness today, what would you choose?")
      ],
      affirmations: [
        t("我的需要值得被溫柔而清楚地表達。", "My needs deserve to be expressed with kindness and clarity."),
        t("我珍惜真誠，也尊重彼此的選擇。", "I value honesty and respect the choices we each make."),
        t("我願意給自己和關係一些呼吸的空間。", "I can give myself and my relationships room to breathe.")
      ]
    },
    {
      id: 'abundance',
      name: t("豐盛與自由", "Abundance & freedom"),
      shortName: t("豐盛", "Abundance"),
      color: '#D9C78F',
      icon: 'sun',
      titlePlaceholder: t("例如：為喜歡的生活多留一點餘裕", "For example: make a little more room for the life I enjoy"),
      visionPlaceholder: t("寫下那個畫面：我清楚自己的安排，能安心選擇真正重視的事……", "Picture the moment: I understand my plans and can choose what matters to me with more ease…"),
      actions: [
        t("記下一筆今天的開支。", "Record one thing you spent money on today."),
        t("查看一項固定支出，了解它的用途。", "Review one regular expense and understand what it is for."),
        t("為一個小額儲蓄目標取名字。", "Give a small savings goal a name."),
        t("列出一件已經擁有、也很珍惜的東西。", "Name one thing you already have and appreciate."),
        t("用三分鐘整理一小疊單據。", "Spend three minutes sorting a small pile of receipts."),
        t("寫下一項你想慢慢培養的實用能力。", "Write down a practical skill you would like to develop over time.")
      ],
      reflections: [
        t("當生活多了一點餘裕，你最想把時間留給甚麼？", "With a little more breathing room in life, what would you make time for?"),
        t("想像一次從容的選擇：你知道自己最重視甚麼？", "Picture making a choice without rushing. What matters most to you?"),
        t("把豐盛畫成日常的一刻，那個畫面裡有甚麼？", "Picture a moment in everyday life that feels abundant. What is in it?")
      ],
      affirmations: [
        t("我可以按自己的步伐，建立更安穩的生活。", "I can build a steadier life at my own pace."),
        t("看清自己的選擇，也是一種自由。", "Understanding my choices is a kind of freedom."),
        t("我願意把資源留給真正重視的事。", "I can direct my resources toward what matters to me.")
      ]
    },
    {
      id: 'travel',
      name: t("旅行與探索", "Travel & discovery"),
      shortName: t("遠方", "Discovery"),
      color: '#A8C5CD',
      icon: 'compass',
      titlePlaceholder: t("例如：慢慢走進一座一直想去的城市", "For example: explore a city I have always wanted to visit"),
      visionPlaceholder: t("寫下那個畫面：清晨的街道、陌生的風景，還有不趕時間的自己……", "Picture the moment: early morning streets, unfamiliar views, and no need to hurry…"),
      actions: [
        t("選一個想去的地方，收藏它的地圖。", "Choose somewhere you would like to visit and save its map."),
        t("查找一個目的地的公共交通方式。", "Look up public transport options for one destination."),
        t("記下一個想親眼看見的風景。", "Write down one view you would like to see in person."),
        t("學一句旅行時可能用得上的問候。", "Learn a greeting that could be useful on a trip."),
        t("為下一次出行寫下三件必備物品。", "List three essentials for your next trip."),
        t("找一條附近沒走過、適合自己的路線。", "Find a nearby route you have not tried that suits you.")
      ],
      reflections: [
        t("抵達想去的地方時，你最先留意到甚麼聲音？", "When you arrive somewhere you have wanted to go, what sound do you notice first?"),
        t("想像一個不趕時間的早晨，你會先走向哪裡？", "Picture a morning with no rush. Where would you go first?"),
        t("這趟探索最想帶給你的，是哪一種感受？", "What feeling would you most like this adventure to bring you?")
      ],
      affirmations: [
        t("我可以從一個小小的新發現開始探索。", "Exploration can begin with one small discovery."),
        t("我為好奇心留一點時間。", "I can make a little time for curiosity."),
        t("遠方的計劃，可以從眼前的一步開始。", "Plans for faraway places can begin with one step here and now.")
      ]
    },
    {
      id: 'wellbeing',
      name: t("身心安定", "Rest & wellbeing"),
      shortName: t("安定", "Calm"),
      color: '#BFCCA2',
      icon: 'leaf',
      titlePlaceholder: t("例如：在忙碌生活裡保留自己的節奏", "For example: keep a rhythm of my own in a busy life"),
      visionPlaceholder: t("寫下那個畫面：我聽見自己的需要，為休息和喜歡的事留出位置……", "Picture the moment: I notice my needs and make room for rest and the things I enjoy…"),
      actions: [
        t("把手邊一小塊空間整理舒服。", "Make one small space around you feel more comfortable."),
        t("停下片刻，放鬆肩膀和雙手。", "Pause for a moment and relax your shoulders and hands."),
        t("寫下此刻的心情，只用三個詞。", "Describe how you feel right now in just three words."),
        t("為今天安排五分鐘安靜的休息。", "Make room for five quiet minutes of rest today."),
        t("如果方便，到窗邊看看遠處的風景。", "If it is convenient, look out of a window at something in the distance."),
        t("選一件今天可以少做一點的事。", "Choose one thing you can do a little less of today.")
      ],
      reflections: [
        t("想像一個令你自在的角落，光線和空氣是怎樣的？", "Picture a corner where you feel at ease. What are the light and air like?"),
        t("如果今天的節奏柔和一點，你會先放下甚麼？", "If today moved at a gentler pace, what would you set aside first?"),
        t("在一個舒服的日常裡，你如何照顧自己的需要？", "In an everyday life that feels comfortable, how do you care for your needs?")
      ],
      affirmations: [
        t("我可以留意自己的需要，再選擇下一步。", "I can notice what I need before choosing my next step."),
        t("休息也可以是今天值得保留的安排。", "Rest can be a worthwhile part of my day."),
        t("我不需要每一天都用同樣的速度前進。", "I do not have to move at the same pace every day.")
      ]
    },
    {
      id: 'cat',
      name: t("貓貓安好", "Cat care"),
      shortName: t("貓貓", "Cats"),
      color: '#D2BEA2',
      icon: 'cat',
      titlePlaceholder: t("例如：和貓貓一起度過安心自在的日常", "For example: share a calm, comfortable everyday life with my cat"),
      visionPlaceholder: t("寫下那個畫面：牠在喜歡的位置舒展身體，我在旁邊安靜地陪伴……", "Picture the moment: my cat stretches out in a favorite spot while I sit quietly nearby…"),
      actions: [
        t("替貓貓的水碗換上乾淨的水。", "Refresh your cat’s bowl with clean water."),
        t("整理牠常休息的一個小角落。", "Tidy a small corner where your cat likes to rest."),
        t("讓牠自行靠近，安靜陪伴幾分鐘。", "Let your cat come to you and spend a few quiet minutes together."),
        t("在牠有興趣時，用熟悉的玩具陪玩一會。", "When your cat shows interest, spend a little time playing with a familiar toy."),
        t("記下一個今天觀察到的可愛小習慣。", "Note one endearing little habit you noticed today."),
        t("檢查一件玩具有沒有鬆脫的小零件。", "Check a toy for any small parts that have come loose.")
      ],
      reflections: [
        t("想像你和牠都自在的一刻，你們各自在做甚麼？", "Picture a moment when you and your cat both feel at ease. What are you each doing?"),
        t("牠喜歡的角落裡，有哪些熟悉的氣味和聲音？", "What familiar smells and sounds are in your cat’s favorite corner?"),
        t("今天你想用哪一個小細節，讓陪伴更舒服？", "What small detail could make your time together more comfortable today?")
      ],
      affirmations: [
        t("我願意留意牠的節奏，讓陪伴更自在。", "I can notice my cat’s pace and let our time together feel unhurried."),
        t("平凡的照顧，也承載着我的心意。", "Everyday care is one way I show my love."),
        t("我珍惜一起度過的每一個小片刻。", "I appreciate the little moments we share.")
      ]
    },
    {
      id: 'custom',
      name: t("我的心願", "My own wish"),
      shortName: t("心願", "Wish"),
      color: '#D9DEB3',
      icon: 'spark',
      titlePlaceholder: t("寫下一個你想慢慢靠近的願望", "Write down a wish you would like to move toward, little by little"),
      visionPlaceholder: t("用幾句話描述：那個生活片刻是怎樣的？你在做甚麼，又有甚麼感受？", "Describe the moment in a few sentences. What are you doing, and how does it feel?"),
      actions: [
        t("寫下這個願望對你重要的一個原因。", "Write down one reason this wish matters to you."),
        t("列出一件你今天可以掌握的小事。", "Name one small thing within your control today."),
        t("花五分鐘準備下一步需要的東西。", "Spend five minutes preparing what you need for your next step."),
        t("把一個模糊的想法寫成具體的小步驟。", "Turn a vague idea into one clear, small step."),
        t("記下一件已經朝這個方向做過的事。", "Note one thing you have already done in this direction."),
        t("選一個合適的時間，留給這件小事。", "Choose a suitable time for this small action.")
      ],
      reflections: [
        t("如果這個願望成為日常，你的一個普通早晨會是怎樣？", "If this wish became part of everyday life, what would an ordinary morning look like?"),
        t("想像自己靠近願望一小步時，你會看見甚麼改變？", "Picture yourself one small step closer to your wish. What change would you notice?"),
        t("在那個想去的未來裡，你最珍惜哪一個細節？", "In the future you hope for, which little detail matters most to you?")
      ],
      affirmations: [
        t("我可以把心願放在心上，也把一步放在今天。", "I can hold my wish in mind and take one step today."),
        t("我容許方向隨着新的理解慢慢調整。", "I can adjust my direction as I learn more."),
        t("小小的行動，也值得被自己看見。", "Even my smallest actions deserve to be noticed.")
      ]
    }
  ];

  const STAGES = [t("心願種子", "A little seed"), t("新芽初生", "First sprout"), t("枝葉舒展", "Growing leaves"), t("含苞待放", "A quiet bud"), t("心願開花", "In bloom")];

  const GUIDE = [
    {
      title: t("種下一個願望", "Plant a wish"),
      body: t("挑一種心願種子，寫下想靠近的生活，以及讓你心動的一個畫面。", "Choose a seed and write about the life you would like to move toward. Add one scene that feels meaningful to you.")
    },
    {
      title: t("收集一點微光", "Gather a little light"),
      body: t("輕點花園裡亮起的光點，為自己留一段專注的時光。慢慢來，也可以。", "Tap the glowing lights in your garden and take a moment to focus. There is no need to hurry.")
    },
    {
      title: t("走出小小一步", "Take one small step"),
      body: t("抽取或寫下今天的行動。等你在生活裡完成它，再回來記錄這一步。", "Draw an action card or write your own small step for today. After doing it in everyday life, come back to record it.")
    },
    {
      title: t("看見心願生長", "Watch your wish grow"),
      body: t("用收集的微光和完成的行動照顧花園，讓種子抽芽、長葉，慢慢開花。", "Gather light and complete small actions to tend your garden. Watch seeds sprout, grow leaves, and gradually bloom.")
    }
  ];

  return { CATEGORIES, STAGES, GUIDE };
}

// Refresh live bindings before the interface renders the new language.
export let CATEGORIES;
export let STAGES;
export let GUIDE;

function refreshContent() {
  ({ CATEGORIES, STAGES, GUIDE } = localizedContent());
}

refreshContent();
onLocaleChange(refreshContent);
