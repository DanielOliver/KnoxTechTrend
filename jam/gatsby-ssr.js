/* eslint-disable react/no-danger */

const React = require('react');
const { renderToString } = require('react-dom/server');
const { JssProvider } = require('react-jss');
const getPageContext = require('./src/getPageContext');
const Layout = require('./src/components/layout');

function replaceRenderer({ bodyComponent, replaceBodyHTMLString, setHeadComponents }) {
  // Get the context of the page to collected side effects.
  // Ternary to support Gatsby@1 and Gatsby@2 at the same time.
  const muiPageContext = getPageContext.default ? getPageContext.default() : getPageContext();

  const bodyHTML = renderToString(
    <JssProvider
      registry={muiPageContext.sheetsRegistry}
      generateClassName={muiPageContext.generateClassName}
    >
      {React.cloneElement(bodyComponent, {
        muiPageContext,
      })}
    </JssProvider>,
  );

  replaceBodyHTMLString(bodyHTML);
  setHeadComponents([
    <style
      type="text/css"
      id="server-side-jss"
      key="server-side-jss"
      dangerouslySetInnerHTML={{ __html: muiPageContext.sheetsRegistry.toString() }}
    />,
  ]);
}

exports.replaceRenderer = replaceRenderer;

exports.wrapPageElement = ({ element, props }) => {
  // props provide same data to Layout as Page element will get
  // including location, data, etc - you don't need to pass it
  return (<Layout {...props}>{element}</Layout>)
}
