import React from "react";
import { Table, TableHead, TableBody, TableRow, TableCell, Tooltip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import {
    calculateConsecutiveOnePutts, calculateMostPutts, calculateLeastPutts, calculateLargestScoreDisparity,
    calculateSingleHoleMetrics, calculateCourseMetrics, calculateHandicapMetrics, calculatePuttingMetrics,
    // calculateApproachMetrics,
    calculateDrivingMetrics
} from './GolfMetricHelper';
// Consts
import { imageSourceMappings } from "./GolfConsts";
import { courses } from "./GolfConsts";
// Components
import { Chart } from "react-google-charts"; // Google Charts: https://developers.google.com/chart/interactive/docs/gallery/sankey


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
                            else console.log(`INVALID FIR VALUE FOR HOLE ${hole}: `, round[`hole${hole}`].fir);
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
                    else console.log(`INVALID GIR VALUE FOR HOLE ${hole}: `, round[`hole${hole}`].gir);
                }
            }
        }
    }

    return greens;
}

export const calculatePuttLengths = (round) => {
    let puttLengths = {
        total: 0,
        f9: 0,
        b9: 0
    };
    // TODO: Scorecard putt length incorrect - maybe just front 9
    // console.log("\n\nSTART")
    for (let hole = 1; hole <= 18; hole++) {
        // console.log("hole",hole)
        if (round[`hole${hole}`]) {
            if (hole < 10) {
                puttLengths.f9 = puttLengths.f9 + round[`hole${hole}`].puttLength;
            } else {
                puttLengths.b9 = puttLengths.b9 + round[`hole${hole}`].puttLength;
            }
            puttLengths.total = puttLengths.total + round[`hole${hole}`].puttLength;
            if (typeof round[`hole${hole}`].puttLength !== "number") {
                console.log(`INVALID PUTT LENGTH VALUE FOR HOLE ${hole}: `, round[`hole${hole}`].puttLength);
            }
        }
        // console.log("puttLengths",puttLengths)
    }

    // console.log("\n\nFINAL puttLengths",puttLengths,"\n\n")

    return puttLengths;
}

