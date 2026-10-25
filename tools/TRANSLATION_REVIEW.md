# English translation review, 2026-10-25

## Scope

Fresh semantic review of all 24 English HTML pages against their Chinese
counterparts, plus English footer/navigation and dynamic comparison, download
and form text in app.js and utility-pages.js. Chinese is the reference, not the
historical English generator. Downloadable PDF contents were not retranslated.
The user-approved English homepage hero wording remains unchanged.

## Corrections

- Restored material information omitted from English product descriptions,
  including residual ice percentages, operation conditions and relevant times.
  Retained numerical temperature ranges, dimensions and product model names.
- Removed extra category-card capabilities not stated in the corresponding
  Chinese card, such as traceability in the MobiThaw teaser and process-governance
  language in the ThawLINE Pro teaser.
- Aligned category introductions and product teasers with their Chinese
  counterparts, including multi-probe sensing, dry ice transport and uniform
  temperature management. Restored the scope of the comparison-page introduction.
- Corrected dynamic comparison text: compatible tube containers, two-level access,
  real-time alarms, energy efficiency and no auxiliary materials required.
- Used low-temperature handling in prose, with compact Cold Handling navigation,
  instead of the unnatural literal phrase Cold Operation. URLs are unchanged.
- Kept ozone disinfection distinct from validated sterilization and controlled
  cooling distinct from an actively programmable freezer. No certifications or
  regulatory standards were added in translation.
- Made the repair-service heading, service acknowledgement and address order
  consistent with Chinese; polished company/product-range wording.

## Intentional differences

English uses international sales contact +86 19975273716 and
khaleesi@kemesser.com. Chinese uses the previously approved domestic contacts.
These are established business choices, not translation errors. Form delivery
addresses, consent behavior, video playback and asset loading remain unchanged.

## Chinese source questions

The following cannot be resolved reliably by translation alone:

- ThawWaker's two export methods: the Chinese body describes Bluetooth printing
  but does not identify the second method. Do not invent USB, SD or PC export.
- ThawWaker's intelligent volume adaptation: its Chinese body describes manual
  residual-ice parameter adjustment. Do not invent automatic volume detection.
- Password-period descriptions duplicate role-management text. Do not add an
  expiry interval, password complexity rule or forced-change behavior absent
  from Chinese.
- The measurement basis for the recommended 5-15% residual ice is not specified;
  do not infer whether it means mass, volume or a visual estimate.
- MobiThaw's Chinese touchscreen description mentions a measurement function
  without identifying what is measured. Do not invent a dose/volume readout.

These feature headings and the source-supported information are retained. Their
technical descriptions require confirmation from the product owner in Chinese
first, followed by synchronized translation.

Translation review is not independent verification of product performance claims
such as disinfection efficacy, cell viability or cold-contact safety. Those
claims require manufacturer evidence; this pass does not certify them.

## Verification

Final tools/audit-site.cjs run passed all 146 page/viewport combinations, with no
reported containment, missing-resource, runtime or structural-parity errors.
Language switching, product selection, forms and video tests passed. Shared
scripts passed node --check and git diff --check passed. A narrow-screen screenshot
of the expanded ThawWaker feature text was also inspected. Raw local evidence:
.vite/audit-translation-acceptance.txt and .vite/audit/translation-thawwaker-390.png.
Chinese HTML changes were checked against Git: only the shared cache version
changed. No Chinese product wording, images, videos or styles were changed.
