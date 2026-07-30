# AI Critique — HW04 Automation Testing
## Student: 23127379 | Thái Minh Huy
## Word count target: 200–300 words

---

> **Instructions (from HW04 §10):** Write a paragraph of 200–300 words critiquing the AI. 
> Address: Where did the AI get something wrong, biased, or incomplete? 
> Why did it fail to catch the issue? 
> What principle have you learned about collaborating with AI during this assignment?

---

## AI Critique

*(Draft — fill after completing all three FR automation sessions)*

During HW04, I guided Gemini to generate Playwright automation scripts for three EShop features (FR-06, FR-08, FR-15) using the **AutomationScriptGen** skill. While the AI demonstrated competence in structuring Playwright `describe`/`test` blocks and setting up `beforeEach`/`afterEach` hooks, it exhibited consistent failure patterns that required significant human correction.

**The most critical failure was brittle selector generation.** The AI consistently predicted DOM structures — CSS class names, element hierarchies, and `nth-child` positions — without access to the live, rendered SUT. For example, in FR-06, it generated `page.locator('div.product-container > img')` rather than the semantically stable `page.locator('img[alt]')`. This reveals a fundamental limitation: large language models learn React component patterns from training data but cannot introspect the compiled CSS or DOM of a specific application without browsing it.

**The second notable failure was incomplete assertion coverage.** For FR-06's Add-to-Cart test, the AI only asserted that a toast appeared (`toBeVisible`), missing the more valuable UI assertions: toast message text, cart badge count, and the corresponding line item on the cart page. The AI optimised for "the test passes" rather than "the test catches regression". This bias likely stems from its tendency to generate plausible-looking code rather than adversarially thorough test logic.

**The key principle I learned:** AI is an effective *first-draft* assistant for automation, but human review is non-negotiable. The collaboration model that worked best was: (1) give the AI detailed context (TC steps, expected results, known bugs), (2) review every assertion for strength, (3) inspect every selector against the live SUT, (4) document every correction in the AI Audit log. Treating AI output as production-ready without review would result in a test suite that passes on green-path scenarios but fails to catch real regressions.

---

**Word count:** *(fill — target 200–300)*
