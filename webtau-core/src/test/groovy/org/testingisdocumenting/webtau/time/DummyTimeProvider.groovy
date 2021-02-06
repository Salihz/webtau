/*
 * Copyright 2021 webtau maintainers
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

package org.testingisdocumenting.webtau.time

class DummyTimeProvider implements TimeProvider {
    private List<Long> timeSnapshots = []
    private Long constantTime = null
    private int currentSnapshotIdx = 0

    DummyTimeProvider(List<Integer> timeSnapshots) {
        this.timeSnapshots.addAll(timeSnapshots)
    }

    DummyTimeProvider(Long constantTime) {
        this.constantTime = constantTime
    }

    @Override
    long currentTimeMillis() {
        if (constantTime != null) {
            return constantTime
        }

        if (currentSnapshotIdx >= timeSnapshots.size()) {
            throw new RuntimeException("$currentSnapshotIdx idx is out of the provided time snapshots $timeSnapshots")
        }

        return timeSnapshots[currentSnapshotIdx++]
    }
}
