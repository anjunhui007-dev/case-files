// CASE FILES v0.4.1 atlas crop correction
// Keeps the uploaded 4096x4096 atlas, but uses source regions that actually match each character.
(function(){
  const FILE='atlas-case01-v2-github.png';
  const AW=4096, AH=4096;

  // Source-pixel crops inside the already uploaded atlas.
  // Character mapping:
  // P01 한소영 = woman in black blazer
  // P02 이준석 = young man in black suit
  // P03 서지아 = woman in gray blazer
  // P04 차민규 = middle-aged man in dark work shirt
  // P05 이정훈 = man in suit/tie
  const FIXED_RECTS={
    P01:[940,35,500,700],
    P02:[45,35,430,700],
    P03:[1990,35,430,700],
    P04:[1530,35,440,700],
    P05:[500,35,390,700],

    // Existing scene sheet: office, mailbox, basement, parking.
    S01:[64,896,944,768],
    S02:[1040,896,944,768],
    S03:[2016,896,944,768],
    // app.js currently requests S04 for the crime scene; point S04 at the basement source too.
    S04:[2016,896,944,768],

    C01:[64,1728,608,512], C02:[704,1728,608,512], C03:[1344,1728,608,512],
    C04:[1984,1728,608,512], C05:[2624,1728,608,512], C06:[3264,1728,608,512],
    E01:[64,2304,448,800], E02:[544,2304,448,800], E03:[1024,2304,448,800], E04:[1504,2304,448,800],
    E05:[1984,2304,448,800], E06:[2464,2304,448,800], E07:[2944,2304,448,800], E08:[3424,2304,448,800],
    D01:[64,3168,448,800], D02:[544,3168,448,800], D03:[1024,3168,448,800], D04:[1504,3168,448,800],
    D05:[1984,3168,448,800], D06:[2464,3168,448,800], D07:[2944,3168,448,800], D08:[3424,3168,448,800]
  };

  // Reassign the global function used by all existing views.
  atlasStyle=function(key){
    const r=FIXED_RECTS[key];
    if(!r)return '';
    const [x,y,w,h]=r;
    const bx=(x/(AW-w))*100;
    const by=(y/(AH-h))*100;
    return `background-image:url('${FILE}');background-size:${(AW/w)*100}% ${(AH/h)*100}%;background-position:${bx}% ${by}%;`;
  };
})();
