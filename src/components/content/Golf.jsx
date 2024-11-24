import React, { useState, useEffect, useRef } from "react";
// MUI
// import { Modal } from '@mui/material';
// Components
// import Map from './Map';
// MUI
import {
    Table, TableHead, TableBody, TableRow, TableCell, Radio, RadioGroup, FormControl, FormControlLabel, CircularProgress, TextField,
    InputLabel, MenuItem, Select, OutlinedInput, ListItemText, Checkbox, Modal, Paper, Popover, Slide, Button, Card, CardContent
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Check, Close, TurnSlightLeft, TurnSlightRight, LooksOne, LooksTwo, Looks3, Looks4, RemoveCircle, AddCircle, RoomRounded, PushPin, TryRounded } from '@mui/icons-material';
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
import { ConstructionOutlined } from "@mui/icons-material";
// C:\Users\Jack Gilson\ReactProjects\my-app\src\components\content\Golf.jsx
const Excel = require('exceljs');
// const reader = require('xlsx');


const Golf = () => {

    /**
     * TODO
     * 
     * Find all instances of array of 2 Blackledge courses and make into CONST file
     * 
     * Features:
     * Avg DTG/FPM/DTM
     * Scramble shots off tee/putt/approach
     * Include additional holes in single hole metrics
     * Percent of Sand shots still in sand & sand shots DTH/DTG
     * 
     * **Map of all courses played with coordinates
     * legacy scorecards
     * 
     * 
     * Store "notable" legacy rounds to filter
     * 
     * Clickable course info by golf table
     * 
     * 
     * Handicap variance after each round 0.2->0.4->+0.1 - will be more strict about entering scores each time (more accurate and accountability to only post good scores)
     * 
     * 
     * ******** Set up feature for FIR to take in L12, as in a number will indicate how many yards off the fair are you. Can begin next GHIN season (March 15th)
     * 
     * 
     * Establish a list of features from above and compile with list from phone to determine which is the best one to get ready for next GHIN season
     * Priority:             1 = ASAP        5 = Backlog     10 = Do later
     * T-Shirt Sizing:       S = Small       M = Medium      L = Large 
     * 
     * ASAP ASAP ASAP Need to move code to other laptop
     * 
     * 
     * 1-M: Archived features
     *          Description: (add "Settings" feature for which stats to be included for current user. Based on upload, if you use document list of switchs )
     *          Settings: can control archived features *which is a great idea
     * 5-M: FIR L/F/R attribute should be stat displayed somethere
     *          Simliar to how individual holes show a stat for FIR L/F/R and scores for left miss vs right, show this is a flow state
     *          Get rid on sankey graph (not working) and create visual to illustrate hole
     *          Reference swing thoughts to book & copy phrases
     * 
     * 
     * Golf book notes
     *          
     * 
     * ADD COMPONENTS - YOU NEED TO MODULARIZE YOUR CODE
     * 
     * Build container functions similar to global.css (most similar to )
     * 
     * Index of all features in the app
     * 
     * 
     * Go through all images on phone
     * 
     * 
     * Need to work on Par 3 scoring average is at 3.26 - could this be a part of "works in progress?"
     * 
     * 
     * 
     * 
     * 
     * Need to publish this site
     * Need to connect to mongo and not have to use Excel - migrate all legacy data, can probably translate with a Anaconda PY code editing tool (could be on other laptop)
     * 
     * 
     * ASAP ASAP ASAP Need to move code to other laptop
     * 
     * 
     * Add environment variable (DEV_MODE=true, default to false when not being passed, in case of deploy)
     * Controls display of new page: "advanced settings" containing Feature Index (defined above)
     *          This can just be a card coded HTML page (should be it's own component)
     *          Break these notes into tabs - these will be for each site (below .ENV variable): Golf, Coins
     * Environment variable will be a few options "World of Jack" (Taylor came up with this name), "Gilson Golfs", "Coins" ----- need to add coin page
     *          Has helped me find purpose, can reflect on the best things in life (part of vows?) Need to illustrate how beautiful life is and website is the vehicle to reflection and self fulfillment for me
     * All code can still live in one codebase but published as different sites
     * ENV will control which actions are visible in advanced settings
     * Default site "configuration" (now being called settings) may be starting initial state for settings page toggles/archived features
     * 
     * 
     * * Before reading below - make more sense to break these into different apps? One for golf and one for world of jack - these two sites should link back and fourth (On golf site, Created by "World of Jack")
     *          Link to LinkedIN porfile? or share a post with network? "It's not a portfolio site, but you get an idea of my abilities."
     *          
     * Make Coins page - Before documenting coins, create WF's for UI page
     * 
     * Make Finances page - similar to "displayed rounds", have page to illustrate expense in each category, graphs for growth of each fund
     *              Money timeline? Robinhood (deposited $3k Aug 2024)
     *              Instead of conditional formatting, color code a pie chart with assets in each category
     * Pie chart for Budgeting each year
     * Have sliders to make budget dynamic
     * Fun category
     *      + Add Expense button to pie chart
     * 
     * Wish list page with sliders
     *      If 10% of budget should go towards
     *      Add links to items on amazon (embed listings <iframe/> into page?)

     *      Housing decorations budget:
     *              $500 or X per year
     *              New chairs, items are "weighted" based on tandem of rating factors:
     *                  *Sorted by price
     *                  "Want vs need" factor, 1 = want, 10 = need
     *                  "Turndogs" or "Zoomies" rating, based on how important it is to you (Tooltip note: "Note: this rating is sacred, and must be weighted conservatively. Use caution, and pick your battles")
     * 
     *       Implementation detail: Supply a list of links (copied from prime)
     *       Add prompt for wishlist items that have not entered "rating factor"
     *              This gets saved locally, if this item does not have "rating factors" saved, it automatically asks users to enter a few questions (above)
     *              
     * 
     * Coding block example to control budget initial values
     * 
     * (These values could derive from mongo as a user profile data point), populated on UI and published to DB with edits
     * CONSTS for now, convert to ***Finances DB***
     * Annual Financial Summary entries (Can be it's own tab - make visible for each year instead of just all on one sheet)
     * 
     * year *primary key
     * finances CONSTS: 
     *      ATTRIBUTES = {
     *          keyName: "k401",
     *          displayName: "401(k)"
     *      }
     * 
     * income = X
     * deductions = 10%
     * 401(k) Contribution = 10%
     * taxed = 24%
     * 
     * **Feature note: Before converting to DB, need to make every column number instead of currency format
     * Assets: {
     *      k401: "100000"
     *      robinhood: "10000"
     * }
     * 
     * Ability to compare ach year and see which assets grew the most in a year
     * "Annual review section for each year"
     * Ability to compare 2 years side by side
     * In WF, ensure all components can be segregated in to L/R halves of screen
     * 
     * Finance sections on page: annual summaries row (similar to golf) Saved X number of dollars
     *      Row expansion subcomponent (or individual year tab) can display the following features:
     *              Bar graph (experiment timeline component) with toggle for "current savings" and "cumulative savings" (all time)
     * 
     * 
     * 
     * Features need a notes section to describe all code
     * 
     * Should probably document every function in this site
     *
     * 
     * 
     * Photo album for life events on site? Can begin documenting and organzing papers for football games, wedding invites, sorted by date
     * 
     * Wedding page - should publish this
     * 
     * 
     * Allow handicap calcluation to take *course rating* into account
     * 
     * Don't need to migrate to mongo just yet, prioritize late and continue to use Excel upload for the time being
     * 
     * 
     * 
     * *****Try to post this year as post of blog - add day/month/year to each item posted, including swing videos/swing thought journal entries/youtube content ****
     * section to post youtube videos/screen recordings/my swing videos of each shot type/other content
     * 
     * 
     * 
     * 
     * 
     * 
     * Modularize codebase better, move functions and helpers into different files
     * 
     * Begin using consts more
     * 
     * 
     * 
     * Feature Ideas
     * Scorecard Data "Key"
     *      -Scorecard needs to be it's own component
     *      -In scorecard, beside "Expand" link, show toggle for expansion (stop using) expand collapse verbiage (might not have to be it's own component yet, could just display toggle with onclick?)
     *      -Toggle named "Show Key": scorecard details and course info
     *      -Can show FIR = Fairway in Regulation
     *      -Style: Small font, add beside chips shown for each score (Eagle = yellow, etc.)
     *      -While editing this feature, edit scoring background color key to background color behind score Name <Badge title="Eagle" backgroundColorYellow />
     *      -Style: display all keys in a flex flow row wrap space between container
     * 
     * 
     * 
     * 
     * 
     * Small style: handicap 20 round subsomponent?
     * ----- better divider to show "Handicap" Cutoff similar to the appearance of this row with divider? (Could make use of CSS :after if needed) ------
     * .map(rounds => (need to take index parameter "i" to show small divider subcomponent to show HDCP cutoff indication, which only shows when sorted by date) => ( return ) ) function that is used to display 
     * 
     * 
     * Chips/Badge beside each round
     *      Passed into mongo entry 
     *      For now split/regex on date cell
     *      CONDITIONS=[Rainy, ...
     *      More scorecard fields when entering on site and connected to Mongo: Who did you play with?
     *                  Entering name will begin to populate people you have already played with
     *                  Can view stat to see how well you play with each person
     *          Can find if there are other data points to add here
     *          
     *      Populate chip if certain conditions are true
     *          "Story" round - something interesting happened
     *          Eagle round/even par or better round - remove row indication?
     *          Migrate "HDCP" tag/badge in place of current indication
     * 
     *      
     *          
     * 
     *      Prepopulate a few "sample conditions" (or just call them "Round tags")
     *          Separate alllllll options for tags into sections:
     *                  Weather
     *                  Playing 
     *      (with feature to add conditions to each round) in excel cell row) course conditions) rain, 
     * 
     * 
     * 
     * Annual summary needs CONSTS file
     *      Each year, enter low HDCP number (2024: 0.2)
     *      Populate column for low GHIN and make this sortable by year (disokay new column when filter for annual summaries is shown)
     * 
     * 
     * 
     * 
     * Post site on reddit
     * putting revelation - Highlight that putter alignment was off? Take picture? seems to be fine, just has to do with grip/forward press positioning
     * Link to previous post
     * Footage of stroke from different angles?
     * 
     * 
     * 
     * 
     * 
     * Golf Expenses spreadsheet or table? add "category" for club/round/punch pass/range pass/range balls - ability to add more categories on UI
     * 
     * 
     * 
     * Annual summary to include swing videos of each shot type?
     *      Shot types: putter, driver, PW, 7i, 2i, 4W
     *      Chips: flop, chip (stock), pitch (low), BR
     *      Show visualization of shot shape
     * 
     * 
     * 
     * Diagram of swing videos with shot shapes
     *      Left of screen shows different shot shapes
     *          Default left side to "stock" swing on right of screen
     *          Swing thoughts - should this derive "WIP" from swing notes - currently contained in to notes on phone but could be updated on site
     *          Inspiration section is optional - could be self taught, from book, video
     *      When one is clicked, updates right of screen to show the associated video
     *      Timestamp a date to each swing video (Last Updated: Nov. 2024)
     *      Footage of stroke from different angles?
     * 
     * 
     * Document ALL swing reps in excel somewhere - ideally in site
     *      Ability to enter practice routine, number of shots, date, swing thoughts
     *      Can overlap with trends (Show beside rounds) in scoring eventually
     * 
     * 
     * Future: integrate with AI to ask what I should be working on given 10GIR 8FIR each round, what should I work on
     *      Autogenerate pre-defined template prompt to be copied - query an AI directly?
     * 
     * 
     *          
     * Questionairre of things end of each year
     * 
     * Golf - specific part: "How did you do this year, what did you work on, what was the best swing thought/insp item from this year, what can be improved, goals for next year"
     * 
     * 
     *  
     * 
     * Compile all notes into this file going forward.
     * 
     * 
     
     * 
     */

    //  Configurable state
    const [activePage, setActivePage] = useState('Golf Rounds');
    const [yearFilter, setYearFilter] = useState(2024); // Can set default year here

    // Internal state
    const [displayUploadButton, setDisplayUploadButton] = useState(true);
    const [filters, setFilters] = useState(["2024"]);
    // const [courseTours, setCourseTours] = useState(["South Suburban"]);
    const [courseTours, setCourseTours] = useState(["South Suburban"]);
    const [isLoading, setIsLoading] = useState(false);
    const [allRounds, setAllRounds] = useState([]);
    const [displayedRounds, setDisplayedRounds] = useState([]);
    const [courseInfo, setCourseInfo] = useState({});
    const [roundYears, setRoundYears] = useState([]);
    const [tableSort, setTableSort] = useState({ method: 'formattedDate', order: 'descending' });
    const [activeRounds, setActiveRounds] = useState([]);
    const [activeScorecardEntry, setActiveScorecardEntry] = useState("");
    const [scorecardEntryData, setScorecardEntryData] = useState({});
    const [expandScorecard, setExpandScorecard] = useState(true);
    const [toggleCourseInfo, setToggleCourseInfo] = useState(false);
    const [expandSingleHoleMetric, setExpandSingleHoleMetric] = useState({ hole: "", expanded: false });
    const [puttingData, setPuttingData] = useState({});
    const [displayHelpModal, setDisplayHelpModal] = useState(false);
    const [handicap, setHandicap] = useState(0);
    const [handicapMetrics, setHandicapMetrics] = useState({});
    const [displayedRoundsToggle, setDisplayedRoundsToggle] = useState(false);
    const [displayLegacyFilterWarning, setDisplayLegacyFilterWarning] = useState(false);
    const [handicapCutoffRoundKey, setHandicapCutoffRoundKey] = useState("");
    const [filterableCourses, setFilterableCourses] = useState(['South Suburban']);

    const [displayedNumberOfRounds, setDisplayedNumberOfRounds] = useState(0);
    const [displayedHoles, setDisplayedHoles] = useState(0);
    const [displayedCourses, setDisplayedCourses] = useState(0);
    const [displayedScoringAverage, setDisplayedScoringAverage] = useState("");
    const [displayedPutts, setDisplayedPutts] = useState(0);
    const [displayedF, setDisplayedF] = useState("");
    const [displayedG, setDisplayedG] = useState("");
    const [displayedFPM, setDisplayedFPM] = useState("");
    const [displayedBirdies, setDisplayedBirdies] = useState("");
    const [displayedBogeyPlus, setDisplayedBogeyPlus] = useState("");

    const pinnedCourse = "South Suburban"; // Course pinned atop scorecard entry
    const includePartialRounds = true; // Displays partial rounds

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
        const allPutts = [];

        (displayedRoundsToggle ? displayedRounds : allRounds).forEach(round => {
            if (!round.scrambleRound) {
                for (let i = 1; i <= 18; i++) {
                    if (round[`hole${i}`] && round[`hole${i}`].putts) {
                        // if (round[`hole${i}`].dth === 6 && round[`hole${i}`].putts == 3) console.log("blah", round.key, round.date, i)
                        allPutts.push({
                            round: round.key,
                            date: round.date,
                            putts: round[`hole${i}`].putts,
                            dth: round[`hole${i}`].dth,
                            fpm: round[`hole${i}`].puttLength,
                            gir: round[`hole${i}`].gir,
                            scoreToPar: round[`hole${i}`].score - courseInfo[round.courseKey][`hole${i}`].par // score
                        });
                        // if (round[`hole${i}`].puttLength >= 30) console.log("Displaying a hole with 30+ foot putt, hole:", i, "round", round)
                    }
                }
            }
        })

        setPuttingData(allPutts)
    }, [displayedRoundsToggle]);

    // Summary round for displayed rounds, function handles fetching new values when filters/date field is edited
    const handleUpdateSummaryRow = (summaryRowRounds) => {
        let uniqueCourses = [];
        let tempDisplayedHoles = 0;
        let tempDisplayedScoringTally = 0;
        let tempDisplayedPutts = 0;
        let tempDisplayed3Putts = 0;
        let tempDisplayedF = 0;
        let tempPar3 = 0
        let tempDisplayedG = 0;
        let tempDisplayedFPM = 0;
        let tempDisplayedBirdies = 0;
        let tempDisplayedBogeyPlus = 0;

        for (let round of summaryRowRounds) {
            if (!uniqueCourses.includes(round.courseKey)) uniqueCourses.push(round.courseKey);
            tempDisplayedHoles = tempDisplayedHoles + round.numHoles;
            tempDisplayedScoringTally = tempDisplayedScoringTally + round.scoreToPar;
            tempDisplayedPutts = tempDisplayedPutts + round.putts;
            tempDisplayed3Putts = tempDisplayed3Putts + round.num3Putts;
            tempDisplayedF = tempDisplayedF + round.fairways.f;
            tempPar3 = tempPar3 + round.fairways.na;
            tempDisplayedG = tempDisplayedG + round.greens.g;
            tempDisplayedFPM = tempDisplayedFPM + round.fpmTotal;
            tempDisplayedBirdies = tempDisplayedBirdies + round.numBirdies;
            tempDisplayedBogeyPlus = tempDisplayedBogeyPlus + round.numBogeyPlus;
        }

        setDisplayedNumberOfRounds(summaryRowRounds.length);
        setDisplayedHoles(tempDisplayedHoles);
        setDisplayedCourses(uniqueCourses.length);
        setDisplayedScoringAverage(`${(72 + tempDisplayedScoringTally / tempDisplayedHoles * 18).toFixed(2)} (+${(tempDisplayedScoringTally / tempDisplayedHoles * 18).toFixed(2)})`);
        setDisplayedPutts(`${(tempDisplayedPutts / tempDisplayedHoles * 18).toFixed(2)} (${(tempDisplayed3Putts / tempDisplayedHoles * 18).toFixed(2)}, ${(tempDisplayed3Putts / tempDisplayedHoles * 100).toFixed(0)}%)`);
        setDisplayedF(`${(tempDisplayedF / (tempDisplayedHoles - tempPar3) * 14).toFixed(2)} (${(tempDisplayedF / (tempDisplayedHoles - tempPar3) * 100).toFixed(0)}%)`);
        setDisplayedG(`${(tempDisplayedG / tempDisplayedHoles * 18).toFixed(2)} (${(tempDisplayedG / tempDisplayedHoles * 100).toFixed(0)}%)`);
        setDisplayedFPM((tempDisplayedFPM / tempDisplayedHoles * 18).toFixed(2));
        setDisplayedBirdies(`${(tempDisplayedBirdies / tempDisplayedHoles * 18).toFixed(2)} (${(tempDisplayedBirdies / tempDisplayedHoles * 100).toFixed(0)}%)`);
        setDisplayedBogeyPlus(`${(tempDisplayedBogeyPlus / tempDisplayedHoles * 18).toFixed(2)} (${(tempDisplayedBogeyPlus / tempDisplayedHoles * 100).toFixed(0)}%)`);
    }

    useEffect(() => {
        let tempRounds = allRounds;
        if (tempRounds.length > 0) {
            if (filters.includes(mostRecentRoundYear) && !filters.includes("All Years")) {
                tempRounds = tempRounds.filter(round => round.date && round.date.substring(round.date.length - 1, round.date.length) === mostRecentRoundYear.substring(mostRecentRoundYear.length - 1, mostRecentRoundYear));
            } else {
                setYearFilter("");
            }
            if (filters.includes("Full Rounds")) {
                tempRounds = tempRounds.filter(round => round.fullFront9 && round.fullBack9 && !round.key.includes("Par3") && !round.boozeRound);
            }
            if (filters.includes("Handicap Rounds")) {
                tempRounds = tempRounds.filter(round => round.handicapRound);
            }
            
            // filterableCourses set in state, if filter is applied add to list below
            const coursesFiltered = [];
            for (let course of filterableCourses) {
                if (filters.includes(course)) coursesFiltered.push(course);
            }
            // If course filter is applied and current round course is not in that list then hide it
            if (coursesFiltered.length > 0) tempRounds = tempRounds.filter(round => coursesFiltered.includes(round.course));

            setDisplayedRounds(tempRounds);
        }
        handleUpdateSummaryRow(tempRounds); // Triggers update to summary row
    }, [filters]);

    const handleSetYearFilter = (filter) => {
        const emptyYear = filter === '';
        const filterYear = parseInt(filter);
        if (filterYear >= 2022 && filterYear < 2100 && filterYear !== yearFilter) {
            let newRounds = [];
            for (let round of allRounds) {
                const yearSuffix = round.date.split("/")[2]
                if ((2000 + parseInt(yearSuffix)) == filterYear) {
                    newRounds.push(round);
                }
            }
            if (filters.includes(mostRecentRoundYear) && !filters.includes("All Years")) {
                newRounds = newRounds.filter(round => round.date && round.date.substring(round.date.length - 1, round.date.length) === mostRecentRoundYear.substring(mostRecentRoundYear.length - 1, mostRecentRoundYear));
            }
            if (filters.includes("Full Rounds")) {
                newRounds = newRounds.filter(round => round.fullFront9 && round.fullBack9 && !round.key.includes("Par3") && !round.boozeRound);
            }
            if (filters.includes("Handicap Rounds")) {
                newRounds = newRounds.filter(round => round.handicapRound);
            }
            setDisplayedRounds(newRounds);
            handleUpdateSummaryRow(newRounds);
        } else {
            if (filter === "") {
                setDisplayedRounds(allRounds);
                setDisplayedRounds(allRounds); // Triggers update to summary row
            }
        }
        
        setYearFilter(emptyYear ? "" : filterYear);
    }
    
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
                            console.log("Course name does not match worksheet:", course.displayName);
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
                                    legacyRound: row[1].split("\n").includes("Legacy"),
                                    boozeRound: row[1].split("\n").includes("Booze"),
                                    numHoles: 0,
                                    // Round metrics
                                    f9Putts: 0,
                                    b9Putts: 0,
                                    putts: 0,
                                    num3Putts: 0,
                                    f9PuttTotal: 0,
                                    b9PuttTotal: 0,
                                    out: 0,
                                    in: 0,
                                    total: 0,
                                    // DTG, FPM, DTH for averages
                                    // F9
                                    dtgF9Total: 0,
                                    dthF9Total: 0,
                                    fpmF9Total: 0,
                                    // B9
                                    dtgB9Total: 0,
                                    dthB9Total: 0,
                                    fpmB9Total: 0,
                                    // Total
                                    dtgTotal: 0,
                                    dthTotal: 0,
                                    fpmTotal: 0,
                                    // Averages
                                    dtgF9Average: 0,
                                    dtgB9Average: 0,
                                    dtgTotalAverage: 0,
                                    dthF9Average: 0,
                                    dthB9Average: 0,
                                    dthTotalAverage: 0,
                                    fpmF9Average: 0,
                                    fpmB9Average: 0,
                                    fpmTotalAverage: 0,
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
                                        
                                        if (score === 1) roundData.aceRound = true;
                                        if (courseData[course.courseKey][`hole${hole}`].par >= score + 2) roundData.numEagles++; // Eagle
                                        if (courseData[course.courseKey][`hole${hole}`].par === score + 1) roundData.numBirdies++; // Birdie
                                        if (courseData[course.courseKey][`hole${hole}`].par === score) roundData.numPar++; // Par
                                        if (courseData[course.courseKey][`hole${hole}`].par === score - 1) roundData.numBogey++; // Bogey
                                        if (courseData[course.courseKey][`hole${hole}`].par <= score - 2) roundData.numBogeyPlus++; // Bogey Plus

                                        roundData.coursePar = roundData.coursePar + courseData[course.courseKey][`hole${hole}`].par;
                                        roundData.scoreToPar =  roundData.scoreToPar + score - courseData[course.courseKey][`hole${hole}`].par

                                        // Debugging
                                        // console.log("typeof", parseInt(row[columnCount + 5].split(", ")[0]))
                                        // console.log("row[columnCount + 5]",row[columnCount + 5])

                                        if (!roundData.legacyRound && typeof row[columnCount + 5] !== "number" && typeof parseInt(row[columnCount + 5].split(", ")[0]) !== "number") {
                                            console.log(`INVALID FPM VALUE FOR ROUND ${roundData.key} HOLE ${hole}`, parseInt(row[columnCount + 5].split(", ")[0]),"")
                                        }
                                        
                                        // Single hole data
                                        roundData[`hole${hole}`] = {
                                            score: score,
                                            putts: roundData.legacyRound && !row[columnCount + 1] ? null : row[columnCount + 1],
                                            fir: roundData.legacyRound && !row[columnCount + 2] ? null : row[columnCount + 2],
                                            gir: roundData.legacyRound && !row[columnCount + 3] ? null : row[columnCount + 3],
                                            dtg: roundData.legacyRound && !row[columnCount + 4] ? null : row[columnCount + 4],
                                            // dtg: typeof row[columnCount + 4] === "number" ? row[columnCount + 4] : parseInt(row[columnCount + 4].split(", ")[1]), // Uses number closest to green
                                            dth: roundData.legacyRound && !row[columnCount + 5] ? null : typeof row[columnCount + 5] === "number" ? row[columnCount + 5] : parseInt(row[columnCount + 5].split(", ")[0]),
                                            // dth: row[columnCount + 5],
                                            puttLength: roundData.legacyRound && !row[columnCount + 5] ? null : typeof row[columnCount + 5] === "number" ? row[columnCount + 5] : parseInt(row[columnCount + 5].split(", ")[row[columnCount + 5].split(", ").length - 1]),
                                            notes: roundData.legacyRound && !row[columnCount + 6] ? null : row[columnCount + 6] ? row[columnCount + 6] : ""
                                        }

                                        if ((roundData.sequence > 8 || row[columnCount + 1] === 0 || row[columnCount + 1] === 1) && !roundData.scrambleRound && !roundData.leagueRound && !(roundData.legacyRound && !row[columnCount + 1])) {
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
                                            // DTG, FPM, DTH totals for averages (DTG uses number closest to green)
                                            roundData.dtgF9Total = roundData.dtgF9Total + (typeof row[columnCount + 4] === "number" ? row[columnCount + 4] : parseInt(row[columnCount + 4].split(", ")[1]));
                                            roundData.dtgTotal = roundData.dtgTotal + (typeof row[columnCount + 4] === "number" ? row[columnCount + 4] : parseInt(row[columnCount + 4].split(", ")[1]));
                                            roundData.fpmF9Total = roundData.fpmF9Total + (typeof row[columnCount + 5] === "number" ? row[columnCount + 5] : parseInt(row[columnCount + 5].split(", ")[row[columnCount + 5].split(", ").length - 1]));
                                            roundData.fpmTotal = roundData.fpmTotal + (typeof row[columnCount + 5] === "number" ? row[columnCount + 5] : parseInt(row[columnCount + 5].split(", ")[row[columnCount + 5].split(", ").length - 1]));
                                            roundData.dthF9Total = roundData.dthF9Total + (typeof row[columnCount + 5] === "number" ? row[columnCount + 5] : parseInt(row[columnCount + 5].split(", ")[0]));
                                            roundData.dthTotal = roundData.dthTotal + (typeof row[columnCount + 5] === "number" ? row[columnCount + 5] : parseInt(row[columnCount + 5].split(", ")[0]));
                                        } else {
                                            roundData.in = roundData.in + score;
                                            roundData.b9Putts = roundData.b9Putts + row[columnCount + 1];
                                            // DTG, FPM, DTH totals for averages (DTG uses number closest to green)
                                            roundData.dtgB9Total = roundData.dtgB9Total + (typeof row[columnCount + 4] === "number" ? row[columnCount + 4] : parseInt(row[columnCount + 4].split(", ")[1]));
                                            roundData.dtgTotal = roundData.dtgTotal + (typeof row[columnCount + 4] === "number" ? row[columnCount + 4] : parseInt(row[columnCount + 4].split(", ")[1]));
                                            roundData.fpmB9Total = roundData.fpmB9Total + (typeof row[columnCount + 5] === "number" ? row[columnCount + 5] : parseInt(row[columnCount + 5].split(", ")[row[columnCount + 5].split(", ").length - 1]));
                                            roundData.fpmTotal = roundData.fpmTotal + (typeof row[columnCount + 5] === "number" ? row[columnCount + 5] : parseInt(row[columnCount + 5].split(", ")[row[columnCount + 5].split(", ").length - 1]));
                                            roundData.dthB9Total = roundData.dthB9Total + (typeof row[columnCount + 5] === "number" ? row[columnCount + 5] : parseInt(row[columnCount + 5].split(", ")[0]));
                                            roundData.dthTotal = roundData.dthTotal + (typeof row[columnCount + 5] === "number" ? row[columnCount + 5] : parseInt(row[columnCount + 5].split(", ")[0]));
                                        }
                                        roundData.total = roundData.total + score;
                                        roundData.putts = roundData.putts + row[columnCount + 1];
                                        if (!(roundData.legacyRound && !row[columnCount + 1]) && row[columnCount + 1] > 2) roundData.num3Putts = roundData.num3Putts + 1;

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

                                roundData.dtgF9Average = roundData.fullFront9 ? parseInt(roundData.dtgF9Total / 9).toFixed(0) : "-";
                                roundData.dtgB9Average = roundData.fullBack9 ? parseInt(roundData.dtgB9Total / 9).toFixed(0) : "-";
                                roundData.dtgTotalAverage = roundData.fullFront9 && roundData.fullBack9 ? parseInt((roundData.dtgTotal / 18).toFixed(0)) : "-";
                                roundData.dthF9Average = roundData.fullFront9 ? parseInt(roundData.dthF9Total / 9).toFixed(0) : "-";
                                roundData.dthB9Average = roundData.fullBack9 ? parseInt(roundData.dthB9Total / 9).toFixed(0) : "-";
                                roundData.dthTotalAverage = roundData.fullFront9 && roundData.fullBack9 ? parseInt((roundData.dthTotal / 18).toFixed(0)) : "-";
                                roundData.fpmF9Average = roundData.fullFront9 ? parseInt(roundData.fpmF9Total / 9).toFixed(0) : "-";
                                roundData.fpmB9Average = roundData.fullBack9 ? parseInt(roundData.fpmB9Total / 9).toFixed(0) : "-";
                                roundData.fpmTotalAverage = roundData.fullFront9 && roundData.fullBack9 ? parseInt((roundData.fpmTotal / 18).toFixed(0)) : "-";

                                if (roundData.fullFront9 && roundData.fullBack9 && roundData.scoreToPar < 0) {
                                    roundData.aceRound = true;
                                }

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
                                // console.log("roundData.formattedDate",roundData.formattedDate)
                                // console.log("roundData.formattedDate[0]",roundData.formattedDate[0])
                                // setRoundYears(roundYears.push(roundData.formattedDate))

                                // console.log("roundData",roundData)

                                if (!roundData.legacyRound) {
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
                                }

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

                    // Set handicap
                    const roundsSortedByDate = allRounds.sort(function(a,b) { return ( a.sequence < b.sequence ? 1 : a.sequence > b.sequence ? -1 : 0); });
                    let handicapRounds = [];
                    let tempRoundYears = [];
                    for (let round of roundsSortedByDate) {
                        let splitRoundDate = round.date.split("/");
                        let roundYear = splitRoundDate[2];
                        if (!tempRoundYears.includes(roundYear)) tempRoundYears.push(roundYear);
                        if (handicapRounds.length < 20 && round.fullFront9 && round.fullBack9 && !round.key.includes("Par3") && !round.boozeRound) handicapRounds.push(round);
                    }
                    setRoundYears(tempRoundYears);

                    // Set bottom border for last eligible handicap round
                    const handicapRoundsSortedBySequence = handicapRounds.sort(function(a,b) { return ( a.sequence < b.sequence ? 1 : a.sequence > b.sequence ? -1 : 0); });
                    setHandicapCutoffRoundKey(handicapRoundsSortedBySequence[19].key);
                    
                    const sortedHandicapRounds = handicapRounds.sort(function(a,b) { return ( a.scoreToPar > b.scoreToPar ? 1 : a.scoreToPar < b.scoreToPar ? -1 : 0); });
                    let countedHandicapRounds = sortedHandicapRounds.slice(0,8);
                    
                    // Handicap rounds summary
                    let handicapRoundMetics = {
                        handicapRoundScoresToPar: 0,
                        handicapRoundPutts: 0,
                        handicapRoundFirs: 0,
                        handicapRoundGirs: 0,
                        handicapRoundFpm: 0,
                        handicapRoundBirdies: 0,
                        handicapRoundBogeyPlus: 0
                    }
                    
                    let handicapScoreToParTotal = 0;
                    let handicapRoundKeys = [];
                    for (let round of countedHandicapRounds) {
                        if (!round.legacyRound) {
                            handicapScoreToParTotal += round.scoreToPar;
                            handicapRoundKeys.push(round.key);
    
                            // Handicap round data
                            handicapRoundMetics.handicapRoundScoresToPar = handicapRoundMetics.handicapRoundScoresToPar + round.scoreToPar;
                            handicapRoundMetics.handicapRoundPutts = handicapRoundMetics.handicapRoundPutts + round.putts;
                            handicapRoundMetics.handicapRoundFirs = handicapRoundMetics.handicapRoundFirs + round.fairways.f;
                            handicapRoundMetics.handicapRoundGirs = handicapRoundMetics.handicapRoundGirs + (round.greens.g + round.greens.gur);
                            handicapRoundMetics.handicapRoundFpm = handicapRoundMetics.handicapRoundFpm + round.puttLengthTotal;
                            handicapRoundMetics.handicapRoundBirdies = handicapRoundMetics.handicapRoundBirdies + (round.numBirdies + round.numEagles);
                            handicapRoundMetics.handicapRoundBogeyPlus = handicapRoundMetics.handicapRoundBogeyPlus + round.numBogeyPlus;
                        }
                    }
                    setHandicap((handicapScoreToParTotal / 8).toFixed(1));
                    setHandicapMetrics(handicapRoundMetics);

                    for (let round of allRounds) {
                        if (handicapRoundKeys.includes(round.key)) round.handicapRound = true;
                    }

                    setCourseInfo(courseData);
                    setPuttingData(allPutts);
                    
                    // console.log("allRounds",allRounds)
                    setAllRounds(allRounds);
                    setDisplayedRounds(displayedRounds);
                    handleUpdateSummaryRow(displayedRounds)
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

    const handleSetActiveRounds = (roundKey) => {
        let tempActiveRounds = [...activeRounds];
        if (activeRounds.includes(roundKey)) {
            let activeRoundsWithoutCurrentlyDeselectedRound = [];
            tempActiveRounds.forEach((round) => {
                if (round !== roundKey) activeRoundsWithoutCurrentlyDeselectedRound.push(round);
            })
            tempActiveRounds = activeRoundsWithoutCurrentlyDeselectedRound;
        } else {
            tempActiveRounds.push(roundKey);
        }
        setActiveRounds(tempActiveRounds);
    }

    const changeSortMethod = (method) => {
        // console.log("method",method)
        let newSortOrder = 'ascending';
        let sortedRounds;
        // Only non-legacy rounds should be displayed in table - when this occurs, display warning that rounds are filtered
        const sortableRounds = displayedRounds.filter(round => !round.legacyRound);
        if (displayedRounds.length !== sortableRounds.length) {
            setDisplayLegacyFilterWarning(true);
        }

        if (method === tableSort.method) { // When sort method is already being used, switch to other order
            newSortOrder = tableSort.order === 'ascending' ? 'descending' : 'ascending';
            if (tableSort.order === 'ascending') { // Sort rounds descending
                if (method === 'fir') {
                    sortedRounds = sortableRounds.sort(function(a,b) {return (a.fairways.f < b.fairways.f) ? 1 : ((b.fairways.f < a.fairways.f) ? -1 : 0);} );
                } else if (method === 'gir') {
                    sortedRounds = sortableRounds.sort(function(a,b) {return (a.greens.g + a.greens.gur < b.greens.g + b.greens.gur) ? 1 : ((b.greens.g + b.greens.gur < a.greens.g + a.greens.gur) ? -1 : 0);} );
                } else {
                    sortedRounds = sortableRounds.sort(function(a,b) {return (a[method] < b[method]) ? 1 : ((b[method] < a[method]) ? -1 : 0);} );
                }
            } else { // Sort rounds ascending
                if (method === 'fir') {
                    sortedRounds = sortableRounds.sort(function(a,b) {return (a.fairways.f > b.fairways.f) ? 1 : ((b.fairways.f > a.fairways.f) ? -1 : 0);} );
                } else if (method === 'gir') {
                    sortedRounds = sortableRounds.sort(function(a,b) {return (a.greens.g + a.greens.gur > b.greens.g + b.greens.gur) ? 1 : ((b.greens.g + b.greens.gur > a.greens.g + a.greens.gur) ? -1 : 0);} );
                } else {
                    sortedRounds = sortableRounds.sort(function(a,b) {return (a[method] > b[method]) ? 1 : ((b[method] > a[method]) ? -1 : 0);} );
                }
            }
        } else { // New sort method selected
            if (method === 'fir') {
                sortedRounds = sortableRounds.sort(function(a,b) {return (a.fairways.f > b.fairways.f) ? 1 : ((b.fairways.f > a.fairways.f) ? -1 : 0);} );
            } else if (method === 'gir') {
                sortedRounds = sortableRounds.sort(function(a,b) {return (a.greens.g + a.greens.gur > b.greens.g + b.greens.gur) ? 1 : ((b.greens.g + b.greens.gur > a.greens.g + a.greens.gur) ? -1 : 0);} );
            } else {
                sortedRounds = sortableRounds.sort(function(a,b) {return (a[method] > b[method]) ? 1 : ((b[method] > a[method]) ? -1 : 0);} );
            }
        }
        setTableSort({ method, order: newSortOrder });
        // console.log("sortedRounds",sortedRounds)
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

    const updateScorecardEntryData = (value, field, hole) => {
        setScorecardEntryData({
            ...scorecardEntryData,
            [`${hole}`]: {
                ...scorecardEntryData[hole],
                [`${field}`]: value
            }
        });
    }

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

    const filterOptions = [];
    // const years
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

    const mostRecentRoundDate = allRounds.length > 0 ? roundsSortedByDate[0].date.split("/") : [];
    const mostRecentRoundYear = `20${mostRecentRoundDate[2]}`;
    if (mostRecentRoundDate !== []) filterOptions.push(mostRecentRoundYear);
    filterOptions.push(
        'All Years',
        'Full Rounds',
        'Handicap Rounds',
        'Annual Summaries'
    );
    // filterableCourses contains list of courses that appear in filter
    filterableCourses.forEach(filterableCourse => {
        filterOptions.push(filterableCourse);
    })
    
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

    let getRoundTableClassName = (round, i) => {
        let className = "hideTableBottomBorderLastChildCell";
        if (round.aceRound) className += " backgroundColorEagleRow";
        if (activeRounds.includes(round.key)) className += " hideBorderBottom";
        if ((tableSort.method === 'formattedDate' && tableSort.order === 'descending') && (displayedRounds.length > 20) && (round.key === handicapCutoffRoundKey)) className += " handicapCutoffRoundBottomBorder";
        return className;
    }

    // Sand count for displayed rounds
    let totalHoleCount = 0;
    let sandCount = 0;
    let sandOnePuttCount = 0;
    let sandBirdieCount = 0;
    let sandParCount = 0;
    let sandBogeyCount = 0;
    let sandDoubleCount = 0;
    let sandTripleCount = 0;
    let sandQuadCount = 0;
    if (displayedRounds.length > 0) {
        for (let round of displayedRounds) {
            // if (!round.boozeRound) {
                for (let hole = 1; hole <= 18; hole++) {
                    if (round[`hole${hole}`]) totalHoleCount++;
                    if (round[`hole${hole}`] && round[`hole${hole}`].notes) {
                        // console.log("round[`hole${hole}`]",round[`hole${hole}`])
                        const holeNotes = round[`hole${hole}`].notes
                        // console.log("holeNotes",round.key, round.date, hole, holeNotes)
                        if (holeNotes && holeNotes.includes("S")) {
                            sandCount++;
                            if (round[`hole${hole}`].putts == 1) {
                                sandOnePuttCount++
                            }
                            if (courseInfo[round.courseKey][`hole${hole}`].par === (round[`hole${hole}`].score + 1)) sandBirdieCount++;
                            if (courseInfo[round.courseKey][`hole${hole}`].par === (round[`hole${hole}`].score)) sandParCount++;
                            if (courseInfo[round.courseKey][`hole${hole}`].par === (round[`hole${hole}`].score - 1)) sandBogeyCount++;
                            if (courseInfo[round.courseKey][`hole${hole}`].par === (round[`hole${hole}`].score - 2)) sandDoubleCount++;
                            if (courseInfo[round.courseKey][`hole${hole}`].par === (round[`hole${hole}`].score - 3)) sandTripleCount++;
                            if (courseInfo[round.courseKey][`hole${hole}`].par === (round[`hole${hole}`].score - 4)) sandQuadCount++;
                        }
                    }
                }
            // }
        }

        // console.log(
        //     "\nsandCount",sandCount, "\n",
        //     "sandOnePuttCount", sandOnePuttCount, "\n\n",
        //     "sandParCount", sandParCount, "\n",
        //     "sandBogeyCount", sandBogeyCount, "\n",
        //     "sandDoubleCount", sandDoubleCount, "\n",
        //     "sandTripleCount", sandTripleCount, "\n",
        //     "sandQuadCount", sandQuadCount, "\n\n",
        // )
        // console.log("totalHoleCount",totalHoleCount, `${Math.floor(totalHoleCount/18)} rounds of 18 and ${Math.round((totalHoleCount/18 - Math.floor(totalHoleCount/18)) * 18)} holes`)

    }

    const getAnnualSummaryRows = (year) => {
        let tempSummaryRounds = [];
        allRounds.forEach((round) => {
            const roundYear = round.date.split("/");
            if (round.fullFront9 && round.fullBack9 && !round.boozeRound && !round.scrambleRound && (roundYear[2] === year)) tempSummaryRounds.push(round);
        });

        let uniqueCourses = [];
        let tempDisplayedHoles = 0;
        let tempDisplayedScoringTally = 0;
        let tempDisplayedPutts = 0;
        let tempDisplayed3Putts = 0;
        let tempDisplayedF = 0;
        let tempPar3 = 0
        let tempDisplayedG = 0;
        let tempDisplayedFPM = 0;
        let tempDisplayedBirdies = 0;
        let tempDisplayedBogeyPlus = 0;

        for (let round of tempSummaryRounds) {
            if (!uniqueCourses.includes(round.courseKey)) uniqueCourses.push(round.courseKey);
            tempDisplayedHoles = tempDisplayedHoles + round.numHoles;
            tempDisplayedScoringTally = tempDisplayedScoringTally + round.scoreToPar;
            tempDisplayedPutts = tempDisplayedPutts + round.putts;
            tempDisplayed3Putts = tempDisplayed3Putts + round.num3Putts;
            tempDisplayedF = tempDisplayedF + round.fairways.f;
            tempPar3 = tempPar3 + round.fairways.na;
            tempDisplayedG = tempDisplayedG + round.greens.g;
            tempDisplayedFPM = tempDisplayedFPM + round.fpmTotal;
            tempDisplayedBirdies = tempDisplayedBirdies + round.numBirdies;
            tempDisplayedBogeyPlus = tempDisplayedBogeyPlus + round.numBogeyPlus;
        }

        return (
            <TableRow>
                <TableCell key={1}>20{year} Rounds: <b>{tempSummaryRounds.length}</b></TableCell>
                <TableCell key={2}>Total Holes: <b>{tempDisplayedHoles}</b></TableCell>
                <TableCell key={3}>Total Courses: <b>{uniqueCourses.length}</b></TableCell>
                <TableCell key={4}><b>{`${(72 + tempDisplayedScoringTally / tempDisplayedHoles * 18).toFixed(2)} (+${(tempDisplayedScoringTally / tempDisplayedHoles * 18).toFixed(2)})`}</b></TableCell>
                <TableCell key={5}><b>{`${(tempDisplayedPutts / tempDisplayedHoles * 18).toFixed(2)} (${(tempDisplayed3Putts / tempDisplayedHoles * 18).toFixed(2)}, ${(tempDisplayed3Putts / tempDisplayedHoles * 100).toFixed(0)}%)`}</b></TableCell>
                <TableCell key={6}><b>{`${(tempDisplayedF / (tempDisplayedHoles - tempPar3) * 14).toFixed(2)} (${(tempDisplayedF / (tempDisplayedHoles - tempPar3) * 100).toFixed(0)}%)`}</b></TableCell>
                <TableCell key={7}><b>{`${(tempDisplayedG / tempDisplayedHoles * 18).toFixed(2)} (${(tempDisplayedG / tempDisplayedHoles * 100).toFixed(0)}%)`}</b></TableCell>
                <TableCell key={8}><b>{(tempDisplayedFPM / tempDisplayedHoles * 18).toFixed(2)}</b></TableCell>
                <TableCell key={9}><b>{`${(tempDisplayedBirdies / tempDisplayedHoles * 18).toFixed(2)} (${(tempDisplayedBirdies / tempDisplayedHoles * 100).toFixed(0)}%)`}</b></TableCell>
                <TableCell key={10}><b>{`${(tempDisplayedBogeyPlus / tempDisplayedHoles * 18).toFixed(2)} (${(tempDisplayedBogeyPlus / tempDisplayedHoles * 100).toFixed(0)}%)`}</b></TableCell>
            </TableRow>
        );
    }

    {!displayUploadButton &&
        <div className="pageLinks">
            {[
                "Golf Rounds",
                // "Anderson Glen",
                // "Gilead Highlands",
                "Metrics",
                "Course Tour",
                "Historic Rounds",
                "Historic Metrics",
                "Enter Scorecard"
            ].map((page, i) => {
                return <a key={i} onClick={() => setActivePage(page)} className={`marginRightExtraLarge pageLinkFont${page === activePage ? " active" : ""}`}>{page}</a>
            })}
        </div>
    }

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
                        "Historic Rounds",
                        "Historic Metrics",
                        "Enter Scorecard"
                    ].map((page, i) => {
                        return <a key={i} onClick={() => setActivePage(page)} className={`marginRightExtraLarge pageLinkFont${page === activePage ? " active" : ""}`}>{page}</a>
                    })}
                </div>
            }

            {displayLegacyFilterWarning &&
                <Paper className="flexRow justifySpaceBetween alignCenter marginTopMedium" style={{width: "75vw", padding: "8px 12px"}}>
                    <div className="flexColumn">
                        <b className="blackFont">Warning</b>
                        <span className="blackFont">Legacy rounds have been omitted from filtered results</span>
                    </div>
                    <Close className="blackFont" onClick={() => setDisplayLegacyFilterWarning(false)}/>
                </Paper>
            }

            {/* Default Golf Rounds view */}
            {displayDefaultPage && activePage === "Golf Rounds" &&
                <Table style={{ maxWidth: "80vw" }} className="golfTable">
                    <TableHead className="stickyGolfTableHeader">
                        <TableRow className="flexRow">
                            <TableCell key={1} className="distribute10 altActionFont"><TextField id="standard-basic" value={yearFilter} label="Year" variant="standard" onChange={(e) => { 
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
                            <TableCell key={4} className={`distribute10 altActionFont ${tableSort.method === "scoreToPar" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("scoreToPar")}><h3>Score</h3></TableCell>
                            <TableCell key={5} className={`distribute10 altActionFont ${tableSort.method === "putts" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("putts")}><h3>Putts</h3></TableCell>
                            <TableCell key={6} className={`distribute10 altActionFont ${tableSort.method === "fir" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("fir")}><h3>FIR</h3></TableCell>
                            <TableCell key={7} className={`distribute10 altActionFont ${tableSort.method === "gir" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("gir")}><h3>GIR</h3></TableCell>
                            {/* Meaningless data */}
                            {/* <TableCell key={8} className={`distribute10 altActionFont ${tableSort.method === "dtgTotalAverage" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("dtgTotalAverage")}><h3>Av. DTG</h3></TableCell>
                            <TableCell key={9} className={`distribute10 altActionFont ${tableSort.method === "dthTotalAverage" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("dthTotalAverage")}><h3>Av. DTH</h3></TableCell> */}
                            <TableCell key={10} className={`distribute10 altActionFont ${tableSort.method === "puttLengthTotal" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("puttLengthTotal")}><h3>FPM</h3></TableCell>
                            <TableCell key={11} className={`distribute10 altActionFont ${tableSort.method === "numBirdies" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("numBirdies")}><h3>Birdies</h3></TableCell>
                            <TableCell key={12} className={`distribute10 altActionFont ${tableSort.method === "numBogeyPlus" ? tableSort.order === "ascending" ? "displayDownArrowAfter" : "displayUpArrowAfter" : ""}`} onClick={() => changeSortMethod("numBogeyPlus")}><h3>Bogey+</h3></TableCell>
                        </TableRow>
                    </TableHead>
                    {filters.includes('Annual Summaries') ?
                        <TableBody>
                            {roundYears.map((year, i) => {
                                return getAnnualSummaryRows(year)
                            })}
                        </TableBody>
                        :
                        <TableBody>
                            {/* Summary Row */}
                            <TableRow className="summaryRowBoxShadow">
                                <TableCell key={1}>Total Rounds: <b>{displayedNumberOfRounds}</b></TableCell>
                                <TableCell key={2}>Total Holes: <b>{displayedHoles}</b></TableCell>
                                <TableCell key={3}>Total Courses: <b>{displayedCourses}</b></TableCell>
                                <TableCell key={4}><b>{displayedScoringAverage}</b></TableCell>
                                <TableCell key={5}><b>{displayedPutts}</b></TableCell>
                                <TableCell key={6}><b>{displayedF}</b></TableCell>
                                <TableCell key={7}><b>{displayedG}</b></TableCell>
                                <TableCell key={8}><b>{displayedFPM}</b></TableCell>
                                <TableCell key={9}><b>{displayedBirdies}</b></TableCell>
                                <TableCell key={10}><b>{displayedBogeyPlus}</b></TableCell>
                            </TableRow>
                            {activePage === "Golf Rounds" && displayedRounds.map((round, i) => {
                                let displayRound = (activePage === "Golf Rounds" || activePage === round.course) && (includePartialRounds || (!round.partialFront9 && !round.partialBack9)) && !round.scrambleRound && !round.additionalHoles;
                                
                                // // filterableCourses set in state, if filter is applied add to list below
                                // const coursesFiltered = [];
                                // for (let course of filterableCourses) {
                                //     if (filters.includes(course)) coursesFiltered.push(course);
                                // }
                                // // If course filter is applied and current round course is not in that list then hide it
                                // if (coursesFiltered.length > 0 && !coursesFiltered.includes(round.course)) displayRound = false;
                                
                                if (displayRound) {
                                    const roundTotalDisplay = round.scrambleRound ? `${round.total}*` : ((round.fullFront9 || round.fullBack9) && !(round.partialFront9 || round.partialBack9)) ? round.total : null;
                                    return (
                                        <>
                                            <TableRow className={getRoundTableClassName(round, i)} key={i}>
                                                <TableCell key={`${round.key}1`}><span className={round.aceRound ? "blackFont" : ""} onClick={() => handleSetActiveRounds(round.key)}>{activeRounds.includes(round.key) ? "Collapse" : "Scorecard"}</span></TableCell>

                                                <TableCell key={`${round.key}2`}>{round.date}</TableCell>
                                                <TableCell key={`${round.key}3`}>
                                                    {/* Popup to display some course info? */}
                                                    {/* <Popover
                                                        trigger={<span> */}
                                                            {round.course}
                                                            {/* </span>}
                                                    > */}
                                                        {/* Course Info */}
                                                    {/* </Popover> */}
                                                </TableCell>
                                                <TableCell key={`${round.key}4`}><span className={round.handicapRound ? " handicapScoreBackground" : ""}>{roundTotalDisplay}<small className={`marginBottomSmall${roundTotalDisplay ? " paddingLeftExtraSmall" : null}`}>({round.scoreToPar > 0 ? `+${round.scoreToPar}` : round.scoreToPar < 0 ? round.scoreToPar : "E"}{!roundTotalDisplay && ` THRU ${round.numHoles}`})</small></span></TableCell>
                                                <TableCell key={`${round.key}5`}>{round.putts || <small>-</small>}{(round.putts && round.num3Putts > 0) && <small className="marginLeftSmall">({round.num3Putts})</small>}</TableCell>
                                                <TableCell key={`${round.key}6`}>{round.fairways && round.fairways.f ? round.fairways.f : <small>-</small>}</TableCell>
                                                <TableCell key={`${round.key}7`}>{round.greens ? round.greens.g + round.greens.gur : <small>-</small>}</TableCell>
                                                {/* Meaningless data */}
                                                {/* <TableCell key={`${round.key}8`}>{round.dtgTotalAverage || <small>-</small>}</TableCell>
                                                <TableCell key={`${round.key}9`}>{round.dthTotalAverage || <small>-</small>}</TableCell> */}
                                                <TableCell key={`${round.key}10`}>{round.puttLengthTotal || <small>-</small>}</TableCell>
                                                <TableCell key={`${round.key}11`}>{round.numBirdies + round.numEagles}{round.numEagles > 0 ? "*" : null}</TableCell>
                                                <TableCell key={`${round.key}12`}>{round.numBogeyPlus || <small>-</small>}</TableCell>
                                            </TableRow>
                                            {/* Scorecard */}
                                            {/* {(displaySubtable && activeRound.course === round.course && activeRound.key === round.key) &&  */}
                                            {(activeRounds.includes(round.key)) && 
                                                <TableRow key={`subTable${i}`} className="hideTableBottomBorderLastChildCell">
                                                    <TableCell colSpan={"10"}>
                                                        {createScorecard(courseInfo, round, expandScorecard, setExpandScorecard, toggleCourseInfo, setToggleCourseInfo)}
                                                    </TableCell>
                                                </TableRow>
                                            }
                                        </>
                                    )
                                } else return null;
                            })}
                            {filters.includes("Handicap Rounds") && <TableRow className="hideTableBottomBorderChildCell">
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                                <TableCell>Handicap: <b>{handicap}</b></TableCell>
                                <TableCell>{(handicapMetrics.handicapRoundScoresToPar / 8).toFixed(2)}</TableCell>
                                <TableCell>{(handicapMetrics.handicapRoundPutts / 8).toFixed(2)}</TableCell>
                                <TableCell>{(handicapMetrics.handicapRoundFirs / 8).toFixed(2)}</TableCell>
                                <TableCell>{(handicapMetrics.handicapRoundGirs / 8).toFixed(2)}</TableCell>
                                <TableCell>{(handicapMetrics.handicapRoundFpm / 8).toFixed(2)}</TableCell>
                                <TableCell>{(handicapMetrics.handicapRoundBirdies / 8).toFixed(2)}</TableCell>
                                <TableCell>{(handicapMetrics.handicapRoundBogeyPlus / 8).toFixed(2)}</TableCell>
                            </TableRow>}
                        </TableBody>
                    }
                </Table>
            }
            {/* {filters.includes("Handicap Rounds") && <div className="width100Percent marginTopMedium justifyCenter">
                    <span>Handicap: <b>{handicap}</b></span>
                </div>
            } */}

            {/* Metrics */}
            {!displayUploadButton && activePage === "Metrics" &&
                <div className="marginTopMedium" style={{ maxWidth: "90vw", marginLeft: "5vw" }}>
                    {/* {calculateStats(courseInfo, allRounds, puttingData)} */}
                    {calculateStats(courseInfo, allRounds, puttingData, displayedRounds, handicap, displayedRoundsToggle, setDisplayedRoundsToggle)}
                </div>        
            }

            {/* Course Tour */}
            {!displayUploadButton && activePage === "Course Tour" &&
                <div className="flexColumn justifyCenter marginTopMedium">
                    {/* Each hole summary, best score */}
                    {courseSummary(courseInfo, allRounds, expandSingleHoleMetric, handleSetExpandSingleHoleMetric, courseTours, displayedRounds, displayedRoundsToggle, setDisplayedRoundsToggle)}
                    {/* YouTube tour */}
                    {/* <iframe className="marginAuto" width="800" height="450" title="Course Tour" src="https://www.youtube.com/embed/8QFAY7l-TAg?autoplay=0&mute=1" /> */}
                </div>
            }

            {!displayUploadButton && activePage === "Enter Scorecard" &&
                <>
                    <div className="marginTopMassive marginBottomMedium">
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
                                {courses.sort((a,b) => ((a.displayName === pinnedCourse) ? -1 : (b.displayName === pinnedCourse) ? 1 : (a.displayName > b.displayName) ? 1 : -1)).map(course => { return (<MenuItem className="width100Percent flexRow justifySpaceBetween" value={course.courseKey} key={course.courseKey}><span>{course.displayName}</span>{course.displayName === pinnedCourse && activeScorecardEntry !== course.courseKey && <PushPin />}</MenuItem>)})}
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
            >
                <div className="backgroundColorWhite flexColumn" style={{ margin: "25vh auto", width: "50%", padding: "16px", borderRadius: "8px" }}>
                    <div className="flexRow justifySpaceBetween width100Percent">
                        <h2 className="marginBottomMedium strongFont">Scorecard help</h2>
                        <Close className="actionFont blackFont marginRightMedium" onClick={() => setDisplayHelpModal(false)} />
                    </div>
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

            {/* Displayed Rounds Filter */}
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

            {/* Course Tour Course Filter */}
            {!displayUploadButton && activePage === "Course Tour" &&
                <div className="filterDropdownContainer width100Percent justifyCenter">
                    <FormControl sx={{ m: 1, width: 300 }} variant="filled">
                        <InputLabel id="demo-multiple-checkbox-label">Select Course</InputLabel>
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

            {/* 
                * Historic Rounds 
                * Summary of all years prior to keeping detailed metrics
            */}
            {!displayUploadButton && activePage === "Historic Rounds" &&
                <div className="">
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <h1>hello</h1>
                        </CardContent>
                    </Card>
                </div>
            }

            {/* 
                * Historic Metrics 
                * Metrics of all years prior to keeping detailed metrics
            */}
            {!displayUploadButton && activePage === "Historic Metrics" &&
                <div className="flexFlowRowWrap justifyCenter width80Percent marginTopMassive">
                    <div className="flexColumn justifyCenter setWidth200px marginTopMedium"><b className="width100Percent justifyCenter">Total Hole Count:</b> <p className="justifyCenter width100Percent">{totalHoleCount}</p></div>
                    <div className="flexColumn justifyCenter setWidth200px marginTopMedium"><b className="width100Percent justifyCenter">Total Sand Shots:</b> <p className="justifyCenter width100Percent">{sandCount}</p></div>
                    <div className="flexColumn justifyCenter setWidth200px marginTopMedium"><b className="width100Percent justifyCenter">Total Sand One Putts:</b> <p className="justifyCenter width100Percent">{sandOnePuttCount}</p></div>
                    <div className="flexColumn justifyCenter setWidth200px marginTopMedium"><b className="width100Percent justifyCenter">Total Sand Birdies:</b> <p className="justifyCenter width100Percent">{sandBirdieCount}</p></div>
                    <div className="flexColumn justifyCenter setWidth200px marginTopMedium"><b className="width100Percent justifyCenter">Total Sand Pars:</b> <p className="justifyCenter width100Percent">{sandDoubleCount}</p></div>
                    <div className="flexColumn justifyCenter setWidth200px marginTopMedium"><b className="width100Percent justifyCenter">Total Sand Bogeys:</b> <p className="justifyCenter width100Percent">{sandTripleCount}</p></div>
                    <div className="flexColumn justifyCenter setWidth200px marginTopMedium"><b className="width100Percent justifyCenter">Total Sand Doubles:</b> <p className="justifyCenter width100Percent">{sandDoubleCount}</p></div>
                    <div className="flexColumn justifyCenter setWidth200px marginTopMedium"><b className="width100Percent justifyCenter">Total Sand Triples:</b> <p className="justifyCenter width100Percent">{sandTripleCount}</p></div>
                    <div className="flexColumn justifyCenter setWidth200px marginTopMedium"><b className="width100Percent justifyCenter">Total Sand Quads:</b> <p className="justifyCenter width100Percent">{sandQuadCount}</p></div>
                </div>
            }

            {/* Helper Text */}
            {displayUploadButton &&
                <>
                    {/* <span className="massiveFont marginTopMassive paddingTopMassive">There is currently no data to display. Please upload stats below.</span> */}
                    <span className="massiveFont marginTopMassive paddingTopMassive">Please upload stats below.</span>
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