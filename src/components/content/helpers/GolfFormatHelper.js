import React from "react";
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import {
    calculateConsecutiveOnePutts, calculateMostPutts, calculateLeastPutts, calculateLargestScoreDisparity,
    calculateSingleHoleMetrics, calculateCourseMetrics, calculateHandicapMetrics
} from './GolfMetricHelper';
// Consts
import { imageSourceMappings } from "./GolfConsts";


export const calculateFairways = (round) => {
    let fairways = { l: 0, r: 0, f: 0, x: 0, na: 0, f9: 0, b9: 0 };
    // const numberOfHoles = round.hole10 ? 18 : 9;
    for (let hole = 1; hole <= 18; hole++) {
        if (round[`hole${hole}`]) {
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
    }

    return fairways;
}

export const calculateGreens = (round) => {
    let greens = { g: 0, x: 0, gur: 0, f9: 0, b9: 0 };
    for (let hole = 1; hole <= 18; hole++) {
        if (round[`hole${hole}`]) {
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
    }

    return greens;
}

export const calculatePuttLength = (round) => {
    let puttLength = 0;
    for (let hole = 1; hole <= 18; hole++) {
        if (round[`hole${hole}`]) {
            puttLength = puttLength + round[`hole${hole}`].puttLength;
            if (typeof round[`hole${hole}`].puttLength !== "number") {
                console.log(`INVALID PUTT LENGTH VALUE FOR HOLE ${hole}: `,round[`hole${hole}`].puttLength);
            }
        }
    }

    return puttLength;
}

export const createParRow = (courseInfo, activeRound) => {
    let parRow = [];
    for (let hole = 1; hole <= 18; hole++) {
        if (activeRound[`hole${hole}`]) {
            if (hole === 9) {
                parRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall">{courseInfo[activeRound.courseKey][`hole${hole}`].par}</TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">{courseInfo[activeRound.courseKey].f9Par}</TableCell>
                    </>
                );
            } else if (hole === 18) {
                parRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall">{courseInfo[activeRound.courseKey][`hole${hole}`].par}</TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">{courseInfo[activeRound.courseKey].b9Par}</TableCell>
                        {activeRound.hole1 && <TableCell key={`${hole}-3`} className="textCenter">{courseInfo[activeRound.courseKey].par}</TableCell>} {/* Display total row only when front 9 is also played */}
                    </>
                );
            } else {
                parRow.push(<TableCell key={`${hole}-1`} className="textCenter">{courseInfo[activeRound.courseKey][`hole${hole}`].par}</TableCell>);
            }
        }
    }
    if (activeRound.additionalHoles) {
        for (let hole = 1; hole <= 9; hole++ ) {
            if (activeRound.additionalHoles[`additionalHole${hole}`]) {
                parRow.push(<TableCell key={`additionalHole${hole}-1`} className="textCenter">{courseInfo[activeRound.additionalHoles[`additionalHole${hole}`].courseKey][`hole${activeRound.additionalHoles[`additionalHole${hole}`].hole}`].par}</TableCell>);
            }
        }
    }

    return parRow;
}

