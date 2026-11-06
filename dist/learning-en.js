import { t, onLocaleChange } from './i18n.js';

// Official source links with original LUMINA practice copy.
function buildEnCreators() {
  return [
  {
    id: 'lavendaire',
    name: 'Aileen Xu · Lavendaire',
    shortName: 'Lavendaire',
    initials: 'AX',
    language: t("英文", "English"),
    languageCode: 'en',
    kind: t("生活設計與日記", "Life design and journaling"),
    description: t("用日記、生活設計和小步行動，釐清對自己有意義的生活。適合探索方向、建立日常習慣時參考。", "Uses journaling, life design and small actions to explore a meaningful life. A useful starting point for finding direction and building everyday habits."),
    tags: [t("生活設計", "Life design"), t("願景日記", "Vision journaling"), t("日常習慣", "Everyday habits")],
    needs: ['clarity', 'action'],
    approachNote: t("從公開的生活設計提問延伸為 LUMINA 原創任務，把理想畫面連到今天做得到的一步。", "This original LUMINA practice draws on her public life-design prompts, connecting a picture of the future with a small step you can take today."),
    sources: [
      {
        label: t("如何設計理想生活", "How to design your dream life"),
        url: 'https://www.lavendaire.com/design-dream-life/',
        access: t("公開文章", "Public article"),
        note: t("從日常習慣、感受與關係出發，整理願景並規劃行動。", "Explores habits, feelings and relationships as a starting point for clarifying a vision and planning action."),
      },
      {
        label: t("認識 Aileen 與 Lavendaire", "Meet Aileen and Lavendaire"),
        url: 'https://www.lavendaire.com/press/',
        access: t("公開介紹", "Public overview"),
        note: t("官方創作者簡介、日記作品與分享經歷。", "Her official profile, journals and creative work."),
      },
      {
        label: t("Dream Life Series 免費系列", "Free Dream Life Series"),
        url: 'https://www.lavendaire.com/joindreamlife/',
        access: t("需電郵領取", "Email signup required", "需邮箱领取"),
        note: t("免費十節影片及電郵課程，附練習紙和日記提示。", "A free ten-part video and email series with worksheets and journaling prompts.", "免费十节视频及邮件课程，附练习纸和日记提示。"),
      },
    ],
    practice: {
      title: t("理想的普通一天", "Your ideal ordinary day"),
      minutes: 5,
      summary: t("從一個舒服的日常片段，找到你重視的感受，再為今天安排一小步。", "Picture a comfortable everyday moment, notice the feeling you value, and plan one small step for today."),
      steps: [
        {
          title: t("描繪日常", "Picture an ordinary moment"),
          body: t("選一個理想的普通早晨或放工後，寫下你在哪裏、正在做甚麼。不需要完美，只要貼近你。", "Picture an ordinary morning or an evening after work that feels right for you. Write where you are and what you are doing. It does not need to be perfect, just personal.", "选择一个理想的普通早晨或下班后的片段，写下你在哪里、正在做什么。不需要完美，只要贴近你。"),
        },
        {
          title: t("認出需要", "Name what matters"),
          body: t("這個畫面讓你感到平靜、自在、有連結，還是充滿創意？選一種最重要的感受。", "Does this scene feel peaceful, free, connected or creative? Choose the feeling that matters most to you."),
        },
        {
          title: t("看見已有的部分", "Notice what is already there"),
          body: t("回想現在生活中，有哪件小事已經帶來這種感受。把它記下來。", "Think of something small in your life that already brings this feeling. Write it down."),
        },
        {
          title: t("縮小行動", "Make the step smaller"),
          body: t("選一件今天能做到的小事，例如整理閱讀角落、畫十分鐘，或向朋友發出散步邀請。", "Choose something you can do today, such as tidying a reading corner, drawing for ten minutes, or inviting a friend for a walk."),
        },
        {
          title: t("放進日程", "Give it a time and place"),
          body: t("補上時間和地點：「今天＿＿時，在＿＿，我會＿＿。」讓這一步有個位置。", "Complete “At ___ today, in ___, I will ___.” Make room for this step in your day."),
        },
      ],
      reflectionPrompt: t("你想在日常多一點甚麼感受？現在哪件小事已經讓你靠近它？", "Which feeling would you like more of in everyday life? What small thing already brings you closer to it?"),
      reflectionPlaceholder: t("例如：我想多一點平靜。晚上放下電話讀幾頁書時，我已經感受到一點。", "For example: I would like more calm. I already feel a little of it when I put my phone down and read a few pages at night.", "例如：我想多一点平静。晚上放下手机读几页书时，我已经感受到一点。"),
      actionExample: t("今晚 9 時，在床邊讀 5 分鐘書。", "At 9 tonight, I will read for five minutes beside my bed."),
      closing: t("你想要的生活，可以從一個普通日子的小改變開始。", "The life you want can begin with a small change on an ordinary day."),
    },
    verifiedAt: '2026-11-06',
  },
  {
    id: 'roxie',
    name: 'Roxie Nafousi',
    shortName: 'Roxie',
    initials: 'RN',
    language: t("英文", "English"),
    languageCode: 'en',
    kind: t("願景與行動", "Vision and action"),
    description: t("以七步練習整理願景、信念與行動。適合心裏已有方向，想把模糊願望變成每天一小步時參考。", "Her seven-step approach brings together vision, beliefs and action. A starting point for turning a broad wish into a small daily step."),
    tags: [t("願景釐清", "Clarifying a vision"), t("行動一致", "Aligning actions"), t("感謝資源", "Appreciating your resources")],
    needs: ['action', 'selftalk'],
    approachNote: t("作者的框架含有靈性觀點；這裏的原創任務聚焦願景、現有資源與可由你決定的行動。", "The author’s framework includes spiritual views. This original practice focuses on your vision, the resources you have, and actions within your control."),
    sources: [
      {
        label: t("Manifest 官方框架介紹", "Official introduction to Manifest"),
        url: 'https://roxienafousi.com/books/manifest/',
        access: t("公開介紹", "Public overview"),
        note: t("認識書籍與七步框架，包括願景、行為及感謝等主題。", "An introduction to the book and its seven-step framework, including vision, behaviour and gratitude."),
      },
      {
        label: t("官方讀書會討論指南", "Official book club guide"),
        url: 'https://roxienafousi.com/wp-content/uploads/2023/11/Book-Club-PDF.pdf',
        access: t("免費 PDF", "Free PDF"),
        note: t("提供反思與討論問題；部分內容適合配合書籍閱讀。", "Reflection and discussion questions; some sections are intended to accompany the book."),
      },
      {
        label: t("出版社作者介紹", "Publisher’s author profile"),
        url: 'https://www.penguinrandomhouse.com/authors/2309228/roxie-nafousi/',
        access: t("公開介紹", "Public overview"),
        note: t("Penguin Random House 的作者背景與作品資料。", "Author background and book information from Penguin Random House."),
      },
    ],
    practice: {
      title: t("讓願望落地", "Give your wish a practical next step"),
      minutes: 4,
      summary: t("接住心裏的願望與猶豫，找出一項支持，再選今天能做的小動作。", "Make room for your wish and your hesitation, find one source of support, and choose a small action for today."),
      steps: [
        {
          title: t("說清楚願景", "Put your vision into words"),
          body: t("用一句話描述想改善的生活面向，例如「我想更自在地分享自己的作品」。", "Use one sentence to describe an area of life you would like to improve, such as “I want to feel more comfortable sharing my work.”"),
        },
        {
          title: t("接住卡住的地方", "Acknowledge the difficult part"),
          body: t("想想目前最難的是甚麼。害怕或沒有把握都可以，先寫下來，無須急着改變感受。", "Notice what feels hardest right now. Fear or uncertainty is welcome here. Write it down without rushing to change how you feel."),
        },
        {
          title: t("挑一個小動作", "Choose a small action"),
          body: t("選一件由你能決定的事，例如選一張作品、寫三句介紹，或向信任的人徵求回饋。", "Choose something within your control: pick one piece of work, write three lines about it, or ask someone you trust for feedback."),
        },
        {
          title: t("找到支持", "Find some support"),
          body: t("記下一項可運用的資源，例如十分鐘空檔、一份範例或一位願意聆聽的人，再安排何時行動。", "Name one resource you can use, such as ten free minutes, an example, or someone willing to listen. Then decide when you will act."),
        },
      ],
      reflectionPrompt: t("你想向哪個願景踏出一步？目前的阻礙和已有的支持是甚麼？", "Which vision would you like to take a step towards? What is getting in the way, and what support do you already have?"),
      reflectionPlaceholder: t("例如：我想分享作品，但有點怕被評價。我已有一張完成的畫，可以先寫一句介紹。", "For example: I want to share my work, but I worry about being judged. I have a finished drawing and can start by writing one line about it."),
      actionExample: t("今日晚飯後，選一張作品並寫一句介紹。", "After dinner today, I will choose one piece of work and write one line about it."),
      closing: t("願景可以很大，今天這一步可以很小。", "Your vision can be big. Today’s step can be small."),
    },
    verifiedAt: '2026-11-06',
  },
  {
    id: 'gabby',
    name: 'Gabby Bernstein',
    shortName: 'Gabby',
    initials: 'GB',
    language: t("英文", "English"),
    languageCode: 'en',
    kind: t("靈性自我探索", "Spiritual self-reflection"),
    description: t("從靈性自我成長的角度，探索願望背後的動機，並練習為結果保留彈性。適合想放慢腳步、重新理解自己需要時參考。", "Explores the motivation behind wishes through a spiritual approach to personal growth, while leaving room for different outcomes. A starting point for slowing down and understanding your needs."),
    tags: [t("動機探索", "Exploring motivation"), t("結果彈性", "Flexibility about outcomes"), t("靈性觀點", "Spiritual perspectives")],
    needs: ['selftalk', 'flexibility'],
    approachNote: t("能量與宇宙是作者的靈性觀點；這裏的原創任務著重理解需要、保留選擇與溫和行動。", "Ideas about energy and the universe reflect the author’s spiritual views. This original practice focuses on understanding your needs, keeping options open and taking gentle action."),
    sources: [
      {
        label: t("顯化練習的建議與反思", "Suggestions and reflections on manifesting"),
        url: 'https://gabbybernstein.com/dos-donts-manifesting/',
        access: t("公開文章", "Public article"),
        note: t("談願望動機、對結果保持彈性與日常練習，內含作者的靈性觀點。", "Discusses motivation, flexibility about outcomes and everyday practice, including the author’s spiritual views."),
      },
      {
        label: t("出版社作者與作品介紹", "Publisher’s author and book information"),
        url: 'https://www.penguinrandomhouse.com/authors/130866/gabrielle-bernstein/',
        access: t("公開介紹", "Public overview"),
        note: t("認識 Gabrielle Bernstein，以及 Super Attractor 等作品。", "An introduction to Gabrielle Bernstein and books including Super Attractor."),
      },
      {
        label: t("官方免費冥想", "Official free meditations"),
        url: 'https://gabbybernstein.com/meditation/free-meditations/',
        access: t("需電郵領取", "Email signup required", "需邮箱领取"),
        note: t("免費冥想以電郵寄送，需填寫名字及電郵；頁面亦設有行銷郵件選項。", "Free meditations delivered by email. A name and email address are required; the page also offers an option to receive marketing emails.", "免费冥想通过邮件发送，需填写名字及邮箱；页面也设有营销邮件选项。"),
      },
    ],
    practice: {
      title: t("願望背後的需要", "The need behind your wish"),
      minutes: 3,
      summary: t("把目光放回真正重視的感受，看看還有哪些可能，再選擇今天能做的一步。", "Return to the feeling that matters to you, explore other possibilities, and choose a step you can take today."),
      steps: [
        {
          title: t("問自己為甚麼", "Ask yourself why"),
          body: t("補完這句話：「我希望＿＿，因為我想在生活中多一點＿＿。」後一格可以是連結、成長或安全感。", "Complete “I hope for ___ because I want more ___ in my life.” The second space might be connection, growth or a sense of security."),
        },
        {
          title: t("留下其他可能", "Leave room for another possibility"),
          body: t("除了眼前想像的結果，還有哪一種方式能照顧同一個需要？先想出一個替代途徑。", "Apart from the outcome you pictured, what other way could meet the same need? Think of one alternative path."),
        },
        {
          title: t("做一件有益的事", "Do one helpful thing"),
          body: t("選一件對自己或他人有益、由你能決定的小事，安排今天試一次。你不用先知道結果。", "Choose a small action within your control that could help you or someone else, and plan to try it today. You do not need to know the outcome in advance."),
        },
      ],
      reflectionPrompt: t("這個願望背後，你最重視的需要是甚麼？還有甚麼方式可以照顧它？", "Which need matters most beneath this wish? What other ways could you care for it?"),
      reflectionPlaceholder: t("例如：我想得到肯定，也想感到有連結。今天可以先真誠地關心一位朋友，並記下自己已完成的事。", "For example: I want to feel appreciated and connected. Today I can check in with a friend and note something I have already accomplished."),
      actionExample: t("今晚花 3 分鐘，記下一件自己已完成、值得肯定的事。", "Tonight, I will take three minutes to note one thing I have accomplished and appreciate."),
      closing: t("可以認真投入，也可以讓結果保有彈性。", "You can care deeply while leaving room for the outcome to unfold differently."),
    },
    verifiedAt: '2026-11-06',
  },
];
}

export let EN_CREATORS = buildEnCreators();
onLocaleChange(() => { EN_CREATORS = buildEnCreators(); });
