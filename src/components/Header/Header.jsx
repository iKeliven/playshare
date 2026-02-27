import "./Header.css";
import settings from '/settings.svg'
import notification from '/notification.svg'
import logo from "/logo_white.png";

export default function Header() {
    return (
        <header className="ps-header card-glass flex ai-center jc-between">
          
                <img src={logo} alt="Playshare" className="logo__header" />
            <div className="ps-header__actions gap-16 flex center">
                <button className="ps-header__iconBtn" type="button" title="Configurações">
                    <img src={settings} alt="Configurações" />
                </button>
                <button className="ps-header__iconBtn" type="button" title="Notificações">
                    <img src={notification} alt="Notificações" />
                    <span className="ps-header__dot" />
                </button>
            </div>
        </header>
    );
}