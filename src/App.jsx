import { useEffect, useRef, useState } from "react";

const profile = {
  name: "Ling Yin",
  initials: "YL",
  role: "Product & UX Designer",
  location: "Singapore",
  email: "hello@yourdomain.com",
};

const pages = ["work", "about", "process", "contact"];
const pageTitles = {
  work: "Work",
  about: "About",
  process: "Process",
  contact: "Contact",
};

function getActivePage() {
  const page = new URLSearchParams(window.location.search).get("page");
  return pages.includes(page) ? page : "work";
}

const suggestedQuestions = [
  { label: "see my work", prompt: "What project should I see first?" },
  { label: "how do you design?", prompt: "How do you design?" },
  { label: "what kind of designer?", prompt: "What kind of designer are you?" },
  { label: "are you available?", prompt: "Are you available?" },
];

const botKnowledge = [
  {
    keywords: ["project", "work", "portfolio", "case study", "guest air", "airline", "flight"],
    answer: "Start with Guest Air Choice. I turned three complicated airline-benefit paths into one clear decision model, then connected the full mobile journey from search to payment.",
    href: "?page=work",
    linkLabel: "See the case study",
  },
  {
    keywords: ["process", "design process", "method", "approach", "how do you design", "workflow"],
    answer: "I map the real journey, shape the decision model, and prototype the riskiest moments in Figma. Then I build enough of the interaction to test the idea clearly—less handoff ambiguity, faster learning.",
    href: "?page=process",
    linkLabel: "Explore the process",
  },
  {
    keywords: ["skill", "skills", "designer", "experience", "strength", "specialty", "ux"],
    answer: "I'm a systems-minded product and UX designer. I work between service journeys and interface details, using information architecture, interaction design, prototyping, and clear product writing.",
    href: "?page=about",
    linkLabel: "More about Ling",
  },
  {
    keywords: ["available", "availability", "hire", "hiring", "freelance", "job", "role", "collaborate"],
    answer: "Yes—I'm open to thoughtful product roles, freelance collaborations, and conversations about useful design. I'm based in Singapore and comfortable working with remote teams.",
    href: "?page=contact",
    linkLabel: "Get in touch",
  },
  {
    keywords: ["contact", "email", "reach", "talk", "chat", "message"],
    answer: `The best way to reach me is by email at ${profile.email}.`,
    href: `mailto:${profile.email}`,
    linkLabel: "Send an email",
  },
  {
    keywords: ["where", "location", "located", "based", "singapore", "timezone", "remote"],
    answer: "I'm based in Singapore (UTC+8), and I'm comfortable collaborating with remote teams.",
    href: "?page=about",
    linkLabel: "View profile",
  },
  {
    keywords: ["tool", "tools", "figma", "prototype", "prototyping"],
    answer: "I use Figma for flows and interaction design, then add enough frontend craft to make ideas testable in the browser. It helps me find gaps before they become handoff problems.",
    href: "?page=work",
    linkLabel: "See it in practice",
  },
  {
    keywords: ["resume", "cv"],
    answer: "My résumé file isn't attached yet. Email me for the latest CV and role details.",
    href: `mailto:${profile.email}`,
    linkLabel: "Request the résumé",
  },
  {
    keywords: ["hello", "hi", "hey", "你好"],
    answer: "Hi! Ask me about my projects, strengths, design process, location, or availability.",
  },
];

function getBotReply(question) {
  const normalized = question.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff\s]/g, " ");
  let bestMatch = null;
  let bestScore = 0;

  botKnowledge.forEach((entry) => {
    const score = entry.keywords.reduce(
      (total, keyword) => total + (normalized.includes(keyword.toLowerCase()) ? keyword.split(" ").length : 0),
      0,
    );
    if (score > bestScore) {
      bestMatch = entry;
      bestScore = score;
    }
  });

  return bestMatch ?? {
    answer: "I don't have that detail yet. Try asking about my projects, UX skills, design process, location, availability, or contact information.",
  };
}

