import { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [platform, setPlatform] = useState("");
  const [loading, setLoading] = useState(false); // New loading state

  const validateUrlAndPlatform = (url, platform) => {
    if (!url || !platform) {
      setError("Please provide a video URL and select a platform");
      return false;
    }

    const youtubePattern = /youtube\.com/;
    const tiktokPattern = /tiktok\.com/;

    if (platform === "youtube" && !youtubePattern.test(url)) {
      setError(
        "The URL is not a YouTube link, please check the URL or select TikTok platform."
      );
      return false;
    }

    if (platform === "tiktok" && !tiktokPattern.test(url)) {
      setError(
        "The URL is not a TikTok link, please check the URL or select YouTube platform."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateUrlAndPlatform(url, platform)) {
      return;
    }

    setError(null);
    setResponse(null);
    setLoading(true); // Set loading to true when starting the request

    try {
      const res = await axios.get("http://localhost:5000/scrape", {
        params: { url, platform },
      });
      setResponse(res.data.videoData);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false); // Set loading to false once the request is complete
    }
  };

  const handlePlatformSelect = (selectedPlatform) => {
    setPlatform(selectedPlatform);
    handleSubmit();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Video Metadata Scraper</h1>
      <p style={styles.subtitle}>Enter the video URL and choose a platform</p>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={styles.input}
        placeholder="Enter video URL"
        required
      />
      <div style={styles.buttonContainer}>
        <button
          style={platform === "tiktok" ? styles.buttonActive : styles.button}
          onClick={() => handlePlatformSelect("tiktok")}
        >
          TikTok
        </button>
        <button
          style={platform === "youtube" ? styles.buttonActive : styles.button}
          onClick={() => handlePlatformSelect("youtube")}
        >
          YouTube
        </button>
      </div>
      <button onClick={handleSubmit} style={styles.submitButton}>
        Submit
      </button>
      {loading && <div style={styles.spinner}></div>}{" "}
      {/* Show spinner when loading */}
      {response && (
        <div style={styles.responseContainer}>
          <h2 style={styles.responseTitle}>Scraped Data</h2>
          {response.title && (
            <p>
              <strong>Title:</strong> {response.title}
            </p>
          )}
          {response.views && (
            <p>
              <strong>Views:</strong> {response.views}
            </p>
          )}
          {response.likes && (
            <p>
              <strong>Likes:</strong> {response.likes}
            </p>
          )}
          {response.comments && (
            <p>
              <strong>Comments:</strong> {response.comments}
            </p>
          )}
          {response.shares && (
            <p>
              <strong>Shares:</strong> {response.shares}
            </p>
          )}
          {response.date && (
            <p>
              <strong>Date:</strong> {response.date}
            </p>
          )}
          {response.bookmark && (
            <p>
              <strong>Bookmark:</strong> {response.bookmark}
            </p>
          )}
          {response.channelName && (
            <p>
              <strong>Channel Name:</strong> {response.channelName}
            </p>
          )}
          {response.subscribers && (
            <p>
              <strong>Subscribers:</strong> {response.subscribers}
            </p>
          )}
          {response.description && (
            <p>
              <strong>Description:</strong> {response.description}
            </p>
          )}
          {response.follower && (
            <p>
              <strong>Follower:</strong> {response.follower}
            </p>
          )}
          {response.thumbnail && (
            <div>
              <strong>Thumbnail:</strong>
              <img
                src={response.thumbnail}
                alt="Video Thumbnail"
                style={{
                  maxWidth: "100%",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              />
            </div>
          )}

          <a
            href={response.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.link}
          >
            Watch Video
          </a>
        </div>
      )}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "500px",
    margin: "0 auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    color: "#333",
    fontSize: "24px",
    marginBottom: "10px",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "20px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "20px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
  },
  buttonActive: {
    padding: "10px 20px",
    backgroundColor: "#2E8B57",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
    marginBottom: "20px",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "5px solid rgba(0, 0, 0, 0.1)",
    borderTop: "5px solid #4CAF50",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto 20px",
  },
  responseContainer: {
    backgroundColor: "#eaf4f4",
    padding: "15px",
    borderRadius: "8px",
    marginTop: "20px",
    fontSize: "16px",
    color: "#333",
  },
  responseTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  link: {
    color: "#1E90FF",
    textDecoration: "none",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "10px",
  },
  // Adding CSS for spinner animation
  "@keyframes spin": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
  },
};

export default App;
