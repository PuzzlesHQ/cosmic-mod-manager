export interface AboutUsProps {
    discordInvite: string;
    repoLink: string;
}

export const AboutUs = (props: AboutUsProps) => `
# Om oss

Velkommen til **CRMM** – **Cosmic Reach Modifikasjonsbestyrer**.
Vi er en lidenskapelig gruppe som er dedikert til å gjøre det så enkelt og praktisk som mulig å dele og oppdage nedlastbart innhold til *Cosmic Reach*. Enten du er en modifikasjonsutvikler, verdensbygger eller bare noen som elsker å tilpasse opplevelsen din, er CRMM her for å gi kreativiteten din et hjem.

---
Sist oppdatert: 29/3/25, 13:27


### Hvordan det hele begynte (tror vi)

CRMM begynte i de tidligere stadier som en beskedent **H<sub>2</sub>O**-molekyl drivende gjennom ursuppen og egentlig bare passet sine egne saker. Så, av grunner ingen helt forstår (muligens kenguruer), havnet den i Australia, hvor den ved et uhell utløste en mindre virkelighetsforvrengende hendelse. Ut av det kaoset kom en enkelt, verdensendrende tanke: «Hva med modifikasjoner … men organisert?». Og akkurat sånn fikk Eatham gnisten som startet det hele. Derfra gikk ting overraskende strake veien (utenom *noen* serverbranner i ny og ne og selvfølgelig litt hodebry).

---

CRMM ble *faktisk* opprettet den **10. mars 2024**, født ut fra ideen om å skape et sentralt sted for å dele alt som er laget for Cosmic Reach. Inspirert av plattformer som [Modrinth](https://modrinth.com/), satte vi oss fore å bygge noe renere, raskere og skreddersydd for vårt eget lille fellesskap. Og selv om vi fortsatt har en lang vei å gå, og noen utfordringer underveis, er vi veldig stolte av hvor langt vi allerede har kommet.

### Målet vårt

Vårt mål er enkelt:
Å **styrke skapere** og **gjøre innholdsdeling sømløst**. Fra modifikasjoner og verdener til teksturpakker og skjermskildrere, så vil vi gi innholdskapere en måte å dele de de skaper – og brukere en måte å ta skapelsene i bruk, uanstrengt.

### Møt gruppen

Selv om CRMM er et fellesskapsdrevet initiativ, er det noen kjernepersoner bak det:

* **Abhinav** – *Kodetrollmannen*. Det er han som skaper backend- og frontend-delen av nettstedet. Hvis noe må fikses eller utvikles, er det han som får det gjort.
* **Eatham** – *Mannen med ideen*. Hjalp CRMM å komme i gang og har vært der helt fra starten av.
* **Spicylemon** – *Lederen, logoutformer, og grammatikkontrollør, når han husker det*. Har oversikt over prosjektet og sørger for at alt går knirkefritt.
* **CaptainDynamite** – Hjelper til med finansieringen av prosjektet. Har vært der siden starten.
* **Dounford & Arlojay** – Gav generell hjelp i CRMMs tidlige stadier.
* **Puzzle** – Er i dag moderorganisasjonen og en sentral del av våre røtter.

Selv om mange hjelper til i ny og ne – hovedsakelig via Discord – håndteres det daglige arbeidet hovedsakelig av Spicylemon og Abhinav, med noen urter og krydder slengt inn av Eatham.

Og selvfølgelig, **en stor takk til FinalForEach**, skaperen av *Cosmic Reach*, for å ha utviklet et så unikt spill og gitt oss dette fantastiske fellesskapet å samles rundt.

### Hvordan det hele henger sammen

Vi drifter CRMM selv og bruker verktøy med åpen kildekode og fellesskapsvennlige løsninger:

Selvdrifting:
- **Postgresql** (SQL-database)
- **Meilisearch** (tekstsøkeleverandør)
- **Valkey** (minnebuffer)
- **Clickhouse DB** for rask og effektiv analyser
- **Uptime Kuma** for overvåking

Tredjeparter:
- **Cloudflare** (Proxy for backend)
- **Fastly** for innholdslevering og mellomlagring

Alt er utviklet for å være lett, personvernvennlig og med modifiseringsfellesskapet i tankene.

### Fellesskap og bidrag

CRMM er **åpen kildekode og er drevet av fellesskapet** under *GNU Affero General Public License*.
Brukere kan hjelpe til med å oversette nettstedet, foreslå funksjoner, eller (hvis de føler seg modige) til og med bidra direkte via [GitHub](${props.repoLink}). Det skjer ikke ofte, men når det skjer, setter vi stor pris på det.

### Vil du være med og bidra?
Bli med i Discord-serveren vår [Puzzle HQ](${props.discordInvite}) og si hei. Enten du ønsker å bidra eller bare henge med andre moddere, er du velkommen der.

### Hva er neste?

Vi mener vi er fortsatt i startfasen, men store ting er i vente. Fra **modereringsverktøy** til **VirusTotal-integrasjon**, forbedret **prosjektrapportering** og mer – vi arbeider alltid mot en større og bedre plattform.

Takk til **DEG** for at du er en del av CRMM-fellesskapet og gjør alt dette mulig.
Vi gleder oss til å se hva du lager ;). Lykke til med Cosmic Reaching!
`;