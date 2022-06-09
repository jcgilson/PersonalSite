import React from "react";

export const calculateConsecutiveOnePutts = (allRounds) => {
    let mostConsecutiveOnePutts = 0;
    let tempMostConsecutiveOnePutts = 0;
    let consecutiveOnePutts = 0;
    
    let finalStartDateOfStreak = "";
    let finalStartCourseOfStreak = "";
    let finalStartHoleOfStreak = 0;

    let finalEndDateOfStreak = "";
    let finalEndCourseOfStreak = "";
    let finalEndHoleOfStreak = 0;

    let tempStartDateOfStreak = "";
    let tempStartCourseOfStreak = "";
    let tempStartHoleOfStreak = 0;
    
    let tempEndDateOfStreak = "";
    let tempEndCourseOfStreak = "";
    let tempEndHoleOfStreak = 0;

    for (let round of allRounds) {
        for (let hole = 1; hole <= 18; hole++ ) {
            if (round[`hole${hole}`]) {
                // One putt or chip in occurred
                if (round[`hole${hole}`].putts === 0 || round[`hole${hole}`].putts === 1) {
                    // Adding to streak
                    consecutiveOnePutts++;
    
                    // Set start streak when empty
                    if (tempStartDateOfStreak === "") {
                        tempStartDateOfStreak = round.date;
                        tempStartCourseOfStreak = round.course;
                        tempStartHoleOfStreak = hole;
                        tempEndDateOfStreak = round.date;
                        tempEndCourseOfStreak = round.course;
                        tempEndHoleOfStreak = hole;
                    } else {
                        // Set only end streak when start streak exists
                        tempEndDateOfStreak = round.date;
                        tempEndCourseOfStreak = round.course;
                        tempEndHoleOfStreak = hole;
                    }
    
                    // Set most consecutive one putts when streak is made
                    if (consecutiveOnePutts > tempMostConsecutiveOnePutts) {
                        tempMostConsecutiveOnePutts = consecutiveOnePutts;
                    }
                } else {
                    // When streak is set, save values
                    if (tempMostConsecutiveOnePutts > mostConsecutiveOnePutts) {
                        finalStartDateOfStreak = tempStartDateOfStreak;
                        finalStartCourseOfStreak = tempStartCourseOfStreak;
                        finalStartHoleOfStreak = tempStartHoleOfStreak;
                        finalEndDateOfStreak = tempEndDateOfStreak;
                        finalEndCourseOfStreak = tempEndCourseOfStreak;
                        finalEndHoleOfStreak = tempEndHoleOfStreak;
                        mostConsecutiveOnePutts = tempMostConsecutiveOnePutts;
                    }
                    // Reset temporarily values when streak is over
                    tempStartDateOfStreak = "";
                    tempStartCourseOfStreak = "";
                    tempStartHoleOfStreak = 0;
                    tempEndDateOfStreak = "";
                    tempEndCourseOfStreak = "";
                    tempEndHoleOfStreak = 0;
                    tempMostConsecutiveOnePutts = 0;
                    consecutiveOnePutts = 0;
                }
            }
        }
    }

    return <h3 className="strongFont">{mostConsecutiveOnePutts} holes: {finalStartDateOfStreak} {finalStartCourseOfStreak} {finalStartHoleOfStreak} - {finalStartDateOfStreak === finalEndDateOfStreak ? "" : finalEndDateOfStreak} {finalStartCourseOfStreak === finalEndCourseOfStreak ? "" : finalEndCourseOfStreak} {finalEndHoleOfStreak}</h3>;
}

