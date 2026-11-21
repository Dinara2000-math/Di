const toast = document.querySelector("#toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2600);
}

document.querySelector("#themeBtn")?.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  showToast(document.body.classList.contains("dark") ? "Қараңғы тақырып қосылды" : "Жарық тақырып қосылды");
});

document.querySelector("#demoBtn")?.addEventListener("click", () => {
  document.querySelector(".hero-demo")?.scrollIntoView({ behavior: "smooth", block: "center" });
  showToast("AI-тренердің демо сұхбаты");
});

function initStudyCalendar() {
  const weekElement = document.querySelector("#studyWeek");
  if (!weekElement) return;

  const now = new Date();
  now.setHours(12, 0, 0, 0);
  const mondayOffset = (now.getDay() + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - mondayOffset);

  const dayNames = ["Жс", "Дс", "Сс", "Ср", "Бс", "Жм", "Сн"];
  const monthNames = [
    "қаңтар", "ақпан", "наурыз", "сәуір", "мамыр", "маусым",
    "шілде", "тамыз", "қыркүйек", "қазан", "қараша", "желтоқсан"
  ];
  const fullDayNames = ["Жексенбі", "Дүйсенбі", "Сейсенбі", "Сәрсенбі", "Бейсенбі", "Жұма", "Сенбі"];
  let completedDates = [];
  try {
    completedDates = JSON.parse(localStorage.getItem("qas_study_days") || "[]");
  } catch (_) {
    completedDates = [];
  }

  const todayKey = now.toISOString().slice(0, 10);
  if (!completedDates.includes(todayKey)) {
    completedDates.push(todayKey);
    localStorage.setItem("qas_study_days", JSON.stringify(completedDates.slice(-365)));
  }

  let consecutiveDays = 0;
  const cursor = new Date(now);
  while (completedDates.includes(cursor.toISOString().slice(0, 10))) {
    consecutiveDays++;
    cursor.setDate(cursor.getDate() - 1);
  }

  weekElement.innerHTML = "";
  for (let index = 0; index < 7; index++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    const dateKey = date.toISOString().slice(0, 10);
    const dayIndex = date.getDay();
    const isToday = dateKey === todayKey;
    const isCompleted = completedDates.includes(dateKey);
    const item = document.createElement("div");
    item.innerHTML = `
      <span>${dayNames[dayIndex]}</span>
      <i class="${isToday ? "now" : isCompleted ? "done" : ""}">${isCompleted && !isToday ? "✓" : date.getDate()}</i>
      <small>${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}</small>`;
    if (isToday) item.setAttribute("title", `${fullDayNames[dayIndex]}, ${date.getDate()} ${monthNames[date.getMonth()]}`);
    weekElement.appendChild(item);
  }

  document.querySelector("#studyStreak").textContent = `${consecutiveDays} күн`;
  document.querySelector("#todayLabel").textContent =
    `БҮГІН · ${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()} · ${fullDayNames[now.getDay()]}`;
  document.querySelector("#progressTitle").title =
    `${fullDayNames[now.getDay()]}, ${now.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()} жылы`;
}

initStudyCalendar();

const drawer = document.querySelector("#aiDrawer");
const openDrawer = (subject = "") => {
  drawer?.classList.add("open");
  if (subject) showToast(`${subject} пәнінен дайындық ашылды`);
};

document.querySelector("#startBtn")?.addEventListener("click", () => openDrawer());
document.querySelector("#bottomStart")?.addEventListener("click", () => openAuth());
document.querySelector("#drawerClose")?.addEventListener("click", () => drawer?.classList.remove("open"));

document.querySelectorAll(".subject-card").forEach((card) => {
  card.addEventListener("click", () => openStudy(card.dataset.subject));
});

