import { useState } from "react";
import Header from "./Header.jsx";
import Body from "./Body.jsx";
import Footer from "./Footer.jsx";
import "./App.css";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("general");

  return (
    <>
      <Header
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      <Body selectedCategory={selectedCategory} />
      <Footer />
    </>
  );
}

export default App;