export const createScoreRow = (courseInfo, activeRound, course) => {
    let scoreRow = [];
    for (let hole = 1; hole <= 18; hole++) {
        if (activeRound[`hole${hole}`]) {
            let backgroundColorClassName = "paddingTopSmall paddingLeftSmall paddingRightSmall paddingBottomSmall borderRadiusSmall";
            if (activeRound[`hole${hole}`].score > course[`hole${hole}`].par + 1) backgroundColorClassName += " backgroundColorBogeyPlus";
            if (activeRound[`hole${hole}`].score === course[`hole${hole}`].par + 1) backgroundColorClassName += " backgroundColorBogey";
            if (activeRound[`hole${hole}`].score === course[`hole${hole}`].par - 1) backgroundColorClassName += " backgroundColorBirdie";
            if (activeRound[`hole${hole}`].score < course[`hole${hole}`].par - 1) backgroundColorClassName += " backgroundColorEagle";

            if (hole === 9) {
                scoreRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall"><span className={backgroundColorClassName}>{activeRound[`hole${hole}`].score}</span></TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">{activeRound.out}</TableCell>
                    </>
                );
            } else if (hole === 18) {
                scoreRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall"><span className={backgroundColorClassName}>{activeRound[`hole${hole}`].score}</span></TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">{activeRound.in}</TableCell>
                        {activeRound.hole1 && <TableCell key={`${hole}-3`} className="textCenter">{activeRound.total}</TableCell>} {/* Display total row only when front 9 is also played */}
                    </>
                );
            } else {
                scoreRow.push(<TableCell key={`${hole}1`} className="textCenter"><span className={backgroundColorClassName}>{activeRound[`hole${hole}`].score}</span></TableCell>);
            }
        }
    }
    if (activeRound.additionalHoles) {
        for (let hole = 1; hole <= 9; hole++ ) {
            if (activeRound.additionalHoles[`additionalHole${hole}`]) {
                let backgroundColorClassName = "paddingTopSmall paddingLeftSmall paddingRightSmall paddingBottomSmall borderRadiusSmall";
                if (activeRound.additionalHoles[`additionalHole${hole}`].score > courseInfo[activeRound.additionalHoles[`additionalHole${hole}`].courseKey][`hole${activeRound.additionalHoles[`additionalHole${hole}`].hole}`].par + 1) backgroundColorClassName += " backgroundColorBogeyPlus";
                if (activeRound.additionalHoles[`additionalHole${hole}`].score === courseInfo[activeRound.additionalHoles[`additionalHole${hole}`].courseKey][`hole${activeRound.additionalHoles[`additionalHole${hole}`].hole}`].par + 1) backgroundColorClassName += " backgroundColorBogey";
                if (activeRound.additionalHoles[`additionalHole${hole}`].score === courseInfo[activeRound.additionalHoles[`additionalHole${hole}`].courseKey][`hole${activeRound.additionalHoles[`additionalHole${hole}`].hole}`].par - 1) backgroundColorClassName += " backgroundColorBirdie";
                if (activeRound.additionalHoles[`additionalHole${hole}`].score < courseInfo[activeRound.additionalHoles[`additionalHole${hole}`].courseKey][`hole${activeRound.additionalHoles[`additionalHole${hole}`].hole}`].par - 1) backgroundColorClassName += " backgroundColorEagle";
                scoreRow.push(<TableCell key={`additionalHole${hole}-1`} className="textCenter"><span className={backgroundColorClassName}>{activeRound.additionalHoles[`additionalHole${hole}`].score}</span></TableCell>);
            }
        }
    }

    return scoreRow;
}

export const createPuttsRow = (activeRound) => {
    let puttsRow = [];
    for (let hole = 1; hole <= 18; hole++) {
        if (activeRound[`hole${hole}`]) {
            let backgroundColorClassName = "paddingTopSmall paddingLeftSmall paddingRightSmall paddingBottomSmall borderRadiusSmall";
            if (activeRound[`hole${hole}`].putts > 2) backgroundColorClassName += " backgroundColorBogey";
            if (activeRound[`hole${hole}`].putts === 1) backgroundColorClassName += " backgroundColorBirdie";
            if (activeRound[`hole${hole}`].putts === 0) backgroundColorClassName += " backgroundColorEagle";

            if (hole === 9) {
                puttsRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall"><span className={backgroundColorClassName}>{activeRound[`hole${hole}`].putts}</span></TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">{activeRound.f9Putts}</TableCell>
                    </>
                );
            } else if (hole === 18) {
                puttsRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall"><span className={backgroundColorClassName}>{activeRound[`hole${hole}`].putts}</span></TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">{activeRound.b9Putts}</TableCell>
                        {activeRound.hole1 && <TableCell key={`${hole}-3`} className="textCenter">{activeRound.putts}</TableCell>} {/* Display total row only when front 9 is also played */}
                    </>
                );
            } else {
                puttsRow.push(<TableCell key={`${hole}-1`} className="textCenter"><span className={backgroundColorClassName}>{activeRound[`hole${hole}`].putts}</span></TableCell>);
            }
        }
    }
    if (activeRound.additionalHoles) {
        for (let hole = 1; hole <= 9; hole++ ) {
            if (activeRound.additionalHoles[`additionalHole${hole}`]) {
                let backgroundColorClassName = "paddingTopSmall paddingLeftSmall paddingRightSmall paddingBottomSmall borderRadiusSmall";
                if (activeRound.additionalHoles[`additionalHole${hole}`].putts > 2) backgroundColorClassName += " backgroundColorBogey";
                if (activeRound.additionalHoles[`additionalHole${hole}`].putts === 1) backgroundColorClassName += " backgroundColorBirdie";
                if (activeRound.additionalHoles[`additionalHole${hole}`].putts === 0) backgroundColorClassName += " backgroundColorEagle";
                puttsRow.push(<TableCell key={`additionalHole${hole}-1`} className="textCenter"><span className={backgroundColorClassName}>{activeRound.additionalHoles[`additionalHole${hole}`].putts}</span></TableCell>);
            }
        }
    }
    return puttsRow;
}