const studyLibrary = {
  "Жоғары математика": [
    {
      title: "Бір айнымалы функцияның туындысы", subtitle: "Дифференциалдау",
      theory: "<p>Туынды — функцияның аргумент өзгерген кездегі өзгеру жылдамдығын сипаттайды. Экстремум нүктелерін, көлбеуді және функцияның өсу-кему аралықтарын табу үшін туынды қолданылады.</p><ul><li>(xⁿ)′ = nxⁿ⁻¹</li><li>(sin x)′ = cos x</li><li>(uv)′ = u′v + uv′</li><li>f′(x)=0 нүктелері күдікті экстремум нүктелері</li></ul>",
      questions: [
        { q: "f(x)=x³ туындысы нешеге тең?", options: ["3x²", "x²", "3x", "x³"], answer: 0 },
        { q: "f(x)=2x+5 туындысы нешеге тең?", options: ["2", "5", "7", "2x"], answer: 0 }
      ]
    },
    {
      title: "Интеграл", subtitle: "Анықталмаған интеграл",
      theory: "<p>Анықталмаған интеграл туындысы берілген функцияны қалпына келтіретін алғашқы функциялар жиыны. Әр нәтижеге тұрақты C қосылады.</p><ul><li>∫xⁿ dx = xⁿ⁺¹/(n+1) + C</li><li>∫cos x dx = sin x + C</li><li>∫eˣ dx = eˣ + C</li></ul>",
      questions: [
        { q: "∫2x dx нәтижесі:", options: ["x²+C", "2+C", "x+C", "x³+C"], answer: 0 },
        { q: "∫cos x dx нәтижесі:", options: ["sin x+C", "−sin x+C", "cos x+C", "tg x+C"], answer: 0 }
      ]
    },
    {
      title: "Квадрат теңдеу", subtitle: "Дискриминант",
      theory: "<p>ax²+bx+c=0 теңдеуінің түбірлері дискриминант арқылы табылады: D=b²−4ac. D>0 болғанда екі, D=0 бір, D<0 нақты түбір жоқ.</p><ul><li>x₁,₂=(−b±√D)/2a</li><li>Виет теоремасы: x₁+x₂=−b/a</li><li>x₁·x₂=c/a</li></ul>",
      questions: [
        { q: "x²−5x+6=0 түбірлері:", options: ["2 және 3", "−2 және −3", "1 және 6", "−1 және −6"], answer: 0 },
        { q: "D<0 болса, теңдеудің қанша нақты түбірі бар?", options: ["0", "1", "2", "Шексіз"], answer: 0 }
      ]
    }
  ],
  "Бағдарламалау": [
    {
      title: "Айнымалылар", subtitle: "Python негіздері",
      theory: "<p>Айнымалы — мәліметті уақытша сақтайтын атаулы жәшік. Python-да типты айнымалыны жариялаған кезде анықтау міндетті емес.</p><ul><li>int — бүтін сан</li><li>float — бөлшек сан</li><li>str — мәтін</li><li>bool — True немесе False</li></ul>",
      questions: [
        { q: "12.5 мәнінің Python типі қандай?", options: ["float", "int", "str", "bool"], answer: 0 },
        { q: "Қай мән логикалық типке жатады?", options: ["True", "15", "'True'", "None"], answer: 0 }
      ]
    },
    {
      title: "Циклдар", subtitle: "for және while",
      theory: "<p>Цикл бір блокты берілген шарт немесе итерация саны бойынша қайталайды. for тізім мен диапазон бойынша, while шарт ақиқат болғанша жұмыс істейді.</p><ul><li>range(n) — 0-ден n−1-ге дейін</li><li>break — циклды тоқтатуы</li><li>continue — келесі итерацияға өтуі</li></ul>",
      questions: [
        { q: "range(5) қандай сандарды береді?", options: ["0,1,2,3,4", "1,2,3,4,5", "0,1,2,3,4,5", "1,2,3,4"], answer: 0 },
        { q: "Циклды ерте тоқтататын оператор:", options: ["break", "stop", "exit()", "end"], answer: 0 }
      ]
    },
    {
      title: "Функциялар", subtitle: "Қайтару мәні",
      theory: "<p>Функция — қайта пайдалануға арналған код блогы. Параметр арқылы кіріс алады, return арқылы нәтижені қайтаруы мүмкін.</p><ul><li>def — функцияны жариялау</li><li>return — мәнді қайтару</li><li>Параметрдің мәні нұсқаулықтан беріледі</li></ul>",
      questions: [
        { q: "Python функциясы қалай жарияланады?", options: ["def name():", "function name():", "fun name():", "create name():"], answer: 0 },
        { q: "Функциядан мән қайтару үшін қандай оператор?", options: ["return", "print", "yield", "back"], answer: 0 }
      ]
    }
  ],
  "Экономика": [
    {
      title: "Сұраныс және ұсыныс", subtitle: "Нарық тепе-теңдігі",
      theory: "<p>Сұраныс — белгілі бағада тұтынушының сатып алуға дайын саны. Ұсыныс — сатушының белгілі бағада сатуға дайын саны. Екі қисық қиылысқан нүкте нарық тепе-теңдігі деп аталады.</p><ul><li>Баға жоғарылағанда сұраныс әдетте төмендейді</li><li>Баға жоғарылағанда ұсыныс көбейеді</li><li>Сұраныс пен ұсыныс тең болған баға тепе-теңдік баға</li></ul>",
      questions: [
        { q: "Сұраныс саны бағаға қалай тәуелді?", options: ["Баға өскенде әдетте төмендейді", "Бағаға тәуелді емес", "Баға өскенде әрқашан өседі", "Тек ұсынысқа тәуелді"], answer: 0 },
        { q: "Нарық тепе-теңдігі қай кезде орын алады?", options: ["Сұраныс ұсынысқа тең болғанда", "Сұраныс нөл болғанда", "Ұсыныс нөл болғанда", "Баға ең биік болғанда"], answer: 0 }
      ]
    },
    {
      title: "Микроэкономика", subtitle: "Фирма және шығын",
      theory: "<p>Микроэкономика жеке үй шаруашылықтары мен фирмалардың шешімдерін зерттейді. Фирманың негізгі мақсаты — табыс пен шығын арасындағы пайданы барынша арттыру.</p><ul><li>Пайдa = Жалпы табыс − Жалпы шығын</li><li>Тұрақты шығын өндіріс көлеміне тәуелді емес</li><li>Айнымалы шығын өндіріс көлеміне байланысты өзгереді</li></ul>",
      questions: [
        { q: "Пайда қалай есептеледі?", options: ["Табыс − Шығын", "Шығын − Табыс", "Баға × Саны", "Сұраныс + Ұсыныс"], answer: 0 },
        { q: "Тұрақты шығын қандай факторға тәуелді емес?", options: ["Өндіріс көлеміне", "Жалақыға", "Жалға", "Құрал-жабдыққа"], answer: 0 }
      ]
    },
    {
      title: "Макроэкономика", subtitle: "ЖІӨ және инфляция",
      theory: "<p>Макроэкономика экономика жүйесінің жалпы көрсеткіштерін талдайды: ЖІӨ, инфляция, жұмыссыздық және валюталық курс.</p><ul><li>ЖІӨ — белгілі кезеңде өндірілген тауар мен қызмет құны</li><li>Инфляция — бағаның орташа деңгейінің өсуі</li><li>Жұмыссыздық — жұмыс іздеп жүрген еңбекке қабілеттілер үлесі</li></ul>",
      questions: [
        { q: "Инфляция деген не?", options: ["Бағаның жалпы өсуі", "Жұмыс орындарының өсуі", "Экспорттың өсуі", "Салықтың төмендеуі"], answer: 0 },
        { q: "ЖІӨ нені өлшейді?", options: ["Өндірілген тауар мен қызмет құнын", "Халық санының өсуін", "Тек мемлекеттің табысын", "Тек экспорт мөлшерін"], answer: 0 }
      ]
    }
  ],
  "Физика": [
    {
      title: "Кинематика", subtitle: "Қозғалыс заңдары",
      theory: "<p>Кинематика дененің қозғалысын күштерді ескерместен сипаттайды. Негізгі шамалар: орын ауыстыру, жылдамдық және үдеу.</p><ul><li>Орташа жылдамдық v=S/t</li><li>Теңүдемелі қозғалыс v=v₀+at</li><li>Орын ауыстыру S=v₀t+at²/2</li></ul>",
      questions: [
        { q: "Жылдамдықтың SI жүйесіндегі өлшем бірлігі:", options: ["м/с", "м", "кг", "Н"], answer: 0 },
        { q: "Үдеудің өлшем бірлігі:", options: ["м/с²", "м/с", "Н/м", "Дж"], answer: 0 }
      ]
    },
    {
      title: "Динамика", subtitle: "Ньютон заңдары",
      theory: "<p>Динамика денелердің қозғалысын туғызатын күштерді зерттейді. Ньютонның екінші заңы денеге әсер ететін күш, масса және үдеу арасындағы байланыс береді.</p><ul><li>F=m·a</li><li>Инерция — дененің қозғалыс күйін сақтай алу қасиеті</li><li>Әрбір әсерге тең және қарама-қарсы реакция бар</li></ul>",
      questions: [
        { q: "Ньютонның екінші заңы:", options: ["F=m·a", "E=m·c²", "P=U·I", "A=F·S"], answer: 0 },
        { q: "Күш екі есе өссе және масса өзгермесе, үдеу:", options: ["Екі есе өседі", "Екі есе кемиді", "Өзгермейді", "Нөлге тең болады"], answer: 0 }
      ]
    },
    {
      title: "Энергия", subtitle: "Жұмыс және қуат",
      theory: "<p>Жұмыс күштің денені орын ауыстыруға әсер етуін сипаттайды. Қуат — уақыт бірлігінде атқарылған жұмыс. Механикалық энергия сақталу заңы идеал жағдайда жалпы энергияны тұрақты етеді.</p><ul><li>A=F·S·cosα</li><li>P=A/t</li><li>Потенциалдық энергия Eₚ=mgh</li></ul>",
      questions: [
        { q: "Қуаттың формуласы:", options: ["P=A/t", "P=m·a", "P=F·S", "P=I·R"], answer: 0 },
        { q: "Потенциалдық энергияның формуласы:", options: ["mgh", "mv²/2", "ma", "mc²"], answer: 0 }
      ]
    }
  ]
};

