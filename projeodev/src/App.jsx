import { useState, useEffect } from 'react';
import './App.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Table } from 'react-bootstrap';
import IconButton from './components/IconButton';
import { nanoid } from 'nanoid/non-secure';
import JSConfetti from 'js-confetti';
import Fuse from 'fuse.js';

const shops = [
  { id: 1, name: "Migros" },
  { id: 2, name: "Bim" },
  { id: 3, name: "Carrefour" },
  { id: 4, name: "A101" },
];

const categories = [
  { id: 1, name: "Elektronik" },
  { id: 2, name: "Şarküteri" },
  { id: 3, name: "Oyuncak" },
  { id: 4, name: "Fırın" },
];

function App() {
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [selectedShop, setSelectedShop] = useState({ id: "", name: "" });
  const [selectedCategory, setSelectedCategory] = useState({ id: "", name: "" });

  const [filteredShopId, setFilteredShopId] = useState("");
  const [filteredCategoryId, setFilteredCategoryId] = useState("");
  const [filteredStatus, setFilteredStatus] = useState("all");
  const [filteredName, setFilteredName] = useState("");

  const jsConfetti = new JSConfetti();

  const addProduct = () => {
    if (productName && selectedShop.name && selectedCategory.name) {
      const productId = nanoid();
      const newProduct = {
        id: productId,
        name: productName,
        shop: selectedShop.name,
        category: selectedCategory.name,
        isBought: false,
      };

      setProducts([...products, newProduct]);
      setProductName("");
      setSelectedShop({ id: "", name: "" });
      setSelectedCategory({ id: "", name: "" });
    }
  };

  const markAsBought = (productId) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product) =>
        product.id === productId ? { ...product, isBought: !product.isBought } : product
      );

      if (updatedProducts.length > 0 && updatedProducts.every((product) => product.isBought)) {
        alert("Alışveriş Tamamlandı");
        jsConfetti.addConfetti();
      }

      return updatedProducts;
    });
  };

  const deleteProduct = (productId) => {
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
  };

  
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilteredName(filteredName);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [filteredName]);

  
  const filteredProducts = products
    .filter((product) =>
      (filteredShopId === "" || product.shop === shops.find((shop) => shop.id === parseInt(filteredShopId))?.name) &&
      (filteredCategoryId === "" || product.category === categories.find((category) => category.id === parseInt(filteredCategoryId))?.name) &&
      (filteredStatus === "all" ||
        (filteredStatus === "bought" && product.isBought) ||
        (filteredStatus === "notBought" && !product.isBought))
    )
    .filter((product) => {
      if (!filteredName) return true;
      const fuse = new Fuse(products, { keys: ["name"] });
      const results = fuse.search(filteredName);
      return results.some((result) => result.item.id === product.id);
    });

  return (
    <div className="p-5">
      <Form className="d-flex justify-content-center row">
        <div className="col-3">
          <Form.Group controlId="productName">
            <Form.Control
              type="text"
              placeholder="Ürün Adı"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Form.Group>
        </div>
        <div className="col-3">
          <Form.Select
            aria-label="market seçiniz"
            value={selectedShop.id}
            onChange={(e) => {
              const shop = shops.find((shop) => shop.id === parseInt(e.target.value));
              setSelectedShop({ id: shop.id, name: shop.name });
            }}
          >
            <option value="">market seçiniz</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name}
              </option>
            ))}
          </Form.Select>
        </div>
        <div className="col-3">
          <Form.Select
            aria-label="kategori seçiniz"
            value={selectedCategory.id}
            onChange={(e) => {
              const category = categories.find((category) => category.id === parseInt(e.target.value));
              setSelectedCategory({ id: category.id, name: category.name });
            }}
          >
            <option value="">kategori seçiniz</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Select>
        </div>
        <div className="col-1">
          <Button variant="dark" onClick={addProduct}>
            Ekle
          </Button>
        </div>
      </Form>

      <Table striped bordered hover className="mt-5">
        <thead>
          <tr>
            <th>#id</th>
            <th>Ürün Adı</th>
            <th>Market</th>
            <th>Kategori</th>
            <th>Satın Alındı</th>
            <th>Sil</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id} className="align-middle">
              <td>{product.id}</td>
              <td
                onClick={() => markAsBought(product.id)}
                style={{
                  textDecoration: product.isBought ? "line-through" : "none",
                  cursor: "pointer",
                }}
              >
                {product.name}
              </td>
              <td>{product.shop}</td>
              <td>{product.category}</td>
              <td>{product.isBought ? "Evet" : "Hayır"}</td>
              <td>
                <IconButton onClick={() => deleteProduct(product.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Filtre */}
      <div className="mt-4">
        <Form>
          <Form.Group controlId="filteredShopId">
            <Form.Label>Market</Form.Label>
            <Form.Select
              value={filteredShopId}
              onChange={(e) => setFilteredShopId(e.target.value)}
            >
              <option value="">Hepsi</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="filteredCategoryId" className="mt-2">
            <Form.Label>Kategori</Form.Label>
            <Form.Select
              value={filteredCategoryId}
              onChange={(e) => setFilteredCategoryId(e.target.value)}
            >
              <option value="">Hepsi</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="filteredStatus" className="mt-2">
            <Form.Label></Form.Label>
            <Form.Check
              type="radio"
              label="Tümü"
              name="status"
              value="all"
              checked={filteredStatus === "all"}
              onChange={(e) => setFilteredStatus(e.target.value)}
            />
            <Form.Check
              type="radio"
              label="Satın Alınanlar"
              name="status"
              value="bought"
              checked={filteredStatus === "bought"}
              onChange={(e) => setFilteredStatus(e.target.value)}
            />
            <Form.Check
              type="radio"
              label="Satın Alınmayanlar"
              name="status"
              value="notBought"
              checked={filteredStatus === "notBought"}
              onChange={(e) => setFilteredStatus(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="filteredName" className="mt-4">
            <Form.Label>Ürün Adı</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ürün adını girin"
              value={filteredName}
              onChange={(e) => setFilteredName(e.target.value)}
            />
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}

export default App;
