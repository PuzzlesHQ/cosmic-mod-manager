export const LICNESE_REFERENCE_LINK = "https://spdx.org/licenses";

export function licenseRefLink(licenseId: string) {
    if (["custom", "all-rights-reserved"].includes(licenseId)) return null;
    return `https://spdx.org/licenses/${licenseId}`;
}

export interface SPDX_LICENSE {
    name: string;
    licenseId: string;
    text?: string;
    link: string | null;
}

const SPDX_LICENSE_LIST: SPDX_LICENSE[] = [
    {
        name: "All Rights Reserved",
        licenseId: "all-rights-reserved",
        link: licenseRefLink("all-rights-reserved"),
        text: "All rights reserved unless explicitly stated.",
    },
    {
        name: "BSD Zero Clause License",
        licenseId: "0BSD",
        link: licenseRefLink("0BSD"),
    },
    {
        name: "3D Slicer License v1.0",
        licenseId: "3D-Slicer-1.0",
        link: licenseRefLink("3D-Slicer-1.0"),
    },
    {
        name: "Attribution Assurance License",
        licenseId: "AAL",
        link: licenseRefLink("AAL"),
    },
    {
        name: "Abstyles License",
        licenseId: "Abstyles",
        link: licenseRefLink("Abstyles"),
    },
    {
        name: "AdaCore Doc License",
        licenseId: "AdaCore-doc",
        link: licenseRefLink("AdaCore-doc"),
    },
    {
        name: "Adobe Systems Incorporated Source Code License Agreement",
        licenseId: "Adobe-2006",
        link: licenseRefLink("Adobe-2006"),
    },
    {
        name: "Adobe Display PostScript License",
        licenseId: "Adobe-Display-PostScript",
        link: licenseRefLink("Adobe-Display-PostScript"),
    },
    {
        name: "Adobe Glyph List License",
        licenseId: "Adobe-Glyph",
        link: licenseRefLink("Adobe-Glyph"),
    },
    {
        name: "Adobe Utopia Font License",
        licenseId: "Adobe-Utopia",
        link: licenseRefLink("Adobe-Utopia"),
    },
    {
        name: "Amazon Digital Services License",
        licenseId: "ADSL",
        link: licenseRefLink("ADSL"),
    },
    {
        name: "Academic Free License v1.1",
        licenseId: "AFL-1.1",
        link: licenseRefLink("AFL-1.1"),
    },
    {
        name: "Academic Free License v1.2",
        licenseId: "AFL-1.2",
        link: licenseRefLink("AFL-1.2"),
    },
    {
        name: "Academic Free License v2.0",
        licenseId: "AFL-2.0",
        link: licenseRefLink("AFL-2.0"),
    },
    {
        name: "Academic Free License v2.1",
        licenseId: "AFL-2.1",
        link: licenseRefLink("AFL-2.1"),
    },
    {
        name: "Academic Free License v3.0",
        licenseId: "AFL-3.0",
        link: licenseRefLink("AFL-3.0"),
    },
    {
        name: "Afmparse License",
        licenseId: "Afmparse",
        link: licenseRefLink("Afmparse"),
    },
    {
        name: "Affero General Public License v1.0",
        licenseId: "AGPL-1.0",
        link: licenseRefLink("AGPL-1.0"),
    },
    {
        name: "Affero General Public License v1.0 only",
        licenseId: "AGPL-1.0-only",
        link: licenseRefLink("AGPL-1.0-only"),
    },
    {
        name: "Affero General Public License v1.0 or later",
        licenseId: "AGPL-1.0-or-later",
        link: licenseRefLink("AGPL-1.0-or-later"),
    },
    {
        name: "GNU Affero General Public License v3.0",
        licenseId: "AGPL-3.0",
        link: licenseRefLink("AGPL-3.0"),
    },
    {
        name: "GNU Affero General Public License v3.0 only",
        licenseId: "AGPL-3.0-only",
        link: licenseRefLink("AGPL-3.0-only"),
    },
    {
        name: "GNU Affero General Public License v3.0 or later",
        licenseId: "AGPL-3.0-or-later",
        link: licenseRefLink("AGPL-3.0-or-later"),
    },
    {
        name: "Aladdin Free Public License",
        licenseId: "Aladdin",
        link: licenseRefLink("Aladdin"),
    },
    {
        name: "AMD newlib License",
        licenseId: "AMD-newlib",
        link: licenseRefLink("AMD-newlib"),
    },
    {
        name: "AMD\u0027s plpa_map.c License",
        licenseId: "AMDPLPA",
        link: licenseRefLink("AMDPLPA"),
    },
    {
        name: "Apple MIT License",
        licenseId: "AML",
        link: licenseRefLink("AML"),
    },
    {
        name: "AML glslang variant License",
        licenseId: "AML-glslang",
        link: licenseRefLink("AML-glslang"),
    },
    {
        name: "Academy of Motion Picture Arts and Sciences BSD",
        licenseId: "AMPAS",
        link: licenseRefLink("AMPAS"),
    },
    {
        name: "ANTLR Software Rights Notice",
        licenseId: "ANTLR-PD",
        link: licenseRefLink("ANTLR-PD"),
    },
    {
        name: "ANTLR Software Rights Notice with license fallback",
        licenseId: "ANTLR-PD-fallback",
        link: licenseRefLink("ANTLR-PD-fallback"),
    },
    {
        name: "Any OSI License",
        licenseId: "any-OSI",
        link: licenseRefLink("any-OSI"),
    },
    {
        name: "Apache License 1.0",
        licenseId: "Apache-1.0",
        link: licenseRefLink("Apache-1.0"),
    },
    {
        name: "Apache License 1.1",
        licenseId: "Apache-1.1",
        link: licenseRefLink("Apache-1.1"),
    },
    {
        name: "Apache License 2.0",
        licenseId: "Apache-2.0",
        link: licenseRefLink("Apache-2.0"),
    },
    {
        name: "Adobe Postscript AFM License",
        licenseId: "APAFML",
        link: licenseRefLink("APAFML"),
    },
    {
        name: "Adaptive Public License 1.0",
        licenseId: "APL-1.0",
        link: licenseRefLink("APL-1.0"),
    },
    {
        name: "App::s2p License",
        licenseId: "App-s2p",
        link: licenseRefLink("App-s2p"),
    },
    {
        name: "Apple Public Source License 1.0",
        licenseId: "APSL-1.0",
        link: licenseRefLink("APSL-1.0"),
    },
    {
        name: "Apple Public Source License 1.1",
        licenseId: "APSL-1.1",
        link: licenseRefLink("APSL-1.1"),
    },
    {
        name: "Apple Public Source License 1.2",
        licenseId: "APSL-1.2",
        link: licenseRefLink("APSL-1.2"),
    },
    {
        name: "Apple Public Source License 2.0",
        licenseId: "APSL-2.0",
        link: licenseRefLink("APSL-2.0"),
    },
    {
        name: "Arphic Public License",
        licenseId: "Arphic-1999",
        link: licenseRefLink("Arphic-1999"),
    },
    {
        name: "Artistic License 1.0",
        licenseId: "Artistic-1.0",
        link: licenseRefLink("Artistic-1.0"),
    },
    {
        name: "Artistic License 1.0 w/clause 8",
        licenseId: "Artistic-1.0-cl8",
        link: licenseRefLink("Artistic-1.0-cl8"),
    },
    {
        name: "Artistic License 1.0 (Perl)",
        licenseId: "Artistic-1.0-Perl",
        link: licenseRefLink("Artistic-1.0-Perl"),
    },
    {
        name: "Artistic License 2.0",
        licenseId: "Artistic-2.0",
        link: licenseRefLink("Artistic-2.0"),
    },
    {
        name: "ASWF Digital Assets License version 1.0",
        licenseId: "ASWF-Digital-Assets-1.0",
        link: licenseRefLink("ASWF-Digital-Assets-1.0"),
    },
    {
        name: "ASWF Digital Assets License 1.1",
        licenseId: "ASWF-Digital-Assets-1.1",
        link: licenseRefLink("ASWF-Digital-Assets-1.1"),
    },
    {
        name: "Baekmuk License",
        licenseId: "Baekmuk",
        link: licenseRefLink("Baekmuk"),
    },
    {
        name: "Bahyph License",
        licenseId: "Bahyph",
        link: licenseRefLink("Bahyph"),
    },
    {
        name: "Barr License",
        licenseId: "Barr",
        link: licenseRefLink("Barr"),
    },
    {
        name: "bcrypt Solar Designer License",
        licenseId: "bcrypt-Solar-Designer",
        link: licenseRefLink("bcrypt-Solar-Designer"),
    },
    {
        name: "Beerware License",
        licenseId: "Beerware",
        link: licenseRefLink("Beerware"),
    },
    {
        name: "Bitstream Charter Font License",
        licenseId: "Bitstream-Charter",
        link: licenseRefLink("Bitstream-Charter"),
    },
    {
        name: "Bitstream Vera Font License",
        licenseId: "Bitstream-Vera",
        link: licenseRefLink("Bitstream-Vera"),
    },
    {
        name: "BitTorrent Open Source License v1.0",
        licenseId: "BitTorrent-1.0",
        link: licenseRefLink("BitTorrent-1.0"),
    },
    {
        name: "BitTorrent Open Source License v1.1",
        licenseId: "BitTorrent-1.1",
        link: licenseRefLink("BitTorrent-1.1"),
    },
    {
        name: "SQLite Blessing",
        licenseId: "blessing",
        link: licenseRefLink("blessing"),
    },
    {
        name: "Blue Oak Model License 1.0.0",
        licenseId: "BlueOak-1.0.0",
        link: licenseRefLink("BlueOak-1.0.0"),
    },
    {
        name: "Boehm-Demers-Weiser GC License",
        licenseId: "Boehm-GC",
        link: licenseRefLink("Boehm-GC"),
    },
    {
        name: "Borceux license",
        licenseId: "Borceux",
        link: licenseRefLink("Borceux"),
    },
    {
        name: "Brian Gladman 2-Clause License",
        licenseId: "Brian-Gladman-2-Clause",
        link: licenseRefLink("Brian-Gladman-2-Clause"),
    },
    {
        name: "Brian Gladman 3-Clause License",
        licenseId: "Brian-Gladman-3-Clause",
        link: licenseRefLink("Brian-Gladman-3-Clause"),
    },
    {
        name: "BSD 1-Clause License",
        licenseId: "BSD-1-Clause",
        link: licenseRefLink("BSD-1-Clause"),
    },
    {
        name: 'BSD 2-Clause "Simplified" License',
        licenseId: "BSD-2-Clause",
        link: licenseRefLink("BSD-2-Clause"),
    },
    {
        name: "BSD 2-Clause - Ian Darwin variant",
        licenseId: "BSD-2-Clause-Darwin",
        link: licenseRefLink("BSD-2-Clause-Darwin"),
    },
    {
        name: "BSD 2-Clause - first lines requirement",
        licenseId: "BSD-2-Clause-first-lines",
        link: licenseRefLink("BSD-2-Clause-first-lines"),
    },
    {
        name: "BSD 2-Clause FreeBSD License",
        licenseId: "BSD-2-Clause-FreeBSD",
        link: licenseRefLink("BSD-2-Clause-FreeBSD"),
    },
    {
        name: "BSD 2-Clause NetBSD License",
        licenseId: "BSD-2-Clause-NetBSD",
        link: licenseRefLink("BSD-2-Clause-NetBSD"),
    },
    {
        name: "BSD-2-Clause Plus Patent License",
        licenseId: "BSD-2-Clause-Patent",
        link: licenseRefLink("BSD-2-Clause-Patent"),
    },
    {
        name: "BSD 2-Clause with views sentence",
        licenseId: "BSD-2-Clause-Views",
        link: licenseRefLink("BSD-2-Clause-Views"),
    },
    {
        name: 'BSD 3-Clause "New" or "Revised" License',
        licenseId: "BSD-3-Clause",
        link: licenseRefLink("BSD-3-Clause"),
    },
    {
        name: "BSD 3-Clause acpica variant",
        licenseId: "BSD-3-Clause-acpica",
        link: licenseRefLink("BSD-3-Clause-acpica"),
    },
    {
        name: "BSD with attribution",
        licenseId: "BSD-3-Clause-Attribution",
        link: licenseRefLink("BSD-3-Clause-Attribution"),
    },
    {
        name: "BSD 3-Clause Clear License",
        licenseId: "BSD-3-Clause-Clear",
        link: licenseRefLink("BSD-3-Clause-Clear"),
    },
    {
        name: "BSD 3-Clause Flex variant",
        licenseId: "BSD-3-Clause-flex",
        link: licenseRefLink("BSD-3-Clause-flex"),
    },
    {
        name: "Hewlett-Packard BSD variant license",
        licenseId: "BSD-3-Clause-HP",
        link: licenseRefLink("BSD-3-Clause-HP"),
    },
    {
        name: "Lawrence Berkeley National Labs BSD variant license",
        licenseId: "BSD-3-Clause-LBNL",
        link: licenseRefLink("BSD-3-Clause-LBNL"),
    },
    {
        name: "BSD 3-Clause Modification",
        licenseId: "BSD-3-Clause-Modification",
        link: licenseRefLink("BSD-3-Clause-Modification"),
    },
    {
        name: "BSD 3-Clause No Military License",
        licenseId: "BSD-3-Clause-No-Military-License",
        link: licenseRefLink("BSD-3-Clause-No-Military-License"),
    },
    {
        name: "BSD 3-Clause No Nuclear License",
        licenseId: "BSD-3-Clause-No-Nuclear-License",
        link: licenseRefLink("BSD-3-Clause-No-Nuclear-License"),
    },
    {
        name: "BSD 3-Clause No Nuclear License 2014",
        licenseId: "BSD-3-Clause-No-Nuclear-License-2014",
        link: licenseRefLink("BSD-3-Clause-No-Nuclear-License-2014"),
    },
    {
        name: "BSD 3-Clause No Nuclear Warranty",
        licenseId: "BSD-3-Clause-No-Nuclear-Warranty",
        link: licenseRefLink("BSD-3-Clause-No-Nuclear-Warranty"),
    },
    {
        name: "BSD 3-Clause Open MPI variant",
        licenseId: "BSD-3-Clause-Open-MPI",
        link: licenseRefLink("BSD-3-Clause-Open-MPI"),
    },
    {
        name: "BSD 3-Clause Sun Microsystems",
        licenseId: "BSD-3-Clause-Sun",
        link: licenseRefLink("BSD-3-Clause-Sun"),
    },
    {
        name: 'BSD 4-Clause "Original" or "Old" License',
        licenseId: "BSD-4-Clause",
        link: licenseRefLink("BSD-4-Clause"),
    },
    {
        name: "BSD 4 Clause Shortened",
        licenseId: "BSD-4-Clause-Shortened",
        link: licenseRefLink("BSD-4-Clause-Shortened"),
    },
    {
        name: "BSD-4-Clause (University of California-Specific)",
        licenseId: "BSD-4-Clause-UC",
        link: licenseRefLink("BSD-4-Clause-UC"),
    },
    {
        name: "BSD 4.3 RENO License",
        licenseId: "BSD-4.3RENO",
        link: licenseRefLink("BSD-4.3RENO"),
    },
    {
        name: "BSD 4.3 TAHOE License",
        licenseId: "BSD-4.3TAHOE",
        link: licenseRefLink("BSD-4.3TAHOE"),
    },
    {
        name: "BSD Advertising Acknowledgement License",
        licenseId: "BSD-Advertising-Acknowledgement",
        link: licenseRefLink("BSD-Advertising-Acknowledgement"),
    },
    {
        name: "BSD with Attribution and HPND disclaimer",
        licenseId: "BSD-Attribution-HPND-disclaimer",
        link: licenseRefLink("BSD-Attribution-HPND-disclaimer"),
    },
    {
        name: "BSD-Inferno-Nettverk",
        licenseId: "BSD-Inferno-Nettverk",
        link: licenseRefLink("BSD-Inferno-Nettverk"),
    },
    {
        name: "BSD Protection License",
        licenseId: "BSD-Protection",
        link: licenseRefLink("BSD-Protection"),
    },
    {
        name: "BSD Source Code Attribution - beginning of file variant",
        licenseId: "BSD-Source-beginning-file",
        link: licenseRefLink("BSD-Source-beginning-file"),
    },
    {
        name: "BSD Source Code Attribution",
        licenseId: "BSD-Source-Code",
        link: licenseRefLink("BSD-Source-Code"),
    },
    {
        name: "Systemics BSD variant license",
        licenseId: "BSD-Systemics",
        link: licenseRefLink("BSD-Systemics"),
    },
    {
        name: "Systemics W3Works BSD variant license",
        licenseId: "BSD-Systemics-W3Works",
        link: licenseRefLink("BSD-Systemics-W3Works"),
    },
    {
        name: "Boost Software License 1.0",
        licenseId: "BSL-1.0",
        link: licenseRefLink("BSL-1.0"),
    },
    {
        name: "Business Source License 1.1",
        licenseId: "BUSL-1.1",
        link: licenseRefLink("BUSL-1.1"),
    },
    {
        name: "bzip2 and libbzip2 License v1.0.5",
        licenseId: "bzip2-1.0.5",
        link: licenseRefLink("bzip2-1.0.5"),
    },
    {
        name: "bzip2 and libbzip2 License v1.0.6",
        licenseId: "bzip2-1.0.6",
        link: licenseRefLink("bzip2-1.0.6"),
    },
    {
        name: "Computational Use of Data Agreement v1.0",
        licenseId: "C-UDA-1.0",
        link: licenseRefLink("C-UDA-1.0"),
    },
    {
        name: "Cryptographic Autonomy License 1.0",
        licenseId: "CAL-1.0",
        link: licenseRefLink("CAL-1.0"),
    },
    {
        name: "Cryptographic Autonomy License 1.0 (Combined Work Exception)",
        licenseId: "CAL-1.0-Combined-Work-Exception",
        link: licenseRefLink("CAL-1.0-Combined-Work-Exception"),
    },
    {
        name: "Caldera License",
        licenseId: "Caldera",
        link: licenseRefLink("Caldera"),
    },
    {
        name: "Caldera License (without preamble)",
        licenseId: "Caldera-no-preamble",
        link: licenseRefLink("Caldera-no-preamble"),
    },
    {
        name: "Catharon License",
        licenseId: "Catharon",
        link: licenseRefLink("Catharon"),
    },
    {
        name: "Computer Associates Trusted Open Source License 1.1",
        licenseId: "CATOSL-1.1",
        link: licenseRefLink("CATOSL-1.1"),
    },
    {
        name: "Creative Commons Attribution 1.0 Generic",
        licenseId: "CC-BY-1.0",
        link: licenseRefLink("CC-BY-1.0"),
    },
    {
        name: "Creative Commons Attribution 2.0 Generic",
        licenseId: "CC-BY-2.0",
        link: licenseRefLink("CC-BY-2.0"),
    },
    {
        name: "Creative Commons Attribution 2.5 Generic",
        licenseId: "CC-BY-2.5",
        link: licenseRefLink("CC-BY-2.5"),
    },
    {
        name: "Creative Commons Attribution 2.5 Australia",
        licenseId: "CC-BY-2.5-AU",
        link: licenseRefLink("CC-BY-2.5-AU"),
    },
    {
        name: "Creative Commons Attribution 3.0 Unported",
        licenseId: "CC-BY-3.0",
        link: licenseRefLink("CC-BY-3.0"),
    },
    {
        name: "Creative Commons Attribution 3.0 Austria",
        licenseId: "CC-BY-3.0-AT",
        link: licenseRefLink("CC-BY-3.0-AT"),
    },
    {
        name: "Creative Commons Attribution 3.0 Australia",
        licenseId: "CC-BY-3.0-AU",
        link: licenseRefLink("CC-BY-3.0-AU"),
    },
    {
        name: "Creative Commons Attribution 3.0 Germany",
        licenseId: "CC-BY-3.0-DE",
        link: licenseRefLink("CC-BY-3.0-DE"),
    },
    {
        name: "Creative Commons Attribution 3.0 IGO",
        licenseId: "CC-BY-3.0-IGO",
        link: licenseRefLink("CC-BY-3.0-IGO"),
    },
    {
        name: "Creative Commons Attribution 3.0 Netherlands",
        licenseId: "CC-BY-3.0-NL",
        link: licenseRefLink("CC-BY-3.0-NL"),
    },
    {
        name: "Creative Commons Attribution 3.0 United States",
        licenseId: "CC-BY-3.0-US",
        link: licenseRefLink("CC-BY-3.0-US"),
    },
    {
        name: "Creative Commons Attribution 4.0 International",
        licenseId: "CC-BY-4.0",
        link: licenseRefLink("CC-BY-4.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial 1.0 Generic",
        licenseId: "CC-BY-NC-1.0",
        link: licenseRefLink("CC-BY-NC-1.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial 2.0 Generic",
        licenseId: "CC-BY-NC-2.0",
        link: licenseRefLink("CC-BY-NC-2.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial 2.5 Generic",
        licenseId: "CC-BY-NC-2.5",
        link: licenseRefLink("CC-BY-NC-2.5"),
    },
    {
        name: "Creative Commons Attribution Non Commercial 3.0 Unported",
        licenseId: "CC-BY-NC-3.0",
        link: licenseRefLink("CC-BY-NC-3.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial 3.0 Germany",
        licenseId: "CC-BY-NC-3.0-DE",
        link: licenseRefLink("CC-BY-NC-3.0-DE"),
    },
    {
        name: "Creative Commons Attribution Non Commercial 4.0 International",
        licenseId: "CC-BY-NC-4.0",
        link: licenseRefLink("CC-BY-NC-4.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial No Derivatives 1.0 Generic",
        licenseId: "CC-BY-NC-ND-1.0",
        link: licenseRefLink("CC-BY-NC-ND-1.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial No Derivatives 2.0 Generic",
        licenseId: "CC-BY-NC-ND-2.0",
        link: licenseRefLink("CC-BY-NC-ND-2.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial No Derivatives 2.5 Generic",
        licenseId: "CC-BY-NC-ND-2.5",
        link: licenseRefLink("CC-BY-NC-ND-2.5"),
    },
    {
        name: "Creative Commons Attribution Non Commercial No Derivatives 3.0 Unported",
        licenseId: "CC-BY-NC-ND-3.0",
        link: licenseRefLink("CC-BY-NC-ND-3.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial No Derivatives 3.0 Germany",
        licenseId: "CC-BY-NC-ND-3.0-DE",
        link: licenseRefLink("CC-BY-NC-ND-3.0-DE"),
    },
    {
        name: "Creative Commons Attribution Non Commercial No Derivatives 3.0 IGO",
        licenseId: "CC-BY-NC-ND-3.0-IGO",
        link: licenseRefLink("CC-BY-NC-ND-3.0-IGO"),
    },
    {
        name: "Creative Commons Attribution Non Commercial No Derivatives 4.0 International",
        licenseId: "CC-BY-NC-ND-4.0",
        link: licenseRefLink("CC-BY-NC-ND-4.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial Share Alike 1.0 Generic",
        licenseId: "CC-BY-NC-SA-1.0",
        link: licenseRefLink("CC-BY-NC-SA-1.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial Share Alike 2.0 Generic",
        licenseId: "CC-BY-NC-SA-2.0",
        link: licenseRefLink("CC-BY-NC-SA-2.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial Share Alike 2.0 Germany",
        licenseId: "CC-BY-NC-SA-2.0-DE",
        link: licenseRefLink("CC-BY-NC-SA-2.0-DE"),
    },
    {
        name: "Creative Commons Attribution-NonCommercial-ShareAlike 2.0 France",
        licenseId: "CC-BY-NC-SA-2.0-FR",
        link: licenseRefLink("CC-BY-NC-SA-2.0-FR"),
    },
    {
        name: "Creative Commons Attribution Non Commercial Share Alike 2.0 England and Wales",
        licenseId: "CC-BY-NC-SA-2.0-UK",
        link: licenseRefLink("CC-BY-NC-SA-2.0-UK"),
    },
    {
        name: "Creative Commons Attribution Non Commercial Share Alike 2.5 Generic",
        licenseId: "CC-BY-NC-SA-2.5",
        link: licenseRefLink("CC-BY-NC-SA-2.5"),
    },
    {
        name: "Creative Commons Attribution Non Commercial Share Alike 3.0 Unported",
        licenseId: "CC-BY-NC-SA-3.0",
        link: licenseRefLink("CC-BY-NC-SA-3.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial Share Alike 3.0 Germany",
        licenseId: "CC-BY-NC-SA-3.0-DE",
        link: licenseRefLink("CC-BY-NC-SA-3.0-DE"),
    },
    {
        name: "Creative Commons Attribution Non Commercial Share Alike 3.0 IGO",
        licenseId: "CC-BY-NC-SA-3.0-IGO",
        link: licenseRefLink("CC-BY-NC-SA-3.0-IGO"),
    },
    {
        name: "Creative Commons Attribution Non Commercial Share Alike 4.0 International",
        licenseId: "CC-BY-NC-SA-4.0",
        link: licenseRefLink("CC-BY-NC-SA-4.0"),
    },
    {
        name: "Creative Commons Attribution No Derivatives 1.0 Generic",
        licenseId: "CC-BY-ND-1.0",
        link: licenseRefLink("CC-BY-ND-1.0"),
    },
    {
        name: "Creative Commons Attribution No Derivatives 2.0 Generic",
        licenseId: "CC-BY-ND-2.0",
        link: licenseRefLink("CC-BY-ND-2.0"),
    },
    {
        name: "Creative Commons Attribution No Derivatives 2.5 Generic",
        licenseId: "CC-BY-ND-2.5",
        link: licenseRefLink("CC-BY-ND-2.5"),
    },
    {
        name: "Creative Commons Attribution No Derivatives 3.0 Unported",
        licenseId: "CC-BY-ND-3.0",
        link: licenseRefLink("CC-BY-ND-3.0"),
    },
    {
        name: "Creative Commons Attribution No Derivatives 3.0 Germany",
        licenseId: "CC-BY-ND-3.0-DE",
        link: licenseRefLink("CC-BY-ND-3.0-DE"),
    },
    {
        name: "Creative Commons Attribution No Derivatives 4.0 International",
        licenseId: "CC-BY-ND-4.0",
        link: licenseRefLink("CC-BY-ND-4.0"),
    },
    {
        name: "Creative Commons Attribution Share Alike 1.0 Generic",
        licenseId: "CC-BY-SA-1.0",
        link: licenseRefLink("CC-BY-SA-1.0"),
    },
    {
        name: "Creative Commons Attribution Share Alike 2.0 Generic",
        licenseId: "CC-BY-SA-2.0",
        link: licenseRefLink("CC-BY-SA-2.0"),
    },
    {
        name: "Creative Commons Attribution Share Alike 2.0 England and Wales",
        licenseId: "CC-BY-SA-2.0-UK",
        link: licenseRefLink("CC-BY-SA-2.0-UK"),
    },
    {
        name: "Creative Commons Attribution Share Alike 2.1 Japan",
        licenseId: "CC-BY-SA-2.1-JP",
        link: licenseRefLink("CC-BY-SA-2.1-JP"),
    },
    {
        name: "Creative Commons Attribution Share Alike 2.5 Generic",
        licenseId: "CC-BY-SA-2.5",
        link: licenseRefLink("CC-BY-SA-2.5"),
    },
    {
        name: "Creative Commons Attribution Share Alike 3.0 Unported",
        licenseId: "CC-BY-SA-3.0",
        link: licenseRefLink("CC-BY-SA-3.0"),
    },
    {
        name: "Creative Commons Attribution Share Alike 3.0 Austria",
        licenseId: "CC-BY-SA-3.0-AT",
        link: licenseRefLink("CC-BY-SA-3.0-AT"),
    },
    {
        name: "Creative Commons Attribution Share Alike 3.0 Germany",
        licenseId: "CC-BY-SA-3.0-DE",
        link: licenseRefLink("CC-BY-SA-3.0-DE"),
    },
    {
        name: "Creative Commons Attribution-ShareAlike 3.0 IGO",
        licenseId: "CC-BY-SA-3.0-IGO",
        link: licenseRefLink("CC-BY-SA-3.0-IGO"),
    },
    {
        name: "Creative Commons Attribution Share Alike 4.0 International",
        licenseId: "CC-BY-SA-4.0",
        link: licenseRefLink("CC-BY-SA-4.0"),
    },
    {
        name: "Creative Commons Public Domain Dedication and Certification",
        licenseId: "CC-PDDC",
        link: licenseRefLink("CC-PDDC"),
    },
    {
        name: "Creative Commons Zero v1.0 Universal",
        licenseId: "CC0-1.0",
        link: licenseRefLink("CC0-1.0"),
    },
    {
        name: "Common Development and Distribution License 1.0",
        licenseId: "CDDL-1.0",
        link: licenseRefLink("CDDL-1.0"),
    },
    {
        name: "Common Development and Distribution License 1.1",
        licenseId: "CDDL-1.1",
        link: licenseRefLink("CDDL-1.1"),
    },
    {
        name: "Common Documentation License 1.0",
        licenseId: "CDL-1.0",
        link: licenseRefLink("CDL-1.0"),
    },
    {
        name: "Community Data License Agreement Permissive 1.0",
        licenseId: "CDLA-Permissive-1.0",
        link: licenseRefLink("CDLA-Permissive-1.0"),
    },
    {
        name: "Community Data License Agreement Permissive 2.0",
        licenseId: "CDLA-Permissive-2.0",
        link: licenseRefLink("CDLA-Permissive-2.0"),
    },
    {
        name: "Community Data License Agreement Sharing 1.0",
        licenseId: "CDLA-Sharing-1.0",
        link: licenseRefLink("CDLA-Sharing-1.0"),
    },
    {
        name: "CeCILL Free Software License Agreement v1.0",
        licenseId: "CECILL-1.0",
        link: licenseRefLink("CECILL-1.0"),
    },
    {
        name: "CeCILL Free Software License Agreement v1.1",
        licenseId: "CECILL-1.1",
        link: licenseRefLink("CECILL-1.1"),
    },
    {
        name: "CeCILL Free Software License Agreement v2.0",
        licenseId: "CECILL-2.0",
        link: licenseRefLink("CECILL-2.0"),
    },
    {
        name: "CeCILL Free Software License Agreement v2.1",
        licenseId: "CECILL-2.1",
        link: licenseRefLink("CECILL-2.1"),
    },
    {
        name: "CeCILL-B Free Software License Agreement",
        licenseId: "CECILL-B",
        link: licenseRefLink("CECILL-B"),
    },
    {
        name: "CeCILL-C Free Software License Agreement",
        licenseId: "CECILL-C",
        link: licenseRefLink("CECILL-C"),
    },
    {
        name: "CERN Open Hardware Licence v1.1",
        licenseId: "CERN-OHL-1.1",
        link: licenseRefLink("CERN-OHL-1.1"),
    },
    {
        name: "CERN Open Hardware Licence v1.2",
        licenseId: "CERN-OHL-1.2",
        link: licenseRefLink("CERN-OHL-1.2"),
    },
    {
        name: "CERN Open Hardware Licence Version 2 - Permissive",
        licenseId: "CERN-OHL-P-2.0",
        link: licenseRefLink("CERN-OHL-P-2.0"),
    },
    {
        name: "CERN Open Hardware Licence Version 2 - Strongly Reciprocal",
        licenseId: "CERN-OHL-S-2.0",
        link: licenseRefLink("CERN-OHL-S-2.0"),
    },
    {
        name: "CERN Open Hardware Licence Version 2 - Weakly Reciprocal",
        licenseId: "CERN-OHL-W-2.0",
        link: licenseRefLink("CERN-OHL-W-2.0"),
    },
    {
        name: "CFITSIO License",
        licenseId: "CFITSIO",
        link: licenseRefLink("CFITSIO"),
    },
    {
        name: "check-cvs License",
        licenseId: "check-cvs",
        link: licenseRefLink("check-cvs"),
    },
    {
        name: "Checkmk License",
        licenseId: "checkmk",
        link: licenseRefLink("checkmk"),
    },
    {
        name: "Clarified Artistic License",
        licenseId: "ClArtistic",
        link: licenseRefLink("ClArtistic"),
    },
    {
        name: "Clips License",
        licenseId: "Clips",
        link: licenseRefLink("Clips"),
    },
    {
        name: "CMU Mach License",
        licenseId: "CMU-Mach",
        link: licenseRefLink("CMU-Mach"),
    },
    {
        name: "CMU    Mach - no notices-in-documentation variant",
        licenseId: "CMU-Mach-nodoc",
        link: licenseRefLink("CMU-Mach-nodoc"),
    },
    {
        name: "CNRI Jython License",
        licenseId: "CNRI-Jython",
        link: licenseRefLink("CNRI-Jython"),
    },
    {
        name: "CNRI Python License",
        licenseId: "CNRI-Python",
        link: licenseRefLink("CNRI-Python"),
    },
    {
        name: "CNRI Python Open Source GPL Compatible License Agreement",
        licenseId: "CNRI-Python-GPL-Compatible",
        link: licenseRefLink("CNRI-Python-GPL-Compatible"),
    },
    {
        name: "Copyfree Open Innovation License",
        licenseId: "COIL-1.0",
        link: licenseRefLink("COIL-1.0"),
    },
    {
        name: "Community Specification License 1.0",
        licenseId: "Community-Spec-1.0",
        link: licenseRefLink("Community-Spec-1.0"),
    },
    {
        name: "Condor Public License v1.1",
        licenseId: "Condor-1.1",
        link: licenseRefLink("Condor-1.1"),
    },
    {
        name: "copyleft-next 0.3.0",
        licenseId: "copyleft-next-0.3.0",
        link: licenseRefLink("copyleft-next-0.3.0"),
    },
    {
        name: "copyleft-next 0.3.1",
        licenseId: "copyleft-next-0.3.1",
        link: licenseRefLink("copyleft-next-0.3.1"),
    },
    {
        name: "Cornell Lossless JPEG License",
        licenseId: "Cornell-Lossless-JPEG",
        link: licenseRefLink("Cornell-Lossless-JPEG"),
    },
    {
        name: "Common Public Attribution License 1.0",
        licenseId: "CPAL-1.0",
        link: licenseRefLink("CPAL-1.0"),
    },
    {
        name: "Common Public License 1.0",
        licenseId: "CPL-1.0",
        link: licenseRefLink("CPL-1.0"),
    },
    {
        name: "Code Project Open License 1.02",
        licenseId: "CPOL-1.02",
        link: licenseRefLink("CPOL-1.02"),
    },
    {
        name: "Cronyx License",
        licenseId: "Cronyx",
        link: licenseRefLink("Cronyx"),
    },
    {
        name: "Crossword License",
        licenseId: "Crossword",
        link: licenseRefLink("Crossword"),
    },
    {
        name: "CrystalStacker License",
        licenseId: "CrystalStacker",
        link: licenseRefLink("CrystalStacker"),
    },
    {
        name: "CUA Office Public License v1.0",
        licenseId: "CUA-OPL-1.0",
        link: licenseRefLink("CUA-OPL-1.0"),
    },
    {
        name: "Cube License",
        licenseId: "Cube",
        link: licenseRefLink("Cube"),
    },
    {
        name: "curl License",
        licenseId: "curl",
        link: licenseRefLink("curl"),
    },
    {
        name: "Common Vulnerability Enumeration ToU License",
        licenseId: "cve-tou",
        link: licenseRefLink("cve-tou"),
    },
    {
        name: "Deutsche Freie Software Lizenz",
        licenseId: "D-FSL-1.0",
        link: licenseRefLink("D-FSL-1.0"),
    },
    {
        name: "DEC 3-Clause License",
        licenseId: "DEC-3-Clause",
        link: licenseRefLink("DEC-3-Clause"),
    },
    {
        name: "diffmark license",
        licenseId: "diffmark",
        link: licenseRefLink("diffmark"),
    },
    {
        name: "Data licence Germany – attribution – version 2.0",
        licenseId: "DL-DE-BY-2.0",
        link: licenseRefLink("DL-DE-BY-2.0"),
    },
    {
        name: "Data licence Germany – zero – version 2.0",
        licenseId: "DL-DE-ZERO-2.0",
        link: licenseRefLink("DL-DE-ZERO-2.0"),
    },
    {
        name: "DOC License",
        licenseId: "DOC",
        link: licenseRefLink("DOC"),
    },
    {
        name: "DocBook Schema License",
        licenseId: "DocBook-Schema",
        link: licenseRefLink("DocBook-Schema"),
    },
    {
        name: "DocBook Stylesheet License",
        licenseId: "DocBook-Stylesheet",
        link: licenseRefLink("DocBook-Stylesheet"),
    },
    {
        name: "DocBook XML License",
        licenseId: "DocBook-XML",
        link: licenseRefLink("DocBook-XML"),
    },
    {
        name: "Dotseqn License",
        licenseId: "Dotseqn",
        link: licenseRefLink("Dotseqn"),
    },
    {
        name: "Detection Rule License 1.0",
        licenseId: "DRL-1.0",
        link: licenseRefLink("DRL-1.0"),
    },
    {
        name: "Detection Rule License 1.1",
        licenseId: "DRL-1.1",
        link: licenseRefLink("DRL-1.1"),
    },
    {
        name: "DSDP License",
        licenseId: "DSDP",
        link: licenseRefLink("DSDP"),
    },
    {
        name: "David M. Gay dtoa License",
        licenseId: "dtoa",
        link: licenseRefLink("dtoa"),
    },
    {
        name: "dvipdfm License",
        licenseId: "dvipdfm",
        link: licenseRefLink("dvipdfm"),
    },
    {
        name: "Educational Community License v1.0",
        licenseId: "ECL-1.0",
        link: licenseRefLink("ECL-1.0"),
    },
    {
        name: "Educational Community License v2.0",
        licenseId: "ECL-2.0",
        link: licenseRefLink("ECL-2.0"),
    },
    {
        name: "eCos license version 2.0",
        licenseId: "eCos-2.0",
        link: licenseRefLink("eCos-2.0"),
    },
    {
        name: "Eiffel Forum License v1.0",
        licenseId: "EFL-1.0",
        link: licenseRefLink("EFL-1.0"),
    },
    {
        name: "Eiffel Forum License v2.0",
        licenseId: "EFL-2.0",
        link: licenseRefLink("EFL-2.0"),
    },
    {
        name: "eGenix.com Public License 1.1.0",
        licenseId: "eGenix",
        link: licenseRefLink("eGenix"),
    },
    {
        name: "Elastic License 2.0",
        licenseId: "Elastic-2.0",
        link: licenseRefLink("Elastic-2.0"),
    },
    {
        name: "Entessa Public License v1.0",
        licenseId: "Entessa",
        link: licenseRefLink("Entessa"),
    },
    {
        name: "EPICS Open License",
        licenseId: "EPICS",
        link: licenseRefLink("EPICS"),
    },
    {
        name: "Eclipse Public License 1.0",
        licenseId: "EPL-1.0",
        link: licenseRefLink("EPL-1.0"),
    },
    {
        name: "Eclipse Public License 2.0",
        licenseId: "EPL-2.0",
        link: licenseRefLink("EPL-2.0"),
    },
    {
        name: "Erlang Public License v1.1",
        licenseId: "ErlPL-1.1",
        link: licenseRefLink("ErlPL-1.1"),
    },
    {
        name: "Etalab Open License 2.0",
        licenseId: "etalab-2.0",
        link: licenseRefLink("etalab-2.0"),
    },
    {
        name: "EU DataGrid Software License",
        licenseId: "EUDatagrid",
        link: licenseRefLink("EUDatagrid"),
    },
    {
        name: "European Union Public License 1.0",
        licenseId: "EUPL-1.0",
        link: licenseRefLink("EUPL-1.0"),
    },
    {
        name: "European Union Public License 1.1",
        licenseId: "EUPL-1.1",
        link: licenseRefLink("EUPL-1.1"),
    },
    {
        name: "European Union Public License 1.2",
        licenseId: "EUPL-1.2",
        link: licenseRefLink("EUPL-1.2"),
    },
    {
        name: "Eurosym License",
        licenseId: "Eurosym",
        link: licenseRefLink("Eurosym"),
    },
    {
        name: "Fair License",
        licenseId: "Fair",
        link: licenseRefLink("Fair"),
    },
    {
        name: "Fuzzy Bitmap License",
        licenseId: "FBM",
        link: licenseRefLink("FBM"),
    },
    {
        name: "Fraunhofer FDK AAC Codec Library",
        licenseId: "FDK-AAC",
        link: licenseRefLink("FDK-AAC"),
    },
    {
        name: "Ferguson Twofish License",
        licenseId: "Ferguson-Twofish",
        link: licenseRefLink("Ferguson-Twofish"),
    },
    {
        name: "Frameworx Open License 1.0",
        licenseId: "Frameworx-1.0",
        link: licenseRefLink("Frameworx-1.0"),
    },
    {
        name: "FreeBSD Documentation License",
        licenseId: "FreeBSD-DOC",
        link: licenseRefLink("FreeBSD-DOC"),
    },
    {
        name: "FreeImage Public License v1.0",
        licenseId: "FreeImage",
        link: licenseRefLink("FreeImage"),
    },
    {
        name: "FSF All Permissive License",
        licenseId: "FSFAP",
        link: licenseRefLink("FSFAP"),
    },
    {
        name: "FSF All Permissive License (without Warranty)",
        licenseId: "FSFAP-no-warranty-disclaimer",
        link: licenseRefLink("FSFAP-no-warranty-disclaimer"),
    },
    {
        name: "FSF Unlimited License",
        licenseId: "FSFUL",
        link: licenseRefLink("FSFUL"),
    },
    {
        name: "FSF Unlimited License (with License Retention)",
        licenseId: "FSFULLR",
        link: licenseRefLink("FSFULLR"),
    },
    {
        name: "FSF Unlimited License (With License Retention and Warranty Disclaimer)",
        licenseId: "FSFULLRWD",
        link: licenseRefLink("FSFULLRWD"),
    },
    {
        name: "Freetype Project License",
        licenseId: "FTL",
        link: licenseRefLink("FTL"),
    },
    {
        name: "Furuseth License",
        licenseId: "Furuseth",
        link: licenseRefLink("Furuseth"),
    },
    {
        name: "fwlw License",
        licenseId: "fwlw",
        link: licenseRefLink("fwlw"),
    },
    {
        name: "Gnome GCR Documentation License",
        licenseId: "GCR-docs",
        link: licenseRefLink("GCR-docs"),
    },
    {
        name: "GD License",
        licenseId: "GD",
        link: licenseRefLink("GD"),
    },
    {
        name: "GNU Free Documentation License v1.1",
        licenseId: "GFDL-1.1",
        link: licenseRefLink("GFDL-1.1"),
    },
    {
        name: "GNU Free Documentation License v1.1 only - invariants",
        licenseId: "GFDL-1.1-invariants-only",
        link: licenseRefLink("GFDL-1.1-invariants-only"),
    },
    {
        name: "GNU Free Documentation License v1.1 or later - invariants",
        licenseId: "GFDL-1.1-invariants-or-later",
        link: licenseRefLink("GFDL-1.1-invariants-or-later"),
    },
    {
        name: "GNU Free Documentation License v1.1 only - no invariants",
        licenseId: "GFDL-1.1-no-invariants-only",
        link: licenseRefLink("GFDL-1.1-no-invariants-only"),
    },
    {
        name: "GNU Free Documentation License v1.1 or later - no invariants",
        licenseId: "GFDL-1.1-no-invariants-or-later",
        link: licenseRefLink("GFDL-1.1-no-invariants-or-later"),
    },
    {
        name: "GNU Free Documentation License v1.1 only",
        licenseId: "GFDL-1.1-only",
        link: licenseRefLink("GFDL-1.1-only"),
    },
    {
        name: "GNU Free Documentation License v1.1 or later",
        licenseId: "GFDL-1.1-or-later",
        link: licenseRefLink("GFDL-1.1-or-later"),
    },
    {
        name: "GNU Free Documentation License v1.2",
        licenseId: "GFDL-1.2",
        link: licenseRefLink("GFDL-1.2"),
    },
    {
        name: "GNU Free Documentation License v1.2 only - invariants",
        licenseId: "GFDL-1.2-invariants-only",
        link: licenseRefLink("GFDL-1.2-invariants-only"),
    },
    {
        name: "GNU Free Documentation License v1.2 or later - invariants",
        licenseId: "GFDL-1.2-invariants-or-later",
        link: licenseRefLink("GFDL-1.2-invariants-or-later"),
    },
    {
        name: "GNU Free Documentation License v1.2 only - no invariants",
        licenseId: "GFDL-1.2-no-invariants-only",
        link: licenseRefLink("GFDL-1.2-no-invariants-only"),
    },
    {
        name: "GNU Free Documentation License v1.2 or later - no invariants",
        licenseId: "GFDL-1.2-no-invariants-or-later",
        link: licenseRefLink("GFDL-1.2-no-invariants-or-later"),
    },
    {
        name: "GNU Free Documentation License v1.2 only",
        licenseId: "GFDL-1.2-only",
        link: licenseRefLink("GFDL-1.2-only"),
    },
    {
        name: "GNU Free Documentation License v1.2 or later",
        licenseId: "GFDL-1.2-or-later",
        link: licenseRefLink("GFDL-1.2-or-later"),
    },
    {
        name: "GNU Free Documentation License v1.3",
        licenseId: "GFDL-1.3",
        link: licenseRefLink("GFDL-1.3"),
    },
    {
        name: "GNU Free Documentation License v1.3 only - invariants",
        licenseId: "GFDL-1.3-invariants-only",
        link: licenseRefLink("GFDL-1.3-invariants-only"),
    },
    {
        name: "GNU Free Documentation License v1.3 or later - invariants",
        licenseId: "GFDL-1.3-invariants-or-later",
        link: licenseRefLink("GFDL-1.3-invariants-or-later"),
    },
    {
        name: "GNU Free Documentation License v1.3 only - no invariants",
        licenseId: "GFDL-1.3-no-invariants-only",
        link: licenseRefLink("GFDL-1.3-no-invariants-only"),
    },
    {
        name: "GNU Free Documentation License v1.3 or later - no invariants",
        licenseId: "GFDL-1.3-no-invariants-or-later",
        link: licenseRefLink("GFDL-1.3-no-invariants-or-later"),
    },
    {
        name: "GNU Free Documentation License v1.3 only",
        licenseId: "GFDL-1.3-only",
        link: licenseRefLink("GFDL-1.3-only"),
    },
    {
        name: "GNU Free Documentation License v1.3 or later",
        licenseId: "GFDL-1.3-or-later",
        link: licenseRefLink("GFDL-1.3-or-later"),
    },
    {
        name: "Giftware License",
        licenseId: "Giftware",
        link: licenseRefLink("Giftware"),
    },
    {
        name: "GL2PS License",
        licenseId: "GL2PS",
        link: licenseRefLink("GL2PS"),
    },
    {
        name: "3dfx Glide License",
        licenseId: "Glide",
        link: licenseRefLink("Glide"),
    },
    {
        name: "Glulxe License",
        licenseId: "Glulxe",
        link: licenseRefLink("Glulxe"),
    },
    {
        name: "Good Luck With That Public License",
        licenseId: "GLWTPL",
        link: licenseRefLink("GLWTPL"),
    },
    {
        name: "gnuplot License",
        licenseId: "gnuplot",
        link: licenseRefLink("gnuplot"),
    },
    {
        name: "GNU General Public License v1.0",
        licenseId: "GPL-1.0",
        link: licenseRefLink("GPL-1.0"),
    },
    {
        name: "GNU General Public License v1.0 or later",
        licenseId: "GPL-1.0+",
        link: licenseRefLink("GPL-1.0+"),
    },
    {
        name: "GNU General Public License v1.0 only",
        licenseId: "GPL-1.0-only",
        link: licenseRefLink("GPL-1.0-only"),
    },
    {
        name: "GNU General Public License v1.0 or later",
        licenseId: "GPL-1.0-or-later",
        link: licenseRefLink("GPL-1.0-or-later"),
    },
    {
        name: "GNU General Public License v2.0",
        licenseId: "GPL-2.0",
        link: licenseRefLink("GPL-2.0"),
    },
    {
        name: "GNU General Public License v2.0 or later",
        licenseId: "GPL-2.0+",
        link: licenseRefLink("GPL-2.0+"),
    },
    {
        name: "GNU General Public License v2.0 only",
        licenseId: "GPL-2.0-only",
        link: licenseRefLink("GPL-2.0-only"),
    },
    {
        name: "GNU General Public License v2.0 or later",
        licenseId: "GPL-2.0-or-later",
        link: licenseRefLink("GPL-2.0-or-later"),
    },
    {
        name: "GNU General Public License v2.0 w/Autoconf exception",
        licenseId: "GPL-2.0-with-autoconf-exception",
        link: licenseRefLink("GPL-2.0-with-autoconf-exception"),
    },
    {
        name: "GNU General Public License v2.0 w/Bison exception",
        licenseId: "GPL-2.0-with-bison-exception",
        link: licenseRefLink("GPL-2.0-with-bison-exception"),
    },
    {
        name: "GNU General Public License v2.0 w/Classpath exception",
        licenseId: "GPL-2.0-with-classpath-exception",
        link: licenseRefLink("GPL-2.0-with-classpath-exception"),
    },
    {
        name: "GNU General Public License v2.0 w/Font exception",
        licenseId: "GPL-2.0-with-font-exception",
        link: licenseRefLink("GPL-2.0-with-font-exception"),
    },
    {
        name: "GNU General Public License v2.0 w/GCC Runtime Library exception",
        licenseId: "GPL-2.0-with-GCC-exception",
        link: licenseRefLink("GPL-2.0-with-GCC-exception"),
    },
    {
        name: "GNU General Public License v3.0",
        licenseId: "GPL-3.0",
        link: licenseRefLink("GPL-3.0"),
    },
    {
        name: "GNU General Public License v3.0 or later",
        licenseId: "GPL-3.0+",
        link: licenseRefLink("GPL-3.0+"),
    },
    {
        name: "GNU General Public License v3.0 only",
        licenseId: "GPL-3.0-only",
        link: licenseRefLink("GPL-3.0-only"),
    },
    {
        name: "GNU General Public License v3.0 or later",
        licenseId: "GPL-3.0-or-later",
        link: licenseRefLink("GPL-3.0-or-later"),
    },
    {
        name: "GNU General Public License v3.0 w/Autoconf exception",
        licenseId: "GPL-3.0-with-autoconf-exception",
        link: licenseRefLink("GPL-3.0-with-autoconf-exception"),
    },
    {
        name: "GNU General Public License v3.0 w/GCC Runtime Library exception",
        licenseId: "GPL-3.0-with-GCC-exception",
        link: licenseRefLink("GPL-3.0-with-GCC-exception"),
    },
    {
        name: "Graphics Gems License",
        licenseId: "Graphics-Gems",
        link: licenseRefLink("Graphics-Gems"),
    },
    {
        name: "gSOAP Public License v1.3b",
        licenseId: "gSOAP-1.3b",
        link: licenseRefLink("gSOAP-1.3b"),
    },
    {
        name: "gtkbook License",
        licenseId: "gtkbook",
        link: licenseRefLink("gtkbook"),
    },
    {
        name: "Gutmann License",
        licenseId: "Gutmann",
        link: licenseRefLink("Gutmann"),
    },
    {
        name: "Haskell Language Report License",
        licenseId: "HaskellReport",
        link: licenseRefLink("HaskellReport"),
    },
    {
        name: "hdparm License",
        licenseId: "hdparm",
        link: licenseRefLink("hdparm"),
    },
    {
        name: "HIDAPI License",
        licenseId: "HIDAPI",
        link: licenseRefLink("HIDAPI"),
    },
    {
        name: "Hippocratic License 2.1",
        licenseId: "Hippocratic-2.1",
        link: licenseRefLink("Hippocratic-2.1"),
    },
    {
        name: "Hewlett-Packard 1986 License",
        licenseId: "HP-1986",
        link: licenseRefLink("HP-1986"),
    },
    {
        name: "Hewlett-Packard 1989 License",
        licenseId: "HP-1989",
        link: licenseRefLink("HP-1989"),
    },
    {
        name: "Historical Permission Notice and Disclaimer",
        licenseId: "HPND",
        link: licenseRefLink("HPND"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - DEC variant",
        licenseId: "HPND-DEC",
        link: licenseRefLink("HPND-DEC"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - documentation variant",
        licenseId: "HPND-doc",
        link: licenseRefLink("HPND-doc"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - documentation sell variant",
        licenseId: "HPND-doc-sell",
        link: licenseRefLink("HPND-doc-sell"),
    },
    {
        name: "HPND with US Government export control warning",
        licenseId: "HPND-export-US",
        link: licenseRefLink("HPND-export-US"),
    },
    {
        name: "HPND with US Government export control warning and acknowledgment",
        licenseId: "HPND-export-US-acknowledgement",
        link: licenseRefLink("HPND-export-US-acknowledgement"),
    },
    {
        name: "HPND with US Government export control warning and modification rqmt",
        licenseId: "HPND-export-US-modify",
        link: licenseRefLink("HPND-export-US-modify"),
    },
    {
        name: "HPND with US Government export control and 2 disclaimers",
        licenseId: "HPND-export2-US",
        link: licenseRefLink("HPND-export2-US"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - Fenneberg-Livingston variant",
        licenseId: "HPND-Fenneberg-Livingston",
        link: licenseRefLink("HPND-Fenneberg-Livingston"),
    },
    {
        name: "Historical Permission Notice and Disclaimer    - INRIA-IMAG variant",
        licenseId: "HPND-INRIA-IMAG",
        link: licenseRefLink("HPND-INRIA-IMAG"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - Intel variant",
        licenseId: "HPND-Intel",
        link: licenseRefLink("HPND-Intel"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - Kevlin Henney variant",
        licenseId: "HPND-Kevlin-Henney",
        link: licenseRefLink("HPND-Kevlin-Henney"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - Markus Kuhn variant",
        licenseId: "HPND-Markus-Kuhn",
        link: licenseRefLink("HPND-Markus-Kuhn"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - merchantability variant",
        licenseId: "HPND-merchantability-variant",
        link: licenseRefLink("HPND-merchantability-variant"),
    },
    {
        name: "Historical Permission Notice and Disclaimer with MIT disclaimer",
        licenseId: "HPND-MIT-disclaimer",
        link: licenseRefLink("HPND-MIT-disclaimer"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - Netrek variant",
        licenseId: "HPND-Netrek",
        link: licenseRefLink("HPND-Netrek"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - Pbmplus variant",
        licenseId: "HPND-Pbmplus",
        link: licenseRefLink("HPND-Pbmplus"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - sell xserver variant with MIT disclaimer",
        licenseId: "HPND-sell-MIT-disclaimer-xserver",
        link: licenseRefLink("HPND-sell-MIT-disclaimer-xserver"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - sell regexpr variant",
        licenseId: "HPND-sell-regexpr",
        link: licenseRefLink("HPND-sell-regexpr"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - sell variant",
        licenseId: "HPND-sell-variant",
        link: licenseRefLink("HPND-sell-variant"),
    },
    {
        name: "HPND sell variant with MIT disclaimer",
        licenseId: "HPND-sell-variant-MIT-disclaimer",
        link: licenseRefLink("HPND-sell-variant-MIT-disclaimer"),
    },
    {
        name: "HPND sell variant with MIT disclaimer - reverse",
        licenseId: "HPND-sell-variant-MIT-disclaimer-rev",
        link: licenseRefLink("HPND-sell-variant-MIT-disclaimer-rev"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - University of California variant",
        licenseId: "HPND-UC",
        link: licenseRefLink("HPND-UC"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - University of California, US export warning",
        licenseId: "HPND-UC-export-US",
        link: licenseRefLink("HPND-UC-export-US"),
    },
    {
        name: "HTML Tidy License",
        licenseId: "HTMLTIDY",
        link: licenseRefLink("HTMLTIDY"),
    },
    {
        name: "IBM PowerPC Initialization and Boot Software",
        licenseId: "IBM-pibs",
        link: licenseRefLink("IBM-pibs"),
    },
    {
        name: "ICU License",
        licenseId: "ICU",
        link: licenseRefLink("ICU"),
    },
    {
        name: "IEC    Code Components End-user licence agreement",
        licenseId: "IEC-Code-Components-EULA",
        link: licenseRefLink("IEC-Code-Components-EULA"),
    },
    {
        name: "Independent JPEG Group License",
        licenseId: "IJG",
        link: licenseRefLink("IJG"),
    },
    {
        name: "Independent JPEG Group License - short",
        licenseId: "IJG-short",
        link: licenseRefLink("IJG-short"),
    },
    {
        name: "ImageMagick License",
        licenseId: "ImageMagick",
        link: licenseRefLink("ImageMagick"),
    },
    {
        name: "iMatix Standard Function Library Agreement",
        licenseId: "iMatix",
        link: licenseRefLink("iMatix"),
    },
    {
        name: "Imlib2 License",
        licenseId: "Imlib2",
        link: licenseRefLink("Imlib2"),
    },
    {
        name: "Info-ZIP License",
        licenseId: "Info-ZIP",
        link: licenseRefLink("Info-ZIP"),
    },
    {
        name: "Inner Net License v2.0",
        licenseId: "Inner-Net-2.0",
        link: licenseRefLink("Inner-Net-2.0"),
    },
    {
        name: "Intel Open Source License",
        licenseId: "Intel",
        link: licenseRefLink("Intel"),
    },
    {
        name: "Intel ACPI Software License Agreement",
        licenseId: "Intel-ACPI",
        link: licenseRefLink("Intel-ACPI"),
    },
    {
        name: "Interbase Public License v1.0",
        licenseId: "Interbase-1.0",
        link: licenseRefLink("Interbase-1.0"),
    },
    {
        name: "IPA Font License",
        licenseId: "IPA",
        link: licenseRefLink("IPA"),
    },
    {
        name: "IBM Public License v1.0",
        licenseId: "IPL-1.0",
        link: licenseRefLink("IPL-1.0"),
    },
    {
        name: "ISC License",
        licenseId: "ISC",
        link: licenseRefLink("ISC"),
    },
    {
        name: "ISC Veillard variant",
        licenseId: "ISC-Veillard",
        link: licenseRefLink("ISC-Veillard"),
    },
    {
        name: "Jam License",
        licenseId: "Jam",
        link: licenseRefLink("Jam"),
    },
    {
        name: "JasPer License",
        licenseId: "JasPer-2.0",
        link: licenseRefLink("JasPer-2.0"),
    },
    {
        name: "JPL Image Use Policy",
        licenseId: "JPL-image",
        link: licenseRefLink("JPL-image"),
    },
    {
        name: "Japan Network Information Center License",
        licenseId: "JPNIC",
        link: licenseRefLink("JPNIC"),
    },
    {
        name: "JSON License",
        licenseId: "JSON",
        link: licenseRefLink("JSON"),
    },
    {
        name: "Kastrup License",
        licenseId: "Kastrup",
        link: licenseRefLink("Kastrup"),
    },
    {
        name: "Kazlib License",
        licenseId: "Kazlib",
        link: licenseRefLink("Kazlib"),
    },
    {
        name: "Knuth CTAN License",
        licenseId: "Knuth-CTAN",
        link: licenseRefLink("Knuth-CTAN"),
    },
    {
        name: "Licence Art Libre 1.2",
        licenseId: "LAL-1.2",
        link: licenseRefLink("LAL-1.2"),
    },
    {
        name: "Licence Art Libre 1.3",
        licenseId: "LAL-1.3",
        link: licenseRefLink("LAL-1.3"),
    },
    {
        name: "Latex2e License",
        licenseId: "Latex2e",
        link: licenseRefLink("Latex2e"),
    },
    {
        name: "Latex2e with translated notice permission",
        licenseId: "Latex2e-translated-notice",
        link: licenseRefLink("Latex2e-translated-notice"),
    },
    {
        name: "Leptonica License",
        licenseId: "Leptonica",
        link: licenseRefLink("Leptonica"),
    },
    {
        name: "GNU Library General Public License v2",
        licenseId: "LGPL-2.0",
        link: licenseRefLink("LGPL-2.0"),
    },
    {
        name: "GNU Library General Public License v2 or later",
        licenseId: "LGPL-2.0+",
        link: licenseRefLink("LGPL-2.0+"),
    },
    {
        name: "GNU Library General Public License v2 only",
        licenseId: "LGPL-2.0-only",
        link: licenseRefLink("LGPL-2.0-only"),
    },
    {
        name: "GNU Library General Public License v2 or later",
        licenseId: "LGPL-2.0-or-later",
        link: licenseRefLink("LGPL-2.0-or-later"),
    },
    {
        name: "GNU Lesser General Public License v2.1",
        licenseId: "LGPL-2.1",
        link: licenseRefLink("LGPL-2.1"),
    },
    {
        name: "GNU Lesser General Public License v2.1 or later",
        licenseId: "LGPL-2.1+",
        link: licenseRefLink("LGPL-2.1+"),
    },
    {
        name: "GNU Lesser General Public License v2.1 only",
        licenseId: "LGPL-2.1-only",
        link: licenseRefLink("LGPL-2.1-only"),
    },
    {
        name: "GNU Lesser General Public License v2.1 or later",
        licenseId: "LGPL-2.1-or-later",
        link: licenseRefLink("LGPL-2.1-or-later"),
    },
    {
        name: "GNU Lesser General Public License v3.0",
        licenseId: "LGPL-3.0",
        link: licenseRefLink("LGPL-3.0"),
    },
    {
        name: "GNU Lesser General Public License v3.0 or later",
        licenseId: "LGPL-3.0+",
        link: licenseRefLink("LGPL-3.0+"),
    },
    {
        name: "GNU Lesser General Public License v3.0 only",
        licenseId: "LGPL-3.0-only",
        link: licenseRefLink("LGPL-3.0-only"),
    },
    {
        name: "GNU Lesser General Public License v3.0 or later",
        licenseId: "LGPL-3.0-or-later",
        link: licenseRefLink("LGPL-3.0-or-later"),
    },
    {
        name: "Lesser General Public License For Linguistic Resources",
        licenseId: "LGPLLR",
        link: licenseRefLink("LGPLLR"),
    },
    {
        name: "libpng License",
        licenseId: "Libpng",
        link: licenseRefLink("Libpng"),
    },
    {
        name: "PNG Reference Library version 2",
        licenseId: "libpng-2.0",
        link: licenseRefLink("libpng-2.0"),
    },
    {
        name: "libselinux public domain notice",
        licenseId: "libselinux-1.0",
        link: licenseRefLink("libselinux-1.0"),
    },
    {
        name: "libtiff License",
        licenseId: "libtiff",
        link: licenseRefLink("libtiff"),
    },
    {
        name: "libutil David Nugent License",
        licenseId: "libutil-David-Nugent",
        link: licenseRefLink("libutil-David-Nugent"),
    },
    {
        name: "Licence Libre du Québec – Permissive version 1.1",
        licenseId: "LiLiQ-P-1.1",
        link: licenseRefLink("LiLiQ-P-1.1"),
    },
    {
        name: "Licence Libre du Québec – Réciprocité version 1.1",
        licenseId: "LiLiQ-R-1.1",
        link: licenseRefLink("LiLiQ-R-1.1"),
    },
    {
        name: "Licence Libre du Québec – Réciprocité forte version 1.1",
        licenseId: "LiLiQ-Rplus-1.1",
        link: licenseRefLink("LiLiQ-Rplus-1.1"),
    },
    {
        name: "Linux man-pages - 1 paragraph",
        licenseId: "Linux-man-pages-1-para",
        link: licenseRefLink("Linux-man-pages-1-para"),
    },
    {
        name: "Linux man-pages Copyleft",
        licenseId: "Linux-man-pages-copyleft",
        link: licenseRefLink("Linux-man-pages-copyleft"),
    },
    {
        name: "Linux man-pages Copyleft - 2 paragraphs",
        licenseId: "Linux-man-pages-copyleft-2-para",
        link: licenseRefLink("Linux-man-pages-copyleft-2-para"),
    },
    {
        name: "Linux man-pages Copyleft Variant",
        licenseId: "Linux-man-pages-copyleft-var",
        link: licenseRefLink("Linux-man-pages-copyleft-var"),
    },
    {
        name: "Linux Kernel Variant of OpenIB.org license",
        licenseId: "Linux-OpenIB",
        link: licenseRefLink("Linux-OpenIB"),
    },
    {
        name: "Common Lisp LOOP License",
        licenseId: "LOOP",
        link: licenseRefLink("LOOP"),
    },
    {
        name: "LPD Documentation License",
        licenseId: "LPD-document",
        link: licenseRefLink("LPD-document"),
    },
    {
        name: "Lucent Public License Version 1.0",
        licenseId: "LPL-1.0",
        link: licenseRefLink("LPL-1.0"),
    },
    {
        name: "Lucent Public License v1.02",
        licenseId: "LPL-1.02",
        link: licenseRefLink("LPL-1.02"),
    },
    {
        name: "LaTeX Project Public License v1.0",
        licenseId: "LPPL-1.0",
        link: licenseRefLink("LPPL-1.0"),
    },
    {
        name: "LaTeX Project Public License v1.1",
        licenseId: "LPPL-1.1",
        link: licenseRefLink("LPPL-1.1"),
    },
    {
        name: "LaTeX Project Public License v1.2",
        licenseId: "LPPL-1.2",
        link: licenseRefLink("LPPL-1.2"),
    },
    {
        name: "LaTeX Project Public License v1.3a",
        licenseId: "LPPL-1.3a",
        link: licenseRefLink("LPPL-1.3a"),
    },
    {
        name: "LaTeX Project Public License v1.3c",
        licenseId: "LPPL-1.3c",
        link: licenseRefLink("LPPL-1.3c"),
    },
    {
        name: "lsof License",
        licenseId: "lsof",
        link: licenseRefLink("lsof"),
    },
    {
        name: "Lucida Bitmap Fonts License",
        licenseId: "Lucida-Bitmap-Fonts",
        link: licenseRefLink("Lucida-Bitmap-Fonts"),
    },
    {
        name: "LZMA SDK License (versions 9.11 to 9.20)",
        licenseId: "LZMA-SDK-9.11-to-9.20",
        link: licenseRefLink("LZMA-SDK-9.11-to-9.20"),
    },
    {
        name: "LZMA SDK License (versions 9.22 and beyond)",
        licenseId: "LZMA-SDK-9.22",
        link: licenseRefLink("LZMA-SDK-9.22"),
    },
    {
        name: "Mackerras 3-Clause License",
        licenseId: "Mackerras-3-Clause",
        link: licenseRefLink("Mackerras-3-Clause"),
    },
    {
        name: "Mackerras 3-Clause - acknowledgment variant",
        licenseId: "Mackerras-3-Clause-acknowledgment",
        link: licenseRefLink("Mackerras-3-Clause-acknowledgment"),
    },
    {
        name: "magaz License",
        licenseId: "magaz",
        link: licenseRefLink("magaz"),
    },
    {
        name: "mailprio License",
        licenseId: "mailprio",
        link: licenseRefLink("mailprio"),
    },
    {
        name: "MakeIndex License",
        licenseId: "MakeIndex",
        link: licenseRefLink("MakeIndex"),
    },
    {
        name: "Martin Birgmeier License",
        licenseId: "Martin-Birgmeier",
        link: licenseRefLink("Martin-Birgmeier"),
    },
    {
        name: "McPhee Slideshow License",
        licenseId: "McPhee-slideshow",
        link: licenseRefLink("McPhee-slideshow"),
    },
    {
        name: "metamail License",
        licenseId: "metamail",
        link: licenseRefLink("metamail"),
    },
    {
        name: "Minpack License",
        licenseId: "Minpack",
        link: licenseRefLink("Minpack"),
    },
    {
        name: "The MirOS Licence",
        licenseId: "MirOS",
        link: licenseRefLink("MirOS"),
    },
    {
        name: "MIT License",
        licenseId: "MIT",
        link: licenseRefLink("MIT"),
    },
    {
        name: "MIT No Attribution",
        licenseId: "MIT-0",
        link: licenseRefLink("MIT-0"),
    },
    {
        name: "Enlightenment License (e16)",
        licenseId: "MIT-advertising",
        link: licenseRefLink("MIT-advertising"),
    },
    {
        name: "MIT Click License",
        licenseId: "MIT-Click",
        link: licenseRefLink("MIT-Click"),
    },
    {
        name: "CMU License",
        licenseId: "MIT-CMU",
        link: licenseRefLink("MIT-CMU"),
    },
    {
        name: "enna License",
        licenseId: "MIT-enna",
        link: licenseRefLink("MIT-enna"),
    },
    {
        name: "feh License",
        licenseId: "MIT-feh",
        link: licenseRefLink("MIT-feh"),
    },
    {
        name: "MIT Festival Variant",
        licenseId: "MIT-Festival",
        link: licenseRefLink("MIT-Festival"),
    },
    {
        name: "MIT Khronos - old variant",
        licenseId: "MIT-Khronos-old",
        link: licenseRefLink("MIT-Khronos-old"),
    },
    {
        name: "MIT License Modern Variant",
        licenseId: "MIT-Modern-Variant",
        link: licenseRefLink("MIT-Modern-Variant"),
    },
    {
        name: "MIT Open Group variant",
        licenseId: "MIT-open-group",
        link: licenseRefLink("MIT-open-group"),
    },
    {
        name: "MIT testregex Variant",
        licenseId: "MIT-testregex",
        link: licenseRefLink("MIT-testregex"),
    },
    {
        name: "MIT Tom Wu Variant",
        licenseId: "MIT-Wu",
        link: licenseRefLink("MIT-Wu"),
    },
    {
        name: "MIT +no-false-attribs license",
        licenseId: "MITNFA",
        link: licenseRefLink("MITNFA"),
    },
    {
        name: "MMIXware License",
        licenseId: "MMIXware",
        link: licenseRefLink("MMIXware"),
    },
    {
        name: "Motosoto License",
        licenseId: "Motosoto",
        link: licenseRefLink("Motosoto"),
    },
    {
        name: "MPEG Software Simulation",
        licenseId: "MPEG-SSG",
        link: licenseRefLink("MPEG-SSG"),
    },
    {
        name: "mpi Permissive License",
        licenseId: "mpi-permissive",
        link: licenseRefLink("mpi-permissive"),
    },
    {
        name: "mpich2 License",
        licenseId: "mpich2",
        link: licenseRefLink("mpich2"),
    },
    {
        name: "Mozilla Public License 1.0",
        licenseId: "MPL-1.0",
        link: licenseRefLink("MPL-1.0"),
    },
    {
        name: "Mozilla Public License 1.1",
        licenseId: "MPL-1.1",
        link: licenseRefLink("MPL-1.1"),
    },
    {
        name: "Mozilla Public License 2.0",
        licenseId: "MPL-2.0",
        link: licenseRefLink("MPL-2.0"),
    },
    {
        name: "Mozilla Public License 2.0 (no copyleft exception)",
        licenseId: "MPL-2.0-no-copyleft-exception",
        link: licenseRefLink("MPL-2.0-no-copyleft-exception"),
    },
    {
        name: "mplus Font License",
        licenseId: "mplus",
        link: licenseRefLink("mplus"),
    },
    {
        name: "Microsoft Limited Public License",
        licenseId: "MS-LPL",
        link: licenseRefLink("MS-LPL"),
    },
    {
        name: "Microsoft Public License",
        licenseId: "MS-PL",
        link: licenseRefLink("MS-PL"),
    },
    {
        name: "Microsoft Reciprocal License",
        licenseId: "MS-RL",
        link: licenseRefLink("MS-RL"),
    },
    {
        name: "Matrix Template Library License",
        licenseId: "MTLL",
        link: licenseRefLink("MTLL"),
    },
    {
        name: "Mulan Permissive Software License, Version 1",
        licenseId: "MulanPSL-1.0",
        link: licenseRefLink("MulanPSL-1.0"),
    },
    {
        name: "Mulan Permissive Software License, Version 2",
        licenseId: "MulanPSL-2.0",
        link: licenseRefLink("MulanPSL-2.0"),
    },
    {
        name: "Multics License",
        licenseId: "Multics",
        link: licenseRefLink("Multics"),
    },
    {
        name: "Mup License",
        licenseId: "Mup",
        link: licenseRefLink("Mup"),
    },
    {
        name: "Nara Institute of Science and Technology License (2003)",
        licenseId: "NAIST-2003",
        link: licenseRefLink("NAIST-2003"),
    },
    {
        name: "NASA Open Source Agreement 1.3",
        licenseId: "NASA-1.3",
        link: licenseRefLink("NASA-1.3"),
    },
    {
        name: "Naumen Public License",
        licenseId: "Naumen",
        link: licenseRefLink("Naumen"),
    },
    {
        name: "Net Boolean Public License v1",
        licenseId: "NBPL-1.0",
        link: licenseRefLink("NBPL-1.0"),
    },
    {
        name: "NCBI Public Domain Notice",
        licenseId: "NCBI-PD",
        link: licenseRefLink("NCBI-PD"),
    },
    {
        name: "Non-Commercial Government Licence",
        licenseId: "NCGL-UK-2.0",
        link: licenseRefLink("NCGL-UK-2.0"),
    },
    {
        name: "NCL Source Code License",
        licenseId: "NCL",
        link: licenseRefLink("NCL"),
    },
    {
        name: "University of Illinois/NCSA Open Source License",
        licenseId: "NCSA",
        link: licenseRefLink("NCSA"),
    },
    {
        name: "Net-SNMP License",
        licenseId: "Net-SNMP",
        link: licenseRefLink("Net-SNMP"),
    },
    {
        name: "NetCDF license",
        licenseId: "NetCDF",
        link: licenseRefLink("NetCDF"),
    },
    {
        name: "Newsletr License",
        licenseId: "Newsletr",
        link: licenseRefLink("Newsletr"),
    },
    {
        name: "Nethack General Public License",
        licenseId: "NGPL",
        link: licenseRefLink("NGPL"),
    },
    {
        name: "NICTA Public Software License, Version 1.0",
        licenseId: "NICTA-1.0",
        link: licenseRefLink("NICTA-1.0"),
    },
    {
        name: "NIST Public Domain Notice",
        licenseId: "NIST-PD",
        link: licenseRefLink("NIST-PD"),
    },
    {
        name: "NIST Public Domain Notice with license fallback",
        licenseId: "NIST-PD-fallback",
        link: licenseRefLink("NIST-PD-fallback"),
    },
    {
        name: "NIST Software License",
        licenseId: "NIST-Software",
        link: licenseRefLink("NIST-Software"),
    },
    {
        name: "Norwegian Licence for Open Government Data (NLOD) 1.0",
        licenseId: "NLOD-1.0",
        link: licenseRefLink("NLOD-1.0"),
    },
    {
        name: "Norwegian Licence for Open Government Data (NLOD) 2.0",
        licenseId: "NLOD-2.0",
        link: licenseRefLink("NLOD-2.0"),
    },
    {
        name: "No Limit Public License",
        licenseId: "NLPL",
        link: licenseRefLink("NLPL"),
    },
    {
        name: "Nokia Open Source License",
        licenseId: "Nokia",
        link: licenseRefLink("Nokia"),
    },
    {
        name: "Netizen Open Source License",
        licenseId: "NOSL",
        link: licenseRefLink("NOSL"),
    },
    {
        name: "Noweb License",
        licenseId: "Noweb",
        link: licenseRefLink("Noweb"),
    },
    {
        name: "Netscape Public License v1.0",
        licenseId: "NPL-1.0",
        link: licenseRefLink("NPL-1.0"),
    },
    {
        name: "Netscape Public License v1.1",
        licenseId: "NPL-1.1",
        link: licenseRefLink("NPL-1.1"),
    },
    {
        name: "Non-Profit Open Software License 3.0",
        licenseId: "NPOSL-3.0",
        link: licenseRefLink("NPOSL-3.0"),
    },
    {
        name: "NRL License",
        licenseId: "NRL",
        link: licenseRefLink("NRL"),
    },
    {
        name: "NTP License",
        licenseId: "NTP",
        link: licenseRefLink("NTP"),
    },
    {
        name: "NTP No Attribution",
        licenseId: "NTP-0",
        link: licenseRefLink("NTP-0"),
    },
    {
        name: "Nunit License",
        licenseId: "Nunit",
        link: licenseRefLink("Nunit"),
    },
    {
        name: "Open Use of Data Agreement v1.0",
        licenseId: "O-UDA-1.0",
        link: licenseRefLink("O-UDA-1.0"),
    },
    {
        name: "OAR License",
        licenseId: "OAR",
        link: licenseRefLink("OAR"),
    },
    {
        name: "Open CASCADE Technology Public License",
        licenseId: "OCCT-PL",
        link: licenseRefLink("OCCT-PL"),
    },
    {
        name: "OCLC Research Public License 2.0",
        licenseId: "OCLC-2.0",
        link: licenseRefLink("OCLC-2.0"),
    },
    {
        name: "Open Data Commons Open Database License v1.0",
        licenseId: "ODbL-1.0",
        link: licenseRefLink("ODbL-1.0"),
    },
    {
        name: "Open Data Commons Attribution License v1.0",
        licenseId: "ODC-By-1.0",
        link: licenseRefLink("ODC-By-1.0"),
    },
    {
        name: "OFFIS License",
        licenseId: "OFFIS",
        link: licenseRefLink("OFFIS"),
    },
    {
        name: "SIL Open Font License 1.0",
        licenseId: "OFL-1.0",
        link: licenseRefLink("OFL-1.0"),
    },
    {
        name: "SIL Open Font License 1.0 with no Reserved Font Name",
        licenseId: "OFL-1.0-no-RFN",
        link: licenseRefLink("OFL-1.0-no-RFN"),
    },
    {
        name: "SIL Open Font License 1.0 with Reserved Font Name",
        licenseId: "OFL-1.0-RFN",
        link: licenseRefLink("OFL-1.0-RFN"),
    },
    {
        name: "SIL Open Font License 1.1",
        licenseId: "OFL-1.1",
        link: licenseRefLink("OFL-1.1"),
    },
    {
        name: "SIL Open Font License 1.1 with no Reserved Font Name",
        licenseId: "OFL-1.1-no-RFN",
        link: licenseRefLink("OFL-1.1-no-RFN"),
    },
    {
        name: "SIL Open Font License 1.1 with Reserved Font Name",
        licenseId: "OFL-1.1-RFN",
        link: licenseRefLink("OFL-1.1-RFN"),
    },
    {
        name: "OGC Software License, Version 1.0",
        licenseId: "OGC-1.0",
        link: licenseRefLink("OGC-1.0"),
    },
    {
        name: "Taiwan Open Government Data License, version 1.0",
        licenseId: "OGDL-Taiwan-1.0",
        link: licenseRefLink("OGDL-Taiwan-1.0"),
    },
    {
        name: "Open Government Licence - Canada",
        licenseId: "OGL-Canada-2.0",
        link: licenseRefLink("OGL-Canada-2.0"),
    },
    {
        name: "Open Government Licence v1.0",
        licenseId: "OGL-UK-1.0",
        link: licenseRefLink("OGL-UK-1.0"),
    },
    {
        name: "Open Government Licence v2.0",
        licenseId: "OGL-UK-2.0",
        link: licenseRefLink("OGL-UK-2.0"),
    },
    {
        name: "Open Government Licence v3.0",
        licenseId: "OGL-UK-3.0",
        link: licenseRefLink("OGL-UK-3.0"),
    },
    {
        name: "Open Group Test Suite License",
        licenseId: "OGTSL",
        link: licenseRefLink("OGTSL"),
    },
    {
        name: "Open LDAP Public License v1.1",
        licenseId: "OLDAP-1.1",
        link: licenseRefLink("OLDAP-1.1"),
    },
    {
        name: "Open LDAP Public License v1.2",
        licenseId: "OLDAP-1.2",
        link: licenseRefLink("OLDAP-1.2"),
    },
    {
        name: "Open LDAP Public License v1.3",
        licenseId: "OLDAP-1.3",
        link: licenseRefLink("OLDAP-1.3"),
    },
    {
        name: "Open LDAP Public License v1.4",
        licenseId: "OLDAP-1.4",
        link: licenseRefLink("OLDAP-1.4"),
    },
    {
        name: "Open LDAP Public License v2.0 (or possibly 2.0A and 2.0B)",
        licenseId: "OLDAP-2.0",
        link: licenseRefLink("OLDAP-2.0"),
    },
    {
        name: "Open LDAP Public License v2.0.1",
        licenseId: "OLDAP-2.0.1",
        link: licenseRefLink("OLDAP-2.0.1"),
    },
    {
        name: "Open LDAP Public License v2.1",
        licenseId: "OLDAP-2.1",
        link: licenseRefLink("OLDAP-2.1"),
    },
    {
        name: "Open LDAP Public License v2.2",
        licenseId: "OLDAP-2.2",
        link: licenseRefLink("OLDAP-2.2"),
    },
    {
        name: "Open LDAP Public License v2.2.1",
        licenseId: "OLDAP-2.2.1",
        link: licenseRefLink("OLDAP-2.2.1"),
    },
    {
        name: "Open LDAP Public License 2.2.2",
        licenseId: "OLDAP-2.2.2",
        link: licenseRefLink("OLDAP-2.2.2"),
    },
    {
        name: "Open LDAP Public License v2.3",
        licenseId: "OLDAP-2.3",
        link: licenseRefLink("OLDAP-2.3"),
    },
    {
        name: "Open LDAP Public License v2.4",
        licenseId: "OLDAP-2.4",
        link: licenseRefLink("OLDAP-2.4"),
    },
    {
        name: "Open LDAP Public License v2.5",
        licenseId: "OLDAP-2.5",
        link: licenseRefLink("OLDAP-2.5"),
    },
    {
        name: "Open LDAP Public License v2.6",
        licenseId: "OLDAP-2.6",
        link: licenseRefLink("OLDAP-2.6"),
    },
    {
        name: "Open LDAP Public License v2.7",
        licenseId: "OLDAP-2.7",
        link: licenseRefLink("OLDAP-2.7"),
    },
    {
        name: "Open LDAP Public License v2.8",
        licenseId: "OLDAP-2.8",
        link: licenseRefLink("OLDAP-2.8"),
    },
    {
        name: "Open Logistics Foundation License Version 1.3",
        licenseId: "OLFL-1.3",
        link: licenseRefLink("OLFL-1.3"),
    },
    {
        name: "Open Market License",
        licenseId: "OML",
        link: licenseRefLink("OML"),
    },
    {
        name: "OpenPBS v2.3 Software License",
        licenseId: "OpenPBS-2.3",
        link: licenseRefLink("OpenPBS-2.3"),
    },
    {
        name: "OpenSSL License",
        licenseId: "OpenSSL",
        link: licenseRefLink("OpenSSL"),
    },
    {
        name: "OpenSSL License - standalone",
        licenseId: "OpenSSL-standalone",
        link: licenseRefLink("OpenSSL-standalone"),
    },
    {
        name: "OpenVision License",
        licenseId: "OpenVision",
        link: licenseRefLink("OpenVision"),
    },
    {
        name: "Open Public License v1.0",
        licenseId: "OPL-1.0",
        link: licenseRefLink("OPL-1.0"),
    },
    {
        name: "United    Kingdom Open Parliament Licence v3.0",
        licenseId: "OPL-UK-3.0",
        link: licenseRefLink("OPL-UK-3.0"),
    },
    {
        name: "Open Publication License v1.0",
        licenseId: "OPUBL-1.0",
        link: licenseRefLink("OPUBL-1.0"),
    },
    {
        name: "OSET Public License version 2.1",
        licenseId: "OSET-PL-2.1",
        link: licenseRefLink("OSET-PL-2.1"),
    },
    {
        name: "Open Software License 1.0",
        licenseId: "OSL-1.0",
        link: licenseRefLink("OSL-1.0"),
    },
    {
        name: "Open Software License 1.1",
        licenseId: "OSL-1.1",
        link: licenseRefLink("OSL-1.1"),
    },
    {
        name: "Open Software License 2.0",
        licenseId: "OSL-2.0",
        link: licenseRefLink("OSL-2.0"),
    },
    {
        name: "Open Software License 2.1",
        licenseId: "OSL-2.1",
        link: licenseRefLink("OSL-2.1"),
    },
    {
        name: "Open Software License 3.0",
        licenseId: "OSL-3.0",
        link: licenseRefLink("OSL-3.0"),
    },
    {
        name: "PADL License",
        licenseId: "PADL",
        link: licenseRefLink("PADL"),
    },
    {
        name: "The Parity Public License 6.0.0",
        licenseId: "Parity-6.0.0",
        link: licenseRefLink("Parity-6.0.0"),
    },
    {
        name: "The Parity Public License 7.0.0",
        licenseId: "Parity-7.0.0",
        link: licenseRefLink("Parity-7.0.0"),
    },
    {
        name: "Open Data Commons Public Domain Dedication \u0026 License 1.0",
        licenseId: "PDDL-1.0",
        link: licenseRefLink("PDDL-1.0"),
    },
    {
        name: "PHP License v3.0",
        licenseId: "PHP-3.0",
        link: licenseRefLink("PHP-3.0"),
    },
    {
        name: "PHP License v3.01",
        licenseId: "PHP-3.01",
        link: licenseRefLink("PHP-3.01"),
    },
    {
        name: "Pixar License",
        licenseId: "Pixar",
        link: licenseRefLink("Pixar"),
    },
    {
        name: "pkgconf License",
        licenseId: "pkgconf",
        link: licenseRefLink("pkgconf"),
    },
    {
        name: "Plexus Classworlds License",
        licenseId: "Plexus",
        link: licenseRefLink("Plexus"),
    },
    {
        name: "pnmstitch License",
        licenseId: "pnmstitch",
        link: licenseRefLink("pnmstitch"),
    },
    {
        name: "PolyForm Noncommercial License 1.0.0",
        licenseId: "PolyForm-Noncommercial-1.0.0",
        link: licenseRefLink("PolyForm-Noncommercial-1.0.0"),
    },
    {
        name: "PolyForm Small Business License 1.0.0",
        licenseId: "PolyForm-Small-Business-1.0.0",
        link: licenseRefLink("PolyForm-Small-Business-1.0.0"),
    },
    {
        name: "PostgreSQL License",
        licenseId: "PostgreSQL",
        link: licenseRefLink("PostgreSQL"),
    },
    {
        name: "Peer Production License",
        licenseId: "PPL",
        link: licenseRefLink("PPL"),
    },
    {
        name: "Python Software Foundation License 2.0",
        licenseId: "PSF-2.0",
        link: licenseRefLink("PSF-2.0"),
    },
    {
        name: "psfrag License",
        licenseId: "psfrag",
        link: licenseRefLink("psfrag"),
    },
    {
        name: "psutils License",
        licenseId: "psutils",
        link: licenseRefLink("psutils"),
    },
    {
        name: "Python License 2.0",
        licenseId: "Python-2.0",
        link: licenseRefLink("Python-2.0"),
    },
    {
        name: "Python License 2.0.1",
        licenseId: "Python-2.0.1",
        link: licenseRefLink("Python-2.0.1"),
    },
    {
        name: "Python ldap License",
        licenseId: "python-ldap",
        link: licenseRefLink("python-ldap"),
    },
    {
        name: "Qhull License",
        licenseId: "Qhull",
        link: licenseRefLink("Qhull"),
    },
    {
        name: "Q Public License 1.0",
        licenseId: "QPL-1.0",
        link: licenseRefLink("QPL-1.0"),
    },
    {
        name: "Q Public License 1.0 - INRIA 2004 variant",
        licenseId: "QPL-1.0-INRIA-2004",
        link: licenseRefLink("QPL-1.0-INRIA-2004"),
    },
    {
        name: "radvd License",
        licenseId: "radvd",
        link: licenseRefLink("radvd"),
    },
    {
        name: "Rdisc License",
        licenseId: "Rdisc",
        link: licenseRefLink("Rdisc"),
    },
    {
        name: "Red Hat eCos Public License v1.1",
        licenseId: "RHeCos-1.1",
        link: licenseRefLink("RHeCos-1.1"),
    },
    {
        name: "Reciprocal Public License 1.1",
        licenseId: "RPL-1.1",
        link: licenseRefLink("RPL-1.1"),
    },
    {
        name: "Reciprocal Public License 1.5",
        licenseId: "RPL-1.5",
        link: licenseRefLink("RPL-1.5"),
    },
    {
        name: "RealNetworks Public Source License v1.0",
        licenseId: "RPSL-1.0",
        link: licenseRefLink("RPSL-1.0"),
    },
    {
        name: "RSA Message-Digest License",
        licenseId: "RSA-MD",
        link: licenseRefLink("RSA-MD"),
    },
    {
        name: "Ricoh Source Code Public License",
        licenseId: "RSCPL",
        link: licenseRefLink("RSCPL"),
    },
    {
        name: "Ruby License",
        licenseId: "Ruby",
        link: licenseRefLink("Ruby"),
    },
    {
        name: "Ruby pty extension license",
        licenseId: "Ruby-pty",
        link: licenseRefLink("Ruby-pty"),
    },
    {
        name: "Sax Public Domain Notice",
        licenseId: "SAX-PD",
        link: licenseRefLink("SAX-PD"),
    },
    {
        name: "Sax Public Domain Notice 2.0",
        licenseId: "SAX-PD-2.0",
        link: licenseRefLink("SAX-PD-2.0"),
    },
    {
        name: "Saxpath License",
        licenseId: "Saxpath",
        link: licenseRefLink("Saxpath"),
    },
    {
        name: "SCEA Shared Source License",
        licenseId: "SCEA",
        link: licenseRefLink("SCEA"),
    },
    {
        name: "Scheme Language Report License",
        licenseId: "SchemeReport",
        link: licenseRefLink("SchemeReport"),
    },
    {
        name: "Sendmail License",
        licenseId: "Sendmail",
        link: licenseRefLink("Sendmail"),
    },
    {
        name: "Sendmail License 8.23",
        licenseId: "Sendmail-8.23",
        link: licenseRefLink("Sendmail-8.23"),
    },
    {
        name: "SGI Free Software License B v1.0",
        licenseId: "SGI-B-1.0",
        link: licenseRefLink("SGI-B-1.0"),
    },
    {
        name: "SGI Free Software License B v1.1",
        licenseId: "SGI-B-1.1",
        link: licenseRefLink("SGI-B-1.1"),
    },
    {
        name: "SGI Free Software License B v2.0",
        licenseId: "SGI-B-2.0",
        link: licenseRefLink("SGI-B-2.0"),
    },
    {
        name: "SGI OpenGL License",
        licenseId: "SGI-OpenGL",
        link: licenseRefLink("SGI-OpenGL"),
    },
    {
        name: "SGP4 Permission Notice",
        licenseId: "SGP4",
        link: licenseRefLink("SGP4"),
    },
    {
        name: "Solderpad Hardware License v0.5",
        licenseId: "SHL-0.5",
        link: licenseRefLink("SHL-0.5"),
    },
    {
        name: "Solderpad Hardware License, Version 0.51",
        licenseId: "SHL-0.51",
        link: licenseRefLink("SHL-0.51"),
    },
    {
        name: "Simple Public License 2.0",
        licenseId: "SimPL-2.0",
        link: licenseRefLink("SimPL-2.0"),
    },
    {
        name: "Sun Industry Standards Source License v1.1",
        licenseId: "SISSL",
        link: licenseRefLink("SISSL"),
    },
    {
        name: "Sun Industry Standards Source License v1.2",
        licenseId: "SISSL-1.2",
        link: licenseRefLink("SISSL-1.2"),
    },
    {
        name: "SL License",
        licenseId: "SL",
        link: licenseRefLink("SL"),
    },
    {
        name: "Sleepycat License",
        licenseId: "Sleepycat",
        link: licenseRefLink("Sleepycat"),
    },
    {
        name: "Standard ML of New Jersey License",
        licenseId: "SMLNJ",
        link: licenseRefLink("SMLNJ"),
    },
    {
        name: "Secure Messaging Protocol Public License",
        licenseId: "SMPPL",
        link: licenseRefLink("SMPPL"),
    },
    {
        name: "SNIA Public License 1.1",
        licenseId: "SNIA",
        link: licenseRefLink("SNIA"),
    },
    {
        name: "snprintf License",
        licenseId: "snprintf",
        link: licenseRefLink("snprintf"),
    },
    {
        name: "softSurfer License",
        licenseId: "softSurfer",
        link: licenseRefLink("softSurfer"),
    },
    {
        name: "Soundex License",
        licenseId: "Soundex",
        link: licenseRefLink("Soundex"),
    },
    {
        name: "Spencer License 86",
        licenseId: "Spencer-86",
        link: licenseRefLink("Spencer-86"),
    },
    {
        name: "Spencer License 94",
        licenseId: "Spencer-94",
        link: licenseRefLink("Spencer-94"),
    },
    {
        name: "Spencer License 99",
        licenseId: "Spencer-99",
        link: licenseRefLink("Spencer-99"),
    },
    {
        name: "Sun Public License v1.0",
        licenseId: "SPL-1.0",
        link: licenseRefLink("SPL-1.0"),
    },
    {
        name: "ssh-keyscan License",
        licenseId: "ssh-keyscan",
        link: licenseRefLink("ssh-keyscan"),
    },
    {
        name: "SSH OpenSSH license",
        licenseId: "SSH-OpenSSH",
        link: licenseRefLink("SSH-OpenSSH"),
    },
    {
        name: "SSH short notice",
        licenseId: "SSH-short",
        link: licenseRefLink("SSH-short"),
    },
    {
        name: "SSLeay License - standalone",
        licenseId: "SSLeay-standalone",
        link: licenseRefLink("SSLeay-standalone"),
    },
    {
        name: "Server Side Public License, v 1",
        licenseId: "SSPL-1.0",
        link: licenseRefLink("SSPL-1.0"),
    },
    {
        name: "Standard ML of New Jersey License",
        licenseId: "StandardML-NJ",
        link: licenseRefLink("StandardML-NJ"),
    },
    {
        name: "SugarCRM Public License v1.1.3",
        licenseId: "SugarCRM-1.1.3",
        link: licenseRefLink("SugarCRM-1.1.3"),
    },
    {
        name: "Sun PPP License",
        licenseId: "Sun-PPP",
        link: licenseRefLink("Sun-PPP"),
    },
    {
        name: "Sun PPP License (2000)",
        licenseId: "Sun-PPP-2000",
        link: licenseRefLink("Sun-PPP-2000"),
    },
    {
        name: "SunPro License",
        licenseId: "SunPro",
        link: licenseRefLink("SunPro"),
    },
    {
        name: "Scheme Widget Library (SWL) Software License Agreement",
        licenseId: "SWL",
        link: licenseRefLink("SWL"),
    },
    {
        name: "swrule License",
        licenseId: "swrule",
        link: licenseRefLink("swrule"),
    },
    {
        name: "Symlinks License",
        licenseId: "Symlinks",
        link: licenseRefLink("Symlinks"),
    },
    {
        name: "TAPR Open Hardware License v1.0",
        licenseId: "TAPR-OHL-1.0",
        link: licenseRefLink("TAPR-OHL-1.0"),
    },
    {
        name: "TCL/TK License",
        licenseId: "TCL",
        link: licenseRefLink("TCL"),
    },
    {
        name: "TCP Wrappers License",
        licenseId: "TCP-wrappers",
        link: licenseRefLink("TCP-wrappers"),
    },
    {
        name: "TermReadKey License",
        licenseId: "TermReadKey",
        link: licenseRefLink("TermReadKey"),
    },
    {
        name: "Transitive Grace Period Public Licence 1.0",
        licenseId: "TGPPL-1.0",
        link: licenseRefLink("TGPPL-1.0"),
    },
    {
        name: "threeparttable License",
        licenseId: "threeparttable",
        link: licenseRefLink("threeparttable"),
    },
    {
        name: "TMate Open Source License",
        licenseId: "TMate",
        link: licenseRefLink("TMate"),
    },
    {
        name: "TORQUE v2.5+ Software License v1.1",
        licenseId: "TORQUE-1.1",
        link: licenseRefLink("TORQUE-1.1"),
    },
    {
        name: "Trusster Open Source License",
        licenseId: "TOSL",
        link: licenseRefLink("TOSL"),
    },
    {
        name: "Time::ParseDate License",
        licenseId: "TPDL",
        link: licenseRefLink("TPDL"),
    },
    {
        name: "THOR Public License 1.0",
        licenseId: "TPL-1.0",
        link: licenseRefLink("TPL-1.0"),
    },
    {
        name: "TrustedQSL License",
        licenseId: "TrustedQSL",
        link: licenseRefLink("TrustedQSL"),
    },
    {
        name: "Text-Tabs+Wrap License",
        licenseId: "TTWL",
        link: licenseRefLink("TTWL"),
    },
    {
        name: "TTYP0 License",
        licenseId: "TTYP0",
        link: licenseRefLink("TTYP0"),
    },
    {
        name: "Technische Universitaet Berlin License 1.0",
        licenseId: "TU-Berlin-1.0",
        link: licenseRefLink("TU-Berlin-1.0"),
    },
    {
        name: "Technische Universitaet Berlin License 2.0",
        licenseId: "TU-Berlin-2.0",
        link: licenseRefLink("TU-Berlin-2.0"),
    },
    {
        name: "Ubuntu Font Licence v1.0",
        licenseId: "Ubuntu-font-1.0",
        link: licenseRefLink("Ubuntu-font-1.0"),
    },
    {
        name: "UCAR License",
        licenseId: "UCAR",
        link: licenseRefLink("UCAR"),
    },
    {
        name: "Upstream Compatibility License v1.0",
        licenseId: "UCL-1.0",
        link: licenseRefLink("UCL-1.0"),
    },
    {
        name: "ulem License",
        licenseId: "ulem",
        link: licenseRefLink("ulem"),
    },
    {
        name: "Michigan/Merit Networks License",
        licenseId: "UMich-Merit",
        link: licenseRefLink("UMich-Merit"),
    },
    {
        name: "Unicode License v3",
        licenseId: "Unicode-3.0",
        link: licenseRefLink("Unicode-3.0"),
    },
    {
        name: "Unicode License Agreement - Data Files and Software (2015)",
        licenseId: "Unicode-DFS-2015",
        link: licenseRefLink("Unicode-DFS-2015"),
    },
    {
        name: "Unicode License Agreement - Data Files and Software (2016)",
        licenseId: "Unicode-DFS-2016",
        link: licenseRefLink("Unicode-DFS-2016"),
    },
    {
        name: "Unicode Terms of Use",
        licenseId: "Unicode-TOU",
        link: licenseRefLink("Unicode-TOU"),
    },
    {
        name: "UnixCrypt License",
        licenseId: "UnixCrypt",
        link: licenseRefLink("UnixCrypt"),
    },
    {
        name: "The Unlicense",
        licenseId: "Unlicense",
        link: licenseRefLink("Unlicense"),
    },
    {
        name: "Universal Permissive License v1.0",
        licenseId: "UPL-1.0",
        link: licenseRefLink("UPL-1.0"),
    },
    {
        name: "Utah Raster Toolkit Run Length Encoded License",
        licenseId: "URT-RLE",
        link: licenseRefLink("URT-RLE"),
    },
    {
        name: "Vim License",
        licenseId: "Vim",
        link: licenseRefLink("Vim"),
    },
    {
        name: "VOSTROM Public License for Open Source",
        licenseId: "VOSTROM",
        link: licenseRefLink("VOSTROM"),
    },
    {
        name: "Vovida Software License v1.0",
        licenseId: "VSL-1.0",
        link: licenseRefLink("VSL-1.0"),
    },
    {
        name: "W3C Software Notice and License (2002-12-31)",
        licenseId: "W3C",
        link: licenseRefLink("W3C"),
    },
    {
        name: "W3C Software Notice and License (1998-07-20)",
        licenseId: "W3C-19980720",
        link: licenseRefLink("W3C-19980720"),
    },
    {
        name: "W3C Software Notice and Document License (2015-05-13)",
        licenseId: "W3C-20150513",
        link: licenseRefLink("W3C-20150513"),
    },
    {
        name: "w3m License",
        licenseId: "w3m",
        link: licenseRefLink("w3m"),
    },
    {
        name: "Sybase Open Watcom Public License 1.0",
        licenseId: "Watcom-1.0",
        link: licenseRefLink("Watcom-1.0"),
    },
    {
        name: "Widget Workshop License",
        licenseId: "Widget-Workshop",
        link: licenseRefLink("Widget-Workshop"),
    },
    {
        name: "Wsuipa License",
        licenseId: "Wsuipa",
        link: licenseRefLink("Wsuipa"),
    },
    {
        name: "Do What The F*ck You Want To Public License",
        licenseId: "WTFPL",
        link: licenseRefLink("WTFPL"),
    },
    {
        name: "wxWindows Library License",
        licenseId: "wxWindows",
        link: licenseRefLink("wxWindows"),
    },
    {
        name: "X11 License",
        licenseId: "X11",
        link: licenseRefLink("X11"),
    },
    {
        name: "X11 License Distribution Modification Variant",
        licenseId: "X11-distribute-modifications-variant",
        link: licenseRefLink("X11-distribute-modifications-variant"),
    },
    {
        name: "X11 swapped final paragraphs",
        licenseId: "X11-swapped",
        link: licenseRefLink("X11-swapped"),
    },
    {
        name: "Xdebug License v 1.03",
        licenseId: "Xdebug-1.03",
        link: licenseRefLink("Xdebug-1.03"),
    },
    {
        name: "Xerox License",
        licenseId: "Xerox",
        link: licenseRefLink("Xerox"),
    },
    {
        name: "Xfig License",
        licenseId: "Xfig",
        link: licenseRefLink("Xfig"),
    },
    {
        name: "XFree86 License 1.1",
        licenseId: "XFree86-1.1",
        link: licenseRefLink("XFree86-1.1"),
    },
    {
        name: "xinetd License",
        licenseId: "xinetd",
        link: licenseRefLink("xinetd"),
    },
    {
        name: "xkeyboard-config Zinoviev License",
        licenseId: "xkeyboard-config-Zinoviev",
        link: licenseRefLink("xkeyboard-config-Zinoviev"),
    },
    {
        name: "xlock License",
        licenseId: "xlock",
        link: licenseRefLink("xlock"),
    },
    {
        name: "X.Net License",
        licenseId: "Xnet",
        link: licenseRefLink("Xnet"),
    },
    {
        name: "XPP License",
        licenseId: "xpp",
        link: licenseRefLink("xpp"),
    },
    {
        name: "XSkat License",
        licenseId: "XSkat",
        link: licenseRefLink("XSkat"),
    },
    {
        name: "xzoom License",
        licenseId: "xzoom",
        link: licenseRefLink("xzoom"),
    },
    {
        name: "Yahoo! Public License v1.0",
        licenseId: "YPL-1.0",
        link: licenseRefLink("YPL-1.0"),
    },
    {
        name: "Yahoo! Public License v1.1",
        licenseId: "YPL-1.1",
        link: licenseRefLink("YPL-1.1"),
    },
    {
        name: "Zed License",
        licenseId: "Zed",
        link: licenseRefLink("Zed"),
    },
    {
        name: "Zeeff License",
        licenseId: "Zeeff",
        link: licenseRefLink("Zeeff"),
    },
    {
        name: "Zend License v2.0",
        licenseId: "Zend-2.0",
        link: licenseRefLink("Zend-2.0"),
    },
    {
        name: "Zimbra Public License v1.3",
        licenseId: "Zimbra-1.3",
        link: licenseRefLink("Zimbra-1.3"),
    },
    {
        name: "Zimbra Public License v1.4",
        licenseId: "Zimbra-1.4",
        link: licenseRefLink("Zimbra-1.4"),
    },
    {
        name: "zlib License",
        licenseId: "Zlib",
        link: licenseRefLink("Zlib"),
    },
    {
        name: "zlib/libpng License with Acknowledgement",
        licenseId: "zlib-acknowledgement",
        link: licenseRefLink("zlib-acknowledgement"),
    },
    {
        name: "Zope Public License 1.1",
        licenseId: "ZPL-1.1",
        link: licenseRefLink("ZPL-1.1"),
    },
    {
        name: "Zope Public License 2.0",
        licenseId: "ZPL-2.0",
        link: licenseRefLink("ZPL-2.0"),
    },
    {
        name: "Zope Public License 2.1",
        licenseId: "ZPL-2.1",
        link: licenseRefLink("ZPL-2.1"),
    },
];

export default SPDX_LICENSE_LIST;

export const FEATURED_LICENSE_INDICES = [
    0, // All Rights Reserved
    34, // Apache License 2.0
    65, // BSD 2-Clause "Simplified" License
    72, // BSD 3-Clause "New" or "Revised" License
    121, // Creative Commons Attribution 4.0 International
    160, // Creative Commons Attribution Share Alike 4.0 International
    127, // Creative Commons Attribution Non Commercial 4.0 International
    144, // Creative Commons Attribution Non Commercial Share Alike 4.0 International
    150, // Creative Commons Attribution No Derivatives 4.0 International
    134, // Creative Commons Attribution Non Commercial No Derivatives 4.0 International
    20, // GNU Affero General Public License v3.0
    371, // GNU Lesser General Public License v2.1
    375, // GNU Lesser General Public License v3.0
    287, // GNU General Public License v2.0
    296, // GNU General Public License v3.0
    352, // ISC License
    416, // MIT License
    437, // Mozilla Public License 2.0
    665, // zlib License
];

export const FEATURED_LICENSE_OPTIONS = FEATURED_LICENSE_INDICES.map((index) => SPDX_LICENSE_LIST[index]);

export const CUSTOM_LICENSE_OPTION = {
    name: "Custom",
    licenseId: "custom",
    link: null,
};
