import { Outlet, Link } from "react-router-dom";

function Layout() {
  return (
    <>
      <header>
        <h1>Web-programozás 1 Házi feladat</h1>
      </header>
      <nav>
        <ul>
          <li><Link to="/">Kezdőlap</Link></li>
          <li><Link to="/calculator">Számológép</Link></li>
          <li><Link to="/todo">Teendők</Link></li>
        </ul>
      </nav>
      <div className="container">
        <main>
          <Outlet />
        </main>
      </div>
      <footer>
        <p>© 2025 - Web-programozás 1</p>
      </footer>
    </>
  );
}

export default Layout;