const caseSlides = [
  {
    id: "guest-air-choice",
    eyebrow: "01 · End-to-end product UX",
    title: "Guest Air Choice",
    description:
      "A high-stakes airline benefit flow redesigned around the decision passengers are actually trying to make—not the system behind it.",
    metric: "03",
    metricLabel: "benefit paths clarified",
    mediaClass: "media-deep",
    images: ["/screens/search-results.png", "/screens/free-flight.png"],
    imageAlts: ["Passenger search results interface", "Free-flight option interface"],
    layout: "phones",
  },
  {
    id: "decision-model",
    eyebrow: "02 · Information architecture",
    title: "Compare without confusion",
    description:
      "Free flight, direct upgrade, or self-booking: each route gets a consistent structure, visible trade-offs, and a predictable next step.",
    metric: "01",
    metricLabel: "decision model across every path",
    mediaClass: "media-sky",
    images: ["/screens/free-flight.png", "/screens/direct-flight.png", "/screens/self-book.png"],
    imageAlts: ["Free-flight path", "Direct-flight path", "Self-booking path"],
    layout: "stack",
  },
  {
    id: "prototype-system",
    eyebrow: "03 · Interaction prototyping",
    title: "From flow to proof",
    description:
      "A connected prototype covers search, comparison, confirmation, completion, and payment—so the experience can be reviewed as a system.",
    metric: "14",
    metricLabel: "connected product screens",
    mediaClass: "media-lilac",
    images: ["/screens/confirm-direct.png", "/screens/done-direct.png", "/screens/payment.png"],
    imageAlts: ["Confirmation interface", "Completion interface", "Payment interface"],
    layout: "triptych",
  },
];

const process = [
  ["01", "Map the real journey", "See the product through the user's goal, handoffs, questions, and moments of hesitation."],
  ["02", "Shape the decision", "Reduce the problem to the information people need, in the order they need it."],
  ["03", "Prototype the risk", "Make uncertain interactions tangible, testable, and easy to discuss with the team."],
  ["04", "Polish with purpose", "Use visual detail and motion to clarify hierarchy, state, and confidence—not to decorate."],
];

