import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        background: "var(--bg-primary, #0a0f1e)",
        position: "relative",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <Navbar />

        <main
          style={{
            flex: 1,
            padding: "28px 32px",
            overflow: "auto",
            position: "relative",
            zIndex: 1,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}