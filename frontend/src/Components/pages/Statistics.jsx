import React from "react";

const Analytics = () => {
  return (
    <div style={styles.container}>
      {/* Section for Total User and Total Order */}
      <div style={styles.summarySection}>
        <div style={styles.summaryCard}>
          <div style={styles.icon}>👤</div>
          <div style={styles.text}>
            <h3>Total User</h3>
            <p style={styles.number}>40,689</p>
          </div>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.icon}>📦</div>
          <div style={styles.text}>
            <h3>Total Order</h3>
            <p style={styles.number}>10,293</p>
          </div>
        </div>
      </div>

      {/* Sales Report Section */}
      <div style={styles.salesReport}>
        <h3>Sales Report</h3>
        <div style={styles.chart}>
          <div style={styles.chartContainer}>
            {/* Chèn một hình ảnh vào đây */}
            <img
              src="https://via.placeholder.com/600x300"
              alt="Sales Report"
              style={styles.chartImage}
            />
          </div>
        </div>
      </div>

      {/* Dropdown for selecting month */}
      <div style={styles.dropdown}>
        <select style={styles.select}>
          <option>October</option>
          <option>November</option>
          <option>December</option>
        </select>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  summarySection: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '30px',
  },
  summaryCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f6fa',
    padding: '20px',
    borderRadius: '10px',
    width: '48%',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  icon: {
    fontSize: '30px',
    marginRight: '15px',
  },
  text: {
    textAlign: 'left',
  },
  number: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  salesReport: {
    marginBottom: '30px',
  },
  chart: {
    position: 'relative',
    height: '300px',
    backgroundColor: '#eef2f7',
    borderRadius: '10px',
    padding: '20px',
  },
  chartContainer: {
    position: 'relative',
    height: '100%',
  },
  chartImage: {
    width: '100%',
    height: 'auto',
    borderRadius: '10px',
  },
  dropdown: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '20px',
  },
  select: {
    padding: '10px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  },
};

export default Analytics;
