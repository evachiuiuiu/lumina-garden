import { t, onLocaleChange } from './i18n.js';

// Original LUMINA practices inspired by the publicly linked themes below.
// Creator links document identity and approach, not guaranteed outcomes.
function buildZhCreators() {
  return [
  {
    id: 'jolie',
    name: t("九粒 Jolie", "Jolie"),
    shortName: t("九粒", "Jolie"),
    initials: 'J',
    language: t("中文", "Chinese"),
    languageCode: 'zh',
    kind: t("創作者／作者", "Creator and author"),
    description: t("以願望澄清、感恩書寫與想像未來分享自我成長，適合喜歡手帳與日常儀式感的初學者。", "Explores personal growth through clarifying wishes, gratitude journaling and imagining the future. A gentle starting point if you enjoy journals and everyday rituals."),
    tags: [t("願望澄清", "Clarifying wishes"), t("感恩書寫", "Gratitude journaling"), t("想像未來", "Imagining the future")],
    needs: ['clarity', 'action'],
    approachNote: t("在花園裏，我們把想像與感恩化成一項可做的小事。願望不必立刻實現，練習也不需要完美。", "Here, imagination and gratitude become one small action you can take. Your wish does not have to come true straight away, and the practice does not have to be perfect."),
    sources: [
      {
        label: t("從三個問題看清願望", "Three questions to clarify a wish"),
        url: 'https://joliebestie.com/post/1094/',
        access: t("公開文章", "Public article"),
        note: t("本人於 2023 年發佈的入門文章，談願望、動機與期待的感受。", "An introductory article published by Jolie in 2023, exploring wishes, motivation and the feelings we hope for."),
      },
      {
        label: t("九粒 Jolie 的 YouTube", "Jolie on YouTube"),
        url: 'https://www.youtube.com/joliechi',
        access: t("官方頻道", "Official channel"),
        note: t("由本人官方連結頁提供的影音入口，可自行選看願景與自我成長內容。", "The video channel linked from her official profile, with content on vision and personal growth to explore at your own pace."),
      },
      {
        label: t("《你的宇宙訂單已到貨！》出版社介紹", "Publisher’s introduction to Jolie’s book"),
        url: 'https://www.booklife.com.tw/product-detail/05100176',
        access: t("公開介紹", "Public overview"),
        note: t("方智出版社的作者資料與書目，包含找出心願、感恩及放下控制等主題。", "The publisher’s author profile and book information, covering wishes, gratitude and letting go of control."),
      },
    ],
    practice: {
      title: t("把願望寫成今天的一步", "Turn a wish into today’s small step"),
      minutes: 4,
      summary: t("用一個生活片段看清願望，找出它對你的意義，再選擇今天做得到的一步。", "Picture a moment from everyday life, notice why it matters to you, and choose one step you can take today."),
      steps: [
        {
          title: t("看清願望", "Clarify your wish"),
          body: t("寫下「我希望生活裏增加＿＿」。描述一個能觀察到的片段，例如完成作品集的一頁，或留一點時間給自己。", "Complete “I would like more ___ in my life.” Describe a moment you could actually notice, such as finishing a portfolio page or making a little time for yourself."),
        },
        {
          title: t("找一份理由", "Find your reason"),
          body: t("問問自己：這件事為何重要？想像它帶來的感受，可能是自在、踏實、親近或成長。選最貼近你的一個。", "Ask why this matters. Imagine the feeling it might bring: ease, steadiness, connection or growth. Choose the one that feels closest to you."),
        },
        {
          title: t("留意已有的支持", "Notice the support you have"),
          body: t("寫下一份已經擁有的支持：一項能力、一段可用的時間，或一個願意聆聽的人。很小也算。", "Name one source of support you already have: a skill, a little free time, or someone willing to listen. Small things count."),
        },
        {
          title: t("安排今天的一步", "Plan today’s step"),
          body: t("在行動欄填寫「今天＿＿時，我會花 5 分鐘＿＿」。挑選由你決定的事，完成後再回來為花園澆水。", "In the action box, complete “At ___ today, I will spend five minutes ___.” Choose something within your control, then return to water your garden after doing it."),
        },
      ],
      reflectionPrompt: t("你想為生活增加甚麼片段？寫下它對你的意義，以及一份已經擁有的支持。", "What would you like more of in your life? Write why it matters and name one source of support you already have."),
      reflectionPlaceholder: t("我想完成作品集的一頁，讓自己更踏實地準備下一次機會。\n我已有一份草稿，今晚也能留出一小段時間。", "I want to finish one portfolio page so I feel better prepared for my next opportunity.\nI already have a draft and can make a little time this evening."),
      actionExample: t("今天晚飯後，我會花 5 分鐘整理作品集的一頁。", "After dinner today, I will spend five minutes working on one portfolio page."),
      closing: t("想像幫你看清方向，行動讓你多了解自己。結果也受時間與環境影響，不用以願望是否成真衡量自己的價值。", "Imagination can clarify your direction, and action can teach you about yourself. Timing and circumstances also shape outcomes; whether a wish comes true does not define your worth."),
    },
    verifiedAt: '2026-11-06',
  },
  {
    id: 'lee',
    name: t("李欣頻", "Lee Hsin-pin"),
    shortName: t("李欣頻", "Lee Hsin-pin"),
    initials: t("李", "LH"),
    language: t("中文", "Chinese"),
    languageCode: 'zh',
    kind: t("作家／講者", "Writer and speaker"),
    description: t("以創意、轉念與書寫探索理想生活的華語作家，適合想整理自我對話、尋找下一步的人。", "A Chinese-language writer who explores life through creativity, reframing and writing. A useful starting point for reflecting on self-talk and finding your next step."),
    tags: [t("自我對話", "Self-talk"), t("轉念書寫", "Reframing through writing"), t("小步行動", "Small actions")],
    needs: ['selftalk', 'action'],
    approachNote: t("這裏選取自我反思與實踐日記的方向。新說法要讓你覺得可信，並配上一個做得到的動作，不必勉強自己相信很大的承諾。", "This practice draws on reflection and action journaling. Choose words that feel believable and pair them with a manageable action; you do not have to force yourself to believe a sweeping promise."),
    sources: [
      {
        label: t("《精準轉富》出版社介紹", "Publisher’s introduction to Lee Hsin-pin’s book"),
        url: 'https://www.booklife.com.tw/product-detail/03900205-1',
        access: t("公開介紹", "Public overview"),
        note: t("方智出版社的作者介紹與目錄，可了解轉念、實踐日記及具體願景等主題。", "The publisher’s author introduction and table of contents, with themes including reframing, action journaling and concrete visions."),
      },
      {
        label: t("李欣頻 × 劉軒：轉念與理想生活", "Lee Hsin-pin and Liu Xuan: reframing and everyday life"),
        url: 'https://player.soundon.fm/p/17e025f5-3a87-41b5-8cff-af804ad195f3/episodes/c9878f31-2753-4f33-89df-55ad350794b3',
        access: t("公開訪談", "Public interview"),
        note: t("《劉軒的 How to 人生學》EP494，2026 年 7 月 16 日發佈；45:36 起有生活練習。", "Episode 494 of Liu Xuan’s podcast, published on 16 July 2026. Everyday exercises begin at 45:36."),
      },
    ],
    practice: {
      title: t("換一句能帶你往前的話", "Find words that help you move forward"),
      minutes: 5,
      summary: t("聽見令自己停下來的念頭，分清事實與擔心，再寫一句能支持小步行動的新說法。", "Notice a thought that holds you back, separate facts from worries, and write a more supportive way to begin."),
      steps: [
        {
          title: t("聽見原句", "Notice the original thought"),
          body: t("想起一個最近令你停下來的念頭，例如「我總是做不好」。先如實寫下，不急着反駁。", "Recall a recent thought that stopped you, such as “I never get this right.” Write it down as it is, without rushing to argue with it."),
        },
        {
          title: t("分開事實與預測", "Separate facts from predictions"),
          body: t("寫出現在確定發生了甚麼，以及你擔心之後會發生甚麼。擔心可以被聽見，也可以暫時保留為一種可能。", "Write what you know has happened and what you worry might happen next. You can acknowledge a worry while leaving it as a possibility, rather than a certainty."),
        },
        {
          title: t("換成可信的新說法", "Try a believable alternative"),
          body: t("試寫一句你願意相信的話，例如「我還在練習，可以先完成一小部分」。不用一下子變得很有信心。", "Try a sentence you could believe, such as “I am still learning, and I can finish one small part.” You do not have to feel confident all at once."),
        },
        {
          title: t("配上一個小動作", "Pair it with a small action"),
          body: t("選一件由你決定、約 5 分鐘可開始的事：讀一頁資料、整理三個想法，或寫一段草稿。", "Choose something within your control that you can start in about five minutes: read a page, organise three ideas, or draft a paragraph."),
        },
        {
          title: t("決定開始點", "Choose when to begin"),
          body: t("在行動欄填寫「當＿＿時，我先＿＿」。完成後回來記下發生了甚麼，下一次再按需要調整。", "In the action box, complete “When ___, I will start by ___.” Afterwards, return to record what happened and adjust your approach next time."),
        },
      ],
      reflectionPrompt: t("哪一句話讓你卡住？試把事實與擔心分開，再寫一句更可信、能支持行動的新說法。", "Which thought leaves you feeling stuck? Separate facts from worries, then try a believable sentence that supports action."),
      reflectionPlaceholder: t("原本：我總是做不好。\n事實：這一頁還未完成。\n新說法：我可以先完成一小段，再慢慢修改。", "Original thought: I never get this right.\nFact: This page is not finished yet.\nNew wording: I can finish one small section and revise it later."),
      actionExample: t("今天晚上 8 點，我先花 5 分鐘完成草稿的第一段。", "At 8 tonight, I will spend five minutes drafting the first paragraph."),
      closing: t("今天的一次嘗試，會幫你看清下一步。需要休息、縮小任務或換一個方法，也可以。", "One attempt today can help you see your next step. You can also rest, make the task smaller, or try a different approach."),
    },
    verifiedAt: '2026-11-06',
  },
];
}

export let ZH_CREATORS = buildZhCreators();
onLocaleChange(() => { ZH_CREATORS = buildZhCreators(); });
