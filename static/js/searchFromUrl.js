(function () {
  const QUERY_PARAM = "q";
  const INPUT_ID = "search_input_react";

  function getQuery() {
    return new URLSearchParams(window.location.search).get(QUERY_PARAM);
  }

  function getInput() {
    return document.getElementById(INPUT_ID);
  }

  function setInputValue(input, value) {
    const setter = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    )?.set;

    if (setter) {
      setter.call(input, value);
    } else {
      input.value = value;
    }

    input.dispatchEvent(
      new Event("input", {
        bubbles: true,
      })
    );
  }

  function typeText(input, text) {
    let index = 0;

    function typeNext() {
      if (index >= text.length) {
        // Keep focus after typing.
        input.focus();
        return;
      }

      const char = text[index];

      // Keyboard down
      input.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: char,
          code: `Key${char.toUpperCase()}`,
          bubbles: true,
          cancelable: true,
        })
      );

      // Change the actual input value.
      setInputValue(input, input.value + char);

      // Keyboard press
      input.dispatchEvent(
        new KeyboardEvent("keypress", {
          key: char,
          code: `Key${char.toUpperCase()}`,
          bubbles: true,
          cancelable: true,
        })
      );

      // Keyboard up
      input.dispatchEvent(
        new KeyboardEvent("keyup", {
          key: char,
          code: `Key${char.toUpperCase()}`,
          bubbles: true,
        })
      );

      index++;

      // Give docusaurus-lunr-search time to process each character.
      setTimeout(typeNext, 10);
    }

    typeNext();
  }

  function startSearch(query) {
    const input = getInput();

    if (!input) {
      setTimeout(() => startSearch(query), 10);
      return;
    }

    // The plugin disables the input until the Lunr index is ready.
    if (input.disabled) {
      setTimeout(() => startSearch(query), 10);
      return;
    }

    console.log("[URL Search] Lunr search ready");

    // The plugin's own onClick handler calls loadAlgolia().
    // Trigger it first.
    input.click();

    // Focus the search bar.
    input.focus();

    // Wait for the search component to react to focus/click.
    setTimeout(() => {
      // Clear anything currently there.
      setInputValue(input, "");

      // Now type character-by-character.
      typeText(input, query);
    }, 150);
  }

  function init() {
    const query = getQuery();

    if (!query) {
      return;
    }

    console.log("[URL Search] Query:", query);

    startSearch(query);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
