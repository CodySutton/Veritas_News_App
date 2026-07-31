export default async function handler(req, res) {
  const category = req.query.category || "general";
  const apiToken = process.env.NEWS_API_KEY;

  if (!apiToken) {
    return res.status(500).json({ message: "NEWS_API_KEY is not configured" });
  }

  const url = new URL("https://api.thenewsapi.com/v1/news/all");
  url.searchParams.set("api_token", apiToken);
  url.searchParams.set("locale", "us");
  url.searchParams.set("language", "en");
  url.searchParams.set("categories", category);
  url.searchParams.set("limit", "12");

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: data.error?.message || "TheNewsAPI request failed",
      });
    }

    const articles = (data.data || []).map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.image_url,
      source: { name: article.source },
    }));

    return res.status(200).json({ articles });
  } catch (error) {
    console.error("TheNewsAPI request failed:", error);
    return res.status(502).json({ message: "TheNewsAPI request failed" });
  }
}