let currentSubject = "";
let currentTopic = 0;

function openStudy(subject) {
  currentSubject = subject;
  currentTopic = 0;
  document.querySelector("#studyTitle").textContent = subject;
  document.querySelector("#studyModal").classList.add("open");
  renderTopics();
  showStudyTab("theory");
}

function renderTopics() {
  const list = document.querySelector("#topicList");
  list.innerHTML = "";
  studyLibrary[currentSubject].forEach((topic, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `topic-button${index === currentTopic ? " active" : ""}`;
    button.innerHTML = `${topic.title}<span>${topic.subtitle}</span>`;
    button.addEventListener("click", () => {
      currentTopic = index;
      renderTopics();
      showStudyTab(document.querySelector(".study-tabs button.active").dataset.tab);
    });
    list.appendChild(button);
  });
}

function showStudyTab(tab) {
  document.querySelectorAll(".study-tabs button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tab);
  });
  const theory = document.querySelector("#theoryPanel");
  const test = document.querySelector("#testPanel");
  const topic = studyLibrary[currentSubject][currentTopic];
  theory.hidden = tab !== "theory";
  test.hidden = tab !== "test";
  if (tab === "theory") {
    theory.innerHTML = `<article class="theory-card"><h3>${topic.title}</h3>${topic.theory}</article>`;
  } else {
    test.innerHTML = topic.questions.map((item, questionIndex) => `
      <article class="test-question" data-answer="${item.answer}">
        <h3>${questionIndex + 1}. ${item.q}</h3>
        <div class="test-options">
          ${item.options.map((option, optionIndex) => `
            <label class="test-option">
              <input type="radio" name="question-${questionIndex}" value="${optionIndex}">
              <span>${option}</span>
            </label>`).join("")}
        </div>
      </article>`).join("") + `
      <div class="test-footer">
        <span class="test-score" id="testScore">Жауап беріп, нәтижені тексеріңіз</span>
        <button class="test-submit" type="button" id="testSubmit">Нәтиже</button>
      </div>`;
    document.querySelector("#testSubmit").addEventListener("click", checkTest);
  }
}

