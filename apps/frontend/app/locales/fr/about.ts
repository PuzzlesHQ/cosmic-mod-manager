import type { AboutUsProps } from "~/locales/en-US/about";

export const AboutUs = (props: AboutUsProps) => `
# À propos de nous

Soyez les bienvenus chez **CRMM** – le **gestionnaire de mods pour Cosmic Reach** (**Cosmic Reach Mod Manager** en anglais).
Nous sommes une équipe passionnée, dédiée à rendre aussi simple et pratique que possible la diffusion et la découverte de contenu téléchargeable pour *Cosmic Reach*. Que vous êtes développeur de mods, constructeur de monde, ou bien quelqu'un qui aime simplement personaliser son expérience, CRMM est ici pour héberger votre créativité.

---
Dernière mise à jour : 2025-03-29 à 13h27


### Le début du tout (nous croyons)

CRMM a commencé sa forme de vie la plus primitive en tant qu'humble molécule **H<sub>2</sub>O** flottant au travers de la soupe primordiale, se contentant de vaquer à ses affaires, à vrai dire. Puis, pour des raisons incomprise à tous (possiblement des kangaroos), il c'est rendu en Australie où il a accidentellement déclenché un événement mineur de distorsion de réalité. De ce chaos est servenue une seule pensée capable de bouleverser l'univers : « Et si les mods... mais organisés ? » Et bien, Eatham a eu l'étincelle qui a débuté le tout. De là, les choses sont devenues étonnament simples (excepté *quelques* incendies de serveur et, bien sûr, de la réflexion intense).

---

CRMM était *réelement* créé le **10 mars, 2024**, née de l'idée de créer un lieu central où partager tout qui est conçu pour Corsmic Reach. Inspiré de plateformes tels que [Modrinth](https://modrinth.com/), nous nous sommes lancés à construire quelque chose de plus nette, rapide et adaptée à notre propre petite communautée. Et bien que nous ayons bien du trajet devant nous, et des défis le long du chemin, nous sommes très fiers du progrès que nous avons déjà accomplis.

### Notre mission

Notre but est simple :
**Donner le pouvoir au créateurs** et **rendre fluide le partage de contenu**. De mods et mondes, aux packs de ressources et nuanceurs, nous avons donnés aux créauteurs un moyen de partager ce qu'ils créent – et aux utilisateurs un moyen d'en réjouir sans difficulté.

### Rencontrer l'équipe

Bien que CRMM soit un effort communautaire, voici quelques-unes des personnes clés derrière ce projet :

* **Abhinav** – *Le magicien du code*. A conçu le backend et le fronted du site web. Si quelque chose est en besoin de réparation ou de construction, c'est lui qui s'en charge.
* **Eatham** – *Le gars d'idées*. A aidé à mettre CRMM en marche et était là dès le tout début.
* **Spicylemon** – *Le directeur, concepteur de logo et vérificateur de grammaire (lorsqu'il s'en souvient)*. Survoit le projet et assure le bon déroulement.
* **CaptainDynamite** – Aide avec le financement du projet et était là dès le tout départ.
* **Dounford & Arlojay** – Ont donnée de l'aide générale durant les débuts de CRMM.
* **Puzzle** – Notre projet « parent » et une partie clée de nos origines.

Bien que de nombreux gens contribuent de temps à autre, principalement via Discord, les travaux quotidiens sont entrepris par Spicylemon et Abhinav avec quelques herbes et épices ajoutées par Eatham.

Et bien sûr, **un immense merci à FinalForEach**, le créateur de *Cosmic Reach*, d'avoir conçu un jeu aussi unique et de nous avoir donné cette communautée magnifique autour de laquelle nous pouvons nous rassembler.

### Comment ça fonctionne

Nous auto-hébergons CRMM et utilisons des outils à code source ouvert qui sont amiables à la communautée :

Auto-hébergé :
- **Postgresql** (base de données SQL)
- **Meilisearch** (fournisseur de recherche de texte)
- **Valkey** (antémémoir)
- **Clickhouse DB** pour des analytiques rapides et efficaces
- **Uptime Kuma** pour le monitoring

Tiers :
- **Cloudflare** (Proxy pour le backend)
- **Fastly** pour la diffusion de contenu et le caching

Tout est conçu pour être léger, protéger la vie privée et fonctionner en tenant compte de la communautée de modding.

### Communautée et contributions

CRMM est **à code source ouvert et soutenu par la communautée** sous la *GNU Affero General Public License*.
Les utilisateurs peuvent contribuer à traduire le site web, suggérer des fonctionnalités, ou (s'ils se sentent audacieux) même contribuer directement via notre [répertoire GitHub](${props.repoLink}). Ça n'arrive pas souvent, mais nous apprécions profondément quand ça arrive.

### Voulez-vous vous impliquer ?
Joignez-vous au [discord Puzzle](${props.discordInvite}) et disez âllo. Que vous cherchez à contribuer ou simplement vous détendre avec d'autres moddeurs, vous êtes le bienvenu ici.

### Qu'est-ce qui suit ?

Nous n'en sommes encore qu'au début, mais de grandes choses se dessinent à l'horizon. Des **outils de modération** à **l'intégration de VirusTotal**, l'amélioration du **signalement de projets**, et plus – nous construisons toujours vers une plateforme plus grande et meilleure.

Merci à **VOUS** de faire partie de la communautée de CRMM et de rendre tout cela possible.
Nous avons hâte de voir ce que vous créez ;). Joyeuse Cosmic Reach !
`;
