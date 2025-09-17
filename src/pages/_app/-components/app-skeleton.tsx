import React, { type ReactNode } from "react";

type AppSkeletonProps = {
  children?: ReactNode;
};

const AppSkeleton: React.FC<AppSkeletonProps> = ({ children }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6fa",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          height: "60px",
          background: "#fff",
          borderBottom: "1px solid #eaeaea",
          display: "flex",
          alignItems: "center",
          padding: "0 24px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>App Name</h1>
      </header>
      <main
        style={{
          flex: 1,
          padding: "24px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </main>
      <footer
        style={{
          height: "40px",
          background: "#fff",
          borderTop: "1px solid #eaeaea",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.9rem",
        }}
      >
        © {new Date().getFullYear()} Company Name
      </footer>
    </div>
  );
};

export default AppSkeleton;
