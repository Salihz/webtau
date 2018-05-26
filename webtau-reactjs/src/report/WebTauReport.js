/*
 * Copyright 2018 TWO SIGMA OPEN SOURCE, LLC
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

import React, {Component} from 'react'
import {DebounceInput} from 'react-debounce-input';

import ListOfTests from './navigation/ListOfTests'
import StatusFilter from './navigation/StatusFilter'
import TestDetails from './details/TestDetails'
import WebTauReportStateCreator from './WebTauReportStateCreator'
import OverallSummary from './OverallSummary'

import EntriesTypeSelection from './navigation/EntriesTypeSelection'

import ListOfHttpCalls from './navigation/ListOfHttpCalls'
import NavigationEntriesType from './navigation/NavigationEntriesType'

import HttpCallDetails from './details/http/HttpCallDetails'

import './WebTauReport.css'

class WebTauReport extends Component {
    constructor(props) {
        super(props)

        this._stateCreator = new WebTauReportStateCreator(props.report)

        this.state = this.stateFromUrl()
    }

    render() {
        const {report} = this.props
        const {entriesType, testId, statusFilter, filterText} = this.state

        return (
            <div className="report">
                <div className="report-name-area">
                    <EntriesTypeSelection selectedType={entriesType}
                                          onSelect={this.onEntriesTypeSelection}/>
                </div>

                <div className="search-area">
                    <DebounceInput value={filterText}
                                   onChange={this.onFilterTextChange}
                                   placeholder="filter text"
                                   minLength={3}
                                   debounceTimeout={300}/>
                </div>

                <div className="items-lists-area">
                    {this.renderListOEntries()}
                </div>

                <div className="test-details-area">
                    {this.renderDetailsArea()}
                </div>

                <div className="status-filter-area">
                    <StatusFilter summary={this.summary}
                                  onTitleClick={this.onHeaderTitleClick}
                                  selectedStatusFilter={statusFilter}
                                  onStatusSelect={this.onEntriesStatusSelect}/>
                </div>
            </div>
        )
    }

    renderListOEntries() {
        const {testId, httpCallIdx, entriesType} = this.state

        if (this.isTestsView) {
            return (
                <ListOfTests tests={this.filteredTests}
                             selectedId={testId}
                             onSelect={this.onTestSelect}/>
            )
        } else {
            return (
                <ListOfHttpCalls httpCalls={this.filteredHttpCalls}
                                 selectedIdx={httpCallIdx}
                                 onSelect={this.onHttpCallSelect}/>
            )
        }
    }

    renderDetailsArea() {
        const {report} = this.props
        const {detailTabName} = this.state

        const selectedEntity = this.selectedEntity

        if (selectedEntity === null) {
            return (
                <OverallSummary report={report}
                                onSwitchToHttpCalls={this.onHttpCallsEntriesTypeSelection}/>
            )
        }

        if (this.isTestsView) {
            return (
                <TestDetails test={selectedEntity}
                             selectedDetailTabName={detailTabName}
                             onDetailsTabSelection={this.onDetailsTabSelection}
                             detailTabs={selectedEntity.details}
                             urlState={this.state}
                             onInternalStateUpdate={this.onDetailsStateUpdate}/>
            )
        }

        return (
            <HttpCallDetails httpCall={selectedEntity} onTestSelect={this.onTestSelect}/>
        )
    }

    get summary() {
        const {report} = this.props
        return this.isTestsView ? report.testsSummary : report.httpCallsSummary
    }

    get isTestsView() {
        return this.state.entriesType === NavigationEntriesType.TESTS
    }

    get selectedEntity() {
        const {report} = this.props
        const {httpCallIdx, testId} = this.state

        if (this.isTestsView) {
            return testId ? report.findTestById(testId) : null
        }

        return httpCallIdx === undefined ? null : report.findHttpCallByIdx(httpCallIdx)
    }

    get filteredTests() {
        const {report} = this.props
        const {statusFilter, filterText} = this.state

        return report.testsWithStatusAndFilteredByText(statusFilter, filterText)
    }

    get filteredHttpCalls() {
        const {report} = this.props
        const {statusFilter, filterText} = this.state

        return report.httpCallsWithStatusAndFilteredByText(statusFilter, filterText)
    }

    onDetailsStateUpdate = (newState) => this.pushPartialUrlState(newState)

    onHeaderTitleClick = () => this.pushPartialUrlState({selectedId: null})

    onTestSelect = (id) => {
        const currentTestId = this.state.testId
        if (id === currentTestId) {
            return
        }

        this.pushFullUrlState({
            detailTabName: this.state.detailTabName,
            statusFilter: this.state.statusFilter,
            filterText: this.state.filterText,
            testId: id
        })
    }

    onHttpCallSelect = (idx) => {
        const currentCallIdx = this.state.httpCallIdx
        if (idx === currentCallIdx) {
            return
        }

        this.pushFullUrlState({
            entriesType: NavigationEntriesType.HTTP_CALLS,
            statusFilter: this.state.statusFilter,
            filterText: this.state.filterText,
            httpCallIdx: idx
        })
    }

    onEntriesStatusSelect = (status) => {
        this.pushFullUrlState({
            entriesType: this.state.entriesType,
            statusFilter: status,
            filterText: this.state.filterText,
        })
    }

    onDetailsTabSelection = (tabName) => this.pushPartialUrlState({detailTabName: tabName})

    onEntriesTypeSelection = (type) => {
        this.pushFullUrlState({entriesType: type})
    }

    onHttpCallsEntriesTypeSelection = (type) => {
        this.pushFullUrlState({entriesType: NavigationEntriesType.HTTP_CALLS, httpCallIdx: 0})
    }

    onFilterTextChange = (e) => {
        this.pushPartialUrlState({filterText: e.target.value})
    }

    componentDidMount() {
        this.subscribeToUrlChanges()
        this.updateStateFromUrl()
    }

    subscribeToUrlChanges() {
        window.addEventListener('popstate', () => {
            this.updateStateFromUrl();
        });
    }

    stateFromUrl() {
        return this._stateCreator.stateFromUrl(document.location.search)
    }

    updateStateFromUrl() {
        this.setState(this.stateFromUrl())
    }

    pushPartialUrlState(partialNewState) {
        this.pushFullUrlState({...this.state, ...partialNewState})
    }

    pushFullUrlState(fullState) {
        const searchParams = this._stateCreator.buildUrlSearchParams(fullState)
        window.history.pushState({}, '', '?' + searchParams)
        this.updateStateFromUrl()
    }
}

export default WebTauReport