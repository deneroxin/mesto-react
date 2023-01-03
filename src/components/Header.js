import headerLogo from '../blocks/header/__logo/header__logo_color_white.svg';

export default function Header() {
  return (
    <header className="header">
      <img className="header__logo"
        src={headerLogo}
        alt="лого" />
    </header>
  );
}
