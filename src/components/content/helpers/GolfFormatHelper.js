import React from "react";
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import {
    calculateConsecutiveOnePutts, calculateMostPutts, calculateLeastPutts, calculateLargestScoreDisparity,
    calculateSingleHoleMetrics, calculateCourseMetrics, calculateHandicapMetrics
} from './GolfMetricHelper';

export const calculateFairways = (round) => {
    let fairways = { l: 0, r: 0, f: 0, x: 0, na: 0, f9: 0, b9: 0 };
    const numberOfHoles = round.hole10 ? 18 : 9;
    for (let hole = 1; hole <= numberOfHoles; hole++) {
        if (round[`hole${hole}`].fir === 'L') fairways.l++; // Left of fairway
        else {
            if (round[`hole${hole}`].fir === 'R') fairways.r++; // Right of fairway
            else {
                if (round[`hole${hole}`].fir === 'F') { // Fairway in regulation
                    fairways.f++;
                    if (hole <= 9) {
                        fairways.f9++;
                    } else {
                        fairways.b9++;
                    }
                }
                else {
                    if (round[`hole${hole}`].fir === 'X') fairways.x++; // Short of fairway/topped/out of bounds
                    else {
                        if (round[`hole${hole}`].fir === 'NA') fairways.na++;
                        else console.log(`INVALID FIR VALUE FOR HOLE ${hole}: `,round[`hole${hole}`].fir);
                    }
                }
            }
        }
    }

    return fairways;
}

export const calculateGreens = (round) => {
    let greens = { g: 0, x: 0, gur: 0, f9: 0, b9: 0 };
    const numberOfHoles = round.hole10 ? 18 : 9;
    for (let hole = 1; hole <= numberOfHoles; hole++) {
        if (round[`hole${hole}`].gir === 'G') { // Green in regulation
            greens.g++;
            if (hole <= 9) {
                greens.f9++;
            } else {
                greens.b9++;
            }
        } else {
            if (round[`hole${hole}`].gir === 'X') greens.x++; // Green missed
            else {
                if (round[`hole${hole}`].gir === 'G-1') greens.gur++; // Green under regulation
                else console.log(`INVALID GIR VALUE FOR HOLE ${hole}: `,round[`hole${hole}`].gir);
            }
        }
    }

    return greens;
}

export const calculatePuttLength = (round) => {
    let puttLength = 0;
    const numberOfHoles = round.hole10 ? 18 : 9;
    for (let i = 1; i <= numberOfHoles; i++) {
        puttLength = puttLength + round[`hole${i}`].puttLength;
        if (typeof round[`hole${i}`].puttLength !== "number") {
            console.log(`INVALID PUTT LENGTH VALUE FOR HOLE ${i}: `,round[`hole${i}`].puttLength);
        }
    }

    return puttLength;
}

export const createParRow = (course, numHoles) => {
    let parRow = [];
    for (let hole = 1; hole <= numHoles; hole++ ) {
        if (hole === 9) {
            parRow.push(
                <>
                    <TableCell key={`${hole}1`} className="textCenter golfTableBorderRightSmall">{course[`hole${hole}`].par}</TableCell>
                    <TableCell key={`${hole}2`} className="textCenter golfTableBorderRightSmall">{course.f9Par}</TableCell>
                </>
            );
        } else if (hole === 18) {
            parRow.push(
                <>
                    <TableCell key={`${hole}1`} className="textCenter golfTableBorderRightSmall">{course[`hole${hole}`].par}</TableCell>
                    <TableCell key={`${hole}2`} className="textCenter golfTableBorderRightSmall">{course.b9Par}</TableCell>
                    <TableCell key={`${hole}3`} className="textCenter">{course.par}</TableCell>
                </>
            );
        } else {
            parRow.push(<TableCell key={`${hole}1`} className="textCenter">{course[`hole${hole}`].par}</TableCell>);
        }
    }
    return parRow;
}

