import type { RulesProps } from "~/locales/en/legal/rules";

export const Rules = (props: RulesProps) => `
# ${props.title}

Diese Übersetzung nicht rechtlich bindend! Es gilt die englische Originalversion, dieses Dokument soll lediglich das Verständnis für deutschsprachige Nutzer vereinfachen.

Wenn du auf irgendeine Art von Verstoß gegen diese Regeln auf unserer Webseite triffst, bitten wir dich, uns darauf aufmerksam du machen. Du kannst den "Melden"-Knopf nutzen, um jedes Projekt, jede Version oder jede Nutzerseite zu melden, oder du kannst und eine E-Mail an [${props.supportEmail}](mailto:${props.supportEmail}) schicken.

## 1. Verbotene Inhalte

Inhalte müssen in ihrer Gesamtheit allen geltenden Bundes-, Landes- und kommunalen sowie internationalen Gesetze und Vorschriften einhalten. Ohne das Vorhergehende einzuschränken, dürfen Inhalte nicht:

1. Material beinhalten, welches diffamierend, obszön, unanständig, beleidigend, belästigend, gewalttätig, hasserfüllt, hetzend, schädlich, störend, widersprüchlich oder auf anderem Wege anstößig ist.
2. Sexuell explizites oder pornografisches Material, Gewalt oder Diskriminierung auf Grund von Hautfarbe, Geschlecht, Religion, Nationalität, Behinderung, sexueller Orientierung oder Alter enthalten.
3. Patenete, Marken, Geschäftsgeheimnisse, Urheberrechte oder anderes geistiges Eigentum oder die Rechte einer anderen Person verletzen.
4. Die gesetzlichen Rechte (einschließlich der Persönlichkeits- und Datenschutzrechte) anderer verletzen oder Material enthalten, das gemäß den geltenden Gesetzen und Vorschriften zu zivil- oder strafrechtlicher Haftung führen könnte oder anderweitig im Widerspruch zu unseren [Nutzungsbedingungen](${props.termsPageUrl}) oder unserer [Datenschutzrichtlinie](${props.privacyPageUrl}) stehen könnte.
5. Illegale Aktivitäten fördern oder befürworten oder rechtswidrige Handlungen unterstützen, einschließlich echter Drogen oder illegaler Substanzen.
6. Unnötig Ängste auslösen oder unter Umständen dazu führen können, dass andere Personen aufgebracht, beschämt, alarmiert oder verletzt werden.
7. Sich als andere Personen ausgeben oder die Identität oder den Zusammenhang mit einer anderen Person oder Organisation falsch darstellen.
8. Den Eindruck erwecken, dass sie von uns oder einer anderen Person oder Stelle stammen oder gebilligt werden, obwohl dies nicht der Fall ist.
9. Daten auf einen unabhängigen Server hochladen, ohne dies im Spiel vorher klar offenzulegen.

## 2. Klare Funktion und ehrliche Beschreibung

Projekte, eine Art von Inhalt, müssen versuchen, ihren Sinn und Zweck in den passenden Bereichen der Projektseite klar und ehrlich zu beschreiben. Notwendige Informationen dürfen auf keinem Weg versteckt oder anderweitig unerkennbar gemacht werden. Verwirrende Sprache oder technische Fachsprache zu benuzten, wenn es nicht nötig ist, stellt einen Verstoß dar.

### 2.1. Allgemeine Erwartungen

Durch die Projektbeschreibung sollten Nutzer die Möglichkeit haben, zu verstehen, was das Projekt macht und wie es zu verwenden ist. Projekte müssen versuchen, die folgenden drei Sachen in ihrer Beschreibung darzulegen:

a. Was genau durch das Projekt getan oder hinzugefügt wird
b. Warum jemand das Projekt herunterladen wollen würde
c. Jede andere kritische Information, die der Nutzer vor dem Herunterladen wissen muss oder sollte

### 2.2. Barrierefreiheit

Projektbeschreibungen müssen barrierefrei sein, sodass sie über eine Reihe von Medien erfasst werden können. Alle Beschreibungen müssen eine reine Textversion haben, obwohl Bilder, Videos und andere Inhalte priorisiert werden können, falls gewünscht. Überschriften dürfen nicht für Inhaltstext, sondern nur für wirkliche Überschriften verwendet werden.

Projektbeschreibungen müssen eine englischsprachige Übersetzung haben außer sie sind exklusiv für die Nutzung in einer bestimmten Sprache gedacht, wie zum Beispiel Sprachpakete. Beschreibungen können Übersetzungen in andere Sprachen anbieten, falls erwünscht.

## 3. Cheats und Hacks

Projekte dürfen keine "Cheats" beinhalten oder herunterladen, welche wir als eine Client-seitige Modifikation definieren, die:

1. Als "Cheat", "Hack" oder "Hackclient" beworben wird.
2. Eine der folgenden Funktionen enthält, ohne dass ein Server-seitiges Opt-in erforderlich ist:
    a. Aktives Client-seitiges Verstecken von anderen Modifikationen, die Server-seitige Opt-Outs haben
    b. Unnötige Pakete an einen Server schicken
    c. Geräte anderer Nutzer schädigen

## 4. Urheberrecht und Wiederuploads

Du musst die nötigen Lizenzen, Rechte, Einwilligungen und Berechtigungen haben oder besitzen Inhalte, die unter deinem CRMM-Konto hochgeladen werden, zu speichern, teilen und verbreiten.

Inhalten dürfen nicht von einer anderen Quelle direkt wieder hochgeladen werden, ohne Erlaubnis vom urspünglichen Autor zu besitzen. Wenn ausdrückliche Berechtigung gegeben wurde oder es sich um eine lizenzgerechte "fork" handelt, trifft diese Beschränkung nicht zu.

## 5. Verschiedenes

Es gibt weitere kleine Aspekte, die das Erstellen von Projekten betreffen und die von allen Autoren eingehalten werden sollten. Diese werden nicht notwendigerweise durchgesetzt, aber sich an sie zu halten wird in einer schnelleren Zulassung mit weniger potenziellen Problemen führen.

1. Alle Metadaten wie Lizenz, die Information, ob Client- und/oder Server-seitig, Tags usw., sind korrekt ausgefüllt und mit der Information, die anderswo auffindbar ist, übereinstimmend.
2. Projekttitel beinhalten nur den Namen des Projektes ohne unnötige Füllinformationen.
3. Projektzusammenfassungen enthalten eine kleine Zusammenfassung des Projektes, ohne weitere Formatierung und ohne den Projekttitel zu wiederholen.
4. Alle externen Links führen zu öffentlichen Ressourcen, die relevant sind.
5. Galleriebilder sind relevant für das Projekt und enthalten jeweils einen Titel.
6. Alle Abhängigkeiten müssen in dem für diese vorgesehenen Bereich für jede Version festgelegt werden.
7. "Zusätzliche Dateien" werden nur für ihren speziell angedachten Zweck, wie zum Beispiel Quell-JAR-Dateien benutzt. In anderen Worten, separate Versionen und/oder Projekte werden wen angebracht statt zusätzlichen Dateien genutzt.
`;
