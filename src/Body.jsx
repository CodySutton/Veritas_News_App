import { useEffect, useState } from "react";
import "./Body.css";

function Body({ selectedCategory }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchNewsArticles() {
      setLoading(true);
      setError("");

      try {
        const category = selectedCategory || "general";
        const response = await fetch(
          `/api/news?category=${encodeURIComponent(category)}`,
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch news articles");
        }

        setArticles(data.articles || []);
      } catch (error) {
        console.error("Error fetching news articles:", error);
        setError(
          "We couldn't refresh the stories right now. Please try again shortly.",
        );
        setArticles([]);
      } finally {
        setLoading(false);
      }
    }

    fetchNewsArticles();
  }, [selectedCategory]);

  function makeArticleCards() {
    if (loading) {
      return (
        <div className="body-status">
          <h2>Loading fresh stories…</h2>
          <p>Curating the latest headlines for you.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="body-status body-status--empty">
          <h2>Stories are taking a moment</h2>
          <p>{error}</p>
        </div>
      );
    }

    if (!articles.length) {
      return (
        <div className="body-status body-status--empty">
          <h2>No articles available</h2>
          <p>Check back soon for the latest updates.</p>
        </div>
      );
    }

    return articles.map((article, index) => (
      <article className="article-card" key={`${article.title}-${index}`}>
        <div className="article-image-container">
          <img
            className="article-image"
            src={
              article.urlToImage ||
              "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=900&q=80"
            }
            alt={article.title}
          />
        </div>

        <div className="article-content">
          <p className="article-source">{article.source?.name || "Veritas"}</p>
          <h3 className="article-title">{article.title}</h3>
          <p className="article-description">
            {article.description ||
              "Read the full story to explore the details."}
          </p>
        </div>

        <a
          className="article-link"
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Read More
        </a>
      </article>
    ));
  }

  return <section className="body-section">{makeArticleCards()}</section>;
}

export default Body;
