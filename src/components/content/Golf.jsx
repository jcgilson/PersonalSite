import React, { useState, useEffect, useRef } from "react";
// MUI
import { Modal } from '@mui/material';
// Components
// import Map from './Map';
// MUI
import {
    Table, TableHead, TableBody, TableRow, TableCell, Radio, RadioGroup, FormControl, FormControlLabel, CircularProgress
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// CSS
import "../common/shared.css"
// Helpers
import {
    calculateFairways, calculateGreens, calculatePuttLength, createScorecard, calculateStats, courseSummary
} from "./helpers/GolfFormatHelper";

const Excel = require('exceljs');

const Golf = () => {

    /**
     * TODO
     * 
     * Find all instances of array of 2 courses and make into CONST file
     * 
     * Features:
     * Avg DTG/FPM/DTM
     * Scramble shots off tee/putt/approach
     * Include additional holes in single hole metrics
     * 
     * 
     */

    const [displayUploadButton, setDisplayUploadButton] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [allRounds, setAllRounds] = useState([]);
    const [courseInfo, setCourseInfo] = useState({});
    const [activeTable, setActiveTable] = useState('Summary');
    const [tableSort, setTableSort] = useState({ method: 'formattedDate', order: 'ascending' });
    const [activeRound, setActiveRound] = useState({});
    const [displaySubtable, setDisplaySubtable] = useState(false);
    const [expandScorecard, setExpandScorecard] = useState(false);
    const [expandSingleHoleMetric, setExpandSingleHoleMetric] = useState({ hole: "", expanded: false })

    const fileInputRef = useRef(null);

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
                    const andersonGlen = wkbk.getWorksheet('Anderson Glen');
                    const gileadHighlands = wkbk.getWorksheet('Gilead Highlands');

                    // Course Info
                    const andersonGlenCourseData = andersonGlen.getRow(40).values;
                    const gileadHighlandsCourseData = gileadHighlands.getRow(40).values;

                    let formattedAndersonGlenData = {}
                    let formattedGileadHighlandsData = {}
                    let column = 2; // Data starts in column 2

                    for (let hole = 1; hole <= 18; hole++ ) {
                        formattedAndersonGlenData[`hole${hole}`] = {};
                        formattedAndersonGlenData[`hole${hole}`].par = andersonGlenCourseData[column];
                        formattedAndersonGlenData[`hole${hole}`].distance = andersonGlenCourseData[column + 1];
                        formattedAndersonGlenData[`hole${hole}`].handicap = andersonGlenCourseData[column + 2];

                        formattedGileadHighlandsData[`hole${hole}`] = {};
                        formattedGileadHighlandsData[`hole${hole}`].par = gileadHighlandsCourseData[column];
                        formattedGileadHighlandsData[`hole${hole}`].distance = gileadHighlandsCourseData[column + 1];
                        formattedGileadHighlandsData[`hole${hole}`].handicap = gileadHighlandsCourseData[column + 2];

                        // F9/B9 Yardage and Par
                        if (hole <= 9) {
                            if (hole === 1) {
                                formattedAndersonGlenData.f9Par = andersonGlenCourseData[column];
                                formattedAndersonGlenData.f9Yardage = andersonGlenCourseData[column + 1];
                                formattedGileadHighlandsData.f9Par = gileadHighlandsCourseData[column];
                                formattedGileadHighlandsData.f9Yardage = gileadHighlandsCourseData[column + 1];
                            } else {
                                formattedAndersonGlenData.f9Par += andersonGlenCourseData[column];
                                formattedAndersonGlenData.f9Yardage += andersonGlenCourseData[column + 1];
                                formattedGileadHighlandsData.f9Par += gileadHighlandsCourseData[column];
                                formattedGileadHighlandsData.f9Yardage += gileadHighlandsCourseData[column + 1];
                            }
                        } else {
                            if (hole === 10) {
                                formattedAndersonGlenData.b9Par = andersonGlenCourseData[column];
                                formattedAndersonGlenData.b9Yardage = andersonGlenCourseData[column + 1];
                                formattedGileadHighlandsData.b9Par = gileadHighlandsCourseData[column];
                                formattedGileadHighlandsData.b9Yardage = gileadHighlandsCourseData[column + 1];
                            } else {
                                formattedAndersonGlenData.b9Par += andersonGlenCourseData[column];
                                formattedAndersonGlenData.b9Yardage += andersonGlenCourseData[column + 1];
                                formattedGileadHighlandsData.b9Par += gileadHighlandsCourseData[column];
                                formattedGileadHighlandsData.b9Yardage += gileadHighlandsCourseData[column + 1];
                            }
                        }

                        // Total par and yardages
                        formattedAndersonGlenData.par = formattedAndersonGlenData.f9Par + formattedAndersonGlenData.b9Par;
                        formattedAndersonGlenData.yardage = formattedAndersonGlenData.f9Yardage + formattedAndersonGlenData.b9Yardage;
                        formattedGileadHighlandsData.par = formattedGileadHighlandsData.f9Par + formattedGileadHighlandsData.b9Par;
                        formattedGileadHighlandsData.yardage = formattedGileadHighlandsData.f9Yardage + formattedGileadHighlandsData.b9Yardage;

                        column = column + 7; // Skip empty columns
                    }

                    const courses = [andersonGlen, gileadHighlands];
                    let allRounds = []
                    for (let course in courses) {
                        courses[course].eachRow((row, rowNumber) => {
                            if (rowNumber > 1 && rowNumber < 39) { // Excel data starts on row 2
                                const row = courses[course].getRow(rowNumber).values;
                                // console.log("row",row)
                                let roundData = {
                                    key: courses[course].name === "Anderson Glen" ? `andersonGlen${rowNumber - 1}` : `gileadHighlands${rowNumber - 1}`,
                                    course: courses[course].name,
                                    courseKey: courses[course].name === "Anderson Glen" ? "andersonGlen" : "gileadHighlands",
                                    date: row[1].split("\n")[0],
                                    formattedDate: new Date(row[1].split("\n")[0]),
                                    sequence: parseInt(row[1].split("\n")[row[1].split("\n").length - 1]),
                                    scrambleRound: row[1].split("\n").includes("Scramble"),
                                    numHoles: 0,
                                    f9Putts: 0,
                                    b9Putts: 0,
                                    putts: 0,
                                    f9PuttTotal: 0,
                                    b9PuttTotal: 0,
                                    out: 0,
                                    in: 0,
                                    total: 0,
                                    numEagles: 0,
                                    numBirdies: 0,
                                    numPar: 0,
                                    numBogey: 0,
                                    numBogeyPlus: 0
                                };

                                let columnCount = 2;
                                for (let hole = 1; hole <= 18; hole++ ) {
                                    if (row[columnCount]) {
                                        roundData.numHoles++;

                                        let score = roundData.scrambleRound ? parseInt(row[columnCount].split(", ")[0]) : row[columnCount];
                                        
                                        if (courses[course].name === "Anderson Glen") {
                                            if (formattedAndersonGlenData[`hole${hole}`].par >= score + 2) roundData.numEagles++; // Eagle
                                            if (formattedAndersonGlenData[`hole${hole}`].par === score + 1) roundData.numBirdies++; // Birdie
                                            if (formattedAndersonGlenData[`hole${hole}`].par === score) roundData.numPar++; // Par
                                            if (formattedAndersonGlenData[`hole${hole}`].par === score - 1) roundData.numBogey++; // Bogey
                                            if (formattedAndersonGlenData[`hole${hole}`].par <= score - 2) roundData.numBogeyPlus++; // Bogey Plus
                                        } else {
                                            if (formattedGileadHighlandsData[`hole${hole}`].par >= score + 2) roundData.numEagles++; // Eagle
                                            if (formattedGileadHighlandsData[`hole${hole}`].par === score + 1) roundData.numBirdies++; // Birdie
                                            if (formattedGileadHighlandsData[`hole${hole}`].par === score) roundData.numPar++; // Par
                                            if (formattedGileadHighlandsData[`hole${hole}`].par === score - 1) roundData.numBogey++; // Bogey
                                            if (formattedGileadHighlandsData[`hole${hole}`].par <= score - 2) roundData.numBogeyPlus++; // Bogey Plus    
                                        }

                                        roundData[`hole${hole}`] = {
                                            score: score,
                                            putts: row[columnCount + 1],
                                            fir: row[columnCount + 2],
                                            gir: row[columnCount + 3],
                                            dtg: row[columnCount + 4],
                                            dth: typeof row[columnCount + 5] === "number" ? row[columnCount + 5] : parseInt(row[columnCount + 5].split(", ")[0]),
                                            puttLength: typeof row[columnCount + 5] === "number" ? row[columnCount + 5] : parseInt(row[columnCount + 5].split(", ")[row[columnCount + 5].split(", ").length - 1]),
                                            notes: row[columnCount + 6] ? row[columnCount + 6] : ""
                                        }

                                        if (row[1].split("\n").includes("Scramble")) {
                                            roundData[`hole${hole}`].scrambleString = row[columnCount].split(", ")[1];
                                        }

                                        if (hole < 10) {
                                            roundData.out = roundData.out + score;
                                            roundData.f9Putts = roundData.f9Putts + row[columnCount + 1];
                                        } else {
                                            roundData.in = roundData.in + score;
                                            roundData.b9Putts = roundData.b9Putts + row[columnCount + 1];
                                        }
                                        roundData.total = roundData.total + score;
                                        roundData.putts = roundData.putts + row[columnCount + 1];

                                        // CTP for Par 3's (first 8 rounds)
                                        const isPar3 = courses[course].name === "Anderson Glen" ? formattedAndersonGlenData[`hole${hole}`].par === 3 : formattedGileadHighlandsData[`hole${hole}`].par === 3;
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

                                // Additional Holes
                                if (row[128]) { // First column for additional holes
                                    roundData.additionalHoles = {};
                                    let holeCount = 1;
                                    let columnCount = 128;
                                    for (let i = 0; i < 9; i++ ) {
                                        if (row[columnCount]) {
                                            roundData.additionalHoles[`additionalHole${holeCount}`] = {
                                                course: row[columnCount],
                                                courseKey: row[columnCount] === "Anderson Glen" ? "andersonGlen" : "gileadHighlands",
                                                scoreCardHoleAbbreviation: row[columnCount] === "Anderson Glen" ? "AG" : "GH",
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
                                    console.log("roundData.additionalHoles",roundData.additionalHoles)
                                }

    
                                const fairways = calculateFairways(roundData);
                                roundData.fairways = fairways;
    
                                const greens = calculateGreens(roundData);
                                roundData.greens = greens;
    
                                const puttLength = calculatePuttLength(roundData);
                                roundData.puttLength = puttLength;
    
                                allRounds.push(roundData);
                            }
                        });
                    }

                    setCourseInfo({
                        andersonGlen: formattedAndersonGlenData,
                        gileadHighlands: formattedGileadHighlandsData
                    });

                    allRounds.sort(function(a,b) {return (a.sequence > b.sequence) ? 1 : ((b.sequence > a.sequence) ? -1 : 0);} );
                    setAllRounds(allRounds);
                });
        };
        setDisplayUploadButton(false);
        setIsLoading(false);
    }

    console.log("courseinfo",courseInfo)

    const displayDefaultTable = allRounds.length !== 0;

    const handleActiveTableChange = (e) => {
        setActiveTable(e.target.value)
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
                    sortedRounds = allRounds.sort(function(a,b) {return (a.fairways.f < b.fairways.f) ? 1 : ((b.fairways.f < a.fairways.f) ? -1 : 0);} );
                } else if (method === 'gir') {
                    sortedRounds = allRounds.sort(function(a,b) {return (a.greens.g + a.greens.gur < b.greens.g + b.greens.gur) ? 1 : ((b.greens.g + b.greens.gur < a.greens.g + a.greens.gur) ? -1 : 0);} );
                } else {
                    sortedRounds = allRounds.sort(function(a,b) {return (a[method] < b[method]) ? 1 : ((b[method] < a[method]) ? -1 : 0);} );
                }
            } else { // Sort rounds ascending
                if (method === 'fir') {
                    sortedRounds = allRounds.sort(function(a,b) {return (a.fairways.f > b.fairways.f) ? 1 : ((b.fairways.f > a.fairways.f) ? -1 : 0);} );
                } else if (method === 'gir') {
                    sortedRounds = allRounds.sort(function(a,b) {return (a.greens.g + a.greens.gur > b.greens.g + b.greens.gur) ? 1 : ((b.greens.g + b.greens.gur > a.greens.g + a.greens.gur) ? -1 : 0);} );
                } else {
                    sortedRounds = allRounds.sort(function(a,b) {return (a[method] > b[method]) ? 1 : ((b[method] > a[method]) ? -1 : 0);} );
                }
            }
        } else { // New sort method selected
            if (method === 'fir') {
                sortedRounds = allRounds.sort(function(a,b) {return (a.fairways.f > b.fairways.f) ? 1 : ((b.fairways.f > a.fairways.f) ? -1 : 0);} );
            } else if (method === 'gir') {
                sortedRounds = allRounds.sort(function(a,b) {return (a.greens.g + a.greens.gur > b.greens.g + b.greens.gur) ? 1 : ((b.greens.g + b.greens.gur > a.greens.g + a.greens.gur) ? -1 : 0);} );
            } else {
                sortedRounds = allRounds.sort(function(a,b) {return (a[method] > b[method]) ? 1 : ((b[method] > a[method]) ? -1 : 0);} );
            }
        }
        setTableSort({ method, order: newSortOrder });
        setAllRounds(sortedRounds);
    }

    const handleSetExpandSingleHoleMetric = (hole) => {
        if (expandSingleHoleMetric.expanded) {
            if (hole === expandSingleHoleMetric.hole) setExpandSingleHoleMetric({ hole: "", expanded: false });
            else setExpandSingleHoleMetric({ hole: hole, expanded: true });
        } else {
            setExpandSingleHoleMetric({ hole: hole, expanded: true });
        }
    }

    return (
		<div className="flexColumn alignCenter marginTopMedium marginBottomMassive golf">
			{/* <h1 className="serifFont marginBottomMedium">Golf</h1> */}
			<h1 className="serifFont marginBottomMedium marginTopMedium">Golf</h1>

            {!displayUploadButton &&
                <FormControl>
                    <RadioGroup row defaultValue={activeTable} onChange={handleActiveTableChange}>
                        {["Summary", "Anderson Glen", "Gilead Highlands", "Metrics", "Course Tour"].map((tab, i) => {
                            return <FormControlLabel key={i} control={<Radio color="default" />} value={tab} label={tab} className="marginRightLarge" />
                        })}
                    </RadioGroup>
                </FormControl>
            }

            {/* Default summary view */}
            {displayDefaultTable && activeTable !== "Metrics" && activeTable !== "Course Tour" &&
                <Table style={{ maxWidth: "80vw" }} className="golfTable">
                    <TableHead>
                        <TableRow className="flexRow">
                            <TableCell key={1} className="distribute10 altActionFont"></TableCell>
                            <TableCell key={2} className={`distribute10 altActionFont ${tableSort.method === "formattedDate" ? tableSort.order === "ascending" || tableSort.order === "" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("formattedDate")}><h3>Date</h3></TableCell>
                            <TableCell key={3} className={`distribute10 altActionFont ${tableSort.method === "course" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("course")}><h3>Course</h3></TableCell>
                            <TableCell key={4} className={`distribute10 altActionFont ${tableSort.method === "total" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("total")}><h3>Score</h3></TableCell>
                            <TableCell key={5} className={`distribute10 altActionFont ${tableSort.method === "putts" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("putts")}><h3>Putts</h3></TableCell>
                            <TableCell key={6} className={`distribute10 altActionFont ${tableSort.method === "fir" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("fir")}><h3>FIR</h3></TableCell>
                            <TableCell key={7} className={`distribute10 altActionFont ${tableSort.method === "gir" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("gir")}><h3>GIR</h3></TableCell>
                            <TableCell key={8} className={`distribute10 altActionFont ${tableSort.method === "puttLength" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("puttLength")}><h3>Putt Length</h3></TableCell>
                            <TableCell key={9} className={`distribute10 altActionFont ${tableSort.method === "numBirdies" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("numBirdies")}><h3>Birdies</h3></TableCell>
                            <TableCell key={10} className={`distribute10 altActionFont ${tableSort.method === "numBogeyPlus" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("numBogeyPlus")}><h3>Bogey+</h3></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(activeTable === "Summary" || activeTable === "Anderson Glen" || activeTable === "Gilead Highlands") && allRounds.map((round, i) => {
                            if (activeTable === "Summary" || activeTable === round.course) {
                                const roundTotalDisplay = round.scrambleRound ? `${round.total}*` : (round.fullFront9 || round.fullBack9) ? round.total : "DNF";
                                return (
                                    <>
                                        <TableRow key={i}>
                                            <TableCell key={1}><a onClick={() => displayRoundDetails(round)}>{displaySubtable && activeRound.course === round.course && activeRound.key === round.key ? "Collapse" : "Scorecard"}</a></TableCell>
                                            <TableCell key={2}>{round.date}</TableCell>
                                            <TableCell key={3}>{round.course}</TableCell>
                                            <TableCell key={4}>{roundTotalDisplay}</TableCell>
                                            <TableCell key={5}>{round.putts}</TableCell>
                                            <TableCell key={6}>{round.fairways.f}</TableCell>
                                            <TableCell key={7}>{round.greens.g + round.greens.gur}</TableCell>
                                            <TableCell key={8}>{round.puttLength}</TableCell>
                                            <TableCell key={9}>{round.numBirdies}</TableCell>
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
                            }
                        })}
                    </TableBody>
                </Table>
            }

            {/* Metrics */}
            {!displayUploadButton && activeTable === "Metrics" &&
                <div className="marginTopMedium">
                    {calculateStats(courseInfo, allRounds)}
                </div>        
            }

            {/* Course Tour */}
            {!displayUploadButton && activeTable === "Course Tour" &&
                <div className="flexColumn justifyCenter">
                    {/* Each hole summary, best score */}
                    {courseSummary(courseInfo, allRounds, expandSingleHoleMetric, handleSetExpandSingleHoleMetric)}
                    {/* YouTube tour */}
                    <iframe className="marginAuto" width="800" height="450" src="https://www.youtube.com/embed/8QFAY7l-TAg?autoplay=0&mute=1" />
                </div>
            }

            {displayUploadButton &&
                <>
                    <span className="massiveFont marginTopMassive paddingTopMassive">There is currently no data to display. Please upload stats below.</span>
                    <button
                        onClick={() => fileInputRef.current.click()}
                        style={{ backgroundColor: 'black', position: 'fixed', bottom: '24px', left: '24px', borderRadius: '48px', padding: '8px', height: '64px', width: '64px' }}
                        className="boxShadowMedium whiteFont smallFont"
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

            {isLoading && <div><CircularProgress /></div>}
		</div>
    )
}

export default Golf;