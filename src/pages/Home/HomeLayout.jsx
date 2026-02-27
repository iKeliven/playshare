import Sidebar from "../../components/Sidebar/Sidebar";
import Header from "../../components/Header/Header";
import "./HomeLayout.css";

export default function HomeLayout({ children, right }) {
  return (
    <div className="ps-shell bg-app">
      <Sidebar />

      <div className="ps-shell__content">
        <Header />

        <div className="ps-shell__body">
          <div className="ps-shell__main">{children}</div>
          <div className="ps-shell__right">{right}</div>
        </div>
      </div>
    </div>
  );
}