<script setup lang="ts"></script>

<template>
  <v-card :title="$t('About')" rounded="0">
    <v-card-subtitle> {{ $t('OpenSourceLibrariesUsed') }} </v-card-subtitle>

    <v-expansion-panels class="license-texts" multiple>
      <v-expansion-panel title="buffer">
        <v-expansion-panel-text>The MIT License (MIT)</v-expansion-panel-text>

        <v-expansion-panel-text>
          Copyright (c) Feross Aboukhadijeh, and other contributors.
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="custom-electron-titlebar">
        <v-expansion-panel-text>MIT License</v-expansion-panel-text>

        <v-expansion-panel-text>Copyright (c) 2018 Alex Torres</v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="echarts">
        <v-expansion-panel-text class="text-center">Apache License</v-expansion-panel-text>
        <v-expansion-panel-text class="text-center">
          Version 2.0, January 2004
        </v-expansion-panel-text>
        <v-expansion-panel-text class="text-center">
          http://www.apache.org/licenses/
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          <ol>
            <li>
              <v-expansion-panel-text>Definitions.</v-expansion-panel-text>
              <v-expansion-panel-text>
                "License" shall mean the terms and conditions for use, reproduction, and
                distribution as defined by Sections 1 through 9 of this document.
              </v-expansion-panel-text>
              <v-expansion-panel-text>
                "Licensor" shall mean the copyright owner or entity authorized by the copyright
                owner that is granting the License.
              </v-expansion-panel-text>
              <v-expansion-panel-text>
                "Legal Entity" shall mean the union of the acting entity and all other entities that
                control, are controlled by, or are under common control with that entity. For the
                purposes of this definition, "control" means (i) the power, direct or indirect, to
                cause the direction or management of such entity, whether by contract or otherwise,
                or (ii) ownership of fifty percent (50%) or more of the outstanding shares, or (iii)
                beneficial ownership of such entity.
              </v-expansion-panel-text>
              <v-expansion-panel-text>
                "You" (or "Your") shall mean an individual or Legal Entity exercising permissions
                granted by this License.
              </v-expansion-panel-text>
              <v-expansion-panel-text>
                "Source" form shall mean the preferred form for making modifications, including but
                not limited to software source code, documentation source, and configuration files.
              </v-expansion-panel-text>
              <v-expansion-panel-text>
                "Object" form shall mean any form resulting from mechanical transformation or
                translation of a Source form, including but not limited to compiled object code,
                generated documentation, and conversions to other media types.
              </v-expansion-panel-text>
              <v-expansion-panel-text>
                "Work" shall mean the work of authorship, whether in Source or Object form, made
                available under the License, as indicated by a copyright notice that is included in
                or attached to the work (an example is provided in the Appendix below).
              </v-expansion-panel-text>
              <v-expansion-panel-text>
                "Derivative Works" shall mean any work, whether in Source or Object form, that is
                based on (or derived from) the Work and for which the editorial revisions,
                annotations, elaborations, or other modifications represent, as a whole, an original
                work of authorship. For the purposes of this License, Derivative Works shall not
                include works that remain separable from, or merely link (or bind by name) to the
                interfaces of, the Work and Derivative Works thereof.
              </v-expansion-panel-text>
              <v-expansion-panel-text>
                "Contribution" shall mean any work of authorship, including the original version of
                the Work and any modifications or additions to that Work or Derivative Works
                thereof, that is intentionally submitted to Licensor for inclusion in the Work by
                the copyright owner or by an individual or Legal Entity authorized to submit on
                behalf of the copyright owner. For the purposes of this definition, "submitted"
                means any form of electronic, verbal, or written communication sent to the Licensor
                or its representatives, including but not limited to communication on electronic
                mailing lists, source code control systems, and issue tracking systems that are
                managed by, or on behalf of, the Licensor for the purpose of discussing and
                improving the Work, but excluding communication that is conspicuously marked or
                otherwise designated in writing by the copyright owner as "Not a Contribution."
              </v-expansion-panel-text>
              <v-expansion-panel-text>
                "Contributor" shall mean Licensor and any individual or Legal Entity on behalf of
                whom a Contribution has been received by Licensor and subsequently incorporated
                within the Work.
              </v-expansion-panel-text>
            </li>

            <li>
              <v-expansion-panel-text>
                Grant of Copyright License. Subject to the terms and conditions of this License,
                each Contributor hereby grants to You a perpetual, worldwide, non-exclusive,
                no-charge, royalty-free, irrevocable copyright license to reproduce, prepare
                Derivative Works of, publicly display, publicly perform, sublicense, and distribute
                the Work and such Derivative Works in Source or Object form.
              </v-expansion-panel-text>
            </li>

            <li>
              <v-expansion-panel-text>
                Grant of Patent License. Subject to the terms and conditions of this License, each
                Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge,
                royalty-free, irrevocable (except as stated in this section) patent license to make,
                have made, use, offer to sell, sell, import, and otherwise transfer the Work, where
                such license applies only to those patent claims licensable by such Contributor that
                are necessarily infringed by their Contribution(s) alone or by combination of their
                Contribution(s) with the Work to which such Contribution(s) was submitted. If You
                institute patent litigation against any entity (including a cross-claim or
                counterclaim in a lawsuit) alleging that the Work or a Contribution incorporated
                within the Work constitutes direct or contributory patent infringement, then any
                patent licenses granted to You under this License for that Work shall terminate as
                of the date such litigation is filed.
              </v-expansion-panel-text>
            </li>

            <li>
              <v-expansion-panel-text>
                Redistribution. You may reproduce and distribute copies of the Work or Derivative
                Works thereof in any medium, with or without modifications, and in Source or Object
                form, provided that You meet the following conditions:
              </v-expansion-panel-text>

              <ol type="a">
                <li>
                  <v-expansion-panel-text>
                    You must give any other recipients of the Work or Derivative Works a copy of
                    this License; and
                  </v-expansion-panel-text>
                </li>
                <li>
                  <v-expansion-panel-text>
                    You must cause any modified files to carry prominent notices stating that You
                    changed the files; and
                  </v-expansion-panel-text>
                </li>
                <li>
                  <v-expansion-panel-text>
                    You must retain, in the Source form of any Derivative Works that You distribute,
                    all copyright, patent, trademark, and attribution notices from the Source form
                    of the Work, excluding those notices that do not pertain to any part of the
                    Derivative Works; and
                  </v-expansion-panel-text>
                </li>
                <li>
                  <v-expansion-panel-text>
                    If the Work includes a "NOTICE" text file as part of its distribution, then any
                    Derivative Works that You distribute must include a readable copy of the
                    attribution notices contained within such NOTICE file, excluding those notices
                    that do not pertain to any part of the Derivative Works, in at least one of the
                    following places: within a NOTICE text file distributed as part of the
                    Derivative Works; within the Source form or documentation, if provided along
                    with the Derivative Works; or, within a display generated by the Derivative
                    Works, if and wherever such third-party notices normally appear. The contents of
                    the NOTICE file are for informational purposes only and do not modify the
                    License. You may add Your own attribution notices within Derivative Works that
                    You distribute, alongside or as an addendum to the NOTICE text from the Work,
                    provided that such additional attribution notices cannot be construed as
                    modifying the License.
                  </v-expansion-panel-text>
                </li>
                <li>
                  <v-expansion-panel-text>
                    You may add Your own copyright statement to Your modifications and may provide
                    additional or different license terms and conditions for use, reproduction, or
                    distribution of Your modifications, or for any such Derivative Works as a whole,
                    provided Your use, reproduction, and distribution of the Work otherwise complies
                    with the conditions stated in this License.
                  </v-expansion-panel-text>
                </li>
              </ol>
            </li>

            <li>
              <v-expansion-panel-text>
                Submission of Contributions. Unless You explicitly state otherwise, any Contribution
                intentionally submitted for inclusion in the Work by You to the Licensor shall be
                under the terms and conditions of this License, without any additional terms or
                conditions. Notwithstanding the above, nothing herein shall supersede or modify the
                terms of any separate license agreement you may have executed with Licensor
                regarding such Contributions.
              </v-expansion-panel-text>
            </li>

            <li>
              <v-expansion-panel-text>
                Trademarks. This License does not grant permission to use the trade names,
                trademarks, service marks, or product names of the Licensor, except as required for
                reasonable and customary use in describing the origin of the Work and reproducing
                the content of the NOTICE file.
              </v-expansion-panel-text>
            </li>

            <li>
              <v-expansion-panel-text>
                Disclaimer of Warranty. Unless required by applicable law or agreed to in writing,
                Licensor provides the Work (and each Contributor provides its Contributions) on an
                "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
                implied, including, without limitation, any warranties or conditions of TITLE,
                NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE. You are
                solely responsible for determining the appropriateness of using or redistributing
                the Work and assume any risks associated with Your exercise of permissions under
                this License.
              </v-expansion-panel-text>
            </li>

            <li>
              <v-expansion-panel-text>
                Limitation of Liability. In no event and under no legal theory, whether in tort
                (including negligence), contract, or otherwise, unless required by applicable law
                (such as deliberate and grossly negligent acts) or agreed to in writing, shall any
                Contributor be liable to You for damages, including any direct, indirect, special,
                incidental, or consequential damages of any character arising as a result of this
                License or out of the use or inability to use the Work (including but not limited to
                damages for loss of goodwill, work stoppage, computer failure or malfunction, or any
                and all other commercial damages or losses), even if such Contributor has been
                advised of the possibility of such damages.
              </v-expansion-panel-text>
            </li>

            <li>
              <v-expansion-panel-text>
                Accepting Warranty or Additional Liability. While redistributing the Work or
                Derivative Works thereof, You may choose to offer, and charge a fee for, acceptance
                of support, warranty, indemnity, or other liability obligations and/or rights
                consistent with this License. However, in accepting such obligations, You may act
                only on Your own behalf and on Your sole responsibility, not on behalf of any other
                Contributor, and only if You agree to indemnify, defend, and hold each Contributor
                harmless for any liability incurred by, or claims asserted against, such Contributor
                by reason of your accepting any such warranty or additional liability.
              </v-expansion-panel-text>
            </li>
          </ol>
        </v-expansion-panel-text>

        <v-expansion-panel-text>END OF TERMS AND CONDITIONS</v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="electron">
        <v-expansion-panel-text> Copyright (c) Electron contributors </v-expansion-panel-text>
        <v-expansion-panel-text> Copyright (c) 2013-2020 GitHub Inc. </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="electron-builder">
        <v-expansion-panel-text> The MIT License (MIT) </v-expansion-panel-text>

        <v-expansion-panel-text> Copyright (c) 2015 Loopline Systems </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="electron-toolkit">
        <v-expansion-panel-text>MIT License</v-expansion-panel-text>

        <v-expansion-panel-text>Copyright (c) 2022, Alex Wei</v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="electron-vite">
        <v-expansion-panel-text> MIT License </v-expansion-panel-text>

        <v-expansion-panel-text> Copyright (c) 2022, Alex Wei </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="eslint">
        <v-expansion-panel-text>
          Copyright OpenJS Foundation and other contributors, &lt;www.openjsf.org&gt;
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="eslint-plugin-vue">
        <v-expansion-panel-text> MIT License </v-expansion-panel-text>

        <v-expansion-panel-text> Copyright (c) 2017 Toru Nagashima </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="file-saver">
        <v-expansion-panel-text>The MIT License</v-expansion-panel-text>

        <v-expansion-panel-text>Copyright © 2016 Eli Grey.</v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="luxon">
        <v-expansion-panel-text>
          Copyright 2019 JS Foundation and other contributors
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="mdi">
        <v-expansion-panel-text>Pictogrammers Free License</v-expansion-panel-text>
        <v-expansion-panel-text>--------------------------</v-expansion-panel-text>

        <v-expansion-panel-text>
          This icon collection is released as free, open source, and GPL friendly by the
          [Pictogrammers](http://pictogrammers.com/) icon group. You may use it for commercial
          projects, open source projects, or anything really.
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          # Icons: Apache 2.0 (https://www.apache.org/licenses/LICENSE-2.0)
        </v-expansion-panel-text>
        <v-expansion-panel-text>
          Some of the icons are redistributed under the Apache 2.0 license. All other icons are
          either redistributed under their respective licenses or are distributed under the Apache
          2.0 license.
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          # Fonts: Apache 2.0 (https://www.apache.org/licenses/LICENSE-2.0)
        </v-expansion-panel-text>
        <v-expansion-panel-text>
          All web and desktop fonts are distributed under the Apache 2.0 license. Web and desktop
          fonts contain some icons that are redistributed under the Apache 2.0 license. All other
          icons are either redistributed under their respective licenses or are distributed under
          the Apache 2.0 license.
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          # Code: MIT (https://opensource.org/licenses/MIT)
        </v-expansion-panel-text>
        <v-expansion-panel-text>
          The MIT license applies to all non-font and non-icon files.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="prettier">
        <v-expansion-panel-text> Copyright © James Long and contributors </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="rushstack">
        <v-expansion-panel-text>
          Copyright (c) Microsoft Corporation. All rights reserved.
        </v-expansion-panel-text>

        <v-expansion-panel-text> MIT License </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="sass">
        <v-expansion-panel-text> Copyright (c) 2016, Google Inc. </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="sass-loader">
        <v-expansion-panel-text>
          Copyright JS Foundation and other contributors
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the 'Software'), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="splitpanes">
        <v-expansion-panel-text> MIT License </v-expansion-panel-text>

        <v-expansion-panel-text> Copyright (c) 2018 Antoni Andre </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="tourguide-js">
        <v-expansion-panel-text> The MIT License (MIT) </v-expansion-panel-text>

        <v-expansion-panel-text> Copyright (c) 2015 Wildbit </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="types">
        <v-expansion-panel-text>
          This project is licensed under the MIT license.
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          Copyrights are respective of each contributor listed at the beginning of each definition
          file.
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="typescript">
        <v-expansion-panel-text class="text-center">Apache License</v-expansion-panel-text>
        <v-expansion-panel-text class="text-center">
          Version 2.0, January 2004
        </v-expansion-panel-text>
        <v-expansion-panel-text class="text-center">
          http://www.apache.org/licenses/
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          <ol>
            <li>
              <v-expansion-panel-text>Definitions.</v-expansion-panel-text>
              <v-expansion-panel-text>
                "License" shall mean the terms and conditions for use, reproduction, and
                distribution as defined by Sections 1 through 9 of this document.
              </v-expansion-panel-text>
              <v-expansion-panel-text>
                "Licensor" shall mean the copyright owner or entity authorized by the copyright
                owner that is granting the License.
              </v-expansion-panel-text>
              <v-expansion-panel-text>
                "Legal Entity" shall mean the union of the acting entity and all other entities that
                control, are controlled by, or are under common control with that entity. For the
                purposes of this definition, "control" means (i) the power, direct or indirect, to
                cause the direction or management of such entity, whether by contract or otherwise,
                or (ii) ownership of fifty percent (50%) or more of the outstanding shares, or (iii)
                beneficial ownership of such entity.
              </v-expansion-panel-text>
              <v-expansion-panel-text>
                "You" (or "Your") shall mean an individual or Legal Entity exercising permissions
                granted by this License.
              </v-expansion-panel-text>
              <v-expansion-panel-text>
                "Source" form shall mean the preferred form for making modifications, including but
                not limited to software source code, documentation source, and configuration files.
              </v-expansion-panel-text>
              <v-expansion-panel-text>
                "Object" form shall mean any form resulting from mechanical transformation or
                translation of a Source form, including but not limited to compiled object code,
                generated documentation, and conversions to other media types.
              </v-expansion-panel-text>
              <v-expansion-panel-text>
                "Work" shall mean the work of authorship, whether in Source or Object form, made
                available under the License, as indicated by a copyright notice that is included in
                or attached to the work (an example is provided in the Appendix below).
              </v-expansion-panel-text>
              <v-expansion-panel-text>
                "Derivative Works" shall mean any work, whether in Source or Object form, that is
                based on (or derived from) the Work and for which the editorial revisions,
                annotations, elaborations, or other modifications represent, as a whole, an original
                work of authorship. For the purposes of this License, Derivative Works shall not
                include works that remain separable from, or merely link (or bind by name) to the
                interfaces of, the Work and Derivative Works thereof.
              </v-expansion-panel-text>
              <v-expansion-panel-text>
                "Contribution" shall mean any work of authorship, including the original version of
                the Work and any modifications or additions to that Work or Derivative Works
                thereof, that is intentionally submitted to Licensor for inclusion in the Work by
                the copyright owner or by an individual or Legal Entity authorized to submit on
                behalf of the copyright owner. For the purposes of this definition, "submitted"
                means any form of electronic, verbal, or written communication sent to the Licensor
                or its representatives, including but not limited to communication on electronic
                mailing lists, source code control systems, and issue tracking systems that are
                managed by, or on behalf of, the Licensor for the purpose of discussing and
                improving the Work, but excluding communication that is conspicuously marked or
                otherwise designated in writing by the copyright owner as "Not a Contribution."
              </v-expansion-panel-text>
              <v-expansion-panel-text>
                "Contributor" shall mean Licensor and any individual or Legal Entity on behalf of
                whom a Contribution has been received by Licensor and subsequently incorporated
                within the Work.
              </v-expansion-panel-text>
            </li>

            <li>
              <v-expansion-panel-text>
                Grant of Copyright License. Subject to the terms and conditions of this License,
                each Contributor hereby grants to You a perpetual, worldwide, non-exclusive,
                no-charge, royalty-free, irrevocable copyright license to reproduce, prepare
                Derivative Works of, publicly display, publicly perform, sublicense, and distribute
                the Work and such Derivative Works in Source or Object form.
              </v-expansion-panel-text>
            </li>

            <li>
              <v-expansion-panel-text>
                Grant of Patent License. Subject to the terms and conditions of this License, each
                Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge,
                royalty-free, irrevocable (except as stated in this section) patent license to make,
                have made, use, offer to sell, sell, import, and otherwise transfer the Work, where
                such license applies only to those patent claims licensable by such Contributor that
                are necessarily infringed by their Contribution(s) alone or by combination of their
                Contribution(s) with the Work to which such Contribution(s) was submitted. If You
                institute patent litigation against any entity (including a cross-claim or
                counterclaim in a lawsuit) alleging that the Work or a Contribution incorporated
                within the Work constitutes direct or contributory patent infringement, then any
                patent licenses granted to You under this License for that Work shall terminate as
                of the date such litigation is filed.
              </v-expansion-panel-text>
            </li>

            <li>
              <v-expansion-panel-text>
                Redistribution. You may reproduce and distribute copies of the Work or Derivative
                Works thereof in any medium, with or without modifications, and in Source or Object
                form, provided that You meet the following conditions:
              </v-expansion-panel-text>

              <ol type="a">
                <li>
                  <v-expansion-panel-text>
                    You must give any other recipients of the Work or Derivative Works a copy of
                    this License; and
                  </v-expansion-panel-text>
                </li>
                <li>
                  <v-expansion-panel-text>
                    You must cause any modified files to carry prominent notices stating that You
                    changed the files; and
                  </v-expansion-panel-text>
                </li>
                <li>
                  <v-expansion-panel-text>
                    You must retain, in the Source form of any Derivative Works that You distribute,
                    all copyright, patent, trademark, and attribution notices from the Source form
                    of the Work, excluding those notices that do not pertain to any part of the
                    Derivative Works; and
                  </v-expansion-panel-text>
                </li>
                <li>
                  <v-expansion-panel-text>
                    If the Work includes a "NOTICE" text file as part of its distribution, then any
                    Derivative Works that You distribute must include a readable copy of the
                    attribution notices contained within such NOTICE file, excluding those notices
                    that do not pertain to any part of the Derivative Works, in at least one of the
                    following places: within a NOTICE text file distributed as part of the
                    Derivative Works; within the Source form or documentation, if provided along
                    with the Derivative Works; or, within a display generated by the Derivative
                    Works, if and wherever such third-party notices normally appear. The contents of
                    the NOTICE file are for informational purposes only and do not modify the
                    License. You may add Your own attribution notices within Derivative Works that
                    You distribute, alongside or as an addendum to the NOTICE text from the Work,
                    provided that such additional attribution notices cannot be construed as
                    modifying the License.
                  </v-expansion-panel-text>
                </li>
                <li>
                  <v-expansion-panel-text>
                    You may add Your own copyright statement to Your modifications and may provide
                    additional or different license terms and conditions for use, reproduction, or
                    distribution of Your modifications, or for any such Derivative Works as a whole,
                    provided Your use, reproduction, and distribution of the Work otherwise complies
                    with the conditions stated in this License.
                  </v-expansion-panel-text>
                </li>
              </ol>
            </li>

            <li>
              <v-expansion-panel-text>
                Submission of Contributions. Unless You explicitly state otherwise, any Contribution
                intentionally submitted for inclusion in the Work by You to the Licensor shall be
                under the terms and conditions of this License, without any additional terms or
                conditions. Notwithstanding the above, nothing herein shall supersede or modify the
                terms of any separate license agreement you may have executed with Licensor
                regarding such Contributions.
              </v-expansion-panel-text>
            </li>

            <li>
              <v-expansion-panel-text>
                Trademarks. This License does not grant permission to use the trade names,
                trademarks, service marks, or product names of the Licensor, except as required for
                reasonable and customary use in describing the origin of the Work and reproducing
                the content of the NOTICE file.
              </v-expansion-panel-text>
            </li>

            <li>
              <v-expansion-panel-text>
                Disclaimer of Warranty. Unless required by applicable law or agreed to in writing,
                Licensor provides the Work (and each Contributor provides its Contributions) on an
                "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
                implied, including, without limitation, any warranties or conditions of TITLE,
                NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE. You are
                solely responsible for determining the appropriateness of using or redistributing
                the Work and assume any risks associated with Your exercise of permissions under
                this License.
              </v-expansion-panel-text>
            </li>

            <li>
              <v-expansion-panel-text>
                Limitation of Liability. In no event and under no legal theory, whether in tort
                (including negligence), contract, or otherwise, unless required by applicable law
                (such as deliberate and grossly negligent acts) or agreed to in writing, shall any
                Contributor be liable to You for damages, including any direct, indirect, special,
                incidental, or consequential damages of any character arising as a result of this
                License or out of the use or inability to use the Work (including but not limited to
                damages for loss of goodwill, work stoppage, computer failure or malfunction, or any
                and all other commercial damages or losses), even if such Contributor has been
                advised of the possibility of such damages.
              </v-expansion-panel-text>
            </li>

            <li>
              <v-expansion-panel-text>
                Accepting Warranty or Additional Liability. While redistributing the Work or
                Derivative Works thereof, You may choose to offer, and charge a fee for, acceptance
                of support, warranty, indemnity, or other liability obligations and/or rights
                consistent with this License. However, in accepting such obligations, You may act
                only on Your own behalf and on Your sole responsibility, not on behalf of any other
                Contributor, and only if You agree to indemnify, defend, and hold each Contributor
                harmless for any liability incurred by, or claims asserted against, such Contributor
                by reason of your accepting any such warranty or additional liability.
              </v-expansion-panel-text>
            </li>
          </ol>
        </v-expansion-panel-text>

        <v-expansion-panel-text>END OF TERMS AND CONDITIONS</v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="vite">
        <v-expansion-panel-text> MIT License </v-expansion-panel-text>

        <v-expansion-panel-text>
          Copyright (c) 2019-present, Yuxi (Evan) You and Vite contributors
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="vite-plugin-vuetify">
        <v-expansion-panel-text> The MIT License (MIT) </v-expansion-panel-text>

        <v-expansion-panel-text>
          Copyright (c) 2016-2019 John Jeremy Leider
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="vitejs">
        <v-expansion-panel-text> MIT License </v-expansion-panel-text>

        <v-expansion-panel-text>
          Copyright (c) 2019-present, Yuxi (Evan) You and Vite contributors
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="vue">
        <v-expansion-panel-text> The MIT License (MIT) </v-expansion-panel-text>

        <v-expansion-panel-text>
          Copyright (c) 2018-present, Yuxi (Evan) You and Vue contributors
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="vue-echarts">
        <v-expansion-panel-text> The MIT License (MIT) </v-expansion-panel-text>

        <v-expansion-panel-text>
          Copyright (c) 2016-present GU Yiling & ECOMFE
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="vue-flow">
        <v-expansion-panel-text>Copyright (c) 2019-2024 webkid GmbH</v-expansion-panel-text>
        <v-expansion-panel-text>Copyright (c) 2021-2024 Burak Cakmakoglu</v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="vue-i18n">
        <v-expansion-panel-text> The MIT License (MIT) </v-expansion-panel-text>

        <v-expansion-panel-text> Copyright (c) 2016 kazuya kawaguchi </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="vue-router">
        <v-expansion-panel-text> The MIT License (MIT) </v-expansion-panel-text>

        <v-expansion-panel-text>
          Copyright (c) 2019-present Eduardo San Martin Morote
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="vue-tsc">
        <v-expansion-panel-text> MIT License </v-expansion-panel-text>

        <v-expansion-panel-text> Copyright (c) 2021-present Johnson Chu </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="vuetify">
        <v-expansion-panel-text> The MIT License (MIT) </v-expansion-panel-text>

        <v-expansion-panel-text>
          Copyright (c) 2016-2023 John Jeremy Leider
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="vueuse">
        <v-expansion-panel-text>MIT License</v-expansion-panel-text>

        <v-expansion-panel-text>
          Copyright (c) 2019-PRESENT Anthony Fu&lt;https://github.com/antfu&gt;
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>

      <v-expansion-panel title="vuex">
        <v-expansion-panel-text> The MIT License (MIT) </v-expansion-panel-text>

        <v-expansion-panel-text> Copyright (c) 2015-present Evan You </v-expansion-panel-text>

        <v-expansion-panel-text>
          Permission is hereby granted, free of charge, to any person obtaining a copy of this
          software and associated documentation files (the "Software"), to deal in the Software
          without restriction, including without limitation the rights to use, copy, modify, merge,
          publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
          to whom the Software is furnished to do so, subject to the following conditions:
        </v-expansion-panel-text>

        <v-expansion-panel-text>
          The above copyright notice and this permission notice shall be included in all copies or
          substantial portions of the Software.
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script lang="ts"></script>

<style lang="scss">
.license-texts {
  .v-expansion-panel-text__wrapper {
    font-family: monospace, monospace;
    max-width: 750px;
  }

  ol {
    padding-left: 24px;
  }
}
</style>
