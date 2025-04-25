import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <>
      <header className="header">
        <div className="container">
          <h1 className="nav-logo">Web-programozás 1 Házi feladat - React alkalmazások</h1>
          <a href="/index.html" className="back-to-main">
            ← Főoldalra
          </a>
        </div>
      </header>
      
      <nav className="header">
        <div className="container nav">
          <ul className="nav-links">
            <li><Link to="/" className="nav-link">Kezdőlap</Link></li>
            <li><Link to="/calculator" className="nav-link">Számológép</Link></li>
            <li><Link to="/todo" className="nav-link">Teendők</Link></li>
          </ul>
        </div>
      </nav>
      
      <div className="container">
        <main>
          <Outlet />
        </main>
      </div>
      
      <footer className="p-3 mt-4 text-center">
        <p>Sik Dominik - Q60PVQ</p>
      </footer>
    </>
  );
}

export default Layout;