export const createScoreRow = (activeRound, course, numHoles) => {
    let scoreRow = [];
    for (let hole = 1; hole <= numHoles; hole++ ) {
        let backgroundColorClassName = "paddingTopSmall paddingLeftSmall paddingRightSmall paddingBottomSmall borderRadiusSmall";
        if (activeRound[`hole${hole}`].score > course[`hole${hole}`].par + 1) backgroundColorClassName += " backgroundColorBogeyPlus";
        if (activeRound[`hole${hole}`].score === course[`hole${hole}`].par + 1) backgroundColorClassName += " backgroundColorBogey";
        if (activeRound[`hole${hole}`].score === course[`hole${hole}`].par - 1) backgroundColorClassName += " backgroundColorBirdie";
        if (activeRound[`hole${hole}`].score < course[`hole${hole}`].par - 1) backgroundColorClassName += " backgroundColorEagle";

        if (hole === 9) {
            scoreRow.push(
                <>
                    <TableCell key={`${hole}1`} className="textCenter golfTableBorderRightSmall"><span className={backgroundColorClassName}>{activeRound[`hole${hole}`].score}</span></TableCell>
                    <TableCell key={`${hole}2`} className="textCenter golfTableBorderRightSmall">{activeRound.out}</TableCell>
                </>
            );
        } else if (hole === 18) {
            scoreRow.push(
                <>
                    <TableCell key={`${hole}1`} className="textCenter golfTableBorderRightSmall"><span className={backgroundColorClassName}>{activeRound[`hole${hole}`].score}</span></TableCell>
                    <TableCell key={`${hole}2`} className="textCenter golfTableBorderRightSmall">{activeRound.in}</TableCell>
                    <TableCell key={`${hole}3`} className="textCenter">{activeRound.total}</TableCell>
                </>
            );
        } else {
            scoreRow.push(<TableCell key={`${hole}1`} className="textCenter"><span className={backgroundColorClassName}>{activeRound[`hole${hole}`].score}</span></TableCell>);
        }
    }
    return scoreRow;
}

export const createPuttsRow = (activeRound, numHoles) => {
    let puttsRow = [];
    for (let hole = 1; hole <= numHoles; hole++ ) {
        let backgroundColorClassName = "paddingTopSmall paddingLeftSmall paddingRightSmall paddingBottomSmall borderRadiusSmall";
        if (activeRound[`hole${hole}`].putts > 2) backgroundColorClassName += " backgroundColorBogey";
        if (activeRound[`hole${hole}`].putts === 1) backgroundColorClassName += " backgroundColorBirdie";
        if (activeRound[`hole${hole}`].putts === 0) backgroundColorClassName += " backgroundColorEagle";

        if (hole === 9) {
            puttsRow.push(
                <>
                    <TableCell key={`${hole}1`} className="textCenter golfTableBorderRightSmall"><span className={backgroundColorClassName}>{activeRound[`hole${hole}`].putts}</span></TableCell>
                    <TableCell key={`${hole}2`} className="textCenter golfTableBorderRightSmall">{activeRound.f9Putts}</TableCell>
                </>
            );
        } else if (hole === 18) {
            puttsRow.push(
                <>
                    <TableCell key={`${hole}1`} className="textCenter golfTableBorderRightSmall"><span className={backgroundColorClassName}>{activeRound[`hole${hole}`].putts}</span></TableCell>
                    <TableCell key={`${hole}2`} className="textCenter golfTableBorderRightSmall">{activeRound.b9Putts}</TableCell>
                    <TableCell key={`${hole}3`} className="textCenter">{activeRound.putts}</TableCell>
                </>
            );
        } else {
            puttsRow.push(<TableCell key={`${hole}1`} className="textCenter"><span className={backgroundColorClassName}>{activeRound[`hole${hole}`].putts}</span></TableCell>);
        }
    }
    return puttsRow;
}