export const calculateMostPutts = (allRounds) => {
    let mostPutts9 = 0;
    let mostPuttsDate9 = "";
    let mostPuttsCourse9 = "";
    let mostPuttFrontOrBack9 = ""
    
    let mostPutts18 = 0;
    let mostPuttsDate18 = "";
    let mostPuttsCourse18 = "";

    for (let round of allRounds) {
        if (round.f9Putts > mostPutts9) {
            mostPutts9 = round.f9Putts;
            mostPuttsDate9 = round.date;
            mostPuttsCourse9 = round.course;
            mostPuttFrontOrBack9 = "Front 9";
        }
        if (round.b9Putts > mostPutts9) {
            mostPutts9 = round.b9Putts;
            mostPuttsDate9 = round.date;
            mostPuttsCourse9 = round.course;
            mostPuttFrontOrBack9 = "Back 9";
        }
        if (round.putts > mostPutts18) {
            mostPutts18 = round.putts;
            mostPuttsDate18 = round.date;
            mostPuttsCourse18 = round.course;
        }
    }

    return <h3 className="strongFont">9 holes: {mostPutts9} ({mostPuttsDate9} {mostPuttsCourse9} {mostPuttFrontOrBack9}) - 18 holes: {mostPutts18} ({mostPuttsDate18} {mostPuttsCourse18})</h3>;
}

export const calculateLeastPutts = (allRounds) => {
    let leastPutts9 = 100;
    let leastPuttsDate9 = "";
    let leastPuttsCourse9 = "";
    let leastPuttFrontOrBack9 = ""
    
    let leastPutts18 = 100;
    let leastPuttsDate18 = "";
    let leastPuttsCourse18 = "";

    for (let round of allRounds) {
        if (round.f9Putts !== 0 && round.f9Putts < leastPutts9) {
            leastPutts9 = round.f9Putts;
            leastPuttsDate9 = round.date;
            leastPuttsCourse9 = round.course;
            leastPuttFrontOrBack9 = "Front 9";
        }
        if (round.b9Putts !== 0 && round.b9Putts < leastPutts9) {
            leastPutts9 = round.b9Putts;
            leastPuttsDate9 = round.date;
            leastPuttsCourse9 = round.course;
            leastPuttFrontOrBack9 = "Back 9";
        }
        if (round.numHoles === 18 && round.putts < leastPutts18) {
            leastPutts18 = round.putts;
            leastPuttsDate18 = round.date;
            leastPuttsCourse18 = round.course;
        }
    }

    return <h3 className="strongFont">9 holes: {leastPutts9} ({leastPuttsDate9} {leastPuttsCourse9} {leastPuttFrontOrBack9}) - 18 holes: {leastPutts18} ({leastPuttsDate18} {leastPuttsCourse18})</h3>;
}

export const calculateLargestScoreDisparity = (allRounds) => {
    let largestDisparity = 0;
    let largestDisparityDate = "";
    let largestDisparityCourse = "";
    let largestDisparityOut = 0;
    let largestDisparityIn = 0;
    
    for (let round of allRounds) {
        if (round.numHoles === 18 && (round.in - round.out > largestDisparity || round.out - round.in > largestDisparity)) {
            if (round.out - round.out > round.out - round.in) {
                largestDisparity = round.in - round.out;
            } else {
                largestDisparity = round.out - round.in;
            }
            largestDisparityDate = round.date;
            largestDisparityCourse = round.course;
            largestDisparityOut = round.out;
            largestDisparityIn = round.in;
        }
    }

    return <h3 className="strongFont">{largestDisparity} strokes: {largestDisparityOut} - {largestDisparityIn} ({largestDisparityDate} {largestDisparityCourse})</h3>;
}