export const createScrambleRow = (courseInfo, activeRound) => {
    let scrambleRow = [];
    let strokeMapping = {
        f9: { j: 0, m: 0, n: 0 },
        b9: { j: 0, m: 0, n: 0 },
        drives: { j: 0, m: 0 },
        putts: { j: 0, m: 0, n: 0 }
    };
    for (let hole = 1; hole <= 18; hole++) {
        if (hole <= 9) {
            for (let stroke in activeRound[`hole${hole}`].scrambleString) {
                // if (stroke === 1) {
                //     if ()
                // }
                if (activeRound[`hole${hole}`].scrambleString[stroke] === "J") strokeMapping.f9.j++;
                else if (activeRound[`hole${hole}`].scrambleString[stroke] === "M") strokeMapping.f9.m++;
                else if (activeRound[`hole${hole}`].scrambleString[stroke] === "N") strokeMapping.f9.n++;
            }
        } else {
            for (let stroke in activeRound[`hole${hole}`].scrambleString) {
                if (activeRound[`hole${hole}`].scrambleString[stroke] === "J") strokeMapping.b9.j++;
                else if (activeRound[`hole${hole}`].scrambleString[stroke] === "M") strokeMapping.b9.m++;
                else if (activeRound[`hole${hole}`].scrambleString[stroke] === "N") strokeMapping.b9.n++;
            }
        }
        if (activeRound[`hole${hole}`]) {
            if (hole === 9) {
                scrambleRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall"><small>{activeRound[`hole${hole}`].scrambleString}</small></TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">J: <b>{strokeMapping.f9.j}</b> M: <b>{strokeMapping.f9.m}</b> N: <b>{strokeMapping.f9.n}</b></TableCell>
                    </>
                );
            } else if (hole === 18) {
                scrambleRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall"><small>{activeRound[`hole${hole}`].scrambleString}</small></TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">J: <b>{strokeMapping.b9.j}</b> M: <b>{strokeMapping.b9.m}</b> N: <b>{strokeMapping.b9.n}</b></TableCell>
                        {activeRound.hole1 && <TableCell key={`${hole}-3`} className="textCenter">J: <b>{strokeMapping.f9.j + strokeMapping.b9.j}</b> M: <b>{strokeMapping.f9.m + strokeMapping.b9.m}</b> N: <b>{strokeMapping.f9.n + strokeMapping.b9.n}</b></TableCell>} {/* Display total row only when front 9 is also played */}
                    </>
                );
                strokeMapping = {
                    f9: { j: 0, m: 0, n: 0 },
                    b9: { j: 0, m: 0, n: 0 }
                };
            } else {
                scrambleRow.push(<TableCell key={`${hole}-1`} className="textCenter"><small>{activeRound[`hole${hole}`].scrambleString}</small></TableCell>);
            }
        }
    }

    return scrambleRow;
}

export const createFairwaysRow = (activeRound) => {
    let fairwaysRow = [];
    for (let hole = 1; hole <= 18; hole++) {
        if (activeRound[`hole${hole}`]) {
            if (hole === 9) {
                fairwaysRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall">{activeRound[`hole${hole}`].fir}</TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">{activeRound.fairways.f9}</TableCell>
                    </>
                );
            } else if (hole === 18) {
                fairwaysRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall">{activeRound[`hole${hole}`].fir}</TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">{activeRound.fairways.b9}</TableCell>
                        {activeRound.hole1 && <TableCell key={`${hole}-3`} className="textCenter">{activeRound.fairways.f} ({18 - activeRound.fairways.na})</TableCell>} {/* Display total row only when front 9 is also played */}
                    </>
                );
            } else {
                fairwaysRow.push(<TableCell key={`${hole}-1`} className="textCenter">{activeRound[`hole${hole}`].fir}</TableCell>);
            }
        }
    }
    if (activeRound.additionalHoles) {
        for (let hole = 1; hole <= 9; hole++ ) {
            if (activeRound.additionalHoles[`additionalHole${hole}`]) {
                fairwaysRow.push(<TableCell key={`additionalHole${hole}-1`} className="textCenter">{activeRound.additionalHoles[`additionalHole${hole}`].fir}</TableCell>);
            }
        }
    }

    return fairwaysRow;
}