export const calculateDthAndDtgTotals = (round) => {
    let dthTotals = {
        total: 0,
        f9: 0,
        b9: 0
    };
    let dtgTotals = {
        total: 0,
        f9: 0,
        b9: 0
    };
    for (let hole = 1; hole <= 18; hole++) {
        if (round[`hole${hole}`]) {
            // console.log("typeof round[`hole${hole}`].dth !== number:",typeof round[`hole${hole}`].dth)
            if (hole < 10) {
                dthTotals.f9 = dthTotals.f9 + (typeof round[`hole${hole}`].dth === "number" ? round[`hole${hole}`].gir !== "G-1" ? round[`hole${hole}`].dth : 0 : parseInt(round[`hole${hole}`].dth.split(", ")[1]));
                dtgTotals.f9 = dtgTotals.f9 + (typeof round[`hole${hole}`].dtg === "number" ? round[`hole${hole}`].dtg : parseInt(round[`hole${hole}`].dtg.split(", ")[round[`hole${hole}`].dtg.split(", ").length - 1]));
            } else {
                dthTotals.b9 = dthTotals.b9 + (typeof round[`hole${hole}`].dth === "number" ? round[`hole${hole}`].gir !== "G-1" ? round[`hole${hole}`].dth : 0 : parseInt(round[`hole${hole}`].dth.split(", ")[1]));
                dtgTotals.b9 = dtgTotals.b9 + (typeof round[`hole${hole}`].dtg === "number" ? round[`hole${hole}`].dtg : parseInt(round[`hole${hole}`].dtg.split(", ")[round[`hole${hole}`].dtg.split(", ").length - 1]));
            }
            dthTotals.total = dthTotals.total + (typeof round[`hole${hole}`].dth === "number" ? round[`hole${hole}`].gir !== "G-1" ? round[`hole${hole}`].dth : 0 : parseInt(round[`hole${hole}`].dth.split(", ")[1]));
            dtgTotals.total = dtgTotals.total + (typeof round[`hole${hole}`].dtg === "number" ? round[`hole${hole}`].dtg : parseInt(round[`hole${hole}`].dtg.split(", ")[round[`hole${hole}`].dtg.split(", ").length - 1]));
            // if (typeof round[`hole${hole}`].dth !== "number" && ) {
            //     console.log(`INVALID DTH VALUE FOR HOLE ${hole}: `, round[`hole${hole}`].dth);
            // }
            // if (typeof round[`hole${hole}`].dtg !== "number") {
            //     console.log(`INVALID DTH VALUE FOR HOLE ${hole}: `, round[`hole${hole}`].dth);
            // }
        }
    }

    return { dthTotals, dtgTotals };
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
                // TODO: break down round by stroke Used X number of drives from Player Y)
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

export const createNetRow = (activeRound, course) => {
    let netRow = [];
    for (let hole = 1; hole <= 18; hole++) {
        if (activeRound[`hole${hole}`]) {
            let backgroundColorClassName = "paddingTopSmall paddingLeftSmall paddingRightSmall paddingBottomSmall borderRadiusSmall";
            if (activeRound[`hole${hole}`].netScore > course[`hole${hole}`].par + 1) backgroundColorClassName += " backgroundColorBogeyPlus";
            if (activeRound[`hole${hole}`].netScore === course[`hole${hole}`].par + 1) backgroundColorClassName += " backgroundColorBogey";
            if (activeRound[`hole${hole}`].netScore === course[`hole${hole}`].par - 1) backgroundColorClassName += " backgroundColorBirdie";
            if (activeRound[`hole${hole}`].netScore < course[`hole${hole}`].par - 1) backgroundColorClassName += " backgroundColorEagle";
            if (hole === 9) {
                netRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall"><span className={backgroundColorClassName}>{activeRound[`hole${hole}`].netScore}</span></TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">{activeRound.netScore}</TableCell>
                    </>
                );
            } else if (hole === 18) {
                netRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall"><span className={backgroundColorClassName}>{activeRound[`hole${hole}`].netScore}</span></TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">{activeRound.netScore}</TableCell>
                    </>
                );
            } else {
                netRow.push(<TableCell key={`${hole}-1`} className="textCenter"><span className={backgroundColorClassName}>{activeRound[`hole${hole}`].netScore}</span></TableCell>);
            }
        }
    }

    return netRow;
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
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">AVG: {(activeRound.dtgF9 / 9).toFixed(1)}</TableCell>
                    </>
                );
            } else if (hole === 18) {
                dtgRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall">{activeRound[`hole${hole}`].dtg}</TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">AVG: {(activeRound.dtgB9 / 9).toFixed(1)}</TableCell>
                        {activeRound.hole1 && <TableCell key={`${hole}-3`} className="textCenter">AVG: {(activeRound.dtgTotal / 18).toFixed(1)}</TableCell>} {/* Display total row only when front 9 is also played */}
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
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">{activeRound.puttLengthF9} (AVG: {(activeRound.puttLengthF9 / 9).toFixed(1)})</TableCell>
                    </>
                );
            } else if (hole === 18) {
                fpmRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall">{activeRound[`hole${hole}`].puttLength}</TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">{activeRound.puttLengthB9} (AVG: {(activeRound.puttLengthB9 / 9).toFixed(1)})</TableCell>
                        {activeRound.hole1 && <TableCell key={`${hole}-3`} className="textCenter">{activeRound.puttLengthF9 + activeRound.puttLengthB9} (AVG: {((activeRound.puttLengthF9 + activeRound.puttLengthB9) / 18).toFixed(1)})</TableCell>} {/* Display total row only when front 9 is also played */}
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
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">{activeRound.dthF9} (AVG: {(activeRound.dthF9 / 9).toFixed(1)})</TableCell>
                    </>
                );
            } else if (hole === 18) {
                dthRow.push(
                    <>
                        <TableCell key={`${hole}-1`} className="textCenter golfTableBorderRightSmall">{activeRound[`hole${hole}`].dth}</TableCell>
                        <TableCell key={`${hole}-2`} className="textCenter golfTableBorderRightSmall">{activeRound.dthB9} (AVG: {(activeRound.dthB9 / 9).toFixed(1)})</TableCell>
                        {activeRound.hole1 && <TableCell key={`${hole}-3`} className="textCenter">{activeRound.dthF9 + activeRound.dthB9} (AVG: {((activeRound.dthF9 + activeRound.dthB9) / 18).toFixed(1)})</TableCell>} {/* Display total row only when front 9 is also played */}
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
    const courseKey = courseInfo[activeRound.courseKey];
    return (
        <Table className={`subTable backgroundColorWhite borderRadiusSmall${activeRound.aceRound ? " backgroundColorEagleGlow" : ""}`}>
            <TableHead>
                <TableRow>
                    <TableCell key={1} className="golfTableBorderRightSmall"><b>HOLE</b></TableCell>
                    {createScorecardHoleRow(activeRound)}
                    {activeRound.additionalHoles && 
                        Object.keys(activeRound.additionalHoles).map((hole, i) => {
                            return (
                                <TableCell key={22 + i} className="textCenter">
                                    <b>
                                        {activeRound.additionalHoles[`additionalHole${i + 1}`].scoreCardHoleAbbreviation} {activeRound.additionalHoles[`additionalHole${i + 1}`].scoreCardHoleAbbreviation !== "" ? "#" : ""}{activeRound.additionalHoles[`additionalHole${i + 1}`].hole}
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
                        {activeRound.leagueRound && 
                            <TableRow key={3}>
                                <TableCell className="golfTableBorderRightSmall">Net</TableCell>
                                {createNetRow(activeRound, courseKey)}
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

export const createDrivingTable = (drivingMetrics) => {
    const distances = Object.keys(drivingMetrics).sort(function(a,b) { return ( a.lowerBound > b.lowerBound ? 1 : a.lowerBound < b.lowerBound ? -1 : 0); });

    return (
        <Table className="golfTable subTable backgroundColorWhite borderRadiusSmall">
            <TableHead>
                <TableRow>
                    <TableCell key={1} className="golfTableBorderRightSmall"><b>Distance (yards)</b></TableCell>
                    <TableCell key={1} className="golfTableBorderRightSmall textCenter flexRow alignCenter"><b>Miscue</b><Tooltip disableFocusListener disableTouchListener title="Top/Layup/Long" placement="top" className="alignCenter"><InfoIcon fontSize="small"/></Tooltip></TableCell> {/* Could condense title to have parentheses for GIR % */}
                    <TableCell key={1} className="golfTableBorderRightSmall textCenter"><b>Left</b></TableCell>
                    <TableCell key={1} className="golfTableBorderRightSmall textCenter"><b>FIR</b></TableCell>
                    <TableCell key={1} className="golfTableBorderRightSmall textCenter"><b>Right</b></TableCell> {/* Add right border */}
                    <TableCell key={1} className="golfTableBorderRightSmall textCenter"><b>Miscue to GIR %</b></TableCell>
                    <TableCell key={1} className="golfTableBorderRightSmall textCenter"><b>Left to GIR</b></TableCell>
                    <TableCell key={1} className="golfTableBorderRightSmall textCenter"><b>FIR to GIR</b></TableCell>
                    <TableCell key={1} className="golfTableBorderRightSmall textCenter"><b>Right to GIR</b></TableCell> {/* Add right border */}
                    <TableCell key={1} className="golfTableBorderRightSmall textCenter"><b>Accuracy %</b></TableCell>
                    <TableCell key={1} className="golfTableBorderRightSmall textCenter"><b>Distribution %</b></TableCell>
                    <TableCell key={1} className="golfTableBorderRightSmall textCenter"><b>Total</b></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {distances.map(distance => {
                    return (
                        <TableRow key={distance}>
                            <TableCell className="golfTableBorderRightSmall"><b>{drivingMetrics[distance].customTitle || `${drivingMetrics[distance].lowerBound} - ${drivingMetrics[distance].upperBound}`}</b></TableCell>
                            <TableCell className="golfTableBorderRightSmall textCenter">{drivingMetrics[distance].x} ({(drivingMetrics[distance].x / drivingMetrics[distance].total * 100).toFixed(1)})</TableCell>
                            <TableCell className="golfTableBorderRightSmall textCenter">{drivingMetrics[distance].l} ({(drivingMetrics[distance].l / drivingMetrics[distance].total * 100).toFixed(1)})</TableCell>
                            <TableCell className="golfTableBorderRightSmall textCenter">{drivingMetrics[distance].f} ({(drivingMetrics[distance].f / drivingMetrics[distance].total * 100).toFixed(1)})</TableCell>
                            <TableCell className="golfTableBorderRightSmall textCenter">{drivingMetrics[distance].r} ({(drivingMetrics[distance].r / drivingMetrics[distance].total * 100).toFixed(1)})</TableCell> {/* Add right border */}
                            <TableCell className="golfTableBorderRightSmall textCenter">{drivingMetrics[distance].xGir} ({drivingMetrics[distance].x !== 0 ? (drivingMetrics[distance].xGir / drivingMetrics[distance].x * 100).toFixed(1) : "0.0"})</TableCell> {/* Prevent NaN's when 0 xGir */}
                            <TableCell className="golfTableBorderRightSmall textCenter">{drivingMetrics[distance].lGir} ({(drivingMetrics[distance].lGir / drivingMetrics[distance].l * 100).toFixed(1)})</TableCell>
                            <TableCell className="golfTableBorderRightSmall textCenter">{drivingMetrics[distance].fGir} ({(drivingMetrics[distance].fGir / drivingMetrics[distance].f * 100).toFixed(1)})</TableCell>
                            <TableCell className="golfTableBorderRightSmall textCenter">{drivingMetrics[distance].rGir} ({(drivingMetrics[distance].rGir / drivingMetrics[distance].r * 100).toFixed(1)})</TableCell> {/* Add right border */}
                            <TableCell className="golfTableBorderRightSmall textCenter">{(drivingMetrics[distance].f / drivingMetrics[distance].total * 100).toFixed(1)}</TableCell>
                            <TableCell className="golfTableBorderRightSmall textCenter">{(drivingMetrics[distance].total / drivingMetrics.total.total * 100).toFixed(1)}</TableCell>
                            <TableCell className="golfTableBorderRightSmall textCenter">{drivingMetrics[distance].total}</TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

const createCumulativeGraphs = (drivingMetrics, puttingMetrics) => {
    const sankeyGraphDistance = drivingMetrics.total;
    const totalGir = sankeyGraphDistance.lGir + sankeyGraphDistance.fGir + sankeyGraphDistance.rGir + sankeyGraphDistance.xGir;
    const totalMissedGreen = sankeyGraphDistance.total - totalGir;
    const totalByScore = puttingMetrics.allPutts.totalByScore;

    console.log("puttingMetrics",puttingMetrics)
    
    const sankeyGraphData = [
        ["From", "To", "Weight"],
        // Driving data
        [`F: ${sankeyGraphDistance.f} (${sankeyGraphDistance.fGir} to G, ${sankeyGraphDistance.total - sankeyGraphDistance.fGir} to X)`, `G: ${totalGir}`, sankeyGraphDistance.fGir],
        [`L: ${sankeyGraphDistance.l}`, `G: ${totalGir}`, sankeyGraphDistance.lGir],
        [`R: ${sankeyGraphDistance.r}`, `G: ${totalGir}`, sankeyGraphDistance.rGir],
        [`F: ${sankeyGraphDistance.f} (${sankeyGraphDistance.fGir} to G, ${sankeyGraphDistance.total - sankeyGraphDistance.fGir} to X)`, `X GIR: ${totalMissedGreen}`, sankeyGraphDistance.total - sankeyGraphDistance.fGir],
        [`L: ${sankeyGraphDistance.l}`, `X GIR: ${totalMissedGreen}`, sankeyGraphDistance.total - sankeyGraphDistance.lGir],
        [`R: ${sankeyGraphDistance.r}`, `X GIR: ${totalMissedGreen}`, sankeyGraphDistance.total - sankeyGraphDistance.rGir],

        // Putting data
        [`G: ${totalGir}`, `1 Putts: ${totalByScore.num1Putts.total}`, totalByScore.num1Putts.total],
        [`G: ${totalGir}`, `2 Putts: ${totalByScore.num2Putts.total}`, totalByScore.num2Putts.total],
        [`G: ${totalGir}`, `3 Putts: ${totalByScore.num3Putts.total}`, totalByScore.num3Putts.total],
        [`X GIR: ${totalMissedGreen}`, `1 Putts: ${totalByScore.num1Putts.total}`, totalByScore.num1Putts.total],
        [`X GIR: ${totalMissedGreen}`, `2 Putts: ${totalByScore.num2Putts.total}`, totalByScore.num2Putts.total],
        [`X GIR: ${totalMissedGreen}`, `3 Putts: ${totalByScore.num3Putts.total}`, totalByScore.num3Putts.total],
    ];

    // Score data - GIR
    const scoreToParLabelMap = {
        scoreMinus2: "Eagle",
        scoreMinus1: "Birdie",
        score0: "Par",
        score1: "Bogey",
        score2: "Double",
        score3: "Triple",
        // score4: "Quad"
    }
    let pieChartData = [["Hole", "Score Distribution to Par"]];
    for (let score of Object.keys(scoreToParLabelMap)) {
        for (let i = 0; i < 4; i++) {
            if (totalByScore[`num${i}Putts`][score] !== 0) {
                sankeyGraphData.push([`${i} Putts: ${totalByScore[`num${i}Putts`].total}`, `${scoreToParLabelMap[score]}: ${totalByScore.byScore[score]}`, totalByScore.byScore[score]]);
            }
        }
        if (score === "score2") {
            pieChartData.push(["Double Bogey+", totalByScore.byScore.score2 + totalByScore.byScore.score3]);
        } else {
            if (score !== "score3") {
                pieChartData.push([scoreToParLabelMap[score], totalByScore.byScore[score]]);
            }
        }
    }

    if (sankeyGraphDistance.xGir) {
        sankeyGraphData.push([`X: ${sankeyGraphDistance.x}`, `X GIR: ${totalMissedGreen}`, sankeyGraphDistance.total - sankeyGraphDistance.g]);
        sankeyGraphData.push([`X: ${sankeyGraphDistance.x}`, `G: ${totalGir}`, sankeyGraphDistance.xGir]);
    }

    return (
        <div>
            <div id="holeSankey">
                <Chart
                    chartType="Sankey"
                    width="100%"
                    // height="400px"
                    data={sankeyGraphData}
                    options={{
                        sankey: {
                            // link: { color: { fill: "#d799ae" } },
                            // node: {
                            //     colors: ["#a61d4c"],
                            //     label: { color: "#871b47" },
                            // },
                            // iterations: 0
                        }
                    }}
                />
            </div>
            <div className="marginTopSmall marginBottomLarge flexRow justifySpaceBetween">
                <h3>Driving</h3>
                <h3>Approach</h3>
                <h3>Putting</h3>
                <h3>Scoring</h3>
            </div>
            <h1>Score Distibution</h1>
            <div id="cumulativePie">
                <Chart
                    chartType="PieChart"
                    data={pieChartData}
                    options={{is3D: true, backgroundColor: "#00000000" }}
                    width="600px"
                />
            </div>
        </div>
    )
}

export const createPuttingTable = (puttingMetrics) => {
    const distances = Object.keys(puttingMetrics.makeByDistance).sort(
        function(a,b) {
            return (
                parseInt(a.substring(4, a.length)) > parseInt(b.substring(4, b.length))
                    ? 1 : (parseInt(a.substring(4, a.length)) < parseInt(b.substring(4, b.length))
                        ? -1 : 0)
            );
        }
    );

    return (
        <Table className="golfTable subTable backgroundColorWhite borderRadiusSmall">
            <TableHead>
                <TableRow>
                    <TableCell key={1} className="golfTableBorderRightSmall"><b>Distance (feet)</b></TableCell>
                    {distances.map(distance => {
                        return <TableCell key={distance} className="textCenter golfTableBorderRightSmall"><b>{distance.substring(4, distance.length)}</b></TableCell>
                    })}
                </TableRow>
            </TableHead>
            <TableBody>
                <TableRow key={1}>
                    <TableCell className="golfTableBorderRightSmall"><b>Total putts</b></TableCell>
                    {distances.map(distance => {
                        return <TableCell key={distance} className="textCenter golfTableBorderRightSmall">{puttingMetrics.makeByDistance[distance].totalPutts}</TableCell>
                    })}
                </TableRow>
                <TableRow key={2}>
                    <TableCell className="golfTableBorderRightSmall"><b>Distribution by range %</b></TableCell>
                    {distances.map(distance => {
                        return <TableCell key={distance} className="textCenter golfTableBorderRightSmall">{(puttingMetrics.makeByDistance[distance].totalPutts / puttingMetrics.totalPutts * 100).toFixed(1)}</TableCell>
                    })}
                </TableRow>                
                <TableRow key={3}>
                    <TableCell className="golfTableBorderRightSmall"><b>Total made</b></TableCell>
                    {distances.map(distance => {
                        return <TableCell key={distance} className="textCenter golfTableBorderRightSmall">{distance === "from0" ? puttingMetrics.makeByDistance[distance].num0Putts : puttingMetrics.makeByDistance[distance].num1Putts}</TableCell>
                    })}
                </TableRow>
                <TableRow key={4}>
                    <TableCell className="golfTableBorderRightSmall"><b>2-Putts</b></TableCell>
                    {distances.map(distance => {
                        return <TableCell key={distance} className="textCenter golfTableBorderRightSmall">{distance === "from0" ? "NA" : puttingMetrics.makeByDistance[distance].num2Putts}</TableCell>
                    })}
                </TableRow>
                <TableRow key={5}>
                    <TableCell className="golfTableBorderRightSmall"><b>3-Putts</b></TableCell>
                    {distances.map(distance => {
                        return <TableCell key={distance} className="textCenter golfTableBorderRightSmall">{distance === "from0" ? "NA" : puttingMetrics.makeByDistance[distance].num3Putts}</TableCell>
                    })}
                </TableRow>
                {/* <TableRow key={6}>
                    <TableCell className="golfTableBorderRightSmall"><b>4-Putts</b></TableCell>
                    {distances.map(distance => {
                        return <TableCell key={distance} className="textCenter golfTableBorderRightSmall">{distance === "from0" ? "NA" : puttingMetrics.makeByDistance[distance].num4Putts}</TableCell>
                    })}
                </TableRow> */}
                <TableRow key={7}>
                    <TableCell className="golfTableBorderRightSmall"><b>Make %</b></TableCell>
                    {distances.map(distance => {
                        return <TableCell key={distance} className="textCenter golfTableBorderRightSmall">{distance === "from0" ? "100" : (puttingMetrics.makeByDistance[distance].num1Putts / puttingMetrics.makeByDistance[distance].totalPutts * 100).toFixed(1)}</TableCell>
                    })}
                </TableRow>
                <TableRow key={8}>
                    <TableCell className="golfTableBorderRightSmall"><b>2-Putt %</b></TableCell>
                    {distances.map(distance => {
                        return <TableCell key={distance} className="textCenter golfTableBorderRightSmall">{distance === "from0" ? "NA" : (puttingMetrics.makeByDistance[distance].num2Putts / puttingMetrics.makeByDistance[distance].totalPutts * 100).toFixed(1)}</TableCell>
                    })}
                </TableRow>
                <TableRow key={9}>
                    <TableCell className="golfTableBorderRightSmall"><b>3-Putt %</b></TableCell>
                    {distances.map(distance => {
                        return <TableCell key={distance} className="textCenter golfTableBorderRightSmall">{distance === "from0" ? "NA" : (puttingMetrics.makeByDistance[distance].num3Putts / puttingMetrics.makeByDistance[distance].totalPutts * 100).toFixed(1)}</TableCell>
                    })}
                </TableRow>
                {/* <TableRow key={10}>
                    <TableCell className="golfTableBorderRightSmall"><b>4-Putt %</b></TableCell>
                    {distances.map(distance => {
                        return <TableCell key={distance} className="textCenter golfTableBorderRightSmall">{distance === "from0" ? "NA" : (puttingMetrics.makeByDistance[distance].num4Putts / puttingMetrics.makeByDistance[distance].totalPutts * 100).toFixed(1)}</TableCell>
                    })}
                </TableRow> */}
            </TableBody>
        </Table>
    );
}

export const calculateStats = (courseInfo, allRounds, puttingData) => {

    const singleHoleMetrics = calculateSingleHoleMetrics(courseInfo, allRounds);
    const courseMetrics = calculateCourseMetrics(courseInfo, allRounds);
    const handicapMetrics = calculateHandicapMetrics(courseInfo, allRounds);
    const puttingMetrics = calculatePuttingMetrics(puttingData);
    // const approachMetrics = calculateApproachMetrics(allRounds); // Import above
    const drivingMetrics = calculateDrivingMetrics(courseInfo, allRounds);

    console.log("singleHoleMetrics",singleHoleMetrics)
    console.log("courseMetrics",courseMetrics)

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
                <h3 className="marginRightExtraSmall">Best score on Front 9 -</h3>
                <h3 className="strongFont">({courseMetrics.andersonGlen.out}) {courseMetrics.andersonGlen.outDate} {courseMetrics.andersonGlen.outPutts} putts</h3>
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightExtraSmall">Best score on Back 9 -</h3>
                <h3 className="strongFont">({courseMetrics.andersonGlen.in}) {courseMetrics.andersonGlen.inDate} {courseMetrics.andersonGlen.inPutts} putts</h3>
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightExtraSmall">Best score on 18 holes -</h3>
                <h3 className="strongFont">({courseMetrics.andersonGlen.totalOut} + {courseMetrics.andersonGlen.totalIn} = {courseMetrics.andersonGlen.total}) {courseMetrics.andersonGlen.totalDate} {courseMetrics.andersonGlen.totalPutts} putts</h3>
            </div>

            {/* Best Gilelad Highlands */}
            <h1 className="marginTopExtraLarge marginBottomLarge">Best Gilead Highlands</h1>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightExtraSmall">Best score on Front 9 -</h3>
                <h3 className="strongFont">({courseMetrics.gileadHighlands.out}) {courseMetrics.gileadHighlands.outDate} {courseMetrics.gileadHighlands.outPutts} putts</h3>
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightExtraSmall">Best score on Back 9 -</h3>
                <h3 className="strongFont">({courseMetrics.gileadHighlands.in}) {courseMetrics.gileadHighlands.inDate} {courseMetrics.gileadHighlands.inPutts} putts</h3>
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightExtraSmall">Best score on 18 holes -</h3>
                <h3 className="strongFont">({courseMetrics.gileadHighlands.totalOut} + {courseMetrics.gileadHighlands.totalIn} = {courseMetrics.gileadHighlands.total}) {courseMetrics.gileadHighlands.totalDate} {courseMetrics.gileadHighlands.totalPutts} putts</h3>
            </div>

            {/* Other Course Records */}
            <h1 className="marginTopExtraLarge marginBottomLarge">Other Course Records <span>(F9 - B9)</span></h1>
            {Object.keys(courseMetrics).map(courseMetric => {
                if (courseMetric !== "andersonGlen" && courseMetric !== "gileadHighlands") {
                    const courseName = courses.find(course => course.courseKey === courseMetric).displayName;
                    let scoreString = "";
                    if (courseMetrics[courseMetric].out === 100) {
                        scoreString = `${courseMetrics[courseMetric].in} (B9)`;
                    } else {
                        if (courseMetrics[courseMetric].in === 100) {
                            scoreString = `${courseMetrics[courseMetric].out} (F9)`;
                        } else {
                            scoreString = `${courseMetrics[courseMetric].total} (${courseMetrics[courseMetric].out} - ${courseMetrics[courseMetric].in})`;
                        }
                    }
                    return (
                        <div className="flexRow alignCenter marginBottomSmall">
                            <h3 className="marginRightExtraSmall">{courseName} -</h3>
                            <h3 className="strongFont">{scoreString}</h3>
                        </div> 
                    )
                } else return null;
            })}

            {/* Single Hole Metrics */}
            <h1 className="marginTopExtraLarge marginBottomLarge">Single Hole Metrics</h1>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightExtraSmall">Most birdies on a single hole -</h3>
                <h3 className="strongFont">({singleHoleMetrics.birdies.mostBirdies}) {singleHoleMetrics.birdies.mostBirdiesCourse} Par {singleHoleMetrics.birdies.mostBirdiesPar} Hole {singleHoleMetrics.birdies.mostBirdiesHole} played {singleHoleMetrics.birdies.mostBirdiesRounds} times</h3>
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightExtraSmall">Least bogey+ on a single hole -</h3>
                <h3 className="strongFont">({singleHoleMetrics.bogeyPlus.leastBogeyPlus}) {singleHoleMetrics.bogeyPlus.leastBogeyPlusCourse} Par {singleHoleMetrics.bogeyPlus.leastBogeyPlusPar} Hole {singleHoleMetrics.bogeyPlus.leastBogeyPlusHole} played {singleHoleMetrics.bogeyPlus.leastBogeyPlusRounds} times</h3>
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightExtraSmall">Most bogey+ on a single hole -</h3>
                <h3 className="strongFont">({singleHoleMetrics.bogeyPlus.mostBogeyPlus}) {singleHoleMetrics.bogeyPlus.mostBogeyPlusCourse} Par {singleHoleMetrics.bogeyPlus.mostBogeyPlusPar} Hole {singleHoleMetrics.bogeyPlus.mostBogeyPlusHole} played {singleHoleMetrics.bogeyPlus.mostBogeyPlusRounds} times</h3>
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightExtraSmall">Best cumulative score to par on a single hole -</h3>
                <h3 className="strongFont">({singleHoleMetrics.bestCumulativeScoreSingle.cumulativeScoreToPar > 0 ? "+" : ""}{singleHoleMetrics.bestCumulativeScoreSingle.cumulativeScoreToPar}) {singleHoleMetrics.bestCumulativeScoreSingle.course} Par {singleHoleMetrics.bestCumulativeScoreSingle.par} Hole {singleHoleMetrics.bestCumulativeScoreSingle.hole} played {singleHoleMetrics.bestCumulativeScoreSingle.rounds} times</h3>
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightExtraSmall">Worst cumulative score on a single hole -</h3>
                <h3 className="strongFont">({singleHoleMetrics.worstCumulativeScoreSingle.cumulativeScoreToPar < 0 ? "-" : singleHoleMetrics.worstCumulativeScoreSingle.cumulativeScoreToPar > 0 ? "+" : ""}{singleHoleMetrics.worstCumulativeScoreSingle.cumulativeScoreToPar}) {singleHoleMetrics.worstCumulativeScoreSingle.course} Par {singleHoleMetrics.worstCumulativeScoreSingle.par} Hole {singleHoleMetrics.worstCumulativeScoreSingle.hole} played {singleHoleMetrics.worstCumulativeScoreSingle.rounds} times</h3>
            </div>

            {/* CTP */}
            <h1 className="marginTopExtraLarge marginBottomLarge">Closest to the Pin</h1>
            {Object.keys(singleHoleMetrics.ctp).map((hole) => {
                const ctp = singleHoleMetrics.ctp[hole];
                if (ctp.course === "Anderson Glen" || ctp.course === "Gilead Highlands") {
                    return (
                        <div className="flexRow alignCenter marginBottomSmall">
                            <h3 className="marginRightExtraSmall">{ctp.course} {ctp.hole} ({ctp.distance} yards) -</h3>
                            <h3 className="strongFont">{ctp.dth} feet ({ctp.date} Score: {ctp.score})</h3>
                        </div>
                    );
                } else {
                    return null;
                }
            })}

            {/* Miscellaneous Metrics */}
            <h1 className="marginTopExtraLarge marginBottomLarge">Miscellaneous Metrics</h1>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightExtraSmall">Most consecutive 1 putts -</h3>
                {calculateConsecutiveOnePutts(allRounds)}
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightExtraSmall">Most putts in 9 holes & 18 holes -</h3>
                {calculateMostPutts(allRounds)}
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightExtraSmall">Least putts in 9 holes & 18 holes -</h3>
                {calculateLeastPutts(allRounds)}
            </div>
            <div className="flexRow alignCenter marginBottomSmall">
                <h3 className="marginRightExtraSmall">Largest score disparity between front 9 and back 9 -</h3>
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

            {/* Driving */}
            <h1 className="marginTopExtraLarge marginBottomLarge">Driving</h1>
            <div className="flexRow alignCenter marginBottomSmall">
                {createDrivingTable(drivingMetrics)}
            </div>
            
            {/* Putting */}
            <h1 className="marginTopExtraLarge marginBottomLarge">Putting</h1>
            <div className="flexRow alignCenter marginBottomSmall">
                {createPuttingTable(puttingMetrics)}
            </div>

            <h1 className="marginTopExtraLarge marginBottomLarge">Hole Flow</h1>
            {createCumulativeGraphs(drivingMetrics, puttingMetrics)}
        </>
    );
}

const createSingleHoleGraph = (courseInfo, singleHoleMetrics) => {
    let scoringMetrics = {
        gir: { score1: 0, score2: 0, score3: 0, score4: 0, score5: 0, score6: 0, score7: 0, score8: 0, score9: 0, score0: 0 },
        nonGir: { score1: 0, score2: 0, score3: 0, score4: 0, score5: 0, score6: 0, score7: 0, score8: 0, score9: 0, score0: 0 }
    }

    let drivingMetrics = {
        notInRangeOfGreen: { lowerBound: 0, upperBound: 0, customTitle: "Not in range of green", f: 0, l: 0, r: 0, x: 0, xGir: 0, lGir: 0, fGir: 0, rGir: 0, total: 0 },
        lessThan200: { lowerBound: 1, upperBound: 199, customTitle: "< 200", f: 0, l: 0, r: 0, x: 0, xGir: 0, lGir: 0, fGir: 0, rGir: 0, total: 0 }, // Tops & lay-ups
        between200and220: { lowerBound: 200, upperBound: 220, f: 0, l: 0, r: 0, x: 0, xGir: 0, lGir: 0, fGir: 0, rGir: 0, total: 0 },
        between221and240: { lowerBound: 221, upperBound: 240, f: 0, l: 0, r: 0, x: 0, xGir: 0, lGir: 0, fGir: 0, rGir: 0, total: 0 },
        between241and260: { lowerBound: 241, upperBound: 260, f: 0, l: 0, r: 0, x: 0, xGir: 0, lGir: 0, fGir: 0, rGir: 0, total: 0 },
        between261and280: { lowerBound: 261, upperBound: 280, f: 0, l: 0, r: 0, x: 0, xGir: 0, lGir: 0, fGir: 0, rGir: 0, total: 0 },
        between281and300: { lowerBound: 281, upperBound: 300, f: 0, l: 0, r: 0, x: 0, xGir: 0, lGir: 0, fGir: 0, rGir: 0, total: 0 },
        greaterThan300: { lowerBound: 300, upperBound: 1000, customTitle: "300+", f: 0, l: 0, r: 0, x: 0, xGir: 0, lGir: 0, fGir: 0, rGir: 0, total: 0 },
        total: { lowerBound: 1000, upperBound: 1000, customTitle: "Total", f: 0, l: 0, r: 0, x: 0, xGir: 0, lGir: 0, fGir: 0, rGir: 0, total: 0 }
    };

    let individualCourseData = courseInfo[singleHoleMetrics.courseKey][`hole${singleHoleMetrics.hole}`];
    for (let round of singleHoleMetrics.roundsData) {
        if (round.fir !== "NA") { // Exclude par 3's
            drivingMetrics.total[round.fir.toLowerCase()]++;
            drivingMetrics.total.total++;

            let dtgForCalculation = 1000;
            if (
                individualCourseData.par === 4 // Par 4 DTG
                || (individualCourseData.par === 5 && round.gir === "G-1") // Par 5 G-1
            ) {
                dtgForCalculation = parseInt(round.dtg); // Use raw DTG
            } else {
                if (individualCourseData.par === 5 && typeof round.dtg === "string") { // DTG recorded after drive and approach
                    dtgForCalculation = parseInt(round.dtg.split(", ")[0]); // Use first DTG value in array
                }
            }

            if (dtgForCalculation === 1000) { // Not in range of green, cannot calculate driving distance
                drivingMetrics.notInRangeOfGreen[round.fir.toLowerCase()]++;
                drivingMetrics.notInRangeOfGreen.total++;
                if (round.gir === "G-1" || round.gir === "G") {
                    drivingMetrics.notInRangeOfGreen[`${round.fir.toLowerCase()}Gir`]++;
                    scoringMetrics.gir[`score${round.score}`]++;
                } else {
                    scoringMetrics.nonGir[`score${round.score}`]++;
                }
            } else {
                const driveDistance = parseInt(individualCourseData.distance) - dtgForCalculation;
                
                let drivingMetricRange = "";
                if (driveDistance < 200) { drivingMetricRange = "lessThan200"; } else {
                if (220 > driveDistance && driveDistance >= 200) { drivingMetricRange = "between200and220"; } else {
                if (240 > driveDistance && driveDistance >= 220) { drivingMetricRange = "between221and240"; } else { 
                if (260 > driveDistance && driveDistance >= 240) { drivingMetricRange = "between241and260"; } else { 
                if (280 > driveDistance && driveDistance >= 260) { drivingMetricRange = "between261and280"; } else {
                if (300 > driveDistance && driveDistance >= 280) { drivingMetricRange = "between281and300"; } else {
                if (driveDistance >= 300) { drivingMetricRange = "greaterThan300"; }}}}}}}

                if (drivingMetricRange === "") {
                    console.log(`INVALID DTG VALUE FOR ROUND ${round.key.toUpperCase()}, HOLE ${singleHoleMetrics.hole}:`, round.dtg);
                } else {
                    drivingMetrics[drivingMetricRange][round.fir.toLowerCase()]++;
                    drivingMetrics[drivingMetricRange].total++;
                    if (round.gir === "G-1" || round.gir === "G") {
                        drivingMetrics[drivingMetricRange][`${round.fir.toLowerCase()}Gir`]++;
                        drivingMetrics.total[`${round.fir.toLowerCase()}Gir`]++;
                        scoringMetrics.gir[`score${round.score}`]++;
                    } else {
                        scoringMetrics.nonGir[`score${round.score}`]++;
                    }
                }
            }
        } else { // Scoring metrics for par 3s
            if (round.gir === "G") {
                drivingMetrics.total.fGir++;
                scoringMetrics.gir[`score${round.score}`]++;
            } else {
                scoringMetrics.nonGir[`score${round.score}`]++;
            }
            drivingMetrics.total.total++;
        }
    }

    const sankeyGraphDistance = drivingMetrics.total;
    const totalGir = sankeyGraphDistance.lGir + sankeyGraphDistance.fGir + sankeyGraphDistance.rGir + sankeyGraphDistance.xGir;
    const totalMissedGreen = sankeyGraphDistance.total - totalGir;
    const sankeyGraphData = [["Fairway", "To", "Green"]];

    // FIR
    if (singleHoleMetrics.par !== 3) {
        sankeyGraphData.push([`FIR: ${sankeyGraphDistance.f}`, `GIR: ${totalGir}`, sankeyGraphDistance.fGir]);
        sankeyGraphData.push([`FIR: ${sankeyGraphDistance.f}`, `X: ${totalMissedGreen}`, sankeyGraphDistance.total - sankeyGraphDistance.lGir]);
        sankeyGraphData.push([`Left: ${sankeyGraphDistance.l}`, `GIR: ${totalGir}`, sankeyGraphDistance.lGir]);
        sankeyGraphData.push([`Right: ${sankeyGraphDistance.r}`, `GIR: ${totalGir}`, sankeyGraphDistance.rGir]);
        sankeyGraphData.push([`Left: ${sankeyGraphDistance.l}`, `X: ${totalMissedGreen}`, sankeyGraphDistance.total - sankeyGraphDistance.fGir]);
        sankeyGraphData.push([`Right: ${sankeyGraphDistance.r}`, `X: ${totalMissedGreen}`, sankeyGraphDistance.total - sankeyGraphDistance.rGir]);
        // Non-FIR
        if (sankeyGraphDistance.x !== 0) {
            sankeyGraphData.push([`Miscue: ${sankeyGraphDistance.x}`, `GIR: ${totalGir}`, typeof sankeyGraphDistance.xGir == "number" ? sankeyGraphDistance.xGir : 0]);
            sankeyGraphData.push([`Miscue: ${sankeyGraphDistance.x}`, `X: ${totalMissedGreen}`, sankeyGraphDistance.total - sankeyGraphDistance.xGir]);
        }
    }

    // Score distibution
    for (let score of Object.keys(scoringMetrics.gir)) {
        if (scoringMetrics.gir[score] !== 0) {
            sankeyGraphData.push([`GIR: ${totalGir}`, `${score.substring(score.length - 1, score.length)}: ${scoringMetrics.gir[score] + scoringMetrics.nonGir[score]}`, scoringMetrics.gir[score]]);
        }
        if (scoringMetrics.nonGir[score] !== 0) {
            sankeyGraphData.push([`X: ${totalMissedGreen}`, `${score.substring(score.length - 1, score.length)}: ${scoringMetrics.gir[score] + scoringMetrics.nonGir[score]}`, scoringMetrics.nonGir[score]]);
        }
    }

    return (
        <Chart
            chartType="Sankey"
            width="220px"
            data={sankeyGraphData}
            options={{
                // sankey: {
                //     link: { color: { fill: "#d799ae" } },
                //     node: {
                //         colors: ["#a61d4c"],
                //         label: { color: "#871b47" },
                //     }
                // }
            }}
        />
    )
}

export const courseSummary = (courseInfo, allRounds, expandSingleHoleMetric, handleSetExpandSingleHoleMetric) => {
    const singleHoleMetrics = calculateSingleHoleMetrics(courseInfo, allRounds);
    const nonHoleMetrics = ["bestCumulativeScoreSingle", "worstCumulativeScoreSingle", "birdies", "bogeyPlus", "mostPutts", "ctp", "longestDrive"];
    
    return (
        <div className="singleHoleMetricContainer flexFlowRowWrap marginBottomExtraLarge justifyCenter">
            {Object.keys(singleHoleMetrics).sort(function(a,b) {return (singleHoleMetrics[a].courseKey > singleHoleMetrics[b].courseKey || (singleHoleMetrics[a].hole > singleHoleMetrics[b].courseKey && singleHoleMetrics[a].hole < singleHoleMetrics[b].courseKey)) ? 1 : ((singleHoleMetrics[b].courseKey > singleHoleMetrics[a].courseKey) ? -1 : 0);} ).map((hole) => {
                if (!nonHoleMetrics.includes(hole) && (singleHoleMetrics[hole].courseKey === "andersonGlen" || singleHoleMetrics[hole].courseKey === "gileadHighlands")) { // Not actually holes
                // if (!nonHoleMetrics.includes(hole)) { // Not actually holes - could include all holes with above line
                    const holeSummaryRef = React.createRef();
                    const executeScroll = () => holeSummaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                    return (
                        <div ref={holeSummaryRef} id={hole.key} className={`holeData flexRow${expandSingleHoleMetric.expanded && expandSingleHoleMetric.hole === hole ? " expanded" : ""}`} key={hole.key}>
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
                                                    <div className="width76px borderRightSmall paddingTopSmall paddingBottomSmall">{round.puttLengthTotal}</div>
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
                                            <p className="flexRow justifySpaceBetween marginTopSmall paddingTopExtraSmall" style={{ borderTop: "1px solid white" }}><span>Cumulative Score: </span> <b>{singleHoleMetrics[hole].cumulativeScoreToPar > 0 ? `+${singleHoleMetrics[hole].cumulativeScoreToPar}` : singleHoleMetrics[hole].cumulativeScoreToPar}</b></p>
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
                                            <>
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
                                            </>
                                        }
                                        {expandSingleHoleMetric.expanded && expandSingleHoleMetric.hole === hole &&
                                            <div id="singleHoleMetricsSankey">
                                                {createSingleHoleGraph(courseInfo, singleHoleMetrics[hole])}
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <span className="cursorPointer marginBottomSmall" style={{ width: "0", position: "relative", top: expandSingleHoleMetric.expanded && expandSingleHoleMetric.hole === hole ? "670px" : "452px", right: "60px" }} onClick={() => { executeScroll(); handleSetExpandSingleHoleMetric(hole); }}>{expandSingleHoleMetric.expanded && expandSingleHoleMetric.hole === hole ? "Collapse" : "Expand"}</span>
                        </div>
                    );
                } else return null;
            })}
        </div>
    );
}