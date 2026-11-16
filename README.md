# Puddle Pals

**Rain protection that clips on.**

Puddle Pals is a collectible Texas bag charm that unfolds into a rain poncho. Five characters (the longhorn, the armadillo, the bluebonnet, the mockingbird and the crawfish) clip onto a bag like any charm, and the poncho is already there when the sky opens. Each pal also works as a gift.

This repository is the website for Puddle Pals, built for the Women in Entrepreneurship final project at the University of Houston (Fall 2026). It is a concept store: the site looks and works like a real shop, but no payments are taken.

## Mission

Puddle Pals makes rainy days easier to love. Our collectible Texas charms clip onto your bag and unfold into a poncho when the sky opens, so you stay dry and keep your style.

## What is on the site

- A hero with the five pals and the rain reveal
- The five characters, each with product photos and packaging you can swipe through
- A trio picker (choose any three pals) and a full set of all five
- A gift packaging option
- A gallery of lifestyle photos showing the pals on campus, at festivals and in the city
- How it works, the mission, and a short FAQ
- A working cart drawer that shows what a customer would buy

## Prices on the site

Single pal $16, trio $42, full set $64, gift packaging $3 per order. These are planning prices for the class project and can change.

## Brand

| | |
|---|---|
| Colors | Cobalt `#2B3FCF`, burnt orange `#E0652B`, cream `#F4EEE3` |
| Fonts | Fraunces (italic, headlines and wordmark), DM Sans (body) |
| Logo | A cobalt raindrop made of stacked bluebonnet petals with an orange charm ring |

## Tech

Plain HTML, CSS and JavaScript. There is no build step and no dependencies.

```
index.html     the page
styles.css     all styles
app.js         cart, trio picker, sliders and gallery
assets/
  products/    product photos, one per pal
  packaging/   single pal cartons, trio box and full set box
  mocks/       lifestyle photos for the gallery
  logo-*.svg   logo files
```

## Run it locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy on Vercel

1. In Vercel, choose **Add New, Project** and import this repository.
2. Set **Framework Preset** to **Other**.
3. Leave the build command and output directory empty. The site is served from the repository root.
4. Click **Deploy**. Vercel gives the site a free `vercel.app` address, and every push to `main` redeploys it.

## Related files

- Business plan and financial model for the project are kept separately in Google Docs and Google Sheets.
- Product photos, packaging and gallery images are concept artwork made for this class project.

## License

MIT, see [LICENSE](LICENSE).