function checkTest() {
  let score = 0;
  let answered = 0;
  document.querySelectorAll(".test-question").forEach((question) => {
    const answer = Number(question.dataset.answer);
    const selected = question.querySelector("input:checked");
    question.querySelectorAll(".test-option").forEach((option) => option.classList.remove("correct", "wrong"));
    if (selected) {
      answered++;
      const selectedIndex = Number(selected.value);
      const selectedOption = selected.closest(".test-option");
      if (selectedIndex === answer) {
        score++;
        selectedOption.classList.add("correct");
      } else {
        selectedOption.classList.add("wrong");
        question.querySelectorAll(".test-option")[answer].classList.add("correct");
      }
    }
  });
  document.querySelector("#testScore").textContent = `${answered} сұраққа жауап берілді · Нәтиже: ${score}/${document.querySelectorAll(".test-question").length}`;
}

document.querySelectorAll(".study-tabs button").forEach((button) => {
  button.addEventListener("click", () => showStudyTab(button.dataset.tab));
});
document.querySelector("#studyClose")?.addEventListener("click", () => {
  document.querySelector("#studyModal").classList.remove("open");
});
document.querySelector("#studyModal")?.addEventListener("click", (event) => {
  if (event.target.id === "studyModal") event.currentTarget.classList.remove("open");
});

document.querySelector("#chatForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = document.querySelector("#chatInput");
  const messages = document.querySelector("#drawerMessages");
  const text = input.value.trim();
  if (!text) return;
  askAI(text);
});

function appendChatMessage(text, type) {
  const messages = document.querySelector("#drawerMessages");
  const message = document.createElement("div");
  message.className = `drawer-message ${type}`;
  message.textContent = text;
  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
  return message;
}

function findStudyTopic(query) {
  const normalized = query.toLowerCase();
  for (const [subject, topics] of Object.entries(studyLibrary)) {
    if (normalized.includes(subject.toLowerCase()) ||
        (subject === "Бағдарламалау" && /python|код|цикл|функция|айнымалы/.test(normalized)) ||
        (subject === "Жоғары математика" && /туынды|интеграл|теңдеу|математ/.test(normalized)) ||
        (subject === "Экономика" && /эконом|сұраныс|ұсыныс|жіө|жұмыссыздық|инфляция/.test(normalized)) ||
        (subject === "Физика" && /физик|кинематика|динамика|энергия|күш|қуат/.test(normalized))) {
      const topic = topics.find((item) =>
        normalized.includes(item.title.toLowerCase()) ||
        normalized.includes(item.subtitle.toLowerCase())
      );
      return { subject, topic: topic || topics[0] };
    }
  }
  return null;
}

function createAIResponse(query) {
  const normalized = query.toLowerCase();
  const found = findStudyTopic(query);

  if (/сәлем|hello|hi|салем/.test(normalized)) {
    return "Сәлем! Мен — QasStudy AI. Сессияға дайындық үшін тақырып, формула немесе тест сұрағын жазуға болады.";
  }
  if (/жоспар|дайындал|күн|неше күн/.test(normalized)) {
    return "Сессия жоспарын 3 кезеңге бөлейік:\n1) 20 минут теорияны оқу;\n2) 30 минут тест шешу;\n3) 10 минут қателерді талдау.\nКүн сайын жаңа тақырып пен кемінде 10 тест сұрағына жауап бер.";
  }
  if (/тест|quiz|тапсырма/.test(normalized)) {
    if (found?.topic?.questions?.length) {
      const question = found.topic.questions[0];
      return `Тест сұрағы (${found.subject}):\n${question.q}\n${question.options.map((item, index) => `${index + 1}) ${item}`).join("\n")}\nЖауабы: ${question.answer + 1}-нұсқа`;
    }
    return "Қай пәннен тест керек: Жоғары математика, Бағдарламалау, Экономика немесе Физика?";
  }
  if (found) {
    const temp = document.createElement("div");
    temp.innerHTML = found.topic.theory;
    const theoryText = temp.textContent.replace(/\s+/g, " ").trim();
    if (/мысал|есеп|қалай шеш/.test(normalized)) {
      return `${found.topic.title} мысалы:\n1) Берілген формуланы анықта;\n2) Белгілі мәндерді орнына қой;\n3) Санды ықшамда;\n4) Жауапты тексер.\nБұл тақырып бойынша негізгі ереже: ${theoryText}`;
    }
    return `${found.subject} — ${found.topic.title}\n${theoryText}`;
  }
  if (/формула|ереже/.test(normalized)) {
    return "Формуланы толық түсіну үшін мәндерді категорияға бөліп жаз: берілгендер, ізделінді, қолданылатын ереже және жауап. Пән атауын немесе нақты формуланы жазсаңыз, нақты түсіндіремін.";
  }
  return "Сұрағыңызды нақтырақ жазыңыз: пән атауын, тақырыпты немесе нені түсінбегеніңізді көрсетсеңіз жақсы. Мысалы: «Интеграл мысалымен түсіндір», «Python циклі» немесе «Экономика тесті».";
}

