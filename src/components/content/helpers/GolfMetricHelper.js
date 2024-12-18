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
        // console.log("round",round)
        if (round.fullFront9 && round.f9Putts !== 0 && round.f9Putts < leastPutts9 && !round.scrambleRound) {
            leastPutts9 = round.f9Putts;
            leastPuttsDate9 = round.date;
            leastPuttsCourse9 = round.course;
            leastPuttFrontOrBack9 = "Front 9";
        }
        if (round.fullBack9 && round.b9Putts !== 0 && round.b9Putts < leastPutts9 && !round.scrambleRound) {
            leastPutts9 = round.b9Putts;
            leastPuttsDate9 = round.date;
            leastPuttsCourse9 = round.course;
            leastPuttFrontOrBack9 = "Back 9";
        }
        if (round.fullFront9 && round.fullBack9 && round.numHoles === 18 && round.putts < leastPutts18 && !round.scrambleRound) {
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

export const calculateScoringAverageMetrics = (courseInfo, allRounds) => {
    let scoringAverages = {};
    let scoringAverageCategories = ["par3All", "par3Course", "par3Regulation", "par4", "par5"];
    for (let category of scoringAverageCategories) {
        scoringAverages[category] = {
            numHoles: 0,
            scoreToPar: 0,
            eagle: 0,
            birdie: 0,
            par: 0,
            bogey: 0,
            double: 0,
            triple: 0,
            quad: 0,
            threePutts: 0
        }
    }

    scoringAverages.par3All.header = "All Par 3";
    scoringAverages.par3Course.header = "Par 3 Course";
    scoringAverages.par3Regulation.header = "Par 3 Regulation";
    scoringAverages.par4.header = "Par 4";
    scoringAverages.par5.header = "Par 5";
    scoringAverages.eagleSummary = [];

    for (let round of allRounds) {
        if (round.key.includes("Par3")) {
            for (let hole = 1; hole <= 18; hole++ ) {
                if (round[`hole${hole}`]) {
                    // All par 3's
                    scoringAverages.par3All.numHoles = scoringAverages.par3All.numHoles + 1;
                    if (round[`hole${hole}`].score === 1) {
                        scoringAverages.eagleSummary.push({
                            date: round.date,
                            course: round.course,
                            hole: hole,
                            distance: round[`hole${hole}`].dtg,
                            par: courseInfo[round.courseKey][`hole${hole}`].par,
                            score: round[`hole${hole}`].score,
                            sequence: round.sequence
                        });
                        scoringAverages.par3All.eagle++;
                        scoringAverages.par3All.scoreToPar = scoringAverages.par3All.scoreToPar - 2;
                    }
                    if (round[`hole${hole}`].score === 2) {
                        scoringAverages.par3All.birdie++;
                        scoringAverages.par3All.scoreToPar--;
                    }
                    if (round[`hole${hole}`].score === 3) {
                        scoringAverages.par3All.par++;
                    }
                    if (round[`hole${hole}`].score === 4) {
                        scoringAverages.par3All.bogey++;
                        scoringAverages.par3All.scoreToPar++;
                        if (round[`hole${hole}`].putts >= 3) scoringAverages.par3All.threePutts++;
                    }
                    if (round[`hole${hole}`].score === 5) {
                        scoringAverages.par3All.double++;
                        scoringAverages.par3All.scoreToPar = scoringAverages.par3All.scoreToPar + 2;
                        if (round[`hole${hole}`].putts >= 3) scoringAverages.par3All.threePutts++;
                    }
                    if (round[`hole${hole}`].score === 6) {
                        scoringAverages.par3All.triple++;
                        scoringAverages.par3All.scoreToPar = scoringAverages.par3All.scoreToPar + 3;
                        if (round[`hole${hole}`].putts >= 3) scoringAverages.par3All.threePutts++;
                    }
                    if (round[`hole${hole}`].score === 7) {
                        scoringAverages.par3All.quad++;
                        scoringAverages.par3All.scoreToPar = scoringAverages.par3All.scoreToPar + 4;
                        if (round[`hole${hole}`].putts >= 3) scoringAverages.par3All.threePutts++;
                    }
                    // Par 3 course only
                    scoringAverages.par3Course.numHoles = scoringAverages.par3Course.numHoles + 1;
                    if (round[`hole${hole}`].score === 1) {
                        scoringAverages.par3Course.eagle++;
                        scoringAverages.par3Course.scoreToPar = scoringAverages.par3Course.scoreToPar - 2;
                    }
                    if (round[`hole${hole}`].score === 2) {
                        scoringAverages.par3Course.birdie++;
                        scoringAverages.par3Course.scoreToPar--;
                    }
                    if (round[`hole${hole}`].score === 3) {
                        scoringAverages.par3Course.par++;
                    }
                    if (round[`hole${hole}`].score === 4) {
                        scoringAverages.par3Course.bogey++;
                        scoringAverages.par3Course.scoreToPar++;
                        if (round[`hole${hole}`].putts >= 3) scoringAverages.par3Course.threePutts++;
                    }
                    if (round[`hole${hole}`].score === 5) {
                        scoringAverages.par3Course.double++;
                        scoringAverages.par3Course.scoreToPar = scoringAverages.par3Course.scoreToPar + 2;
                        if (round[`hole${hole}`].putts >= 3) scoringAverages.par3Course.threePutts++;
                    }
                    if (round[`hole${hole}`].score === 6) {
                        scoringAverages.par3Course.triple++;
                        scoringAverages.par3Course.scoreToPar = scoringAverages.par3Course.scoreToPar + 3;
                        if (round[`hole${hole}`].putts >= 3) scoringAverages.par3Course.threePutts++;
                    }
                    if (round[`hole${hole}`].score === 7) {
                        scoringAverages.par3Course.quad++;
                        scoringAverages.par3Course.scoreToPar = scoringAverages.par3Course.scoreToPar + 4;
                        if (round[`hole${hole}`].putts >= 3) scoringAverages.par3Course.threePutts++;
                    }
                }
            }
        } else {
            for (let hole = 1; hole <= 18; hole++ ) {
                if (round[`hole${hole}`]) {
                    if (courseInfo[round.courseKey][`hole${hole}`].par === 3) {
                        // All par 3's
                        scoringAverages.par3All.numHoles = scoringAverages.par3All.numHoles + 1;
                        if (round[`hole${hole}`].score === 1) {
                            scoringAverages.eagleSummary.push({
                                date: round.date,
                                course: round.course,
                                hole: hole,
                                distance: round[`hole${hole}`].dtg,
                                par: courseInfo[round.courseKey][`hole${hole}`].par,
                                score: round[`hole${hole}`].score,
                                sequence: round.sequence
                            });
                            scoringAverages.par3All.eagle++;
                            scoringAverages.par3All.scoreToPar = scoringAverages.par3All.scoreToPar - 2;
                        }
                        if (round[`hole${hole}`].score === 2) {
                            scoringAverages.par3All.birdie++;
                            scoringAverages.par3All.scoreToPar--;
                        }
                        if (round[`hole${hole}`].score === 3) {
                            scoringAverages.par3All.par++;
                        }
                        if (round[`hole${hole}`].score === 4) {
                            scoringAverages.par3All.bogey++;
                            scoringAverages.par3All.scoreToPar++;
                            if (round[`hole${hole}`].putts >= 3) scoringAverages.par3All.threePutts++;
                        }
                        if (round[`hole${hole}`].score === 5) {
                            scoringAverages.par3All.double++;
                            scoringAverages.par3All.scoreToPar = scoringAverages.par3All.scoreToPar + 2;
                            if (round[`hole${hole}`].putts >= 3) scoringAverages.par3All.threePutts++;
                        }
                        if (round[`hole${hole}`].score === 6) {
                            scoringAverages.par3All.triple++;
                            scoringAverages.par3All.scoreToPar = scoringAverages.par3All.scoreToPar + 3;
                            if (round[`hole${hole}`].putts >= 3) scoringAverages.par3All.threePutts++;
                        }
                        if (round[`hole${hole}`].score === 7) {
                            scoringAverages.par3All.quad++;
                            scoringAverages.par3All.scoreToPar = scoringAverages.par3All.scoreToPar + 4;
                            if (round[`hole${hole}`].putts >= 3) scoringAverages.par3All.threePutts++;
                        }
                        // Par 3 regulation course only
                        scoringAverages.par3Regulation.numHoles = scoringAverages.par3Regulation.numHoles + 1;
                        if (round[`hole${hole}`].score === 1) {
                            scoringAverages.par3Regulation.eagle++;
                            scoringAverages.par3Regulation.scoreToPar = scoringAverages.par3Regulation.scoreToPar - 2;
                        }
                        if (round[`hole${hole}`].score === 2) {
                            scoringAverages.par3Regulation.birdie++;
                            scoringAverages.par3Regulation.scoreToPar--;
                        }
                        if (round[`hole${hole}`].score === 3) {
                            scoringAverages.par3Regulation.par++;
                        }
                        if (round[`hole${hole}`].score === 4) {
                            scoringAverages.par3Regulation.bogey++;
                            scoringAverages.par3Regulation.scoreToPar++;
                            if (round[`hole${hole}`].putts >= 3) scoringAverages.par3Regulation.threePutts++;
                        }
                        if (round[`hole${hole}`].score === 5) {
                            scoringAverages.par3Regulation.double++;
                            scoringAverages.par3Regulation.scoreToPar = scoringAverages.par3Regulation.scoreToPar + 2;
                            if (round[`hole${hole}`].putts >= 3) scoringAverages.par3Regulation.threePutts++;
                        }
                        if (round[`hole${hole}`].score === 6) {
                            console.log(`Triple ${round.course} hole ${hole} on ${round.date}`, round)
                            scoringAverages.par3Regulation.triple++;
                            scoringAverages.par3Regulation.scoreToPar = scoringAverages.par3Regulation.scoreToPar + 3;
                            if (round[`hole${hole}`].putts >= 3) scoringAverages.par3Regulation.threePutts++;
                        }
                        if (round[`hole${hole}`].score === 7) {
                            scoringAverages.par3Regulation.quad++;
                            scoringAverages.par3Regulation.scoreToPar = scoringAverages.par3Regulation.scoreToPar + 4;
                            if (round[`hole${hole}`].putts >= 3) scoringAverages.par3Regulation.threePutts++;
                        }
                    // Par 4
                    } else if (courseInfo[round.courseKey][`hole${hole}`].par === 4) {
                        scoringAverages.par4.numHoles = scoringAverages.par4.numHoles + 1;
                        if (round[`hole${hole}`].score === 2) {
                            scoringAverages.eagleSummary.push({
                                date: round.date,
                                course: round.course,
                                hole: hole,
                                distance: courseInfo[round.courseKey][`hole${hole}`].distance,
                                par: courseInfo[round.courseKey][`hole${hole}`].par,
                                score: round[`hole${hole}`].score,
                                sequence: round.sequence
                            });
                            scoringAverages.par4.eagle++;
                            scoringAverages.par4.scoreToPar = scoringAverages.par4.scoreToPar - 2;
                        }
                        if (round[`hole${hole}`].score === 3) {
                            scoringAverages.par4.birdie++;
                            scoringAverages.par4.scoreToPar--;
                        }
                        if (round[`hole${hole}`].score === 4) {
                            scoringAverages.par4.par++;
                            if (round[`hole${hole}`].putts >= 3) scoringAverages.par4.threePutts++;
                        }
                        if (round[`hole${hole}`].score === 5) {
                            scoringAverages.par4.bogey++;
                            scoringAverages.par4.scoreToPar++;
                            if (round[`hole${hole}`].putts >= 3) scoringAverages.par4.threePutts++;
                        }
                        if (round[`hole${hole}`].score === 6) {
                            scoringAverages.par4.double++;
                            scoringAverages.par4.scoreToPar = scoringAverages.par4.scoreToPar + 2;
                            if (round[`hole${hole}`].putts >= 3) scoringAverages.par4.threePutts++;
                        }
                        if (round[`hole${hole}`].score === 7) {
                            console.log(`Triple ${round.course} hole ${hole} on ${round.date}`, round)
                            scoringAverages.par4.triple++;
                            scoringAverages.par4.scoreToPar = scoringAverages.par4.scoreToPar + 3;
                            if (round[`hole${hole}`].putts >= 3) scoringAverages.par4.threePutts++;
                        }
                        if (round[`hole${hole}`].score === 8) {
                            console.log(`Quad ${round.course} hole ${hole} on ${round.date}`, round)
                            scoringAverages.par4.quad++;
                            scoringAverages.par4.scoreToPar = scoringAverages.par4.scoreToPar + 4;
                            if (round[`hole${hole}`].putts >= 3) scoringAverages.par4.threePutts++;
                        }
                    // Par 5
                    } else if (courseInfo[round.courseKey][`hole${hole}`].par === 5) {
                        scoringAverages.par5.numHoles = scoringAverages.par5.numHoles + 1;
                        if (round[`hole${hole}`].score === 3) {
                            scoringAverages.eagleSummary.push({
                                date: round.date,
                                course: round.course,
                                hole: hole,
                                distance: courseInfo[round.courseKey][`hole${hole}`].distance,
                                par: courseInfo[round.courseKey][`hole${hole}`].par,
                                score: round[`hole${hole}`].score,
                                sequence: round.sequence
                            });
                            scoringAverages.par5.eagle++;
                            scoringAverages.par5.scoreToPar = scoringAverages.par5.scoreToPar -2;
                        }
                        if (round[`hole${hole}`].score === 4) {
                            scoringAverages.par5.birdie++;
                            scoringAverages.par5.scoreToPar--;
                        }
                        if (round[`hole${hole}`].score === 5) {
                            scoringAverages.par5.par++;
                            if (round[`hole${hole}`].putts >= 3) scoringAverages.par5.threePutts++;
                        }
                        if (round[`hole${hole}`].score === 6) {
                            scoringAverages.par5.bogey++;
                            scoringAverages.par5.scoreToPar++;
                            if (round[`hole${hole}`].putts >= 3) scoringAverages.par5.threePutts++;
                        }
                        if (round[`hole${hole}`].score === 7) {
                            scoringAverages.par5.double++;
                            scoringAverages.par5.scoreToPar = scoringAverages.par5.scoreToPar + 2;
                            if (round[`hole${hole}`].putts >= 3) scoringAverages.par5.threePutts++;
                        }
                        if (round[`hole${hole}`].score === 8) {
                            console.log(`Triple ${round.course} hole ${hole} on ${round.date}`, round)
                            scoringAverages.par5.triple++;
                            scoringAverages.par5.scoreToPar = scoringAverages.par5.scoreToPar + 3;
                            if (round[`hole${hole}`].putts >= 3) scoringAverages.par5.threePutts++;
                        }
                        if (round[`hole${hole}`].score === 9) {
                            scoringAverages.par5.quad++;
                            scoringAverages.par5.scoreToPar = scoringAverages.par5.scoreToPar + 4;
                            if (round[`hole${hole}`].putts >= 3) scoringAverages.par5.threePutts++;
                        }
                    }
                }
            }
        }
    }

    return scoringAverages;
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
        //     numBogeyPlus: 0,
        //     putts: 1
        //     putts0: 0,
        //     putts1: 1,
        //     putts2: 0,
        //     putts3: 0,
        //     roundsData: [{
        //        sequence: sequence,
        //        date: date,
        //        score: 4,
        //        putts: 2,
        //        fir: F,
        //        gir: G,
        //        dtg: 100,
        //        dth: 6,
        //        puttLength: 3,
        //        notes: ""
        //     }, ...]
        // }
    };
    
    for (let round of allRounds) {
        for (let hole = 1; hole <= 18; hole++ ) {
            if (round[`hole${hole}`]) {
                // console.log("round[`hole${hole}`].dtg",round[`hole${hole}`].dtg)
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
                        putts0: round[`hole${hole}`].putts === 0 ? 1 : 0,
                        putts1: round[`hole${hole}`].putts === 1 ? 1 : 0,
                        putts2: round[`hole${hole}`].putts === 2 ? 1 : 0,
                        putts3: round[`hole${hole}`].putts === 3 ? 1 : 0,
                        dth: round[`hole${hole}`].dth ? round[`hole${hole}`].dth : null, // dth not captured for all rounds
                        fairways: { l: 0, r: 0, f: 0, x: 0, na: 0, lScoreToPar: 0, rScoreToPar: 0, fScoreToPar: 0 },
                        greens: { g: 0, x: 0, gur: 0, gScoreToPar: 0, xScoreToPar: 0, gurScoreToPar: 0 },
                        puttLength: round[`hole${hole}`].puttLength,
                        handicap: courseInfo[round.courseKey][`hole${hole}`].handicap,
                        roundsData: []
                    }
                } else { // Metric is already defined
                    singleHoleMetrics[`${round.courseKey}Hole${hole}`].rounds++; // Add round
                    singleHoleMetrics[`${round.courseKey}Hole${hole}`].cumulativeScore = singleHoleMetrics[`${round.courseKey}Hole${hole}`].cumulativeScore + round[`hole${hole}`].score; // Add score to cumulative score
                    singleHoleMetrics[`${round.courseKey}Hole${hole}`].cumulativeScoreToPar = singleHoleMetrics[`${round.courseKey}Hole${hole}`].cumulativeScoreToPar + round[`hole${hole}`].score - courseInfo[round.courseKey][`hole${hole}`].par; // Add score to cumulative score to par
                
                    singleHoleMetrics[`${round.courseKey}Hole${hole}`].putts = singleHoleMetrics[`${round.courseKey}Hole${hole}`].putts + round[`hole${hole}`].putts; // Add putts to cumulative putts
                    singleHoleMetrics[`${round.courseKey}Hole${hole}`][`putts${round[`hole${hole}`].putts}`] = singleHoleMetrics[`${round.courseKey}Hole${hole}`][`putts${round[`hole${hole}`].putts}`] + 1; // Add 1 to putts0, putts1, etc.

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
                if (round[`hole${hole}`].fir === 'L') {
                    singleHoleMetrics[`${round.courseKey}Hole${hole}`].fairways.l++; // Left of fairway
                    singleHoleMetrics[`${round.courseKey}Hole${hole}`].fairways.lScoreToPar = singleHoleMetrics[`${round.courseKey}Hole${hole}`].fairways.lScoreToPar + round[`hole${hole}`].score - courseInfo[round.courseKey][`hole${hole}`].par;
                } else {
                    if (round[`hole${hole}`].fir === 'R') {
                        singleHoleMetrics[`${round.courseKey}Hole${hole}`].fairways.r++; // Right of fairway
                        singleHoleMetrics[`${round.courseKey}Hole${hole}`].fairways.rScoreToPar = singleHoleMetrics[`${round.courseKey}Hole${hole}`].fairways.rScoreToPar + round[`hole${hole}`].score - courseInfo[round.courseKey][`hole${hole}`].par;
                    } else {
                        if (round[`hole${hole}`].fir === 'F') { // Fairway in regulation
                            singleHoleMetrics[`${round.courseKey}Hole${hole}`].fairways.f++;
                            singleHoleMetrics[`${round.courseKey}Hole${hole}`].fairways.fScoreToPar = singleHoleMetrics[`${round.courseKey}Hole${hole}`].fairways.fScoreToPar + round[`hole${hole}`].score - courseInfo[round.courseKey][`hole${hole}`].par;
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
                    singleHoleMetrics[`${round.courseKey}Hole${hole}`].greens.gScoreToPar = singleHoleMetrics[`${round.courseKey}Hole${hole}`].greens.gScoreToPar + round[`hole${hole}`].score - courseInfo[round.courseKey][`hole${hole}`].par;
                } else {
                    if (round[`hole${hole}`].gir === 'X') { // Green missed
                        singleHoleMetrics[`${round.courseKey}Hole${hole}`].greens.x++;
                        singleHoleMetrics[`${round.courseKey}Hole${hole}`].greens.xScoreToPar = singleHoleMetrics[`${round.courseKey}Hole${hole}`].greens.xScoreToPar + round[`hole${hole}`].score - courseInfo[round.courseKey][`hole${hole}`].par;
                    } else {
                        if (round[`hole${hole}`].gir === 'G-1') {
                            singleHoleMetrics[`${round.courseKey}Hole${hole}`].greens.gur++; // Green under regulation
                            singleHoleMetrics[`${round.courseKey}Hole${hole}`].greens.gurScoreToPar = singleHoleMetrics[`${round.courseKey}Hole${hole}`].greens.gurScoreToPar + round[`hole${hole}`].score - courseInfo[round.courseKey][`hole${hole}`].par;
                        }
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
                    // console.log("round[`hole${hole}`].dtg",round[`hole${hole}`].dtg)
                    let holeDtg = round[`hole${hole}`].dtg;
                    if (typeof holeDtg !== "number") {
                        const initialDtg = holeDtg.split(", ")
                        holeDtg = initialDtg[0];
                    }
                    // console.log("singleHoleMetrics.longestDrive[`${round.courseKey}Hole${hole}`].dtg",singleHoleMetrics.longestDrive[`${round.courseKey}Hole${hole}`].dtg)
                    if (!singleHoleMetrics.longestDrive[`${round.courseKey}Hole${hole}`] || (round[`hole${hole}`].dtg < singleHoleMetrics.longestDrive[`${round.courseKey}Hole${hole}`].dtg)) {
                        singleHoleMetrics.longestDrive[`${round.courseKey}Hole${hole}`] = {
                            date: round.date,
                            course: round.course,
                            hole: hole,
                            dtg: round[`hole${hole}`].dtg,
                            longestDrive: courseInfo[round.courseKey][`hole${hole}`].distance - holeDtg,
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

    return singleHoleMetrics;
}

export const calculateCourseMetrics = (courseInfo, allRounds) => {
    let courseMetrics = {};
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

export const calculateLostBallMetrics = (courseInfo, displayedRounds) => {
    let lostBallMetrics = {
        totalLostBalls: 0,
        par3LostBalls: 0,
        par4LostBalls: 0,
        par5LostBalls: 0,
        lostBallsByDate: {
            // courseARound1: {
            //     course: courseA,
            //     total: 3,
            //     lostBallHoles: {
            //         hole3: 2,
            //         hole5: 1
            //     }
            // }
        },
        longestStreakWithoutLostBall: {}
    }

    let bestStreakWithoutLostBall = {
        numHoles: 0,
        startDate: "",
        endDate: ""
    }
    
    const initialStreakWithoutLostBall = {
        numHoles: 0,
        startDate: "",
    }
    
    let currentStreakWithoutLostBall = initialStreakWithoutLostBall;

    for (let round of displayedRounds) {
        if (!round.leagueRound && !round.scrambleRound) { // Do not include League & Scramble rounds because of hole distances
            for (let hole = 1; hole <= 18; hole++) {
                if (round[`hole${hole}`]) {
                    if (round[`hole${hole}`].notes && typeof round[`hole${hole}`].notes === "string" && round[`hole${hole}`].notes.includes("LB")) {
                        // Total lost ball count
                        if (round[`hole${hole}`].notes.includes("2LB")) {
                            lostBallMetrics.totalLostBalls = lostBallMetrics.totalLostBalls + 2;
                        } else {
                            lostBallMetrics.totalLostBalls++;
                        }

                        // Create date map
                        if (lostBallMetrics.lostBallsByDate[round.key]) {
                            lostBallMetrics.lostBallsByDate[round.key].lostBallHoles[`hole${hole}`] = round[`hole${hole}`].notes.includes("2LB") ? 2 : 1;
                            if (round[`hole${hole}`].notes.includes("2LB")) {
                                lostBallMetrics.lostBallsByDate[round.key].total = lostBallMetrics.lostBallsByDate[round.key].total + 2;
                            } else {
                                lostBallMetrics.lostBallsByDate[round.key].total = lostBallMetrics.lostBallsByDate[round.key].total + 1;
                            }
                        } else {
                            lostBallMetrics.lostBallsByDate[round.key] = {
                                date: round.date,
                                course: round.course,
                                total: round[`hole${hole}`].notes.includes("2LB") ? 2 : 1,
                                lostBallHoles: {
                                    [`hole${hole}`]: round[`hole${hole}`].notes.includes("2LB") ? 2 : 1
                                }
                            }
                        }

                        // Lost balls by par
                        lostBallMetrics[`par${courseInfo[round.courseKey][`hole${hole}`].par}LostBalls`]++;

                        // Store current streaks end date (streak is broken)
                        currentStreakWithoutLostBall.endDate = round.date;
                        // Update best streak if broken
                        if (bestStreakWithoutLostBall.numHoles < currentStreakWithoutLostBall.numHoles) bestStreakWithoutLostBall = currentStreakWithoutLostBall;
                        // Reset current streak
                        currentStreakWithoutLostBall = initialStreakWithoutLostBall;
                    } else {
                        currentStreakWithoutLostBall.numHoles = currentStreakWithoutLostBall.numHoles + 1;
                        if (currentStreakWithoutLostBall.startDate === "") currentStreakWithoutLostBall.startDate = round.date;
                    }
                }
            }
        }
    }

    lostBallMetrics.longestStreakWithoutLostBall = bestStreakWithoutLostBall;

    console.log("lostBallMetrics",lostBallMetrics)

    return lostBallMetrics
}

export const calculateDrivingMetrics = (courseInfo, allRounds) => {
    let drivingMetrics = {
        notInRangeOfGreen: { lowerBound: 0, upperBound: 0, customTitle: "Not in range of green" },
        lessThan200: { lowerBound: 1, upperBound: 199, customTitle: "< 200" }, // Tops & lay-ups
        between200and220: { lowerBound: 200, upperBound: 220 },
        between221and240: { lowerBound: 221, upperBound: 240 },
        between241and260: { lowerBound: 241, upperBound: 260 },
        between261and280: { lowerBound: 261, upperBound: 280 },
        between281and300: { lowerBound: 281, upperBound: 300 },
        greaterThan300: { lowerBound: 300, upperBound: 1000, customTitle: "300+" },
        total: { lowerBound: 1000, upperBound: 1000, customTitle: "Total" }
    };

    for (let range in Object.keys(drivingMetrics)) {
        drivingMetrics[Object.keys(drivingMetrics)[range]].f = 0;
        drivingMetrics[Object.keys(drivingMetrics)[range]].l = 0;
        drivingMetrics[Object.keys(drivingMetrics)[range]].r = 0;
        drivingMetrics[Object.keys(drivingMetrics)[range]].x = 0;
        drivingMetrics[Object.keys(drivingMetrics)[range]].xGir = 0;
        drivingMetrics[Object.keys(drivingMetrics)[range]].lGir = 0;
        drivingMetrics[Object.keys(drivingMetrics)[range]].fGir = 0;
        drivingMetrics[Object.keys(drivingMetrics)[range]].rGir = 0;
        drivingMetrics[Object.keys(drivingMetrics)[range]].total = 0;
    }

    for (let round of allRounds) {
        if (!round.leagueRound && !round.scrambleRound && !round.legacyRound) { // Do not include League, Scramble, and Legacy rounds because of hole distances
            let individualCourseData = courseInfo[round.courseKey];
            for (let hole = 1; hole <= 18; hole++) {
                if (round[`hole${hole}`]) {
                    if (round[`hole${hole}`].fir !== "NA") { // Exclude par 3's
                        drivingMetrics.total[round[`hole${hole}`].fir.toLowerCase()]++;
                        drivingMetrics.total.total++;

                        let dtgForCalculation = 1000;
                        if (
                            individualCourseData[`hole${hole}`].par === 4 // Par 4 DTG
                            || (individualCourseData[`hole${hole}`].par === 5 && round[`hole${hole}`].gir === "G-1") // Par 5 G-1
                        ) {
                            dtgForCalculation = parseInt(round[`hole${hole}`].dtg); // Use raw DTG
                        } else {
                            if (individualCourseData[`hole${hole}`].par === 5 && typeof round[`hole${hole}`].dtg === "string") { // DTG recorded after drive and approach
                                dtgForCalculation = parseInt(round[`hole${hole}`].dtg.split(", ")[0]); // Use first DTG value in array
                            }
                        }

                        if (dtgForCalculation === 1000) { // Not in range of green, cannot calculate driving distance
                            drivingMetrics.notInRangeOfGreen[round[`hole${hole}`].fir.toLowerCase()]++;
                            drivingMetrics.notInRangeOfGreen.total++;
                            if (round[`hole${hole}`].gir === "G-1" || round[`hole${hole}`].gir === "G") {
                                drivingMetrics.notInRangeOfGreen[`${round[`hole${hole}`].fir.toLowerCase()}Gir`]++;
                            }
                        } else {
                            const driveDistance = parseInt(individualCourseData[`hole${hole}`].distance) - dtgForCalculation;
                            
                            let drivingMetricRange = "";
                            if (driveDistance < 200) { drivingMetricRange = "lessThan200"; } else {
                            if (220 > driveDistance && driveDistance >= 200) { drivingMetricRange = "between200and220"; } else {
                            if (240 > driveDistance && driveDistance >= 220) { drivingMetricRange = "between221and240"; } else { 
                            if (260 > driveDistance && driveDistance >= 240) { drivingMetricRange = "between241and260"; } else { 
                            if (280 > driveDistance && driveDistance >= 260) { drivingMetricRange = "between261and280"; } else {
                            if (300 > driveDistance && driveDistance >= 280) { drivingMetricRange = "between281and300"; } else {
                            if (driveDistance >= 300) { drivingMetricRange = "greaterThan300"; }}}}}}}

                            if (!individualCourseData[`hole${hole}`].distance) console.log(`HOLE DISTANCE NOT PROVIDED FOR ${round.course} HOLE ${hole}`)
                            if (drivingMetricRange === "" && individualCourseData[`hole${hole}`].distance) {
                                console.log(`INVALID DTG VALUE FOR ROUND ${round.key.toUpperCase()}, HOLE ${hole}:`, round[`hole${hole}`].dtg);
                            } else {
                                drivingMetrics[drivingMetricRange][round[`hole${hole}`].fir.toLowerCase()]++;
                                drivingMetrics[drivingMetricRange].total++;
                                if (round[`hole${hole}`].gir === "G-1" || round[`hole${hole}`].gir === "G") {
                                    drivingMetrics[drivingMetricRange][`${round[`hole${hole}`].fir.toLowerCase()}Gir`]++;
                                    drivingMetrics.total[`${round[`hole${hole}`].fir.toLowerCase()}Gir`]++;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return drivingMetrics;
}

export const calculateApproachMetrics = (allRounds) => {
    let approachMetrics = {
        between0and50: { lowerBound: 0, upperBound: 50, club: "52°", customTitle: "< 50" },
        between0and90: { lowerBound: 51, upperBound: 90, club: "52°" },
        between0and130: { lowerBound: 91, upperBound: 130, club: "PW" },
        between0and145: { lowerBound: 131, upperBound: 145, club: "9i" },
        between146and155: { lowerBound: 146, upperBound: 155, club: "8i" },
        between156and170: { lowerBound: 156, upperBound: 170, club: "7i" },
        between171and180: { lowerBound: 171, upperBound: 180, club: "6i" },
        between181and190: { lowerBound: 181, upperBound: 190, club: "5i" },
        between191and210: { lowerBound: 191, upperBound: 210, club: "4i" },
        between211and230: { lowerBound: 211, upperBound: 230, club: "2i" },
        between231and250: { lowerBound: 231, upperBound: 250, club: "4 Wood" },
        between251and350: { lowerBound: 251, upperBound: 350, club: "4 Wood" },
        total: { lowerBound: 0, upperBound: 500, customTitle: "Total",  }
    }

    for (let range in Object.keys(approachMetrics)) {
        approachMetrics[Object.keys(approachMetrics)[range]].lg = 0;
        approachMetrics[Object.keys(approachMetrics)[range]].rg = 0;
        approachMetrics[Object.keys(approachMetrics)[range]].fg = 0;
        approachMetrics[Object.keys(approachMetrics)[range]].lx = 0;
        approachMetrics[Object.keys(approachMetrics)[range]].rx = 0;
        approachMetrics[Object.keys(approachMetrics)[range]].fx = 0;
        approachMetrics[Object.keys(approachMetrics)[range]].nag = 0;
        approachMetrics[Object.keys(approachMetrics)[range]].nax = 0;
        approachMetrics[Object.keys(approachMetrics)[range]].total = 0;
    }

    for (let round of allRounds) {
        if (!round.leagueRound && !round.scrambleRound && !round.legacyRound) { // Do not include League, Scramble, and Legacy rounds because of hole distances
            for (let hole = 1; hole <= 18; hole++) {
                if (round[`hole${hole}`]) {
                    let rangeMetricBeingUpdated = `${(round[`hole${hole}`].fir).toLowerCase()}${(round[`hole${hole}`].gir.toString()[0]).toLowerCase()}`;
                    const finalDtg = typeof round[`hole${hole}`].dtg === "number" ? round[`hole${hole}`].dtg : round[`hole${hole}`].dtg.split(", ")[1];
                    let approachRangeKey = "";
                    for (let range in Object.keys(approachMetrics)) {
                        if ((finalDtg > approachMetrics[Object.keys(approachMetrics)[range]].lowerBound) && (finalDtg < approachMetrics[Object.keys(approachMetrics)[range]].upperBound)) {
                            approachRangeKey = Object.keys(approachMetrics)[range];
                            approachMetrics[approachRangeKey][rangeMetricBeingUpdated]++;
                            approachMetrics[approachRangeKey].total++;
                        }
                    }
                }
            }
        }
    }

    return approachMetrics;
}

export const calculatePuttingMetrics = (puttingData, displayedRounds) => {
    // Sample putt = {
    //     round,
    //     date,
    //     putts,
    //     dth,
    //     fpm,
    //     scoreToPar,
    //     gir
    // }

    let displayedRoundKeys = [];
    for (let round of displayedRounds) displayedRoundKeys.push(round.key);

    let puttingMetrics = {
        totalPutts: 0,
        allPutts: {
            totalByScore: {
                num0Putts: { total: 0, scoreMinus2: 0, scoreMinus1: 0, score0: 0, score1: 0, score2: 0, score3: 0, score4: 0, score5: 0, score6: 0 },
                num1Putts: { total: 0, scoreMinus2: 0, scoreMinus1: 0, score0: 0, score1: 0, score2: 0, score3: 0, score4: 0, score5: 0, score6: 0 },
                num2Putts: { total: 0, scoreMinus2: 0, scoreMinus1: 0, score0: 0, score1: 0, score2: 0, score3: 0, score4: 0, score5: 0, score6: 0 },
                num3Putts: { total: 0, scoreMinus2: 0, scoreMinus1: 0, score0: 0, score1: 0, score2: 0, score3: 0, score4: 0, score5: 0, score6: 0 },
                byScore: { total: 0, scoreMinus2: 0, scoreMinus1: 0, score0: 0, score1: 0, score2: 0, score3: 0, score4: 0, score5: 0, score6: 0 }
            },
            gir: {
                num0Putts: { total: 0, scoreMinus2: 0, scoreMinus1: 0, score0: 0, score1: 0, score2: 0, score3: 0, score4: 0, score5: 0, score6: 0 },
                num1Putts: { total: 0, scoreMinus2: 0, scoreMinus1: 0, score0: 0, score1: 0, score2: 0, score3: 0, score4: 0, score5: 0, score6: 0 },
                num2Putts: { total: 0, scoreMinus2: 0, scoreMinus1: 0, score0: 0, score1: 0, score2: 0, score3: 0, score4: 0, score5: 0, score6: 0 },
                num3Putts: { total: 0, scoreMinus2: 0, scoreMinus1: 0, score0: 0, score1: 0, score2: 0, score3: 0, score4: 0, score5: 0, score6: 0 },
                byScore: { total: 0, scoreMinus2: 0, scoreMinus1: 0, score0: 0, score1: 0, score2: 0, score3: 0, score4: 0, score5: 0, score6: 0 }
            },
            nonGir: {
                num0Putts: { total: 0, scoreMinus2: 0, scoreMinus1: 0, score0: 0, score1: 0, score2: 0, score3: 0, score4: 0, score5: 0, score6: 0 },
                num1Putts: { total: 0, scoreMinus2: 0, scoreMinus1: 0, score0: 0, score1: 0, score2: 0, score3: 0, score4: 0, score5: 0, score6: 0 },
                num2Putts: { total: 0, scoreMinus2: 0, scoreMinus1: 0, score0: 0, score1: 0, score2: 0, score3: 0, score4: 0, score5: 0, score6: 0 },
                num3Putts: { total: 0, scoreMinus2: 0, scoreMinus1: 0, score0: 0, score1: 0, score2: 0, score3: 0, score4: 0, score5: 0, score6: 0 },
                byScore: { total: 0, scoreMinus2: 0, scoreMinus1: 0, score0: 0, score1: 0, score2: 0, score3: 0, score4: 0, score5: 0, score6: 0 }
            }
        },
        makeByDistance: {
            // from3: {
            //     distance: 3,
            //     totalPutts: 7,
            //     num0Putts: 0,
            //     num1Putts: 2,
            //     num2Putts: 4,
            //     num3Putts: 1,
            // }
        },
        threePuttByDistance: {},
        longestPutts: {
            // longest1: {
            //     length: 0,
            //     date: "",
            //     score: 0,
            //     course: ""
            // },
            // longest2: {
            //     length: 0,
            //     date: "",
            //     score: 0,
            //     course: ""
            // },
            // longest3: {
            //     length: 0,
            //     date: "",
            //     score: 0,
            //     course: ""
            // }
        },
    };

    for (let putt of puttingData) {
        if (putt.dth > 60) putt.dth = 60; // Reduce width of putting table, anything 60+ feet in one column
        // if (putt.dth === 0 || putt.dth % 3 === 0) {
            if (displayedRoundKeys.includes(putt.round)) { // Additional filter for only displayed rounds
                if (puttingMetrics.makeByDistance[`from${putt.dth}`]) {
                    puttingMetrics.makeByDistance[`from${putt.dth}`][`num${putt.putts}Putts`]++;
                    puttingMetrics.makeByDistance[`from${putt.dth}`].totalPutts++;
                } else { // Add putt by distance
                    if (putt.dth === 16) console.log("putt16",putt)
                    puttingMetrics.makeByDistance[`from${putt.dth}`] = {
                        distance: putt.dth,
                        totalPutts: 1,
                        num0Putts: putt.putts === 0 ? 1 : 0,
                        num1Putts: putt.putts === 1 ? 1 : 0,
                        num2Putts: putt.putts === 2 ? 1 : 0,
                        num3Putts: putt.putts === 3 ? 1 : 0,
                        num4Putts: putt.putts > 3 ? 1 : 0
                    }
                }
                // console.log("puttingMetrics.allPutts.gir",puttingMetrics.allPutts.gir)
                // console.log("[`num${putt.putts}Putts`]",[`num${putt.putts}Putts`])
                // console.log("puttingMetrics.allPutts.gir[`num${putt.putts}Putts`]",puttingMetrics.allPutts.gir[`num${putt.putts}Putts`])
                if (putt.gir === "G" || putt.gir === "G-1") {
                    console.log("\n\nputtingMetrics.allPutts.gir",puttingMetrics.allPutts.gir)
                    console.log("puttingMetrics.allPutts.gir[`num${putt.putts}Putts`]",puttingMetrics.allPutts.gir[`num${putt.putts}Putts`])
                    console.log("putt.putts",putt.putts)
                    puttingMetrics.allPutts.gir.byScore.total++;
                    puttingMetrics.allPutts.gir[`num${putt.putts}Putts`].total++; //
                    // puttingMetrics.allPutts.gir.byScore[`score${putt.scoreToPar < 0 ? "Minus" : ""}${Math.abs(putt.scoreToPar)}`].total++;
                    puttingMetrics.allPutts.gir[`num${putt.putts}Putts`][`score${putt.scoreToPar < 0 ? "Minus" : ""}${Math.abs(putt.scoreToPar)}`]++;
                } else {
                    puttingMetrics.allPutts.nonGir.byScore.total++;
                    puttingMetrics.allPutts.nonGir[`num${putt.putts}Putts`].total++;
                    // puttingMetrics.allPutts.nonGir.byScore[`score${putt.scoreToPar < 0 ? "Minus" : ""}${Math.abs(putt.scoreToPar)}`].total++;
                    puttingMetrics.allPutts.nonGir[`num${putt.putts}Putts`][`score${putt.scoreToPar < 0 ? "Minus" : ""}${Math.abs(putt.scoreToPar)}`]++;
                }
                puttingMetrics.allPutts.totalByScore.total++;
                puttingMetrics.allPutts.totalByScore[`num${putt.putts}Putts`].total++;
                puttingMetrics.totalPutts++;
                puttingMetrics.allPutts.totalByScore.byScore[`score${putt.scoreToPar < 0 ? "Minus" : ""}${Math.abs(putt.scoreToPar)}`]++;
                puttingMetrics.allPutts.totalByScore[`num${putt.putts}Putts`][`score${putt.scoreToPar < 0 ? "Minus" : ""}${Math.abs(putt.scoreToPar)}`]++;
            }
        // } else {
        //     console.log("putt not counted",putt)
        // }
    }

    return puttingMetrics;
}