export const createFairwaysRow = (activeRound, numHoles) => {
    let fairwaysRow = [];
    for (let hole = 1; hole <= numHoles; hole++ ) {
        if (hole === 9) {
            fairwaysRow.push(
                <>
                    <TableCell key={`${hole}1`} className="textCenter golfTableBorderRightSmall">{activeRound[`hole${hole}`].fir}</TableCell>
                    <TableCell key={`${hole}2`} className="textCenter golfTableBorderRightSmall">{activeRound.fairways.f9}</TableCell>
                </>
            );
        } else if (hole === 18) {
            fairwaysRow.push(
                <>
                    <TableCell key={`${hole}1`} className="textCenter golfTableBorderRightSmall">{activeRound[`hole${hole}`].fir}</TableCell>
                    <TableCell key={`${hole}2`} className="textCenter golfTableBorderRightSmall">{activeRound.fairways.b9}</TableCell>
                    <TableCell key={`${hole}3`} className="textCenter">{activeRound.fairways.f} ({18 - activeRound.fairways.na})</TableCell>
                </>
            );
        } else {
            fairwaysRow.push(<TableCell key={`${hole}1`} className="textCenter">{activeRound[`hole${hole}`].fir}</TableCell>);
        }
    }
    return fairwaysRow;
}

export const createGreensRow = (activeRound, numHoles) => {
    let greensRow = [];
    for (let hole = 1; hole <= numHoles; hole++ ) {
        if (hole === 9) {
            greensRow.push(
                <>
                    <TableCell key={`${hole}1`} className="textCenter golfTableBorderRightSmall">{activeRound[`hole${hole}`].gir}</TableCell>
                    <TableCell key={`${hole}2`} className="textCenter golfTableBorderRightSmall">{activeRound.greens.f9}</TableCell>
                </>
            );
        } else if (hole === 18) {
            greensRow.push(
                <>
                    <TableCell key={`${hole}1`} className="textCenter golfTableBorderRightSmall">{activeRound[`hole${hole}`].gir}</TableCell>
                    <TableCell key={`${hole}2`} className="textCenter golfTableBorderRightSmall">{activeRound.greens.b9}</TableCell>
                    <TableCell key={`${hole}3`} className="textCenter">{activeRound.greens.g + activeRound.greens.gur}</TableCell>
                </>
            );
        } else {
            greensRow.push(<TableCell key={`${hole}1`} className="textCenter">{activeRound[`hole${hole}`].gir}</TableCell>);
        }
    }
    return greensRow;
}

export const createDTGRow = (activeRound, numHoles) => {
    let dtgRow = [];
    for (let hole = 1; hole <= numHoles; hole++ ) {
        if (hole === 9) {
            dtgRow.push(
                <>
                    <TableCell key={`${hole}1`} className="textCenter golfTableBorderRightSmall">{activeRound[`hole${hole}`].dtg}</TableCell>
                    <TableCell key={`${hole}2`} className="textCenter golfTableBorderRightSmall">AVG: {activeRound.f9DTG}</TableCell>
                </>
            );
        } else if (hole === 18) {
            dtgRow.push(
                <>
                    <TableCell key={`${hole}1`} className="textCenter golfTableBorderRightSmall">{activeRound[`hole${hole}`].dtg}</TableCell>
                    <TableCell key={`${hole}2`} className="textCenter golfTableBorderRightSmall">AVG: {activeRound.f9DTG}</TableCell>
                    <TableCell key={`${hole}3`} className="textCenter">AVG: {activeRound.totalDTG}</TableCell>
                </>
            );
        } else {
            dtgRow.push(<TableCell key={`${hole}1`} className="textCenter">{activeRound[`hole${hole}`].dtg}</TableCell>);
        }
    }
    return dtgRow;
}