window.askAI = function (query) {
  const input = document.querySelector("#chatInput");
  if (input) input.value = "";
  appendChatMessage(query, "user");
  const typing = appendChatMessage("•••", "bot typing");
  setTimeout(() => {
    typing.remove();
    appendChatMessage(createAIResponse(query), "bot");
  }, 550);
};

document.querySelectorAll("#aiSuggestions button").forEach((button) => {
  button.addEventListener("click", () => window.askAI(button.dataset.prompt));
});

const authModal = document.querySelector("#authModal");
const authForm = document.querySelector("#authForm");
const registerFields = document.querySelector("#registerFields");
const authSubmit = document.querySelector("#authSubmit");
const authLead = document.querySelector("#authLead");
const profileSummary = document.querySelector("#profileSummary");
const logoutBtn = document.querySelector("#logoutBtn");
let authMode = "login";
const API_URL = window.location.protocol.startsWith("http")
  ? window.location.origin
  : "http://127.0.0.1:4174";

function getCachedUser() {
  try {
    return JSON.parse(localStorage.getItem("qas_profile") || "null");
  } catch (_) {
    return null;
  }
}

function getCurrentUser() {
  return localStorage.getItem("qas_token") ? getCachedUser() : null;
}

async function apiRequest(path, options = {}) {
  const isGitHubPages = window.location.hostname.endsWith("github.io");
  if (isGitHubPages) {
    const method = (options.method || "GET").toUpper();
    let body = {};
    try {
      body = options.body ? JSON.parse(options.body) : {};
    } catch (_) {
      body = {};
    }

    if (method === "POST" && path === "/api/register") {
      const users = JSON.parse(localStorage.getItem("qas_github_users") || "{}");
      const email = String(body.email || "").trim().toLower();
      if (!email || !body.fullName || !body.university || !body.specialty || !body.password) {
        throw new Error("Барлық деректерді толтырыңыз");
      }
      if (String(body.password).length < 6) throw new Error("Құпия сөз кемінде 6 таңба болуы керек");
      if (users[email]) throw new Error("Бұл email тіркелген");
      const token = "pilot-" + Math.random().toString(36).slice(2);
      users[email] = {
        email,
        fullName: body.fullName,
        university: body.university,
        specialty: body.specialty,
        password: body.password,
        results: []
      };
      localStorage.setItem("qas_github_users", JSON.stringify(users));
      localStorage.setItem("qas_profile", JSON.stringify(users[email]));
      localStorage.setItem("qas_token", token);
      return { token, user: users[email] };
    }

    if (method === "POST" && path === "/api/login") {
      const users = JSON.parse(localStorage.getItem("qas_github_users") || "{}");
      const email = String(body.email || "").trim().toLower();
      const user = users[email];
      if (!user || user.password !== body.password) throw new Error("Email немесе құпия сөз қате");
      const token = "pilot-" + Math.random().toString(36).slice(2);
      localStorage.setItem("qas_profile", JSON.stringify(user));
      localStorage.setItem("qas_token", token);
      return { token, user };
    }

    if (method === "POST" && path === "/api/results") {
      const profile = getCachedUser();
      if (!profile) throw new Error("Кіру қажет");
      const users = JSON.parse(localStorage.getItem("qas_github_users") || "{}");
      const user = users[profile.email];
      if (!user) throw new Error("Пайдаланушы табылмады");
      user.results = user.results || [];
      user.results.unshift({ ...body, date: new Date().toISOString() });
      users[profile.email] = user;
      localStorage.setItem("qas_github_users", JSON.stringify(users));
      localStorage.setItem("qas_profile", JSON.stringify(user));
      return { ok: true };
    }

    if (method === "GET" && path === "/api/me") {
      const profile = getCachedUser();
      if (!profile) throw new Error("Кіру қажет");
      const users = JSON.parse(localStorage.getItem("qas_github_users") || "{}");
      const user = users[profile.email];
      if (!user) throw new Error("Пайдаланушы табылмады");
      return { user, results: user.results || [] };
    }

    if (method === "GET" && path === "/api/health") return { ok: true };
  }

  const token = localStorage.getItem("qas_token");
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = "Bearer " + token;
  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Сервер қатесі");
  return data;
}

async function saveUserResult(result) {
  if (!getCurrentUser()) return false;
  try {
    await apiRequest("/api/results", {
      method: "POST",
      body: JSON.stringify(result)
    });
    await renderProfile();
    return true;
  } catch (error) {
    showToast(error.message);
    return false;
  }
}

