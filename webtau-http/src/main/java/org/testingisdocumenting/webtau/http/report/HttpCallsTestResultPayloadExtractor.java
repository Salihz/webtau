/*
 * Copyright 2020 webtau maintainers
 * Copyright 2019 TWO SIGMA OPEN SOURCE, LLC
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

package org.testingisdocumenting.webtau.http.report;

import org.testingisdocumenting.webtau.http.validation.HttpValidationResult;
import org.testingisdocumenting.webtau.reporter.TestResultPayload;
import org.testingisdocumenting.webtau.reporter.TestResultPayloadExtractor;
import org.testingisdocumenting.webtau.reporter.WebTauStep;

import java.util.stream.Collectors;
import java.util.stream.Stream;

public class HttpCallsTestResultPayloadExtractor implements TestResultPayloadExtractor {
    static final String HTTP_CALLS_PAYLOAD_NAME = "httpCalls";

    @Override
    public Stream<TestResultPayload> extract(Stream<WebTauStep> testSteps) {
        Stream<HttpValidationResult> httpValidationResults = testSteps
                .flatMap(s -> s.collectOutputsOfType(HttpValidationResult.class));

        return Stream.of(new TestResultPayload(HTTP_CALLS_PAYLOAD_NAME,
                httpValidationResults.map(HttpValidationResult::toMap).collect(Collectors.toList())));
    }
}
