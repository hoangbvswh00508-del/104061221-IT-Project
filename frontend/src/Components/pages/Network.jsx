import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { width } from "@mui/system";

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Network = () => {
  const chartData = {
    labels: ["24 Mar", "24 Apr", "24 May", "24 Jun", "24 Jul", "24 Aug", "24 Sep", "24 Oct", "24 Nov", "24 Dec"],
    datasets: [
      {
        label: "User Subscribe",
        data: [4000, 3000, 2000, 1500, 4000, 2500, 3000, 2000, 3500, 3000],
        backgroundColor: "#4B7FFB",
        borderRadius: 5,
      },
      {
        label: "User Unsubscribe",
        data: [2000, 1500, 1000, 500, 1500, 1000, 2000, 1500, 2000, 1000],
        backgroundColor: "#1E293B",
        borderRadius: 5,
      },
    ],
  };

  const chartOptions = {
  responsive: true,
  maintainAspectRatio: false, // Để biểu đồ phù hợp chiều cao container
  plugins: {
    legend: {
      display: true,
      position: "top",
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        color: "#E2E8F0",
      },
      beginAtZero: true,
      ticks: {
        stepSize: 1000,
      },
    },
  },
};


  return (
    <div style={styles.container}>
      {/* Summary Cards */}
      <div style={styles.summarySection}>
        <div style={styles.card}>
          <div style={styles.cardIcon}>👤</div>
          <div>
            <h4 style={styles.cardTitle}>Total Visitor This Month</h4>
            <p style={styles.cardNumber}>23,862</p>
            <span style={styles.percentage}>📈 13.5%</span>
          </div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardIcon}>📧</div>
          <div>
            <h4 style={styles.cardTitle}>Newsletter Subscriber</h4>
            <p style={styles.cardNumber}>6,784</p>
            <span style={{ ...styles.percentage, color: "#FF6B6B" }}>📉 13.5%</span>
          </div>
        </div>
        <div style={styles.card}>
          <div style={styles.cardIcon}>📉</div>
          <div>
            <h4 style={styles.cardTitle}>Total Bounce Rate</h4>
            <p style={styles.cardNumber}>1,427</p>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div style={styles.chartSection}>
        <h3 style={styles.chartTitle}>Newsletter Subscribers</h3>
        <div style={styles.legend}>
          <span style={{ color: "#4B7FFB" }}>● User Subscribe</span>
          <span style={{ color: "#1E293B" }}>● User Unsubscribe</span>
        </div>
        <Bar data={chartData} options={chartOptions}/>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "12px auto",
    padding: "20px 20px 50px 20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  summarySection: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px",
  },
  card: {
    display: "flex",
    alignItems: "center",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#F8FAFC",
    width: "30%",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  cardIcon: {
    fontSize: "30px",
    marginRight: "15px",
  },
  cardTitle: {
    fontSize: "14px",
    color: "#64748B",
    marginBottom: "5px",
  },
  cardNumber: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  percentage: {
    fontSize: "14px",
    color: "#22C55E",
  },
  chartSection: {
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#F8FAFC",
    height: "400px", // Giới hạn chiều cao
    width: "100%"
  },
  chartTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  legend: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "10px",
  },
};

export default Network;