export const calculateSingleHoleMetrics = (courseInfo, allRounds) => {
    let singleHoleMetrics = {
        bestCumulativeScoreSingle: {
            cumulativeScoreToPar: 100,
            course: "",
            par: 0,
            hole: 0,
            rounds: 0
        },
        worstCumulativeScoreSingle: {
            cumulativeScoreToPar: 0,
            course: "",
            par: 0,
            hole: 0,
            rounds: 0
        },
        birdies: {
            mostBirdies: 0,
            mostBirdiesCourse: "",
            mostBirdiesPar: 0,
            mostBirdiesHole: 0,
            mostBirdiesRounds: 0,
            notBirdied: []
        },
        bogeyPlus: {
            mostBogeyPlus: 0,
            mostBogeyPlusCourse: "",
            mostBogeyPlusPar: 0,
            mostBogeyPlusHole: 0,
            mostBogeyPlusRounds: 0,
            leastBogeyPlus: 100,
            leastBogeyPlusCourse: "",
            leastBogeyPlusPar: 0,
            leastBogeyPlusHole: 0,
            leastBogeyPlusRounds: 0
        },
        mostPutts: {
            // Most number of putts 9
            highestPuttAverage9Date: "",
            highestPuttAverage9Course: "",
            highestPuttAverage9InOrOut: "",
            highestPuttAverage9: 0,
            // Most number of putts 18
            highestPuttAverage18Date: "",
            highestPuttAverage18Course: "",
            highestPuttAverage18InOrOut: "",
            highestPuttAverage18: 0,
            highestPuttAverage18Front9: 0,
            highestPuttAverage18Back9: 0,

            // Least number of putts 9
            lowestPuttAverage9Date: "",
            lowestPuttAverage9Course: "",
            lowestPuttAverage9InOrOut: "",
            lowestPuttAverage9: 0,

            // Least number of putts 18
            lowestPuttAverage18Date: "",
            lowestPuttAverage18Course: "",
            lowestPuttAverage18InOrOut: "",
            lowestPuttAverage18: 0,
            lowestPuttAverage18Front9: 0,
            lowestPuttAverage18Back9: 0,
        },
        ctp: {},
        longestDrive: {}

        // Sample object that is populated below
        // andersonGlenHole1: {
        //     course: "Anderson Glen"
        //     par: 4,
        //     hole: 1,
        //     distance: 400,
        //     rounds: 1,
        //     cumulativeScore: 6,
        //     cumulativeScoreToPar: 2,
        //     best: 6,
        //     bestScoreToPar: 2,
        //     worst: 6,
        //     worstScoreToPar: 2,
        //     numBirdies: 1,
        //     numBogeyPlus: 0
        // }
    };
    
    for (let round of allRounds) {
        for (let hole = 1; hole <= 18; hole++ ) {
            if (round[`hole${hole}`]) {
                if (singleHoleMetrics[`${round.courseKey}Hole${hole}`] === undefined) {
                    singleHoleMetrics[`${round.courseKey}Hole${hole}`] = { // Initial fields for hole
                        course: round.course,
                        courseKey: round.courseKey,
                        par: courseInfo[round.courseKey][`hole${hole}`].par,
                        hole: hole,
                        distance: courseInfo[round.courseKey][`hole${hole}`].distance,
                        rounds: 1,
                        cumulativeScore: round[`hole${hole}`].score,
                        cumulativeScoreToPar: round[`hole${hole}`].score - courseInfo[round.courseKey][`hole${hole}`].par,
                        best: round[`hole${hole}`].score,
                        bestScoreToPar: round[`hole${hole}`].score - courseInfo[round.courseKey][`hole${hole}`].par,
                        worst: round[`hole${hole}`].score,
                        worstScoreToPar: round[`hole${hole}`].score - courseInfo[round.courseKey][`hole${hole}`].par,
                        numEagles: 0,
                        numBirdies: 0,
                        numPars: 0,
                        numBogeys: 0,
                        numBogeyPlus: 0,
                        putts: round[`hole${hole}`].putts,
                        dth: round[`hole${hole}`].dth ? round[`hole${hole}`].dth : null, // dth not captured for all rounds
                        fairways: { l: 0, r: 0, f: 0, x: 0, na: 0 },
                        greens: { g: 0, x: 0, gur: 0 },
                        puttLength: round[`hole${hole}`].puttLength,
                        handicap: courseInfo[round.courseKey][`hole${hole}`].handicap,
                        roundsData: []
                    }
                } else { // Metric is already defined
                    singleHoleMetrics[`${round.courseKey}Hole${hole}`].rounds++; // Add round
                    singleHoleMetrics[`${round.courseKey}Hole${hole}`].cumulativeScore = singleHoleMetrics[`${round.courseKey}Hole${hole}`].cumulativeScore + round[`hole${hole}`].score; // Add score to cumulative score
                    singleHoleMetrics[`${round.courseKey}Hole${hole}`].cumulativeScoreToPar = singleHoleMetrics[`${round.courseKey}Hole${hole}`].cumulativeScoreToPar + round[`hole${hole}`].score - courseInfo[round.courseKey][`hole${hole}`].par; // Add score to cumulative score to par
                
                    if (round[`hole${hole}`].score < singleHoleMetrics[`${round.courseKey}Hole${hole}`].best) { // Best score for hole is set
                        singleHoleMetrics[`${round.courseKey}Hole${hole}`].best = round[`hole${hole}`].score;
                        singleHoleMetrics[`${round.courseKey}Hole${hole}`].bestScoreToPar = round[`hole${hole}`].score - singleHoleMetrics[`${round.courseKey}Hole${hole}`].par;
                    }
                    if (round[`hole${hole}`].score > singleHoleMetrics[`${round.courseKey}Hole${hole}`].worst) { // Worst score for hole is set
                        singleHoleMetrics[`${round.courseKey}Hole${hole}`].worst = round[`hole${hole}`].score;
                        singleHoleMetrics[`${round.courseKey}Hole${hole}`].worstScoreToPar = round[`hole${hole}`].score - singleHoleMetrics[`${round.courseKey}Hole${hole}`].par;
                    }
                }
                // Add to score distribution
                if (round[`hole${hole}`].score <= courseInfo[round.courseKey][`hole${hole}`].par - 2) singleHoleMetrics[`${round.courseKey}Hole${hole}`].numEagles++
                if (round[`hole${hole}`].score === courseInfo[round.courseKey][`hole${hole}`].par - 1) singleHoleMetrics[`${round.courseKey}Hole${hole}`].numBirdies++;
                if (round[`hole${hole}`].score === courseInfo[round.courseKey][`hole${hole}`].par) singleHoleMetrics[`${round.courseKey}Hole${hole}`].numPars++;
                if (round[`hole${hole}`].score === courseInfo[round.courseKey][`hole${hole}`].par + 1) singleHoleMetrics[`${round.courseKey}Hole${hole}`].numBogeys++;
                if (round[`hole${hole}`].score >= courseInfo[round.courseKey][`hole${hole}`].par + 2) singleHoleMetrics[`${round.courseKey}Hole${hole}`].numBogeyPlus++;
                singleHoleMetrics[`${round.courseKey}Hole${hole}`].roundsData.push({
                    sequence: round.sequence,
                    date: round.date,
                    score: round[`hole${hole}`].score,
                    putts: round[`hole${hole}`].putts,
                    fir: round[`hole${hole}`].fir,
                    gir: round[`hole${hole}`].gir,
                    dtg: round[`hole${hole}`].dtg,
                    dth: round[`hole${hole}`].dth,
                    puttLength: round[`hole${hole}`].puttLength,
                    notes: round[`hole${hole}`].notes,
                });
                // Fairways
                if (round[`hole${hole}`].fir === 'L') singleHoleMetrics[`${round.courseKey}Hole${hole}`].fairways.l++; // Left of fairway
                else {
                    if (round[`hole${hole}`].fir === 'R') singleHoleMetrics[`${round.courseKey}Hole${hole}`].fairways.r++; // Right of fairway
                    else {
                        if (round[`hole${hole}`].fir === 'F') { // Fairway in regulation
                            singleHoleMetrics[`${round.courseKey}Hole${hole}`].fairways.f++;
                        }
                        else {
                            if (round[`hole${hole}`].fir === 'X') singleHoleMetrics[`${round.courseKey}Hole${hole}`].fairways.x++; // Short of fairway/topped/out of bounds
                            else {
                                if (round[`hole${hole}`].fir === 'NA') singleHoleMetrics[`${round.courseKey}Hole${hole}`].fairways.na++;
                            }
                        }
                    }
                }
                // Greens
                if (round[`hole${hole}`].gir === 'G') { // Green in regulation
                    singleHoleMetrics[`${round.courseKey}Hole${hole}`].greens.g++;
                } else {
                    if (round[`hole${hole}`].gir === 'X') singleHoleMetrics[`${round.courseKey}Hole${hole}`].greens.x++; // Green missed
                    else {
                        if (round[`hole${hole}`].gir === 'G-1') singleHoleMetrics[`${round.courseKey}Hole${hole}`].greens.gur++; // Green under regulation
                    }
                }
                // CTP
                if (
                    round[`hole${hole}`].dth && // DTH value must exist
                    courseInfo[round.courseKey][`hole${hole}`].par === 3 && // Must be par 3
                    (round[`hole${hole}`].gir === "G" || round[`hole${hole}`].gir === "G-1") && // Must be GIR or GUR
                    (round.sequence >= 9 || // Started capturing DTH after 9 rounds
                        (round[`hole${hole}`].putts === 0 || round[`hole${hole}`].putts === 1) // Chip-in or 1-putt counts towards CTP if sequence is < 9
                    )
                ) {
                    if (!singleHoleMetrics.ctp[`${round.courseKey}Hole${hole}`] || (round[`hole${hole}`].dth < singleHoleMetrics.ctp[`${round.courseKey}Hole${hole}`].dth)) {
                        singleHoleMetrics.ctp[`${round.courseKey}Hole${hole}`] = {
                            date: round.date,
                            course: round.course,
                            hole: hole,
                            dth: round[`hole${hole}`].dth,
                            score: round[`hole${hole}`].score,
                            distance: courseInfo[round.courseKey][`hole${hole}`].distance
                        }
                    }
                }
                // Longest Drive and Shortest DTG
                if (
                    round[`hole${hole}`].dtg && // DTG value must exist
                    courseInfo[round.courseKey][`hole${hole}`].par !== 3 // Must not be par 3
                ) {
                    if (!singleHoleMetrics.longestDrive[`${round.courseKey}Hole${hole}`] || (round[`hole${hole}`].dtg < singleHoleMetrics.longestDrive[`${round.courseKey}Hole${hole}`].dtg)) {
                        singleHoleMetrics.longestDrive[`${round.courseKey}Hole${hole}`] = {
                            date: round.date,
                            course: round.course,
                            hole: hole,
                            dtg: round[`hole${hole}`].dtg,
                            longestDrive: courseInfo[round.courseKey][`hole${hole}`].distance - round[`hole${hole}`].dtg,
                            score: round[`hole${hole}`].score,
                            distance: courseInfo[round.courseKey][`hole${hole}`].distance
                        }
                    }
                }
            }
        }
    }

    for (let hole in Object.keys(singleHoleMetrics)) {
        const nonHoleMetrics = ["bestCumulativeScoreSingle", "worstCumulativeScoreSingle", "birdies", "bogeyPlus", "mostPutts", "ctp", "longestDrive"];
        if (!nonHoleMetrics.includes(Object.keys(singleHoleMetrics)[hole])) { // Not actually holes
            // Determine which hole had best cumulative total
            if (singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]].cumulativeScoreToPar < singleHoleMetrics.bestCumulativeScoreSingle.cumulativeScoreToPar) { // Store cumulative total to par when lowest
                singleHoleMetrics.bestCumulativeScoreSingle = singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]]; // Save best metrics
            }

            // Determine which hole had worst cumulative total
            if (singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]].cumulativeScoreToPar > singleHoleMetrics.worstCumulativeScoreSingle.cumulativeScoreToPar) { // Store cumulative total to par when highest
                singleHoleMetrics.worstCumulativeScoreSingle = singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]]; // Save best metrics
            }
            // Determine which hole has most birdies
            if (singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]].numBirdies > singleHoleMetrics.birdies.mostBirdies) {
                singleHoleMetrics.birdies = {
                    ...singleHoleMetrics.birdies,
                    mostBirdies: singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]].numBirdies,
                    mostBirdiesCourse: singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]].course,
                    mostBirdiesPar: singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]].par,
                    mostBirdiesHole: singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]].hole,
                    mostBirdiesRounds: singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]].rounds
                }
            }
            // Determine which hole has most bogey plus
            if (singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]].numBogeyPlus > singleHoleMetrics.bogeyPlus.mostBogeyPlus) {
                singleHoleMetrics.bogeyPlus = {
                    ...singleHoleMetrics.bogeyPlus,
                    mostBogeyPlus: singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]].numBogeyPlus,
                    mostBogeyPlusCourse: singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]].course,
                    mostBogeyPlusPar: singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]].par,
                    mostBogeyPlusHole: singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]].hole,
                    mostBogeyPlusRounds: singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]].rounds
                }
            }
            // Determine which hole has least bogey plus
            if (singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]].numBogeyPlus < singleHoleMetrics.bogeyPlus.leastBogeyPlus) {
                singleHoleMetrics.bogeyPlus = {
                    ...singleHoleMetrics.bogeyPlus,
                    leastBogeyPlus: singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]].numBogeyPlus,
                    leastBogeyPlusCourse: singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]].course,
                    leastBogeyPlusPar: singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]].par,
                    leastBogeyPlusHole: singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]].hole,
                    leastBogeyPlusRounds: singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]].rounds
                }
            }
            // Determine which hole has least birdies - There are a number of hole not birdied
            if (singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]].numBirdies === 0) {
                singleHoleMetrics.birdies.notBirdied.push(singleHoleMetrics[Object.keys(singleHoleMetrics)[hole]]);
            }
        }
    }

    console.log("singleHoleMetrics",singleHoleMetrics)

    return singleHoleMetrics;
}