export const createGreensRow = (activeRound) => {
    let greensRow = [];
    for (let hole = 1; hole <= 18; hole++) {
        if (activeRound[`hole${hole}`]) {
            if (hole === 9) {
                greensRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall">{activeRound[`hole${hole}`].gir}</TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">{activeRound.greens.f9}</TableCell>
                    </>
                );
            } else if (hole === 18) {
                greensRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall">{activeRound[`hole${hole}`].gir}</TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">{activeRound.greens.b9}</TableCell>
                        {activeRound.hole1 && <TableCell key={`${hole}-3`} className="textCenter">{activeRound.greens.g + activeRound.greens.gur}</TableCell>} {/* Display total row only when front 9 is also played */}
                    </>
                );
            } else {
                greensRow.push(<TableCell key={`${hole}-1`} className="textCenter">{activeRound[`hole${hole}`].gir}</TableCell>);
            }
        }
    }
    if (activeRound.additionalHoles) {
        for (let hole = 1; hole <= 9; hole++ ) {
            if (activeRound.additionalHoles[`additionalHole${hole}`]) {
                greensRow.push(<TableCell key={`additionalHole${hole}-1`} className="textCenter">{activeRound.additionalHoles[`additionalHole${hole}`].gir}</TableCell>);
            }
        }
    }

    return greensRow;
}

export const createDTGRow = (activeRound) => {
    let dtgRow = [];
    for (let hole = 1; hole <= 18; hole++) {
        if (activeRound[`hole${hole}`]) {
            if (hole === 9) {
                dtgRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall">{activeRound[`hole${hole}`].dtg}</TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">AVG: {activeRound.f9DTG}</TableCell>
                    </>
                );
            } else if (hole === 18) {
                dtgRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall">{activeRound[`hole${hole}`].dtg}</TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">AVG: {activeRound.f9DTG}</TableCell>
                        {activeRound.hole1 && <TableCell key={`${hole}-3`} className="textCenter">AVG: {activeRound.totalDTG}</TableCell>} {/* Display total row only when front 9 is also played */}
                    </>
                );
            } else {
                dtgRow.push(<TableCell key={`${hole}-1`} className="textCenter">{activeRound[`hole${hole}`].dtg}</TableCell>);
            }
        }
    }
    if (activeRound.additionalHoles) {
        for (let hole = 1; hole <= 9; hole++ ) {
            if (activeRound.additionalHoles[`additionalHole${hole}`]) {
                dtgRow.push(<TableCell key={`additionalHole${hole}-1`} className="textCenter">{activeRound.additionalHoles[`additionalHole${hole}`].dtg}</TableCell>);
            }
        }
    }

    return dtgRow;
}

export const createFPMRow = (activeRound) => {
    let fpmRow = [];
    for (let hole = 1; hole <= 18; hole++) {
        if (activeRound[`hole${hole}`]) {
            if (hole === 9) {
                fpmRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall">{activeRound[`hole${hole}`].puttLength}</TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">{activeRound.f9PuttTotal} (AVG: {(activeRound.f9PuttTotal / 9).toFixed(1)})</TableCell>
                    </>
                );
            } else if (hole === 18) {
                fpmRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall">{activeRound[`hole${hole}`].puttLength}</TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">{activeRound.b9PuttTotal} (AVG: {(activeRound.b9PuttTotal / 9).toFixed(1)})</TableCell>
                        {activeRound.hole1 && <TableCell key={`${hole}-3`} className="textCenter">{activeRound.f9PuttTotal + activeRound.b9PuttTotal} (AVG: {((activeRound.f9PuttTotal + activeRound.b9PuttTotal) / 18).toFixed(1)})</TableCell>} {/* Display total row only when front 9 is also played */}
                    </>
                );
            } else {
                fpmRow.push(<TableCell key={`${hole}-1`} className="textCenter">{activeRound[`hole${hole}`].puttLength}</TableCell>);
            }
        }
    }
    if (activeRound.additionalHoles) {
        for (let hole = 1; hole <= 9; hole++ ) {
            if (activeRound.additionalHoles[`additionalHole${hole}`]) {
                fpmRow.push(<TableCell key={`additionalHole${hole}-1`} className="textCenter">{activeRound.additionalHoles[`additionalHole${hole}`].puttLength}</TableCell>);
            }
        }
    }
    return fpmRow;
}

