import type { AboutUsProps } from "~/locales/en-GB/about";

export const AboutUs = (props: AboutUsProps) => `
# Om oss

Velkommen til **CRMM** – **Cosmic Reach Modifikasjonsstyrar**.
Me er ei lidenskapeleg gruppe som er dedikert til å gjera det så enkelt og praktisk som mogleg å dela og oppdaga nedlastbart innhald til **Cosmic *Reach*. Anten du er ein modifikasjonsutviklar, verdsbyggjar eller berre nokon som elskar å tilpassa opplevinga di, er CRMM her for å gi kreativiteten din ein heim.

---
Sist oppdatert: 29/3/25, 13:27


### Korleis det heile byrja (trur me)

*CRMM byrja i dei tidlegare stadia som ein beskedent **H<sub>2</sub>O**-molekyl drivande gjennom ursuppa og eigentleg berre passa sine eigne saker. Så, av grunnar ingen helt forstår (kanskje kenguruar), hamna han i Australia, der han ved eit uhell utløyste ei mindre røyndomsforvrengjande hending. Ut av det kaoset kom ein enkelt, verdsendrande tanke: «Kva med modifikasjonar … men organisert?». Og akkurat sånn fekk Eatham gneisten som starta det heile. Derfrå gjekk ting overraskande strake vegen (utanom *nokre* serverbrannar i ny og ne og sjølvsagd litt hovudbry).

---

CRMM vart *faktisk* oppretta  **den **10. mars 2024**, fødd ut frå ideen om å skapa ein sentral stad for å dela alt som er laga for Cosmic Reach. Inspirert av plattformer som [Modrinth](https://modrinth.com/), sette me oss føre å byggja noko reinare, raskare og skreddarsydde for vår eigen vesle fellesskap. Og sjølv om me framleis har ein lang veg å gå, og nokre utfordringar undervegs, er me veldig stolte av kor langt me allereie har komme.

### Målet vårt

Vårt mål er enkelt:
Å **styrkja skaparar** og **gjera innhaldsdeling saumlaust**. Frå modifikasjonar og verder til teksturpakkar og skjermskildrarar, så vil me gi innhaldskaperar ein måte å dela dei dei skaper – og brukarar ein måte å ta skapingane i bruk, uanstrengt.

### Møt gruppa

Sjølv om CRMM er eit fellesskapsdrive initiativ, er det nokon kjernepersonar bak det:

* **Abhinav** – *Kodetrollmannen*. Det er han som skaper backend- og frontend-delen av nettstaden. Om noko må fiksast eller utviklast, er det han som får det gjort.
* **Eatham** – *Mannen med ideen*. Hjalp CRMM å komma i gang og har vore der heilt frå starten av.
* **Spicylemon** – *Leiaren, logoutformar, og grammatikkontrollør, når han hugsar det*. Har oversikt over prosjektet og sørgjer for at alt går knirkefritt.
* **CaptainDynamite** – Hjelper til med finansieringa av prosjektet. Har vore der sidan starten.
* **Dounford & Arlojay** – Gav generell hjelp i CRMMs tidlege stadium.
* **Puzzle** – Er i dag moderorganisasjonen og ein sentral del av røtene våre.

Sjølv om mange hjelper til i ny og ne – hovudsakleg via Discord – blir det daglege arbeidet handtert hovudsakleg av Spicylemon og Abhinav, med nokre urter og krydder slungne inn av Eatham.

Og sjølvsagt, **ein stor takk til FinalForEach**, skaparen av *Cosmic Reach*, for å ha utvikla eit så unikt spel og gitt oss denne fantastiske fellesskapen å samlast rundt.

### Korleis det heile heng saman

Me driftar CRMM sjølv og bruker verktøy med open kjeldekode og fellesskapsvennlege løysingar:

Sjølvdrifting:
- **Postgresql** (SQL-database)
- **Meilisearch** (tekstsøkjeleverandør)
- **Valkey** (minnebuffer)
- **Clickhouse DB** for rask og effektiv analysar- 
- **Uptime Kuma** for overvaking

Tredjepartar:
- **Cloudflare** (Proxy for backend)
- **Fastly** for innhaldslevering og mellomlagring

Alt er utvikla for å vera lett, personvernvennleg og med modifiseringsfellesskapen i tankane.

### Fellesskap og bidrag

*CRMM er **open kjeldekode og er driven av fellesskapen** under *GNU *Affero General Public License*.
Brukarar kan hjelpa til med å omsetja nettstaden, foreslå funksjonar, eller (om dei kjenner seg modige) til og med bidra direkte via [GitHub](${props.repoLink}). Det skjer ikkje ofte, men når det skjer, set me stor pris på det.

### Vil du vera med og bidra?
Bli med i Discord-serveren vår [Puzzle HQ](${props.discordInvite}) og si heia. Anten du ønskjer å bidra eller berre henga med andre moddere, er du velkommen der.

### Kva er neste?

Me meiner me er framleis i startfasen, men store ting er i vente. Frå **modereringsverktøy** til **VirusTotal-integrasjon**, forbetra **prosjektrapportering** og meir – me arbeider alltid mot ei større og betre plattform.

Takk til **DEG** for at du er ein del av CRMM-fellesskapen og gjer alt dette mogleg.
Me gler oss til å sjå kva du lagar ;). Lykke til med Cosmic Reaching!
`;