export const calculateCourseMetrics = (courseInfo, allRounds) => {
    let courseMetrics = {};
    console.log("courseInfo",courseInfo)
    for (let course of Object.keys(courseInfo)) {
        courseMetrics[course] = {
            inDate: "",
            in: 100,
            inPutts: 0,

            outDate: "",
            out: 100,
            outPutts: 0,

            totalDate: "",
            total: 200,
            totalPutts: 0,
            totalIn: 100,
            totalOut: 100,
        }
    }

    for (let round of allRounds) {
        // Best IN round
        if (courseMetrics[round.courseKey].in > round.in && round.in !== 0 && round.fullBack9 && !round.scrambleRound) {
            courseMetrics[round.courseKey] = {
                ...courseMetrics[round.courseKey],
                inDate: round.date,
                in: round.in,
                inPutts: round.f9Putts
            }
        }
        // Best OUT round
        if (courseMetrics[round.courseKey].out > round.out && round.out !== 0 && round.fullFront9 && !round.scrambleRound) {
            courseMetrics[round.courseKey] = {
                ...courseMetrics[round.courseKey],
                outDate: round.date,
                out: round.out,
                outPutts: round.b9Putts
            }
        }
        // Best total round
        if (courseMetrics[round.courseKey].total > round.total && round.fullBack9 && round.fullFront9 && !round.scrambleRound) {
            courseMetrics[round.courseKey] = {
                ...courseMetrics[round.courseKey],
                totalDate: round.date,
                total: round.total,
                totalPutts: round.putts,
                totalIn: round.in,
                totalOut: round.out,
            }
        }
    }

    return courseMetrics;
}