export const createDTHRow = (activeRound) => {
    let dthRow = [];
    for (let hole = 1; hole <= 18; hole++) {
        if (activeRound[`hole${hole}`]) {
            if (hole === 9) {
                dthRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall">{activeRound[`hole${hole}`].dth}</TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">{activeRound.f9PuttTotal} (AVG: {(activeRound.f9PuttTotal / 9).toFixed(1)})</TableCell>
                    </>
                );
            } else if (hole === 18) {
                dthRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall">{activeRound[`hole${hole}`].dth}</TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">{activeRound.b9PuttTotal} (AVG: {(activeRound.b9PuttTotal / 9).toFixed(1)})</TableCell>
                        {activeRound.hole1 && <TableCell key={`${hole}-3`} className="textCenter">{activeRound.f9PuttTotal + activeRound.b9PuttTotal} (AVG: {((activeRound.f9PuttTotal + activeRound.b9PuttTotal) / 18).toFixed(1)})</TableCell>} {/* Display total row only when front 9 is also played */}
                    </>
                );
            } else {
                dthRow.push(<TableCell key={`${hole}-1`} className="textCenter">{activeRound[`hole${hole}`].dth}</TableCell>);
            }
        }
    }
    if (activeRound.additionalHoles) {
        for (let hole = 1; hole <= 9; hole++ ) {
            if (activeRound.additionalHoles[`additionalHole${hole}`]) {
                dthRow.push(<TableCell key={`additionalHole${hole}-1`} className="textCenter">{activeRound.additionalHoles[`additionalHole${hole}`].dth}</TableCell>);
            }
        }
    }

    return dthRow;
}

export const createNotesRow = (activeRound) => {
    let notesRow = [];
    for (let hole = 1; hole <= 18; hole++) {
        if (activeRound[`hole${hole}`]) {
            if (hole === 9) {
                notesRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall"><small>{activeRound[`hole${hole}`].notes}</small></TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall"></TableCell>
                    </>
                );
            } else if (hole === 18) {
                notesRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall"><small>{activeRound[`hole${hole}`].notes}</small></TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall"></TableCell>
                        {activeRound.hole1 && <TableCell key={`${hole}-3`} className="textCenter"></TableCell>} {/* Display total row only when front 9 is also played */}
                    </>
                );
            } else {
                notesRow.push(<TableCell key={`${hole}-1`} className="textCenter"><small>{activeRound[`hole${hole}`].notes}</small></TableCell>);
            }
        }
    }
    if (activeRound.additionalHoles) {
        for (let hole = 1; hole <= 9; hole++ ) {
            if (activeRound.additionalHoles[`additionalHole${hole}`]) {
                notesRow.push(<TableCell key={`additionalHole${hole}-1`} className="textCenter">{activeRound.additionalHoles[`additionalHole${hole}`].notes}</TableCell>);
            }
        }
    }

    return notesRow;
}

const createScorecardHoleRow = (activeRound) => {
    let holeRow = [];
    let keyValue = 2;
    for (let hole = 1; hole <= 18; hole++) {
        if (activeRound[`hole${hole}`]) {
            holeRow.push(<TableCell key={keyValue} className={`textCenter${(hole === 9 && activeRound.fullFront9) || (hole === 18 && activeRound.fullBack9) ? ' golfTableBorderRightSmall' : ''}`}><b>{hole}</b></TableCell>);
            keyValue++;
        }
        if (hole === 9 && activeRound.fullFront9) {
            holeRow.push(<TableCell key={keyValue} className="textCenter"><b>OUT</b></TableCell>);
            keyValue++;
        }
        if (hole === 18 && activeRound.fullBack9) {
            holeRow.push(<TableCell key={keyValue} className="textCenter golfTableBorderRightSmall"><b>IN</b></TableCell>);
            keyValue++;
            if (activeRound.fullFront9) holeRow.push(<TableCell key={keyValue} className="textCenter golfTableBorderRightSmall"><b>TOTAL</b></TableCell>);
        }
    }

    return holeRow;
}

