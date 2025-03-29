import React from 'react';

const FallbackPage: React.FC = () => {
  return (
    <div style={{
      fontFamily: "'Inter', sans-serif",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "2rem",
      background: "#121212",
      color: "#ffffff"
    }}>
      <h1 style={{
        fontSize: "2.5rem",
        marginBottom: "1.5rem",
        background: "linear-gradient(90deg, #6C63FF, #8E24AA)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text"
      }}>
        Prabhmehar Pal Singh Bedi
      </h1>
      
      <h2 style={{
        fontSize: "1.5rem",
        marginBottom: "2rem",
        fontWeight: 500
      }}>
        Generative AI Engineer & ML Enthusiast
      </h2>
      
      <p style={{
        fontSize: "1.125rem",
        maxWidth: "600px",
        marginBottom: "2rem",
        lineHeight: 1.6
      }}>
        I develop advanced AI solutions with a focus on Retrieval-Augmented Generation (RAG) 
        and practical machine learning applications. My full portfolio site is coming soon.
      </p>
      
      <div style={{
        display: "flex",
        gap: "1.5rem",
        marginTop: "1rem"
      }}>
        <a 
          href="https://github.com/prabhmeharbedi" 
          style={{
            color: "#6C63FF",
            textDecoration: "none",
            padding: "0.75rem 1.5rem",
            border: "2px solid #6C63FF",
            borderRadius: "9999px",
            fontWeight: 500,
            transition: "all 0.3s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#6C63FF";
            e.currentTarget.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#6C63FF";
          }}
        >
          GitHub
        </a>
        <a 
          href="https://linkedin.com/in/prabhmeharbedi" 
          style={{
            color: "#6C63FF",
            textDecoration: "none",
            padding: "0.75rem 1.5rem",
            border: "2px solid #6C63FF",
            borderRadius: "9999px",
            fontWeight: 500,
            transition: "all 0.3s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#6C63FF";
            e.currentTarget.style.color = "white";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "#6C63FF";
          }}
        >
          LinkedIn
        </a>
      </div>
      
      <p style={{
        marginTop: "3rem",
        fontSize: "0.875rem",
        color: "rgba(255,255,255,0.6)"
      }}>
        Contact: prabhmehar2509@gmail.com
      </p>
    </div>
  );
};

export default FallbackPage;