function Arrow({ down = false }) {
  return (
    <svg aria-hidden="true" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
      <path
        d={down ? "M12 5v14m0 0 6-6m-6 6-6-6" : "M5 19 19 5m0 0H8m11 0v11"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Reveal({ children, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("is-visible");
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div className={`reveal ${className}`} ref={ref}>{children}</div>;
}

function CaseStudyDialog({ open, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog className="case-dialog" onCancel={onClose} onClose={onClose} ref={dialogRef}>
      <div className="dialog-topline">
        <span>Case study · Guest Air Choice</span>
        <button aria-label="Close case study" className="dialog-close" onClick={onClose} type="button">Close <span>×</span></button>
      </div>
      <div className="dialog-hero">
        <p className="section-label">The challenge</p>
        <h2>Help passengers choose with confidence.</h2>
        <p>
          The existing journey exposed policy and operational complexity before people understood their options. I reframed the flow around a single question: which benefit path best fits this trip?
        </p>
      </div>
      <div className="dialog-meta">
        <div><span>Role</span><strong>Product / UX Designer</strong></div>
        <div><span>Scope</span><strong>Journey mapping, IA, interaction, prototype</strong></div>
        <div><span>Surface</span><strong>Enterprise WeChat · Mobile</strong></div>
      </div>
      <div className="dialog-story">
        <div>
          <p className="section-label">Design response</p>
          <h3>One model, three paths.</h3>
        </div>
        <ol>
          <li><span>01</span><p>Start with passenger context and eligibility before presenting choices.</p></li>
          <li><span>02</span><p>Give every option the same comparison structure and plain-language trade-offs.</p></li>
          <li><span>03</span><p>Use explicit confirmation and completion states to make consequences clear.</p></li>
        </ol>
      </div>
      <div className="dialog-gallery">
        <figure><img src="/screens/home.png" alt="Guest Air Choice home screen" /></figure>
        <figure><img src="/screens/search-results.png" alt="Passenger search results" /></figure>
        <figure><img src="/screens/free-flight.png" alt="Flight benefit comparison" /></figure>
      </div>
    </dialog>
  );
}

function App() {
  const [activePage, setActivePage] = useState(getActivePage);
  const [caseOpen, setCaseOpen] = useState(false);
  const [botInput, setBotInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activePrompt, setActivePrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const replyTimerRef = useRef(null);
  const transcriptRef = useRef(null);

  useEffect(() => () => clearTimeout(replyTimerRef.current), []);

  useEffect(() => {
    const syncPage = () => {
      setActivePage(getActivePage());
      setCaseOpen(false);
      window.scrollTo({ top: 0, behavior: "auto" });
    };

    window.addEventListener("popstate", syncPage);
    return () => window.removeEventListener("popstate", syncPage);
  }, []);

  useEffect(() => {
    document.title = `${pageTitles[activePage]} — ${profile.name}`;
  }, [activePage]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scrollBehavior = prefersReducedMotion ? "auto" : "smooth";

    if (messages.length === 2) {
      window.scrollTo({ top: 0, behavior: scrollBehavior });
      return;
    }
    if (messages.length < 3) return;

    const transcript = transcriptRef.current;
    const latestMessage = transcript?.lastElementChild;
    if (latestMessage) latestMessage.scrollIntoView({ behavior: scrollBehavior, block: "nearest" });
  }, [messages, isTyping]);

  const askBot = (question, promptLabel = "") => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || isTyping) return;

    setActivePrompt(promptLabel);
    setMessages((current) => [...current, { role: "user", text: cleanQuestion }]);
    setBotInput("");
    setIsTyping(true);

    replyTimerRef.current = setTimeout(() => {
      const reply = getBotReply(cleanQuestion);
      setMessages((current) => [
        ...current,
        { role: "assistant", text: reply.answer, href: reply.href, linkLabel: reply.linkLabel },
      ]);
      setIsTyping(false);
    }, 480);
  };

  const onBotSubmit = (event) => {
    event.preventDefault();
    askBot(botInput);
  };

  const navigateToPage = (event, page) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("page", page);
    nextUrl.hash = "";
    window.history.pushState({}, "", nextUrl);
    setActivePage(page);
    setCaseOpen(false);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header">
        <a className="brand" href="?page=work" aria-label={`${profile.name} home`} onClick={(event) => navigateToPage(event, "work")}>{profile.name}</a>
        <nav className="pill-nav" aria-label="Primary navigation">
          {pages.map((page) => (
            <a
              aria-current={activePage === page ? "page" : undefined}
              href={`?page=${page}`}
              key={page}
              onClick={(event) => navigateToPage(event, page)}
            >
              {pageTitles[page]}
            </a>
          ))}
        </nav>
      </header>

      <main className={`page-shell page-${activePage}`} id="main">
        <section className="hero" hidden={activePage !== "work"} id="top">
          <div className="ambient ambient-one" />
          <div className="ambient ambient-two" />
          <div className="hero-inner">
            {messages.length ? (
              <div aria-label="Conversation with Ling's portfolio guide" aria-live="polite" className="conversation-stack" ref={transcriptRef} role="log">
                <div className="chat-row chat-row-assistant chat-intro">
                  <span aria-hidden="true" className="chat-avatar">{profile.initials}</span>
                  <div className="chat-bubble chat-bubble-assistant">
                    <p>I&apos;m {profile.name} — a product &amp; UX designer in Singapore. I turn complex journeys into clear, confident choices.</p>
                  </div>
                </div>
                {messages.map((message, index) => (
                  <div className={`chat-row chat-row-${message.role}`} key={`${message.role}-${index}`}>
                    {message.role === "assistant" ? <span aria-hidden="true" className="chat-avatar">{profile.initials}</span> : null}
                    <div className={`chat-bubble chat-bubble-${message.role}`}>
                      <p>{message.text}</p>
                      {message.href ? <a href={message.href}>{message.linkLabel}<Arrow /></a> : null}
                    </div>
                  </div>
                ))}
                {isTyping ? (
                  <div className="chat-row chat-row-assistant">
                    <span aria-hidden="true" className="chat-avatar">{profile.initials}</span>
                    <div aria-label="Ling's portfolio guide is typing" className="chat-bubble chat-bubble-assistant chat-typing">
                      <span /><span /><span />
                    </div>
                  </div>
                ) : null}
              </div>
            ) : (
              <Reveal className="hero-statement">
                <div className="identity-chip" aria-label="Ling Yin is available">
                  <span>{profile.initials}</span><i />
                </div>
                <h1>
                  I&apos;m <mark>{profile.name}</mark> — a product &amp; UX designer in Singapore. I turn complex journeys into <em>clear, confident choices.</em>
                </h1>
              </Reveal>
            )}

            <Reveal className="question-chips reveal-delay-1">
              {suggestedQuestions.map((item, index) => (
                <button
                  className={activePrompt === item.label ? "is-active" : ""}
                  disabled={isTyping}
                  key={item.label}
                  onClick={() => askBot(item.prompt, item.label)}
                  type="button"
                >
                  {item.label} {index === 0 ? <Arrow down /> : null}
                </button>
              ))}
            </Reveal>

            <Reveal className="bot-shell reveal-delay-2">
              <form className="bot-compose" onSubmit={onBotSubmit}>
                <label className="sr-only" htmlFor="portfolio-question">Ask Ling's portfolio guide a question</label>
                <span className="prompt-mark" aria-hidden="true">›_</span>
                <input
                  autoComplete="off"
                  disabled={isTyping}
                  id="portfolio-question"
                  onChange={(event) => setBotInput(event.target.value)}
                  placeholder={isTyping ? "Ling-bot is thinking…" : "Ask Ling anything…"}
                  type="text"
                  value={botInput}
                />
                <button aria-label="Send question" disabled={!botInput.trim() || isTyping} type="submit"><Arrow /></button>
              </form>
            </Reveal>

            <p className="bot-note">This is a local demo bot—nothing you type is sent or saved. <a href={`mailto:${profile.email}`}>Email Ling</a> for a real conversation.</p>

            <Reveal className="hero-footnote reveal-delay-3">
              <span>Portfolio · 2026</span>
              <span>{profile.role}</span>
            </Reveal>
          </div>
        </section>

        <section className="work" hidden={activePage !== "work"} id="work" aria-labelledby="work-title">
          <div className="work-intro">
            <p className="section-label">Selected work</p>
            <h2 id="work-title">Three main end to end <em>projects</em></h2>
          </div>

          {caseSlides.map((project, index) => (
            <article className="case-slide" id={project.id} key={project.id}>
              <Reveal className="case-copy">
                <p className="section-label">{project.eyebrow}</p>
                <h3>{project.title}</h3>
                <p className="case-description">{project.description}</p>
                <div className="metric"><strong>{project.metric}</strong><span>{project.metricLabel}</span></div>
                <button className="case-button" onClick={() => setCaseOpen(true)} type="button">
                  View case details <span><Arrow /></span>
                </button>
              </Reveal>

              <Reveal className={`case-media ${project.mediaClass} media-${project.layout} reveal-delay-1`}>
                <div className="media-index">0{index + 1} / 03</div>
                {project.images.map((src, imageIndex) => (
                  <div className={`device-shot shot-${imageIndex + 1}`} key={src}>
                    <img src={src} alt={project.imageAlts[imageIndex]} loading="lazy" />
                  </div>
                ))}
              </Reveal>
            </article>
          ))}
        </section>

        <section className="about" hidden={activePage !== "about"} id="about" aria-labelledby="about-title">
          <div className="about-heading">
            <p className="section-label">Beyond the screens</p>
            <h2 id="about-title">A designer who likes the <em>in-between.</em></h2>
          </div>

          <div className="bento-grid">
            <Reveal className="bento-card profile-card">
              <div className="profile-orb"><span>{profile.initials}</span></div>
              <div><p>{profile.name} · {profile.location}</p><span className="availability"><i /> available for conversations</span></div>
            </Reveal>

            <Reveal className="bento-card philosophy-card reveal-delay-1">
              <p className="section-label">My point of view</p>
              <h3>Good UX gives people a useful mental model—then gets out of the way.</h3>
              <p>I work between strategy and interface, translating service complexity into calm product behavior.</p>
            </Reveal>

            <Reveal className="bento-card details-card reveal-delay-2">
              <p className="section-label">What I bring</p>
              <ul>
                <li>Journey &amp; service mapping</li>
                <li>Information architecture</li>
                <li>Interaction design</li>
                <li>Rapid prototyping</li>
              </ul>
            </Reveal>

            <Reveal className="bento-card now-card reveal-delay-1">
              <p className="section-label">Currently curious about</p>
              <div className="interest-cloud"><span>AI-first UX</span><span>Travel systems</span><span>Service design</span><span>Clear writing</span></div>
            </Reveal>

            <Reveal className="bento-card location-card reveal-delay-2">
              <span className="location-ring" aria-hidden="true" />
              <div><p>Singapore</p><span>UTC+8 · Remote friendly</span></div>
            </Reveal>

            <Reveal className="bento-card link-card reveal-delay-3">
              <p className="section-label">Say hello</p>
              <a href={`mailto:${profile.email}`}>{profile.email}<Arrow /></a>
            </Reveal>
          </div>
        </section>

        <section className="process-section" hidden={activePage !== "process"} id="process" aria-labelledby="process-title">
          <div className="process-heading">
            <p className="section-label">How I work</p>
            <h2 id="process-title">Structure first.<br /><em>Then make it feel natural.</em></h2>
          </div>
          <div className="process-list">
            {process.map(([number, title, description]) => (
              <Reveal className="process-row" key={number}>
                <span>{number}</span><h3>{title}</h3><p>{description}</p><Arrow />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="contact" hidden={activePage !== "contact"} id="contact">
          <div className="contact-glow" />
          <div className="contact-inner">
            <p className="section-label">Have a useful problem?</p>
            <h2>Let&apos;s make it<br /><em>feel obvious.</em></h2>
            <p>I&apos;m open to product roles, design collaborations, and thoughtful conversations.</p>
            <a className="contact-link" href={`mailto:${profile.email}`}>{profile.email}<span><Arrow /></span></a>
          </div>
        </section>
      </main>

      <footer>
        <span>© 2026 {profile.name}</span>
        <span>Designed and built with care</span>
        <a href="#main">Back to top <Arrow down /></a>
      </footer>

      <CaseStudyDialog open={caseOpen} onClose={() => setCaseOpen(false)} />
    </>
  );
}

export default App;
