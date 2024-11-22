import React, { useRef, useEffect } from "react";
import Chart from "chart.js/auto";

const Analytics = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // Nếu đã có instance cũ, phá hủy trước khi tạo instance mới
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Tạo instance mới và lưu lại
    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        // Hiển thị 12 tháng trong năm
        labels: [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ],
        datasets: [
          {
            label: "Sales (%)",
            // Dữ liệu giả lập tương ứng với từng tháng
            data: [120, 90, 64, 130, 100, 80, 86, 75, 125, 103, 75, 140],
            borderColor: "#4c84ff",
            tension: 0.4,
            pointBackgroundColor: "#4c84ff",
            fill: {
              target: "origin",
              above: "rgba(76, 132, 255, 0.2)", // màu nền bên dưới đường
            },
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => `${context.raw}%`,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Months", // Tiêu đề trục Ox
            },
          },
          y: {
            title: {
              display: true,
              text: "Sale", // Tiêu đề trục Oy
            },
            min: 0,
            max: 200,
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, []);

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
            <canvas
              ref={chartRef}
              width="800"
              height="400"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
              }}>
            </canvas>
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
    maxWidth: "1100px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Poppins', sans-serif",
  },
  summarySection: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px",
  },
  summaryCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f6fa",
    padding: "20px",
    borderRadius: "10px",
    width: "48%",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  icon: {
    fontSize: "30px",
    marginRight: "15px",
  },
  text: {
    textAlign: "left",
  },
  number: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  salesReport: {
    marginBottom: "30px",
  },
  chart: {
    position: "relative",
    height: "300px",
    backgroundColor: "#eef2f7",
    borderRadius: "10px",
    padding: "20px",
    overflow: "hidden",
  },
  chartContainer: {
    position: "relative",
    height: "100%",
    width: "100%",
  },
  chartCanvas: {
    width: "100%",
    height: "100%",
  },
  dropdown: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
  },
  select: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
};

export default Analytics;
