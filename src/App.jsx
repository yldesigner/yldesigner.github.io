import { useEffect, useRef, useState } from "react";

const profile = {
  name: "Ling Yin",
  initials: "YL",
  role: "Product & UX Designer",
  location: "Shanghai, China",
  email: "hello@yourdomain.com",
};

const suggestedQuestions = [
  { label: "see my work", prompt: "What project should I see first?" },
  { label: "how do you design?", prompt: "What is your design process?" },
  { label: "what kind of designer?", prompt: "What are your UX skills?" },
  { label: "are you available?", prompt: "Are you available for work?" },
];

const botKnowledge = [
  {
    keywords: ["project", "work", "portfolio", "case study", "guest air", "airline", "flight"],
    answer: "Start with Guest Air Choice. It is an end-to-end mobile service flow that turns three complicated airline-benefit paths into one clear decision model.",
    href: "#work",
    linkLabel: "See the case study",
  },
  {
    keywords: ["process", "design process", "method", "approach", "how do you design", "workflow"],
    answer: "Ling maps the real journey, shapes the decision structure, prototypes the riskiest moments, and then polishes the details that improve clarity and confidence.",
    href: "#process",
    linkLabel: "Explore the process",
  },
  {
    keywords: ["skill", "skills", "designer", "experience", "strength", "specialty", "ux"],
    answer: "Ling is a systems-minded product and UX designer focused on journey mapping, information architecture, interaction design, rapid prototyping, and clear product writing.",
    href: "#about",
    linkLabel: "More about Ling",
  },
  {
    keywords: ["available", "availability", "hire", "hiring", "freelance", "job", "role", "collaborate"],
    answer: "Yes. Ling is open to thoughtful product roles, freelance collaborations, and conversations about useful design.",
    href: "#contact",
    linkLabel: "Get in touch",
  },
  {
    keywords: ["contact", "email", "reach", "talk", "chat", "message"],
    answer: `The best way to reach Ling is by email at ${profile.email}.`,
    href: `mailto:${profile.email}`,
    linkLabel: "Send an email",
  },
  {
    keywords: ["where", "location", "located", "based", "shanghai", "timezone", "remote"],
    answer: "Ling is based in Shanghai, China (UTC+8) and is comfortable collaborating with remote teams.",
    href: "#about",
    linkLabel: "View profile",
  },
  {
    keywords: ["tool", "tools", "figma", "prototype", "prototyping"],
    answer: "The portfolio emphasizes Figma-to-prototype thinking, interaction design, connected user flows, and enough frontend craft to make ideas testable in the browser.",
    href: "#work",
    linkLabel: "See it in practice",
  },
  {
    keywords: ["resume", "cv"],
    answer: "A résumé file is not attached yet. For now, email Ling for the latest CV and role details.",
    href: `mailto:${profile.email}`,
    linkLabel: "Request the résumé",
  },
  {
    keywords: ["hello", "hi", "hey", "你好"],
    answer: "Hello! I can guide you through Ling's projects, skills, design process, location, and availability. What would you like to know?",
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
    answer: "I don't have that detail yet. Try asking about Ling's projects, UX skills, design process, location, availability, or contact information.",
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
  const [caseOpen, setCaseOpen] = useState(false);
  const [botInput, setBotInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi—I'm Ling's portfolio guide. Ask me about projects, skills, process, or availability.",
    },
  ]);
  const replyTimerRef = useRef(null);
  const transcriptRef = useRef(null);

  useEffect(() => () => clearTimeout(replyTimerRef.current), []);

  useEffect(() => {
    const transcript = transcriptRef.current;
    if (transcript) transcript.scrollTop = transcript.scrollHeight;
  }, [messages, isTyping]);

  const askBot = (question) => {
    const cleanQuestion = question.trim();
    if (!cleanQuestion || isTyping) return;

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

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header">
        <a className="brand" href="#top" aria-label={`${profile.name} home`}>{profile.name}</a>
        <nav className="pill-nav" aria-label="Primary navigation">
          <a href="#work">Work</a>
          <a href="#about">About</a>
          <a href="#process">Process</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="ambient ambient-one" />
          <div className="ambient ambient-two" />
          <div className="hero-inner">
            <Reveal className="hero-statement">
              <div className="identity-chip" aria-label="Ling Yin is available">
                <span>{profile.initials}</span><i />
              </div>
              <h1>
                I&apos;m <mark>{profile.name}</mark> — a product &amp; UX designer in Shanghai. I turn complex journeys into <em>clear, confident choices.</em>
              </h1>
            </Reveal>

            <Reveal className="question-chips reveal-delay-1">
              {suggestedQuestions.map((item, index) => (
                <button
                  disabled={isTyping}
                  key={item.label}
                  onClick={() => askBot(item.prompt)}
                  type="button"
                >
                  {item.label} {index === 0 ? <Arrow down /> : null}
                </button>
              ))}
            </Reveal>

            <Reveal className="bot-shell reveal-delay-2">
              <div className="bot-header">
                <span><i /> Portfolio guide</span>
                <small>Demo bot · no data is sent</small>
              </div>
              <div aria-label="Conversation with portfolio guide" className="bot-transcript" ref={transcriptRef} role="log">
                {messages.map((message, index) => (
                  <div className={`bot-message bot-message-${message.role}`} key={`${message.role}-${index}`}>
                    <p>{message.text}</p>
                    {message.href ? <a href={message.href}>{message.linkLabel}<Arrow /></a> : null}
                  </div>
                ))}
                {isTyping ? (
                  <div aria-label="Portfolio guide is typing" className="bot-message bot-message-assistant bot-typing">
                    <span /><span /><span />
                  </div>
                ) : null}
              </div>
              <form className="bot-compose" onSubmit={onBotSubmit}>
                <label className="sr-only" htmlFor="portfolio-question">Ask Ling's portfolio guide a question</label>
                <span className="prompt-mark" aria-hidden="true">›_</span>
                <input
                  autoComplete="off"
                  disabled={isTyping}
                  id="portfolio-question"
                  onChange={(event) => setBotInput(event.target.value)}
                  placeholder="Ask about Ling's work…"
                  type="text"
                  value={botInput}
                />
                <button aria-label="Send question" disabled={!botInput.trim() || isTyping} type="submit"><Arrow /></button>
              </form>
            </Reveal>

            <Reveal className="hero-footnote reveal-delay-3">
              <span>Portfolio · 2026</span>
              <span>{profile.role}</span>
            </Reveal>
          </div>
        </section>

        <section className="work" id="work" aria-labelledby="work-title">
          <div className="work-intro">
            <p className="section-label">Selected work</p>
            <h2 id="work-title">One end-to-end case,<br /><em>three design lenses.</em></h2>
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

        <section className="about" id="about" aria-labelledby="about-title">
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
              <div><p>Shanghai, China</p><span>UTC+8 · Remote friendly</span></div>
            </Reveal>

            <Reveal className="bento-card link-card reveal-delay-3">
              <p className="section-label">Say hello</p>
              <a href={`mailto:${profile.email}`}>{profile.email}<Arrow /></a>
            </Reveal>
          </div>
        </section>

        <section className="process-section" id="process" aria-labelledby="process-title">
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

        <section className="contact" id="contact">
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
        <a href="#top">Back to top <Arrow down /></a>
      </footer>

      <CaseStudyDialog open={caseOpen} onClose={() => setCaseOpen(false)} />
    </>
  );
}

export default App;
