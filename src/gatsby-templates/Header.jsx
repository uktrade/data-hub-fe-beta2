import React from 'react'

const Header = ({ headerLinks = [], appLinks = [] }) => (
  <header
    className="datahub-header js-datahub-header datahub-header--max-width"
    role="banner"
    data-module="header"
  >
    <div className="datahub-header__logo-container">
      <div className="datahub-header__logo">
        <span className="datahub-header__logo__site-name">
          Department for International Trade
        </span>
        <span className="datahub-header__logo__text">Data Hub</span>
        <strong className="datahub-header__logo__tag">beta</strong>
      </div>
      <ul
        id="logo-navigation"
        className="datahub-header__links"
        aria-label="Header links"
      >
        {headerLinks.map(({ href, text, active }) => {
          const className = `datahub-header__links__item__text${
            active && ' datahub-header__links__item__text--active'
          }`
          if (text) {
            return (
              <li className="datahub-header__links__item">
                {href ? (
                  <a className={className} href={href}>
                    {text}
                  </a>
                ) : (
                  <span className={className}>{text}</span>
                )}
              </li>
            )
          } else {
            return ''
          }
        })}
      </ul>
    </div>
    <button
      className="datahub-header__menu-button js-datahub-header-toggle"
      aria-controls="navigation sub-navigation logo-navigation"
      aria-label="Show or hide navigation"
    >
      Menu
    </button>
    <div className="datahub-header__navigation-container">
      <nav
        className="datahub-header__navigation-wrapper"
        aria-labelledby="navigation"
      >
        <ul
          id="navigation"
          className="datahub-header__navigation"
          aria-label="Top Level Navigation"
        >
          {appLinks.map(({ name, active }) => (
            <li className="datahub-header__navigation__item">
              <a
                className={`datahub-header__navigation__item__link${
                  active && ' datahub-header__navigation__item__link--active'
                }`}
                href="{{ item.href }}"
              >
                {name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </header>
)

export default Header