export const createFPMRow = (activeRound, numHoles) => {
    let fpmRow = [];
    for (let hole = 1; hole <= numHoles; hole++ ) {
        if (hole === 9) {
            fpmRow.push(
                <>
                    <TableCell key={`${hole}1`} className="textCenter golfTableBorderRightSmall">{activeRound[`hole${hole}`].puttLength}</TableCell>
                    <TableCell key={`${hole}2`} className="textCenter golfTableBorderRightSmall">{activeRound.f9PuttTotal} (AVG: {(activeRound.f9PuttTotal / 9).toFixed(1)})</TableCell>
                </>
            );
        } else if (hole === 18) {
            fpmRow.push(
                <>
                    <TableCell key={`${hole}1`} className="textCenter golfTableBorderRightSmall">{activeRound[`hole${hole}`].puttLength}</TableCell>
                    <TableCell key={`${hole}2`} className="textCenter golfTableBorderRightSmall">{activeRound.b9PuttTotal} (AVG: {(activeRound.b9PuttTotal / 9).toFixed(1)})</TableCell>
                    <TableCell key={`${hole}3`} className="textCenter">{activeRound.f9PuttTotal + activeRound.b9PuttTotal} (AVG: {((activeRound.f9PuttTotal + activeRound.b9PuttTotal) / 18).toFixed(1)})</TableCell>
                </>
            );
        } else {
            fpmRow.push(<TableCell key={`${hole}1`} className="textCenter">{activeRound[`hole${hole}`].puttLength}</TableCell>);
        }
    }
    return fpmRow;
}

export const createNotesRow = (activeRound, numHoles) => {
    let notesRow = [];
    for (let hole = 1; hole <= numHoles; hole++ ) {
        if (hole === 9) {
            notesRow.push(
                <>
                    <TableCell key={`${hole}1`} className="textCenter golfTableBorderRightSmall"><small>{activeRound[`hole${hole}`].notes}</small></TableCell>
                    <TableCell key={`${hole}2`} className="textCenter golfTableBorderRightSmall"></TableCell>
                </>
            );
        } else if (hole === 18) {
            notesRow.push(
                <>
                    <TableCell key={`${hole}1`} className="textCenter golfTableBorderRightSmall"><small>{activeRound[`hole${hole}`].notes}</small></TableCell>
                    <TableCell key={`${hole}2`} className="textCenter golfTableBorderRightSmall"></TableCell>
                    <TableCell key={`${hole}3`} className="textCenter"></TableCell>
                </>
            );
        } else {
            notesRow.push(<TableCell key={`${hole}1`} className="textCenter"><small>{activeRound[`hole${hole}`].notes}</small></TableCell>);
        }
    }
    return notesRow;
}

