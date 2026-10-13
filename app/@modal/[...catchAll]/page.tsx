/**
 * Closes the recipe overlay when a link inside it leads somewhere else (the
 * "From the pantry" plates, the journal stamp in the cooked message). On a
 * client navigation a parallel slot keeps showing what it last matched, so
 * without this the overlay stayed open over /pantry. Any route that is not an
 * intercepted recipe lands here and the slot renders nothing.
 */
export default function ModalCatchAll() {
  return null;
}