const calculateHandicaps = (courseInfo, handicapRounds) => {
    let tempHandicapData = {
        overall: {
            f9TotalScore: 0,
            b9TotalScore: 0,
            f9Rounds: 0,
            b9Rounds: 0,
        },
        andersonGlen: {
            f9TotalScore: 0,
            b9TotalScore: 0,
            f9Rounds: 0,
            b9Rounds: 0,
        },
        gileadHighlands: {
            f9TotalScore: 0,
            b9TotalScore: 0,
            f9Rounds: 0,
            b9Rounds: 0,
        }
    }

    let courses = ["overall", "andersonGlen", "gileadHighlands"]
    for (let course in courses) {
        for (let round of handicapRounds[`${courses[course]}HandicapRounds`]) {
            if (round.out !== 0) {
                tempHandicapData[courses[course]].f9Rounds++;
                tempHandicapData[courses[course]].f9TotalScore = tempHandicapData[courses[course]].f9TotalScore + round.out;
            }
            if (round.in !== 0) {
                tempHandicapData[courses[course]].b9Rounds++;
                tempHandicapData[courses[course]].b9TotalScore = tempHandicapData[courses[course]].b9TotalScore + round.in;
            }
        }
    }

    const handicapData = {
        overall: {
            total: ((tempHandicapData.overall.f9TotalScore / tempHandicapData.overall.f9Rounds) + (tempHandicapData.overall.b9TotalScore / tempHandicapData.overall.b9Rounds) - 72).toFixed(1)
        },
        andersonGlen: {
            f9: ((tempHandicapData.andersonGlen.f9TotalScore / tempHandicapData.andersonGlen.f9Rounds) - courseInfo.andersonGlen.f9Par).toFixed(1),
            b9: ((tempHandicapData.andersonGlen.b9TotalScore / tempHandicapData.andersonGlen.b9Rounds) - courseInfo.andersonGlen.b9Par).toFixed(1),
            total: (((tempHandicapData.andersonGlen.f9TotalScore / tempHandicapData.andersonGlen.f9Rounds) - courseInfo.andersonGlen.f9Par) + ((tempHandicapData.andersonGlen.b9TotalScore / tempHandicapData.andersonGlen.b9Rounds) - courseInfo.andersonGlen.b9Par)).toFixed(1)
        },
        gileadHighlands: {
            f9: ((tempHandicapData.gileadHighlands.f9TotalScore / tempHandicapData.gileadHighlands.f9Rounds) - courseInfo.gileadHighlands.f9Par).toFixed(1),
            b9: ((tempHandicapData.gileadHighlands.b9TotalScore / tempHandicapData.gileadHighlands.b9Rounds) - courseInfo.gileadHighlands.b9Par).toFixed(1),
            total: (((tempHandicapData.gileadHighlands.f9TotalScore / tempHandicapData.gileadHighlands.f9Rounds) - courseInfo.gileadHighlands.f9Par) + ((tempHandicapData.gileadHighlands.b9TotalScore / tempHandicapData.gileadHighlands.b9Rounds) - courseInfo.gileadHighlands.b9Par)).toFixed(1)
        }
    }

    return handicapData;
}

