import Logo from "../../assets/images/Logo.png";
import "./navigation.css";
import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <section className="NavigationMainSec">
      <nav>
        <a href="#hero" className="HomeNavLogoAndNameDiv">
          <img src={Logo} alt="" />
          <p className="title">TaskTracker</p>
        </a>
        <div className="HomeNavActualLinkDiv">
          {[
            { link: "How it works", ref: "#howitworks" },
            { link: "My Routine", ref: "#daily" },
            { link: "My Goals", ref: "#personal" },
            { link: "Team Workspace", ref: "#team" },
          ].map((sec) => (
            <a href={sec.ref} key={sec.ref} className="HomeNavMainLinks text">
              {sec.link}
            </a>
          ))}
          <div className="HomeNavLogRegDiv">
            <Link to="/login" className="text">Login</Link>
            <Link to="/register" className="text">Get Started</Link>
          </div>
        </div>
      </nav>
    </section>
  );
}