export const createScorecard = (courseInfo, activeRound, expandScorecard, setExpandScorecard) => {
    const { course, numHoles } = activeRound;
    const courseKey = course === "Anderson Glen" ? courseInfo.andersonGlen : courseInfo.gileadHighlands;
    return (
        <Table className="subTable backgroundColorWhite borderRadiusSmall">
            <TableHead>
                <TableRow>
                    <TableCell key={1} className="golfTableBorderRightSmall"><b>HOLE</b></TableCell>
                    <TableCell key={2} className="textCenter"><b>1</b></TableCell>
                    <TableCell key={3} className="textCenter"><b>2</b></TableCell>
                    <TableCell key={4} className="textCenter"><b>3</b></TableCell>
                    <TableCell key={5} className="textCenter"><b>4</b></TableCell>
                    <TableCell key={6} className="textCenter"><b>5</b></TableCell>
                    <TableCell key={7} className="textCenter"><b>6</b></TableCell>
                    <TableCell key={8} className="textCenter"><b>7</b></TableCell>
                    <TableCell key={9} className="textCenter"><b>8</b></TableCell>
                    <TableCell key={10} className="textCenter golfTableBorderRightSmall"><b>9</b></TableCell>
                    <TableCell key={11} className="textCenter golfTableBorderRightSmall"><b>OUT</b></TableCell>
                    {numHoles === 18 &&
                        <>
                            <TableCell key={12} className="textCenter"><b>10</b></TableCell>
                            <TableCell key={13} className="textCenter"><b>11</b></TableCell>
                            <TableCell key={14} className="textCenter"><b>12</b></TableCell>
                            <TableCell key={15} className="textCenter"><b>13</b></TableCell>
                            <TableCell key={16} className="textCenter"><b>14</b></TableCell>
                            <TableCell key={17} className="textCenter"><b>15</b></TableCell>
                            <TableCell key={18} className="textCenter"><b>16</b></TableCell>
                            <TableCell key={19} className="textCenter"><b>17</b></TableCell>
                            <TableCell key={20} className="textCenter golfTableBorderRightSmall"><b>18</b></TableCell>
                            <TableCell key={21} className="textCenter golfTableBorderRightSmall"><b>IN</b></TableCell>
                            <TableCell key={22} className="textCenter"><b>TOTAL</b></TableCell>
                        </>
                    }
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow key={1}>
                    <TableCell className="golfTableBorderRightSmall">Par</TableCell>
                    {createParRow(courseKey, numHoles)}
                </TableRow>
                <TableRow key={2}>
                    <TableCell className="golfTableBorderRightSmall">Score</TableCell>
                    {createScoreRow(activeRound, courseKey, numHoles)}
                </TableRow>
                {expandScorecard &&
                    <>
                        <TableRow key={3}>
                            <TableCell className="golfTableBorderRightSmall">Putts</TableCell>
                            {createPuttsRow(activeRound, numHoles)}
                        </TableRow>
                        <TableRow key={4}>
                            <TableCell className="golfTableBorderRightSmall">Fairways</TableCell>
                            {createFairwaysRow(activeRound, numHoles)}
                        </TableRow>
                        <TableRow key={5}>
                            <TableCell className="golfTableBorderRightSmall">Greens</TableCell>
                            {createGreensRow(activeRound, numHoles)}
                        </TableRow>
                        <TableRow key={6}>
                            <TableCell className="golfTableBorderRightSmall">DTG</TableCell>
                            {createDTGRow(activeRound, numHoles)}
                        </TableRow>
                        <TableRow key={7}>
                            <TableCell className="golfTableBorderRightSmall">FPM</TableCell>
                            {createFPMRow(activeRound, numHoles)}
                        </TableRow>
                        <TableRow key={8}>
                            <TableCell className="golfTableBorderRightSmall">Notes</TableCell>
                            {createNotesRow(activeRound, numHoles)}
                        </TableRow>
                    </>
                }
                <TableRow className="noMarginTop noMarginBottom">
                    <TableCell colSpan={"22"} className="noPaddingTop noPaddingLeft noPaddingRight noPaddingBottom">
                        <Table>
                            <TableRow>
                                <TableCell className="noPaddingTop noPaddingLeft noPaddingRight noPaddingBottom">
                                    <div className="flexRow justifySpaceBetween noPaddingTop noPaddingLeft noPaddingRight noPaddingBottom">
                                        <div className="flexRow noPaddingTop noPaddingBottom">
                                            <div key={1} className="flexRow alignCenter marginRightExtraSmall">
                                                <span className="chip backgroundColorEagle" />
                                                <small>EAGLE</small>
                                            </div>
                                            <div key={2} className="flexRow alignCenter marginRightExtraSmall">
                                                <span className="chip backgroundColorBirdie" />
                                                <small>BIRDIE</small>
                                            </div>
                                            <div key={3} className="flexRow alignCenter marginRightExtraSmall">
                                                <span className="chip backgroundColorBogey" />
                                                <small>BOGEY</small>
                                            </div>
                                            <div key={4} className="flexRow alignCenter">
                                                <span className="chip backgroundColorBogeyPlus" />
                                                <small>BOGEY PLUS</small>
                                            </div>
                                        </div>
                                        <span className="actionFont" onClick={() => setExpandScorecard(true)}>Expand Scorecard</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        </Table>
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    );
}

