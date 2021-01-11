import React from 'react'
import { Helmet } from 'react-helmet-async'

import TabNav from '../client/components/TabNav'

import Header from './Header'

const BaseTemplate = ({
  id,
  title,
  description = '',
  children,
  assetPath = process.env.GATSBY_ASSETS_BASE_URL,
}) => (
  <>
    <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:locale" content="en_GB" />
      <meta name="theme-color" content="#0b0c0c" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />

      <link
        rel="shortcut icon"
        sizes="16x16 32x32 48x48"
        href={`${assetPath}/images/favicon.ico`}
        type="image/x-icon"
      />
      <link
        rel="mask-icon"
        href={`${assetPath}/images/govuk-mask-icon.svg`}
        color="#0b0c0c"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`${assetPath}/images/govuk-apple-touch-icon-180x180.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="167x167"
        href={`${assetPath}/images/govuk-apple-touch-icon-167x167.png`}
      />
      <link
        rel="apple-touch-icon"
        sizes="152x152"
        href={`${assetPath}/images/govuk-apple-touch-icon-152x152.png`}
      />
      <link
        rel="apple-touch-icon"
        href={`${assetPath}/images/govuk-apple-touch-icon.png`}
      />

      <link
        href={`${assetPath}/css/styles.css`}
        media="screen, print"
        rel="stylesheet"
      />
    </Helmet>

    <body className="govuk-template__body">
      <nav role="navigation">
        <a href="#main-content" className="govuk-skip-link">
          Skip to main content
        </a>
      </nav>

      <Header />

      <div className="govuk-width-container">
        <main className="govuk-main-wrapper" id="main-content" role="main">
          <div id="investors-profiles-tab">
            <div className="govuk-grid-row">
              <div className="govuk-grid-column-full">
                <TabNav
                  routed={true}
                  selectedIndex="bar"
                  tabs={{
                    projects: { label: 'Projects' },
                    profiles: { label: 'Investor profiles' },
                  }}
                />
              </div>
            </div>

            <div className="govuk-grid-column-full">
              <div id={id}>
                <noscript>
                  Please enable JavaScript in your browser to see the content.
                </noscript>
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>

      <div id="footer"></div>
    </body>
  </>
)

export default BaseTemplate
