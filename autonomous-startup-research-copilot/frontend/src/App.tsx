import { type MouseEvent, useMemo, useRef, useState } from 'react'

type ResearchCard = {
  title: string
  description: string
  icon: string
  badge: string
  badgeTone: 'secondary' | 'tertiary'
  tags: string[]
}

const promptChips = [
  'AI-powered vertical farming for urban centers',
  'A decentralised loyalty platform for local coffee shops',
  'Sustainable e-commerce packaging logistics',
]

const researchCards: ResearchCard[] = [
  {
    title: 'Direct-to-Consumer Lab Grown Meat',
    description:
      'Analysis of the regulatory landscape in Singapore vs USA and cost-to-scale metrics for cellular agriculture startups in 2024.',
    icon: 'biotech',
    badge: '84% Validated',
    badgeTone: 'secondary',
    tags: ['DTC', 'AgTech'],
  },
  {
    title: 'Micro-mobility Battery Swapping',
    description:
      'Comparison of network density effects on user retention for electric scooter fleets in Tier-2 European cities.',
    icon: 'smart_assistant',
    badge: 'High Competition',
    badgeTone: 'tertiary',
    tags: ['Mobility', 'Infrastructure'],
  },
  {
    title: 'Web3 Real Estate Fractionalization',
    description:
      'Audit of current DeFi protocols enabling RWA tokenization and their compliance frameworks across EU jurisdictions.',
    icon: 'token',
    badge: 'Niche Opportunity',
    badgeTone: 'secondary',
    tags: ['PropTech', 'Blockchain'],
  },
]

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const chips = useMemo(() => promptChips, [])

  const handleChipClick = (prompt: string) => {
    setSearchQuery(prompt)
    inputRef.current?.focus()
  }

  const handleCardMove = (event: MouseEvent<HTMLElement>) => {
    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`)
    card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`)
  }

  return (
    <div className="dashboard-shell">
      <header className="top-nav">
        <div className="top-nav__brand-group">
          <span className="top-nav__brand">Research Copilot</span>
          <nav className="top-nav__links" aria-label="Primary">
            <a className="is-active" href="#dashboard">
              Dashboard
            </a>
            <a href="#sessions">Active Sessions</a>
            <a href="#history">History</a>
            <a href="#library">Library</a>
          </nav>
        </div>
        <div className="top-nav__actions">
          <button type="button" className="icon-button" aria-label="Notifications">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button type="button" className="icon-button" aria-label="Settings">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <button type="button" className="primary-button">
            New Research
          </button>
        </div>
      </header>

      <aside className="side-nav" aria-label="Workspace navigation">
        <div className="side-nav__identity">
          <div className="side-nav__mark">
            <span className="material-symbols-outlined">psychology</span>
          </div>
          <div>
            <h2 className="side-nav__title">Intelligence</h2>
            <div className="side-nav__status">
              <span className="side-nav__pulse" aria-hidden="true">
                <span />
              </span>
              <p>v2.0 Listening</p>
            </div>
          </div>
        </div>

        <nav className="side-nav__menu" aria-label="Sections">
          <a className="is-active" href="#dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            Dashboard
          </a>
          <a href="#sessions">
            <span className="material-symbols-outlined">temp_preferences_custom</span>
            Active Sessions
          </a>
          <a href="#history">
            <span className="material-symbols-outlined">history</span>
            History
          </a>
          <a href="#library">
            <span className="material-symbols-outlined">folder_special</span>
            Library
          </a>
        </nav>

        <nav className="side-nav__footer" aria-label="Utility">
          <a href="#settings">
            <span className="material-symbols-outlined">settings</span>
            Settings
          </a>
          <a href="#documentation">
            <span className="material-symbols-outlined">menu_book</span>
            Documentation
          </a>
        </nav>
      </aside>

      <main className="content" id="dashboard">
        <div className="content__inner">
          <section className="hero">
            <div className="hero__copy">
              <h1>Accelerate Synthesis.</h1>
              <p>
                Your autonomous research partner for market intelligence,
                competitive analysis, and strategic validation.
              </p>
            </div>

            <form className="search-panel" onSubmit={(event) => event.preventDefault()}>
              <span className="material-symbols-outlined search-panel__icon">search</span>
              <input
                ref={inputRef}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="What startup idea are we researching today?"
                type="text"
              />
              <button type="submit" className="search-panel__action">
                Analyze
              </button>
            </form>

            <div className="prompt-chips" aria-label="Suggested prompts">
              <span className="prompt-chips__label">Try these:</span>
              {chips.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className="chip"
                  onClick={() => handleChipClick(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
          </section>

          <section className="section-block" id="history">
            <div className="section-heading">
              <div>
                <h2>Recent Research</h2>
                <p>Your last few synthesis sessions and findings.</p>
              </div>
              <button type="button" className="text-button">
                View All History
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>

            <div className="research-grid" id="sessions">
              {researchCards.map((card) => (
                <article
                  key={card.title}
                  className="glass-card"
                  onMouseMove={handleCardMove}
                >
                  <div className="glass-card__head">
                    <div className="glass-card__icon">
                      <span className="material-symbols-outlined">{card.icon}</span>
                    </div>
                    <span className={`status-badge status-badge--${card.badgeTone}`}>
                      {card.badge}
                    </span>
                  </div>

                  <h3>{card.title}</h3>
                  <p>{card.description}</p>

                  <div className="glass-card__footer">
                    <div className="tag-row">
                      {card.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button type="button" className="text-button text-button--inline">
                      View Report
                      <span className="material-symbols-outlined">open_in_new</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="showcase" id="library">
            <div className="showcase__glow" aria-hidden="true" />
            <div className="showcase__content">
              <div className="showcase__copy">
                <h2>Connect your sources.</h2>
                <p>
                  Synthesize data from Crunchbase, Pitchbook, Twitter, and custom
                  PDFs in real-time. Our copilot listens to the market signals
                  while you think about the strategy.
                </p>
                <div className="showcase__actions" id="documentation">
                  <button type="button" className="primary-button">
                    Get Started
                  </button>
                  <button type="button" className="secondary-button">
                    Read docs
                  </button>
                </div>
              </div>

              <div className="showcase__visual">
                <img
                  alt="Abstract AI visualization"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvJmGt_lxyIfFwdxCb-WWAcXrtFByqQAWB9g-_30GRV8IGDdbKa0H4hnrtVdRW_-8fwMVLWJ7rvcGEDGq93RfGaf7IkXrblj3hpFs6_bvukVZump0lYgBBvyODCnxcj8WcIDwQGvgK9Em_hh8eN526cqSDpaI8TDfMYAQxmGHi5dIYVqMZovshYbr66F7LAysGXz-65SvSWQQfZ_P2xNg8ATktnrESNPhJM-PQNwxhA5w2pTEtct6LysvA5Mhss0YHIVBUmCuJSW8"
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