export const createScorecard = (courseInfo, activeRound, expandScorecard, setExpandScorecard) => {
    const { course } = activeRound;
    const courseKey = course === "Anderson Glen" ? courseInfo.andersonGlen : courseInfo.gileadHighlands;
    return (
        <Table className="subTable backgroundColorWhite borderRadiusSmall">
            <TableHead>
                <TableRow>
                    <TableCell key={1} className="golfTableBorderRightSmall"><b>HOLE</b></TableCell>
                    {createScorecardHoleRow(activeRound)}
                    {activeRound.additionalHoles && 
                        Object.keys(activeRound.additionalHoles).map((hole, i) => {
                            return (
                                <TableCell key={22 + i} className="textCenter">
                                    <b>
                                        {activeRound.additionalHoles[`additionalHole${i + 1}`].scoreCardHoleAbbreviation} #{activeRound.additionalHoles[`additionalHole${i + 1}`].hole}
                                    </b>
                                </TableCell>
                            );
                        })
                    }
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow key={1}>
                    <TableCell className="golfTableBorderRightSmall">Par</TableCell>
                    {createParRow(courseInfo, activeRound)}
                </TableRow>
                <TableRow key={2}>
                    <TableCell className="golfTableBorderRightSmall">Score</TableCell>
                    {createScoreRow(courseInfo, activeRound, courseKey)}
                </TableRow>
                {expandScorecard &&
                    <>
                        {activeRound.scrambleRound && 
                            <TableRow key={3}>
                                <TableCell className="golfTableBorderRightSmall">Strokes</TableCell>
                                {createScrambleRow(courseInfo, activeRound)}
                            </TableRow>
                        }
                        <TableRow key={4}>
                            <TableCell className="golfTableBorderRightSmall">Putts</TableCell>
                            {createPuttsRow(activeRound)}
                        </TableRow>
                        <TableRow key={5}>
                            <TableCell className="golfTableBorderRightSmall">FIR</TableCell>
                            {createFairwaysRow(activeRound)}
                        </TableRow>
                        <TableRow key={6}>
                            <TableCell className="golfTableBorderRightSmall">GIR</TableCell>
                            {createGreensRow(activeRound)}
                        </TableRow>
                        <TableRow key={7}>
                            <TableCell className="golfTableBorderRightSmall">DTG</TableCell>
                            {createDTGRow(activeRound)}
                        </TableRow>
                        <TableRow key={8}>
                            <TableCell className="golfTableBorderRightSmall">FPM</TableCell>
                            {createFPMRow(activeRound)}
                        </TableRow>
                        <TableRow key={9}>
                            <TableCell className="golfTableBorderRightSmall">DTH</TableCell>
                            {createDTHRow(activeRound)}
                        </TableRow>
                        <TableRow key={10}>
                            <TableCell className="golfTableBorderRightSmall">Notes</TableCell>
                            {createNotesRow(activeRound)}
                        </TableRow>
                    </>
                }
                <TableRow key={11} className="noMarginTop noMarginBottom">
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
                                        <span className="actionFont" onClick={() => setExpandScorecard(!expandScorecard)}>{expandScorecard ? "Collapse" : "Expand"}</span>
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

export const courseSummary = (courseInfo, allRounds, expandSingleHoleMetric, handleSetExpandSingleHoleMetric) => {

    const singleHoleMetrics = calculateSingleHoleMetrics(courseInfo, allRounds);
    const nonHoleMetrics = ["bestCumulativeScoreSingle", "worstCumulativeScoreSingle", "birdies", "bogeyPlus", "mostPutts", "ctp", "longestDrive"];

    return (
        <div className="singleHoleMetricContainer flexFlowRowWrap marginBottomExtraLarge justifyCenter">
            {Object.keys(singleHoleMetrics).sort(function(a,b) {return (singleHoleMetrics[a].courseKey > singleHoleMetrics[b].courseKey) ? 1 : ((singleHoleMetrics[b].courseKey > singleHoleMetrics[a].courseKey) ? -1 : 0);} ).map((hole) => {
                if (!nonHoleMetrics.includes(hole)) { // Not actually holes
                    return (
                        <div className={`holeData flexRow${expandSingleHoleMetric.expanded && expandSingleHoleMetric.hole === hole ? " expanded" : ""}`} key={hole}>
                            <img src={imageSourceMappings[hole]} style={{ height: `${expandSingleHoleMetric.expanded && expandSingleHoleMetric.hole === hole ? "700px" : "476px"}`, marginRight: "8px", borderTopLeftRadius: "12px", borderBottomLeftRadius: "12px" }} alt={`${hole}SingleHoleMetric`} />
                            <div className="flexRow width100Percent justifySpaceAround">
                                {expandSingleHoleMetric.expanded && expandSingleHoleMetric.hole === hole &&
                                    <div className="flexColumn marginTopMedium dynamicPanel">
                                        <div className="flexRow width100Percent justifySpaceBetween marginTopSmall positionSticky">
                                            <div className="stickyBackgroundColor width76px borderRightSmall paddingBottomSmall">Date</div>
                                            <div className="stickyBackgroundColor width76px borderRightSmall paddingBottomSmall">Score</div>
                                            <div className="stickyBackgroundColor width76px borderRightSmall paddingBottomSmall">Putts</div>
                                            {singleHoleMetrics[hole].par !== 3 && <div className="stickyBackgroundColor width76px borderRightSmall paddingBottomSmall">FIR</div>}
                                            <div className="stickyBackgroundColor width76px borderRightSmall paddingBottomSmall">GIR</div>
                                            <div className="stickyBackgroundColor width76px borderRightSmall paddingBottomSmall">DTG</div>
                                            <div className="stickyBackgroundColor width76px borderRightSmall paddingBottomSmall">DTH</div>
                                            <div className="stickyBackgroundColor width76px borderRightSmall paddingBottomSmall">Putt Length</div>
                                            <div className="stickyBackgroundColor width76px paddingBottomSmall">Notes:</div>
                                        </div>
                                        {singleHoleMetrics[hole].roundsData.sort(function(a,b) {return (a.sequence > b.sequence) ? 1 : ((b.sequence > a.sequence) ? -1 : 0);}).map((round) => {
                                            return (
                                                <div className="flexRow width100Percent justifySpaceBetween borderTopSmall">
                                                    <div className="width76px borderRightSmall paddingTopSmall paddingBottomSmall">{round.date}</div>
                                                    <div className="width76px borderRightSmall paddingTopSmall paddingBottomSmall">{round.score}</div>
                                                    <div className="width76px borderRightSmall paddingTopSmall paddingBottomSmall">{round.putts}</div>
                                                    {singleHoleMetrics[hole].par !== 3 && <div className="width76px borderRightSmall paddingTopSmall paddingBottomSmall">{round.fir}</div>}
                                                    <div className="width76px borderRightSmall paddingTopSmall paddingBottomSmall">{round.gir}</div>
                                                    <div className="width76px borderRightSmall paddingTopSmall paddingBottomSmall">{round.dtg}</div>
                                                    <div className="width76px borderRightSmall paddingTopSmall paddingBottomSmall">{round.dth}</div>
                                                    <div className="width76px borderRightSmall paddingTopSmall paddingBottomSmall">{round.puttLength}</div>
                                                    <div className="width76px paddingTopSmall paddingBottomSmall">{round.notes}</div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                                <div className="flexColumn justifySpaceBetween">
                                    <div className="flexColumn paddingTopMedium paddingLeftSmall paddingRightSmall marginBottomExtraSmall">
                                        <h2>{singleHoleMetrics[hole].course} #{singleHoleMetrics[hole].hole}</h2>
                                        <h3>Par {singleHoleMetrics[hole].par}, {singleHoleMetrics[hole].distance} Yards, {singleHoleMetrics[hole].handicap} HDCP</h3>
                                        <div className="flexColumn marginTopSmall marginBottomExtraSmall">
                                            <h3>Score Distribution</h3>
                                            <p className="flexRow justifySpaceBetween"><span>Eagles: </span> <b>{singleHoleMetrics[hole].numEagles}</b></p>
                                            <p className="flexRow justifySpaceBetween"><span>Birdies: </span> <b>{singleHoleMetrics[hole].numBirdies}</b></p>
                                            <p className="flexRow justifySpaceBetween"><span>Pars: </span> <b>{singleHoleMetrics[hole].numPars}</b></p>
                                            <p className="flexRow justifySpaceBetween"><span>Bogey: </span> <b>{singleHoleMetrics[hole].numBogeys}</b></p>
                                            <p className="flexRow justifySpaceBetween"><span>Bogey+: </span> <b>{singleHoleMetrics[hole].numBogeyPlus}</b></p>
                                            <p className="flexRow justifySpaceBetween marginTopSmall paddingTopExtraSmall" style={{ borderTop: "1px solid white" }}><span>Cumulative Score: </span> <b>{singleHoleMetrics[hole].cumulativeScoreToPar > 0 ? `+${singleHoleMetrics[hole].cumulativeScoreToPar}` : singleHoleMetrics[hole].cumulativeScoreToPar < 0 ? `-${singleHoleMetrics[hole].cumulativeScoreToPar}` : singleHoleMetrics[hole].cumulativeScoreToPar}</b></p>
                                        </div>
                                        <div className="flexColumn marginTopSmall marginBottomExtraSmall">
                                            <h3>Cumulative Metrics</h3>
                                            <p className="flexRow justifySpaceBetween"><span>Best Score: </span> <b>{singleHoleMetrics[hole].best}</b></p>
                                            <p className="flexRow justifySpaceBetween"><span>Worst Score: </span> <b>{singleHoleMetrics[hole].worst}</b></p>
                                            {singleHoleMetrics[hole].par !== 3 && singleHoleMetrics.longestDrive[`${singleHoleMetrics[hole].courseKey}Hole${singleHoleMetrics[hole].hole}`] && <p className="flexRow justifySpaceBetween"><span>Long Drive: </span> <b>{singleHoleMetrics.longestDrive[`${singleHoleMetrics[hole].courseKey}Hole${singleHoleMetrics[hole].hole}`].longestDrive} ({singleHoleMetrics.longestDrive[`${singleHoleMetrics[hole].courseKey}Hole${singleHoleMetrics[hole].hole}`].distance - singleHoleMetrics.longestDrive[`${singleHoleMetrics[hole].courseKey}Hole${singleHoleMetrics[hole].hole}`].longestDrive} DTG)</b></p>}
                                            {singleHoleMetrics[hole].par === 3 && singleHoleMetrics.ctp[`${singleHoleMetrics[hole].courseKey}Hole${singleHoleMetrics[hole].hole}`] && <p className="flexRow justifySpaceBetween"><span>CTP (feet): </span> <b>{singleHoleMetrics.ctp[`${singleHoleMetrics[hole].courseKey}Hole${singleHoleMetrics[hole].hole}`].dth}</b></p>}
                                        </div>
                                        <div className="flexColumn marginTopSmall marginBottomExtraSmall">
                                            <h3>Greens</h3>
                                            <div className="flexRow justifySpaceBetween">
                                                <div className="flexColumn">
                                                    <p>Miss:</p>
                                                    <b>{singleHoleMetrics[hole].greens.x}</b>
                                                </div>
                                                <div className="flexColumn">
                                                    <p>GIR:</p>
                                                    <b>{singleHoleMetrics[hole].greens.g}</b>
                                                </div>
                                                {singleHoleMetrics[hole].par === 5 &&
                                                    <div className="flexColumn">
                                                        <p>GUR:</p>
                                                        <b>{singleHoleMetrics[hole].greens.gur}</b>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        {singleHoleMetrics[hole].par !== 3 &&
                                            <div className="flexColumn marginTopSmall marginBottomExtraSmall">
                                                <h3>Fairways</h3>
                                                <div className="flexRow justifySpaceBetween">
                                                    <div className="flexColumn">
                                                        <p>Left:</p>
                                                        <b>{singleHoleMetrics[hole].fairways.l}</b>
                                                    </div>
                                                    <div className="flexColumn">
                                                        <p>FIR:</p>
                                                        <b>{singleHoleMetrics[hole].fairways.f}</b>
                                                    </div>
                                                    <div className="flexColumn">
                                                        <p>Right:</p>
                                                        <b>{singleHoleMetrics[hole].fairways.r}</b>
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                    {/* <span className="cursorPointer marginBottomSmall" style={{ alignSelf: "flex-end" }} onClick={() => handleSetExpandSingleHoleMetric(hole)}>{expandSingleHoleMetric.expanded && expandSingleHoleMetric.hole === hole ? "Collapse" : "Expand"}</span> */}
                                </div>
                            </div>
                            <span className="cursorPointer marginBottomSmall" style={{ width: "0", position: "relative", top: expandSingleHoleMetric.expanded && expandSingleHoleMetric.hole === hole ? "670px" : "452px", right: "60px" }} onClick={() => handleSetExpandSingleHoleMetric(hole)}>{expandSingleHoleMetric.expanded && expandSingleHoleMetric.hole === hole ? "Collapse" : "Expand"}</span>
                        </div>
                    );
                }
            })}
        </div>
    );
}