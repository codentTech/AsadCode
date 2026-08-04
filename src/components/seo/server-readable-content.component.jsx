/**
 * Early, non-hidden HTML for non-JS crawlers (Claude, GPTBot, etc.).
 * JS browsers add `html.js` and hide this block so the React UI is the visual page.
 * Do not use sr-only / display:none here — many AI tools strip those.
 */
export default function ServerReadableContent({
  children,
  id = "server-readable-content",
}) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `html.js #${id}{display:none!important}`,
        }}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.classList.add("js")`,
        }}
      />
      <div id={id} data-crawlable="true">
        {children}
      </div>
    </>
  );
}