async function renderProfile() {
  const user = getCurrentUser();
  document.querySelectorAll(".auth-tabs").forEach((tabs) => tabs.hidden = Boolean(user));
  registerFields.hidden = true;
  authLead.textContent = user
    ? "Білім алушы профилі және тест нәтижелері"
    : "Тіркеліп, оқу прогресіңіз бен тест нәтижелеріңізді сақтаңыз.";
  authForm.querySelectorAll('input[type="email"], input[type="password"]').forEach((input) => input.hidden = Boolean(user));
  authSubmit.hidden = Boolean(user);
  profileSummary.hidden = !user;
  logoutBtn.hidden = !user;

  if (user) {
    try {
      const data = await apiRequest("/api/me");
      const results = data.results || [];
      const average = results.length
        ? Math.round(results.reduce((sum, item) => sum + item.percent, 0) / results.length)
        : 0;
      profileSummary.innerHTML = `
        <h3>${data.user.fullName}</h3>
        <p><b>ЖОО:</b> ${data.user.university}</p>
        <p><b>Мамандық:</b> ${data.user.specialty}</p>
        <p><b>Орташа нәтиже:</b> ${average}% · <b>Тест саны:</b> ${results.length}</p>
        ${results.slice(0, 8).map((item) => `
          <div class="profile-result">
            <b>${item.percent}%</b> — ${item.correct}/${item.total} дұрыс
            <br><small>${item.level} · ${new Date(item.date).toLocaleDateString("kk-KZ")}</small>
          </div>`).join("")}`;
    } catch (_) {
      profileSummary.innerHTML = `<h3>${user.fullName}</h3><p>Серверге қосылу қатесі</p>`;
    }
  }
}

function openAuth() {
  renderProfile();
  authModal.classList.add("open");
}

function setAuthMode(mode) {
  authMode = mode;
  document.querySelectorAll("[data-auth-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.authTab === mode);
  });
  registerFields.hidden = mode !== "register";
  authLead.textContent = mode === "register"
    ? "Білім алушы деректерін толтырыңыз."
    : "Аккаунтқа кіріп, тест нәтижелеріңізді қараңыз.";
  authSubmit.textContent = mode === "register" ? "Тіркелу" : "Кіру";
}

document.querySelector("#loginBtn")?.addEventListener("click", openAuth);
document.querySelector("#authClose")?.addEventListener("click", () => authModal?.classList.remove("open"));
authModal?.addEventListener("click", (event) => {
  if (event.target === authModal) authModal.classList.remove("open");
});
document.querySelectorAll("[data-auth-tab]").forEach((button) => {
  button.addEventListener("click", () => setAuthMode(button.dataset.authTab));
});

authForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (getCurrentUser()) return;

  const form = new FormData(authForm);
  const email = String(form.get("email") || "").trim().toLowerCase();
  const password = String(form.get("password") || "");
  const fullName = String(form.get("fullName") || "").trim();
  const university = String(form.get("university") || "").trim();
  const specialty = String(form.get("specialty") || "").trim();

  try {
    const data = await apiRequest(authMode === "register" ? "/api/register" : "/api/login", {
      method: "POST",
      body: JSON.stringify(authMode === "register"
        ? { email, password, fullName, university, specialty }
        : { email, password })
    });
    localStorage.setItem("qas_token", data.token);
    localStorage.setItem("qas_profile", JSON.stringify(data.user));
    await renderProfile();
    if (document.querySelector("#loginBtn")) document.querySelector("#loginBtn").textContent = data.user.fullName;
    showToast(authMode === "register" ? "Аккаунт тіркелді" : "Жеке кабинетке кірілді");
  } catch (error) {
    showToast(error.message);
  }
});

logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("qas_token");
  localStorage.removeItem("qas_profile");
  document.querySelector("#loginBtn").textContent = "Кіру";
  setAuthMode("login");
  renderProfile();
  showToast("Аккаунттан шықты");
});

const savedUser = getCurrentUser();
if (savedUser && document.querySelector("#loginBtn")) {
  document.querySelector("#loginBtn").textContent = savedUser.fullName;
}

const pdfInput = document.querySelector("#pdfInput");
const pdfDrop = document.querySelector("#pdfDrop");
const pdfFileName = document.querySelector("#pdfFileName");
const summarizeBtn = document.querySelector("#summarizeBtn");
const copySummaryBtn = document.querySelector("#copySummary");
const summaryStatus = document.querySelector("#summaryStatus");
const summaryTheses = document.querySelector("#summaryTheses");
const summaryTextFallback = document.querySelector("#summaryTextFallback");
let selectedPdf = null;
let generatedSummary = [];

function setSelectedPdf(file) {
  if (!file) return;
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    showToast("Тек PDF форматын жүктеңіз");
    return;
  }
  if (file.size > 20 * 1024 * 1024) {
    showToast("PDF файлы 20 МБ-тан аспауы керек");
    return;
  }
  selectedPdf = file;
  pdfFileName.textContent = file.name;
  summarizeBtn.disabled = false;
  summaryStatus.innerHTML = "<span>Файл дайын. «Негізгі тезистерді шығару» батырмасын басыңыз.</span>";
  summaryTheses.innerHTML = "";
  copySummaryBtn.disabled = true;
}

pdfInput?.addEventListener("change", () => setSelectedPdf(pdfInput.files[0]));

["dragenter", "dragover"].forEach((eventName) => {
  pdfDrop?.addEventListener(eventName, (event) => {
    event.preventDefault();
    pdfDrop.classList.add("dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  pdfDrop?.addEventListener(eventName, (event) => {
    event.preventDefault();
    pdfDrop.classList.remove("dragging");
  });
});

pdfDrop?.addEventListener("drop", (event) => setSelectedPdf(event.dataTransfer.files[0]));

function splitSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .replace(/([.!?])\s+(?=[A-ZӘБВГҒДЕЁЖЗИЙКҚЛМНОӨПРСТУҰҮФХҺЦЧШЩЪЫІЬЭЮЯ])/g, "$1|")
    .split("|")
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 35 && sentence.length <= 520);
}

