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

package org.testingisdocumenting.webtau.server;

import org.testingisdocumenting.webtau.utils.JsonUtils;

import java.util.Collections;

public class WebtauServerResponseBuilder {
    public static final int USE_DEFAULT_STATUS_CODE = 0;

    WebtauServerResponseBuilder() {
    }

    public WebtauServerResponse json(int statusCode, Object jsonSerializable) {
        return new WebtauServerResponse(statusCode, "application/json", JsonUtils.serialize(jsonSerializable).getBytes(),
                Collections.emptyMap());
    }

    public WebtauServerResponse json(Object jsonSerializable) {
        return json(USE_DEFAULT_STATUS_CODE, jsonSerializable);
    }

    public WebtauServerResponse text(int statusCode, String text) {
        return new WebtauServerResponse(statusCode, "text/plain", text.getBytes(),
                Collections.emptyMap());
    }

    public WebtauServerResponse text(String text) {
        return text(USE_DEFAULT_STATUS_CODE, text);
    }
}
