export const LICNESE_REFERENCE_LINK = "https://spdx.org/licenses";

export function licenseRefLink(licenseId: string) {
    if (["custom", "all-rights-reserved"].includes(licenseId)) return null;
    return `https://spdx.org/licenses/${licenseId}`;
}

export interface SPDX_LICENSE {
    name: string;
    licenseId: string;
    text?: string;
    url: string | null;
}

const SPDX_LICENSE_LIST = [
    {
        name: "All Rights Reserved",
        licenseId: "all-rights-reserved",
        url: licenseRefLink("all-rights-reserved"),
        text: "All rights reserved unless explicitly stated.",
    },
    {
        name: "BSD Zero Clause License",
        licenseId: "0BSD",
        url: licenseRefLink("0BSD"),
    },
    {
        name: "3D Slicer License v1.0",
        licenseId: "3D-Slicer-1.0",
        url: licenseRefLink("3D-Slicer-1.0"),
    },
    {
        name: "Attribution Assurance License",
        licenseId: "AAL",
        url: licenseRefLink("AAL"),
    },
    {
        name: "Abstyles License",
        licenseId: "Abstyles",
        url: licenseRefLink("Abstyles"),
    },
    {
        name: "AdaCore Doc License",
        licenseId: "AdaCore-doc",
        url: licenseRefLink("AdaCore-doc"),
    },
    {
        name: "Adobe Systems Incorporated Source Code License Agreement",
        licenseId: "Adobe-2006",
        url: licenseRefLink("Adobe-2006"),
    },
    {
        name: "Adobe Display PostScript License",
        licenseId: "Adobe-Display-PostScript",
        url: licenseRefLink("Adobe-Display-PostScript"),
    },
    {
        name: "Adobe Glyph List License",
        licenseId: "Adobe-Glyph",
        url: licenseRefLink("Adobe-Glyph"),
    },
    {
        name: "Adobe Utopia Font License",
        licenseId: "Adobe-Utopia",
        url: licenseRefLink("Adobe-Utopia"),
    },
    {
        name: "Amazon Digital Services License",
        licenseId: "ADSL",
        url: licenseRefLink("ADSL"),
    },
    {
        name: "Academic Free License v1.1",
        licenseId: "AFL-1.1",
        url: licenseRefLink("AFL-1.1"),
    },
    {
        name: "Academic Free License v1.2",
        licenseId: "AFL-1.2",
        url: licenseRefLink("AFL-1.2"),
    },
    {
        name: "Academic Free License v2.0",
        licenseId: "AFL-2.0",
        url: licenseRefLink("AFL-2.0"),
    },
    {
        name: "Academic Free License v2.1",
        licenseId: "AFL-2.1",
        url: licenseRefLink("AFL-2.1"),
    },
    {
        name: "Academic Free License v3.0",
        licenseId: "AFL-3.0",
        url: licenseRefLink("AFL-3.0"),
    },
    {
        name: "Afmparse License",
        licenseId: "Afmparse",
        url: licenseRefLink("Afmparse"),
    },
    {
        name: "Affero General Public License v1.0",
        licenseId: "AGPL-1.0",
        url: licenseRefLink("AGPL-1.0"),
    },
    {
        name: "Affero General Public License v1.0 only",
        licenseId: "AGPL-1.0-only",
        url: licenseRefLink("AGPL-1.0-only"),
    },
    {
        name: "Affero General Public License v1.0 or later",
        licenseId: "AGPL-1.0-or-later",
        url: licenseRefLink("AGPL-1.0-or-later"),
    },
    {
        name: "GNU Affero General Public License v3.0",
        licenseId: "AGPL-3.0",
        url: licenseRefLink("AGPL-3.0"),
    },
    {
        name: "GNU Affero General Public License v3.0 only",
        licenseId: "AGPL-3.0-only",
        url: licenseRefLink("AGPL-3.0-only"),
    },
    {
        name: "GNU Affero General Public License v3.0 or later",
        licenseId: "AGPL-3.0-or-later",
        url: licenseRefLink("AGPL-3.0-or-later"),
    },
    {
        name: "Aladdin Free Public License",
        licenseId: "Aladdin",
        url: licenseRefLink("Aladdin"),
    },
    {
        name: "AMD newlib License",
        licenseId: "AMD-newlib",
        url: licenseRefLink("AMD-newlib"),
    },
    {
        name: "AMD\u0027s plpa_map.c License",
        licenseId: "AMDPLPA",
        url: licenseRefLink("AMDPLPA"),
    },
    {
        name: "Apple MIT License",
        licenseId: "AML",
        url: licenseRefLink("AML"),
    },
    {
        name: "AML glslang variant License",
        licenseId: "AML-glslang",
        url: licenseRefLink("AML-glslang"),
    },
    {
        name: "Academy of Motion Picture Arts and Sciences BSD",
        licenseId: "AMPAS",
        url: licenseRefLink("AMPAS"),
    },
    {
        name: "ANTLR Software Rights Notice",
        licenseId: "ANTLR-PD",
        url: licenseRefLink("ANTLR-PD"),
    },
    {
        name: "ANTLR Software Rights Notice with license fallback",
        licenseId: "ANTLR-PD-fallback",
        url: licenseRefLink("ANTLR-PD-fallback"),
    },
    {
        name: "Any OSI License",
        licenseId: "any-OSI",
        url: licenseRefLink("any-OSI"),
    },
    {
        name: "Apache License 1.0",
        licenseId: "Apache-1.0",
        url: licenseRefLink("Apache-1.0"),
    },
    {
        name: "Apache License 1.1",
        licenseId: "Apache-1.1",
        url: licenseRefLink("Apache-1.1"),
    },
    {
        name: "Apache License 2.0",
        licenseId: "Apache-2.0",
        url: licenseRefLink("Apache-2.0"),
    },
    {
        name: "Adobe Postscript AFM License",
        licenseId: "APAFML",
        url: licenseRefLink("APAFML"),
    },
    {
        name: "Adaptive Public License 1.0",
        licenseId: "APL-1.0",
        url: licenseRefLink("APL-1.0"),
    },
    {
        name: "App::s2p License",
        licenseId: "App-s2p",
        url: licenseRefLink("App-s2p"),
    },
    {
        name: "Apple Public Source License 1.0",
        licenseId: "APSL-1.0",
        url: licenseRefLink("APSL-1.0"),
    },
    {
        name: "Apple Public Source License 1.1",
        licenseId: "APSL-1.1",
        url: licenseRefLink("APSL-1.1"),
    },
    {
        name: "Apple Public Source License 1.2",
        licenseId: "APSL-1.2",
        url: licenseRefLink("APSL-1.2"),
    },
    {
        name: "Apple Public Source License 2.0",
        licenseId: "APSL-2.0",
        url: licenseRefLink("APSL-2.0"),
    },
    {
        name: "Arphic Public License",
        licenseId: "Arphic-1999",
        url: licenseRefLink("Arphic-1999"),
    },
    {
        name: "Artistic License 1.0",
        licenseId: "Artistic-1.0",
        url: licenseRefLink("Artistic-1.0"),
    },
    {
        name: "Artistic License 1.0 w/clause 8",
        licenseId: "Artistic-1.0-cl8",
        url: licenseRefLink("Artistic-1.0-cl8"),
    },
    {
        name: "Artistic License 1.0 (Perl)",
        licenseId: "Artistic-1.0-Perl",
        url: licenseRefLink("Artistic-1.0-Perl"),
    },
    {
        name: "Artistic License 2.0",
        licenseId: "Artistic-2.0",
        url: licenseRefLink("Artistic-2.0"),
    },
    {
        name: "ASWF Digital Assets License version 1.0",
        licenseId: "ASWF-Digital-Assets-1.0",
        url: licenseRefLink("ASWF-Digital-Assets-1.0"),
    },
    {
        name: "ASWF Digital Assets License 1.1",
        licenseId: "ASWF-Digital-Assets-1.1",
        url: licenseRefLink("ASWF-Digital-Assets-1.1"),
    },
    {
        name: "Baekmuk License",
        licenseId: "Baekmuk",
        url: licenseRefLink("Baekmuk"),
    },
    {
        name: "Bahyph License",
        licenseId: "Bahyph",
        url: licenseRefLink("Bahyph"),
    },
    {
        name: "Barr License",
        licenseId: "Barr",
        url: licenseRefLink("Barr"),
    },
    {
        name: "bcrypt Solar Designer License",
        licenseId: "bcrypt-Solar-Designer",
        url: licenseRefLink("bcrypt-Solar-Designer"),
    },
    {
        name: "Beerware License",
        licenseId: "Beerware",
        url: licenseRefLink("Beerware"),
    },
    {
        name: "Bitstream Charter Font License",
        licenseId: "Bitstream-Charter",
        url: licenseRefLink("Bitstream-Charter"),
    },
    {
        name: "Bitstream Vera Font License",
        licenseId: "Bitstream-Vera",
        url: licenseRefLink("Bitstream-Vera"),
    },
    {
        name: "BitTorrent Open Source License v1.0",
        licenseId: "BitTorrent-1.0",
        url: licenseRefLink("BitTorrent-1.0"),
    },
    {
        name: "BitTorrent Open Source License v1.1",
        licenseId: "BitTorrent-1.1",
        url: licenseRefLink("BitTorrent-1.1"),
    },
    {
        name: "SQLite Blessing",
        licenseId: "blessing",
        url: licenseRefLink("blessing"),
    },
    {
        name: "Blue Oak Model License 1.0.0",
        licenseId: "BlueOak-1.0.0",
        url: licenseRefLink("BlueOak-1.0.0"),
    },
    {
        name: "Boehm-Demers-Weiser GC License",
        licenseId: "Boehm-GC",
        url: licenseRefLink("Boehm-GC"),
    },
    {
        name: "Borceux license",
        licenseId: "Borceux",
        url: licenseRefLink("Borceux"),
    },
    {
        name: "Brian Gladman 2-Clause License",
        licenseId: "Brian-Gladman-2-Clause",
        url: licenseRefLink("Brian-Gladman-2-Clause"),
    },
    {
        name: "Brian Gladman 3-Clause License",
        licenseId: "Brian-Gladman-3-Clause",
        url: licenseRefLink("Brian-Gladman-3-Clause"),
    },
    {
        name: "BSD 1-Clause License",
        licenseId: "BSD-1-Clause",
        url: licenseRefLink("BSD-1-Clause"),
    },
    {
        name: 'BSD 2-Clause "Simplified" License',
        licenseId: "BSD-2-Clause",
        url: licenseRefLink("BSD-2-Clause"),
    },
    {
        name: "BSD 2-Clause - Ian Darwin variant",
        licenseId: "BSD-2-Clause-Darwin",
        url: licenseRefLink("BSD-2-Clause-Darwin"),
    },
    {
        name: "BSD 2-Clause - first lines requirement",
        licenseId: "BSD-2-Clause-first-lines",
        url: licenseRefLink("BSD-2-Clause-first-lines"),
    },
    {
        name: "BSD 2-Clause FreeBSD License",
        licenseId: "BSD-2-Clause-FreeBSD",
        url: licenseRefLink("BSD-2-Clause-FreeBSD"),
    },
    {
        name: "BSD 2-Clause NetBSD License",
        licenseId: "BSD-2-Clause-NetBSD",
        url: licenseRefLink("BSD-2-Clause-NetBSD"),
    },
    {
        name: "BSD-2-Clause Plus Patent License",
        licenseId: "BSD-2-Clause-Patent",
        url: licenseRefLink("BSD-2-Clause-Patent"),
    },
    {
        name: "BSD 2-Clause with views sentence",
        licenseId: "BSD-2-Clause-Views",
        url: licenseRefLink("BSD-2-Clause-Views"),
    },
    {
        name: 'BSD 3-Clause "New" or "Revised" License',
        licenseId: "BSD-3-Clause",
        url: licenseRefLink("BSD-3-Clause"),
    },
    {
        name: "BSD 3-Clause acpica variant",
        licenseId: "BSD-3-Clause-acpica",
        url: licenseRefLink("BSD-3-Clause-acpica"),
    },
    {
        name: "BSD with attribution",
        licenseId: "BSD-3-Clause-Attribution",
        url: licenseRefLink("BSD-3-Clause-Attribution"),
    },
    {
        name: "BSD 3-Clause Clear License",
        licenseId: "BSD-3-Clause-Clear",
        url: licenseRefLink("BSD-3-Clause-Clear"),
    },
    {
        name: "BSD 3-Clause Flex variant",
        licenseId: "BSD-3-Clause-flex",
        url: licenseRefLink("BSD-3-Clause-flex"),
    },
    {
        name: "Hewlett-Packard BSD variant license",
        licenseId: "BSD-3-Clause-HP",
        url: licenseRefLink("BSD-3-Clause-HP"),
    },
    {
        name: "Lawrence Berkeley National Labs BSD variant license",
        licenseId: "BSD-3-Clause-LBNL",
        url: licenseRefLink("BSD-3-Clause-LBNL"),
    },
    {
        name: "BSD 3-Clause Modification",
        licenseId: "BSD-3-Clause-Modification",
        url: licenseRefLink("BSD-3-Clause-Modification"),
    },
    {
        name: "BSD 3-Clause No Military License",
        licenseId: "BSD-3-Clause-No-Military-License",
        url: licenseRefLink("BSD-3-Clause-No-Military-License"),
    },
    {
        name: "BSD 3-Clause No Nuclear License",
        licenseId: "BSD-3-Clause-No-Nuclear-License",
        url: licenseRefLink("BSD-3-Clause-No-Nuclear-License"),
    },
    {
        name: "BSD 3-Clause No Nuclear License 2014",
        licenseId: "BSD-3-Clause-No-Nuclear-License-2014",
        url: licenseRefLink("BSD-3-Clause-No-Nuclear-License-2014"),
    },
    {
        name: "BSD 3-Clause No Nuclear Warranty",
        licenseId: "BSD-3-Clause-No-Nuclear-Warranty",
        url: licenseRefLink("BSD-3-Clause-No-Nuclear-Warranty"),
    },
    {
        name: "BSD 3-Clause Open MPI variant",
        licenseId: "BSD-3-Clause-Open-MPI",
        url: licenseRefLink("BSD-3-Clause-Open-MPI"),
    },
    {
        name: "BSD 3-Clause Sun Microsystems",
        licenseId: "BSD-3-Clause-Sun",
        url: licenseRefLink("BSD-3-Clause-Sun"),
    },
    {
        name: 'BSD 4-Clause "Original" or "Old" License',
        licenseId: "BSD-4-Clause",
        url: licenseRefLink("BSD-4-Clause"),
    },
    {
        name: "BSD 4 Clause Shortened",
        licenseId: "BSD-4-Clause-Shortened",
        url: licenseRefLink("BSD-4-Clause-Shortened"),
    },
    {
        name: "BSD-4-Clause (University of California-Specific)",
        licenseId: "BSD-4-Clause-UC",
        url: licenseRefLink("BSD-4-Clause-UC"),
    },
    {
        name: "BSD 4.3 RENO License",
        licenseId: "BSD-4.3RENO",
        url: licenseRefLink("BSD-4.3RENO"),
    },
    {
        name: "BSD 4.3 TAHOE License",
        licenseId: "BSD-4.3TAHOE",
        url: licenseRefLink("BSD-4.3TAHOE"),
    },
    {
        name: "BSD Advertising Acknowledgement License",
        licenseId: "BSD-Advertising-Acknowledgement",
        url: licenseRefLink("BSD-Advertising-Acknowledgement"),
    },
    {
        name: "BSD with Attribution and HPND disclaimer",
        licenseId: "BSD-Attribution-HPND-disclaimer",
        url: licenseRefLink("BSD-Attribution-HPND-disclaimer"),
    },
    {
        name: "BSD-Inferno-Nettverk",
        licenseId: "BSD-Inferno-Nettverk",
        url: licenseRefLink("BSD-Inferno-Nettverk"),
    },
    {
        name: "BSD Protection License",
        licenseId: "BSD-Protection",
        url: licenseRefLink("BSD-Protection"),
    },
    {
        name: "BSD Source Code Attribution - beginning of file variant",
        licenseId: "BSD-Source-beginning-file",
        url: licenseRefLink("BSD-Source-beginning-file"),
    },
    {
        name: "BSD Source Code Attribution",
        licenseId: "BSD-Source-Code",
        url: licenseRefLink("BSD-Source-Code"),
    },
    {
        name: "Systemics BSD variant license",
        licenseId: "BSD-Systemics",
        url: licenseRefLink("BSD-Systemics"),
    },
    {
        name: "Systemics W3Works BSD variant license",
        licenseId: "BSD-Systemics-W3Works",
        url: licenseRefLink("BSD-Systemics-W3Works"),
    },
    {
        name: "Boost Software License 1.0",
        licenseId: "BSL-1.0",
        url: licenseRefLink("BSL-1.0"),
    },
    {
        name: "Business Source License 1.1",
        licenseId: "BUSL-1.1",
        url: licenseRefLink("BUSL-1.1"),
    },
    {
        name: "bzip2 and libbzip2 License v1.0.5",
        licenseId: "bzip2-1.0.5",
        url: licenseRefLink("bzip2-1.0.5"),
    },
    {
        name: "bzip2 and libbzip2 License v1.0.6",
        licenseId: "bzip2-1.0.6",
        url: licenseRefLink("bzip2-1.0.6"),
    },
    {
        name: "Computational Use of Data Agreement v1.0",
        licenseId: "C-UDA-1.0",
        url: licenseRefLink("C-UDA-1.0"),
    },
    {
        name: "Cryptographic Autonomy License 1.0",
        licenseId: "CAL-1.0",
        url: licenseRefLink("CAL-1.0"),
    },
    {
        name: "Cryptographic Autonomy License 1.0 (Combined Work Exception)",
        licenseId: "CAL-1.0-Combined-Work-Exception",
        url: licenseRefLink("CAL-1.0-Combined-Work-Exception"),
    },
    {
        name: "Caldera License",
        licenseId: "Caldera",
        url: licenseRefLink("Caldera"),
    },
    {
        name: "Caldera License (without preamble)",
        licenseId: "Caldera-no-preamble",
        url: licenseRefLink("Caldera-no-preamble"),
    },
    {
        name: "Catharon License",
        licenseId: "Catharon",
        url: licenseRefLink("Catharon"),
    },
    {
        name: "Computer Associates Trusted Open Source License 1.1",
        licenseId: "CATOSL-1.1",
        url: licenseRefLink("CATOSL-1.1"),
    },
    {
        name: "Creative Commons Attribution 1.0 Generic",
        licenseId: "CC-BY-1.0",
        url: licenseRefLink("CC-BY-1.0"),
    },
    {
        name: "Creative Commons Attribution 2.0 Generic",
        licenseId: "CC-BY-2.0",
        url: licenseRefLink("CC-BY-2.0"),
    },
    {
        name: "Creative Commons Attribution 2.5 Generic",
        licenseId: "CC-BY-2.5",
        url: licenseRefLink("CC-BY-2.5"),
    },
    {
        name: "Creative Commons Attribution 2.5 Australia",
        licenseId: "CC-BY-2.5-AU",
        url: licenseRefLink("CC-BY-2.5-AU"),
    },
    {
        name: "Creative Commons Attribution 3.0 Unported",
        licenseId: "CC-BY-3.0",
        url: licenseRefLink("CC-BY-3.0"),
    },
    {
        name: "Creative Commons Attribution 3.0 Austria",
        licenseId: "CC-BY-3.0-AT",
        url: licenseRefLink("CC-BY-3.0-AT"),
    },
    {
        name: "Creative Commons Attribution 3.0 Australia",
        licenseId: "CC-BY-3.0-AU",
        url: licenseRefLink("CC-BY-3.0-AU"),
    },
    {
        name: "Creative Commons Attribution 3.0 Germany",
        licenseId: "CC-BY-3.0-DE",
        url: licenseRefLink("CC-BY-3.0-DE"),
    },
    {
        name: "Creative Commons Attribution 3.0 IGO",
        licenseId: "CC-BY-3.0-IGO",
        url: licenseRefLink("CC-BY-3.0-IGO"),
    },
    {
        name: "Creative Commons Attribution 3.0 Netherlands",
        licenseId: "CC-BY-3.0-NL",
        url: licenseRefLink("CC-BY-3.0-NL"),
    },
    {
        name: "Creative Commons Attribution 3.0 United States",
        licenseId: "CC-BY-3.0-US",
        url: licenseRefLink("CC-BY-3.0-US"),
    },
    {
        name: "Creative Commons Attribution 4.0 International",
        licenseId: "CC-BY-4.0",
        url: licenseRefLink("CC-BY-4.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial 1.0 Generic",
        licenseId: "CC-BY-NC-1.0",
        url: licenseRefLink("CC-BY-NC-1.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial 2.0 Generic",
        licenseId: "CC-BY-NC-2.0",
        url: licenseRefLink("CC-BY-NC-2.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial 2.5 Generic",
        licenseId: "CC-BY-NC-2.5",
        url: licenseRefLink("CC-BY-NC-2.5"),
    },
    {
        name: "Creative Commons Attribution Non Commercial 3.0 Unported",
        licenseId: "CC-BY-NC-3.0",
        url: licenseRefLink("CC-BY-NC-3.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial 3.0 Germany",
        licenseId: "CC-BY-NC-3.0-DE",
        url: licenseRefLink("CC-BY-NC-3.0-DE"),
    },
    {
        name: "Creative Commons Attribution Non Commercial 4.0 International",
        licenseId: "CC-BY-NC-4.0",
        url: licenseRefLink("CC-BY-NC-4.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial No Derivatives 1.0 Generic",
        licenseId: "CC-BY-NC-ND-1.0",
        url: licenseRefLink("CC-BY-NC-ND-1.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial No Derivatives 2.0 Generic",
        licenseId: "CC-BY-NC-ND-2.0",
        url: licenseRefLink("CC-BY-NC-ND-2.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial No Derivatives 2.5 Generic",
        licenseId: "CC-BY-NC-ND-2.5",
        url: licenseRefLink("CC-BY-NC-ND-2.5"),
    },
    {
        name: "Creative Commons Attribution Non Commercial No Derivatives 3.0 Unported",
        licenseId: "CC-BY-NC-ND-3.0",
        url: licenseRefLink("CC-BY-NC-ND-3.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial No Derivatives 3.0 Germany",
        licenseId: "CC-BY-NC-ND-3.0-DE",
        url: licenseRefLink("CC-BY-NC-ND-3.0-DE"),
    },
    {
        name: "Creative Commons Attribution Non Commercial No Derivatives 3.0 IGO",
        licenseId: "CC-BY-NC-ND-3.0-IGO",
        url: licenseRefLink("CC-BY-NC-ND-3.0-IGO"),
    },
    {
        name: "Creative Commons Attribution Non Commercial No Derivatives 4.0 International",
        licenseId: "CC-BY-NC-ND-4.0",
        url: licenseRefLink("CC-BY-NC-ND-4.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial Share Alike 1.0 Generic",
        licenseId: "CC-BY-NC-SA-1.0",
        url: licenseRefLink("CC-BY-NC-SA-1.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial Share Alike 2.0 Generic",
        licenseId: "CC-BY-NC-SA-2.0",
        url: licenseRefLink("CC-BY-NC-SA-2.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial Share Alike 2.0 Germany",
        licenseId: "CC-BY-NC-SA-2.0-DE",
        url: licenseRefLink("CC-BY-NC-SA-2.0-DE"),
    },
    {
        name: "Creative Commons Attribution-NonCommercial-ShareAlike 2.0 France",
        licenseId: "CC-BY-NC-SA-2.0-FR",
        url: licenseRefLink("CC-BY-NC-SA-2.0-FR"),
    },
    {
        name: "Creative Commons Attribution Non Commercial Share Alike 2.0 England and Wales",
        licenseId: "CC-BY-NC-SA-2.0-UK",
        url: licenseRefLink("CC-BY-NC-SA-2.0-UK"),
    },
    {
        name: "Creative Commons Attribution Non Commercial Share Alike 2.5 Generic",
        licenseId: "CC-BY-NC-SA-2.5",
        url: licenseRefLink("CC-BY-NC-SA-2.5"),
    },
    {
        name: "Creative Commons Attribution Non Commercial Share Alike 3.0 Unported",
        licenseId: "CC-BY-NC-SA-3.0",
        url: licenseRefLink("CC-BY-NC-SA-3.0"),
    },
    {
        name: "Creative Commons Attribution Non Commercial Share Alike 3.0 Germany",
        licenseId: "CC-BY-NC-SA-3.0-DE",
        url: licenseRefLink("CC-BY-NC-SA-3.0-DE"),
    },
    {
        name: "Creative Commons Attribution Non Commercial Share Alike 3.0 IGO",
        licenseId: "CC-BY-NC-SA-3.0-IGO",
        url: licenseRefLink("CC-BY-NC-SA-3.0-IGO"),
    },
    {
        name: "Creative Commons Attribution Non Commercial Share Alike 4.0 International",
        licenseId: "CC-BY-NC-SA-4.0",
        url: licenseRefLink("CC-BY-NC-SA-4.0"),
    },
    {
        name: "Creative Commons Attribution No Derivatives 1.0 Generic",
        licenseId: "CC-BY-ND-1.0",
        url: licenseRefLink("CC-BY-ND-1.0"),
    },
    {
        name: "Creative Commons Attribution No Derivatives 2.0 Generic",
        licenseId: "CC-BY-ND-2.0",
        url: licenseRefLink("CC-BY-ND-2.0"),
    },
    {
        name: "Creative Commons Attribution No Derivatives 2.5 Generic",
        licenseId: "CC-BY-ND-2.5",
        url: licenseRefLink("CC-BY-ND-2.5"),
    },
    {
        name: "Creative Commons Attribution No Derivatives 3.0 Unported",
        licenseId: "CC-BY-ND-3.0",
        url: licenseRefLink("CC-BY-ND-3.0"),
    },
    {
        name: "Creative Commons Attribution No Derivatives 3.0 Germany",
        licenseId: "CC-BY-ND-3.0-DE",
        url: licenseRefLink("CC-BY-ND-3.0-DE"),
    },
    {
        name: "Creative Commons Attribution No Derivatives 4.0 International",
        licenseId: "CC-BY-ND-4.0",
        url: licenseRefLink("CC-BY-ND-4.0"),
    },
    {
        name: "Creative Commons Attribution Share Alike 1.0 Generic",
        licenseId: "CC-BY-SA-1.0",
        url: licenseRefLink("CC-BY-SA-1.0"),
    },
    {
        name: "Creative Commons Attribution Share Alike 2.0 Generic",
        licenseId: "CC-BY-SA-2.0",
        url: licenseRefLink("CC-BY-SA-2.0"),
    },
    {
        name: "Creative Commons Attribution Share Alike 2.0 England and Wales",
        licenseId: "CC-BY-SA-2.0-UK",
        url: licenseRefLink("CC-BY-SA-2.0-UK"),
    },
    {
        name: "Creative Commons Attribution Share Alike 2.1 Japan",
        licenseId: "CC-BY-SA-2.1-JP",
        url: licenseRefLink("CC-BY-SA-2.1-JP"),
    },
    {
        name: "Creative Commons Attribution Share Alike 2.5 Generic",
        licenseId: "CC-BY-SA-2.5",
        url: licenseRefLink("CC-BY-SA-2.5"),
    },
    {
        name: "Creative Commons Attribution Share Alike 3.0 Unported",
        licenseId: "CC-BY-SA-3.0",
        url: licenseRefLink("CC-BY-SA-3.0"),
    },
    {
        name: "Creative Commons Attribution Share Alike 3.0 Austria",
        licenseId: "CC-BY-SA-3.0-AT",
        url: licenseRefLink("CC-BY-SA-3.0-AT"),
    },
    {
        name: "Creative Commons Attribution Share Alike 3.0 Germany",
        licenseId: "CC-BY-SA-3.0-DE",
        url: licenseRefLink("CC-BY-SA-3.0-DE"),
    },
    {
        name: "Creative Commons Attribution-ShareAlike 3.0 IGO",
        licenseId: "CC-BY-SA-3.0-IGO",
        url: licenseRefLink("CC-BY-SA-3.0-IGO"),
    },
    {
        name: "Creative Commons Attribution Share Alike 4.0 International",
        licenseId: "CC-BY-SA-4.0",
        url: licenseRefLink("CC-BY-SA-4.0"),
    },
    {
        name: "Creative Commons Public Domain Dedication and Certification",
        licenseId: "CC-PDDC",
        url: licenseRefLink("CC-PDDC"),
    },
    {
        name: "Creative Commons Zero v1.0 Universal",
        licenseId: "CC0-1.0",
        url: licenseRefLink("CC0-1.0"),
    },
    {
        name: "Common Development and Distribution License 1.0",
        licenseId: "CDDL-1.0",
        url: licenseRefLink("CDDL-1.0"),
    },
    {
        name: "Common Development and Distribution License 1.1",
        licenseId: "CDDL-1.1",
        url: licenseRefLink("CDDL-1.1"),
    },
    {
        name: "Common Documentation License 1.0",
        licenseId: "CDL-1.0",
        url: licenseRefLink("CDL-1.0"),
    },
    {
        name: "Community Data License Agreement Permissive 1.0",
        licenseId: "CDLA-Permissive-1.0",
        url: licenseRefLink("CDLA-Permissive-1.0"),
    },
    {
        name: "Community Data License Agreement Permissive 2.0",
        licenseId: "CDLA-Permissive-2.0",
        url: licenseRefLink("CDLA-Permissive-2.0"),
    },
    {
        name: "Community Data License Agreement Sharing 1.0",
        licenseId: "CDLA-Sharing-1.0",
        url: licenseRefLink("CDLA-Sharing-1.0"),
    },
    {
        name: "CeCILL Free Software License Agreement v1.0",
        licenseId: "CECILL-1.0",
        url: licenseRefLink("CECILL-1.0"),
    },
    {
        name: "CeCILL Free Software License Agreement v1.1",
        licenseId: "CECILL-1.1",
        url: licenseRefLink("CECILL-1.1"),
    },
    {
        name: "CeCILL Free Software License Agreement v2.0",
        licenseId: "CECILL-2.0",
        url: licenseRefLink("CECILL-2.0"),
    },
    {
        name: "CeCILL Free Software License Agreement v2.1",
        licenseId: "CECILL-2.1",
        url: licenseRefLink("CECILL-2.1"),
    },
    {
        name: "CeCILL-B Free Software License Agreement",
        licenseId: "CECILL-B",
        url: licenseRefLink("CECILL-B"),
    },
    {
        name: "CeCILL-C Free Software License Agreement",
        licenseId: "CECILL-C",
        url: licenseRefLink("CECILL-C"),
    },
    {
        name: "CERN Open Hardware Licence v1.1",
        licenseId: "CERN-OHL-1.1",
        url: licenseRefLink("CERN-OHL-1.1"),
    },
    {
        name: "CERN Open Hardware Licence v1.2",
        licenseId: "CERN-OHL-1.2",
        url: licenseRefLink("CERN-OHL-1.2"),
    },
    {
        name: "CERN Open Hardware Licence Version 2 - Permissive",
        licenseId: "CERN-OHL-P-2.0",
        url: licenseRefLink("CERN-OHL-P-2.0"),
    },
    {
        name: "CERN Open Hardware Licence Version 2 - Strongly Reciprocal",
        licenseId: "CERN-OHL-S-2.0",
        url: licenseRefLink("CERN-OHL-S-2.0"),
    },
    {
        name: "CERN Open Hardware Licence Version 2 - Weakly Reciprocal",
        licenseId: "CERN-OHL-W-2.0",
        url: licenseRefLink("CERN-OHL-W-2.0"),
    },
    {
        name: "CFITSIO License",
        licenseId: "CFITSIO",
        url: licenseRefLink("CFITSIO"),
    },
    {
        name: "check-cvs License",
        licenseId: "check-cvs",
        url: licenseRefLink("check-cvs"),
    },
    {
        name: "Checkmk License",
        licenseId: "checkmk",
        url: licenseRefLink("checkmk"),
    },
    {
        name: "Clarified Artistic License",
        licenseId: "ClArtistic",
        url: licenseRefLink("ClArtistic"),
    },
    {
        name: "Clips License",
        licenseId: "Clips",
        url: licenseRefLink("Clips"),
    },
    {
        name: "CMU Mach License",
        licenseId: "CMU-Mach",
        url: licenseRefLink("CMU-Mach"),
    },
    {
        name: "CMU    Mach - no notices-in-documentation variant",
        licenseId: "CMU-Mach-nodoc",
        url: licenseRefLink("CMU-Mach-nodoc"),
    },
    {
        name: "CNRI Jython License",
        licenseId: "CNRI-Jython",
        url: licenseRefLink("CNRI-Jython"),
    },
    {
        name: "CNRI Python License",
        licenseId: "CNRI-Python",
        url: licenseRefLink("CNRI-Python"),
    },
    {
        name: "CNRI Python Open Source GPL Compatible License Agreement",
        licenseId: "CNRI-Python-GPL-Compatible",
        url: licenseRefLink("CNRI-Python-GPL-Compatible"),
    },
    {
        name: "Copyfree Open Innovation License",
        licenseId: "COIL-1.0",
        url: licenseRefLink("COIL-1.0"),
    },
    {
        name: "Community Specification License 1.0",
        licenseId: "Community-Spec-1.0",
        url: licenseRefLink("Community-Spec-1.0"),
    },
    {
        name: "Condor Public License v1.1",
        licenseId: "Condor-1.1",
        url: licenseRefLink("Condor-1.1"),
    },
    {
        name: "copyleft-next 0.3.0",
        licenseId: "copyleft-next-0.3.0",
        url: licenseRefLink("copyleft-next-0.3.0"),
    },
    {
        name: "copyleft-next 0.3.1",
        licenseId: "copyleft-next-0.3.1",
        url: licenseRefLink("copyleft-next-0.3.1"),
    },
    {
        name: "Cornell Lossless JPEG License",
        licenseId: "Cornell-Lossless-JPEG",
        url: licenseRefLink("Cornell-Lossless-JPEG"),
    },
    {
        name: "Common Public Attribution License 1.0",
        licenseId: "CPAL-1.0",
        url: licenseRefLink("CPAL-1.0"),
    },
    {
        name: "Common Public License 1.0",
        licenseId: "CPL-1.0",
        url: licenseRefLink("CPL-1.0"),
    },
    {
        name: "Code Project Open License 1.02",
        licenseId: "CPOL-1.02",
        url: licenseRefLink("CPOL-1.02"),
    },
    {
        name: "Cronyx License",
        licenseId: "Cronyx",
        url: licenseRefLink("Cronyx"),
    },
    {
        name: "Crossword License",
        licenseId: "Crossword",
        url: licenseRefLink("Crossword"),
    },
    {
        name: "CrystalStacker License",
        licenseId: "CrystalStacker",
        url: licenseRefLink("CrystalStacker"),
    },
    {
        name: "CUA Office Public License v1.0",
        licenseId: "CUA-OPL-1.0",
        url: licenseRefLink("CUA-OPL-1.0"),
    },
    {
        name: "Cube License",
        licenseId: "Cube",
        url: licenseRefLink("Cube"),
    },
    {
        name: "curl License",
        licenseId: "curl",
        url: licenseRefLink("curl"),
    },
    {
        name: "Common Vulnerability Enumeration ToU License",
        licenseId: "cve-tou",
        url: licenseRefLink("cve-tou"),
    },
    {
        name: "Deutsche Freie Software Lizenz",
        licenseId: "D-FSL-1.0",
        url: licenseRefLink("D-FSL-1.0"),
    },
    {
        name: "DEC 3-Clause License",
        licenseId: "DEC-3-Clause",
        url: licenseRefLink("DEC-3-Clause"),
    },
    {
        name: "diffmark license",
        licenseId: "diffmark",
        url: licenseRefLink("diffmark"),
    },
    {
        name: "Data licence Germany – attribution – version 2.0",
        licenseId: "DL-DE-BY-2.0",
        url: licenseRefLink("DL-DE-BY-2.0"),
    },
    {
        name: "Data licence Germany – zero – version 2.0",
        licenseId: "DL-DE-ZERO-2.0",
        url: licenseRefLink("DL-DE-ZERO-2.0"),
    },
    {
        name: "DOC License",
        licenseId: "DOC",
        url: licenseRefLink("DOC"),
    },
    {
        name: "DocBook Schema License",
        licenseId: "DocBook-Schema",
        url: licenseRefLink("DocBook-Schema"),
    },
    {
        name: "DocBook Stylesheet License",
        licenseId: "DocBook-Stylesheet",
        url: licenseRefLink("DocBook-Stylesheet"),
    },
    {
        name: "DocBook XML License",
        licenseId: "DocBook-XML",
        url: licenseRefLink("DocBook-XML"),
    },
    {
        name: "Dotseqn License",
        licenseId: "Dotseqn",
        url: licenseRefLink("Dotseqn"),
    },
    {
        name: "Detection Rule License 1.0",
        licenseId: "DRL-1.0",
        url: licenseRefLink("DRL-1.0"),
    },
    {
        name: "Detection Rule License 1.1",
        licenseId: "DRL-1.1",
        url: licenseRefLink("DRL-1.1"),
    },
    {
        name: "DSDP License",
        licenseId: "DSDP",
        url: licenseRefLink("DSDP"),
    },
    {
        name: "David M. Gay dtoa License",
        licenseId: "dtoa",
        url: licenseRefLink("dtoa"),
    },
    {
        name: "dvipdfm License",
        licenseId: "dvipdfm",
        url: licenseRefLink("dvipdfm"),
    },
    {
        name: "Educational Community License v1.0",
        licenseId: "ECL-1.0",
        url: licenseRefLink("ECL-1.0"),
    },
    {
        name: "Educational Community License v2.0",
        licenseId: "ECL-2.0",
        url: licenseRefLink("ECL-2.0"),
    },
    {
        name: "eCos license version 2.0",
        licenseId: "eCos-2.0",
        url: licenseRefLink("eCos-2.0"),
    },
    {
        name: "Eiffel Forum License v1.0",
        licenseId: "EFL-1.0",
        url: licenseRefLink("EFL-1.0"),
    },
    {
        name: "Eiffel Forum License v2.0",
        licenseId: "EFL-2.0",
        url: licenseRefLink("EFL-2.0"),
    },
    {
        name: "eGenix.com Public License 1.1.0",
        licenseId: "eGenix",
        url: licenseRefLink("eGenix"),
    },
    {
        name: "Elastic License 2.0",
        licenseId: "Elastic-2.0",
        url: licenseRefLink("Elastic-2.0"),
    },
    {
        name: "Entessa Public License v1.0",
        licenseId: "Entessa",
        url: licenseRefLink("Entessa"),
    },
    {
        name: "EPICS Open License",
        licenseId: "EPICS",
        url: licenseRefLink("EPICS"),
    },
    {
        name: "Eclipse Public License 1.0",
        licenseId: "EPL-1.0",
        url: licenseRefLink("EPL-1.0"),
    },
    {
        name: "Eclipse Public License 2.0",
        licenseId: "EPL-2.0",
        url: licenseRefLink("EPL-2.0"),
    },
    {
        name: "Erlang Public License v1.1",
        licenseId: "ErlPL-1.1",
        url: licenseRefLink("ErlPL-1.1"),
    },
    {
        name: "Etalab Open License 2.0",
        licenseId: "etalab-2.0",
        url: licenseRefLink("etalab-2.0"),
    },
    {
        name: "EU DataGrid Software License",
        licenseId: "EUDatagrid",
        url: licenseRefLink("EUDatagrid"),
    },
    {
        name: "European Union Public License 1.0",
        licenseId: "EUPL-1.0",
        url: licenseRefLink("EUPL-1.0"),
    },
    {
        name: "European Union Public License 1.1",
        licenseId: "EUPL-1.1",
        url: licenseRefLink("EUPL-1.1"),
    },
    {
        name: "European Union Public License 1.2",
        licenseId: "EUPL-1.2",
        url: licenseRefLink("EUPL-1.2"),
    },
    {
        name: "Eurosym License",
        licenseId: "Eurosym",
        url: licenseRefLink("Eurosym"),
    },
    {
        name: "Fair License",
        licenseId: "Fair",
        url: licenseRefLink("Fair"),
    },
    {
        name: "Fuzzy Bitmap License",
        licenseId: "FBM",
        url: licenseRefLink("FBM"),
    },
    {
        name: "Fraunhofer FDK AAC Codec Library",
        licenseId: "FDK-AAC",
        url: licenseRefLink("FDK-AAC"),
    },
    {
        name: "Ferguson Twofish License",
        licenseId: "Ferguson-Twofish",
        url: licenseRefLink("Ferguson-Twofish"),
    },
    {
        name: "Frameworx Open License 1.0",
        licenseId: "Frameworx-1.0",
        url: licenseRefLink("Frameworx-1.0"),
    },
    {
        name: "FreeBSD Documentation License",
        licenseId: "FreeBSD-DOC",
        url: licenseRefLink("FreeBSD-DOC"),
    },
    {
        name: "FreeImage Public License v1.0",
        licenseId: "FreeImage",
        url: licenseRefLink("FreeImage"),
    },
    {
        name: "FSF All Permissive License",
        licenseId: "FSFAP",
        url: licenseRefLink("FSFAP"),
    },
    {
        name: "FSF All Permissive License (without Warranty)",
        licenseId: "FSFAP-no-warranty-disclaimer",
        url: licenseRefLink("FSFAP-no-warranty-disclaimer"),
    },
    {
        name: "FSF Unlimited License",
        licenseId: "FSFUL",
        url: licenseRefLink("FSFUL"),
    },
    {
        name: "FSF Unlimited License (with License Retention)",
        licenseId: "FSFULLR",
        url: licenseRefLink("FSFULLR"),
    },
    {
        name: "FSF Unlimited License (With License Retention and Warranty Disclaimer)",
        licenseId: "FSFULLRWD",
        url: licenseRefLink("FSFULLRWD"),
    },
    {
        name: "Freetype Project License",
        licenseId: "FTL",
        url: licenseRefLink("FTL"),
    },
    {
        name: "Furuseth License",
        licenseId: "Furuseth",
        url: licenseRefLink("Furuseth"),
    },
    {
        name: "fwlw License",
        licenseId: "fwlw",
        url: licenseRefLink("fwlw"),
    },
    {
        name: "Gnome GCR Documentation License",
        licenseId: "GCR-docs",
        url: licenseRefLink("GCR-docs"),
    },
    {
        name: "GD License",
        licenseId: "GD",
        url: licenseRefLink("GD"),
    },
    {
        name: "GNU Free Documentation License v1.1",
        licenseId: "GFDL-1.1",
        url: licenseRefLink("GFDL-1.1"),
    },
    {
        name: "GNU Free Documentation License v1.1 only - invariants",
        licenseId: "GFDL-1.1-invariants-only",
        url: licenseRefLink("GFDL-1.1-invariants-only"),
    },
    {
        name: "GNU Free Documentation License v1.1 or later - invariants",
        licenseId: "GFDL-1.1-invariants-or-later",
        url: licenseRefLink("GFDL-1.1-invariants-or-later"),
    },
    {
        name: "GNU Free Documentation License v1.1 only - no invariants",
        licenseId: "GFDL-1.1-no-invariants-only",
        url: licenseRefLink("GFDL-1.1-no-invariants-only"),
    },
    {
        name: "GNU Free Documentation License v1.1 or later - no invariants",
        licenseId: "GFDL-1.1-no-invariants-or-later",
        url: licenseRefLink("GFDL-1.1-no-invariants-or-later"),
    },
    {
        name: "GNU Free Documentation License v1.1 only",
        licenseId: "GFDL-1.1-only",
        url: licenseRefLink("GFDL-1.1-only"),
    },
    {
        name: "GNU Free Documentation License v1.1 or later",
        licenseId: "GFDL-1.1-or-later",
        url: licenseRefLink("GFDL-1.1-or-later"),
    },
    {
        name: "GNU Free Documentation License v1.2",
        licenseId: "GFDL-1.2",
        url: licenseRefLink("GFDL-1.2"),
    },
    {
        name: "GNU Free Documentation License v1.2 only - invariants",
        licenseId: "GFDL-1.2-invariants-only",
        url: licenseRefLink("GFDL-1.2-invariants-only"),
    },
    {
        name: "GNU Free Documentation License v1.2 or later - invariants",
        licenseId: "GFDL-1.2-invariants-or-later",
        url: licenseRefLink("GFDL-1.2-invariants-or-later"),
    },
    {
        name: "GNU Free Documentation License v1.2 only - no invariants",
        licenseId: "GFDL-1.2-no-invariants-only",
        url: licenseRefLink("GFDL-1.2-no-invariants-only"),
    },
    {
        name: "GNU Free Documentation License v1.2 or later - no invariants",
        licenseId: "GFDL-1.2-no-invariants-or-later",
        url: licenseRefLink("GFDL-1.2-no-invariants-or-later"),
    },
    {
        name: "GNU Free Documentation License v1.2 only",
        licenseId: "GFDL-1.2-only",
        url: licenseRefLink("GFDL-1.2-only"),
    },
    {
        name: "GNU Free Documentation License v1.2 or later",
        licenseId: "GFDL-1.2-or-later",
        url: licenseRefLink("GFDL-1.2-or-later"),
    },
    {
        name: "GNU Free Documentation License v1.3",
        licenseId: "GFDL-1.3",
        url: licenseRefLink("GFDL-1.3"),
    },
    {
        name: "GNU Free Documentation License v1.3 only - invariants",
        licenseId: "GFDL-1.3-invariants-only",
        url: licenseRefLink("GFDL-1.3-invariants-only"),
    },
    {
        name: "GNU Free Documentation License v1.3 or later - invariants",
        licenseId: "GFDL-1.3-invariants-or-later",
        url: licenseRefLink("GFDL-1.3-invariants-or-later"),
    },
    {
        name: "GNU Free Documentation License v1.3 only - no invariants",
        licenseId: "GFDL-1.3-no-invariants-only",
        url: licenseRefLink("GFDL-1.3-no-invariants-only"),
    },
    {
        name: "GNU Free Documentation License v1.3 or later - no invariants",
        licenseId: "GFDL-1.3-no-invariants-or-later",
        url: licenseRefLink("GFDL-1.3-no-invariants-or-later"),
    },
    {
        name: "GNU Free Documentation License v1.3 only",
        licenseId: "GFDL-1.3-only",
        url: licenseRefLink("GFDL-1.3-only"),
    },
    {
        name: "GNU Free Documentation License v1.3 or later",
        licenseId: "GFDL-1.3-or-later",
        url: licenseRefLink("GFDL-1.3-or-later"),
    },
    {
        name: "Giftware License",
        licenseId: "Giftware",
        url: licenseRefLink("Giftware"),
    },
    {
        name: "GL2PS License",
        licenseId: "GL2PS",
        url: licenseRefLink("GL2PS"),
    },
    {
        name: "3dfx Glide License",
        licenseId: "Glide",
        url: licenseRefLink("Glide"),
    },
    {
        name: "Glulxe License",
        licenseId: "Glulxe",
        url: licenseRefLink("Glulxe"),
    },
    {
        name: "Good Luck With That Public License",
        licenseId: "GLWTPL",
        url: licenseRefLink("GLWTPL"),
    },
    {
        name: "gnuplot License",
        licenseId: "gnuplot",
        url: licenseRefLink("gnuplot"),
    },
    {
        name: "GNU General Public License v1.0",
        licenseId: "GPL-1.0",
        url: licenseRefLink("GPL-1.0"),
    },
    {
        name: "GNU General Public License v1.0 or later",
        licenseId: "GPL-1.0+",
        url: licenseRefLink("GPL-1.0+"),
    },
    {
        name: "GNU General Public License v1.0 only",
        licenseId: "GPL-1.0-only",
        url: licenseRefLink("GPL-1.0-only"),
    },
    {
        name: "GNU General Public License v1.0 or later",
        licenseId: "GPL-1.0-or-later",
        url: licenseRefLink("GPL-1.0-or-later"),
    },
    {
        name: "GNU General Public License v2.0",
        licenseId: "GPL-2.0",
        url: licenseRefLink("GPL-2.0"),
    },
    {
        name: "GNU General Public License v2.0 or later",
        licenseId: "GPL-2.0+",
        url: licenseRefLink("GPL-2.0+"),
    },
    {
        name: "GNU General Public License v2.0 only",
        licenseId: "GPL-2.0-only",
        url: licenseRefLink("GPL-2.0-only"),
    },
    {
        name: "GNU General Public License v2.0 or later",
        licenseId: "GPL-2.0-or-later",
        url: licenseRefLink("GPL-2.0-or-later"),
    },
    {
        name: "GNU General Public License v3.0",
        licenseId: "GPL-3.0",
        url: licenseRefLink("GPL-3.0"),
    },
    {
        name: "GNU General Public License v3.0 or later",
        licenseId: "GPL-3.0+",
        url: licenseRefLink("GPL-3.0+"),
    },
    {
        name: "GNU General Public License v3.0 only",
        licenseId: "GPL-3.0-only",
        url: licenseRefLink("GPL-3.0-only"),
    },
    {
        name: "GNU General Public License v3.0 or later",
        licenseId: "GPL-3.0-or-later",
        url: licenseRefLink("GPL-3.0-or-later"),
    },
    {
        name: "Graphics Gems License",
        licenseId: "Graphics-Gems",
        url: licenseRefLink("Graphics-Gems"),
    },
    {
        name: "gSOAP Public License v1.3b",
        licenseId: "gSOAP-1.3b",
        url: licenseRefLink("gSOAP-1.3b"),
    },
    {
        name: "gtkbook License",
        licenseId: "gtkbook",
        url: licenseRefLink("gtkbook"),
    },
    {
        name: "Gutmann License",
        licenseId: "Gutmann",
        url: licenseRefLink("Gutmann"),
    },
    {
        name: "Haskell Language Report License",
        licenseId: "HaskellReport",
        url: licenseRefLink("HaskellReport"),
    },
    {
        name: "hdparm License",
        licenseId: "hdparm",
        url: licenseRefLink("hdparm"),
    },
    {
        name: "HIDAPI License",
        licenseId: "HIDAPI",
        url: licenseRefLink("HIDAPI"),
    },
    {
        name: "Hippocratic License 2.1",
        licenseId: "Hippocratic-2.1",
        url: licenseRefLink("Hippocratic-2.1"),
    },
    {
        name: "Hewlett-Packard 1986 License",
        licenseId: "HP-1986",
        url: licenseRefLink("HP-1986"),
    },
    {
        name: "Hewlett-Packard 1989 License",
        licenseId: "HP-1989",
        url: licenseRefLink("HP-1989"),
    },
    {
        name: "Historical Permission Notice and Disclaimer",
        licenseId: "HPND",
        url: licenseRefLink("HPND"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - DEC variant",
        licenseId: "HPND-DEC",
        url: licenseRefLink("HPND-DEC"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - documentation variant",
        licenseId: "HPND-doc",
        url: licenseRefLink("HPND-doc"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - documentation sell variant",
        licenseId: "HPND-doc-sell",
        url: licenseRefLink("HPND-doc-sell"),
    },
    {
        name: "HPND with US Government export control warning",
        licenseId: "HPND-export-US",
        url: licenseRefLink("HPND-export-US"),
    },
    {
        name: "HPND with US Government export control warning and acknowledgment",
        licenseId: "HPND-export-US-acknowledgement",
        url: licenseRefLink("HPND-export-US-acknowledgement"),
    },
    {
        name: "HPND with US Government export control warning and modification rqmt",
        licenseId: "HPND-export-US-modify",
        url: licenseRefLink("HPND-export-US-modify"),
    },
    {
        name: "HPND with US Government export control and 2 disclaimers",
        licenseId: "HPND-export2-US",
        url: licenseRefLink("HPND-export2-US"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - Fenneberg-Livingston variant",
        licenseId: "HPND-Fenneberg-Livingston",
        url: licenseRefLink("HPND-Fenneberg-Livingston"),
    },
    {
        name: "Historical Permission Notice and Disclaimer    - INRIA-IMAG variant",
        licenseId: "HPND-INRIA-IMAG",
        url: licenseRefLink("HPND-INRIA-IMAG"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - Intel variant",
        licenseId: "HPND-Intel",
        url: licenseRefLink("HPND-Intel"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - Kevlin Henney variant",
        licenseId: "HPND-Kevlin-Henney",
        url: licenseRefLink("HPND-Kevlin-Henney"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - Markus Kuhn variant",
        licenseId: "HPND-Markus-Kuhn",
        url: licenseRefLink("HPND-Markus-Kuhn"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - merchantability variant",
        licenseId: "HPND-merchantability-variant",
        url: licenseRefLink("HPND-merchantability-variant"),
    },
    {
        name: "Historical Permission Notice and Disclaimer with MIT disclaimer",
        licenseId: "HPND-MIT-disclaimer",
        url: licenseRefLink("HPND-MIT-disclaimer"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - Netrek variant",
        licenseId: "HPND-Netrek",
        url: licenseRefLink("HPND-Netrek"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - Pbmplus variant",
        licenseId: "HPND-Pbmplus",
        url: licenseRefLink("HPND-Pbmplus"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - sell xserver variant with MIT disclaimer",
        licenseId: "HPND-sell-MIT-disclaimer-xserver",
        url: licenseRefLink("HPND-sell-MIT-disclaimer-xserver"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - sell regexpr variant",
        licenseId: "HPND-sell-regexpr",
        url: licenseRefLink("HPND-sell-regexpr"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - sell variant",
        licenseId: "HPND-sell-variant",
        url: licenseRefLink("HPND-sell-variant"),
    },
    {
        name: "HPND sell variant with MIT disclaimer",
        licenseId: "HPND-sell-variant-MIT-disclaimer",
        url: licenseRefLink("HPND-sell-variant-MIT-disclaimer"),
    },
    {
        name: "HPND sell variant with MIT disclaimer - reverse",
        licenseId: "HPND-sell-variant-MIT-disclaimer-rev",
        url: licenseRefLink("HPND-sell-variant-MIT-disclaimer-rev"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - University of California variant",
        licenseId: "HPND-UC",
        url: licenseRefLink("HPND-UC"),
    },
    {
        name: "Historical Permission Notice and Disclaimer - University of California, US export warning",
        licenseId: "HPND-UC-export-US",
        url: licenseRefLink("HPND-UC-export-US"),
    },
    {
        name: "HTML Tidy License",
        licenseId: "HTMLTIDY",
        url: licenseRefLink("HTMLTIDY"),
    },
    {
        name: "IBM PowerPC Initialization and Boot Software",
        licenseId: "IBM-pibs",
        url: licenseRefLink("IBM-pibs"),
    },
    {
        name: "ICU License",
        licenseId: "ICU",
        url: licenseRefLink("ICU"),
    },
    {
        name: "IEC    Code Components End-user licence agreement",
        licenseId: "IEC-Code-Components-EULA",
        url: licenseRefLink("IEC-Code-Components-EULA"),
    },
    {
        name: "Independent JPEG Group License",
        licenseId: "IJG",
        url: licenseRefLink("IJG"),
    },
    {
        name: "Independent JPEG Group License - short",
        licenseId: "IJG-short",
        url: licenseRefLink("IJG-short"),
    },
    {
        name: "ImageMagick License",
        licenseId: "ImageMagick",
        url: licenseRefLink("ImageMagick"),
    },
    {
        name: "iMatix Standard Function Library Agreement",
        licenseId: "iMatix",
        url: licenseRefLink("iMatix"),
    },
    {
        name: "Imlib2 License",
        licenseId: "Imlib2",
        url: licenseRefLink("Imlib2"),
    },
    {
        name: "Info-ZIP License",
        licenseId: "Info-ZIP",
        url: licenseRefLink("Info-ZIP"),
    },
    {
        name: "Inner Net License v2.0",
        licenseId: "Inner-Net-2.0",
        url: licenseRefLink("Inner-Net-2.0"),
    },
    {
        name: "Intel Open Source License",
        licenseId: "Intel",
        url: licenseRefLink("Intel"),
    },
    {
        name: "Intel ACPI Software License Agreement",
        licenseId: "Intel-ACPI",
        url: licenseRefLink("Intel-ACPI"),
    },
    {
        name: "Interbase Public License v1.0",
        licenseId: "Interbase-1.0",
        url: licenseRefLink("Interbase-1.0"),
    },
    {
        name: "IPA Font License",
        licenseId: "IPA",
        url: licenseRefLink("IPA"),
    },
    {
        name: "IBM Public License v1.0",
        licenseId: "IPL-1.0",
        url: licenseRefLink("IPL-1.0"),
    },
    {
        name: "ISC License",
        licenseId: "ISC",
        url: licenseRefLink("ISC"),
    },
    {
        name: "ISC Veillard variant",
        licenseId: "ISC-Veillard",
        url: licenseRefLink("ISC-Veillard"),
    },
    {
        name: "Jam License",
        licenseId: "Jam",
        url: licenseRefLink("Jam"),
    },
    {
        name: "JasPer License",
        licenseId: "JasPer-2.0",
        url: licenseRefLink("JasPer-2.0"),
    },
    {
        name: "JPL Image Use Policy",
        licenseId: "JPL-image",
        url: licenseRefLink("JPL-image"),
    },
    {
        name: "Japan Network Information Center License",
        licenseId: "JPNIC",
        url: licenseRefLink("JPNIC"),
    },
    {
        name: "JSON License",
        licenseId: "JSON",
        url: licenseRefLink("JSON"),
    },
    {
        name: "Kastrup License",
        licenseId: "Kastrup",
        url: licenseRefLink("Kastrup"),
    },
    {
        name: "Kazlib License",
        licenseId: "Kazlib",
        url: licenseRefLink("Kazlib"),
    },
    {
        name: "Knuth CTAN License",
        licenseId: "Knuth-CTAN",
        url: licenseRefLink("Knuth-CTAN"),
    },
    {
        name: "Licence Art Libre 1.2",
        licenseId: "LAL-1.2",
        url: licenseRefLink("LAL-1.2"),
    },
    {
        name: "Licence Art Libre 1.3",
        licenseId: "LAL-1.3",
        url: licenseRefLink("LAL-1.3"),
    },
    {
        name: "Latex2e License",
        licenseId: "Latex2e",
        url: licenseRefLink("Latex2e"),
    },
    {
        name: "Latex2e with translated notice permission",
        licenseId: "Latex2e-translated-notice",
        url: licenseRefLink("Latex2e-translated-notice"),
    },
    {
        name: "Leptonica License",
        licenseId: "Leptonica",
        url: licenseRefLink("Leptonica"),
    },
    {
        name: "GNU Library General Public License v2",
        licenseId: "LGPL-2.0",
        url: licenseRefLink("LGPL-2.0"),
    },
    {
        name: "GNU Library General Public License v2 or later",
        licenseId: "LGPL-2.0+",
        url: licenseRefLink("LGPL-2.0+"),
    },
    {
        name: "GNU Library General Public License v2 only",
        licenseId: "LGPL-2.0-only",
        url: licenseRefLink("LGPL-2.0-only"),
    },
    {
        name: "GNU Library General Public License v2 or later",
        licenseId: "LGPL-2.0-or-later",
        url: licenseRefLink("LGPL-2.0-or-later"),
    },
    {
        name: "GNU Lesser General Public License v2.1",
        licenseId: "LGPL-2.1",
        url: licenseRefLink("LGPL-2.1"),
    },
    {
        name: "GNU Lesser General Public License v2.1 or later",
        licenseId: "LGPL-2.1+",
        url: licenseRefLink("LGPL-2.1+"),
    },
    {
        name: "GNU Lesser General Public License v2.1 only",
        licenseId: "LGPL-2.1-only",
        url: licenseRefLink("LGPL-2.1-only"),
    },
    {
        name: "GNU Lesser General Public License v2.1 or later",
        licenseId: "LGPL-2.1-or-later",
        url: licenseRefLink("LGPL-2.1-or-later"),
    },
    {
        name: "GNU Lesser General Public License v3.0",
        licenseId: "LGPL-3.0",
        url: licenseRefLink("LGPL-3.0"),
    },
    {
        name: "GNU Lesser General Public License v3.0 or later",
        licenseId: "LGPL-3.0+",
        url: licenseRefLink("LGPL-3.0+"),
    },
    {
        name: "GNU Lesser General Public License v3.0 only",
        licenseId: "LGPL-3.0-only",
        url: licenseRefLink("LGPL-3.0-only"),
    },
    {
        name: "GNU Lesser General Public License v3.0 or later",
        licenseId: "LGPL-3.0-or-later",
        url: licenseRefLink("LGPL-3.0-or-later"),
    },
    {
        name: "Lesser General Public License For Linguistic Resources",
        licenseId: "LGPLLR",
        url: licenseRefLink("LGPLLR"),
    },
    {
        name: "libpng License",
        licenseId: "Libpng",
        url: licenseRefLink("Libpng"),
    },
    {
        name: "PNG Reference Library version 2",
        licenseId: "libpng-2.0",
        url: licenseRefLink("libpng-2.0"),
    },
    {
        name: "libselinux public domain notice",
        licenseId: "libselinux-1.0",
        url: licenseRefLink("libselinux-1.0"),
    },
    {
        name: "libtiff License",
        licenseId: "libtiff",
        url: licenseRefLink("libtiff"),
    },
    {
        name: "libutil David Nugent License",
        licenseId: "libutil-David-Nugent",
        url: licenseRefLink("libutil-David-Nugent"),
    },
    {
        name: "Licence Libre du Québec – Permissive version 1.1",
        licenseId: "LiLiQ-P-1.1",
        url: licenseRefLink("LiLiQ-P-1.1"),
    },
    {
        name: "Licence Libre du Québec – Réciprocité version 1.1",
        licenseId: "LiLiQ-R-1.1",
        url: licenseRefLink("LiLiQ-R-1.1"),
    },
    {
        name: "Licence Libre du Québec – Réciprocité forte version 1.1",
        licenseId: "LiLiQ-Rplus-1.1",
        url: licenseRefLink("LiLiQ-Rplus-1.1"),
    },
    {
        name: "Linux man-pages - 1 paragraph",
        licenseId: "Linux-man-pages-1-para",
        url: licenseRefLink("Linux-man-pages-1-para"),
    },
    {
        name: "Linux man-pages Copyleft",
        licenseId: "Linux-man-pages-copyleft",
        url: licenseRefLink("Linux-man-pages-copyleft"),
    },
    {
        name: "Linux man-pages Copyleft - 2 paragraphs",
        licenseId: "Linux-man-pages-copyleft-2-para",
        url: licenseRefLink("Linux-man-pages-copyleft-2-para"),
    },
    {
        name: "Linux man-pages Copyleft Variant",
        licenseId: "Linux-man-pages-copyleft-var",
        url: licenseRefLink("Linux-man-pages-copyleft-var"),
    },
    {
        name: "Linux Kernel Variant of OpenIB.org license",
        licenseId: "Linux-OpenIB",
        url: licenseRefLink("Linux-OpenIB"),
    },
    {
        name: "Common Lisp LOOP License",
        licenseId: "LOOP",
        url: licenseRefLink("LOOP"),
    },
    {
        name: "LPD Documentation License",
        licenseId: "LPD-document",
        url: licenseRefLink("LPD-document"),
    },
    {
        name: "Lucent Public License Version 1.0",
        licenseId: "LPL-1.0",
        url: licenseRefLink("LPL-1.0"),
    },
    {
        name: "Lucent Public License v1.02",
        licenseId: "LPL-1.02",
        url: licenseRefLink("LPL-1.02"),
    },
    {
        name: "LaTeX Project Public License v1.0",
        licenseId: "LPPL-1.0",
        url: licenseRefLink("LPPL-1.0"),
    },
    {
        name: "LaTeX Project Public License v1.1",
        licenseId: "LPPL-1.1",
        url: licenseRefLink("LPPL-1.1"),
    },
    {
        name: "LaTeX Project Public License v1.2",
        licenseId: "LPPL-1.2",
        url: licenseRefLink("LPPL-1.2"),
    },
    {
        name: "LaTeX Project Public License v1.3a",
        licenseId: "LPPL-1.3a",
        url: licenseRefLink("LPPL-1.3a"),
    },
    {
        name: "LaTeX Project Public License v1.3c",
        licenseId: "LPPL-1.3c",
        url: licenseRefLink("LPPL-1.3c"),
    },
    {
        name: "lsof License",
        licenseId: "lsof",
        url: licenseRefLink("lsof"),
    },
    {
        name: "Lucida Bitmap Fonts License",
        licenseId: "Lucida-Bitmap-Fonts",
        url: licenseRefLink("Lucida-Bitmap-Fonts"),
    },
    {
        name: "LZMA SDK License (versions 9.11 to 9.20)",
        licenseId: "LZMA-SDK-9.11-to-9.20",
        url: licenseRefLink("LZMA-SDK-9.11-to-9.20"),
    },
    {
        name: "LZMA SDK License (versions 9.22 and beyond)",
        licenseId: "LZMA-SDK-9.22",
        url: licenseRefLink("LZMA-SDK-9.22"),
    },
    {
        name: "Mackerras 3-Clause License",
        licenseId: "Mackerras-3-Clause",
        url: licenseRefLink("Mackerras-3-Clause"),
    },
    {
        name: "Mackerras 3-Clause - acknowledgment variant",
        licenseId: "Mackerras-3-Clause-acknowledgment",
        url: licenseRefLink("Mackerras-3-Clause-acknowledgment"),
    },
    {
        name: "magaz License",
        licenseId: "magaz",
        url: licenseRefLink("magaz"),
    },
    {
        name: "mailprio License",
        licenseId: "mailprio",
        url: licenseRefLink("mailprio"),
    },
    {
        name: "MakeIndex License",
        licenseId: "MakeIndex",
        url: licenseRefLink("MakeIndex"),
    },
    {
        name: "Martin Birgmeier License",
        licenseId: "Martin-Birgmeier",
        url: licenseRefLink("Martin-Birgmeier"),
    },
    {
        name: "McPhee Slideshow License",
        licenseId: "McPhee-slideshow",
        url: licenseRefLink("McPhee-slideshow"),
    },
    {
        name: "metamail License",
        licenseId: "metamail",
        url: licenseRefLink("metamail"),
    },
    {
        name: "Minpack License",
        licenseId: "Minpack",
        url: licenseRefLink("Minpack"),
    },
    {
        name: "The MirOS Licence",
        licenseId: "MirOS",
        url: licenseRefLink("MirOS"),
    },
    {
        name: "MIT License",
        licenseId: "MIT",
        url: licenseRefLink("MIT"),
    },
    {
        name: "MIT No Attribution",
        licenseId: "MIT-0",
        url: licenseRefLink("MIT-0"),
    },
    {
        name: "Enlightenment License (e16)",
        licenseId: "MIT-advertising",
        url: licenseRefLink("MIT-advertising"),
    },
    {
        name: "MIT Click License",
        licenseId: "MIT-Click",
        url: licenseRefLink("MIT-Click"),
    },
    {
        name: "CMU License",
        licenseId: "MIT-CMU",
        url: licenseRefLink("MIT-CMU"),
    },
    {
        name: "enna License",
        licenseId: "MIT-enna",
        url: licenseRefLink("MIT-enna"),
    },
    {
        name: "feh License",
        licenseId: "MIT-feh",
        url: licenseRefLink("MIT-feh"),
    },
    {
        name: "MIT Festival Variant",
        licenseId: "MIT-Festival",
        url: licenseRefLink("MIT-Festival"),
    },
    {
        name: "MIT Khronos - old variant",
        licenseId: "MIT-Khronos-old",
        url: licenseRefLink("MIT-Khronos-old"),
    },
    {
        name: "MIT License Modern Variant",
        licenseId: "MIT-Modern-Variant",
        url: licenseRefLink("MIT-Modern-Variant"),
    },
    {
        name: "MIT Open Group variant",
        licenseId: "MIT-open-group",
        url: licenseRefLink("MIT-open-group"),
    },
    {
        name: "MIT testregex Variant",
        licenseId: "MIT-testregex",
        url: licenseRefLink("MIT-testregex"),
    },
    {
        name: "MIT Tom Wu Variant",
        licenseId: "MIT-Wu",
        url: licenseRefLink("MIT-Wu"),
    },
    {
        name: "MIT +no-false-attribs license",
        licenseId: "MITNFA",
        url: licenseRefLink("MITNFA"),
    },
    {
        name: "MMIXware License",
        licenseId: "MMIXware",
        url: licenseRefLink("MMIXware"),
    },
    {
        name: "Motosoto License",
        licenseId: "Motosoto",
        url: licenseRefLink("Motosoto"),
    },
    {
        name: "MPEG Software Simulation",
        licenseId: "MPEG-SSG",
        url: licenseRefLink("MPEG-SSG"),
    },
    {
        name: "mpi Permissive License",
        licenseId: "mpi-permissive",
        url: licenseRefLink("mpi-permissive"),
    },
    {
        name: "mpich2 License",
        licenseId: "mpich2",
        url: licenseRefLink("mpich2"),
    },
    {
        name: "Mozilla Public License 1.0",
        licenseId: "MPL-1.0",
        url: licenseRefLink("MPL-1.0"),
    },
    {
        name: "Mozilla Public License 1.1",
        licenseId: "MPL-1.1",
        url: licenseRefLink("MPL-1.1"),
    },
    {
        name: "Mozilla Public License 2.0",
        licenseId: "MPL-2.0",
        url: licenseRefLink("MPL-2.0"),
    },
    {
        name: "Mozilla Public License 2.0 (no copyleft exception)",
        licenseId: "MPL-2.0-no-copyleft-exception",
        url: licenseRefLink("MPL-2.0-no-copyleft-exception"),
    },
    {
        name: "mplus Font License",
        licenseId: "mplus",
        url: licenseRefLink("mplus"),
    },
    {
        name: "Microsoft Limited Public License",
        licenseId: "MS-LPL",
        url: licenseRefLink("MS-LPL"),
    },
    {
        name: "Microsoft Public License",
        licenseId: "MS-PL",
        url: licenseRefLink("MS-PL"),
    },
    {
        name: "Microsoft Reciprocal License",
        licenseId: "MS-RL",
        url: licenseRefLink("MS-RL"),
    },
    {
        name: "Matrix Template Library License",
        licenseId: "MTLL",
        url: licenseRefLink("MTLL"),
    },
    {
        name: "Mulan Permissive Software License, Version 1",
        licenseId: "MulanPSL-1.0",
        url: licenseRefLink("MulanPSL-1.0"),
    },
    {
        name: "Mulan Permissive Software License, Version 2",
        licenseId: "MulanPSL-2.0",
        url: licenseRefLink("MulanPSL-2.0"),
    },
    {
        name: "Multics License",
        licenseId: "Multics",
        url: licenseRefLink("Multics"),
    },
    {
        name: "Mup License",
        licenseId: "Mup",
        url: licenseRefLink("Mup"),
    },
    {
        name: "Nara Institute of Science and Technology License (2003)",
        licenseId: "NAIST-2003",
        url: licenseRefLink("NAIST-2003"),
    },
    {
        name: "NASA Open Source Agreement 1.3",
        licenseId: "NASA-1.3",
        url: licenseRefLink("NASA-1.3"),
    },
    {
        name: "Naumen Public License",
        licenseId: "Naumen",
        url: licenseRefLink("Naumen"),
    },
    {
        name: "Net Boolean Public License v1",
        licenseId: "NBPL-1.0",
        url: licenseRefLink("NBPL-1.0"),
    },
    {
        name: "NCBI Public Domain Notice",
        licenseId: "NCBI-PD",
        url: licenseRefLink("NCBI-PD"),
    },
    {
        name: "Non-Commercial Government Licence",
        licenseId: "NCGL-UK-2.0",
        url: licenseRefLink("NCGL-UK-2.0"),
    },
    {
        name: "NCL Source Code License",
        licenseId: "NCL",
        url: licenseRefLink("NCL"),
    },
    {
        name: "University of Illinois/NCSA Open Source License",
        licenseId: "NCSA",
        url: licenseRefLink("NCSA"),
    },
    {
        name: "NetCDF license",
        licenseId: "NetCDF",
        url: licenseRefLink("NetCDF"),
    },
    {
        name: "Newsletr License",
        licenseId: "Newsletr",
        url: licenseRefLink("Newsletr"),
    },
    {
        name: "Nethack General Public License",
        licenseId: "NGPL",
        url: licenseRefLink("NGPL"),
    },
    {
        name: "NICTA Public Software License, Version 1.0",
        licenseId: "NICTA-1.0",
        url: licenseRefLink("NICTA-1.0"),
    },
    {
        name: "NIST Public Domain Notice",
        licenseId: "NIST-PD",
        url: licenseRefLink("NIST-PD"),
    },
    {
        name: "NIST Public Domain Notice with license fallback",
        licenseId: "NIST-PD-fallback",
        url: licenseRefLink("NIST-PD-fallback"),
    },
    {
        name: "NIST Software License",
        licenseId: "NIST-Software",
        url: licenseRefLink("NIST-Software"),
    },
    {
        name: "Norwegian Licence for Open Government Data (NLOD) 1.0",
        licenseId: "NLOD-1.0",
        url: licenseRefLink("NLOD-1.0"),
    },
    {
        name: "Norwegian Licence for Open Government Data (NLOD) 2.0",
        licenseId: "NLOD-2.0",
        url: licenseRefLink("NLOD-2.0"),
    },
    {
        name: "No Limit Public License",
        licenseId: "NLPL",
        url: licenseRefLink("NLPL"),
    },
    {
        name: "Nokia Open Source License",
        licenseId: "Nokia",
        url: licenseRefLink("Nokia"),
    },
    {
        name: "Netizen Open Source License",
        licenseId: "NOSL",
        url: licenseRefLink("NOSL"),
    },
    {
        name: "Noweb License",
        licenseId: "Noweb",
        url: licenseRefLink("Noweb"),
    },
    {
        name: "Netscape Public License v1.0",
        licenseId: "NPL-1.0",
        url: licenseRefLink("NPL-1.0"),
    },
    {
        name: "Netscape Public License v1.1",
        licenseId: "NPL-1.1",
        url: licenseRefLink("NPL-1.1"),
    },
    {
        name: "Non-Profit Open Software License 3.0",
        licenseId: "NPOSL-3.0",
        url: licenseRefLink("NPOSL-3.0"),
    },
    {
        name: "NRL License",
        licenseId: "NRL",
        url: licenseRefLink("NRL"),
    },
    {
        name: "NTP License",
        licenseId: "NTP",
        url: licenseRefLink("NTP"),
    },
    {
        name: "NTP No Attribution",
        licenseId: "NTP-0",
        url: licenseRefLink("NTP-0"),
    },
    {
        name: "Open Use of Data Agreement v1.0",
        licenseId: "O-UDA-1.0",
        url: licenseRefLink("O-UDA-1.0"),
    },
    {
        name: "OAR License",
        licenseId: "OAR",
        url: licenseRefLink("OAR"),
    },
    {
        name: "Open CASCADE Technology Public License",
        licenseId: "OCCT-PL",
        url: licenseRefLink("OCCT-PL"),
    },
    {
        name: "OCLC Research Public License 2.0",
        licenseId: "OCLC-2.0",
        url: licenseRefLink("OCLC-2.0"),
    },
    {
        name: "Open Data Commons Open Database License v1.0",
        licenseId: "ODbL-1.0",
        url: licenseRefLink("ODbL-1.0"),
    },
    {
        name: "Open Data Commons Attribution License v1.0",
        licenseId: "ODC-By-1.0",
        url: licenseRefLink("ODC-By-1.0"),
    },
    {
        name: "OFFIS License",
        licenseId: "OFFIS",
        url: licenseRefLink("OFFIS"),
    },
    {
        name: "SIL Open Font License 1.0",
        licenseId: "OFL-1.0",
        url: licenseRefLink("OFL-1.0"),
    },
    {
        name: "SIL Open Font License 1.0 with no Reserved Font Name",
        licenseId: "OFL-1.0-no-RFN",
        url: licenseRefLink("OFL-1.0-no-RFN"),
    },
    {
        name: "SIL Open Font License 1.0 with Reserved Font Name",
        licenseId: "OFL-1.0-RFN",
        url: licenseRefLink("OFL-1.0-RFN"),
    },
    {
        name: "SIL Open Font License 1.1",
        licenseId: "OFL-1.1",
        url: licenseRefLink("OFL-1.1"),
    },
    {
        name: "SIL Open Font License 1.1 with no Reserved Font Name",
        licenseId: "OFL-1.1-no-RFN",
        url: licenseRefLink("OFL-1.1-no-RFN"),
    },
    {
        name: "SIL Open Font License 1.1 with Reserved Font Name",
        licenseId: "OFL-1.1-RFN",
        url: licenseRefLink("OFL-1.1-RFN"),
    },
    {
        name: "OGC Software License, Version 1.0",
        licenseId: "OGC-1.0",
        url: licenseRefLink("OGC-1.0"),
    },
    {
        name: "Taiwan Open Government Data License, version 1.0",
        licenseId: "OGDL-Taiwan-1.0",
        url: licenseRefLink("OGDL-Taiwan-1.0"),
    },
    {
        name: "Open Government Licence - Canada",
        licenseId: "OGL-Canada-2.0",
        url: licenseRefLink("OGL-Canada-2.0"),
    },
    {
        name: "Open Government Licence v1.0",
        licenseId: "OGL-UK-1.0",
        url: licenseRefLink("OGL-UK-1.0"),
    },
    {
        name: "Open Government Licence v2.0",
        licenseId: "OGL-UK-2.0",
        url: licenseRefLink("OGL-UK-2.0"),
    },
    {
        name: "Open Government Licence v3.0",
        licenseId: "OGL-UK-3.0",
        url: licenseRefLink("OGL-UK-3.0"),
    },
    {
        name: "Open Group Test Suite License",
        licenseId: "OGTSL",
        url: licenseRefLink("OGTSL"),
    },
    {
        name: "Open LDAP Public License v1.1",
        licenseId: "OLDAP-1.1",
        url: licenseRefLink("OLDAP-1.1"),
    },
    {
        name: "Open LDAP Public License v1.2",
        licenseId: "OLDAP-1.2",
        url: licenseRefLink("OLDAP-1.2"),
    },
    {
        name: "Open LDAP Public License v1.3",
        licenseId: "OLDAP-1.3",
        url: licenseRefLink("OLDAP-1.3"),
    },
    {
        name: "Open LDAP Public License v1.4",
        licenseId: "OLDAP-1.4",
        url: licenseRefLink("OLDAP-1.4"),
    },
    {
        name: "Open LDAP Public License v2.0 (or possibly 2.0A and 2.0B)",
        licenseId: "OLDAP-2.0",
        url: licenseRefLink("OLDAP-2.0"),
    },
    {
        name: "Open LDAP Public License v2.0.1",
        licenseId: "OLDAP-2.0.1",
        url: licenseRefLink("OLDAP-2.0.1"),
    },
    {
        name: "Open LDAP Public License v2.1",
        licenseId: "OLDAP-2.1",
        url: licenseRefLink("OLDAP-2.1"),
    },
    {
        name: "Open LDAP Public License v2.2",
        licenseId: "OLDAP-2.2",
        url: licenseRefLink("OLDAP-2.2"),
    },
    {
        name: "Open LDAP Public License v2.2.1",
        licenseId: "OLDAP-2.2.1",
        url: licenseRefLink("OLDAP-2.2.1"),
    },
    {
        name: "Open LDAP Public License 2.2.2",
        licenseId: "OLDAP-2.2.2",
        url: licenseRefLink("OLDAP-2.2.2"),
    },
    {
        name: "Open LDAP Public License v2.3",
        licenseId: "OLDAP-2.3",
        url: licenseRefLink("OLDAP-2.3"),
    },
    {
        name: "Open LDAP Public License v2.4",
        licenseId: "OLDAP-2.4",
        url: licenseRefLink("OLDAP-2.4"),
    },
    {
        name: "Open LDAP Public License v2.5",
        licenseId: "OLDAP-2.5",
        url: licenseRefLink("OLDAP-2.5"),
    },
    {
        name: "Open LDAP Public License v2.6",
        licenseId: "OLDAP-2.6",
        url: licenseRefLink("OLDAP-2.6"),
    },
    {
        name: "Open LDAP Public License v2.7",
        licenseId: "OLDAP-2.7",
        url: licenseRefLink("OLDAP-2.7"),
    },
    {
        name: "Open LDAP Public License v2.8",
        licenseId: "OLDAP-2.8",
        url: licenseRefLink("OLDAP-2.8"),
    },
    {
        name: "Open Logistics Foundation License Version 1.3",
        licenseId: "OLFL-1.3",
        url: licenseRefLink("OLFL-1.3"),
    },
    {
        name: "Open Market License",
        licenseId: "OML",
        url: licenseRefLink("OML"),
    },
    {
        name: "OpenPBS v2.3 Software License",
        licenseId: "OpenPBS-2.3",
        url: licenseRefLink("OpenPBS-2.3"),
    },
    {
        name: "OpenSSL License",
        licenseId: "OpenSSL",
        url: licenseRefLink("OpenSSL"),
    },
    {
        name: "OpenSSL License - standalone",
        licenseId: "OpenSSL-standalone",
        url: licenseRefLink("OpenSSL-standalone"),
    },
    {
        name: "OpenVision License",
        licenseId: "OpenVision",
        url: licenseRefLink("OpenVision"),
    },
    {
        name: "Open Public License v1.0",
        licenseId: "OPL-1.0",
        url: licenseRefLink("OPL-1.0"),
    },
    {
        name: "United    Kingdom Open Parliament Licence v3.0",
        licenseId: "OPL-UK-3.0",
        url: licenseRefLink("OPL-UK-3.0"),
    },
    {
        name: "Open Publication License v1.0",
        licenseId: "OPUBL-1.0",
        url: licenseRefLink("OPUBL-1.0"),
    },
    {
        name: "OSET Public License version 2.1",
        licenseId: "OSET-PL-2.1",
        url: licenseRefLink("OSET-PL-2.1"),
    },
    {
        name: "Open Software License 1.0",
        licenseId: "OSL-1.0",
        url: licenseRefLink("OSL-1.0"),
    },
    {
        name: "Open Software License 1.1",
        licenseId: "OSL-1.1",
        url: licenseRefLink("OSL-1.1"),
    },
    {
        name: "Open Software License 2.0",
        licenseId: "OSL-2.0",
        url: licenseRefLink("OSL-2.0"),
    },
    {
        name: "Open Software License 2.1",
        licenseId: "OSL-2.1",
        url: licenseRefLink("OSL-2.1"),
    },
    {
        name: "Open Software License 3.0",
        licenseId: "OSL-3.0",
        url: licenseRefLink("OSL-3.0"),
    },
    {
        name: "PADL License",
        licenseId: "PADL",
        url: licenseRefLink("PADL"),
    },
    {
        name: "The Parity Public License 6.0.0",
        licenseId: "Parity-6.0.0",
        url: licenseRefLink("Parity-6.0.0"),
    },
    {
        name: "The Parity Public License 7.0.0",
        licenseId: "Parity-7.0.0",
        url: licenseRefLink("Parity-7.0.0"),
    },
    {
        name: "Open Data Commons Public Domain Dedication \u0026 License 1.0",
        licenseId: "PDDL-1.0",
        url: licenseRefLink("PDDL-1.0"),
    },
    {
        name: "PHP License v3.0",
        licenseId: "PHP-3.0",
        url: licenseRefLink("PHP-3.0"),
    },
    {
        name: "PHP License v3.01",
        licenseId: "PHP-3.01",
        url: licenseRefLink("PHP-3.01"),
    },
    {
        name: "Pixar License",
        licenseId: "Pixar",
        url: licenseRefLink("Pixar"),
    },
    {
        name: "pkgconf License",
        licenseId: "pkgconf",
        url: licenseRefLink("pkgconf"),
    },
    {
        name: "Plexus Classworlds License",
        licenseId: "Plexus",
        url: licenseRefLink("Plexus"),
    },
    {
        name: "pnmstitch License",
        licenseId: "pnmstitch",
        url: licenseRefLink("pnmstitch"),
    },
    {
        name: "PolyForm Noncommercial License 1.0.0",
        licenseId: "PolyForm-Noncommercial-1.0.0",
        url: licenseRefLink("PolyForm-Noncommercial-1.0.0"),
    },
    {
        name: "PolyForm Small Business License 1.0.0",
        licenseId: "PolyForm-Small-Business-1.0.0",
        url: licenseRefLink("PolyForm-Small-Business-1.0.0"),
    },
    {
        name: "PostgreSQL License",
        licenseId: "PostgreSQL",
        url: licenseRefLink("PostgreSQL"),
    },
    {
        name: "Peer Production License",
        licenseId: "PPL",
        url: licenseRefLink("PPL"),
    },
    {
        name: "Python Software Foundation License 2.0",
        licenseId: "PSF-2.0",
        url: licenseRefLink("PSF-2.0"),
    },
    {
        name: "psfrag License",
        licenseId: "psfrag",
        url: licenseRefLink("psfrag"),
    },
    {
        name: "psutils License",
        licenseId: "psutils",
        url: licenseRefLink("psutils"),
    },
    {
        name: "Python License 2.0",
        licenseId: "Python-2.0",
        url: licenseRefLink("Python-2.0"),
    },
    {
        name: "Python License 2.0.1",
        licenseId: "Python-2.0.1",
        url: licenseRefLink("Python-2.0.1"),
    },
    {
        name: "Python ldap License",
        licenseId: "python-ldap",
        url: licenseRefLink("python-ldap"),
    },
    {
        name: "Qhull License",
        licenseId: "Qhull",
        url: licenseRefLink("Qhull"),
    },
    {
        name: "Q Public License 1.0",
        licenseId: "QPL-1.0",
        url: licenseRefLink("QPL-1.0"),
    },
    {
        name: "Q Public License 1.0 - INRIA 2004 variant",
        licenseId: "QPL-1.0-INRIA-2004",
        url: licenseRefLink("QPL-1.0-INRIA-2004"),
    },
    {
        name: "radvd License",
        licenseId: "radvd",
        url: licenseRefLink("radvd"),
    },
    {
        name: "Rdisc License",
        licenseId: "Rdisc",
        url: licenseRefLink("Rdisc"),
    },
    {
        name: "Red Hat eCos Public License v1.1",
        licenseId: "RHeCos-1.1",
        url: licenseRefLink("RHeCos-1.1"),
    },
    {
        name: "Reciprocal Public License 1.1",
        licenseId: "RPL-1.1",
        url: licenseRefLink("RPL-1.1"),
    },
    {
        name: "Reciprocal Public License 1.5",
        licenseId: "RPL-1.5",
        url: licenseRefLink("RPL-1.5"),
    },
    {
        name: "RealNetworks Public Source License v1.0",
        licenseId: "RPSL-1.0",
        url: licenseRefLink("RPSL-1.0"),
    },
    {
        name: "RSA Message-Digest License",
        licenseId: "RSA-MD",
        url: licenseRefLink("RSA-MD"),
    },
    {
        name: "Ricoh Source Code Public License",
        licenseId: "RSCPL",
        url: licenseRefLink("RSCPL"),
    },
    {
        name: "Ruby License",
        licenseId: "Ruby",
        url: licenseRefLink("Ruby"),
    },
    {
        name: "Ruby pty extension license",
        licenseId: "Ruby-pty",
        url: licenseRefLink("Ruby-pty"),
    },
    {
        name: "Sax Public Domain Notice",
        licenseId: "SAX-PD",
        url: licenseRefLink("SAX-PD"),
    },
    {
        name: "Sax Public Domain Notice 2.0",
        licenseId: "SAX-PD-2.0",
        url: licenseRefLink("SAX-PD-2.0"),
    },
    {
        name: "Saxpath License",
        licenseId: "Saxpath",
        url: licenseRefLink("Saxpath"),
    },
    {
        name: "SCEA Shared Source License",
        licenseId: "SCEA",
        url: licenseRefLink("SCEA"),
    },
    {
        name: "Scheme Language Report License",
        licenseId: "SchemeReport",
        url: licenseRefLink("SchemeReport"),
    },
    {
        name: "Sendmail License",
        licenseId: "Sendmail",
        url: licenseRefLink("Sendmail"),
    },
    {
        name: "Sendmail License 8.23",
        licenseId: "Sendmail-8.23",
        url: licenseRefLink("Sendmail-8.23"),
    },
    {
        name: "SGI Free Software License B v1.0",
        licenseId: "SGI-B-1.0",
        url: licenseRefLink("SGI-B-1.0"),
    },
    {
        name: "SGI Free Software License B v1.1",
        licenseId: "SGI-B-1.1",
        url: licenseRefLink("SGI-B-1.1"),
    },
    {
        name: "SGI Free Software License B v2.0",
        licenseId: "SGI-B-2.0",
        url: licenseRefLink("SGI-B-2.0"),
    },
    {
        name: "SGI OpenGL License",
        licenseId: "SGI-OpenGL",
        url: licenseRefLink("SGI-OpenGL"),
    },
    {
        name: "SGP4 Permission Notice",
        licenseId: "SGP4",
        url: licenseRefLink("SGP4"),
    },
    {
        name: "Solderpad Hardware License v0.5",
        licenseId: "SHL-0.5",
        url: licenseRefLink("SHL-0.5"),
    },
    {
        name: "Solderpad Hardware License, Version 0.51",
        licenseId: "SHL-0.51",
        url: licenseRefLink("SHL-0.51"),
    },
    {
        name: "Simple Public License 2.0",
        licenseId: "SimPL-2.0",
        url: licenseRefLink("SimPL-2.0"),
    },
    {
        name: "Sun Industry Standards Source License v1.1",
        licenseId: "SISSL",
        url: licenseRefLink("SISSL"),
    },
    {
        name: "Sun Industry Standards Source License v1.2",
        licenseId: "SISSL-1.2",
        url: licenseRefLink("SISSL-1.2"),
    },
    {
        name: "SL License",
        licenseId: "SL",
        url: licenseRefLink("SL"),
    },
    {
        name: "Sleepycat License",
        licenseId: "Sleepycat",
        url: licenseRefLink("Sleepycat"),
    },
    {
        name: "Standard ML of New Jersey License",
        licenseId: "SMLNJ",
        url: licenseRefLink("SMLNJ"),
    },
    {
        name: "Secure Messaging Protocol Public License",
        licenseId: "SMPPL",
        url: licenseRefLink("SMPPL"),
    },
    {
        name: "SNIA Public License 1.1",
        licenseId: "SNIA",
        url: licenseRefLink("SNIA"),
    },
    {
        name: "snprintf License",
        licenseId: "snprintf",
        url: licenseRefLink("snprintf"),
    },
    {
        name: "softSurfer License",
        licenseId: "softSurfer",
        url: licenseRefLink("softSurfer"),
    },
    {
        name: "Soundex License",
        licenseId: "Soundex",
        url: licenseRefLink("Soundex"),
    },
    {
        name: "Spencer License 86",
        licenseId: "Spencer-86",
        url: licenseRefLink("Spencer-86"),
    },
    {
        name: "Spencer License 94",
        licenseId: "Spencer-94",
        url: licenseRefLink("Spencer-94"),
    },
    {
        name: "Spencer License 99",
        licenseId: "Spencer-99",
        url: licenseRefLink("Spencer-99"),
    },
    {
        name: "Sun Public License v1.0",
        licenseId: "SPL-1.0",
        url: licenseRefLink("SPL-1.0"),
    },
    {
        name: "ssh-keyscan License",
        licenseId: "ssh-keyscan",
        url: licenseRefLink("ssh-keyscan"),
    },
    {
        name: "SSH OpenSSH license",
        licenseId: "SSH-OpenSSH",
        url: licenseRefLink("SSH-OpenSSH"),
    },
    {
        name: "SSH short notice",
        licenseId: "SSH-short",
        url: licenseRefLink("SSH-short"),
    },
    {
        name: "SSLeay License - standalone",
        licenseId: "SSLeay-standalone",
        url: licenseRefLink("SSLeay-standalone"),
    },
    {
        name: "Server Side Public License, v 1",
        licenseId: "SSPL-1.0",
        url: licenseRefLink("SSPL-1.0"),
    },
    {
        name: "SugarCRM Public License v1.1.3",
        licenseId: "SugarCRM-1.1.3",
        url: licenseRefLink("SugarCRM-1.1.3"),
    },
    {
        name: "Sun PPP License",
        licenseId: "Sun-PPP",
        url: licenseRefLink("Sun-PPP"),
    },
    {
        name: "Sun PPP License (2000)",
        licenseId: "Sun-PPP-2000",
        url: licenseRefLink("Sun-PPP-2000"),
    },
    {
        name: "SunPro License",
        licenseId: "SunPro",
        url: licenseRefLink("SunPro"),
    },
    {
        name: "Scheme Widget Library (SWL) Software License Agreement",
        licenseId: "SWL",
        url: licenseRefLink("SWL"),
    },
    {
        name: "swrule License",
        licenseId: "swrule",
        url: licenseRefLink("swrule"),
    },
    {
        name: "Symlinks License",
        licenseId: "Symlinks",
        url: licenseRefLink("Symlinks"),
    },
    {
        name: "TAPR Open Hardware License v1.0",
        licenseId: "TAPR-OHL-1.0",
        url: licenseRefLink("TAPR-OHL-1.0"),
    },
    {
        name: "TCL/TK License",
        licenseId: "TCL",
        url: licenseRefLink("TCL"),
    },
    {
        name: "TCP Wrappers License",
        licenseId: "TCP-wrappers",
        url: licenseRefLink("TCP-wrappers"),
    },
    {
        name: "TermReadKey License",
        licenseId: "TermReadKey",
        url: licenseRefLink("TermReadKey"),
    },
    {
        name: "Transitive Grace Period Public Licence 1.0",
        licenseId: "TGPPL-1.0",
        url: licenseRefLink("TGPPL-1.0"),
    },
    {
        name: "threeparttable License",
        licenseId: "threeparttable",
        url: licenseRefLink("threeparttable"),
    },
    {
        name: "TMate Open Source License",
        licenseId: "TMate",
        url: licenseRefLink("TMate"),
    },
    {
        name: "TORQUE v2.5+ Software License v1.1",
        licenseId: "TORQUE-1.1",
        url: licenseRefLink("TORQUE-1.1"),
    },
    {
        name: "Trusster Open Source License",
        licenseId: "TOSL",
        url: licenseRefLink("TOSL"),
    },
    {
        name: "Time::ParseDate License",
        licenseId: "TPDL",
        url: licenseRefLink("TPDL"),
    },
    {
        name: "THOR Public License 1.0",
        licenseId: "TPL-1.0",
        url: licenseRefLink("TPL-1.0"),
    },
    {
        name: "TrustedQSL License",
        licenseId: "TrustedQSL",
        url: licenseRefLink("TrustedQSL"),
    },
    {
        name: "Text-Tabs+Wrap License",
        licenseId: "TTWL",
        url: licenseRefLink("TTWL"),
    },
    {
        name: "TTYP0 License",
        licenseId: "TTYP0",
        url: licenseRefLink("TTYP0"),
    },
    {
        name: "Technische Universitaet Berlin License 1.0",
        licenseId: "TU-Berlin-1.0",
        url: licenseRefLink("TU-Berlin-1.0"),
    },
    {
        name: "Technische Universitaet Berlin License 2.0",
        licenseId: "TU-Berlin-2.0",
        url: licenseRefLink("TU-Berlin-2.0"),
    },
    {
        name: "Ubuntu Font Licence v1.0",
        licenseId: "Ubuntu-font-1.0",
        url: licenseRefLink("Ubuntu-font-1.0"),
    },
    {
        name: "UCAR License",
        licenseId: "UCAR",
        url: licenseRefLink("UCAR"),
    },
    {
        name: "Upstream Compatibility License v1.0",
        licenseId: "UCL-1.0",
        url: licenseRefLink("UCL-1.0"),
    },
    {
        name: "ulem License",
        licenseId: "ulem",
        url: licenseRefLink("ulem"),
    },
    {
        name: "Michigan/Merit Networks License",
        licenseId: "UMich-Merit",
        url: licenseRefLink("UMich-Merit"),
    },
    {
        name: "Unicode License v3",
        licenseId: "Unicode-3.0",
        url: licenseRefLink("Unicode-3.0"),
    },
    {
        name: "Unicode License Agreement - Data Files and Software (2015)",
        licenseId: "Unicode-DFS-2015",
        url: licenseRefLink("Unicode-DFS-2015"),
    },
    {
        name: "Unicode License Agreement - Data Files and Software (2016)",
        licenseId: "Unicode-DFS-2016",
        url: licenseRefLink("Unicode-DFS-2016"),
    },
    {
        name: "Unicode Terms of Use",
        licenseId: "Unicode-TOU",
        url: licenseRefLink("Unicode-TOU"),
    },
    {
        name: "UnixCrypt License",
        licenseId: "UnixCrypt",
        url: licenseRefLink("UnixCrypt"),
    },
    {
        name: "The Unlicense",
        licenseId: "Unlicense",
        url: licenseRefLink("Unlicense"),
    },
    {
        name: "Universal Permissive License v1.0",
        licenseId: "UPL-1.0",
        url: licenseRefLink("UPL-1.0"),
    },
    {
        name: "Utah Raster Toolkit Run Length Encoded License",
        licenseId: "URT-RLE",
        url: licenseRefLink("URT-RLE"),
    },
    {
        name: "Vim License",
        licenseId: "Vim",
        url: licenseRefLink("Vim"),
    },
    {
        name: "VOSTROM Public License for Open Source",
        licenseId: "VOSTROM",
        url: licenseRefLink("VOSTROM"),
    },
    {
        name: "Vovida Software License v1.0",
        licenseId: "VSL-1.0",
        url: licenseRefLink("VSL-1.0"),
    },
    {
        name: "W3C Software Notice and License (2002-12-31)",
        licenseId: "W3C",
        url: licenseRefLink("W3C"),
    },
    {
        name: "W3C Software Notice and License (1998-07-20)",
        licenseId: "W3C-19980720",
        url: licenseRefLink("W3C-19980720"),
    },
    {
        name: "W3C Software Notice and Document License (2015-05-13)",
        licenseId: "W3C-20150513",
        url: licenseRefLink("W3C-20150513"),
    },
    {
        name: "w3m License",
        licenseId: "w3m",
        url: licenseRefLink("w3m"),
    },
    {
        name: "Sybase Open Watcom Public License 1.0",
        licenseId: "Watcom-1.0",
        url: licenseRefLink("Watcom-1.0"),
    },
    {
        name: "Widget Workshop License",
        licenseId: "Widget-Workshop",
        url: licenseRefLink("Widget-Workshop"),
    },
    {
        name: "Wsuipa License",
        licenseId: "Wsuipa",
        url: licenseRefLink("Wsuipa"),
    },
    {
        name: "Do What The F*ck You Want To Public License",
        licenseId: "WTFPL",
        url: licenseRefLink("WTFPL"),
    },
    {
        name: "X11 License",
        licenseId: "X11",
        url: licenseRefLink("X11"),
    },
    {
        name: "X11 License Distribution Modification Variant",
        licenseId: "X11-distribute-modifications-variant",
        url: licenseRefLink("X11-distribute-modifications-variant"),
    },
    {
        name: "X11 swapped final paragraphs",
        licenseId: "X11-swapped",
        url: licenseRefLink("X11-swapped"),
    },
    {
        name: "Xdebug License v 1.03",
        licenseId: "Xdebug-1.03",
        url: licenseRefLink("Xdebug-1.03"),
    },
    {
        name: "Xerox License",
        licenseId: "Xerox",
        url: licenseRefLink("Xerox"),
    },
    {
        name: "Xfig License",
        licenseId: "Xfig",
        url: licenseRefLink("Xfig"),
    },
    {
        name: "XFree86 License 1.1",
        licenseId: "XFree86-1.1",
        url: licenseRefLink("XFree86-1.1"),
    },
    {
        name: "xinetd License",
        licenseId: "xinetd",
        url: licenseRefLink("xinetd"),
    },
    {
        name: "xkeyboard-config Zinoviev License",
        licenseId: "xkeyboard-config-Zinoviev",
        url: licenseRefLink("xkeyboard-config-Zinoviev"),
    },
    {
        name: "xlock License",
        licenseId: "xlock",
        url: licenseRefLink("xlock"),
    },
    {
        name: "X.Net License",
        licenseId: "Xnet",
        url: licenseRefLink("Xnet"),
    },
    {
        name: "XPP License",
        licenseId: "xpp",
        url: licenseRefLink("xpp"),
    },
    {
        name: "XSkat License",
        licenseId: "XSkat",
        url: licenseRefLink("XSkat"),
    },
    {
        name: "xzoom License",
        licenseId: "xzoom",
        url: licenseRefLink("xzoom"),
    },
    {
        name: "Yahoo! Public License v1.0",
        licenseId: "YPL-1.0",
        url: licenseRefLink("YPL-1.0"),
    },
    {
        name: "Yahoo! Public License v1.1",
        licenseId: "YPL-1.1",
        url: licenseRefLink("YPL-1.1"),
    },
    {
        name: "Zed License",
        licenseId: "Zed",
        url: licenseRefLink("Zed"),
    },
    {
        name: "Zeeff License",
        licenseId: "Zeeff",
        url: licenseRefLink("Zeeff"),
    },
    {
        name: "Zend License v2.0",
        licenseId: "Zend-2.0",
        url: licenseRefLink("Zend-2.0"),
    },
    {
        name: "Zimbra Public License v1.3",
        licenseId: "Zimbra-1.3",
        url: licenseRefLink("Zimbra-1.3"),
    },
    {
        name: "Zimbra Public License v1.4",
        licenseId: "Zimbra-1.4",
        url: licenseRefLink("Zimbra-1.4"),
    },
    {
        name: "zlib License",
        licenseId: "Zlib",
        url: licenseRefLink("Zlib"),
    },
    {
        name: "zlib/libpng License with Acknowledgement",
        licenseId: "zlib-acknowledgement",
        url: licenseRefLink("zlib-acknowledgement"),
    },
    {
        name: "Zope Public License 1.1",
        licenseId: "ZPL-1.1",
        url: licenseRefLink("ZPL-1.1"),
    },
    {
        name: "Zope Public License 2.0",
        licenseId: "ZPL-2.0",
        url: licenseRefLink("ZPL-2.0"),
    },
    {
        name: "Zope Public License 2.1",
        licenseId: "ZPL-2.1",
        url: licenseRefLink("ZPL-2.1"),
    },
] as const satisfies SPDX_LICENSE[];

export type LicenseIds_T = (typeof SPDX_LICENSE_LIST)[number]["licenseId"];

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

export const CUSTOM_LICENSE_OPTION: SPDX_LICENSE = {
    name: "Custom",
    licenseId: "custom",
    url: null,
};