function summarizeText(text, count = 7) {
  const sentences = splitSentences(text);
  if (!sentences.length) return ["PDF-тен оқылатын мәтін табылмады. Сканерленген PDF болса, алдымен OCR қажет."];

  const stopWords = new Set([
    "және", "немесе", "бір", "бірге", "болып", "болған", "болса", "арқылы", "үшін",
    "арналған", "туралы", "дейін", "сонымен", "сондықтан", "онда", "осы", "ол", "бұл",
    "the", "and", "for", "with", "that", "from", "this", "are", "was", "were"
  ]);
  const frequency = {};
  const words = text.toLowerCase().match(/[a-zA-ZА-Яа-яӘәӨөҚқҒғҰұҮүҺһІіҢң]+/g) || [];
  words.forEach((word) => {
    if (word.length > 3 && !stopWords.has(word)) frequency[word] = (frequency[word] || 0) + 1;
  });

  const ranked = sentences.map((sentence, index) => {
    const sentenceWords = sentence.toLowerCase().match(/[a-zA-ZА-Яа-яӘәӨөҚқҒғҰұҮүҺһІіҢң]+/g) || [];
    let score = sentenceWords.reduce((sum, word) => sum + (frequency[word] || 0), 0);
    score += Math.max(0, 20 - index / Math.max(1, sentences.length) * 20);
    return { sentence, score, index };
  }).sort((a, b) => b.score - a.score);

  const selected = ranked.slice(0, Math.min(count, ranked.length));
  selected.sort((a, b) => a.index - b.index);
  return [...new Set(selected.map((item) => item.sentence))].slice(0, count);
}

summarizeBtn?.addEventListener("click", async () => {
  if (!selectedPdf) return;
  summarizeBtn.disabled = true;
  summaryStatus.className = "summary-status loading";
  summaryStatus.textContent = "PDF талдануда…";
  summaryTheses.innerHTML = "";

  try {
    const pdfjsLib = await import("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs");
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";

    const buffer = await selectedPdf.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
    let fullText = "";
    const pageLimit = Math.min(pdf.numPages, 300);

    for (let pageNumber = 1; pageNumber <= pageLimit; pageNumber++) {
      summaryStatus.textContent = `PDF талдануда… ${pageNumber}/${pageLimit}`;
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      fullText += content.items.map((item) => item.str || "").join(" ") + "\n";
    }

    if (!fullText.trim() && summaryTextFallback?.value.trim()) {
      fullText = summaryTextFallback.value.trim();
    }

    generatedSummary = summarizeText(fullText, 7);
    summaryStatus.className = "summary-status";
    if (generatedSummary.length) summaryStatus.textContent = "";
    summaryTheses.innerHTML = generatedSummary
      .map((thesis) => `<li>${thesis.replace(/[<>]/g, "")}</li>`)
      .join("");
    copySummaryBtn.disabled = false;
    showToast(`${pageLimit} бет талданды`);
  } catch (error) {
    console.error(error);
    summaryStatus.className = "summary-status";
    summaryStatus.textContent = "PDF-ті өңдеу мүмкін болмады. Файл ашық және PDF форматында екенін тексеріңіз.";
    showToast("PDF талдау қатесі");
  } finally {
    summarizeBtn.disabled = false;
  }
});

copySummaryBtn?.addEventListener("click", async () => {
  if (!generatedSummary.length) return;
  const text = generatedSummary.map((item, index) => `${index + 1}. ${item}`).join("\n");
  try {
    await navigator.clipboard.writeText(text);
    showToast("Тезистер көшірілді");
  } catch (_) {
    showToast("Көшіру үшін браузер рұқсаты қажет");
  }
});

const quizSource = document.querySelector("#quizSource");
const quizLevel = document.querySelector("#quizLevel");
const quizCount = document.querySelector("#quizCount");
const generateQuizBtn = document.querySelector("#generateQuizBtn");
const quizQuestions = document.querySelector("#quizQuestions");
const quizTitle = document.querySelector("#quizTitle");
const quizScore = document.querySelector("#quizScore");
const checkQuizBtn = document.querySelector("#checkQuizBtn");
const useSummaryBtn = document.querySelector("#useSummaryBtn");

let activeQuiz = [];

useSummaryBtn?.addEventListener("click", () => {
  if (!generatedSummary.length) {
    showToast("Алдымен Smart Summary арқылы тезистер шығарыңыз");
    document.querySelector("#smart-summary")?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  quizSource.value = generatedSummary.join("\n");
  showToast("Smart Summary тестке қосылды");
});

function getQuizSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .concat(text.includes("\n") ? text.split("\n") : [])
    .map((item) => item.replace(/^\d+\.\s*/, "").trim())
    .filter((item) => item.length >= 25)
    .filter((item, index, array) => array.indexOf(item) === index)
    .slice(0, 30);
}

function shortPhrase(sentence) {
  const words = sentence.split(/\s+/).filter((word) => word.length > 2);
  if (words.length <= 8) return sentence.replace(/[.!?]$/, "");
  return words.slice(0, 8).join(" ") + "…";
}

