import React, { useEffect, useState } from "react";
import axios from "axios";
import "./notification.css";

const Notification = () => {
  const [newMessages, setNewMessages] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchNewMessages = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          throw new Error("No auth token found");
        }
        const response = await fetch("http://localhost:5000/notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setNewMessages(data);
        setUnreadCount(data.filter(message => !message.is_read).length);
      } catch (error) {
        console.error("Error fetching new messages:", error);
      }
    };

    fetchNewMessages();
  }, []);

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  const navigateToMessages = () => {
    window.location.href = "/messages";
  };

  const markAsSeen = async (id) => {
    console.log("markAsSeen function called for id:", id);
    if (!id) return;

    setLoadingId(id);
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("No auth token found");
      }

      console.log(`Marking notification as seen: ID = ${id}`);
      const response = await axios.put(
        `http://localhost:5000/notifications/${id}/seen`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Notification marked as seen response:", response.data);
      setNewMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== id)
      );

      setUnreadCount((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error marking notification as seen:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="notification-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="fw-bold fs-2">
          Notifications
          {unreadCount > 0 && (
            <span className="badge-unread">{unreadCount}</span>
          )}
        </div>
        <span
          className="navigate-text"
          onClick={navigateToMessages}
        >
          View All
        </span>
      </div>

      {newMessages.length > 0 ? (
        <>
          <div className="fw-bold mb-3">New</div>
          {newMessages.map((message, index) => (
            <div key={index} className="noti-item mb-3">
              <div className="d-flex align-items-center">
                <img
                  src={`http://localhost:5000${message.sender_avatar}`}
                  alt="avatar"
                  className="avatar-img"
                />
                <div style={{ flex: 1 }}>
                  <div className="fw-bold">{message.sender_username}</div>
                  <div className="text-muted">
                    {new Date(message.created_at).toLocaleString()}
                  </div>
                </div>
                <button
                  className="mark-as-seen-btn"
                  onClick={() => markAsSeen(message.id)}
                  disabled={loadingId === message.id || message.is_read}
                >
                  {loadingId === message.id ? "Processing..." : "Mark as Seen"}
                </button>
              </div>
              <div className="mt-2">
                <div className="fw-bold">{message.subject}</div>
                <div>{truncateText(message.body, 100)}</div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="text-muted">No new notifications available.</div>
      )}
    </div>
  );
};

export default Notification;
