import React from 'react';

const ProductTable = () => {
  const products = [
    { office: '2 mil dong/month', phone: '(225) 555-0118', seller: 'Marvin McKinney', location: 'Quang Ngai', status: 'Sold', image: 'https://raw.githubusercontent.com/vtrung111203/OfficeListKSE/refs/heads/main/office_list_1.jpg' },
    { office: '1.5 mil dong/month', phone: '(205) 555-0100', seller: 'Ronald Richards', location: 'Nghe An', status: 'Unsold', image: 'https://raw.githubusercontent.com/vtrung111203/OfficeListKSE/refs/heads/main/office_list_2.jpg' },
    { office: '2.2 mil dong/month', phone: '(302) 555-0107', seller: 'Floyd Miles', location: 'Ha Tinh', status: 'Unsold', image: 'https://raw.githubusercontent.com/vtrung111203/OfficeListKSE/refs/heads/main/office_list_3.jpg' },
    { office: '1.7 mil dong/month', phone: '(252) 555-0126', seller: 'Jacob Jones', location: 'Nha Trang', status: 'Sold', image: 'https://raw.githubusercontent.com/vtrung111203/OfficeListKSE/refs/heads/main/office_list_4.jpg' },
    { office: '1.9 mil dong/month', phone: '(629) 555-0129', seller: 'Kristin Watson', location: 'Hai Phong', status: 'Sold', image: 'https://raw.githubusercontent.com/vtrung111203/OfficeListKSE/refs/heads/main/office_list_5.jpg' },
    { office: '2.4 mil dong/month', phone: '(406) 555-0120', seller: 'Jane Cooper', location: 'Ho Chi Minh', status: 'Unsold', image: 'https://raw.githubusercontent.com/vtrung111203/OfficeListKSE/refs/heads/main/office_list_6.jpg' },
    { office: '1.6 mil dong/month', phone: '(208) 555-0112', seller: 'Kathryn Murphy', location: 'Ha Noi', status: 'Sold', image: 'https://raw.githubusercontent.com/vtrung111203/OfficeListKSE/refs/heads/main/office_list_7.jpg' },
    { office: '1.8 mil dong/month', phone: '(704) 555-0127', seller: 'Jerome Bell', location: 'Thanh Hoa', status: 'Unsold', image: 'https://raw.githubusercontent.com/vtrung111203/OfficeListKSE/refs/heads/main/office_list_8.jpg' },
  ];

  return (
    <div style={styles.container}>
      {/* Header section */}
      <div style={styles.header}>
        <h2>Product</h2>
        <div style={styles.sortSection}>
          <input type="text" placeholder="Search" style={styles.searchInput} />
          <select style={styles.sortSelect}>
            <option>Newest</option>
            <option>Oldest</option>
          </select>
        </div>
      </div>

      {/* Table section */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Office</th>
              <th style={styles.tableHeader}>Price</th>
              <th style={styles.tableHeader}>Phone Number</th>
              <th style={styles.tableHeader}>Seller</th>
              <th style={styles.tableHeader}>Location</th>
              <th style={styles.tableHeader}>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td 
                  style={{
                    width:"10%"
                  }}
                >
                  <img
                    src={product.image}
                    alt="Product"
                    style={styles.productImage}
                  />
                </td>
                <td style={styles.tableData}>{product.office}</td>
                <td style={styles.tableData}>{product.phone}</td>
                <td style={styles.tableData}>{product.seller}</td>
                <td style={styles.tableData}>{product.location}</td>
                <td style={{ ...styles.tableData, color: product.status === 'Sold' ? 'green' : 'red' }}>
                  {product.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination section */}
      <div style={styles.pagination}>
        <button style={styles.pageButton}>‹</button>
        <button style={styles.pageButton}>1</button>
        <button style={styles.pageButton}>2</button>
        <button style={styles.pageButton}>3</button>
        <button style={styles.pageButton}>›</button>
      </div>
    </div>
  );
};
const styles = {
  container: {
    maxWidth: '1100px',
    margin: '5px auto',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    fontFamily: "'Poppins', sans-serif"
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  sortSection: {
    display: 'flex',
    alignItems: 'center',
  },
  searchInput: {
    padding: '10px',
    marginRight: '20px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  sortSelect: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    textAlign: 'left',
    padding: '12px',
    backgroundColor: '#f4f6fa',
    fontWeight: 'bold',
  },
  tableData: {
    padding: '12px',
    borderBottom: '1px solid #ddd',
  },
  productImage: {
    width: '100px',
    height: '50px',
    borderRadius: '5px',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
  },
  pageButton: {
    padding: '10px',
    margin: '0 5px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
};

export default ProductTable;

