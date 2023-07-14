import React, { useState, useEffect, useRef } from "react";
// MUI
// import { Modal } from '@mui/material';
// Components
// import Map from './Map';
// MUI
import {
    Table, TableHead, TableBody, TableRow, TableCell, Radio, RadioGroup, FormControl, FormControlLabel, CircularProgress, TextField,
    InputLabel, MenuItem, Select, OutlinedInput, ListItemText, Checkbox, Modal
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Check, Close, TurnSlightLeft, TurnSlightRight, LooksOne, LooksTwo, Looks3, Looks4, RemoveCircle, AddCircle, RoomRounded } from '@mui/icons-material';
// CSS
import "../common/shared.css"
// Helpers
import {
    calculateFairways, calculateGreens, calculatePuttLengths, calculateDthAndDtgTotals, createScorecard, calculateStats, courseSummary
} from "./helpers/GolfFormatHelper";
import { courses } from "./helpers/GolfConsts";
// Images
import scorecard from "../../images/scorecard.png";
import metrics from "../../images/metrics.png";
import singleHoleMetrics from "../../images/singleHoleMetrics.png";

const Excel = require('exceljs');
// const reader = require('xlsx');


const Golf = () => {

    /**
     * TODO
     * 
     * Find all instances of array of 2 Backledge courses and make into CONST file
     * 
     * Features:
     * Avg DTG/FPM/DTM
     * Scramble shots off tee/putt/approach
     * Include additional holes in single hole metrics
     * Percent of Sand shots still in sand & sand shots DTH/DTG
     * 
     * 
     * 
     */

    //  Configurable state
    const [activePage, setActivePage] = useState('Golf Rounds');
    const [yearFilter, setYearFilter] = useState(2023); // Can set default year here

    // Internal state
    const [displayUploadButton, setDisplayUploadButton] = useState(true);
    const [filters, setFilters] = useState(["2023"]);
    const [courseTours, setCourseTours] = useState(["South Suburban"]);
    const [isLoading, setIsLoading] = useState(false);
    const [allRounds, setAllRounds] = useState([]);
    const [displayedRounds, setDisplayedRounds] = useState([]);
    const [courseInfo, setCourseInfo] = useState({});
    const [roundYears, setRoundYears] = useState([]);
    const [tableSort, setTableSort] = useState({ method: 'formattedDate', order: 'descending' });
    const [activeRound, setActiveRound] = useState({});
    const [displaySubtable, setDisplaySubtable] = useState(false);
    const [activeScorecardEntry, setActiveScorecardEntry] = useState("");
    const [scorecardEntryData, setScorecardEntryData] = useState({});
    const [expandScorecard, setExpandScorecard] = useState(false);
    const [expandSingleHoleMetric, setExpandSingleHoleMetric] = useState({ hole: "", expanded: false });
    const [puttingData, setPuttingData] = useState({});
    const [displayHelpModal, setDisplayHelpModal] = useState(false);
    const pinnedCourse = "South Suburban"; // Course pinned atop scorecard entry

    console.log("scorecardEntryData",scorecardEntryData)

    const fileInputRef = useRef(null);

    useEffect(() => {
        const scorecardData = {};
        // console.log("activeScorecardEntry",activeScorecardEntry)
        // console.log("courseInfo activeScorecardEntry",courseInfo[activeScorecardEntry])
        for (let hole = 1; hole <= 18; hole++) {
            scorecardData[`hole${hole}`] = {
                score: activeScorecardEntry === "" ? 100 : courseInfo[activeScorecardEntry][`hole${hole}`].par, // Default score to par
                numPutts: 2,
                f: "F",
                g: "G",
                dtg: 1000,
                dth: 1000,
                fpm: 1000,
                // ...
                // Notes don't need to be entered
            };
        }
        setScorecardEntryData(scorecardData);
    }, [activeScorecardEntry]);

    useEffect(() => {
        let tempRounds = allRounds;
        console.log("tempRounds1",tempRounds)
        if (tempRounds.length > 0) {
            if (filters.includes(mostRecentRoundYear) && !filters.includes("All Years")) {
                for (let round of tempRounds) {
                    console.log("\n typeof round.date",typeof round.date)
                    console.log("round.date",round.date)
                    console.log("round.date",round.date.substring(round.date.length - 1, round.date.length))
                }
                tempRounds = tempRounds.filter(round => round.date && round.date.substring(round.date.length - 1, round.date.length) === mostRecentRoundYear.substring(mostRecentRoundYear.length - 1, mostRecentRoundYear));
            }
            if (filters.includes("Full Rounds")) {
                tempRounds = tempRounds.filter(round => round.fullFront9 && round.fullBack9);
            }
            setDisplayedRounds(tempRounds)
        }
        console.log("tempRounds2",tempRounds)
    }, [filters]);

    const handleSetYearFilter = (filter) => {
        const filterYear = parseInt(filter);
        if (filterYear >= 2022 && filterYear < 2100 && filterYear !== yearFilter) {
            const newRounds = [];
            for (let round of allRounds) {
                const yearSuffix = round.date.split("/")[2]
                if ((2000 + parseInt(yearSuffix)) == filterYear) {
                    newRounds.push(round);
                }
            }
            setDisplayedRounds(newRounds);
        } else {
            if (filter === "") {
                setDisplayedRounds(allRounds);
            }
        }
        setYearFilter(filterYear);
    }
    
    // console.log("activeScorecardEntry",activeScorecardEntry)
    // console.log("scorecardEntryData",scorecardEntryData)

    // Try to insert new user data
    // const createAccount = (newUserData) => {
    // }

    // const retrieveUserData = (userName, password) => {
    //     // Try to connect with username and password
    //         // If successful, rerieve all rounds
    // }

    const insertRound = (scorecardEntryData) => {
        // Insert data into Mongo for username and password
    }

    console.log("courseInfo",courseInfo)

    const importFile = (e) => {
        setIsLoading(true);

        const file = e.target.files[0];
    
        if (file) {
            const filetype = file.name.split('.')[file.name.split('.').length - 1];
            if (filetype !== 'xlsx') {
                console.log("NOT AN EXCEL FILE")
                return;
            }
        }
    
        const excel = new Excel.Workbook();
        const reader = new FileReader();
    
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
            const buffer = reader.result;
            excel.xlsx.load(buffer)
                .then(wkbk => {
                    let courseData = {
                        // Sample course data:
                        // andersonGlen: {
                            // hole1: {
                                // par: 4,
                                // distance: 300,
                                // handicap: 1
                            // },
                            // ...
                            // f9Par: 36,
                            // f9Yardage: 3000,
                            // b9Par: 36,
                            // b9Yardage: 3000,
                            // par: 72,
                            // yardage: 6000
                        // }
                    };
                    let workSheets = {};
                    for (let course of courses) {
                        workSheets[course.courseKey] = wkbk.getWorksheet(course.displayName);
                        if (!workSheets[course.courseKey]) {
                            console.log("Course name does not match worksheet");
                            return;
                        }
                        const workSheetData = workSheets[course.courseKey].getRow(2).values;
                        courseData[course.courseKey] = {};
                        courseData[course.courseKey].displayName = course.displayName;
                        let column = 2; // Data starts on line 2
                        for (let hole = 1; hole <= 18; hole++ ) {
                            courseData[course.courseKey][`hole${hole}`] = {};
                            courseData[course.courseKey][`hole${hole}`].hole = hole;
                            courseData[course.courseKey][`hole${hole}`].par = workSheetData[column];
                            courseData[course.courseKey][`hole${hole}`].distance = workSheetData[column + 1];
                            courseData[course.courseKey][`hole${hole}`].handicap = workSheetData[column + 2];

                            // F9/B9 Yardage and Par
                            if (hole <= 9) {
                                if (hole === 1) {
                                    courseData[course.courseKey].f9Par = workSheetData[column];
                                    courseData[course.courseKey].f9Yardage = workSheetData[column + 1];
                                } else {
                                    courseData[course.courseKey].f9Par += workSheetData[column];
                                    courseData[course.courseKey].f9Yardage += workSheetData[column + 1];
                                }
                            } else {
                                if (hole === 10) {
                                    courseData[course.courseKey].b9Par = workSheetData[column];
                                    courseData[course.courseKey].b9Yardage = workSheetData[column + 1];
                                } else {
                                    courseData[course.courseKey].b9Par += workSheetData[column];
                                    courseData[course.courseKey].b9Yardage += workSheetData[column + 1];
                                }
                            }
                            column = column + 7; // Skip empty columns
                        }

                        // Total par and yardages
                        courseData[course.courseKey].par = courseData[course.courseKey].f9Par + courseData[course.courseKey].b9Par;
                        courseData[course.courseKey].yardage = courseData[course.courseKey].f9Yardage + courseData[course.courseKey].b9Yardage;
                    }

                    let allPutts = [];
                    let allHoles = [];
                    let allRounds = [];
                    for (let course of courses) {
                        workSheets[course.courseKey].eachRow((row, rowNumber) => {
                            if (rowNumber > 3) { // Excel data starts on row 4
                                // Round data
                                const row = workSheets[course.courseKey].getRow(rowNumber).values;
                                let roundData = {
                                    // Round details
                                    sequence: parseInt(row[1].split("\n")[row[1].split("\n").length - 1]),
                                    key: `${course.courseKey}${rowNumber - 1}`,
                                    course: course.displayName,
                                    courseKey: course.courseKey,
                                    date: row[1].split("\n")[0],
                                    formattedDate: new Date(row[1].split("\n")[0]),
                                    scrambleRound: row[1].split("\n").includes("Scramble"),
                                    leagueRound: row[1].split("\n").includes("League"),
                                    numHoles: 0,
                                    // Round metrics
                                    f9Putts: 0,
                                    b9Putts: 0,
                                    putts: 0,
                                    f9PuttTotal: 0,
                                    b9PuttTotal: 0,
                                    out: 0,
                                    in: 0,
                                    total: 0,
                                    // DTG, FPM, DTH for averages
                                    dtgF9Total: 0,
                                    fpmF9Total: 0,
                                    dthF9Total: 0,
                                    dtgB9Total: 0,
                                    fpmB9Total: 0,
                                    dthB9Total: 0,
                                    // Cumulative scores
                                    numEagles: 0,
                                    numBirdies: 0,
                                    numPar: 0,
                                    numBogey: 0,
                                    numBogeyPlus: 0,
                                    // Total Score
                                    coursePar: 0,
                                    scoreToPar: 0
                                };

                                if (roundData.leagueRound) roundData.netScore = 0;

                                let columnCount = 2;
                                const holeCount =  workSheets[course.courseKey].getRow(3).values[65] === "Additional Hole #1 Course" ? 9 : 18; // Determine if 9/18 hole course
                                for (let hole = 1; hole <= holeCount ; hole++) {
                                    if (row[columnCount] && row[columnCount] !== "") {
                                        roundData.numHoles++;

                                        let score = (roundData.scrambleRound || (roundData.leagueRound && typeof row[columnCount] === 'string'))? parseInt(row[columnCount].split(", ")[0]) : row[columnCount];
                                        
                                        if (courseData[course.courseKey][`hole${hole}`].par >= score + 2) { // Eagle
                                            if (score === 1) roundData.aceRound = true;
                                            roundData.numEagles++;
                                        }
                                        if (courseData[course.courseKey][`hole${hole}`].par === score + 1) roundData.numBirdies++; // Birdie
                                        if (courseData[course.courseKey][`hole${hole}`].par === score) roundData.numPar++; // Par
                                        if (courseData[course.courseKey][`hole${hole}`].par === score - 1) roundData.numBogey++; // Bogey
                                        if (courseData[course.courseKey][`hole${hole}`].par <= score - 2) roundData.numBogeyPlus++; // Bogey Plus

                                        roundData.coursePar = roundData.coursePar + courseData[course.courseKey][`hole${hole}`].par;
                                        roundData.scoreToPar =  roundData.scoreToPar + score - courseData[course.courseKey][`hole${hole}`].par

                                        // console.log("typeof", parseInt(row[columnCount + 5].split(", ")[0]))
                                        // console.log("row[columnCount + 5]",row[columnCount + 5])

                                        if (typeof row[columnCount + 5] !== "number" && typeof parseInt(row[columnCount + 5].split(", ")[0]) !== "number") {
                                            console.log(`INVALID FPM VALUE FOR ROUND ${roundData.key} HOLE ${hole}`, parseInt(row[columnCount + 5].split(", ")[0]),"")
                                        }
                                        
                                        // Single hole data
                                        roundData[`hole${hole}`] = {
                                            score: score,
                                            putts: row[columnCount + 1],
                                            fir: row[columnCount + 2],
                                            gir: row[columnCount + 3],
                                            dtg: row[columnCount + 4],
                                            // dtg: typeof row[columnCount + 4] === "number" ? row[columnCount + 4] : parseInt(row[columnCount + 4].split(", ")[1]), // Uses number closest to green
                                            dth: typeof row[columnCount + 5] === "number" ? row[columnCount + 5] : parseInt(row[columnCount + 5].split(", ")[0]),
                                            // dth: row[columnCount + 5],
                                            puttLength: typeof row[columnCount + 5] === "number" ? row[columnCount + 5] : parseInt(row[columnCount + 5].split(", ")[row[columnCount + 5].split(", ").length - 1]),
                                            notes: row[columnCount + 6] ? row[columnCount + 6] : ""
                                        }

                                        if ((roundData.sequence > 8 || row[columnCount + 1] === 0 || row[columnCount + 1] === 1) && !roundData.scrambleRound && !roundData.leagueRound) {
                                            allPutts.push({
                                                round: `${course.courseKey}${rowNumber - 1}`,
                                                date: row[1].split("\n")[0],
                                                putts: row[columnCount + 1],
                                                dth: typeof row[columnCount + 5] === "number" ? row[columnCount + 5] : parseInt(row[columnCount + 5].split(", ")[0]),
                                                fpm: typeof row[columnCount + 5] === "number" ? row[columnCount + 5] : parseInt(row[columnCount + 5].split(", ")[1]),
                                                gir: roundData[`hole${hole}`].gir,
                                                scoreToPar: score - courseData[course.courseKey][`hole${hole}`].par
                                            });
                                        }

                                        // Scramble rounds
                                        if (roundData.scrambleRound) {
                                            roundData[`hole${hole}`].scrambleString = row[columnCount].split(", ")[1];
                                        }

                                        // League rounds
                                        if (roundData.leagueRound) {
                                            if (typeof row[columnCount] === 'string') {
                                                roundData.netScore = roundData.netScore + parseInt(row[columnCount].split(", ")[1]);
                                                roundData[`hole${hole}`].netScore = parseInt(row[columnCount].split(", ")[1]);
                                            } else {
                                                roundData.netScore = roundData.netScore + row[columnCount];
                                                roundData[`hole${hole}`].netScore = row[columnCount];
                                            }
                                        }

                                        // F9/B9 data
                                        if (hole < 10) {
                                            roundData.out = roundData.out + score;
                                            roundData.f9Putts = roundData.f9Putts + row[columnCount + 1];
                                            // // DTG, FPM, DTH totals for averages (DTG uses number closest to green)
                                            // roundData.dtgF9Total = roundData.dtgF9Total + (typeof row[columnCount + 4] === "number" ? row[columnCount + 4] : parseInt(row[columnCount + 4].split(", ")[1]));
                                            // roundData.fpmF9Total = roundData.fpmF9Total + (typeof row[columnCount + 5] === "number" ? row[columnCount + 5] : parseInt(row[columnCount + 5].split(", ")[row[columnCount + 5].split(", ").length - 1]));
                                            // roundData.dthF9Total = roundData.dthF9Total + (typeof row[columnCount + 5] === "number" ? row[columnCount + 5] : parseInt(row[columnCount + 5].split(", ")[0]));
                                        } else {
                                            roundData.in = roundData.in + score;
                                            roundData.b9Putts = roundData.b9Putts + row[columnCount + 1];
                                        }
                                        roundData.total = roundData.total + score;
                                        roundData.putts = roundData.putts + row[columnCount + 1];

                                        // CTP for Par 3's (first 8 rounds)
                                        const isPar3 = courseData[course.courseKey][`hole${hole}`].par === 3;
                                        if (
                                            isPar3 &&
                                            (row[columnCount + 3] === 'G' || row[columnCount + 3] === 'G-1') &&
                                            (roundData.sequence >= 9 || row[columnCount + 1] === 0 || row[columnCount + 1] === 1) // Started capturing DTH on 9th round of year, can still contribute if 0 or 1 putted
                                        ) {
                                            roundData[`hole${hole}`].dth = typeof row[columnCount + 5] === "number" ? row[columnCount + 5] : parseInt(row[columnCount + 5].split(", ")[0]);
                                        }
                                    }
                                    columnCount = columnCount + 7; // 7 more columns of data added
                                }

                                roundData.fullFront9 = roundData.hole1 && roundData.hole2 && roundData.hole3 && roundData.hole4 && roundData.hole5 && roundData.hole6 && roundData.hole7 && roundData.hole8 && roundData.hole9 ? true : false;
                                roundData.fullBack9 = roundData.hole10 && roundData.hole11 && roundData.hole12 && roundData.hole13 && roundData.hole14 && roundData.hole15 && roundData.hole16 && roundData.hole17 && roundData.hole18 ? true : false;
                                roundData.partialFront9 = !roundData.fullFront9 && (roundData.hole1 || roundData.hole2 || roundData.hole3 || roundData.hole4 || roundData.hole5 || roundData.hole6 || roundData.hole7 || roundData.hole8 || roundData.hole9) ? true : false;
                                roundData.partialBack9 = !roundData.fullBack9 && (roundData.hole10 || roundData.hole11 || roundData.hole12 || roundData.hole13 || roundData.hole14 || roundData.hole15 || roundData.hole16 || roundData.hole17 || roundData.hole18) ? true : false;

                                // Additional Holes
                                const additionalHoleCount = holeCount === 18 ? 128 : 65; // Determine which column additional holes are being recorded
                                if (row[additionalHoleCount]) { // First column for additional holes
                                    roundData.additionalHoles = {};
                                    let holeCount = 1;
                                    let columnCount = additionalHoleCount;
                                    for (let i = 0; i < 9; i++ ) {
                                        if (row[columnCount]) {
                                            roundData.additionalHoles[`additionalHole${holeCount}`] = {
                                                course: row[columnCount],
                                                courseKey: course.courseKey,
                                                scoreCardHoleAbbreviation: courses.find(course => course.displayName === row[columnCount]).scoreCardHoleAbbreviation,
                                                hole: row[columnCount + 1],
                                                score: row[columnCount + 2],
                                                putts: row[columnCount + 3],
                                                fir: row[columnCount + 4],
                                                gir: row[columnCount + 5],
                                                dtg: row[columnCount + 6],
                                                dth: typeof row[columnCount + 7] === "number" ? row[columnCount + 7] : parseInt(row[columnCount + 7].split(", ")[0]),
                                                puttLength: typeof row[columnCount + 7] === "number" ? row[columnCount + 7] : parseInt(row[columnCount + 7].split(", ")[row[columnCount + 7].split(", ").length - 1]),
                                                notes: row[columnCount + 8] ? row[columnCount + 8] : ""
                                            }
                                            columnCount = columnCount + 9;
                                            holeCount++;
                                        }
                                    }
                                }
    
                                // Cumulative data
                                setRoundYears(roundYears.push(roundData.formattedDate))

                                // console.log("roundData",roundData)
                                const fairways = calculateFairways(roundData);
                                roundData.fairways = fairways;
    
                                const greens = calculateGreens(roundData);
                                roundData.greens = greens;
    
                                const puttLengths = calculatePuttLengths(roundData);
                                roundData.puttLengthTotal = puttLengths.total;
                                roundData.puttLengthF9 = puttLengths.f9;
                                roundData.puttLengthB9 = puttLengths.b9;

                                const dthAndDtgTotals = calculateDthAndDtgTotals(roundData);
                                roundData.dthTotal = dthAndDtgTotals.dthTotals.total;
                                roundData.dthF9 = dthAndDtgTotals.dthTotals.f9;
                                roundData.dthB9 = dthAndDtgTotals.dthTotals.b9;
                                roundData.dtgTotal = dthAndDtgTotals.dtgTotals.total;
                                roundData.dtgF9 = dthAndDtgTotals.dtgTotals.f9;
                                roundData.dtgB9 = dthAndDtgTotals.dtgTotals.b9;

                                allRounds.push(roundData);
                            }
                        });
                    }

                    // Sort rounds by descending date
                    allRounds.sort(function(a, b){
                        const aDate = a.date.split('/');
                        const aYear = parseInt(aDate[2]);
                        const aMonth = parseInt(aDate[0]);
                        const aDay = parseInt(aDate[1]);

                        const bDate = b.date.split('/');
                        const bYear = parseInt(bDate[2]);
                        const bMonth = parseInt(bDate[0]);
                        const bDay = parseInt(bDate[1]);

                        let order = 0;
                        if (aYear > bYear) {
                            order = -1;
                        } else if (aYear === bYear) {
                            if (aMonth > bMonth) {
                                order = -1;
                            } else if (aMonth === bMonth) {
                                if (aDay > bDay) {
                                    order = -1;
                                }
                            }
                        }

                        return order
                    });


                    // Filter by yearFilter state
                    const displayedRounds = [];
                    if (typeof yearFilter === "number") {
                        for (let round of allRounds) {
                            const yearSuffix = round.date.split("/")[2]
                            if ((2000 + parseInt(yearSuffix)) == yearFilter) {
                                displayedRounds.push(round)
                            }
                        }
                    }

                    setCourseInfo(courseData);
                    setPuttingData(allPutts);
                    
                    // console.log("allRounds",allRounds)
                    setAllRounds(allRounds);
                    setDisplayedRounds(displayedRounds);
                    setTableSort({ method: 'formattedDate', order: 'descending' });
                });
            };
        setDisplayUploadButton(false);
        setIsLoading(false);
    }

    const displayDefaultPage = displayedRounds.length !== 0;

    const handleActivePageChange = (e = null) => {
        setActivePage(e && e.target && e.target.value ? e.target.value : "Golf Rounds");
    }

    const displayRoundDetails = (round) => {
        if (displaySubtable && activeRound.course === round.course && activeRound.key === round.key) {
            setActiveRound();
            setDisplaySubtable(false);
        } else {
            setActiveRound(round);
            setDisplaySubtable(true);
        }
    }

    const changeSortMethod = (method) => {
        let newSortOrder = 'ascending';
        let sortedRounds;
        if (method === tableSort.method) { // When sort method is already being used, switch to other order
            newSortOrder = tableSort.order === 'ascending' ? 'descending' : 'ascending';
            if (tableSort.order === 'ascending') { // Sort rounds descending
                if (method === 'fir') {
                    sortedRounds = displayedRounds.sort(function(a,b) {return (a.fairways.f < b.fairways.f) ? 1 : ((b.fairways.f < a.fairways.f) ? -1 : 0);} );
                } else if (method === 'gir') {
                    sortedRounds = displayedRounds.sort(function(a,b) {return (a.greens.g + a.greens.gur < b.greens.g + b.greens.gur) ? 1 : ((b.greens.g + b.greens.gur < a.greens.g + a.greens.gur) ? -1 : 0);} );
                } else {
                    sortedRounds = displayedRounds.sort(function(a,b) {return (a[method] < b[method]) ? 1 : ((b[method] < a[method]) ? -1 : 0);} );
                }
            } else { // Sort rounds ascending
                if (method === 'fir') {
                    sortedRounds = displayedRounds.sort(function(a,b) {return (a.fairways.f > b.fairways.f) ? 1 : ((b.fairways.f > a.fairways.f) ? -1 : 0);} );
                } else if (method === 'gir') {
                    sortedRounds = displayedRounds.sort(function(a,b) {return (a.greens.g + a.greens.gur > b.greens.g + b.greens.gur) ? 1 : ((b.greens.g + b.greens.gur > a.greens.g + a.greens.gur) ? -1 : 0);} );
                } else {
                    sortedRounds = displayedRounds.sort(function(a,b) {return (a[method] > b[method]) ? 1 : ((b[method] > a[method]) ? -1 : 0);} );
                }
            }
        } else { // New sort method selected
            if (method === 'fir') {
                sortedRounds = displayedRounds.sort(function(a,b) {return (a.fairways.f > b.fairways.f) ? 1 : ((b.fairways.f > a.fairways.f) ? -1 : 0);} );
            } else if (method === 'gir') {
                sortedRounds = displayedRounds.sort(function(a,b) {return (a.greens.g + a.greens.gur > b.greens.g + b.greens.gur) ? 1 : ((b.greens.g + b.greens.gur > a.greens.g + a.greens.gur) ? -1 : 0);} );
            } else {
                sortedRounds = displayedRounds.sort(function(a,b) {return (a[method] > b[method]) ? 1 : ((b[method] > a[method]) ? -1 : 0);} );
            }
        }
        setTableSort({ method, order: newSortOrder });
        console.log("sortedRounds",sortedRounds)
        setDisplayedRounds(sortedRounds);
    }

    const handleSetExpandSingleHoleMetric = (hole) => {
        if (expandSingleHoleMetric.expanded) {
            if (hole === expandSingleHoleMetric.hole) setExpandSingleHoleMetric({ hole: "", expanded: false });
            else setExpandSingleHoleMetric({ hole: hole, expanded: true });
        } else {
            setExpandSingleHoleMetric({ hole: hole, expanded: true });
        }
    }

    // console.log("scorecardEntryData",scorecardEntryData)
    // scorecardEntryData[`hole${hole}`] && scorecardEntryData[`hole${hole}`].numPutts && scorecardEntryData[`hole${hole}`].numPutts === 1

    const updateScorecardEntryData = (value, field, hole) => {
        setScorecardEntryData({
            ...scorecardEntryData,
            [`${hole}`]: {
                ...scorecardEntryData[hole],
                [`${field}`]: value
            }
        });
    }

    console.log("activeScorecardEntry",activeScorecardEntry)
    const submitScorecard = () => {
        console.log("scorecardEntryData being submitted:",scorecardEntryData)
  
        // // Reading our test file
        // const file = reader.readFile('../../GolfEdit.xlsx')
        
        // let data = []
        
        // const sheets = file.SheetNames
        
        // for(let i = 0; i < sheets.length; i++)
        // {
        // const temp = reader.utils.sheet_to_json(
        //         file.Sheets[file.SheetNames[i]])
        // temp.forEach((res) => {
        //     data.push(res)
        // })
        // }
        
        // Printing data
        // console.log(data)
        // const workbook = new Excel.Workbook();
        
        // const pathName = '../../GolfEdit.xlsx';
        // console.log("workbook",workbook)
        // workbook.xlsx.readFile(pathName).then(() => {

        //     const worksheet = workbook.getWorksheet(scorecardEntryData);
        //     worksheet.eachRow(function(row, rowNumber) {
        //         console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
        //         //Do whatever you want to do with this row like inserting in db, etc
        //     });
    
        
            // const c1 = ws.getColumn(1);
            
            // c1.eachCell(c => {
        
            //     console.log(c.value);
            // });
        
            // const c2 = ws.getColumn(2);
            
            // c2.eachCell(c => {
        
            //     console.log(c.value);
            // });
        // }).catch(err => {
        //     console.log(err.message);
        // });
            // .then(function() {
            //     const worksheet = workbook.getWorksheet(activeScorecardEntry);
            //     console.log("worksheet",worksheet)
            //     // worksheet.eachRow(function(row, rowNumber) {
            //     //     console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
            //     //     //Do whatever you want to do with this row like inserting in db, etc
            //     // });
            //     // for (let i = 4; i < 1000; i++) {
            //     //     const currentRow = worksheet.getRow(i)
            //     //     console.log("currentRow",currentRow)
            //     //     if
            //     //     row.getCell(1).value = "hello"; // A5's value set to 5

            //     // }
            //     // // var row = worksheet.getRow(5);
            //     // // row.getCell(1).value = 5; // A5's value set to 5
            //     // row.commit();
            //     // return workbook.xlsx.writeFile('new.xlsx');
            // })
        // Insert into Excel
        // const row = worksheet.addRow({id: 1, name: 'John Doe', age: 35});

        // Insert into mongo
        setScorecardEntryData({});
        handleActivePageChange();

    }

    const filterOptions = []
    const roundsSortedByDate = allRounds.length > 0 ? allRounds.sort(function(a, b){
        const aDate = a.date.split('/');
        const aYear = parseInt(aDate[2]);
        const aMonth = parseInt(aDate[0]);
        const aDay = parseInt(aDate[1]);

        const bDate = b.date.split('/');
        const bYear = parseInt(bDate[2]);
        const bMonth = parseInt(bDate[0]);
        const bDay = parseInt(bDate[1]);

        let order = 0;
        if (aYear > bYear) {
            order = -1;
        } else if (aYear === bYear) {
            if (aMonth > bMonth) {
                order = -1;
            } else if (aMonth === bMonth) {
                if (aDay > bDay) {
                    order = -1;
                }
            }
        }

        return order
    }) : null;
    // console.log("roundsSortedByDate",roundsSortedByDate)
    const mostRecentRoundDate = allRounds.length > 0 ? roundsSortedByDate[0].date.split("/") : [];
    const mostRecentRoundYear = `20${mostRecentRoundDate[2]}`;
    if (mostRecentRoundDate !== []) filterOptions.push(mostRecentRoundYear);
    filterOptions.push(
        'All Years',
        'Full Rounds'
    );
    
    const courseTourOptions = [
        "South Suburban",
        "Gilead Highlands",
        "Anderson Glen",
        "Signature Holes"
    ];

    const handleFilterChange = (event: SelectChangeEvent<typeof filters>) => {
        const { target: { value } } = event;
        setFilters(typeof value === 'string' ? value.split(',') : value);
    };

    const handleCourseTourChange = (event: SelectChangeEvent<typeof courseTours>) => {
        const { target: { value } } = event;
        setCourseTours(typeof value === 'string' ? value.split(',') : value);
    };

    // console.log("displayedRounds",displayedRounds)

    return (
		<div className="flexColumn alignCenter marginTopMedium marginBottomMassive golf">
			{/* <h1 className="serifFont marginBottomMedium">Golf</h1> */}
			{/* <h1 className="serifFont marginBottomMedium marginTopMedium">Golf</h1> */}

            {!displayUploadButton &&
                <div className="pageLinks">
                    {[
                        "Golf Rounds",
                        // "Anderson Glen",
                        // "Gilead Highlands",
                        "Metrics",
                        "Course Tour",
                        "Enter Scorecard"
                    ].map((page, i) => {
                        return <a key={i} onClick={() => setActivePage(page)} className={`pageLinkFont${page === activePage ? " active" : ""}`} className="marginRightLarge">{page}</a>
                    })}
                </div>
            }

            {/* Default Golf Rounds view */}
            {displayDefaultPage && activePage !== "Metrics" && activePage !== "Course Tour" && activePage !== "Enter Scorecard" &&
                <Table style={{ maxWidth: "80vw" }} className="golfTable">
                    <TableHead>
                        <TableRow className="flexRow">
                            <TableCell key={1} className="distribute10 altActionFont"><TextField id="standard-basic" defaultValue={yearFilter} label="Year" variant="standard" onChange={(e) => { 
                                // console.log("e.target.value",e.target.value)
                                // console.log("typeof e.target.value",typeof e.target.value)
                                // console.log("parseInt(e.target.value)",parseInt(e.target.value))
                                // if (parseInt(e.target.value) >= 2022 && 
                                //         parseInt(e.target.value) < 2100) {
                                //     setYearFilter(parseInt(e.target.value)) 
                                    handleSetYearFilter(e.target.value)
                                // }
                            }} /></TableCell>
                            <TableCell key={2} className={`distribute10 altActionFont ${tableSort.method === "formattedDate" ? tableSort.order === "ascending" || tableSort.order === "" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("formattedDate")}><h3>Date</h3></TableCell>
                            <TableCell key={3} className={`distribute10 altActionFont ${tableSort.method === "course" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("course")}><h3>Course</h3></TableCell>
                            <TableCell key={4} className={`distribute10 altActionFont ${tableSort.method === "total" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("total")}><h3>Score</h3></TableCell>
                            <TableCell key={5} className={`distribute10 altActionFont ${tableSort.method === "putts" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("putts")}><h3>Putts</h3></TableCell>
                            <TableCell key={6} className={`distribute10 altActionFont ${tableSort.method === "fir" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("fir")}><h3>FIR</h3></TableCell>
                            <TableCell key={7} className={`distribute10 altActionFont ${tableSort.method === "gir" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("gir")}><h3>GIR</h3></TableCell>
                            <TableCell key={8} className={`distribute10 altActionFont ${tableSort.method === "puttLengthTotal" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("puttLengthTotal")}><h3>Putt Length</h3></TableCell>
                            <TableCell key={9} className={`distribute10 altActionFont ${tableSort.method === "numBirdies" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("numBirdies")}><h3>Birdies</h3></TableCell>
                            <TableCell key={10} className={`distribute10 altActionFont ${tableSort.method === "numBogeyPlus" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("numBogeyPlus")}><h3>Bogey+</h3></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(activePage === "Golf Rounds" || activePage === "Anderson Glen" || activePage === "Gilead Highlands") && displayedRounds.map((round, i) => {
                            if ((activePage === "Golf Rounds" || activePage === round.course) && !round.partialFront9 && !round.partialBack9 && !round.scrambleRound && !round.additionalHoles) {
                                const roundTotalDisplay = round.scrambleRound ? `${round.total}*` : (round.fullFront9 || round.fullBack9) ? round.total : "DNF";
                                return (
                                    <>
                                        <TableRow className={round.aceRound ? `backgroundColorEagleRow ${displaySubtable && activeRound.course === round.course && activeRound.key === round.key ? " hideBorderBottom" : ""}` : `${displaySubtable && activeRound.course === round.course && activeRound.key === round.key ? " hideBorderBottom" : ""}`} key={i}>
                                            <TableCell key={1}><span className={round.aceRound ? "blackFont" : ""} onClick={() => displayRoundDetails(round)}>{displaySubtable && activeRound.course === round.course && activeRound.key === round.key ? "Collapse" : "Scorecard"}</span></TableCell>
                                            <TableCell key={2}>{round.date}</TableCell>
                                            <TableCell key={3}>{round.course}</TableCell>
                                            <TableCell key={4}>{roundTotalDisplay} <small className="marginBottomSmall paddingLeftExtraSmall">({round.scoreToPar > 0 ? `+${round.scoreToPar}` : round.scoreToPar < 0 ? round.scoreToPar : "E"})</small></TableCell>
                                            <TableCell key={5}>{round.putts}</TableCell>
                                            <TableCell key={6}>{round.fairways.f}</TableCell>
                                            <TableCell key={7}>{round.greens.g + round.greens.gur}</TableCell>
                                            <TableCell key={8}>{round.puttLengthTotal}</TableCell>
                                            <TableCell key={9}>{round.numBirdies + round.numEagles}</TableCell>
                                            <TableCell key={10}>{round.numBogeyPlus}</TableCell>
                                        </TableRow>
                                        {/* Scorecard */}
                                        {(displaySubtable && activeRound.course === round.course && activeRound.key === round.key) && 
                                            <TableRow key={`subTable${i}`}>
                                                <TableCell colSpan={"10"}>
                                                    {createScorecard(courseInfo, activeRound, expandScorecard, setExpandScorecard)}
                                                </TableCell>
                                            </TableRow>
                                        }
                                    </>
                                )
                            } else return null;
                        })}
                    </TableBody>
                </Table>
            }

            {/* Metrics */}
            {!displayUploadButton && activePage === "Metrics" &&
                <div className="marginTopMedium">
                    {/* {calculateStats(courseInfo, allRounds, puttingData)} */}
                    {calculateStats(courseInfo, allRounds, puttingData, displayedRounds)}
                </div>        
            }

            {/* Course Tour */}
            {!displayUploadButton && activePage === "Course Tour" &&
                <div className="flexColumn justifyCenter">
                    {/* Each hole summary, best score */}
                    {courseSummary(courseInfo, allRounds, expandSingleHoleMetric, handleSetExpandSingleHoleMetric, courseTours)}
                    {/* YouTube tour */}
                    {/* <iframe className="marginAuto" width="800" height="450" title="Course Tour" src="https://www.youtube.com/embed/8QFAY7l-TAg?autoplay=0&mute=1" /> */}
                </div>
            }

            {!displayUploadButton && activePage === "Enter Scorecard" &&
                <>
                    <div className="marginTopMedium marginBottomMedium">
                        <FormControl>
                            <InputLabel>Course</InputLabel>
                            <Select
                                id="courseSelection"
                                // value={courseSelection}
                                label="Course"
                                onChange={(e) => setActiveScorecardEntry(e.target.value)}
                                style={{width: "300px"}}
                            >
                                {/* Sort by display name */}
                                {courses.sort((a,b) => ((a.displayName > b.displayName) || a.display === pinnedCourse) ? 1 : ((b.displayName > a.displayName) || b.display === pinnedCourse) ? -1 : 0).map(course => { return (<MenuItem value={course.courseKey} key={course.courseKey}>{course.displayName}</MenuItem>)})}
                            </Select>
                        </FormControl>
                    </div>
                    {activeScorecardEntry !== "" &&
                        <div className="flexColumn alignCenter">
                            <div className="scoreCardEntry flexFlowRowWrap justifyCenter">
                                {Object.keys(courseInfo[activeScorecardEntry]).map(hole => {
                                    
                                    // for (let hole = 1; hole <= 18; hole++) {
                                    //     scorecardData[`hole${hole}`] = {
                                    //         score: activeScorecardEntry === "" ? 100 : courseInfo[activeScorecardEntry][`hole${hole}`].par, // Default score to par
                                    //         numPutts: 2,
                                    //         f: "f",
                                    //         g: "g",
                                    //         dtg: 1000,
                                    //         dth: 1000,
                                    //         ftm: 1000,
                                    //         // ...
                                    //     };
                                    // }

                                    if (hole.includes("hole")) {
                                        return (
                                            <div className="flexColumn marginTopExtraLarge marginRightLarge marginLeftLarge marginBottomExtraLarge">
                                                <h1>Hole {courseInfo[activeScorecardEntry][hole].hole}</h1>
                                                <h5 className="lighterFont">Par {courseInfo[activeScorecardEntry][hole].par} | {courseInfo[activeScorecardEntry][hole].distance} yds | {courseInfo[activeScorecardEntry][hole].hole} HDCP</h5>
                                                <div className="marginTopMedium flexFlowRowNoWrap justifySpaceBetween alignCenter">
                                                    <h3 className="marginRightLarge">Score</h3>
                                                    <div className="flexFlowRowNoWrap justifySpaceBetween alignCenter">
                                                        <RemoveCircle onClick={() => updateScorecardEntryData(scorecardEntryData[hole].score - 1, "score", hole)} />
                                                        <span className="marginLeftSmall marginRightSmall">{scorecardEntryData[hole].score}</span>
                                                        <AddCircle onClick={() => updateScorecardEntryData(scorecardEntryData[hole].score + 1, "score", hole)} />
                                                    </div>
                                                </div>
                                                <div className="flexFlowRowNoWrap justifySpaceBetween alignCenter marginTopMedium">
                                                    <h3 className="marginRightLarge">Putts</h3>
                                                    <div className="flexFlowRowNoWrap">
                                                        <LooksOne onClick={() => updateScorecardEntryData(1, "numPutts", hole)} className={`whiteFont${scorecardEntryData[hole].numPutts === 1 ? " selected" : ""}`} />
                                                        <LooksTwo onClick={() => updateScorecardEntryData(2, "numPutts", hole)} className={`whiteFont${scorecardEntryData[hole].numPutts === 2 ? " selected" : ""}`} />
                                                        <Looks3 onClick={() => updateScorecardEntryData(3, "numPutts", hole)} className={`whiteFont${scorecardEntryData[hole].numPutts === 3 ? " selected" : ""}`} />
                                                        <Looks4 onClick={() => updateScorecardEntryData(4, "numPutts", hole)} className={`whiteFont${scorecardEntryData[hole].numPutts === 4 ? " selected" : ""}`} />
                                                    </div>
                                                </div>
                                                {courseInfo[activeScorecardEntry][hole].par !== 3 ?
                                                    <div className="flexFlowRowNoWrap justifySpaceBetween alignCenter marginTopMedium">
                                                        <h3 className="marginRightLarge">FIR</h3>
                                                        <div className="flexFlowRowNoWrap">
                                                            <TurnSlightLeft onClick={() => updateScorecardEntryData("L", "f", hole)} className={`whiteFont${scorecardEntryData[hole].f === "L" ? " selected" : ""}`} />
                                                            <Check onClick={() => updateScorecardEntryData("F", "f", hole)} className={`whiteFont${scorecardEntryData[hole].f === "F" ? " selected" : ""}`} />
                                                            <TurnSlightRight onClick={() => updateScorecardEntryData("R", "f", hole)} className={`whiteFont${scorecardEntryData[hole].f === "R" ? " selected" : ""}`} />
                                                            <Close onClick={() => updateScorecardEntryData("X", "f", hole)} className={`whiteFont${scorecardEntryData[hole].f === "X" ? " selected" : ""}`} />
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className="flexRow justifySpaceBetween paddingTopMedium paddingBottomSmall"><span>—</span><span>—</span></div>
                                                }
                                                <div className="flexFlowRowNoWrap justifySpaceBetween alignCenter marginTopMedium">
                                                    <h3 className="marginRightLarge">GIR</h3>
                                                    <div className="flexFlowRowNoWrap">
                                                        <Check onClick={() => updateScorecardEntryData("G", "g", hole)} className={`whiteFont marginRightExtraLarge paddingRightExtraSmall${scorecardEntryData[hole].g === "G" ? " selected" : ""}`} />
                                                        <Close onClick={() => updateScorecardEntryData("X", "g", hole)} className={`whiteFont${scorecardEntryData[hole].g === "X" ? " selected" : ""}`} />
                                                    </div>
                                                </div>
                                                <TextField id="dtg" label="DTG" variant="standard" onChange={(e) => updateScorecardEntryData(e.target.value, "dtg", hole)} />
                                                <TextField id="dth" label="DTH" variant="standard" onChange={(e) => updateScorecardEntryData(e.target.value, "dth", hole)} />
                                                {/* <TextField id="fpm" label="FPM" variant="standard" onChange={(e) => updateScorecardEntryData(e.target.value, "fpm", hole)} /> */}
                                                <TextField id="notes" label="Notes" variant="standard" onChange={(e) => updateScorecardEntryData(e.target.value, "notes", hole)} />
                                            </div>
                                        );
                                    } else return null;
                                })}
                            </div>
                            <div className="width100Percent justifyCenter marginTopExtraLarge">
                                <button onClick={() => setDisplayHelpModal(true)} className="marginRightMedium">Help</button>
                                <button onClick={() => submitScorecard()}>Submit</button>
                            </div>
                        </div>
                    }
                </>
            }

            <Modal
                open={displayHelpModal}
                // onClose={() => setDisplayHelpModal(false)}
            >
                <div className="backgroundColorWhite flexColumn" style={{ margin: "25vh auto", width: "50%", padding: "16px", borderRadius: "8px" }}>
                    <h2 className="marginBottomMedium strongFont">Scorecard help</h2>
                    <p className="flexColumn">
                        <span className="marginBottomMedium"><b>DTG:</b> Distance to Green. After a tee shot, enter distance to green remaining (avoid values over 250 yards unless the green is hit on the next shot). For Par 5's, enter 2 values separated by a comma and a space. Example: "250, 75"</span>
                        <span className="marginBottomMedium"><b>DTH:</b> Distance to Hole. Once putting, enter distance (in increments of 3 feet until approach shot is within 3 feet) to the hole and number of feet of putt made separated by a comma and a space. Example: "39, 6"</span>
                        <span className="marginBottomMedium"><b>Notes:</b> Enter any miscues or shot selections, separated by a comma and a space. Example: "LB, BR, 3P"</span>
                        <b>Notes examples:</b>
                        <table className="marginLeftMedium">
                            <tr><td style={{ width: "36px" }}>BB:</td><td>Breakfast ball</td></tr>
                            <tr><td>M:</td><td>Mulligan</td></tr>
                            <tr><td>T:</td><td>Topped drive</td></tr>
                            <tr><td>LB:</td><td>Lost ball</td></tr>
                            <tr><td>P:</td><td>Punch shot</td></tr>
                            <tr><td>S:</td><td>Sand shot</td></tr>
                            <tr><td>CC:</td><td>Double chip</td></tr>
                            <tr><td>CCC:</td><td>Triple chip</td></tr>
                            <tr><td>BR:</td><td>Bump and run</td></tr>
                            <tr><td>2BR:</td><td>Double bump and run</td></tr>
                            <tr><td>3P:</td><td>3 putt</td></tr>
                            <tr><td>4P:</td><td>4 putt</td></tr>
                            {/* <tr><td></td><td></td></tr> */}
                        </table>
                    </p>
                </div>
            </Modal>

            {!displayUploadButton && activePage !== "Enter Scorecard" && activePage !== "Course Tour" &&
                <div className="filterDropdownContainer margin0Auto justifyCenter">
                    <FormControl sx={{ m: 1, width: 300 }} variant="filled">
                        <InputLabel id="demo-multiple-checkbox-label">Select Filters</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={filters}
                            onChange={handleFilterChange}
                            renderValue={(selected) => selected.join(', ')}
                        >
                            {filterOptions.map((filter) => (
                                <MenuItem key={filter} value={filter}>
                                    <Checkbox checked={filters.indexOf(filter) > -1} />
                                    <ListItemText primary={filter} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            }

            {!displayUploadButton && activePage === "Course Tour" &&
                <div className="filterDropdownContainer width100Percent justifyCenter">
                    <FormControl sx={{ m: 1, width: 300 }} variant="filled">
                        <InputLabel id="demo-multiple-checkbox-label">Select Filters</InputLabel>
                        <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={courseTours}
                            onChange={handleCourseTourChange}
                            renderValue={(selected) => selected.join(', ')}
                        >
                            {courseTourOptions.map((courseTour) => (
                                <MenuItem key={courseTour} value={courseTour}>
                                    <Checkbox checked={courseTours.indexOf(courseTour) > -1} />
                                    <ListItemText primary={courseTour} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            }

            {/* Helper Text */}
            {displayUploadButton &&
                <>
                    <span className="massiveFont marginTopMassive paddingTopMassive">There is currently no data to display. Please upload stats below.</span>
                    <div className="flexRow marginTopMassive">
                        <div className="sectionBorder">
                            <h1>Enter Scorecards</h1>
                            <img src={scorecard} style={{ width: "400px" }} className="marginTopSmall" alt="Scorecard" />
                        </div>
                        <div className="sectionBorder">
                            <h1>Hole History</h1>
                            <img src={singleHoleMetrics} style={{ width: "400px" }} className="marginTopSmall" alt="Single Hole Metrics" />
                        </div>
                        <div className="sectionBorder">
                            <h1>Overall Metrics</h1>
                            <img src={metrics} style={{ width: "500px" }} className="marginTopSmall" alt="Single Hole Metrics" />
                        </div>
                    </div>
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="marginTopMassive massiveButton"
                    >
                        Upload Golf Stats
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        hidden
                        onChange={importFile}
                    />
                </>
            }

            {/* Loader */}
            {isLoading && <div><CircularProgress /></div>}
		</div>
    )
}

export default Golf;