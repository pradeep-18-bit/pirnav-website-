import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Search, Trash2, Clock } from "lucide-react";
import "./Admin.css";
import { clearAdminToken, getAdminHeaders, getAdminToken } from "../../services/adminAuth";
import {
  deleteContactMessage,
  getContactMessage,
  getContactMessages,
  getUnreadContactCount,
  markContactMessageRead,
} from "../../services/contactService";
import { getErrorMessage, isUnauthorizedError } from "../../services/apiClient";

const ContactMessages = () => {
  const navigate = useNavigate();
  const token = getAdminToken();
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [deleteMsg, setDeleteMsg] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const deferredSearch = useDeferredValue(search);

  const handleUnauthorized = useCallback(() => {
    clearAdminToken();
    navigate("/admin-login", { replace: true });
  }, [navigate]);

  const getHeaders = useCallback(() => {
    const headers = getAdminHeaders(token);

    if (!headers) {
      navigate("/admin-login", { replace: true });
      return null;
    }

    return headers;
  }, [navigate, token]);

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const headers = getHeaders();
      if (!headers) {
        return;
      }

      const [messageList, unread] = await Promise.all([
        getContactMessages(headers),
        getUnreadContactCount(headers),
      ]);

      setMessages(messageList);
      setUnreadCount(unread);
    } catch (requestError) {
      if (isUnauthorizedError(requestError)) {
        handleUnauthorized();
        return;
      }

      setError(getErrorMessage(requestError, "Unable to load messages."));
    } finally {
      setLoading(false);
    }
  }, [getHeaders, handleUnauthorized]);

  useEffect(() => {
    if (!token) {
      navigate("/admin-login", { replace: true });
      return;
    }

    loadMessages();
  }, [loadMessages, navigate, token]);

  const openMessage = async (messageId) => {
    try {
      setError("");
      const headers = getHeaders();
      if (!headers) {
        return;
      }

      const message = await getContactMessage({ messageId, headers });
      setSelected(message);

      if (message.status === "Unread") {
        await markContactMessageRead({ messageId, headers });
        setMessages((prev) =>
          prev.map((record) =>
            String(record.id) === String(messageId)
              ? { ...record, status: "Read" }
              : record
          )
        );
        setSelected((prev) => (prev ? { ...prev, status: "Read" } : prev));
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (requestError) {
      if (isUnauthorizedError(requestError)) {
        handleUnauthorized();
        return;
      }

      setError(getErrorMessage(requestError, "Unable to open message."));
    }
  };

  const handleDelete = async () => {
    try {
      const headers = getHeaders();
      if (!headers || !deleteMsg) {
        return;
      }

      await deleteContactMessage({
        messageId: deleteMsg.id,
        headers,
      });

      setMessages((prev) =>
        prev.filter((message) => String(message.id) !== String(deleteMsg.id))
      );
      if (deleteMsg.status !== "Read") {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      setDeleteMsg(null);
    } catch (requestError) {
      if (isUnauthorizedError(requestError)) {
        handleUnauthorized();
        return;
      }

      setError(getErrorMessage(requestError, "Unable to delete message."));
    }
  };

  const filteredMessages = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    if (!query) {
      return messages;
    }

    return messages.filter((message) =>
      [message.name, message.email, message.subject]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [deferredSearch, messages]);

  return (
    <div className="messages-wrapper">
      <div className="messages-header">
        <h1>Contact Messages</h1>
        <span className="unread-badge">{unreadCount} unread</span>
      </div>

      <div className="search-box">
        <Search size={16} />
        <input
          placeholder="Search..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {error && <div className="pipeline-feedback is-error">{error}</div>}
      {loading && <p>Loading...</p>}

      <table className="messages-table">
        <thead>
          <tr>
            <th>Sender</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Received</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredMessages.map((message) => (
            <tr key={message.id}>
              <td>
                <strong>{message.name}</strong>
                <br />
                <small>{message.email}</small>
              </td>

              <td>{message.subject}</td>

              <td>
                <span className={`status ${message.status === "Read" ? "read" : "unread"}`}>
                  {message.status === "Read" ? "Read" : "Unread"}
                </span>
              </td>

              <td>
                <Clock size={12} />
                {message.createdDate ? new Date(message.createdDate).toLocaleDateString() : ""}
              </td>

              <td>
                <button onClick={() => openMessage(message.id)}>
                  <Eye size={14} />
                </button>

                <button onClick={() => setDeleteMsg(message)}>
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{selected.subject}</h3>
            <p>
              From: {selected.name} ({selected.email})
            </p>

            <div className="message-box">{selected.message}</div>

            <div className="modal-actions">
              <button onClick={() => setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {deleteMsg && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Message</h3>
            <p>Delete message from {deleteMsg.name}?</p>

            <div className="modal-actions">
              <button onClick={() => setDeleteMsg(null)}>Cancel</button>
              <button className="delete-btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
