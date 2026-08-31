# Drop your images here 🐾

Any `.jpg`, `.png`, or `.webp` file placed in this folder gets copied into
`dist/images/` on build. No spaces in filenames, e.g. `capsule.jpg`.

Then in `src/App.tsx`, point the constants at them (relative, no leading slash):

    const CAPSULE_URL = "images/capsule.jpg";
    const IMG_HALL = "images/hall.jpg";
    const IMG_GARDEN = "images/garden.jpg";
    const IMG_SUITCASE = "images/suitcase.jpg";

Keep the `dist/images/` folder next to `dist/index.html` when sharing —
the single-file build does NOT inline images from `public/`.

(Feel free to delete this README; it will otherwise ship into dist too.)
