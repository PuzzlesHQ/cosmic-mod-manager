import type { SecurityProps } from "~/locales/en-US/legal/security";

export const SecurityNotice = (props: SecurityProps) => `
# ${props.title}

**Version 2025-05**
*Dernière modification : 3 mai 2025*

Ceci est la notice de sécurité pour **tous les répertoires** et **l'infrastructure de ${props.siteName_Short}**. Ce document explique comment nous signaler des vulnérabilités d'une manière **responsable** et **sécurisée**.


## Signaler une vulnérabilité

Si vous découvrez une vulnérabilité dans ${props.siteName_Short}, nous apprécierions si vous nous avisiez **privément** afin que nous puissions régler le problème avant que ça soit divulgué publiquement.

**Veuillez ne pas ouvrir de problème sur Github ni discuter de la vulnérabilité dans des canaux publics.**

Plutôt, envoyez-nous un courriel à **[${props.adminEmail}](mailto:${props.adminEmail})** contenant le suivant :

* Le site web, la page, ou le répertoire dans lesquels peut se faire observer la vulnérabilité
* Une briève description de la vulnérabilité
* (Optionnel) Le type de vulnérabilité et n'importe quelle catégorie OWASP connexe
* (Optionnel) Les étapes afin de reproduire le problème de manière non destructive ou des détails d'une preuve de concept

Nous aspirons à répondre aux signalements valides en moins de **48 heures**.


## Portée

Les types de signalement qui suivent **ne** sont **pas** considérés dans la portée de cette politique :

* **Vulnérabilités en volume**, telles qu'un volume élevé de requêtes à but d'accabler un service
* Des signalements qui indiquent que de **meilleures pratiques de sécurité** nous manquent, telles que des en-têtes HTTP absents ou des problèmes mineurs de configuration qui ne constituent pas une menace

Si vous êtes incertains que vos trouvailles se trouvent en portée, sentez-vous libre de nous contacter quand même. Nous apprécions vos efforts à nous aider à améliorer la sécurité de ${props.siteName_Short}.


## Divulgation coordonnée

Nous demandons que tout chercheur en sécurité suive un processus de **divulgation coordonnée**. Veuillez nous donner l'occasion d'évaluer et résoudre le problème signalé avant toute divulgation publique.
`;
