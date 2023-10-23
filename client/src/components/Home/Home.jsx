import React from "react";
import Styles from "../../styles/Home.module.css";
import Lottie from "lottie-react";
import Loading from "../../lottie/Loading.json";

const apiUrl = import.meta.env.VITE_API_URL;

function Home() {
  const [products, setProducts] = React.useState([]);
  const [keyword, setKeyword] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // const products = [
  //   {
  //     id: 1,
  //     name: "Apple iPhone 12 Pro Max",
  //     price: "$1,099.00",
  //     image:
  //       "https://m.media-amazon.com/images/I/71XXJC7V8tL._AC_UY218_.jpg",
  //   },
  //   {
  //     id: 2,
  //     name: "Apple iPhone 12 Pro Max",
  //     price: "$1,099.00",
  //     image:
  //       "https://m.media-amazon.com/images/I/71XXJC7V8tL._AC_UY218_.jpg",
  //   }
  // ]

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (!keyword) return alert("Please enter a keyword");
      const response = await fetch(`${apiUrl}/api/scrape?keyword=${keyword}`);
      const data = await response.json();
      console.log(data);
      setLoading(false);
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (event) => {
    setKeyword(event.target.value);
  };

  const handleSpeechText = (text) => {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(text);
    synth.speak(utterThis);
  };

  return (
    <div className={Styles.main}>
      <div className={Styles.form}>
        <span>Search Your Product</span>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "50rem",
          }}
        >
          <input
            onChange={handleInputChange}
            type="text"
            placeholder="Search..."
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <div className={Styles.products}>
          {loading ? (
            <div className={Styles.loading}>
              <Lottie animationData={Loading} loop={true} />
            </div>
          ) : products && products.length > 0 ? (
            products.map((product, index) => (
              <div className={Styles.item} key={index}>
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <h4>Price : ${product.price}</h4>
                <button onClick={() => handleSpeechText(product.name)}>
                  Listen
                </button>
              </div>
            ))
          ) : (
            <div className={Styles.empty}>
              <h3>No Products Found</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
