interface OverviewCardsGroupProps {
    overview: {
      cashSales: number;
      totalTransfers: number;
      totalSales: number;
      totalUnits: number;
      totalProfit: number | null;
      barSales: number;
      foodSales: number;
      hotelSales: number;
      gameSales: number;
    //   products: Array<any>; // List of products
    };
  }
  
  const OverviewCardsGroup: React.FC<OverviewCardsGroupProps> = ({ overview }) => {
    return (
      <div>
        <h2>Department Overview</h2>
        <div className="overview-card">
          <h3>Total Sales</h3>
          <p>Total Sales: {overview.totalSales}</p>
          <p>Cash Sales: {overview.cashSales}</p>
          <p>Total Transfers: {overview.totalTransfers}</p>
          <p>Total Units Sold: {overview.totalUnits}</p>
          <p>Total Profit: {overview.totalProfit ?? "N/A"}</p>
        </div>
        <div className="overview-card">
          <h3>Sales by Department</h3>
          <p>Bar Sales: {overview.barSales}</p>
          <p>Food Sales: {overview.foodSales}</p>
          <p>Hotel Sales: {overview.hotelSales}</p>
          <p>Game Sales: {overview.gameSales}</p>
        </div>
  
        {/* <h3>Products Overview</h3>
        {overview.products && overview.products.length > 0 ? (
          overview.products.map((product, index) => (
            <div key={index} className="product-card">
              <h4>{product.name || "Unnamed Product"}</h4>
              <p>Type: {product.type || "N/A"}</p>
              <p>Price: {product.price}</p>
              <p>Stock: {product.stock}</p>
              <p>Sold: {product.sold}</p>
              <p>Profit: {product.profit ?? "N/A"}</p>
              <p>Amount: {product.amount}</p>
            </div>
          ))
        ) : (
          <p>No products available.</p>
        )} */}
      </div>
    );
  };
  
  export default OverviewCardsGroup;
  