function makeDistractor(sentence, index, level) {
  const replacements = {
    easy: ["Мәлімет берілмеген", "Керісінше нәтиже білдіреді", "Басқа тақырыпқа жатады"],
    medium: ["Бұл қорытынды тек тікелей дерекпен расталмайды", "Қарама-қарсы ұғым сипатталған", "Тақырыпқа жанама байланыс бар"],
    hard: ["Тек жеке дербес жағдайға қатысты", "Себеп пен нәтиже орындарын ауыстырады", "Шектелген шарттар болмаса жалпыланған"]
  };
  return replacements[level][index % replacements[level].length];
}

function createQuizFromText(text, level, count) {
  const sentences = getQuizSentences(text);
  if (sentences.length < 2) return [];

  const normalizedCount = Math.min(Number(count), sentences.length);
  const selected = sentences.slice(0, normalizedCount);

  return selected.map((sentence, index) => {
    const phrase = shortPhrase(sentence);
    let question;
    if (level === "easy") {
      question = `Келесі тұжырым конспектте берілген бе?`;
    } else if (level === "medium") {
      question = `"${phrase}" ойының негізгі мазмұны қайсысы?`;
    } else {
      question = `Бұл тезиске сай ең дұрыс логикалық қорытынды:`;
    }

    const wrongOptions = [
      makeDistractor(sentence, 0, level),
      makeDistractor(sentence, 1, level),
      makeDistractor(sentence, 2, level)
    ];

    if (level === "easy") {
      wrongOptions[0] = "Бұл тұжырым конспектте жоқ";
      wrongOptions[1] = "Тек қарама-қарсы мағына берілген";
      wrongOptions[2] = "Тақырыптың басқа бөлімінен алынған";
    }

    const options = level === "easy"
      ? ["Иә, конспектте берілген", wrongOptions[0], wrongOptions[1], wrongOptions[2]]
      : [sentence, ...wrongOptions];

    const correctIndex = level === "easy" ? 0 : 0;
    return {
      question: level === "easy" ? `${question}\n«${phrase}»` : question,
      detail: level === "easy" ? `Тұжырым конспекттен дәл алынды: «${sentence}»` : `Дұрыс жауап — конспекттегі бастапқы тезис: «${sentence}»`,
      options,
      correctIndex
    };
  });
}

generateQuizBtn?.addEventListener("click", () => {
  const text = quizSource.value.trim();
  if (text.length < 25) {
    showToast("Конспект немесе тезистер мәтінін енгізіңіз");
    quizSource.focus();
    return;
  }

  const level = quizLevel.value;
  activeQuiz = createQuizFromText(text, level, quizCount.value);
  if (!activeQuiz.length) {
    quizQuestions.innerHTML = "<div class=\"quiz-empty\">Тест жасау үшін кемінде екі толық сөйлем қажет.</div>";
    return;
  }

  const levelName = { easy: "Оңай", medium: "Орташа", hard: "Күрделі" }[level];
  quizTitle.textContent = `${levelName} деңгей · ${activeQuiz.length} сұрақ`;
  quizScore.textContent = "0%";
  checkQuizBtn.disabled = false;

  quizQuestions.innerHTML = activeQuiz.map((item, index) => `
    <article class="quiz-item" data-answer="${item.correctIndex}">
      <h4>${index + 1}. ${item.question}</h4>
      <div class="quiz-options">
        ${item.options.map((option, optionIndex) => `
          <label>
            <input type="radio" name="ai-quiz-${index}" value="${optionIndex}">
            <span>${option}</span>
          </label>`).join("")}
      </div>
      <div class="tutor-explanation">${item.detail}</div>
    </article>`).join("");
});

checkQuizBtn?.addEventListener("click", async () => {
  if (!activeQuiz.length) return;
  let correct = 0;
  let answered = 0;
  document.querySelectorAll(".quiz-item").forEach((item) => {
    const answer = Number(item.dataset.answer);
    const selected = item.querySelector("input:checked");
    item.classList.add("checked");
    item.querySelectorAll(".quiz-options label").forEach((label) => label.classList.remove("correct", "wrong"));
    if (selected) {
      answered++;
      const selectedIndex = Number(selected.value);
      const selectedLabel = selected.closest("label");
      if (selectedIndex === answer) {
        correct++;
        selectedLabel.classList.add("correct");
      } else {
        selectedLabel.classList.add("wrong");
        item.querySelectorAll(".quiz-options label")[answer].classList.add("correct");
      }
    }
  });
  const percent = activeQuiz.length ? Math.round(correct / activeQuiz.length * 100) : 0;
  quizScore.textContent = `${percent}%`;
  if (!getCurrentUser()) {
    openAuth();
    showToast("Нәтижені сақтау үшін кіріңіз немесе тіркеліңіз");
  } else {
    const saved = await saveUserResult({
      percent,
      correct,
      total: activeQuiz.length,
      level: { easy: "Оңай", medium: "Орташа", hard: "Күрделі" }[quizLevel.value]
    });
    if (saved) showToast(`Нәтиже сақталды: ${percent}%`);
  }
  showToast(`${answered}/${activeQuiz.length} сұраққа жауап · ${correct} дұрыс`);
});
