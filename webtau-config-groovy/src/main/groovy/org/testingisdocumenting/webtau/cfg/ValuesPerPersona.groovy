/*
 * Copyright 2021 webtau maintainers
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.testingisdocumenting.webtau.cfg

import groovy.transform.PackageScope

@PackageScope
class ValuesPerPersona {
    private final Map<String, ConfigValueHolder> valuesPerPersona = new LinkedHashMap<>()

    ConfigValueHolder createOrFindPersonaValueHolderById(String personaId, List<ConfigValueHolder> roots) {
        return valuesPerPersona.computeIfAbsent(personaId,
                (id) -> ConfigValueHolder.withNameAndRoots(id, roots))
    }

    Set<String> getAvailablePersonas() {
        return valuesPerPersona.keySet()
    }

    Map<String, ?> personaConfigAsMap(String personaId) {
        def configHolder = valuesPerPersona.get(personaId)
        if (!configHolder) {
            return Collections.emptyMap()
        }

        return configHolder.toMap()
    }

    ConfigValueHolder get(String personaId) {
        return valuesPerPersona.get(personaId)
    }
}
