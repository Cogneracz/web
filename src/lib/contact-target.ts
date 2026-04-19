export const CONTACT_FORM_TARGET_ID = "contact-form";
export const CONTACT_SECTION_TARGET_ID = "contact";

const CONTACT_SCROLL_OPTIONS: ScrollIntoViewOptions = {
  behavior: "smooth",
  block: "start",
};

type ContactTargetDocument = Pick<Document, "getElementById">;

export function scrollToContactForm(doc?: ContactTargetDocument): boolean {
  const targetDocument =
    doc ?? (typeof document !== "undefined" ? document : undefined);

  if (!targetDocument) return false;

  const target =
    targetDocument.getElementById(CONTACT_FORM_TARGET_ID) ??
    targetDocument.getElementById(CONTACT_SECTION_TARGET_ID);

  if (!target) return false;

  target.scrollIntoView(CONTACT_SCROLL_OPTIONS);
  return true;
}