export const calculateHandicapMetrics = (courseInfo, allRounds) => {
    // 12 most recent rounds contribute to handicap
    const roundsSortedByDescendingDate = allRounds.sort(function(a,b) {return (a.sequence < b.sequence) ? 1 : ((b.sequence < a.sequence) ? -1 : 0);} );
    let overallHandicapRounds = [];
    
    if (roundsSortedByDescendingDate.length <= 12) {
        overallHandicapRounds = roundsSortedByDescendingDate;
    } else {
        for (let i = 0; overallHandicapRounds.length < 12; i++) {
            if (!roundsSortedByDescendingDate[i].scrambleRound) { // Scramble and non-Blackledge rounds should not be included in handicap
                if (roundsSortedByDescendingDate[i].courseKey === "andersonGlen" || roundsSortedByDescendingDate[i].courseKey === "gileadHighlands") overallHandicapRounds.push(roundsSortedByDescendingDate[i]);
            }
        }
    }
    let andersonGlenHandicapRounds = [];
    let gileadHighlandsHandicapRounds = [];
    for (let i = 0; andersonGlenHandicapRounds.length < 12 && roundsSortedByDescendingDate[i]; i++) {
        if (roundsSortedByDescendingDate[i].courseKey === "andersonGlen") andersonGlenHandicapRounds.push(roundsSortedByDescendingDate[i])
    }
    for (let i = 0; gileadHighlandsHandicapRounds.length < 12 && roundsSortedByDescendingDate[i]; i++) {
        if (roundsSortedByDescendingDate[i].courseKey === "gileadHighlands") gileadHighlandsHandicapRounds.push(roundsSortedByDescendingDate[i])
    }

    const handicapRounds = { overallHandicapRounds, andersonGlenHandicapRounds, gileadHighlandsHandicapRounds };
    const handicapsData = calculateHandicaps(courseInfo, handicapRounds);

    return handicapsData;
}