export const calculateStats = (courseInfo, allRounds) => {

    const singleHoleMetrics = calculateSingleHoleMetrics(courseInfo, allRounds);
    const courseMetrics = calculateCourseMetrics(courseInfo, allRounds);
    const handicapMetrics = calculateHandicapMetrics(courseInfo, allRounds);

    console.log("singleHoleMetrics",singleHoleMetrics)

    return (
        <>
            {/* Handicap Metrics */}
            <h1 className="marginTopExtraLarge marginBottomLarge">Handicap</h1>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Anderson Glen -</h3>
                <h3 className="strongFont">Front 9: ({handicapMetrics.andersonGlen.f9}), Back 9: ({handicapMetrics.andersonGlen.b9}), Total: ({handicapMetrics.andersonGlen.total})</h3>
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Gilead Highlands -</h3>
                <h3 className="strongFont">Front 9: ({handicapMetrics.gileadHighlands.f9}), Back 9: ({handicapMetrics.gileadHighlands.b9}), Total: ({handicapMetrics.gileadHighlands.total})</h3>
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Overall -</h3>
                <h3 className="strongFont">{handicapMetrics.overall.total}</h3>
            </div>

            {/* Best Anderson Glen */}
            <h1 className="marginTopExtraLarge marginBottomLarge">Best Anderson Glen</h1>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Best score on Front 9 -</h3>
                <h3 className="strongFont">({courseMetrics.andersonGlen.out}) {courseMetrics.andersonGlen.outDate} {courseMetrics.andersonGlen.outPutts} putts</h3>
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Best score on Back 9 -</h3>
                <h3 className="strongFont">({courseMetrics.andersonGlen.in}) {courseMetrics.andersonGlen.inDate} {courseMetrics.andersonGlen.inPutts} putts</h3>
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Best score on 18 holes -</h3>
                <h3 className="strongFont">({courseMetrics.andersonGlen.totalOut} + {courseMetrics.andersonGlen.totalIn} = {courseMetrics.andersonGlen.total}) {courseMetrics.andersonGlen.totalDate} {courseMetrics.andersonGlen.totalPutts} putts</h3>
            </div>

            {/* Best Gilelad Highlands */}
            <h1 className="marginTopExtraLarge marginBottomLarge">Best Gilead Highlands</h1>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Best score on Front 9 -</h3>
                <h3 className="strongFont">({courseMetrics.gileadHighlands.out}) {courseMetrics.gileadHighlands.outDate} {courseMetrics.gileadHighlands.outPutts} putts</h3>
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Best score on Back 9 -</h3>
                <h3 className="strongFont">({courseMetrics.gileadHighlands.in}) {courseMetrics.gileadHighlands.inDate} {courseMetrics.gileadHighlands.inPutts} putts</h3>
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Best score on 18 holes -</h3>
                <h3 className="strongFont">({courseMetrics.gileadHighlands.totalOut} + {courseMetrics.gileadHighlands.totalIn} = {courseMetrics.gileadHighlands.total}) {courseMetrics.gileadHighlands.totalDate} {courseMetrics.gileadHighlands.totalPutts} putts</h3>
            </div>

            {/* Single Hole Metrics */}
            <h1 className="marginTopExtraLarge marginBottomLarge">Single Hole Metrics</h1>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Most birdies on a single hole -</h3>
                <h3 className="strongFont">({singleHoleMetrics.birdies.mostBirdies}) {singleHoleMetrics.birdies.mostBirdiesCourse} Par {singleHoleMetrics.birdies.mostBirdiesPar} Hole {singleHoleMetrics.birdies.mostBirdiesHole} played {singleHoleMetrics.birdies.mostBirdiesRounds} times</h3>
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Least bogey+ on a single hole -</h3>
                <h3 className="strongFont">({singleHoleMetrics.bogeyPlus.leastBogeyPlus}) {singleHoleMetrics.bogeyPlus.leastBogeyPlusCourse} Par {singleHoleMetrics.bogeyPlus.leastBogeyPlusPar} Hole {singleHoleMetrics.bogeyPlus.leastBogeyPlusHole} played {singleHoleMetrics.bogeyPlus.leastBogeyPlusRounds} times</h3>
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Most bogey+ on a single hole -</h3>
                <h3 className="strongFont">({singleHoleMetrics.bogeyPlus.mostBogeyPlus}) {singleHoleMetrics.bogeyPlus.mostBogeyPlusCourse} Par {singleHoleMetrics.bogeyPlus.mostBogeyPlusPar} Hole {singleHoleMetrics.bogeyPlus.mostBogeyPlusHole} played {singleHoleMetrics.bogeyPlus.mostBogeyPlusRounds} times</h3>
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Best cumulative score to par on a single hole -</h3>
                <h3 className="strongFont">({singleHoleMetrics.bestCumulativeScoreSingle.cumulativeScoreToPar < 0 ? "-" : singleHoleMetrics.bestCumulativeScoreSingle.cumulativeScoreToPar > 0 ? "+" : ""}{singleHoleMetrics.bestCumulativeScoreSingle.cumulativeScoreToPar}) {singleHoleMetrics.bestCumulativeScoreSingle.course} Par {singleHoleMetrics.bestCumulativeScoreSingle.par} Hole {singleHoleMetrics.bestCumulativeScoreSingle.hole} played {singleHoleMetrics.bestCumulativeScoreSingle.rounds} times</h3>
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Worst cumulative score on a single hole -</h3>
                <h3 className="strongFont">({singleHoleMetrics.worstCumulativeScoreSingle.cumulativeScoreToPar < 0 ? "-" : singleHoleMetrics.worstCumulativeScoreSingle.cumulativeScoreToPar > 0 ? "+" : ""}{singleHoleMetrics.worstCumulativeScoreSingle.cumulativeScoreToPar}) {singleHoleMetrics.worstCumulativeScoreSingle.course} Par {singleHoleMetrics.worstCumulativeScoreSingle.par} Hole {singleHoleMetrics.worstCumulativeScoreSingle.hole} played {singleHoleMetrics.worstCumulativeScoreSingle.rounds} times</h3>
            </div>

            {/* CTP */}
            <h1 className="marginTopExtraLarge marginBottomLarge">Closest to the Pin</h1>
            {Object.keys(singleHoleMetrics.ctp).map((hole) => {
                const ctp = singleHoleMetrics.ctp[hole]
                return (
                    <div className="flexRow alignCenter marginBottomSmall">
                        <h3 className="marginRightSmall">{ctp.course} {ctp.hole} ({ctp.distance} yards) -</h3>
                        <h3 className="strongFont">{ctp.dth} feet ({ctp.date} Score: {ctp.score})</h3>
                    </div>
                );
            })}

            {/* Miscellaneous Metrics */}
            <h1 className="marginTopExtraLarge marginBottomLarge">Miscellaneous Metrics</h1>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Most consecutive 1 putts -</h3>
                {calculateConsecutiveOnePutts(allRounds)}
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Most putts in 9 holes & 18 holes -</h3>
                {calculateMostPutts(allRounds)}
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Least putts in 9 holes & 18 holes -</h3>
                {calculateLeastPutts(allRounds)}
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Largest score disparity between front 9 and back 9 -</h3>
                {calculateLargestScoreDisparity(allRounds)}
            </div>
            {/* <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Most FIR and GIR on the same hole in 9 holes & 18 holes -</h3>
                
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Longest streak without losing a ball -</h3>
                
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Most FIR in 9 holes & 18 holes -</h3>
                
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Most GIR in 9 holes & 18 holes -</h3>
                
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Most lost balls in 9 holes & 18 holes -</h3>
                
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightSmall">Most miscues in 9 holes & 18 holes -</h3>
                
            </div> */}
        </>
    );
}