Automatisk bildeoppsett for The Jhumka Luxury

Hva dette gjør

- Skriptet `scripts/rename-images.ps1` tar alle bildefiler (*.jpg, *.jpeg, *.png) i `images/large/`, flytter originalene til `images/large/_backup/` og kopierer inntil 12 av dem tilbake med navnene:
  - `jhumka1.jpg`, `jhumka2.jpg`, ..., `jhumka12.jpg`

Forberedelser (hva du må gjøre)

1. Legg alle produktbildene du vil bruke i `images/large/`. Hvis de allerede ligger der, det er bra.
2. Legg logoen du sendte inn som `images/logo.png` (svart bakgrunn med gulldekor / hinduisk motiv).
3. (Valgfritt) Legg dekorbilder som `images/om-symbol.png` og `images/mandala-border.png` hvis du vil bruke de dekorene.

Hvordan kjøre skriptet (PowerShell på Windows)

1. Åpne PowerShell i prosjektmappen (mappen som inneholder `TheJhumkaLuxury.html`).
2. Kjør skriptet med execution policy bypass (én linje):

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\rename-images.ps1
```

3. Skriptet lager en `_backup`-mappe med originalfilene dine og kopierer/omdøper opp til 12 bilder som `jhumka1.jpg` osv. i `images/large/`.

Etter kjøring

- Åpne `TheJhumkaLuxury.html` i en lokal server (f.eks. `python -m http.server 8000`) og sjekk at produktene vises.
- Hvis du vil at jeg skal gjøre videre (opprette thumbnails, optimalisere bilder, eller lage checkout), svar med hvilken oppgave du ønsker.

Feilsøking

- Hvis skriptet sier at `images/large` ikke finnes: opprett mappen og plasser bildene der.
- Hvis du har flere enn 12 bilder: skriptet bruker de 12 eldste basert på filens LastWriteTime. Endre skriptet om du vil en annen sortering.
