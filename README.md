# readme voor API
Dit is een schoolproject waar ik mee bezig ga zijn tijdens de minor design and developement in 2025. Het doel voor mij bij dit vak is om gebruik te maken van animatie libraries en kijken hoe die werken en wat ik er mee zou kunnen. Hierom zal ik bijde lenis en gsap gaan gebruiken. Ik zal om het idee simpel te houden een overview van films te maken met een beetje informatie er over en een trailer op een detail pagina. Voor de rest wil ik focussen op de animaties.


## installatie
Als je dit project wilt instaleren zal je npm i moeten gebruiken om alle packages te downloaden en kan je de website starten met npm run dev. Om alles werkend te maken heb je wel een api key nodig die je in zal moeten invullen in een .env file. Deze zul je aan moeten vragen bij tmdb (https://www.themoviedb.org/). 


## week 1
Deze week heb ik weinig gedaan aangezien ik ziek was dus neem dit samen met week 2. 


## week 2
Sinds ik in de eerste week ziek was moest ik snel een plan maken. Hierom koos ik voor iets simpels dat al als een optie werd aangegeven op dlo. Ik koos er voor om te gaan werken met de tmdb dataset en in de stijl te gaan werken die ik erg goed kende, namelijk netflix.  Ik ging in week 2 direct aan de slag met het aanmaken van een werkveld waarin ik kon coderen. Dit ging gelukkig vrij klakkeloos aangezien ik project tech had gedaan en vrij goed kon herinneren hoe dit moest. Na al het opzetten maakte ik een main route aan en ging ik aan de slag met wat onderzoek doen naar mijn dataset. In de dataset zat erg veel maar wat Ik zoiezo wou was graag plaatjes en de naam van de film ophalen en in de index sturen.

Dit deed ik door de links op te halen en een constant genaamd options te schrijven waarin ik een get function in zet en mijn api key zodat ik dat niet aleemaal op te schrijven als ik iets uit de api haal.

<img href='/reasdmeimages/customProperties.png'>

Hiermee haalde ik een aantal films op en renderde ik die op de home page. 

<img href='/reasdmeimages/image1.png'>
<img href='/reasdmeimages/image2.png'>

Hierna ging ik voor het eerste met liquid aan de gang, het duurde even voordat ik wist hoe de syntax in elkaar zat maar uiteindelijk bleek dat vrij simpel te zijn. 

<img href='/reasdmeimages/image3.png'>

Nou tot nu ging het vrij goed maar ik was nog niet begonnen met een detail pagina maken. Dit bleek vrij moeilijk te zijn voor mij en het duurde even om uit te vogellen hoe ik de ID mee moest geven en die moest gebruiken om een nieuwe route aan te maken met dat id. maar uiteindelijk moest ik gewoon niet zo moeilijk nadenken en hetzelfde doen als ik met het plaatje, en de naam had gedaan en gewoon het er in sturen en achter de link plakken. Hierna was het een kwestie van de route aanmaken en wat dingen inladen door elke keer via de id alles op zoeken. Nu had ik aan het eind van week twee een index en detail pagina met hele simpele styling die gebaseerd was op netflix.

In mijn gesprek met syd bespraken wat ik nog meer van plan was. Ze vond het namelijk nog erg simpel en weinig nieuws. Hierom bedacht ik om genre specifieke pagina's te maken en gebruik te maken van lenis en gsap (aangeraden door syd). Hierbij kon ik gebruik maken van lenis om de home pagina op te fleuren met een infinite scroll door lenis en de detail pagina's opmaken met verschillende geanimeerde svg's.


## week 3
De derde week zat vol met verschillende lastige opgaves die ik voor mezelf had geleverd. Ik wou in de derde week infinite scroll systeem maken met scroll animatie, een view animation en een kleine hover animatie om aan te geven welk genre de film is.

### infinite scroll
In week 3 ben ik eerst aan de slag gegaan met het maken van een infinite scroll met lenis. Ik had een codepen van syd gekregen waarop ik het kon baseren. aan het einde had ik een infinite scroll die steeds meer plaatjes inlade als je dichtbij het einde van de pagina kwam. Dit werkte behoorlijk goed maar aan het einde van de week kwam ik er achter dat het nog al wat flaws had. Toen ik het namelijk aan declan liet zien zagen we bijde dat het nog al buggy was en steeds langzamer werkte. Dit was natuurlijk niet wat je wilde maar het was lastig om iets beters te bedenken. Uiteindelijk heb ik het behoorlijk versimpelt en het meer laten lijken op wat syd me de eerste keer liet zien. Wat er gebeurt in deze code is dat zodra je dicht bij het einde kwam dat hij je helemaal naar boven teleporteert. 

Deze code ziet er zo uit:

<code>
  // ✅ Init Lenis with true infinite scroll
  const lenis = new window.Lenis({
    infinite: true,
    smooth: true,
    syncTouch: true,
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  });
</code>


### animatie van de scroll
Nu hadden we een infinite scroll maar ik wou het een stuk interesanter maken dan een aantal plaatjes waar je door heen kan scrollen. Eerst wou ik elke andere rij wat sneller laten bewegen dan de andere. Dit deed ik gewoon met css natuurlijk en kwam er makkelijk uit met dit stukje code:

<code>
    li:nth-child(odd) {
      --scroll-distance: var(--scroll-fast);
      animation-name: scrollByVar;
      animation-timeline: scroll();
      animation-duration: auto;
      animation-fill-mode: both;
   }

   li:nth-child(even) {
      --scroll-distance: var(--scroll-slow);
      animation-name: scrollByVar;
      animation-timeline: scroll();
      animation-duration: auto;
      animation-fill-mode: both;
    }

    @keyframes scrollByVar {
   from {
     transform: translateY(0);
   }
   to {
     transform: translateY(var(--scroll-distance));
   }
 }
</style>

Deze code zorgt ervoor dat de even nummers langzaam naar beneden gaan en de odd li's snel naar beneden gaan met een on scroll animation. Hier had ik nog een animatie toe gevoegd voor de plaatjes zelf. Dit ging op de animation timeline view(). Deze annimatie zorgt ervoor dat het plaatje als die in view komt van een 0.1 scale naar zijn normale grote gaat.  

<style>
      img {
         width: 100%;
         height: auto;
         border-radius: 1%;
         will-change: transform, opacity;
         transition: transform 0.3s ease, opacity 0.3s ease;
         --hue: calc(var(--sibling-index) * 5); 
         

         animation-timeline: view(block 5% 5%);

         animation-name: grow;
         animation-fill-mode: both; 
         animation-duration: 1ms;
         position: relative;

         &:hover {
            box-shadow: 0px 0px 20px oklch(70% 70% var(--hue));
          }
      }
</code>

De combinatie van de 2 scroll animaties zorgt voor een leuke en interesante animatie die de home pagina heel wat op fleurt.


### de cards leuker maken

Nu vond ik dat de home pagina een heel stuk beter was geworden met de annimaties erbij maar vond ik dat de cards nog wel wat op konden fleuren. Ik verwijderde de namen van de films en zorgde dat alleen de plaatjes nog over gaven. Hierna haalde ik de genres op uit de database en stuurde ik die 2 keer door naar de main pagina. een keer als naam en een keer als een nummer. 

Dit ging met deze code: 
<img href='/reasdmeimages/image4.png'>

Dit deed ik om het genre in de html op 2 manieren te gebruiken. Als een class:
<img href='/reasdmeimages/image5.png'>
en een keer voor een sibling-index
<img href='/reasdmeimages/image6.png'>

Dit gebruikte ik om genre specifieke kleuren en iconen toe te voegen. Ik had namelijk in illistrator deze iconen gemaakt en die ging ik gebruiken in de before en after om een hover animatie te maken  voor de cards. De index nummers zou ik gebruiken om een achtergronkleur per genre te maken door die in te vullen bij de oklch. Zo is het uiteindelijk geworden:
<img href='/reasdmeimages/image7.png'>
<img href='/reasdmeimages/image8.png'>
<img href='/reasdmeimages/image9.png'>



### view transistion
Nu ik blij was met mijn main pagina wou ik een leuke transitie animatie maken van de index naar de detail pagina. Dit ging ik doen met gsap. wat ik deed met gsap was de positie van het plaatje waar op ik klikte pakken en een kopie van dat plaatje van daar naar het midden van de pagina brengen. Ik had op de detail pagina het plaatje van de poster in het midden en precies 30 vw van de bovenkant gezet. Dus liet ik het gekopieerde plaatje ook naar die positie brengen. Hierdoor kreeg je een mooie overgang zonder dat je door had dat je van pagina switchte. 

Dit is hoe de code er daarvoor uit ziet: 

<code>
// ================================================
// GSAP Movie Click Animation
// ================================================
document.addEventListener('click', (e) => {
  const link = e.target.closest('.movie-link');
  if (!link) return;

  e.preventDefault();

  const img = link.querySelector('img');
  const url = link.href;

  const rect = img.getBoundingClientRect();
  const aspectRatio = rect.width / rect.height;

  // 🖼️ Clone the image
  const cloneImg = img.cloneNode();
  Object.assign(cloneImg.style, {
    position: 'fixed',
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    zIndex: 9999,
    pointerEvents: 'none',
    margin: 0,
  });
  document.body.appendChild(cloneImg);

  // 🎥 Create a background overlay
  const overlayDiv = document.createElement('div');
  Object.assign(overlayDiv.style, {
    position: 'fixed',
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    backgroundColor: 'var(--Netflix-black)',
    zIndex: 9998,
    pointerEvents: 'none',
  });
  document.body.appendChild(overlayDiv);

  // 📏 Responsive animation target
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  const targetWidth = Math.min(window.innerWidth * 0.3, 400);
  const targetHeight = targetWidth / aspectRatio;
  const targetLeft = (window.innerWidth - targetWidth - scrollbarWidth) / 2;
  const targetTop = window.innerHeight * 0.15;

  // Animate the overlay to full screen
  gsap.to(overlayDiv, {
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    ease: 'power3.inOut',
    duration: 0.8,
  });

  // Animate the image
  gsap.to(cloneImg, {
    top: targetTop,
    left: targetLeft,
    width: targetWidth,
    height: targetHeight,
    ease: 'power3.inOut',
    duration: 0.8,
    onComplete: () => {
      setTimeout(() => {
        window.location.href = url;
      }, 200);
    },
  });
});
// ================================================
// GSAP Movie Click Animation
// ================================================
document.addEventListener('click', (e) => {
  const link = e.target.closest('.movie-link');
  if (!link) return;

  e.preventDefault();

  const img = link.querySelector('img');
  const url = link.href;

  const rect = img.getBoundingClientRect();
  const aspectRatio = rect.width / rect.height;

  // 🖼️ Clone the image
  const cloneImg = img.cloneNode();
  Object.assign(cloneImg.style, {
    position: 'fixed',
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    zIndex: 9999,
    pointerEvents: 'none',
    margin: 0,
  });
  document.body.appendChild(cloneImg);

  // 🎥 Create a background overlay
  const overlayDiv = document.createElement('div');
  Object.assign(overlayDiv.style, {
    position: 'fixed',
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    backgroundColor: 'var(--Netflix-black)',
    zIndex: 9998,
    pointerEvents: 'none',
  });
  document.body.appendChild(overlayDiv);

  // 📏 Responsive animation target
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  const targetWidth = Math.min(window.innerWidth * 0.3, 400);
  const targetHeight = targetWidth / aspectRatio;
  const targetLeft = (window.innerWidth - targetWidth - scrollbarWidth) / 2;
  const targetTop = window.innerHeight * 0.15;

  // Animate the overlay to full screen
  gsap.to(overlayDiv, {
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    ease: 'power3.inOut',
    duration: 0.8,
  });

  // Animate the image
  gsap.to(cloneImg, {
    top: targetTop,
    left: targetLeft,
    width: targetWidth,
    height: targetHeight,
    ease: 'power3.inOut',
    duration: 0.8,
    onComplete: () => {
      setTimeout(() => {
        window.location.href = url;
      }, 200);
    },
  });
});

</code>

Nu had ik alweer een stuk meer dan in week 2 maar ik was nog niet tevreden met hoe de detail pagina's in elkaar zaten. Dit zou ik in week 4 afmaken.


## week 4

In week 4 begon ik met het verbeteren van mijn detail pagina. Hiervoor begon ik alleen niet met coderen maar weer in illistrator. Hier had ik een leuke achtergrond gemaakt voor films in het horror genre. Dit koste me alleen wel 3 uur om voor elkaar te krijgen en moest ik me bedenken dat ik niet alle detail pagina's af had kunnen krijgen. dus hield ik het bij de horror pagina. Dit is de achtergrond geworden:

<img href='./reasdmeimages/image10.png'>

Nu had ik een achtergrond maar ik wou nog een leuke animatie maken met het spookje dat ik voor horror had gemaakt. Dit zou ik nogmaals met gsap gaan doen. Het idee was om het spookje te laten verschijnen uit het graf in het plaatje en dan een stukje rond vliegen om als laatste naast de poster terecht te komen. Dit idee voerde ik uit met de motion paths uit gsap. Hier kon ik coordienaten geven die het spookje zou volgen en met een bepaalde curve daar naar toe zou vliegen. Dit is hoe de code er uit ziet:

<code>
gsap.to(ghost, {
      delay: 1, // Start after the fade-in
      duration: 5,
      ease: 'power1.inOut',
      motionPath: {
        path: [
          { x: 0, y: 0 }, // Start
          { x: window.innerWidth * 0.9, y: 0 }, // Go right
          { x: window.innerWidth * 0.3, y: window.innerHeight * 0.7 }, // Curve down and left
          { x: window.innerWidth * 0, y: window.innerHeight * 0.5 }, // Go left
          { x: window.innerWidth * 0.3, y: window.innerHeight * 0.3 }, // Go right and up
          { x: window.innerWidth * 0.6, y: window.innerHeight * 0.1 }, // Go right and up
          { x: window.innerWidth * 0.6, y: window.innerHeight * 0 } // Go straight up
        ],
        autoRotate: true,
        curviness: 1.5
      }})
</code>

Nu was alles af wat ik af kon maken voor mijn mondeling. Als ik nog meer tijd had was ik de rest van de detail pagina's gaan maken. Hierbij had ik een stuk meer geoefend met animeren. 