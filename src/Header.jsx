import "./Header.css";

const categories = [
  { label: "General", value: "general" },
  { label: "Health", value: "health" },
  { label: "Business", value: "business" },
  { label: "Science", value: "science" },
  { label: "Technology", value: "tech" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Sports", value: "sports" },
];

function Header({ selectedCategory, onSelectCategory }) {
  const formattedDate = new Date().toLocaleDateString("en-UK", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section className="header-section">
      <div className="header-shell">
        <header className="header">
          <div className="brand-block">
            <p className="eyebrow">Daily briefing</p>
            <h1 className="app-title">Veritas</h1>
            <p className="tagline">
              Trusted stories, clear context, and a calmer way to stay informed.
            </p>
          </div>

          <div className="date-pill" aria-label="Current date">
            {formattedDate}
          </div>
        </header>

        <nav className="nav" aria-label="News categories">
          {categories.map((category) => {
            const isActive = selectedCategory === category.value;

            return (
              <button
                key={category.value}
                type="button"
                className={`nav-buttons${isActive ? " active" : ""}`}
                onClick={() => onSelectCategory(category.value)}
                aria-pressed={isActive}
              >
                {category.label}
              </button>
            );
          })}
        </nav>
      </div>
    </section>
  );
}

export default Header;
